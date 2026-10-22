import { useRef, useState, type ReactNode, type FormEvent } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import {
  ArrowLeft, ArrowRight, BadgeCheck, Check,
  CheckCircle2, ChevronRight, CircleHelp, ClipboardCheck, Coins,
  Cpu, FileCheck2, History, Layers3, ListChecks, PackageSearch, Plus,
  RotateCcw, ShieldCheck, Sparkles, X, XCircle,
} from 'lucide-react';
import {
  Link, Route, Switch, useLocation, Router as WouterRouter,
} from 'wouter';

import {
  decisionReasons,
  formatPrice,
  getCategoryById,
  getCategoryByLabel,
  getFeatureOptions,
  getProductCategory,
  getProductCategoryLabel,
  getProductSuggestions,
  getSampleOffers,
  isEligible,
  isSatisfied,
  type Offer,
  type Request,
} from '@/lib/purchasing';
import { PRODUCT_CATEGORIES } from '@/lib/catalog';

type ActivityEntry = { id: number; title: string; detail: string; time: string; kind: 'request' | 'check' | 'reject' | 'select' | 'approve' };

const queryClient = new QueryClient();
const initialRequest: Request = {
  productRequest: '',
  categoryId: null,
  budget: 0,
  currency: 'NEAR',
  requiredFeatures: [],
};

function formatTime() {
  return new Intl.DateTimeFormat('en', { hour: 'numeric', minute: '2-digit' }).format(new Date());
}

function App() {
  const [request, setRequest] = useState<Request>(initialRequest);
  const [activity, setActivity] = useState<ActivityEntry[]>([]);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [location, setLocation] = useLocation();
  const activeOffers = getSampleOffers(request.categoryId);
  const activitySequence = useRef(100);
  const addActivity = (entry: Omit<ActivityEntry, 'id' | 'time'>) => {
    activitySequence.current += 1;
    setActivity((items) => [{ ...entry, id: activitySequence.current, time: formatTime() }, ...items]);
  };
  const submitRequest = (nextRequest: Request) => {
    setRequest(nextRequest);
    setApproved(false);
    setSelectedOfferId(null);
    setActivity([]);
    addActivity({ title: 'Request submitted', detail: `${nextRequest.productRequest} · ${getProductCategoryLabel(nextRequest.categoryId) ?? 'no matching demo category'} · budget ${formatPrice(nextRequest.budget)} ${nextRequest.currency} · ${nextRequest.requiredFeatures.length} required ${nextRequest.requiredFeatures.length === 1 ? 'feature' : 'features'}.`, kind: 'request' });
    const nextOffers = getSampleOffers(nextRequest.categoryId);
    if (nextOffers.length === 0) {
      addActivity({
        title: 'No sample offers available',
        detail: `No matching demo category was selected for “${nextRequest.productRequest}.” No unrelated offers were compared.`,
        kind: 'check',
      });
    }
    nextOffers.forEach((offer) => {
      const reasons = decisionReasons(offer, nextRequest);
      addActivity({
        title: reasons.length ? `${offer.name} rejected by rules` : `${offer.name} passed rule check`,
        detail: reasons.length ? reasons.join(' ') : `Price is within budget and all ${nextRequest.requiredFeatures.length} required features are present.`,
        kind: reasons.length ? 'reject' : 'check',
      });
    });
    setLocation('/offers');
  };
  const selectOffer = (offer: Offer) => {
    const currentOffer = activeOffers.find((item) => item.id === offer.id);
    if (!currentOffer || !isEligible(currentOffer, request)) return;
    setSelectedOfferId(currentOffer.id);
    setApproved(false);
    addActivity({ title: 'Offer selected for review', detail: `${currentOffer.name} at ${formatPrice(currentOffer.price)} ${currentOffer.currency} passed all required checks and was opened for your review.`, kind: 'select' });
    setLocation('/review');
  };
  const approve = () => {
    const offer = activeOffers.find((item) => item.id === selectedOfferId);
    if (!offer || !isEligible(offer, request)) return;
    setApproved(true);
    addActivity({ title: 'Demo approval recorded', detail: `${offer.name} at ${formatPrice(offer.price)} ${offer.currency} was approved locally. No wallet or blockchain transaction was used.`, kind: 'approve' });
  };
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <RoutedErrorBoundary>
            <AppShell location={location}>
              <Switch>
                <Route path="/" component={() => <Dashboard request={request} activity={activity} offers={activeOffers} />} />
                <Route path="/dashboard" component={() => <Dashboard request={request} activity={activity} offers={activeOffers} />} />
                <Route path="/request" component={() => <RequestPage request={request} onSubmit={submitRequest} />} />
                <Route path="/offers" component={() => <OffersPage request={request} offers={activeOffers} selectedOfferId={selectedOfferId} onSelect={selectOffer} />} />
                <Route path="/review" component={() => <ReviewPage request={request} selectedOffer={activeOffers.find((offer) => offer.id === selectedOfferId)} approved={approved} onApprove={approve} onCompare={() => setLocation('/offers')} />} />
                <Route path="/activity" component={() => <ActivityPage activity={activity} />} />
                <Route component={NotFound} />
              </Switch>
            </AppShell>
          </RoutedErrorBoundary>
          <Toaster />
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: Layers3 },
  { href: '/request', label: 'New request', icon: Plus },
  { href: '/offers', label: 'Compare offers', icon: PackageSearch },
  { href: '/activity', label: 'Activity log', icon: History },
];

function AppShell({ children, location }: { children: ReactNode; location: string }) {
  const title = location === '/' || location === '/dashboard' ? 'Overview' : location.slice(1).replace(/^\w/, (c) => c.toUpperCase());
  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Main navigation">
        <Link href="/dashboard" className="brand" data-testid="link-brand-home"><span className="brand-mark"><Cpu size={17} strokeWidth={2.3} /></span>buywise</Link>
        <div className="nav-label">Workspace</div>
        <nav className="nav-list">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === '/dashboard' ? location === '/' || location === '/dashboard' : location === href || (href === '/offers' && location === '/review');
            return <Link key={href} href={href} className={`nav-link${active ? ' active' : ''}`} aria-current={active ? 'page' : undefined} data-testid={`link-nav-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon />{label}</Link>;
          })}
        </nav>
        <div className="side-bottom">
          <div className="nav-label">Local demo</div>
          <div className="demo-note"><strong><i className="demo-dot" />Sample decision workspace</strong><p>Offers and approvals are illustrative. Nothing connects to a wallet or executes on-chain.</p></div>
        </div>
      </aside>
      <main className="workspace">
        <header className="topbar">
          <div className="crumb"><span>BuyWise</span><ChevronRight size={13} /><b>{title}</b></div>
          <div className="top-status"><i className="demo-dot" /><span>LOCAL DEMO</span></div>
        </header>
        <div className="content">{children}</div>
      </main>
      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === '/dashboard' ? location === '/' || location === '/dashboard' : location === href || (href === '/offers' && location === '/review');
          const shortLabel = label === 'New request' ? 'Request' : label === 'Compare offers' ? 'Offers' : label === 'Activity log' ? 'Activity' : 'Home';
          return <Link href={href} key={href} className={active ? 'active' : ''} aria-label={label} aria-current={active ? 'page' : undefined} data-testid={`mobile-nav-${shortLabel.toLowerCase()}`}><Icon />{shortLabel}</Link>;
        })}
      </nav>
    </div>
  );
}

function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description: string; action?: ReactNode }) {
  return <div className="page-heading"><div><div className="eyebrow">{eyebrow}</div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

function Dashboard({ request, activity, offers }: { request: Request; activity: ActivityEntry[]; offers: Offer[] }) {
  const hasRequest = Boolean(request.productRequest);
  const bestEligible = offers.filter((offer) => isEligible(offer, request)).sort((a, b) => a.price - b.price)[0];
  const spent = bestEligible?.price ?? 0;
  const ringOffset = bestEligible && request.budget > 0 ? 420 - Math.min(420, (spent / request.budget) * 420) : 420;
  const newest = activity.slice(0, 4);
  return <>
    <PageHeading eyebrow="Your buying workspace" title="Decisions, made clearer." description="One considered choice at a time. Compare against the things that matter to you." action={<Link href="/request" className="button" data-testid="button-new-request"><Plus size={15} />Create a request</Link>} />
    <div className="stat-grid">
      <section className="panel stat-card primary-stat" data-testid="summary-budget"><div className="stat-label"><Coins />Current request budget</div><div className="stat-value">{hasRequest ? formatPrice(request.budget) : '—'} <small>{hasRequest ? request.currency : ''}</small></div><div className="stat-foot">{hasRequest ? `For ${request.productRequest.toLowerCase()}` : 'Create a request to set a budget'}</div></section>
      <section className="panel stat-card" data-testid="summary-requirements"><div className="stat-label"><ListChecks />Required features</div><div className="stat-value">{hasRequest ? request.requiredFeatures.length : 0} <small>criteria</small></div><div className="stat-foot">{hasRequest ? 'Every one must be present' : 'Set must-haves for your request'}</div></section>
      <section className="panel stat-card" data-testid="summary-eligible"><div className="stat-label"><ShieldCheck />Eligible sample offers</div><div className="stat-value">{offers.filter((offer) => isEligible(offer, request)).length} <small>of {offers.length}</small></div><div className="stat-foot">{offers.length ? 'Price and feature rules applied' : 'No sample offers for this category'}</div></section>
    </div>
    <div className="summary-row">
      <section className="panel">
        <div className="panel-head"><h2>Recent decisions</h2><Link href="/activity" className="button ghost" style={{ minHeight: 31, padding: '0 10px', fontSize: 10 }} data-testid="link-all-activity">Full activity <ArrowRight size={13} /></Link></div>
        <div className="activity-list">{newest.length ? newest.map((entry) => <ActivityRow key={entry.id} entry={entry} />) : <div className="dashboard-activity-empty">Your request decisions will appear here after you submit a comparison.</div>}</div>
      </section>
      <section className="panel">
        <div className="panel-head"><h2>Budget at a glance</h2><span>{request.currency}</span></div>
        <div className="budget-visual">
          <div className="budget-ring"><svg viewBox="0 0 160 160" aria-label="Budget usage illustration"><circle className="track" cx="80" cy="80" r="67" /><circle className="value" cx="80" cy="80" r="67" style={{ strokeDashoffset: ringOffset }} /></svg><div className="ring-label"><strong>{bestEligible ? formatPrice(spent) : '—'}</strong><span>{bestEligible ? 'best fit' : 'no match'}</span></div></div>
          <div className="budget-caption"><span>{bestEligible ? 'Lowest eligible offer' : 'Eligible offers'}</span><b>{bestEligible ? `${formatPrice(spent)} ${bestEligible.currency}` : 'None yet'}</b></div>
          <div className="budget-caption" style={{ marginTop: 9 }}><span>Available headroom</span><b>{bestEligible ? `${formatPrice(Math.max(0, request.budget - spent))} ${request.currency}` : '—'}</b></div>
        </div>
      </section>
    </div>
    <div style={{ marginTop: 18 }} className="panel">
      <div className="panel-head"><h2>Current request</h2><Link href="/request" className="button ghost" style={{ minHeight: 31, padding: '0 10px', fontSize: 10 }} data-testid="link-edit-request">Edit request <ArrowRight size={13} /></Link></div>
      <div style={{ padding: '19px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 17 }}>
        {hasRequest ? <><div><div style={{ color: '#e2e0e8', fontSize: 13, fontWeight: 700 }}>{request.productRequest}</div><div className="muted" style={{ fontSize: 10, marginTop: 6 }}>{getProductCategoryLabel(request.categoryId) ?? 'No matching demo category'} · simulated request · maximum {formatPrice(request.budget)} {request.currency}</div></div>
          <div className="feature-chips">{request.requiredFeatures.map((feature) => <span className="feature-chip selected" key={feature} style={{ cursor: 'default' }}><Check size={11} />{feature}</span>)}</div></> :
          <div><div style={{ color: '#e2e0e8', fontSize: 13, fontWeight: 700 }}>No active request</div><div className="muted" style={{ fontSize: 10, marginTop: 6 }}>Start with any supported electronics category.</div></div>}
      </div>
    </div>
  </>;
}

function ActivityRow({ entry }: { entry: ActivityEntry }) {
  const Icon = entry.kind === 'request' ? FileCheck2 : entry.kind === 'reject' ? XCircle : entry.kind === 'approve' ? BadgeCheck : entry.kind === 'select' ? ClipboardCheck : CheckCircle2;
  return <div className="activity-item" data-testid={`activity-row-${entry.id}`}><span className="activity-icon"><Icon /></span><div className="activity-copy">{entry.title}<small>{entry.detail}</small></div><span className="activity-time">{entry.time}</span></div>;
}

function RequestPage({ request, onSubmit }: { request: Request; onSubmit: (value: Request) => void }) {
  const [productRequest, setProductRequest] = useState(request.productRequest);
  const [categoryId, setCategoryId] = useState(request.categoryId);
  const [categorySearch, setCategorySearch] = useState(getCategoryById(request.categoryId)?.label ?? '');
  const [budget, setBudget] = useState(request.budget > 0 ? String(request.budget) : '');
  const [requiredFeatures, setRequiredFeatures] = useState<string[]>(request.requiredFeatures);
  const [customFeature, setCustomFeature] = useState('');
  const [error, setError] = useState('');
  const featureOptions = getFeatureOptions(categoryId);
  const productSuggestions = getProductSuggestions();
  const toggleFeature = (feature: string) => setRequiredFeatures((current) => current.includes(feature) ? current.filter((item) => item !== feature) : [...current, feature]);
  const changeProduct = (value: string) => {
    setProductRequest(value);
    const detected = getProductCategory(value);
    if (detected?.id !== categoryId) {
      setCategoryId(detected?.id ?? null);
      setCategorySearch(detected?.label ?? '');
      setRequiredFeatures([]);
    }
  };
  const changeCategory = (value: string) => {
    setCategorySearch(value);
    const selected = getCategoryByLabel(value);
    if (selected?.id !== categoryId) setRequiredFeatures([]);
    setCategoryId(selected?.id ?? null);
  };
  const addCustom = () => {
    const value = customFeature.trim();
    if (!value) return;
    if (!requiredFeatures.some((item) => item.toLowerCase() === value.toLowerCase())) setRequiredFeatures((current) => [...current, value]);
    setCustomFeature('');
  };
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const amount = Number(budget);
    if (!productRequest.trim()) { setError('Describe the product you are looking for.'); return; }
    if (!Number.isFinite(amount) || amount <= 0) { setError('Enter a budget greater than zero.'); return; }
    if (!requiredFeatures.length) { setError('Select at least one required feature.'); return; }
    setError('');
    onSubmit({ productRequest: productRequest.trim(), categoryId, budget: amount, currency: request.currency, requiredFeatures });
  };
  return <>
    <PageHeading eyebrow="Step 01 · Define what matters" title="Start with your criteria." description="Set the ceiling and the must-haves. Every offer will be checked against both." />
    <div className="stepper"><span className="step current"><i>1</i>Request</span><span className="step-rule" /><span className="step"><i>2</i>Compare</span><span className="step-rule" /><span className="step"><i>3</i>Review</span></div>
    <div className="form-layout">
      <form className="panel form-panel" onSubmit={submit}>
        <div className="field"><label htmlFor="product-request">What are you looking to buy?</label><input id="product-request" className="control" list="buywise-product-suggestions" autoComplete="off" value={productRequest} onChange={(event) => changeProduct(event.target.value)} placeholder="e.g. wireless earphones, smartwatch, or charger" data-testid="input-product-request" /><datalist id="buywise-product-suggestions">{productSuggestions.map((suggestion) => <option key={suggestion} value={suggestion} />)}</datalist><span className="hint">Suggestions cover common electronics; product names are matched to the closest demo category.</span></div>
        <div className="field"><label htmlFor="product-category">Search or choose a category</label><input id="product-category" className="control" type="search" list="buywise-category-options" autoComplete="off" value={categorySearch} onChange={(event) => changeCategory(event.target.value)} placeholder="Type a category, e.g. wearables" data-testid="input-product-category" /><datalist id="buywise-category-options">{PRODUCT_CATEGORIES.map((category) => <option key={category.id} value={category.label} />)}</datalist><span className="hint">{categoryId ? `Selected: ${getProductCategoryLabel(categoryId)} · ${getSampleOffers(categoryId).length} simulated offers` : productRequest.trim() ? 'No matching category. You can still submit; unrelated offers will not be shown.' : 'Choose a category to see matching sample offers and requirements.'}</span></div>
        <div className="field"><label htmlFor="budget-near">Maximum budget</label><div className="budget-input"><input id="budget-near" className="control" type="number" min="0.01" step="0.01" value={budget} onChange={(event) => setBudget(event.target.value)} placeholder="0.0" data-testid="input-budget-near" /><span>{request.currency}</span></div><span className="hint">An offer over this simulated {request.currency} budget is automatically ineligible.</span></div>
        <div className="field"><label>Required features <span style={{ color: '#777582', fontWeight: 500 }}>({requiredFeatures.length} selected)</span></label><span className="hint">Choose the features every eligible offer must include.</span>
          {featureOptions.length ? <div className="feature-chips" style={{ marginTop: 5 }}>{featureOptions.map((feature) => <button type="button" key={feature} className={`feature-chip${requiredFeatures.includes(feature) ? ' selected' : ''}`} aria-pressed={requiredFeatures.includes(feature)} onClick={() => toggleFeature(feature)} data-testid={`feature-toggle-${feature.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-')}`}>{requiredFeatures.includes(feature) && <Check />}{feature}</button>)}</div> : <p className="muted" style={{ fontSize: 10, margin: '8px 0 0' }}>Choose a category to see available features, specifications, and compatibility requirements.</p>}
          {requiredFeatures.filter((feature) => !featureOptions.includes(feature)).length > 0 && <div className="feature-chips" style={{ marginTop: 9 }}>{requiredFeatures.filter((feature) => !featureOptions.includes(feature)).map((feature) => <button type="button" className="feature-chip selected" key={feature} onClick={() => toggleFeature(feature)} aria-label={`Remove ${feature}`} data-testid={`feature-custom-${feature}`}><Check />{feature}<X size={11} /></button>)}</div>}
          <div className="custom-feature"><input aria-label="Add a custom required feature" className="control" value={customFeature} onChange={(event) => setCustomFeature(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') { event.preventDefault(); addCustom(); } }} placeholder="Add another requirement…" data-testid="input-custom-feature" /><button type="button" className="button secondary feature-add" onClick={addCustom} aria-label="Add feature" data-testid="button-add-feature"><Plus size={16} /></button></div>
        </div>
        {error && <p role="alert" style={{ color: '#e89c9a', fontSize: 11, margin: '-8px 0 16px' }} data-testid="status-request-error">{error}</p>}
        <button className="button" type="submit" style={{ width: '100%' }} data-testid="button-submit-request">Check sample offers <ArrowRight size={15} /></button>
      </form>
      <aside className="panel rule-card">
        <h3><ShieldCheck size={15} style={{ verticalAlign: 'middle', marginRight: 7, color: '#a990f3' }} />How BuyWise checks</h3>
          <div className="rule-line"><CheckCircle2 />Price must be at or below your {request.currency} budget.</div>
        <div className="rule-line"><CheckCircle2 />Every selected feature must be listed on the offer.</div>
        <div className="rule-line"><CircleHelp />Missing even one requirement means no approval.</div>
        <div className="callout"><strong>Strict by design.</strong> Eligible means the offer passes every rule, not just most of them. You decide what happens next.</div>
      </aside>
    </div>
  </>;
}

function OffersPage({ request, offers, selectedOfferId, onSelect }: { request: Request; offers: Offer[]; selectedOfferId: string | null; onSelect: (offer: Offer) => void }) {
  const hasRequest = Boolean(request.productRequest);
  const eligibleCount = offers.filter((offer) => isEligible(offer, request)).length;
  const [filter, setFilter] = useState<'all' | 'eligible' | 'rejected'>('all');
  const [sort, setSort] = useState<'eligibility' | 'price-low' | 'price-high'>('eligibility');
  const visibleOffers = offers
    .filter((offer) => filter === 'all' || (filter === 'eligible' ? isEligible(offer, request) : !isEligible(offer, request)))
    .sort((first, second) => {
      if (sort === 'eligibility' && isEligible(first, request) !== isEligible(second, request)) {
        return isEligible(first, request) ? -1 : 1;
      }
      return sort === 'price-high'
        ? second.price - first.price
        : first.price - second.price;
    });
  const specLabels = [...new Set(visibleOffers.flatMap((offer) => offer.specifications.map((specification) => specification.label)))];
  return <>
    <PageHeading eyebrow="Step 02 · Compare" title={offers.length ? 'Three sample options. Clear rules.' : hasRequest ? 'No matching demo offers.' : 'Start a product comparison.'} description={offers.length ? `For “${request.productRequest}” · ${getProductCategoryLabel(request.categoryId)} · capped at ${formatPrice(request.budget)} ${request.currency}.` : hasRequest ? `No demo category matched “${request.productRequest}.” Unrelated products are not shown.` : 'Submit a product request to compare relevant simulated offers against your criteria.'} action={<Link href="/request" className="button ghost" data-testid="button-edit-criteria"><ArrowLeft size={14} />{hasRequest ? 'Edit criteria' : 'Create a request'}</Link>} />
    <div className="stepper"><span className="step done"><i><Check size={11} /></i>Request</span><span className="step-rule" /><span className="step current"><i>2</i>Compare</span><span className="step-rule" /><span className="step"><i>3</i>Review</span></div>
    <div className="compare-top"><span>{offers.length ? `${offers.length} simulated offers in ${getProductCategoryLabel(request.categoryId)} · all decisions use your current request` : hasRequest ? 'No matching demo offers are available for this product category' : 'No active request yet'}</span><span className="comparison-req"><i className="dot" />{eligibleCount} eligible · {request.requiredFeatures.length} requirements</span></div>
    {offers.length > 0 ? <>
      <div className="offer-toolbar">
        <label>Filter <select className="control" aria-label="Filter sample offers" value={filter} onChange={(event) => setFilter(event.target.value as typeof filter)}><option value="all">All offers</option><option value="eligible">Eligible</option><option value="rejected">Not eligible</option></select></label>
        <label>Sort <select className="control" aria-label="Sort sample offers" value={sort} onChange={(event) => setSort(event.target.value as typeof sort)}><option value="eligibility">Eligibility first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option></select></label>
        <span className="toolbar-count">{visibleOffers.length} of {offers.length} shown</span>
      </div>
      {visibleOffers.length ? <div className="offers-grid">{visibleOffers.map((offer, index) => {
      const reasons = decisionReasons(offer, request);
      const eligible = reasons.length === 0;
      const selected = selectedOfferId === offer.id;
      return <article className={`panel offer-card${selected ? ' selected' : ''}`} key={offer.id} data-testid={`offer-card-${offer.id}`}>
        <div className="offer-label"><span className="offer-kicker">Simulated offer {String(index + 1).padStart(2, '0')}</span><span className={`status ${eligible ? 'good' : 'bad'}`}>{eligible ? <><CheckCircle2 size={11} />Eligible</> : <><XCircle size={11} />Not eligible</>}</span></div>
        <h3>{offer.name}</h3><p className="offer-description">{offer.description}</p>
        <div className="price-line"><span className="price">{formatPrice(offer.price)}</span><span className="price-unit">{offer.currency} · simulated price</span>{offer.currency === request.currency && offer.price <= request.budget && <span className="status good" style={{ marginLeft: 'auto' }}>{formatPrice(request.budget - offer.price)} under budget</span>}</div>
        <div className="offer-specs"><strong>Key specifications</strong>{offer.specifications.map((specification) => <div key={specification.label}><span>{specification.label}</span><b>{specification.value}</b></div>)}</div>
        {offer.compatibility.length > 0 && <div className="offer-compatibility"><strong>Compatibility</strong><span>{offer.compatibility.join(' · ')}</span></div>}
        <div className="offer-checks">{request.requiredFeatures.map((feature) => {
          const pass = isSatisfied(offer, feature);
          return <div className={`check-row ${pass ? 'pass' : 'fail'}`} key={feature}>{pass ? <CheckCircle2 /> : <XCircle />}<span>{feature}</span></div>;
        })}</div>
        {reasons.length > 0 ? <div className="reasons" role="status" data-testid={`offer-rejection-${offer.id}`}><strong>Rule check:</strong> {reasons.join(' ')}</div> : <div style={{ minHeight: 31 }} />}
        <button type="button" className={`button ${eligible ? selected ? 'secondary' : '' : 'secondary'}`} disabled={!eligible} onClick={() => onSelect(offer)} data-testid={`button-select-offer-${offer.id}`}>{eligible ? selected ? 'Review selected offer' : 'Select for review' : 'Does not qualify'}{eligible && <ArrowRight size={14} />}</button>
      </article>;
    })}</div> : <section className="panel empty-state" data-testid="empty-filter-results"><div className="empty-symbol"><PackageSearch size={19} /></div><h3>No offers match this filter</h3><p>Change the filter to see other simulated offers and their rule decisions.</p><button type="button" className="button secondary" onClick={() => setFilter('all')}>Show all offers</button></section>}
      {visibleOffers.length > 0 && <section className="panel specification-panel" data-testid="spec-comparison-panel">
        <div className="panel-head"><h2>Specification comparison</h2><span>{visibleOffers.length} OFFERS · SIMULATED DATA</span></div>
        <div className="spec-table-wrap"><table className="spec-table" data-testid="spec-comparison-table"><thead><tr><th scope="col">Specification</th>{visibleOffers.map((offer) => <th scope="col" key={offer.id}>{offer.name}</th>)}</tr></thead>
          <tbody>{specLabels.map((label) => <tr key={label}><th scope="row">{label}</th>{visibleOffers.map((offer) => <td key={offer.id}>{offer.specifications.find((specification) => specification.label === label)?.value ?? '—'}</td>)}</tr>)}
            <tr><th scope="row">Compatibility</th>{visibleOffers.map((offer) => <td key={offer.id}>{offer.compatibility.join(', ') || '—'}</td>)}</tr>
            <tr><th scope="row">Price</th>{visibleOffers.map((offer) => <td key={offer.id}>{formatPrice(offer.price)} {offer.currency} · simulated</td>)}</tr>
          </tbody></table></div>
      </section>}
    </> : <section className="panel empty-state" data-testid="empty-sample-offers"><div className="empty-symbol"><PackageSearch size={19} /></div><h3>{hasRequest ? 'No matching sample offers' : 'No active request yet'}</h3><p>{hasRequest ? `BuyWise has no simulated demo data for “${request.productRequest}” in the selected category. It did not compare unrelated products.` : 'Create a product request first. BuyWise will only show offers from the matching demo category.'}</p><p>{hasRequest ? 'Choose one of the searchable electronics categories or use a product suggestion.' : 'The catalog is sample-only and does not use live merchant listings.'}</p><Link href="/request" className="button" data-testid="button-empty-update-request">{hasRequest ? 'Update request' : 'Create a request'} <ArrowRight size={14} /></Link></section>}
    {offers.length > 0 && <div className="callout" style={{ marginTop: 18 }}><strong>Simulated data only.</strong> These invented sample offers are not real merchant listings or current market prices. No live marketplace, wallet, or network is connected.</div>}
  </>;
}

function ReviewPage({ request, selectedOffer, approved, onApprove, onCompare }: { request: Request; selectedOffer?: Offer; approved: boolean; onApprove: () => void; onCompare: () => void }) {
  if (!selectedOffer || !isEligible(selectedOffer, request)) return <><PageHeading eyebrow="Step 03 · Review" title="Nothing selected yet." description="Choose an eligible offer from the comparison before reviewing it." /><div className="panel empty-state"><div className="empty-symbol"><PackageSearch size={19} /></div><h3>Start with a qualifying offer</h3><p>An offer must fit the budget and include every required feature before it can be reviewed.</p><button className="button" onClick={onCompare} data-testid="button-back-to-offers">Return to comparison <ArrowRight size={14} /></button></div></>;
  return <>
    <PageHeading eyebrow="Step 03 · Your decision" title={approved ? 'Approval recorded.' : 'Take a closer look.'} description={approved ? 'Your local demo approval is now in the activity log.' : 'The offer passed your rules. Review the details, then approve or compare again.'} action={<button className="button ghost" onClick={onCompare} data-testid="button-return-comparison"><ArrowLeft size={14} />Return to comparison</button>} />
    <div className="stepper"><span className="step done"><i><Check size={11} /></i>Request</span><span className="step-rule" /><span className="step done"><i><Check size={11} /></i>Compare</span><span className="step-rule" /><span className={`step ${approved ? 'done' : 'current'}`}><i>{approved ? <Check size={11} /> : '3'}</i>Review</span></div>
    <div className="review-layout">
      <section className="panel review-main">
        <div className="offer-label"><span className="offer-kicker">Selected sample offer</span><span className="status good"><CheckCircle2 size={11} />All rules passed</span></div>
        <h2 style={{ color: '#eeedf3', font: "600 21px 'Space Grotesk',sans-serif", margin: '0' }}>{selectedOffer.name}</h2>
        <p style={{ color: '#9997a4', fontSize: 11, margin: '8px 0 0' }}>{selectedOffer.description}</p>
        <div className="review-price">{formatPrice(selectedOffer.price)} <span style={{ font: "500 12px 'DM Mono',monospace", color: '#9692a2' }}>{selectedOffer.currency} · simulated</span></div>
        <div className="review-meta">{formatPrice(request.budget - selectedOffer.price)} {request.currency} below your maximum · budget {formatPrice(request.budget)} {request.currency}</div>
        <hr className="review-divider" />
        <h3>Requirement check</h3>
        <div className="review-feature-list">{request.requiredFeatures.map((feature) => <div className="check-row pass" key={feature}><CheckCircle2 /><span>{feature}</span></div>)}</div>
        <hr className="review-divider" />
        <h3>Offer details</h3>
        <div className="feature-chips">{selectedOffer.features.map((feature) => <span className={`feature-chip${request.requiredFeatures.includes(feature) ? ' selected' : ''}`} style={{ cursor: 'default' }} key={feature}>{request.requiredFeatures.includes(feature) ? <Check /> : <Sparkles />}{feature}</span>)}</div>
        <div className="review-specs">{selectedOffer.specifications.map((specification) => <div key={specification.label}><span>{specification.label}</span><b>{specification.value}</b></div>)}</div>
        {selectedOffer.compatibility.length > 0 && <div className="review-compatibility"><strong>Compatibility</strong><span>{selectedOffer.compatibility.join(' · ')}</span></div>}
        <div className="review-actions">
          {!approved ? <button className="button cyan" onClick={onApprove} data-testid="button-approve-offer"><BadgeCheck size={15} />Approve in this demo</button> : <span className="status good" style={{ padding: '11px 13px' }} data-testid="status-approved"><CheckCircle2 size={13} />Approved locally</span>}
          <button className="button secondary" onClick={onCompare} data-testid="button-review-compare"><RotateCcw size={14} />Return to comparison</button>
        </div>
        {approved && <div role="status" className="toast-inline"><CheckCircle2 size={14} />Recorded locally. No funds moved and no transaction was submitted.</div>}
      </section>
      <aside className="panel decision-card">
        <h3><ClipboardCheck size={15} style={{ verticalAlign: 'middle', marginRight: 7, color: '#ad98f3' }} />What approval means</h3>
        <div className="decision-step"><span className="step-dot">1</span><span>You have reviewed a sample offer against your own criteria.</span></div>
        <div className="decision-step"><span className="step-dot">2</span><span>Approval records your choice in this browser session only.</span></div>
        <div className="decision-step"><span className="step-dot">3</span><span>No wallet connection, payment, or blockchain transaction takes place.</span></div>
        <div className="review-warning">This is a purchasing assistant concept—not a live listing or purchase. A future NEAR testnet adapter is intentionally not connected.</div>
      </aside>
    </div>
  </>;
}

function ActivityPage({ activity }: { activity: ActivityEntry[] }) {
  return <>
    <PageHeading eyebrow="Decision trail" title="Every choice, accounted for." description="A plain-language record of the checks and decisions made in this local demo." action={<Link href="/request" className="button" data-testid="button-activity-new-request"><Plus size={15} />New request</Link>} />
    <section className="panel">
      <div className="panel-head"><h2>Activity history</h2><span>{activity.length} EVENTS · LOCAL ONLY</span></div>
      {activity.length ? <div className="timeline" style={{ padding: '19px 24px 0' }}>{activity.map((entry) => {
        const Icon = entry.kind === 'request' ? FileCheck2 : entry.kind === 'reject' ? XCircle : entry.kind === 'approve' ? BadgeCheck : entry.kind === 'select' ? ClipboardCheck : CheckCircle2;
        return <article className="timeline-item" key={entry.id} data-testid={`timeline-entry-${entry.id}`}><span className="timeline-mark"><Icon /></span><div className="timeline-text"><strong>{entry.title}</strong><p>{entry.detail}</p><small>SESSION DEMO · {entry.time}</small></div><span className={`status ${entry.kind === 'reject' ? 'bad' : entry.kind === 'approve' ? 'good' : 'neutral'}`}>{entry.kind === 'reject' ? 'RULE REJECTION' : entry.kind === 'approve' ? 'LOCAL APPROVAL' : entry.kind === 'select' ? 'SELECTION' : entry.kind === 'request' ? 'SUBMISSION' : 'RULE CHECK'}</span></article>;
      })}</div> : <div className="empty-state"><div className="empty-symbol"><History size={19} /></div><h3>No decisions yet</h3><p>Submit a request to begin a clear, traceable comparison.</p><Link href="/request" className="button" data-testid="link-activity-create">Create a request <ArrowRight size={14} /></Link></div>}
    </section>
    <div className="callout" style={{ marginTop: 16 }}><strong>Built for explainability.</strong> Each rejection names the exact budget or feature rule that was not met. This history is sample session state and is not persisted or sent anywhere.</div>
  </>;
}

export default App;
