import React from 'react';
import ReactDOM from 'react-dom';
import { createRoot } from 'react-dom/client';
import { Icon } from '../components/Icon';
import { Avatar, StatusPill, PageHeader } from '../components/Shell';
import { LoanSummaryCards } from '../components/LoanSummaryCards';
import { ConditionsTab, AUSTab, PricingLockTab, ClosingTab, AuditTab } from './LoanWorkspaces';
import { FileReviewTab } from './FileReviewTab';
import { ApprovalTasks } from './ApprovalTasks';

function ServicesTab() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: 320, gap: 12, color: 'var(--text-tertiary)' }}>
      <Icon name="zap" size={32} strokeWidth={1.4}/>
      <span style={{ fontSize: 14, fontWeight: 500 }}>Services coming soon</span>
    </div>
  );
}
import { LoanEstimateView } from './LoanEstimateView';
import { URLA1003View, URLA1003_SECTIONS, SectionBorrowerInfo, BorrowerApplicationTabs, buildInitialAppsForLoan } from './URLA1003View';
import { CommsTab, LOAN_CONTACTS } from './CommsTab';
import { NowTabApplication } from './NowTabApplication';
import { NowTabProcessing } from './NowTabProcessing';
import { NowTabUnderwriting } from './NowTabUnderwriting';
import { NowTabClosing } from './NowTabClosing';
import { URLAView } from './URLAView';
import { LOANS } from '../data/loans';
import { DocumentsTool } from '../components/DocumentsTool';
import { IncomeTool } from '../components/IncomeTool';
import { useWorkflows } from '../workflows/WorkflowContext';
import { FIXED_SYSTEM_LINKS, PAGE_CONTENT_TAB, getPage } from '../workflows/workflowModel';
import { FormsView, FormDetailView } from './FormsLibrary';
import { formById } from '../data/imsForms';
// import { PreviewContextSwitcher } from './AdminWorkflows'; // preview-context switcher (removed for now)

// ─── Property intelligence data per loan ─────────────────────────────────────
const PROPERTY_INTEL = {
  'LN-2024-0234': {
    lat: 39.7392, lng: -104.9903,
    type: 'Single Family', yearBuilt: 1998, sqft: 2340, beds: 4, baths: 2.5,
    lotSqft: 7200, hoa: null,
    estimatedValue: 498000, listPrice: 500000, pricePerSqft: 213,
    daysOnMarket: 11,
    schoolRating: 8, schoolName: 'Montview Elementary',
    neighborhood: 'Park Hill', walkScore: 74, transitScore: 52,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'low', earthquakeRisk: 'low', hailRisk: 'moderate',
    marketTrend: '+4.2% YoY', medianNeighborhood: 510000,
    nearbyComps: [{ addr: '1836 Oak St', sold: '$491K', daysAgo: 18 }, { addr: '1855 Oak St', sold: '$509K', daysAgo: 31 }],
    insight: 'Value supports loan amount. Neighborhood trending up 4.2% YoY — strong collateral position.',
    insightTone: 'green',
  },
  'LN-2024-0245': {
    lat: 47.6062, lng: -122.3321,
    type: 'Condominium', yearBuilt: 2008, sqft: 1680, beds: 3, baths: 2,
    lotSqft: null, hoa: 485,
    estimatedValue: 695000, listPrice: 680000, pricePerSqft: 405,
    daysOnMarket: 6,
    schoolRating: 9, schoolName: 'Stevens Elementary',
    neighborhood: 'Capitol Hill', walkScore: 98, transitScore: 90,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'low', earthquakeRisk: 'moderate', hailRisk: 'low',
    marketTrend: '+6.1% YoY', medianNeighborhood: 720000,
    nearbyComps: [{ addr: '3141 Maple Ave #4B', sold: '$671K', daysAgo: 22 }, { addr: '3162 Maple Ave #2A', sold: '$688K', daysAgo: 14 }],
    insight: 'Earthquake zone — verify hazard insurance includes seismic coverage. HOA financials should be reviewed.',
    insightTone: 'amber',
  },
  'LN-2024-0211': {
    lat: 30.2672, lng: -97.7431,
    type: 'Single Family', yearBuilt: 2015, sqft: 3120, beds: 4, baths: 3,
    lotSqft: 8500, hoa: 150,
    estimatedValue: 792000, listPrice: 780000, pricePerSqft: 250,
    daysOnMarket: 8,
    schoolRating: 9, schoolName: 'Barton Hills Elementary',
    neighborhood: 'South Lamar', walkScore: 82, transitScore: 61,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'low', earthquakeRisk: 'low', hailRisk: 'high',
    marketTrend: '+2.8% YoY', medianNeighborhood: 805000,
    nearbyComps: [{ addr: '888 Cedar Ln', sold: '$785K', daysAgo: 9 }, { addr: '901 Cedar Ln', sold: '$771K', daysAgo: 27 }],
    insight: 'High hail risk area — confirm insurance binder includes full replacement cost coverage.',
    insightTone: 'amber',
  },
  'LN-2024-0189': {
    lat: 45.5051, lng: -122.6750,
    type: 'Single Family', yearBuilt: 1962, sqft: 1890, beds: 3, baths: 1.5,
    lotSqft: 5800, hoa: null,
    estimatedValue: 531000, listPrice: 530000, pricePerSqft: 281,
    daysOnMarket: 19,
    schoolRating: 7, schoolName: 'Boise-Eliot/Humboldt',
    neighborhood: 'Piedmont', walkScore: 69, transitScore: 55,
    floodZone: 'Zone AE', floodRisk: 'high',
    wildfireRisk: 'low', earthquakeRisk: 'moderate', hailRisk: 'low',
    marketTrend: '+1.4% YoY', medianNeighborhood: 545000,
    nearbyComps: [{ addr: '505 Birch Rd', sold: '$518K', daysAgo: 33 }, { addr: '522 Birch Rd', sold: '$527K', daysAgo: 41 }],
    insight: 'Zone AE flood — SFHA designation requires mandatory flood insurance. Verify NFIP policy obtained.',
    insightTone: 'red',
  },
  'LN-2024-0267': {
    lat: 43.6150, lng: -116.2023,
    type: 'Single Family', yearBuilt: 2003, sqft: 1640, beds: 3, baths: 2,
    lotSqft: 6200, hoa: null,
    estimatedValue: 352000, listPrice: 345000, pricePerSqft: 210,
    daysOnMarket: 4,
    schoolRating: 7, schoolName: 'Whittier Elementary',
    neighborhood: 'Southeast Boise', walkScore: 45, transitScore: 28,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'moderate', earthquakeRisk: 'low', hailRisk: 'low',
    marketTrend: '+5.3% YoY', medianNeighborhood: 368000,
    nearbyComps: [{ addr: '68 Pine Ridge', sold: '$341K', daysAgo: 12 }, { addr: '81 Pine Ridge', sold: '$358K', daysAgo: 28 }],
    insight: 'Appraisal should come in at or above list price given comps. Wildfire risk — check for state-mandated disclosure.',
    insightTone: 'green',
  },
  'LN-2024-0301': {
    lat: 33.4484, lng: -112.0740,
    type: 'Single Family', yearBuilt: 2001, sqft: 2080, beds: 4, baths: 2,
    lotSqft: 7800, hoa: 95,
    estimatedValue: 418000, listPrice: 412000, pricePerSqft: 198,
    daysOnMarket: 14,
    schoolRating: 6, schoolName: 'Desert Foothills Elementary',
    neighborhood: 'North Phoenix', walkScore: 38, transitScore: 22,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'moderate', earthquakeRisk: 'low', hailRisk: 'low',
    marketTrend: '+3.1% YoY', medianNeighborhood: 425000,
    nearbyComps: [{ addr: '2204 Elm Ct', sold: '$408K', daysAgo: 21 }, { addr: '2218 Elm Ct', sold: '$421K', daysAgo: 38 }],
    insight: 'Value supported by comps. Wildfire interface zone — verify homeowners policy covers fire.',
    insightTone: 'amber',
  },
  'LN-2024-0312': {
    lat: 36.1627, lng: -86.7816,
    type: 'Townhouse', yearBuilt: 2018, sqft: 1740, beds: 3, baths: 2.5,
    lotSqft: null, hoa: 220,
    estimatedValue: 302000, listPrice: 295000, pricePerSqft: 170,
    daysOnMarket: 7,
    schoolRating: 8, schoolName: 'Harpeth Valley Elementary',
    neighborhood: 'Bellevue', walkScore: 55, transitScore: 30,
    floodZone: 'Zone AE', floodRisk: 'high',
    wildfireRisk: 'low', earthquakeRisk: 'low', hailRisk: 'moderate',
    marketTrend: '+7.2% YoY', medianNeighborhood: 315000,
    nearbyComps: [{ addr: '82 River Walk', sold: '$291K', daysAgo: 16 }, { addr: '94 River Walk', sold: '$304K', daysAgo: 29 }],
    insight: 'Zone AE — mandatory flood insurance required. Nashville market up 7.2% YoY, strong upside for borrower.',
    insightTone: 'red',
  },
  'LN-2024-0289': {
    lat: 39.7212, lng: -104.9880,
    type: 'Single Family', yearBuilt: 2011, sqft: 2680, beds: 4, baths: 3,
    lotSqft: 6900, hoa: null,
    estimatedValue: 598000, listPrice: 590000, pricePerSqft: 220,
    daysOnMarket: 5,
    schoolRating: 9, schoolName: 'Slavens K-8',
    neighborhood: 'Washington Park', walkScore: 86, transitScore: 58,
    floodZone: 'Zone X', floodRisk: 'minimal',
    wildfireRisk: 'low', earthquakeRisk: 'low', hailRisk: 'moderate',
    marketTrend: '+5.8% YoY', medianNeighborhood: 615000,
    nearbyComps: [{ addr: '1449 Hillside Dr', sold: '$585K', daysAgo: 11 }, { addr: '1462 Hillside Dr', sold: '$604K', daysAgo: 24 }],
    insight: 'Washington Park — one of Denver\'s strongest submarkets. Comps support value, high close probability.',
    insightTone: 'green',
  },
  'LN-2024-0391': {
    lat: 25.7273, lng: -80.2562,
    type: 'Single Family', yearBuilt: 2007, sqft: 2860, beds: 4, baths: 3,
    lotSqft: 9100, hoa: 340,
    estimatedValue: 655000, listPrice: 660000, pricePerSqft: 231,
    daysOnMarket: 9,
    schoolRating: 8, schoolName: 'Coconut Grove Elementary',
    neighborhood: 'Coconut Grove', walkScore: 72, transitScore: 48,
    floodZone: 'Zone AE', floodRisk: 'high',
    wildfireRisk: 'low', earthquakeRisk: 'low', hailRisk: 'low',
    femaActive: true, femaDeclaration: 'DR-4830-FL', femaIncident: 'Hurricane Milton',
    marketTrend: '+8.4% YoY', medianNeighborhood: 680000,
    nearbyComps: [{ addr: '4405 Coral Way', sold: '$648K', daysAgo: 28 }, { addr: '4419 Coral Way', sold: '$661K', daysAgo: 42 }],
    insight: 'Active FEMA declaration DR-4830-FL. Re-inspection required before closing. Zone AE flood insurance mandatory.',
    insightTone: 'red',
  },
};

const LOAN_META = {
  'LN-2024-0234': { borrower: 'Sarah Anderson', coborrower: '+ John Anderson', initials: 'SA', color: '#A8541C', property: '1842 Oak Street, Denver CO 80202', status: 'Underwriting', amount: '$425,000', progress: 65, closing: '2026-06-30' },
  'LN-2024-0245': { borrower: 'Michael Oben', coborrower: '', initials: 'MO', color: '#A8541C', property: '3156 Maple Ave, Seattle WA 98101', status: 'Approval', amount: '$680,000', progress: 80, closing: '2026-06-12' },
  'LN-2024-0211': { borrower: 'Jennifer Wang', coborrower: '', initials: 'JW', color: '#3A6BAD', property: '892 Cedar Lane, Austin TX 78701', status: 'Closing', amount: '$780,000', progress: 90, closing: '2026-05-22' },
  'LN-2024-0189': { borrower: 'David Chen', coborrower: '', initials: 'DC', color: '#2A8C53', property: '511 Birch Rd, Portland OR 97201', status: 'Processing', amount: '$525,000', progress: 45, closing: '2026-07-08' },
  'LN-2024-0267': { borrower: 'Marcus Johnson', coborrower: '', initials: 'MJ', color: '#7B3FA0', property: '74 Pine Ridge, Boise ID 83701', status: 'Application', amount: '$345,000', progress: 10, closing: '2026-07-25' },
  'LN-2024-0301': { borrower: 'Emily Rodriguez', coborrower: '', initials: 'ER', color: '#C25535', property: '2210 Elm Court, Phoenix AZ 85001', status: 'Underwriting', amount: '$412,000', progress: 60, closing: '2026-06-28' },
  'LN-2024-0312': { borrower: 'Thomas Park', coborrower: '', initials: 'TP', color: '#3A8294', property: '88 River Walk, Nashville TN 37201', status: 'Processing', amount: '$295,000', progress: 40, closing: '2026-07-02' },
  'LN-2024-0289': { borrower: 'Rachel Kim', coborrower: '', initials: 'RK', color: '#7B3FA0', property: '1455 Hillside Dr, Denver CO 80203', status: 'Approval', amount: '$590,000', progress: 78, closing: '2026-06-15' },
  'LN-2024-0391': { borrower: 'Carlos Rivera', coborrower: '', initials: 'CR', color: '#B91C1C', property: '4412 Coral Way, Miami FL 33146', status: 'Underwriting', amount: '$520,000', progress: 55, closing: '2026-06-10' },
};

/* ─── Property intelligence hover card ─────────────────────────────────────── */
function RiskBadge({ label, level }) {
  const styles = {
    minimal: { bg: '#DCFCE7', color: '#166534', dot: '#16A34A' },
    low:     { bg: '#DCFCE7', color: '#166534', dot: '#16A34A' },
    moderate:{ bg: '#FEF3C7', color: '#92400E', dot: '#F59E0B' },
    high:    { bg: '#FEE2E2', color: '#991B1B', dot: '#EF4444' },
  };
  const s = styles[level] || styles.low;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: s.bg, borderRadius: 5 }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: s.dot, flexShrink: 0 }}/>
      <span style={{ fontSize: 11, fontWeight: 700, color: s.color, whiteSpace: 'nowrap' }}>{label}</span>
    </div>
  );
}

function PropertyCard({ loanId, property }) {
  const p = PROPERTY_INTEL[loanId];
  if (!p) return null;

  const mapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${p.lat},${p.lng}&zoom=15&size=400x160&markers=${p.lat},${p.lng},red-pushpin`;
  const insightBg   = { green: '#F0FDF4', amber: '#FFFBEB', red: '#FEF2F2' }[p.insightTone];
  const insightColor= { green: '#166534', amber: '#92400E', red: '#991B1B' }[p.insightTone];
  const insightBorder={ green: '#BBF7D0', amber: '#FDE68A', red: '#FECACA' }[p.insightTone];

  return (
    <div style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 400,
      zIndex: 600,
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 14,
      boxShadow: '0 12px 40px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      pointerEvents: 'none',
      whiteSpace: 'normal',
    }}>
      {/* Arrow */}
      <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderBottom: 'none', borderRight: 'none', rotate: '45deg', zIndex: 1 }}/>

      {/* Map image */}
      <div style={{ position: 'relative', height: 148, background: '#E5E7EB', overflow: 'hidden' }}>
        <img
          src={mapUrl}
          alt="Property map"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={e => { e.target.style.display = 'none'; }}
        />
        {/* Address overlay */}
        <div style={{
          position: 'absolute', bottom: 0, left: 0, right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.72))',
          padding: '20px 12px 10px',
          display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{property}</div>
            <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.75)', marginTop: 2 }}>{p.neighborhood} · {p.type}</div>
          </div>
          {p.femaActive && (
            <div style={{ background: '#B91C1C', color: '#fff', fontSize: 10, fontWeight: 800, padding: '3px 8px', borderRadius: 5, letterSpacing: '0.04em' }}>
              FEMA {p.femaDeclaration}
            </div>
          )}
        </div>
      </div>

      {/* Property specs row */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-muted)' }}>
        {[
          { label: p.beds + ' bd / ' + p.baths + ' ba', icon: 'settings' },
          { label: p.sqft.toLocaleString() + ' sqft', icon: 'settings' },
          { label: 'Built ' + p.yearBuilt, icon: 'settings' },
          ...(p.hoa ? [{ label: '$' + p.hoa + '/mo HOA', icon: 'settings' }] : []),
        ].map((spec, i) => (
          <div key={i} style={{ flex: 1, padding: '7px 10px', textAlign: 'center', borderRight: i < 2 ? '1px solid var(--border-subtle)' : 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-primary)' }}>{spec.label.split(' ')[0]}</div>
            <div style={{ fontSize: 10.5, color: 'var(--text-tertiary)' }}>{spec.label.split(' ').slice(1).join(' ')}</div>
          </div>
        ))}
      </div>

      <div style={{ padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>

        {/* Value vs loan */}
        <div style={{ display: 'flex', gap: 8 }}>
          <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '9px 11px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Est. Value</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'DM Sans' }}>${(p.estimatedValue / 1000).toFixed(0)}K</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>${p.pricePerSqft}/sqft</div>
          </div>
          <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '9px 11px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 3 }}>Market Trend</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'DM Sans', color: '#059669' }}>{p.marketTrend}</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Median ${(p.medianNeighborhood / 1000).toFixed(0)}K</div>
          </div>
          <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '9px 11px' }}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 3 }}>On Market</div>
            <div style={{ fontSize: 15, fontWeight: 800, fontFamily: 'DM Sans' }}>{p.daysOnMarket}d</div>
            <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 2 }}>Schools: {p.schoolRating}/10</div>
          </div>
        </div>

        {/* Risk indicators */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Hazard & Risk</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            <RiskBadge label={'Flood · ' + p.floodZone} level={p.floodRisk}/>
            <RiskBadge label={'Wildfire · ' + p.wildfireRisk} level={p.wildfireRisk}/>
            <RiskBadge label={'Earthquake · ' + p.earthquakeRisk} level={p.earthquakeRisk}/>
            <RiskBadge label={'Hail · ' + p.hailRisk} level={p.hailRisk}/>
            {p.hoa && <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '3px 8px', background: 'var(--bg-muted)', borderRadius: 5 }}><span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-secondary)' }}>HOA ${p.hoa}/mo</span></div>}
          </div>
        </div>

        {/* Recent comps */}
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-tertiary)', marginBottom: 6 }}>Recent Comps</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {p.nearbyComps.map((c, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '5px 9px', background: 'var(--bg-muted)', borderRadius: 6 }}>
                <span style={{ color: 'var(--text-secondary)' }}>{c.addr}</span>
                <span style={{ fontWeight: 700, fontFamily: 'DM Sans', color: 'var(--text-primary)' }}>{c.sold}</span>
                <span style={{ color: 'var(--text-tertiary)' }}>{c.daysAgo}d ago</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI insight */}
        <div style={{ background: insightBg, border: `1px solid ${insightBorder}`, borderRadius: 8, padding: '8px 11px', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          <Icon name="sparkle" size={12} color={insightColor} strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
          <span style={{ fontSize: 12, color: insightColor, lineHeight: 1.5, fontWeight: 500 }}>{p.insight}</span>
        </div>

      </div>
    </div>
  );
}

/* Quick-contact icon link used per person in the parties popover. */
function ContactAction({ href, icon, label }) {
  return (
    <a
      href={href}
      title={label}
      aria-label={label}
      onClick={(e) => e.stopPropagation()}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        color: 'var(--text-tertiary)', textDecoration: 'none',
        transition: 'background 0.12s, color 0.12s',
      }}
      onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--ai-primary)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-tertiary)'; }}
    >
      <Icon name={icon} size={13}/>
    </a>
  );
}

/* Party avatars strip in header — hovering any badge opens a single popover
   showing the whole loan team at a glance, with the hovered party highlighted.
   The popover opens below the cluster so it isn't clipped at the top of the
   header, and stays open while the cursor is on it for quick contact actions. */
function HeaderParties({ loanId }) {
  const data = LOAN_CONTACTS[loanId];
  if (!data) return null;
  const [open, setOpen] = React.useState(false);
  const [hoveredId, setHoveredId] = React.useState(null);
  const closeTimer = React.useRef(null);
  const openNow = () => { clearTimeout(closeTimer.current); setOpen(true); };
  // Grace period so moving the cursor from the badges across the gap onto the
  // popover doesn't close it — lets the user interact with the contact actions.
  const closeSoon = () => { clearTimeout(closeTimer.current); closeTimer.current = setTimeout(() => { setOpen(false); setHoveredId(null); }, 140); };

  const parties = [
    ...data.external.slice(0, 3),
    ...data.team.slice(0, 2),
  ];
  if (parties.length === 0) return null;

  const hiddenCount = (data.external.length + data.team.length) - parties.length;
  // Full roster for the popover — grouped, and including anyone behind the "+N".
  const groups = [
    { label: 'External', people: data.external },
    { label: 'Your team', people: data.team },
  ].filter(g => g.people.length);

  return (
    <div style={{ paddingLeft: 16, borderLeft: '1px solid var(--border-subtle)', display: 'flex', flexDirection: 'column', gap: 2 }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Parties</div>
      <div
        style={{ position: 'relative', display: 'flex', alignItems: 'center', width: 'fit-content' }}
        onMouseEnter={openNow}
        onMouseLeave={closeSoon}
      >
        {parties.map((p, i) => (
          <div key={p.id} style={{ marginLeft: i > 0 ? -8 : 0 }}
            onMouseEnter={() => { openNow(); setHoveredId(p.id); }}
          >
            <div style={{
              width: 28, height: 28, borderRadius: '50%',
              background: p.color + '22', border: '2px solid var(--bg-surface)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default',
              outline: hoveredId === p.id ? '2px solid ' + p.color : 'none',
              transition: 'outline 0.1s',
            }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: p.color }}>{p.initials}</span>
            </div>
          </div>
        ))}
        {hiddenCount > 0 && (
          <div
            style={{ width: 28, height: 28, borderRadius: '50%', background: 'var(--bg-muted)', border: '2px solid var(--bg-surface)', marginLeft: -8, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}
            onMouseEnter={() => { openNow(); setHoveredId(null); }}
          >
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--text-tertiary)' }}>+{hiddenCount}</span>
          </div>
        )}

        {open && (
          <div
            onMouseEnter={openNow}
            onMouseLeave={closeSoon}
            style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 600,
              minWidth: 268, maxWidth: 340, whiteSpace: 'normal',
              background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 10, boxShadow: '0 10px 32px rgba(0,0,0,0.16)', padding: '8px',
            }}>
            {/* Arrow pointing up at the cluster */}
            <div style={{
              position: 'absolute', top: -5, right: 18, width: 9, height: 9,
              background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-subtle)',
              borderTop: '1px solid var(--border-subtle)', transform: 'rotate(45deg)',
            }}/>
            {groups.map((g, gi) => (
              <div key={g.label} style={{ marginTop: gi > 0 ? 6 : 0 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--text-tertiary)', padding: '2px 6px 4px' }}>{g.label}</div>
                {g.people.map(p => (
                  <div key={p.id}
                    onMouseEnter={() => { openNow(); setHoveredId(p.id); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 9, padding: '5px 6px', borderRadius: 7,
                      background: hoveredId === p.id ? p.color + '18' : 'transparent',
                      transition: 'background 0.1s',
                    }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: '50%', flexShrink: 0,
                      background: p.color + '22', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <span style={{ fontSize: 9.5, fontWeight: 700, color: p.color }}>{p.initials}</span>
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)', lineHeight: 1.25 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-tertiary)', lineHeight: 1.3 }}>{p.role}{p.company ? ' · ' + p.company : ''}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
                      {p.phone && <ContactAction href={'tel:' + p.phone.replace(/[^\d+]/g, '')} icon="phone" label={'Call ' + p.name}/>}
                      {p.phone && <ContactAction href={'sms:' + p.phone.replace(/[^\d+]/g, '')} icon="message" label={'Text ' + p.name}/>}
                      {p.email && <ContactAction href={'mailto:' + p.email} icon="mail" label={'Email ' + p.name}/>}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* Loan Detail screen — "Sarah Anderson" Now view */

function LoanHeader({ meta, loan, loanId, onNavigatePipeline, onOpenComms }) {
  const statusTone = { Underwriting: 'blue', Approval: 'green', Closing: 'green', Processing: 'amber', Application: 'neutral', Funded: 'green' }[meta?.status] || 'neutral';
  const discDates = getDisclosureDates(loan);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showPropCard, setShowPropCard] = React.useState(false);
  const hoverTimerRef = React.useRef(null);

  const handleAddressEnter = () => {
    hoverTimerRef.current = setTimeout(() => setShowPropCard(true), 320);
  };
  const handleAddressLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setShowPropCard(false);
  };
  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '14px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
      whiteSpace: 'nowrap',
    }}>
      <Avatar initials={meta?.initials || 'SA'} size={42} color={meta?.color || '#A8541C'}/>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, lineHeight: 1.2 }}>
          {/* h1 page landmark — visually identical to surrounding text */}
          <h1 style={{ margin: 0, fontSize: 16, fontWeight: 600, display: 'inline', lineHeight: 'inherit' }}>{meta?.borrower || 'Sarah Anderson'}</h1>
          {meta?.coborrower && <span style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>{meta.coborrower}</span>}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginTop: 4, fontSize: 12.5, color: 'var(--text-tertiary)',
        }}>
          <span style={{ fontFamily: 'DM Sans', fontWeight: 500 }}>{loanId}</span>
          <span>•</span>
          <a
            href={`https://maps.google.com/?q=${encodeURIComponent(meta?.property || '1842 Oak Street, Denver CO 80202')}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 5, position: 'relative', color: 'inherit', textDecoration: 'none' }}
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--ai-primary)'; handleAddressEnter(e); }}
            onMouseLeave={e => { e.currentTarget.style.color = 'inherit'; handleAddressLeave(e); }}
          >
            <Icon name="pin" size={12}/>
            <span style={{
              borderBottom: '1px dashed var(--border-strong)',
              transition: 'border-color 0.12s, color 0.12s',
            }}>
              {meta?.property || '1842 Oak Street, Denver CO 80202'}
            </span>
            {showPropCard && (
              <PropertyCard loanId={loanId} property={meta?.property || ''}/>
            )}
          </a>
        </div>
      </div>

      <HeaderStat label="Purpose" value={meta?.purpose || '—'}/>
      <HeaderStat label="Loan Amount" value={meta?.amount || '$425,000'}/>

      {/* Credit score + rate (with lock state) */}
      <HeaderStat
        label="Credit"
        value={loan?.credit?.fico != null ? loan.credit.fico : '—'}
        tone={creditHeaderTone(loan?.credit?.fico)}
      />
      <HeaderStat
        label="Rate"
        value={
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
            <Icon name="lock" size={13} color={lockIconColor(loan?.lockStatus)} aria-hidden="true"/>
            {loan?.rate != null ? `${loan.rate.toFixed(3)}%` : '—'}
          </span>
        }
      />

      {/* DTI and LTV — hidden during Application stage (income/property
          not confirmed yet). Tone reflects risk thresholds. */}
      {meta?.status !== 'Application' && (
        <>
          <HeaderStat
            label="DTI"
            value={meta?.dti != null ? `${meta.dti}%` : '—'}
            tone={dtiHeaderTone(meta?.dti)}
          />
          <HeaderStat
            label="LTV"
            value={meta?.ltv != null ? `${meta.ltv}%` : '—'}
            tone={ltvHeaderTone(meta?.ltv)}
          />
        </>
      )}

      <HeaderStat label="Est. Closing" value={meta?.closing || '2026-06-30'}/>

      {/* Disclosure send dates */}
      <HeaderStat label="Last LE Sent" value={isoToHuman(discDates.leSent)}/>
      <HeaderStat label="Last CD Sent" value={isoToHuman(discDates.cdSent)}/>

      {/* Party avatars */}
      <HeaderParties loanId={loanId}/>

      <div style={{ display: 'flex', gap: 6, paddingLeft: 12, position: 'relative' }}>
        <button className="btn btn-icon btn-ghost" title="Open Comms" aria-label="Open Comms" onClick={onOpenComms}>
          <Icon name="send" size={16} aria-hidden="true"/>
        </button>
        <button className="btn btn-icon btn-ghost" title="More options" aria-label="More options" aria-expanded={showMenu} onClick={() => setShowMenu(v => !v)}>
          <Icon name="moreV" size={16} aria-hidden="true"/>
        </button>
        {showMenu && (
          <div style={{
            position: 'absolute', top: '100%', right: 0, marginTop: 4, zIndex: 300,
            background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
            borderRadius: 10, padding: 6, width: 180, boxShadow: 'var(--shadow-lg)',
          }} onMouseLeave={() => setShowMenu(false)}>
            {[
              { label: 'Print loan summary', icon: 'download' },
              { label: 'Duplicate loan', icon: 'doc' },
              { label: 'Export to PDF', icon: 'download' },
              { label: 'View audit log', icon: 'fileSearch' },
            ].map(item => (
              <button key={item.label} onClick={() => setShowMenu(false)} style={{
                display: 'flex', alignItems: 'center', gap: 9, width: '100%',
                padding: '8px 10px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit', fontSize: 13, borderRadius: 7,
                color: 'var(--text-primary)', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <Icon name={item.icon} size={13} color="var(--text-secondary)"/>
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const statLabel = { fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500 };
function HeaderStat({ label, value, tone }) {
  const valueColor = tone === 'red'   ? 'var(--status-red)'
                   : tone === 'amber' ? 'var(--status-amber)'
                   : 'var(--text-primary)';
  return (
    <div style={{ paddingLeft: 16, borderLeft: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>
      <div style={statLabel}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, color: valueColor }}>{value}</div>
    </div>
  );
}

// Threshold helpers for DTI / LTV header stats
function dtiHeaderTone(dti) {
  if (dti == null) return null;
  if (dti >= 45) return 'red';
  if (dti >= 43) return 'red';
  if (dti >= 36) return 'amber';
  return null;
}
function ltvHeaderTone(ltv) {
  if (ltv == null) return null;
  if (ltv > 95) return 'red';
  if (ltv > 80) return 'amber';
  return null;
}
function creditHeaderTone(fico) {
  if (fico == null) return null;
  if (fico < 620) return 'red';
  if (fico < 680) return 'amber';
  return null;
}
// Lock-state color for the Rate stat's padlock icon.
function lockIconColor(lockStatus) {
  if (lockStatus === 'Locked')   return 'var(--status-green)';
  if (lockStatus === 'Expiring') return 'var(--status-red)';
  return 'var(--text-tertiary)'; // Floating / not set
}

// ─── Configurable left-nav structure ────────────────────────────────────────
// Tasks + Loan Story are "fixed" system links — always at the top, never
// editable. Everything below is grouped into configurable sections that an
// admin can rename, reorder, add to, or delete (when empty) in Config View.
const DEFAULT_NAV_CONFIG = {
  fixed: [
    { id: 'now',   label: 'Tasks',      icon: 'target' },
    { id: 'story', label: 'Loan Story', icon: 'book' },
  ],
  sections: [
    {
      id: 'sec-forms', label: 'Forms', items: [
        { id: 'borrowerSummary', label: 'Borrower Info', icon: 'doc' },
        { id: 'urla1003',        label: '1003',             icon: 'doc' },
      ],
    },
    {
      id: 'sec-workspaces', label: 'Workspaces', items: [
        { id: 'filereview', label: 'File Review',          icon: 'listCheck' },
        { id: 'conditions', label: 'Conditions',           icon: 'listCheck', badge: 4 },
        { id: 'aus',        label: 'AUS',                  icon: 'zap' },
        { id: 'credit',     label: 'Credit & Liabilities', icon: 'database' },
        { id: 'pricing',    label: 'Pricing & Lock',       icon: 'dollar' },
        { id: 'documents',  label: 'Documents',            icon: 'doc' },
        { id: 'closing',    label: 'Closing',              icon: 'calculator' },
        { id: 'audit',      label: 'Audit',                icon: 'fileSearch' },
        { id: 'services',   label: 'Services',             icon: 'settings' },
      ],
    },
  ],
};

function LeftRail({ tab, onTab, onOpenURLA, dataSubTab, onDataSubTab, onOpenDocs, previewWorkflow, loan, favorites = [] }) {
  // Groups state: open/closed + doc ordering per group
  const [groups, setGroups] = React.useState(
    DOC_GROUPS.map(g => ({ ...g, open: g.defaultOpen, docs: [...g.docs] }))
  );
  // Which docs have their pages expanded (doc id → bool)
  const [expandedPages, setExpandedPages] = React.useState({ 'doc__Loan_Estimate': true });

  const toggleGroup = (gid) =>
    setGroups(prev => prev.map(g => g.id === gid ? { ...g, open: !g.open } : g));

  const toggleDocPages = (docId) =>
    setExpandedPages(prev => ({ ...prev, [docId]: !prev[docId] }));

  // Per-group drag state (docs)
  const dragState = React.useRef({ groupId: null, fromIdx: null });
  const [dropTarget, setDropTarget] = React.useState(null); // { groupId, idx }

  // Per-doc drag state (pages)
  const pageDragState = React.useRef({ docId: null, fromIdx: null });
  const [pageDropTarget, setPageDropTarget] = React.useState(null); // { docId, idx }

  const handlePageDragStart = (e, docId, idx) => {
    pageDragState.current = { docId, fromIdx: idx };
    e.dataTransfer.effectAllowed = 'move';
    e.stopPropagation();
  };
  const handlePageDragOver = (e, docId, idx) => {
    e.preventDefault();
    e.stopPropagation();
    if (pageDragState.current.docId !== docId) return;
    e.dataTransfer.dropEffect = 'move';
    setPageDropTarget({ docId, idx });
  };
  const handlePageDrop = (e, docId, idx) => {
    e.preventDefault();
    e.stopPropagation();
    const { docId: fromDoc, fromIdx } = pageDragState.current;
    if (fromDoc !== docId || fromIdx === null || fromIdx === idx) {
      setPageDropTarget(null); return;
    }
    setGroups(prev => prev.map(g => ({
      ...g,
      docs: g.docs.map(d => {
        if (d.id !== docId || !d.pages) return d;
        const next = [...d.pages];
        const [moved] = next.splice(fromIdx, 1);
        next.splice(idx, 0, moved);
        return { ...d, pages: next };
      }),
    })));
    pageDragState.current = { docId: null, fromIdx: null };
    setPageDropTarget(null);
  };

  const handleDragStart = (e, groupId, idx) => {
    dragState.current = { groupId, fromIdx: idx };
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e, groupId, idx) => {
    e.preventDefault();
    if (dragState.current.groupId !== groupId) return; // no cross-group
    e.dataTransfer.dropEffect = 'move';
    setDropTarget({ groupId, idx });
  };
  const handleDrop = (e, groupId, idx) => {
    e.preventDefault();
    const { groupId: fromGroup, fromIdx } = dragState.current;
    if (fromGroup !== groupId || fromIdx === null || fromIdx === idx) {
      setDropTarget(null); return;
    }
    setGroups(prev => prev.map(g => {
      if (g.id !== groupId) return g;
      const next = [...g.docs];
      const [moved] = next.splice(fromIdx, 1);
      next.splice(idx, 0, moved);
      return { ...g, docs: next };
    }));
    dragState.current = { groupId: null, fromIdx: null };
    setDropTarget(null);
  };
  const handleDragEnd = () => {
    dragState.current = { groupId: null, fromIdx: null };
    setDropTarget(null);
  };

  // ─── Configurable nav state ──────────────────────────────────────────────
  // `committed` is what the user has saved; `draft` is the in-progress edit
  // while Config View is on. When config mode is off, render the committed
  // structure read-only.
  const [committedNav, setCommittedNav]   = React.useState(DEFAULT_NAV_CONFIG);
  const [configMode, setConfigMode]       = React.useState(false);
  const [draftNav, setDraftNav]           = React.useState(DEFAULT_NAV_CONFIG);
  const [editingSectionId, setEditingSectionId] = React.useState(null);
  const [sectionMenuOpenId, setSectionMenuOpenId] = React.useState(null);
  // const [ctxOpen, setCtxOpen] = React.useState(false); // preview-context switcher (removed for now)

  // The loan nav is now driven by the active, rule-matched workflow configured
  // in the Admin console (see WorkflowProvider). Fixed system links stay pinned
  // at the top; each configured page maps onto the existing content-tab id so
  // the content router and the 1003 sub-nav keep working unchanged.
  // When `previewWorkflow` is supplied (full-preview overlay from the Admin
  // console), render that workflow's nav instead. Otherwise the workflow is
  // resolved from this loan's own purpose + status (role-agnostic for now).
  const { resolveWorkflowForLoan } = useWorkflows();
  const activeWorkflow = previewWorkflow || resolveWorkflowForLoan(loan);
  const activeNav = React.useMemo(() => ({
    fixed: FIXED_SYSTEM_LINKS.map(l => ({ id: l.tab, label: l.label, icon: l.icon })),
    sections: (activeWorkflow?.sections || []).map(s => ({
      id: s.id,
      label: s.title,
      items: s.pages.map(p => ({
        id: PAGE_CONTENT_TAB[p.id] || p.id,
        label: p.label,
        icon: p.icon,
        badge: getPage(p.id)?.badge,
      })),
    })),
  }), [activeWorkflow]);

  const enterConfig = () => { setDraftNav(committedNav); setConfigMode(true); };
  const saveConfig  = () => { setCommittedNav(draftNav); setConfigMode(false); setEditingSectionId(null); setSectionMenuOpenId(null); };
  const cancelConfig = () => { setDraftNav(committedNav); setConfigMode(false); setEditingSectionId(null); setSectionMenuOpenId(null); };

  // ─── Nav drag-and-drop (config mode only) ───────────────────────────────
  // dragRef tracks the dragged thing: { kind: 'item', sectionId, idx } OR
  // { kind: 'section', idx }. Drop target shows a 2px insertion line.
  const navDragRef = React.useRef(null);
  const [navDropTarget, setNavDropTarget] = React.useState(null);

  const beginItemDrag = (sectionId, idx) => (e) => {
    navDragRef.current = { kind: 'item', sectionId, idx };
    e.dataTransfer.effectAllowed = 'move';
    // Required for Firefox
    try { e.dataTransfer.setData('text/plain', `${sectionId}:${idx}`); } catch (_) {}
  };
  const overItemSlot = (sectionId, idx) => (e) => {
    if (!navDragRef.current || navDragRef.current.kind !== 'item') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setNavDropTarget({ kind: 'item', sectionId, idx });
  };
  const dropItemAt = (sectionId, idx) => (e) => {
    e.preventDefault();
    const src = navDragRef.current;
    navDragRef.current = null;
    setNavDropTarget(null);
    if (!src || src.kind !== 'item') return;
    setDraftNav(prev => {
      const sections = prev.sections.map(s => ({ ...s, items: [...s.items] }));
      const fromSec = sections.find(s => s.id === src.sectionId);
      const toSec   = sections.find(s => s.id === sectionId);
      if (!fromSec || !toSec) return prev;
      const [moved] = fromSec.items.splice(src.idx, 1);
      let insertIdx = idx;
      if (fromSec === toSec && src.idx < idx) insertIdx -= 1; // adjust for self-remove
      toSec.items.splice(insertIdx, 0, moved);
      return { ...prev, sections };
    });
  };

  const beginSectionDrag = (idx) => (e) => {
    navDragRef.current = { kind: 'section', idx };
    e.dataTransfer.effectAllowed = 'move';
    try { e.dataTransfer.setData('text/plain', `section:${idx}`); } catch (_) {}
  };
  const overSectionSlot = (idx) => (e) => {
    if (!navDragRef.current || navDragRef.current.kind !== 'section') return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setNavDropTarget({ kind: 'section', idx });
  };
  const dropSectionAt = (idx) => (e) => {
    e.preventDefault();
    const src = navDragRef.current;
    navDragRef.current = null;
    setNavDropTarget(null);
    if (!src || src.kind !== 'section' || src.idx === idx) return;
    setDraftNav(prev => {
      const sections = [...prev.sections];
      const [moved] = sections.splice(src.idx, 1);
      const insertIdx = src.idx < idx ? idx - 1 : idx;
      sections.splice(insertIdx, 0, moved);
      return { ...prev, sections };
    });
  };

  const endNavDrag = () => { navDragRef.current = null; setNavDropTarget(null); };

  // ─── Section mutators (config mode) ──────────────────────────────────────
  const renameSection = (sectionId, label) => {
    setDraftNav(prev => ({
      ...prev,
      sections: prev.sections.map(s => s.id === sectionId ? { ...s, label } : s),
    }));
  };
  const deleteSection = (sectionId) => {
    setDraftNav(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId || s.items.length > 0),
    }));
    setSectionMenuOpenId(null);
  };
  const addSection = () => {
    const newId = `sec-${Date.now()}`;
    setDraftNav(prev => ({
      ...prev,
      sections: [...prev.sections, { id: newId, label: 'New workflow category', items: [] }],
    }));
    setEditingSectionId(newId);
  };

  // ─── Item renderer (used by both fixed and configurable lists) ──────────
  const renderNavItem = (it, opts = {}) => {
    const { isFixed = false, sectionId, idx } = opts;
    const active = tab === it.id;
    const isDraggable = configMode && !isFixed;
    const isDropHere = navDropTarget?.kind === 'item' && navDropTarget.sectionId === sectionId && navDropTarget.idx === idx;
    return (
      <React.Fragment key={it.id}>
        {isDropHere && <div style={{ height: 2, background: 'var(--text-primary)', borderRadius: 999, margin: '2px 6px' }}/>}
        <div
          draggable={isDraggable}
          onDragStart={isDraggable ? beginItemDrag(sectionId, idx) : undefined}
          onDragOver={isDraggable ? overItemSlot(sectionId, idx) : undefined}
          onDrop={isDraggable ? dropItemAt(sectionId, idx) : undefined}
          onDragEnd={endNavDrag}
          style={{ position: 'relative' }}
        >
          <button
            onClick={() => onTab(it.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              height: 34, padding: '0 12px',
              border: configMode && !isFixed ? '1px dashed transparent' : 'none',
              cursor: configMode && !isFixed ? 'grab' : 'pointer',
              background: active ? 'var(--text-primary)' : 'transparent',
              color: active ? '#fff' : 'var(--text-secondary)',
              fontSize: 13, fontWeight: 500, borderRadius: 7,
              fontFamily: 'inherit', textAlign: 'left', transition: 'background 0.12s, border-color 0.12s',
            }}
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.background = 'var(--bg-muted)';
              if (configMode && !isFixed) e.currentTarget.style.borderColor = 'var(--border-subtle)';
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.background = 'transparent';
              if (configMode && !isFixed) e.currentTarget.style.borderColor = 'transparent';
            }}
          >
            {configMode && !isFixed && (
              <span style={{ display: 'inline-flex', color: active ? 'rgba(255,255,255,0.5)' : 'var(--text-tertiary)', flexShrink: 0, marginLeft: -4 }}>
                <Icon name="grip" size={12}/>
              </span>
            )}
            <Icon name={it.icon} size={14} strokeWidth={1.7}/>
            <span style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{it.label}</span>
            {it.badge && (
              <span style={{ background: active ? '#D74C3C' : 'var(--card-red-bg)', color: active ? '#fff' : 'var(--status-red)', fontSize: 10.5, fontWeight: 600, minWidth: 17, height: 17, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>{it.badge}</span>
            )}
            {configMode && isFixed && (
              <span style={{
                fontSize: 9.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                color: active ? 'rgba(255,255,255,0.7)' : 'var(--text-tertiary)',
                background: active ? 'rgba(255,255,255,0.12)' : 'var(--bg-muted)',
                padding: '1px 6px', borderRadius: 4,
              }}>System</span>
            )}
          </button>
        </div>

        {/* 1003 sub-nav (only in normal mode, when active) */}
        {!configMode && it.id === 'urla1003' && active && (
          <div style={{ display: 'flex', flexDirection: 'column', paddingLeft: 22, marginTop: 4, gap: 1 }}>
            {URLA1003_SECTIONS.map(sub => (
              <button key={sub.id} onClick={() => {
                const el = document.getElementById(sub.id);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }} style={{
                display: 'flex', alignItems: 'center', height: 28,
                padding: '0 12px', border: 'none', background: 'transparent',
                cursor: 'pointer', fontFamily: 'inherit',
                fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)',
                borderRadius: 6, textAlign: 'left',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
              >
                {sub.label}
              </button>
            ))}
          </div>
        )}
      </React.Fragment>
    );
  };

  return (
    <aside style={{
      width: 232,
      borderRight: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column',
      flexShrink: 0, minHeight: 0,
    }}>
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px 8px', display: 'flex', flexDirection: 'column', gap: 2 }}>

        {/* Fixed (system) links — Tasks, Loan Story, Forms */}
        {activeNav.fixed.map(it => renderNavItem(it, { isFixed: true }))}

        {/* Favorites — forms the user pinned from the Forms page (normal mode only) */}
        {!configMode && favorites.length > 0 && (
          <div style={{ marginTop: 8 }}>
            <div style={{ padding: '8px 12px 4px', fontSize: 10.5, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
              Favorites
            </div>
            {favorites.map(fid => {
              const f = formById(fid);
              if (!f) return null;
              return renderNavItem({ id: 'form:' + fid, label: f.name, icon: 'star' }, { isFixed: true });
            })}
          </div>
        )}

        {/* Divider beneath fixed links — only visible in config mode */}
        {configMode && (
          <>
            <div style={{ height: 1, background: 'var(--border-subtle)', margin: '10px 4px 4px' }}/>
            <div style={{
              fontSize: 11.5, color: 'var(--text-secondary)',
              padding: '4px 8px 8px', lineHeight: 1.4,
            }}>
              Configure workflow navigation for this loan view.
            </div>
          </>
        )}

        {/* Configurable sections */}
        {activeNav.sections.map((section, sIdx) => {
          const isEditing = editingSectionId === section.id;
          const menuOpen = sectionMenuOpenId === section.id;
          const isSectionDropHere = navDropTarget?.kind === 'section' && navDropTarget.idx === sIdx;
          return (
            <div key={section.id} style={{ marginTop: 4 }}>
              {isSectionDropHere && <div style={{ height: 2, background: 'var(--text-primary)', borderRadius: 999, margin: '4px 6px' }}/>}

              {/* Section header */}
              <div
                draggable={configMode}
                onDragStart={configMode ? beginSectionDrag(sIdx) : undefined}
                onDragOver={configMode ? overSectionSlot(sIdx) : undefined}
                onDrop={configMode ? dropSectionAt(sIdx) : undefined}
                onDragEnd={endNavDrag}
                style={{
                  display: 'flex', alignItems: 'center', gap: 4,
                  padding: configMode ? '8px 8px 6px' : '14px 12px 6px',
                  margin: 0,
                  background: configMode ? 'var(--bg-muted)' : 'transparent',
                  borderRadius: configMode ? 6 : 0,
                  cursor: configMode ? 'grab' : 'default',
                }}
              >
                {configMode && (
                  <span style={{ display: 'inline-flex', color: 'var(--text-tertiary)', flexShrink: 0 }}>
                    <Icon name="grip" size={12}/>
                  </span>
                )}
                {isEditing ? (
                  <input
                    autoFocus
                    value={section.label}
                    onChange={e => renameSection(section.id, e.target.value)}
                    onBlur={() => setEditingSectionId(null)}
                    onKeyDown={e => { if (e.key === 'Enter' || e.key === 'Escape') { e.preventDefault(); setEditingSectionId(null); } }}
                    style={{
                      flex: 1, height: 22, padding: '0 6px',
                      border: '1px solid var(--border-default)', borderRadius: 5,
                      background: 'var(--bg-surface)', fontFamily: 'inherit',
                      fontSize: 11, fontWeight: 600, color: 'var(--text-primary)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      outline: 'none',
                    }}
                  />
                ) : (
                  <span
                    onClick={configMode ? () => setEditingSectionId(section.id) : undefined}
                    style={{
                      flex: 1, fontSize: 10.5, fontWeight: 600,
                      color: 'var(--text-tertiary)',
                      textTransform: 'uppercase', letterSpacing: '0.07em',
                      cursor: configMode ? 'text' : 'default',
                    }}
                  >
                    {section.label}
                  </span>
                )}
                {configMode && (
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); setSectionMenuOpenId(menuOpen ? null : section.id); }}
                      aria-label="Section options"
                      style={{
                        width: 22, height: 22, borderRadius: 5,
                        border: 'none', background: 'transparent', cursor: 'pointer',
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        color: 'var(--text-tertiary)',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = 'var(--border-subtle)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <Icon name="moreV" size={13}/>
                    </button>
                    {menuOpen && (
                      <div
                        onMouseLeave={() => setSectionMenuOpenId(null)}
                        style={{
                          position: 'absolute', top: '100%', right: 0, marginTop: 4,
                          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
                          borderRadius: 8, boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
                          padding: 4, minWidth: 140, zIndex: 20,
                        }}
                      >
                        <button
                          onClick={() => { setSectionMenuOpenId(null); setEditingSectionId(section.id); }}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                            padding: '7px 10px', border: 'none', background: 'transparent',
                            cursor: 'pointer', fontFamily: 'inherit', fontSize: 12.5,
                            color: 'var(--text-primary)', borderRadius: 5, textAlign: 'left',
                          }}
                          onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >Rename</button>
                        <button
                          disabled={section.items.length > 0}
                          onClick={() => deleteSection(section.id)}
                          title={section.items.length > 0 ? 'Move items out before deleting' : 'Delete category'}
                          style={{
                            display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                            padding: '7px 10px', border: 'none', background: 'transparent',
                            cursor: section.items.length > 0 ? 'not-allowed' : 'pointer',
                            fontFamily: 'inherit', fontSize: 12.5,
                            color: section.items.length > 0 ? 'var(--text-tertiary)' : 'var(--status-red)',
                            opacity: section.items.length > 0 ? 0.55 : 1,
                            borderRadius: 5, textAlign: 'left',
                          }}
                          onMouseEnter={e => { if (section.items.length === 0) e.currentTarget.style.background = 'var(--bg-muted)'; }}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        >Delete category</button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Section items */}
              <div
                onDragOver={configMode && section.items.length === 0 ? overItemSlot(section.id, 0) : undefined}
                onDrop={configMode && section.items.length === 0 ? dropItemAt(section.id, 0) : undefined}
                style={{
                  display: 'flex', flexDirection: 'column', gap: 1,
                  paddingTop: configMode ? 4 : 0,
                  minHeight: configMode && section.items.length === 0 ? 36 : undefined,
                  border: configMode && section.items.length === 0 ? '1px dashed var(--border-subtle)' : 'none',
                  borderRadius: configMode && section.items.length === 0 ? 6 : 0,
                  background: configMode && navDropTarget?.kind === 'item' && navDropTarget.sectionId === section.id && section.items.length === 0 ? 'var(--bg-muted)' : 'transparent',
                  alignItems: configMode && section.items.length === 0 ? 'center' : 'stretch',
                  justifyContent: configMode && section.items.length === 0 ? 'center' : undefined,
                }}
              >
                {section.items.length === 0 && configMode ? (
                  <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
                    Drag links here
                  </span>
                ) : (
                  section.items.map((it, idx) => renderNavItem(it, { sectionId: section.id, idx }))
                )}
              </div>
            </div>
          );
        })}

        {/* Add category */}
        {configMode && (
          <button
            onClick={addSection}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              height: 32, padding: '0 10px', marginTop: 10,
              border: '1px dashed var(--border-default)',
              background: 'transparent', cursor: 'pointer',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 500,
              color: 'var(--text-secondary)', borderRadius: 7,
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <Icon name="plus" size={12} strokeWidth={2}/>
            Add category
          </button>
        )}
      </div>

    </aside>
  );
}

/*
 * LibraryPanel — single canonical component used in both the left rail and Data tab.
 *
 * Props:
 *   mode        'rail' | 'full'   — rail fills flex height; full is sticky aside
 *   onOpenURLA  fn                — called when a 1003 form is opened
 */
function LibraryPanel({ mode = 'rail', onOpenURLA }) {
  const [activeTab, setActiveTab]   = React.useState('Documents');
  const [sortMode, setSortMode]     = React.useState('all');   // 'all' | 'alpha'
  const [query, setQuery]           = React.useState('');
  const [selected, setSelected]     = React.useState('Loan Originator Summary');
  const [collapsed, setCollapsed]   = React.useState(false);

  const TABS = ['Documents', 'Tools', 'Services'];

  // Per-tab total counts (unfiltered)
  const tabCounts = Object.fromEntries(TABS.map(t => [t, FORMS_LIBRARY[t].length]));

  // Derive visible items
  let items = (FORMS_LIBRARY[activeTab] || []).slice();
  if (sortMode === 'alpha') items.sort((a, b) => a.name.localeCompare(b.name));
  if (query.trim()) {
    const q = query.toLowerCase();
    items = items.filter(i => i.name.toLowerCase().includes(q));
  }

  const is1003 = selected.startsWith('1003');

  const handleOpen = () => {
    if (is1003 && onOpenURLA) onOpenURLA();
  };

  const handleSelect = (name) => {
    setSelected(name);
    if (name.startsWith('1003') && onOpenURLA) onOpenURLA();
  };

  // ── Shared pieces ─────────────────────────────────────────────────────────

  const tabBar = (
    <div style={{ display: 'flex', padding: '6px 6px 0', gap: 1, background: 'var(--bg-muted)', flexShrink: 0 }}>
      {TABS.map(t => {
        const active = activeTab === t;
        return (
          <button key={t} onClick={() => { setActiveTab(t); setQuery(''); }} style={{
            flex: 1, height: mode === 'full' ? 28 : 24,
            border: 'none',
            background: active ? 'var(--bg-surface)' : 'transparent',
            color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
            fontFamily: 'inherit',
            fontSize: mode === 'full' ? 12.5 : 11.5,
            fontWeight: active ? 600 : 500,
            cursor: 'pointer',
            borderRadius: '5px 5px 0 0',
            borderTop:   active ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderLeft:  active ? '1px solid var(--border-subtle)' : '1px solid transparent',
            borderRight: active ? '1px solid var(--border-subtle)' : '1px solid transparent',
            marginBottom: -1, position: 'relative', zIndex: active ? 2 : 1,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          }}>
            {t}
            <span style={{ fontSize: 10, fontWeight: 700, color: active ? 'var(--text-secondary)' : 'var(--text-tertiary)', background: 'var(--bg-muted)', padding: '0 4px', borderRadius: 4 }}>{tabCounts[t]}</span>
          </button>
        );
      })}
    </div>
  );

  const searchBar = (
    <div style={{ padding: mode === 'full' ? '10px 10px 8px' : '8px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, height: mode === 'full' ? 30 : 26, padding: '0 8px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 6 }}>
        <Icon name="search" size={mode === 'full' ? 12 : 11} color="var(--text-tertiary)"/>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder={`Search ${activeTab.toLowerCase()}…`}
          style={{ flex: 1, minWidth: 0, height: '100%', border: 'none', outline: 'none', fontSize: mode === 'full' ? 12 : 11.5, background: 'transparent', fontFamily: 'inherit' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0, display: 'flex' }}>
            <Icon name="x" size={11}/>
          </button>
        )}
      </div>
    </div>
  );

  const itemList = (
    <div style={{
      ...(mode === 'rail' ? { flex: 1, minHeight: 0 } : { height: 320 }),
      overflowY: 'auto',
      borderTop: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
    }}>
      {items.length === 0 ? (
        <div style={{ padding: '28px 12px', textAlign: 'center', fontSize: 12, color: 'var(--text-tertiary)' }}>
          No {activeTab.toLowerCase()} match "{query}"
        </div>
      ) : items.map(item => {
        const isSel = selected === item.name;
        return (
          <button
            key={item.name}
            onClick={() => handleSelect(item.name)}
            onDoubleClick={handleOpen}
            title={item.name}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              width: '100%', textAlign: 'left',
              padding: mode === 'full' ? '7px 12px' : '5px 10px',
              border: 'none',
              background: isSel ? '#E8E3FC' : 'transparent',
              color: 'var(--text-primary)',
              fontFamily: 'inherit',
              fontSize: mode === 'full' ? 12.5 : 11.5,
              cursor: 'pointer',
              borderBottom: '1px solid #F4F4F2',
            }}
            onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = '#F5F3FF'; }}
            onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
          >
            <FormStatusDot status={item.status}/>
            <span style={{ flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {item.name}
            </span>
            {item.name.startsWith('1003') && (
              <span style={{ fontSize: 9.5, fontWeight: 700, color: '#7E68FA', background: '#EDE9FE', padding: '1px 5px', borderRadius: 3, flexShrink: 0 }}>1003</span>
            )}
          </button>
        );
      })}
    </div>
  );

  const footer = (
    <div style={{ padding: mode === 'full' ? '10px 12px' : '8px 10px', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-muted)', flexShrink: 0 }}>
      {/* Sort + legend */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 8, justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <LibRadio checked={sortMode === 'all'}   onChange={() => setSortMode('all')}   label="Default"/>
          <LibRadio checked={sortMode === 'alpha'} onChange={() => setSortMode('alpha')} label="A–Z"/>
        </div>
        {/* Status legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {[{ c: '#3DA866', l: 'Ready' }, { c: '#E0A23A', l: 'Needs' }, { c: '#9AA0A6', l: 'Pending' }].map(s => (
            <span key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 9.5, color: 'var(--text-tertiary)' }}>
              <span style={{ width: 6, height: 6, borderRadius: 999, background: s.c, flexShrink: 0 }}/>
              {s.l}
            </span>
          ))}
        </div>
      </div>
      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 5 }}>
        <button className="btn btn-primary btn-sm" style={{ flex: 1, justifyContent: 'center', height: mode === 'full' ? 28 : 26, fontSize: 12 }} onClick={handleOpen}>
          Open
        </button>
        <button className="btn btn-outline btn-sm" style={{ height: mode === 'full' ? 28 : 26, padding: '0 9px' }} title="Upload document">
          <Icon name="upload" size={12}/>
        </button>
        <button className="btn btn-outline btn-sm" style={{ height: mode === 'full' ? 28 : 26, padding: '0 9px' }} title="Download / print">
          <Icon name="download" size={12}/>
        </button>
        <button className="btn btn-outline btn-sm" style={{ height: mode === 'full' ? 28 : 26, padding: '0 9px' }} title="Configure list">
          <Icon name="settings" size={12}/>
        </button>
      </div>
    </div>
  );

  // ── Rail layout (left sidebar) ────────────────────────────────────────────
  if (mode === 'rail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-muted)' }}>
        {/* Collapsible header */}
        <button onClick={() => setCollapsed(c => !c)} style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px',
          background: 'transparent', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
          borderBottom: collapsed ? 'none' : '1px solid var(--border-subtle)',
          textAlign: 'left', width: '100%', flexShrink: 0,
        }}>
          <Icon name="book" size={13} color="var(--text-secondary)" strokeWidth={1.85}/>
          <span style={{ fontSize: 12.5, fontWeight: 600, flex: 1 }}>Library</span>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)', fontFamily: 'DM Sans' }}>{tabCounts[activeTab]}</span>
          <Icon name={collapsed ? 'chevronUp' : 'chevronDown'} size={12} color="var(--text-tertiary)"/>
        </button>
        {!collapsed && <>{tabBar}{searchBar}{itemList}{footer}</>}
      </div>
    );
  }

  // ── Full layout (Data tab aside) ──────────────────────────────────────────
  return (
    <aside style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 10,
      overflow: 'hidden',
      alignSelf: 'flex-start',
      position: 'sticky', top: 20,
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Title bar — collapsible */}
      <button onClick={() => setCollapsed(c => !c)} style={{
        display: 'flex', alignItems: 'center', gap: 8, padding: '12px 14px',
        background: 'var(--bg-muted)', border: 'none', borderBottom: '1px solid var(--border-subtle)',
        cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left', width: '100%',
      }}>
        <Icon name="book" size={14} color="var(--text-secondary)" strokeWidth={1.85}/>
        <span style={{ fontSize: 13, fontWeight: 600, flex: 1 }}>Library</span>
        <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontFamily: 'DM Sans' }}>{tabCounts[activeTab]}</span>
        <Icon name={collapsed ? 'chevronUp' : 'chevronDown'} size={12} color="var(--text-tertiary)"/>
      </button>
      {!collapsed && <>{tabBar}{searchBar}{itemList}{footer}</>}
    </aside>
  );
}

function LibRadio({ checked, onChange, label }) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--text-secondary)', cursor: 'pointer', userSelect: 'none' }}>
      <input type="radio" checked={checked} onChange={onChange} style={{ accentColor: '#0E1014', margin: 0, width: 12, height: 12 }}/>
      {label}
    </label>
  );
}

/* Action cards in main area */
function ActionCard({ tone = 'red', icon, iconColor, iconBg, header, children, footer }) {
  const toneStyles = {
    red: { bg: 'var(--card-red-bg)', border: 'var(--card-red-border)' },
    green: { bg: 'var(--card-green-bg)', border: 'var(--card-green-border)' },
    amber: { bg: 'var(--card-amber-bg)', border: 'var(--card-amber-border)' },
    neutral: { bg: 'var(--bg-surface)', border: 'var(--border-subtle)' },
  };
  const t = toneStyles[tone];
  return (
    <div style={{
      background: t.bg, border: `1px solid ${t.border}`,
      borderRadius: 12, padding: 18,
      display: 'flex', gap: 14,
    }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: iconBg || 'rgba(255,255,255,0.7)',
        color: iconColor || 'var(--text-primary)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        {header}
        {children}
        {footer && <div style={{ marginTop: 14, display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>{footer}</div>}
      </div>
    </div>
  );
}

function AIInsight({ children }) {
  return (
    <div style={{
      marginTop: 12,
      background: 'var(--ai-bg)',
      border: '1px solid var(--ai-border)',
      borderRadius: 9,
      padding: '10px 13px',
      display: 'flex', alignItems: 'center', gap: 9,
      fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.4,
    }}>
      <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
      <span>{children}</span>
    </div>
  );
}

function ToolRow({ icon, label, expandable, badge, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '11px 14px',
      borderBottom: '1px solid var(--border-subtle)',
      cursor: 'pointer', transition: 'background 0.1s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
      <Icon name={icon} size={15} color="var(--text-secondary)" strokeWidth={1.7}/>
      <span style={{ flex: 1, fontSize: 13.5, fontWeight: 500 }}>{label}</span>
      {badge > 0 && (
        <span style={{ fontSize: 11, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: 'var(--status-red-bg)', color: 'var(--status-red)' }}>{badge}</span>
      )}
      <Icon name="chevronRight" size={14} color="var(--text-tertiary)"/>
    </div>
  );
}

function AISuggestedTool({ icon, label, primary, onClick }) {
  return (
    <div style={{ padding: '10px 14px 12px', borderBottom: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginBottom: 8 }}>
        <div style={{
          width: 26, height: 26, borderRadius: 6,
          background: 'var(--bg-muted)', color: 'var(--text-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon name={icon} size={14} strokeWidth={1.7}/>
        </div>
        <span style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ display: 'flex', gap: 6 }}>
        <button className="btn btn-ai btn-sm" onClick={onClick} style={{ flex: 1, justifyContent: 'center', height: 30 }}>
          {primary || 'Open'}
        </button>
        <button className="btn btn-outline btn-sm" onClick={onClick} style={{ width: 30, padding: 0, justifyContent: 'center' }}>
          <Icon name="chevronRight" size={13}/>
        </button>
      </div>
    </div>
  );
}

const RAIL_TOOLS = [
  { icon: 'mail',       label: 'Comms',        color: '#0DBFA8' },
  { icon: 'calculator', label: 'Income Calc',  color: '#7E68FA' },
  { icon: 'upload',     label: 'Request Docs', color: '#2453D6' },
];

// Demo notes — would come from a notes store in production.
const DEMO_NOTES = [
  { id: 1, author: 'Alex Martinez', role: 'Loan Officer', initials: 'AM', avatarColor: '#4A39C9',
    timestamp: 'Yesterday, 3:42 PM',
    body: 'Borrower confirmed via email — fine with the 15-day lock extension. Watching rate movement before locking the float-down.' },
  { id: 2, author: 'Jamie Lee', role: 'Processor', initials: 'JL', avatarColor: '#A8541C',
    timestamp: 'May 22, 11:18 AM',
    body: 'Pulled updated paystub. DTI now at 38% — tight but within guidelines. Income calc note: includes seasonal OT.' },
  { id: 3, author: 'AI Assistant', initials: 'AI', avatarColor: '#6E59E8', ai: true,
    timestamp: 'May 20, 9:04 AM',
    body: 'Detected large deposit ($8,500) on 4/15 — letter of explanation may be needed. Flagged as auto-clearable on next upload.' },
];

const PERSONA_ROLE = { LO: 'Loan Officer', Processor: 'Processor' };

function RailTooltip({ label, visible }) {
  return (
    <div style={{
      position: 'absolute', right: 'calc(100% + 8px)', top: '50%',
      transform: `translateY(-50%) translateX(${visible ? 0 : 6}px)`,
      pointerEvents: 'none',
      opacity: visible ? 1 : 0,
      transition: 'opacity 0.15s ease, transform 0.15s ease',
      background: '#0B1B2B', color: '#fff',
      fontSize: 11.5, fontWeight: 600,
      padding: '4px 9px', borderRadius: 6,
      whiteSpace: 'nowrap',
      boxShadow: '0 2px 8px rgba(0,0,0,0.18)',
      zIndex: 100,
    }}>
      {label}
      {/* Arrow pointing right */}
      <div style={{
        position: 'absolute', right: -4, top: '50%', transform: 'translateY(-50%)',
        width: 0, height: 0,
        borderTop: '4px solid transparent',
        borderBottom: '4px solid transparent',
        borderLeft: '4px solid #0B1B2B',
      }}/>
    </div>
  );
}

function ToolsPanel({ onOpenURLA, onOpenComms, onOpenDocs, onOpenIncome, onOpenNotes }) {
  const [view, setView] = React.useState(null); // null = drawer closed; 'tools' | 'notes' when open
  const [toolTab, setToolTab] = React.useState('mine');
  const [hoveredTool, setHoveredTool] = React.useState(null);

  // Click a view button: toggle if same, switch if different
  const toggleView = (id) => setView(v => v === id ? null : id);

  // Selected-state style for the two view-switching buttons in the rail
  const railNavButton = (isActive) => ({
    width: 32, height: 32, borderRadius: 8, border: 'none',
    background: isActive ? 'var(--text-primary)' : 'var(--bg-muted)',
    color:      isActive ? '#fff' : 'var(--text-secondary)',
    cursor: 'pointer', marginBottom: 6,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    transition: 'background 0.15s, color 0.15s',
  });

  const rail = (
    <aside style={{
      width: 48, flexShrink: 0,
      borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      paddingTop: 6,
    }}>
      {/* Open Tools — view: 'tools' */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => toggleView('tools')}
          aria-label="Open tools panel"
          aria-pressed={view === 'tools'}
          title="Open tools panel"
          style={railNavButton(view === 'tools')}
          onMouseEnter={e => {
            if (view !== 'tools') e.currentTarget.style.background = 'var(--border-subtle)';
            setHoveredTool('__expand');
          }}
          onMouseLeave={e => {
            if (view !== 'tools') e.currentTarget.style.background = 'var(--bg-muted)';
            setHoveredTool(null);
          }}
        >
          <Icon name="command" size={14} color={view === 'tools' ? '#fff' : 'var(--text-secondary)'} aria-hidden="true"/>
        </button>
        <RailTooltip label="Open Tools" visible={hoveredTool === '__expand'}/>
      </div>

      {/* Notes — view: 'notes' (sits above the divider, alongside Open Tools) */}
      <div style={{ position: 'relative' }}>
        <button
          onClick={() => toggleView('notes')}
          aria-label="Notes"
          aria-pressed={view === 'notes'}
          title="Notes"
          style={railNavButton(view === 'notes')}
          onMouseEnter={e => {
            if (view !== 'notes') e.currentTarget.style.background = 'var(--border-subtle)';
            setHoveredTool('__notes');
          }}
          onMouseLeave={e => {
            if (view !== 'notes') e.currentTarget.style.background = 'var(--bg-muted)';
            setHoveredTool(null);
          }}
        >
          <Icon name="doc" size={14} color={view === 'notes' ? '#fff' : 'var(--text-secondary)'} aria-hidden="true"/>
        </button>
        <RailTooltip label="Notes" visible={hoveredTool === '__notes'}/>
      </div>

      <div style={{ width: 28, height: 1, background: 'var(--border-subtle)', margin: '2px 0 6px' }}/>

      {/* Popup-launching tools (below divider) */}
      {RAIL_TOOLS.map(tool => (
        <div key={tool.label} style={{ position: 'relative' }}>
          <button
            onClick={() => {
              if (tool.label === 'Comms') { onOpenComms && onOpenComms(); }
              else if (tool.label === 'Request Docs') { onOpenDocs && onOpenDocs(); }
              else if (tool.label === 'Income Calc') { onOpenIncome && onOpenIncome(); }
            }}
            aria-label={tool.label}
            title={tool.label}
            style={{
              width: 32, height: 36, borderRadius: 8, border: 'none',
              background: 'transparent', cursor: 'pointer', marginBottom: 2,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-muted)'; setHoveredTool(tool.label); }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; setHoveredTool(null); }}
          >
            <Icon name={tool.icon} size={15} color={tool.color} strokeWidth={1.7} aria-hidden="true"/>
          </button>
          <RailTooltip label={tool.label} visible={hoveredTool === tool.label}/>
        </div>
      ))}

      {/* AI suggested dot */}
      <div style={{ marginTop: 6, width: 6, height: 6, borderRadius: '50%', background: 'var(--ai-primary)' }} title="AI suggestions available"/>
    </aside>
  );

  // Drawer (rendered to the LEFT of the rail when a view is selected)
  if (view === null) return rail;

  const isNotes = view === 'notes';
  return (
    <>
    <aside style={{
      width: 280, flexShrink: 0,
      borderLeft: '1px solid var(--border-subtle)',
      background: 'var(--bg-surface)',
      display: 'flex', flexDirection: 'column',
      minHeight: 0, overflowY: 'auto',
    }}>
      {/* Header */}
      <div style={{
        padding: '14px 16px',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex', alignItems: 'center', gap: 8,
        flexShrink: 0,
      }}>
        <Icon name={isNotes ? 'doc' : 'command'} size={15} color="var(--text-secondary)"/>
        <span style={{ fontSize: 14, fontWeight: 600, flex: 1 }}>{isNotes ? 'Notes' : 'Tools'}</span>
        {/* Header action: pop out to its own window for Notes, collapse for Tools */}
        {isNotes ? (
          <button
            onClick={() => { onOpenNotes && onOpenNotes(); setView(null); }}
            title="Pop out into window"
            aria-label="Pop out notes into a new window"
            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="externalLink" size={13} color="var(--text-tertiary)"/>
          </button>
        ) : (
          <button
            onClick={() => setView(null)}
            title="Collapse"
            style={{ width: 24, height: 24, borderRadius: 6, border: 'none', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-muted)'}
            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
          >
            <Icon name="chevronRight" size={14} color="var(--text-tertiary)"/>
          </button>
        )}
      </div>

      {isNotes ? (
        <NotesDrawerBody/>
      ) : (
        <>
          {/* Tabs */}
          <div style={{ padding: '12px 14px 0' }}>
            <div style={{ display: 'flex', background: 'var(--bg-muted)', borderRadius: 8, padding: 3 }}>
              {[{ id: 'mine', label: 'My Tools' }, { id: 'all', label: 'All' }].map(t => (
                <button key={t.id} onClick={() => setToolTab(t.id)} style={{
                  flex: 1, height: 28, border: 'none', borderRadius: 6,
                  background: toolTab === t.id ? 'var(--bg-surface)' : 'transparent',
                  boxShadow: toolTab === t.id ? 'var(--shadow-sm)' : 'none',
                  color: 'var(--text-primary)', fontSize: 12.5, fontWeight: 500,
                  cursor: 'pointer', fontFamily: 'inherit',
                }}>{t.label}</button>
              ))}
            </div>
          </div>

          {/* Stage indicator */}
          <div style={{ padding: '14px 14px 10px' }}>
            <div style={{
              padding: '8px 12px', borderRadius: 8, background: 'var(--bg-muted)',
              fontSize: 12.5, color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span>Stage: <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Underwriting</strong></span>
              <Icon name="chevronDown" size={12} color="var(--text-tertiary)"/>
            </div>
          </div>

          {/* AI Suggested */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 16px', borderTop: '1px solid var(--border-subtle)' }}>
            <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ai-ink)', flex: 1 }}>AI Suggested</span>
            <Icon name="chevronDown" size={13} color="var(--text-tertiary)"/>
          </div>

          <AISuggestedTool icon="calculator" label="Income Calculator" onClick={onOpenIncome}/>
          <AISuggestedTool icon="upload" label="Request Documents" onClick={onOpenDocs}/>
          <AISuggestedTool icon="listCheck" label="Conditions Manager"/>

          {/* Categories */}
          <ToolRow icon="upload" label="Documents & Disclosures" onClick={onOpenDocs}/>
          <ToolRow icon="mail" label="Communication" badge={2} onClick={onOpenComms}/>
          <ToolRow icon="download" label="Reporting & Audit"/>

          <div style={{ flex: 1 }}/>
        </>
      )}
    </aside>
    {rail}
    </>
  );
}

function NotesDrawerBody() {
  const [notes, setNotes] = React.useState(DEMO_NOTES);
  const [draft, setDraft] = React.useState('');

  const post = () => {
    const body = draft.trim();
    if (!body) return;
    setNotes(prev => [{
      id: Date.now(),
      author: 'You',
      role: PERSONA_ROLE[localStorage.getItem('los-persona')] || 'Loan Officer',
      initials: 'YO',
      avatarColor: '#0E1014',
      timestamp: 'Just now',
      body,
    }, ...prev]);
    setDraft('');
  };

  return (
    <>
      {/* Composer */}
      <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <textarea
          value={draft}
          onChange={e => setDraft(e.target.value)}
          placeholder="Add a note for the file…"
          rows={3}
          style={{
            width: '100%', resize: 'vertical', minHeight: 60,
            padding: '8px 10px', borderRadius: 7,
            border: '1px solid var(--border-default)', background: 'var(--bg-surface)',
            fontFamily: 'inherit', fontSize: 12.5, lineHeight: 1.45,
            color: 'var(--text-primary)', outline: 'none',
            boxSizing: 'border-box',
          }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--text-primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border-default)'}
        />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 6 }}>
          <span style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>
            Visible to your team
          </span>
          <button
            onClick={post}
            disabled={!draft.trim()}
            style={{
              height: 26, padding: '0 10px', borderRadius: 6,
              border: 'none', cursor: draft.trim() ? 'pointer' : 'not-allowed',
              background: draft.trim() ? 'var(--text-primary)' : 'var(--bg-muted)',
              color: draft.trim() ? '#fff' : 'var(--text-tertiary)',
              fontFamily: 'inherit', fontSize: 12, fontWeight: 600,
            }}
          >
            Post
          </button>
        </div>
      </div>

      {/* Notes list */}
      <div style={{ padding: '4px 0', flex: 1 }}>
        {notes.length === 0 ? (
          <div style={{ padding: '24px 16px', textAlign: 'center', fontSize: 12.5, color: 'var(--text-tertiary)' }}>
            No notes yet — add one above to start the thread.
          </div>
        ) : (
          notes.map(n => (
            <div key={n.id} style={{
              padding: '12px 14px',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex', gap: 10,
            }}>
              <Avatar initials={n.initials} size={28} color={n.avatarColor}/>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 1 }}>
                  <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--text-primary)' }}>{n.author}</span>
                  {n.ai && (
                    <span style={{
                      display: 'inline-flex', alignItems: 'center', gap: 3,
                      fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
                      padding: '1px 6px', borderRadius: 999,
                      background: 'var(--ai-bg)', color: 'var(--ai-ink)',
                    }}>
                      <Icon name="sparkle" size={9} color="var(--ai-primary)" strokeWidth={1.8}/> AI
                    </span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginBottom: 5, display: 'flex', alignItems: 'center', gap: 6 }}>
                  {n.role && !n.ai && (
                    <>
                      <span>{n.role}</span>
                      <span aria-hidden="true">·</span>
                    </>
                  )}
                  <span>{n.timestamp}</span>
                </div>
                <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.5, wordBreak: 'break-word' }}>{n.body}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </>
  );
}

const PIPELINE_STAGES = [
  { id: 'Application',  label: 'Application',  pct: 10 },
  { id: 'Processing',   label: 'Processing',   pct: 35 },
  { id: 'Underwriting', label: 'Underwriting', pct: 60 },
  { id: 'Approval',     label: 'Approval',     pct: 80 },
  { id: 'Closing',      label: 'Closing',      pct: 90 },
  { id: 'Funded',       label: 'Funded',       pct: 100 },
];

// AI insight lines keyed by loan status
const PROGRESS_INSIGHTS = {
  Application:  'Borrower portal open — 1003 is 62% complete. Missing: employment history, co-borrower SSN.',
  Processing:   'All initial docs received. Appraisal ordered — avg turn time 8 days in this county.',
  Underwriting: 'DU Approve/Eligible. 4 open conditions — AI flagged C-002 as auto-clearable on next upload.',
  Approval:     'Conditional approval issued. 2 remaining conditions both borrower-side — high close probability.',
  Closing:      'CD acknowledged. Title clear. On pace for on-time close — no blocking items.',
  Funded:       'Loan funded and purchased. All post-close conditions satisfied.',
};

// Typical days in each stage (industry baseline)
const STAGE_AVG_DAYS = { Application: 3, Processing: 10, Underwriting: 12, Approval: 5, Closing: 7, Funded: 0 };

// Sub-milestones each stage cycles through. These match the STEPS arrays
// defined in each NowTab* view so the in-page task list and the popover
// off the LoanStatusBar dot reference the same work items.
const STAGE_SUB_MILESTONES = {
  Application: [
    'URLA',
    'Disclosures',
    'Doc Collection',
    'Credit',
    'AUS',
    'Appraisal',
    'Title & Flood',
    'Ready',
  ],
  Processing: [
    'Appraisal',
    'Title & Flood',
    'VOE / VOI',
    'AUS Submit',
    'Stacking Order',
    'Submit to UW',
  ],
  Underwriting: [
    'AUS Review',
    'Conditions',
    'Income Calc',
    'UW Decision',
    'Cond. Approval',
  ],
  Approval: [
    'Review Approval',
    'PTF Conditions',
    'Final Docs',
    'Clear to Close',
    'Notify Parties',
  ],
  Closing: [
    'Send CD',
    'Final VOE',
    'Title Review',
    'Wire Confirm',
    'Schedule',
    'Fund',
  ],
  Funded: [
    'Loan funded',
    'Wire confirmed',
    'Post-close conditions cleared',
    'Loan boarded to servicer',
  ],
};

// Per-loan, per-stage completion overrides (completed sub-milestone count).
// Milestones don't always complete in strict stage order — teams work several
// stages in parallel — so these demo loans show partial progress across
// multiple, non-sequential milestones at once. Loans without an entry fall back
// to the sequential default in getStageSubMilestones(). Counts are clamped to
// each stage's total. (Stage totals: Application 8, Processing 6, Underwriting
// 5, Approval 5, Closing 6, Funded 4.)
const STAGE_PROGRESS_OVERRIDES = {
  // Sarah Anderson — in UW, but Approval/Closing prep already started.
  'LN-2024-0234': { Underwriting: 3, Approval: 2, Closing: 1 },
  // David Chen — moved into Processing without fully finishing Application.
  'LN-2024-0189': { Application: 6, Processing: 3, Underwriting: 1 },
  // Thomas Park — Closing items started ahead of Approval (cash-out refi).
  'LN-2024-0312': { Processing: 4, Underwriting: 2, Closing: 2 },
};

const TODAY_ISO = '2026-05-27';
function daysBackToISO(daysBack) {
  const d = new Date(TODAY_ISO + 'T00:00:00');
  d.setDate(d.getDate() - Math.round(Math.max(0, daysBack)));
  return d.toISOString().slice(0, 10);
}
function isoToHuman(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${months[parseInt(m,10) - 1]} ${parseInt(d,10)}, ${y}`;
}

// Compute sub-milestone completion + dates for a given stage of a given loan.
function getStageSubMilestones(loan, stageId) {
  const list = STAGE_SUB_MILESTONES[stageId] || [];
  const total = list.length;
  if (!loan || total === 0) return { milestones: [], completed: 0, total };

  const order = PIPELINE_STAGES.map(s => s.id);
  const stageIdx = order.indexOf(stageId);
  const currentIdx = order.indexOf(loan.status);

  let completedCount, stageStartedDaysAgo, stageDurationDays;
  if (stageIdx < currentIdx) {
    // Past stage — fully complete. Compute how long ago it ended/started.
    completedCount = total;
    stageDurationDays = STAGE_AVG_DAYS[stageId] || 7;
    let daysAfter = loan.days || 0; // time spent in stages after this one
    for (let i = stageIdx + 1; i < currentIdx; i++) {
      daysAfter += STAGE_AVG_DAYS[order[i]] || 7;
    }
    stageStartedDaysAgo = daysAfter + stageDurationDays;
  } else if (stageIdx === currentIdx) {
    stageDurationDays = STAGE_AVG_DAYS[stageId] || 7;
    stageStartedDaysAgo = loan.days || 0;
    const progress = stageDurationDays > 0 ? Math.min(1, stageStartedDaysAgo / stageDurationDays) : 1;
    completedCount = Math.floor(total * progress);
  } else {
    completedCount = 0;
    stageStartedDaysAgo = 0;
    stageDurationDays = STAGE_AVG_DAYS[stageId] || 7;
  }

  // Non-linear override: some loans complete milestones out of stage order.
  const override = STAGE_PROGRESS_OVERRIDES[loan.id]?.[stageId];
  if (override != null) {
    completedCount = Math.max(0, Math.min(total, override));
    if (!stageStartedDaysAgo) stageStartedDaysAgo = stageDurationDays;
  }

  const milestones = list.map((label, i) => {
    if (i >= completedCount) return { label, date: null, completed: false };
    // Distribute completion dates across the stage's actual duration
    const frac = (i + 1) / total;
    const daysAgo = Math.max(0, stageStartedDaysAgo - frac * stageDurationDays);
    return { label, date: daysBackToISO(daysAgo), completed: true };
  });

  return { milestones, completed: completedCount, total };
}

// Cumulative bar fill % from sub-milestone progress across all stages.
// Each stage gets an equal slice of the bar so the dots stay evenly spaced.
// Exported so the Pipeline's milestone column shows the same % as the loan.
export function getOverallProgress(loan) {
  if (!loan) return 0;
  const segment = 100 / PIPELINE_STAGES.length;
  let total = 0;
  PIPELINE_STAGES.forEach((stage) => {
    const { completed, total: subTotal } = getStageSubMilestones(loan, stage.id);
    if (subTotal === 0) return;
    total += segment * (completed / subTotal);
  });
  return Math.round(total);
}

// ── TRID 6 (the 6 borrower data points that complete a "loan application") ─
const TRID_ITEMS = [
  { key: 'name',      label: 'Borrower name' },
  { key: 'income',    label: 'Borrower income' },
  { key: 'ssn',       label: 'Social Security #' },
  { key: 'property',  label: 'Property address' },
  { key: 'propValue', label: 'Est. property value' },
  { key: 'amount',    label: 'Loan amount sought' },
];

// Quick-scan doc statuses: Rate / LE / CD — derived from the canonical
// `lockStatus` and `disclosures` fields so they always match the loan's stage.
// Derive "last sent" dates for the LE and CD from the loan's disclosure state.
// There are no explicit sent-date fields, so anchor to the closing date: the
// LE goes out early in the file; the CD lands a few days before closing.
function getDisclosureDates(loan) {
  if (!loan || !loan.closingDate) return { leSent: null, cdSent: null };
  const d = (loan.disclosures || '').toLowerCase();
  // Parse the ISO parts into a *local* date so day math doesn't drift across
  // the UTC/local boundary (new Date('YYYY-MM-DD') is parsed as UTC).
  const [cy, cm, cd2] = loan.closingDate.split('-').map(Number);
  const isoMinus = (days) => {
    const x = new Date(cy, cm - 1, cd2);
    x.setDate(x.getDate() - days);
    return `${x.getFullYear()}-${String(x.getMonth() + 1).padStart(2, '0')}-${String(x.getDate()).padStart(2, '0')}`;
  };
  const leWasSent = d === 'le sent' || d.startsWith('cd ') || d === 'funded';
  const cdWasSent = d === 'cd acknowledged' || d === 'funded';
  return {
    leSent: leWasSent ? isoMinus(45) : null,
    cdSent: cdWasSent ? isoMinus(6) : null,
  };
}

// For demo purposes: non-Application loans have all 6 received. Application
// loans progress through the list deterministically based on days-in-stage.
function getTridStatus(loan) {
  if (!loan || loan.status !== 'Application') {
    return { items: TRID_ITEMS.map(i => ({ ...i, received: true })), received: 6, total: 6 };
  }
  // Order in which Application data typically gets collected
  const order = ['name', 'amount', 'ssn', 'income', 'property', 'propValue'];
  const count = Math.min(6, Math.max(2, Math.floor((loan.days || 0) / 2) + 2));
  const received = new Set(order.slice(0, count));
  return {
    items: TRID_ITEMS.map(i => ({ ...i, received: received.has(i.key) })),
    received: count,
    total: 6,
  };
}

// ── Slim row under the loan summary bar: stage progress + TRID tracker ────
function LoanStatusBar({ meta, loan }) {
  const currentStatus = loan?.status ?? meta?.status;
  const progress = React.useMemo(() => loan && loan.status ? getOverallProgress(loan) : (meta?.progress ?? 0), [loan, meta]);
  const trid = getTridStatus(loan);
  const isComplete = trid.received === trid.total;
  const [openStage, setOpenStage] = React.useState(null);

  // Close popover on outside click
  React.useEffect(() => {
    if (!openStage) return;
    const handler = (e) => {
      if (e.target.closest('.stage-popover, .stage-dot-trigger')) return;
      setOpenStage(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openStage]);

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 16,
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '9px 24px',
      whiteSpace: 'nowrap',
      position: 'relative',
      zIndex: 50,
    }}>
      {/* Per-milestone progress bar with clickable stage dots */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, position: 'relative', cursor: 'default' }}>
        {/* Each milestone has its own bar that fills independently. The stage
            matching the loan's current status is highlighted in marigold so the
            active step is scannable on its own — no separate status badge. */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, minWidth: 80 }}>
          {PIPELINE_STAGES.map(stage => (
            <StageSegment
              key={stage.id}
              stage={stage}
              loan={loan}
              isCurrent={stage.id === currentStatus}
              isOpen={openStage === stage.id}
              onToggle={() => setOpenStage(prev => prev === stage.id ? null : stage.id)}
            />
          ))}
        </div>

        <span style={{ fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600, color: 'var(--text-secondary)', minWidth: 32, textAlign: 'right' }}>
          {progress}%
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 22, background: 'var(--border-subtle)', flexShrink: 0 }}/>

      {/* TRID tracker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{
          fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)',
          letterSpacing: '0.06em', textTransform: 'uppercase',
        }}>
          TRID
        </span>
        <span style={{
          fontFamily: 'DM Sans', fontSize: 12, fontWeight: 600,
          color: isComplete ? 'var(--status-green)' : 'var(--text-primary)',
        }}>
          {trid.received}<span style={{ color: 'var(--text-tertiary)' }}>/{trid.total}</span>
        </span>
        <div style={{ display: 'flex', gap: 5 }}>
          {trid.items.map(item => <TridDot key={item.key} item={item}/>)}
        </div>
      </div>

    </div>
  );
}

// ── Per-milestone segment: a dot + its own progress bar that fills based on
// that stage's sub-milestone completion, independent of the other stages.
// Click to open the sub-milestone popover. The segment matching the loan's
// current status is shaded (in the same tone as the status badge) so the
// active milestone is scannable at a glance even if the badge is missed.
function StageSegment({ stage, loan, isCurrent, isOpen, onToggle }) {
  const { completed, total } = getStageSubMilestones(loan, stage.id);
  const pct = total ? Math.round((completed / total) * 100) : 0;
  const done = pct >= 100;
  const started = pct > 0;
  // The active milestone is always highlighted in marigold — a light shade
  // behind the title + bar, with a marigold bar fill and dot — so the current
  // step reads as one and is scannable on its own (replaces the status badge).
  const fillColor = isCurrent ? 'var(--status-amber)' : done ? 'var(--status-green)' : 'var(--status-amber)';
  const dotColor = isCurrent ? 'var(--status-amber)' : done ? 'var(--status-green)' : started ? 'var(--status-amber)' : 'var(--border-default)';

  return (
    <div
      className="stage-dot-trigger"
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      title={`${stage.label} — ${completed}/${total} complete${isCurrent ? ' · current stage' : ''}`}
      aria-label={`${stage.label}: ${pct}% complete${isCurrent ? ' (current stage)' : ''}`}
      aria-current={isCurrent ? 'step' : undefined}
      // Equal padding on every segment so the shaded current one stays aligned;
      // negative vertical margin cancels the height it would otherwise add.
      style={{
        flex: 1, minWidth: 0, position: 'relative', cursor: 'pointer',
        display: 'flex', flexDirection: 'column', gap: 4,
        padding: '4px 7px', margin: '-4px 0', borderRadius: 7,
        background: isCurrent ? 'var(--status-amber-bg)' : 'transparent',
        transition: 'background 0.15s',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, minWidth: 0 }}>
        <span style={{
          width: 6, height: 6, borderRadius: 999, flexShrink: 0, background: dotColor,
          boxShadow: isOpen ? '0 0 0 3px rgba(110,89,232,0.18)' : 'none', transition: 'box-shadow 0.15s',
        }}/>
        <span style={{
          fontSize: 10, fontWeight: isCurrent ? 700 : 600, letterSpacing: '0.01em',
          color: isCurrent ? 'var(--text-primary)' : started ? 'var(--text-secondary)' : 'var(--text-tertiary)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {stage.label}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 999, background: isCurrent ? 'var(--bg-surface)' : 'var(--bg-muted)', overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: fillColor, borderRadius: 999, transition: 'width 0.4s ease' }}/>
      </div>
      {isOpen && <StageMilestonesPopover stage={stage} loan={loan}/>}
    </div>
  );
}

function StageMilestonesPopover({ stage, loan }) {
  const { milestones, completed, total } = getStageSubMilestones(loan, stage.id);
  const order = PIPELINE_STAGES.map(s => s.id);
  const stageIdx = order.indexOf(stage.id);
  const currentIdx = order.indexOf(loan?.status);
  const isDone    = stageIdx < currentIdx;
  const isCurrent = stageIdx === currentIdx;
  const stagePct  = total > 0 ? Math.round((completed / total) * 100) : 0;
  const tonePill  = isDone ? 'green' : isCurrent ? 'blue' : 'neutral';
  const labelPill = isDone ? 'Complete' : isCurrent ? 'In progress' : 'Upcoming';

  return (
    <div className="stage-popover" style={{
      position: 'absolute',
      top: 'calc(100% + 10px)',
      left: '50%',
      transform: 'translateX(-50%)',
      width: 320, zIndex: 600,
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 12, boxShadow: '0 10px 36px rgba(0,0,0,0.18)',
      padding: '14px 16px',
      whiteSpace: 'normal',
    }}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Arrow — combine translate + rotate in one transform so the centering
          translateX isn't applied in the rotated frame (which shifts the
          diamond off-center and lifts it off the popover's top edge). */}
      <div style={{
        position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 10, height: 10,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderBottom: 'none', borderRight: 'none',
      }}/>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--text-primary)' }}>{stage.label}</span>
        <StatusPill tone={tonePill}>{labelPill}</StatusPill>
      </div>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginBottom: 12 }}>
        {completed} of {total} sub-milestones · {stagePct}% complete
      </div>

      {/* Sub-milestone list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 0, marginTop: 4 }}>
        {milestones.map((m, i) => (
          <div key={m.label} style={{
            display: 'flex', alignItems: 'flex-start', gap: 9,
            padding: '7px 0',
            borderTop: i === 0 ? 'none' : '1px solid var(--border-subtle)',
          }}>
            <Icon
              name={m.completed ? 'checkCircle' : 'clock'}
              size={13}
              color={m.completed ? 'var(--status-green)' : 'var(--text-tertiary)'}
              style={{ marginTop: 1, flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 12.5, fontWeight: 500,
                color: m.completed ? 'var(--text-primary)' : 'var(--text-tertiary)',
                lineHeight: 1.35,
              }}>
                {m.label}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 1 }}>
                {m.completed ? `Completed ${isoToHuman(m.date)}` : 'Pending'}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Rich hover popover shown when the user hovers the progress bar.
// Ported from the old ProgressWithTooltip that used to live in LoanHeader.
function ProgressInsightPopover({ meta, loan }) {
  const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === meta?.status);
  const insight = PROGRESS_INSIGHTS[meta?.status] || 'Loan progressing normally.';
  const lockColor = loan?.lockStatus === 'Expiring' ? '#E0A23A'
                  : loan?.lockStatus === 'Floating' ? '#9AA0A6'
                  : '#3DA866';
  const condPct = loan?.conditionsTotal > 0
    ? Math.round(((loan.conditionsTotal - loan.conditionsOpen) / loan.conditionsTotal) * 100)
    : 100;

  return (
    <div style={{
      position: 'absolute', top: 'calc(100% + 12px)', left: '50%', transform: 'translateX(-50%)',
      width: 360, zIndex: 500,
      background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
      borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
      padding: '16px 18px',
      whiteSpace: 'normal',
    }}>
      {/* Arrow — combine translate + rotate in one transform so the centering
          translateX isn't applied in the rotated frame (which shifts the
          diamond off-center and lifts it off the popover's top edge). */}
      <div style={{
        position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%) rotate(45deg)',
        width: 10, height: 10,
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-subtle)',
        borderBottom: 'none', borderRight: 'none',
      }}/>

      {/* Stage ladder */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
        {PIPELINE_STAGES.map((s, i) => {
          const done = i < stageIdx;
          const active = i === stageIdx;
          return (
            <React.Fragment key={s.id}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <div style={{
                  width: active ? 12 : 8, height: active ? 12 : 8, borderRadius: 999,
                  background: done ? 'var(--status-green)' : active ? 'var(--text-primary)' : 'var(--border-default)',
                  border: active ? '2px solid var(--text-primary)' : 'none',
                  boxShadow: active ? '0 0 0 3px rgba(0,0,0,0.08)' : 'none',
                  flexShrink: 0,
                }}/>
                {active && (
                  <span style={{
                    fontSize: 9, fontWeight: 700, color: 'var(--text-primary)',
                    textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap',
                  }}>{s.label}</span>
                )}
              </div>
              {i < PIPELINE_STAGES.length - 1 && (
                <div style={{
                  flex: 1, height: 2,
                  background: done ? 'var(--status-green)' : 'var(--border-subtle)',
                  margin: active ? '0 3px' : '0 2px',
                  marginBottom: active ? 16 : 0,
                }}/>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Key stats row */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Conditions</div>
          <div style={{ fontSize: 13, fontWeight: 700 }}>{condPct}% cleared</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan?.conditionsOpen || 0} remaining</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Rate Lock</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: lockColor }}>{loan?.lockStatus || '—'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan?.lockDays != null ? `${loan.lockDays}d left` : 'Floating'}</div>
        </div>
        <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
          <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>AUS</div>
          <div style={{ fontSize: 12, fontWeight: 700 }}>{loan?.aus || '—'}</div>
          <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan?.dti ? `DTI ${loan.dti}%` : ''}</div>
        </div>
      </div>

      {/* Milestone */}
      {loan?.milestone && (
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
          <Icon name="target" size={12} color="var(--text-tertiary)" strokeWidth={1.8}/>
          <span><strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Current milestone:</strong> {loan.milestone}</span>
        </div>
      )}

      {/* AI insight */}
      <div style={{
        background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
        borderRadius: 8, padding: '9px 12px',
        display: 'flex', gap: 8, alignItems: 'flex-start',
        fontSize: 12, color: 'var(--ai-ink)', lineHeight: 1.5,
      }}>
        <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
        <span>{insight}</span>
      </div>
    </div>
  );
}

function TridDot({ item }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: 14, height: 14 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={{
        width: 10, height: 10, borderRadius: 999,
        background: item.received ? 'var(--status-green)' : 'transparent',
        border: item.received ? 'none' : '1.5px solid var(--border-default)',
        cursor: 'pointer',
        transition: 'all 0.15s',
      }}/>
      {hover && (
        <div role="tooltip" style={{
          position: 'absolute', top: 'calc(100% + 8px)', right: -6,
          background: '#0F1014', color: '#fff',
          padding: '6px 10px', borderRadius: 6,
          fontSize: 11.5, fontWeight: 500, lineHeight: 1.4,
          whiteSpace: 'nowrap', zIndex: 60,
          boxShadow: '0 6px 20px rgba(0,0,0,0.22)',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: '100%', right: 9,
            width: 0, height: 0,
            borderLeft: '5px solid transparent', borderRight: '5px solid transparent',
            borderBottom: '5px solid #0F1014',
          }}/>
          {item.label}{' '}
          <span style={{ color: item.received ? '#7ED4A1' : 'rgba(255,255,255,0.55)' }}>
            · {item.received ? 'Received' : 'Pending'}
          </span>
        </div>
      )}
    </div>
  );
}

// ── Slim stage track: 6px bar with milestone dots, hover for detail ───────
function StageTrack({ meta, loanId }) {
  const status = meta?.status || 'Underwriting';
  const stageIdx = Math.max(0, PIPELINE_STAGES.findIndex(s => s.id === status));
  const loan = LOANS.find(l => l.id === loanId) || {};
  const days = loan?.days ?? 0;

  // Within the current stage, blend toward the next milestone by elapsed time
  const currentStage = PIPELINE_STAGES[stageIdx];
  const nextStage    = PIPELINE_STAGES[stageIdx + 1];
  const stageSpan    = nextStage ? (nextStage.pct - currentStage.pct) : 0;
  const avgDays      = STAGE_AVG_DAYS[status] || 7;
  const intraStage   = nextStage ? Math.min(1, days / avgDays) * stageSpan : 0;
  const fillPct      = currentStage.pct + intraStage;

  return (
    <div style={{
      background: 'var(--bg-surface)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px 14px',
      position: 'relative',
    }}>
      <div style={{ position: 'relative', height: 6 }}>
        {/* Track */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'var(--bg-muted)',
          borderRadius: 999,
        }}/>
        {/* Filled portion */}
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0,
          width: `${fillPct}%`,
          background: 'var(--text-primary)',
          borderRadius: 999,
          transition: 'width 0.4s ease',
        }}/>

        {/* Milestone dots — sit on the bar */}
        {PIPELINE_STAGES.map((stage, i) => (
          <StageDot
            key={stage.id}
            stage={stage}
            isDone={i < stageIdx}
            isCurrent={i === stageIdx}
            days={days}
            avgDays={STAGE_AVG_DAYS[stage.id] || 0}
          />
        ))}
      </div>
    </div>
  );
}

function StageDot({ stage, isDone, isCurrent, days, avgDays }) {
  const [hover, setHover] = React.useState(false);

  const dotSize = isCurrent ? 10 : 7;
  const dotBg   = isCurrent ? 'var(--bg-surface)' : isDone ? 'var(--text-primary)' : 'var(--bg-surface)';
  const border  = isCurrent ? '2px solid var(--text-primary)' : isDone ? 'none' : '1.5px solid var(--border-default)';
  const ring    = isCurrent ? '0 0 0 4px rgba(15,16,20,0.08)' : 'none';

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'absolute',
        left: `${stage.pct}%`,
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 22, height: 22,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        cursor: 'pointer',
      }}
    >
      <div style={{
        width: dotSize, height: dotSize, borderRadius: 999,
        background: dotBg, border, boxShadow: ring,
        transition: 'all 0.15s',
      }}/>

      {hover && (
        <div role="tooltip" style={{
          position: 'absolute',
          top: 'calc(100% + 10px)',
          left: '50%', transform: 'translateX(-50%)',
          width: 230, zIndex: 60,
          background: '#0F1014', color: '#fff',
          padding: '10px 12px', borderRadius: 8,
          fontSize: 12, lineHeight: 1.5,
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          whiteSpace: 'normal',
        }}>
          {/* Arrow */}
          <div style={{
            position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)',
            width: 0, height: 0,
            borderLeft: '6px solid transparent', borderRight: '6px solid transparent',
            borderBottom: '6px solid #0F1014',
          }}/>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <span style={{ fontWeight: 600 }}>{stage.label}</span>
            <span style={{
              fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em',
              padding: '1px 6px', borderRadius: 999,
              background: isCurrent ? 'rgba(255,255,255,0.18)' : isDone ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.06)',
              color: isCurrent ? '#fff' : isDone ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)',
            }}>
              {isCurrent ? 'Current' : isDone ? 'Done' : 'Upcoming'}
            </span>
          </div>

          {isCurrent && (
            <div style={{ color: 'rgba(255,255,255,0.82)' }}>
              {days} day{days !== 1 ? 's' : ''} in stage · {avgDays ? `~${avgDays}d typical` : 'final stage'}
            </div>
          )}
          {isDone && (
            <div style={{ color: 'rgba(255,255,255,0.75)' }}>Completed</div>
          )}
          {!isCurrent && !isDone && (
            <div style={{ color: 'rgba(255,255,255,0.6)' }}>
              Not yet started{avgDays ? ` · ~${avgDays}d typical` : ''}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ProgressWithTooltip({ loanId, meta }) {
  const [hover, setHover] = React.useState(false);
  const pct = meta?.progress || 65;
  const loan = LOANS.find(l => l.id === loanId) || {};
  const stageIdx = PIPELINE_STAGES.findIndex(s => s.id === meta?.status);
  const insight = PROGRESS_INSIGHTS[meta?.status] || 'Loan progressing normally.';

  const lockColor = loan.lockStatus === 'Expiring' ? '#E0A23A' : loan.lockStatus === 'Floating' ? '#9AA0A6' : '#3DA866';
  const condPct = loan.conditionsTotal > 0 ? Math.round(((loan.conditionsTotal - loan.conditionsOpen) / loan.conditionsTotal) * 100) : 100;

  return (
    <div
      style={{ paddingLeft: 16, borderLeft: '1px solid var(--border-subtle)', minWidth: 130, whiteSpace: 'nowrap', position: 'relative' }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div style={statLabel}>Progress</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'default' }}>
        <div style={{ flex: 1, height: 5, borderRadius: 999, background: 'var(--bg-muted)', overflow: 'hidden' }}>
          <div style={{ width: `${pct}%`, height: '100%', background: 'var(--text-primary)', borderRadius: 999, transition: 'width 0.3s' }}/>
        </div>
        <span style={{ fontSize: 12.5, fontWeight: 600 }}>{pct}%</span>
      </div>

      {hover && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)',
          width: 320, zIndex: 500,
          background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)',
          borderRadius: 12, boxShadow: '0 8px 32px rgba(0,0,0,0.18)',
          padding: '16px 18px',
          whiteSpace: 'normal',
        }}>
          {/* Arrow */}
          <div style={{ position: 'absolute', top: -6, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderBottom: 'none', borderRight: 'none', rotate: '45deg' }}/>

          {/* Stage ladder */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 14 }}>
            {PIPELINE_STAGES.map((s, i) => {
              const done = i < stageIdx;
              const active = i === stageIdx;
              return (
                <React.Fragment key={s.id}>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                    <div style={{
                      width: active ? 12 : 8, height: active ? 12 : 8, borderRadius: 999,
                      background: done ? 'var(--status-green)' : active ? 'var(--text-primary)' : 'var(--border-default)',
                      border: active ? '2px solid var(--text-primary)' : 'none',
                      boxShadow: active ? '0 0 0 3px rgba(0,0,0,0.08)' : 'none',
                      flexShrink: 0,
                    }}/>
                    {active && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>{s.label}</span>
                    )}
                  </div>
                  {i < PIPELINE_STAGES.length - 1 && (
                    <div style={{ flex: 1, height: 2, background: done ? 'var(--status-green)' : 'var(--border-subtle)', margin: active ? '0 3px' : '0 2px', marginBottom: active ? 16 : 0 }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>

          {/* Key stats row */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Conditions</div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{condPct}% cleared</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan.conditionsOpen || 0} remaining</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>Rate Lock</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: lockColor }}>{loan.lockStatus || '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan.lockDays != null ? `${loan.lockDays}d left` : 'Floating'}</div>
            </div>
            <div style={{ flex: 1, background: 'var(--bg-muted)', borderRadius: 8, padding: '8px 10px' }}>
              <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>AUS</div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{loan.aus || '—'}</div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{loan.dti ? `DTI ${loan.dti}%` : ''}</div>
            </div>
          </div>

          {/* Milestone */}
          {loan.milestone && (
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 6 }}>
              <Icon name="target" size={12} color="var(--text-tertiary)" strokeWidth={1.8}/>
              <span><strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>Current milestone:</strong> {loan.milestone}</span>
            </div>
          )}

          {/* AI insight */}
          <div style={{
            background: 'var(--ai-bg)', border: '1px solid var(--ai-border)',
            borderRadius: 8, padding: '9px 12px',
            display: 'flex', gap: 8, alignItems: 'flex-start',
            fontSize: 12, color: 'var(--ai-ink)', lineHeight: 1.5,
          }}>
            <Icon name="sparkle" size={12} color="var(--ai-primary)" strokeWidth={1.5} style={{ marginTop: 1, flexShrink: 0 }}/>
            <span>{insight}</span>
          </div>
        </div>
      )}
    </div>
  );
}

function FEMABanner({ fema, onDismiss }) {
  const [lockRequested, setLockRequested] = React.useState(false);
  const [inspectionRequested, setInspectionRequested] = React.useState(false);
  const [dismissed, setDismissed] = React.useState(false);

  if (dismissed) return null;

  return (
    <div style={{
      background: '#FFF1F1',
      borderBottom: '1px solid #FECACA',
      padding: '10px 24px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      {/* Red indicator */}
      <div style={{ width: 32, height: 32, borderRadius: 8, background: '#B91C1C', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        <Icon name="alertOctagon" size={17} color="#fff" strokeWidth={2}/>
      </div>

      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 13.5, fontWeight: 700, color: '#7F1D1D' }}>FEMA Disaster Declaration</span>
          <span style={{ fontSize: 11, fontWeight: 700, background: '#B91C1C', color: '#fff', padding: '2px 7px', borderRadius: 4 }}>{fema.declaration}</span>
          <span style={{ fontSize: 12, color: '#991B1B' }}>{fema.incident} · {fema.county} County</span>
          <span style={{ fontSize: 11.5, color: '#B45309', background: '#FEF3C7', border: '1px solid #FDE68A', padding: '1px 7px', borderRadius: 4, fontWeight: 600 }}>
            Incident: {fema.incidentPeriod}
          </span>
        </div>
        <div style={{ fontSize: 12, color: '#991B1B', marginTop: 3 }}>
          Declared {fema.declaredDate} · Property may require re-inspection before closing
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 6, flexShrink: 0, alignItems: 'center' }}>
        <button className="btn btn-sm" style={{ background: '#B91C1C', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 12, padding: '5px 12px', borderRadius: 6, fontFamily: 'inherit', fontWeight: 600 }}
          onClick={() => window.open('tel:+13055550100', '_self')}>
          <Icon name="phone" size={12}/> Call Borrower
        </button>
        <button className="btn btn-outline btn-sm"
          style={{ fontSize: 12, color: inspectionRequested ? '#166534' : '#991B1B', borderColor: inspectionRequested ? '#166534' : '#FECACA' }}
          onClick={() => setInspectionRequested(true)}>
          {inspectionRequested ? '✓ Re-inspection Requested' : 'Request Re-inspection'}
        </button>
        {fema.lockExtensionAvailable && (
          <button className="btn btn-outline btn-sm"
            style={{ fontSize: 12, color: lockRequested ? '#166534' : '#92400E', borderColor: lockRequested ? '#166534' : '#FDE68A', background: lockRequested ? '#F0FDF4' : '#FFFBEB' }}
            onClick={() => setLockRequested(true)}>
            {lockRequested ? '✓ Lock Extension Filed' : 'Extend Lock'}
          </button>
        )}
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', padding: 4, display: 'flex', alignItems: 'center' }}
          onClick={() => setDismissed(true)}>
          <Icon name="x" size={14}/>
        </button>
      </div>
    </div>
  );
}

// Default progress % per stage, used when LOAN_META has no explicit value
const STAGE_PROGRESS = { Application: 10, Processing: 40, Underwriting: 60, Approval: 80, Closing: 92, Funded: 100 };

// Resolve the header/meta object for a loan. Prefer LOANS data (the canonical
// pipeline source). LOAN_META supplements it with fields LOANS doesn't track
// (coborrower, fuller postal address, custom progress %). If a loan isn't in
// either source, fall back to Sarah Anderson so the page still renders.
function resolveLoanMeta(loanId) {
  const loan = LOANS.find(l => l.id === loanId);
  const override = LOAN_META[loanId];
  if (!loan && !override) return LOAN_META['LN-2024-0234'];
  if (!loan) return override;

  const formattedAmount = loan.amount != null ? `$${loan.amount.toLocaleString('en-US')}` : (override?.amount || '—');
  return {
    borrower:   loan.borrower   || override?.borrower,
    coborrower: loan.coborrower ? `+ ${loan.coborrower.name}` : (override?.coborrower || ''),
    initials:   loan.initials   || override?.initials,
    color:      loan.avatarColor || override?.color,
    // Property is null on Application-stage loans — surface that explicitly
    property:   loan.property || override?.property || 'Property TBD',
    status:     loan.status,                  // LOANS is canonical
    amount:     formattedAmount,
    progress:   override?.progress ?? STAGE_PROGRESS[loan.status] ?? 50,
    closing:    loan.closingDate || override?.closing,
    dti:        loan.dti,
    ltv:        loan.ltv,
    purpose:    loan.loanPurpose,
  };
}

function LoanDetailView({ loanId, tab, onTab, persona = 'LO', previewWorkflow = null }) {
  const localTab = tab || 'now';
  const setTab = onTab || (() => {});
  // Favorited IMS forms — pinned to the loan nav under "Favorites" (global pref).
  const [formFavorites, setFormFavorites] = React.useState(() => {
    try { return JSON.parse(localStorage.getItem('ims-form-favorites') || '[]'); } catch { return []; }
  });
  const toggleFormFavorite = React.useCallback((fid) => {
    setFormFavorites(prev => {
      const next = prev.includes(fid) ? prev.filter(x => x !== fid) : [...prev, fid];
      try { localStorage.setItem('ims-form-favorites', JSON.stringify(next)); } catch (e) { /* ignore */ }
      return next;
    });
  }, []);
  const meta = resolveLoanMeta(loanId);
  const loan = LOANS.find(l => l.id === loanId) || {};
  const isApplication = meta.status === 'Application';
  const [urlaOpen, setUrlaOpen] = React.useState(false);

  // Lifted URLA app state — shared between the 1003 tab and the Borrower
  // Summary tab so edits in one immediately reflect in the other.
  const [urlaApps, setUrlaApps] = React.useState(() => buildInitialAppsForLoan(loanId));
  const [urlaActiveApp, setUrlaActiveApp] = React.useState(0);
  React.useEffect(() => {
    setUrlaApps(buildInitialAppsForLoan(loanId));
    setUrlaActiveApp(0);
  }, [loanId]);
  const updateActiveUrlaApp = React.useCallback((patch) => {
    setUrlaApps(prev => prev.map((a, i) => i === urlaActiveApp ? { ...a, ...patch } : a));
  }, [urlaActiveApp]);
  const commsWindowRef = React.useRef(null);
  const docsWindowRef = React.useRef(null);
  const incomeWindowRef = React.useRef(null);
  const notesWindowRef = React.useRef(null);
  const [dataSubTab, setDataSubTab] = React.useState('overview');

  const openCommsWindow = () => {
    // If already open, just focus it
    if (commsWindowRef.current && !commsWindowRef.current.closed) {
      commsWindowRef.current.focus();
      return;
    }
    const borrower = meta?.borrower || 'Borrower';
    const win = window.open('', `comms-${loanId}`, 'width=520,height=680,resizable=yes,scrollbars=no');
    if (!win) return;
    commsWindowRef.current = win;

    // Set window title
    win.document.title = `Comms — ${borrower} · ${loanId}`;

    // Copy all stylesheets from the parent
    win.document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`;
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        if (sheet.href) {
          const link = win.document.createElement('link');
          link.rel = 'stylesheet'; link.href = sheet.href;
          win.document.head.appendChild(link);
        } else if (sheet.cssRules) {
          const style = win.document.createElement('style');
          style.textContent = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
          win.document.head.appendChild(style);
        }
      } catch (_) {}
    });

    // Mount point
    win.document.body.style.cssText = 'margin:0;padding:0;height:100vh;display:flex;flex-direction:column;background:var(--bg-canvas,#F8F8F6);';
    const mount = win.document.createElement('div');
    mount.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;';
    win.document.body.appendChild(mount);

    // Render CommsTab into the new window
    const root = createRoot(mount);
    root.render(<CommsTab loanId={loanId}/>);

    win.addEventListener('beforeunload', () => { root.unmount(); });
  };

  const openDocsWindow = () => {
    if (docsWindowRef.current && !docsWindowRef.current.closed) {
      docsWindowRef.current.focus();
      return;
    }
    const borrower = meta?.borrower || 'Borrower';
    const win = window.open('', `docs-${loanId}`, 'width=960,height=720,resizable=yes,scrollbars=no');
    if (!win) return;
    docsWindowRef.current = win;

    win.document.title = `Documents — ${borrower} · ${loanId}`;
    win.document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`;
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        if (sheet.href) {
          const link = win.document.createElement('link');
          link.rel = 'stylesheet'; link.href = sheet.href;
          win.document.head.appendChild(link);
        } else if (sheet.cssRules) {
          const style = win.document.createElement('style');
          style.textContent = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
          win.document.head.appendChild(style);
        }
      } catch (_) {}
    });

    win.document.body.style.cssText = 'margin:0;padding:0;height:100vh;display:flex;flex-direction:column;background:var(--bg-canvas,#F8F8F6);';
    const mount = win.document.createElement('div');
    mount.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;';
    win.document.body.appendChild(mount);

    const root = createRoot(mount);
    root.render(<DocumentsTool loanId={loanId} borrowerName={borrower}/>);

    win.addEventListener('beforeunload', () => { root.unmount(); });
  };

  const openIncomeWindow = () => {
    if (incomeWindowRef.current && !incomeWindowRef.current.closed) {
      incomeWindowRef.current.focus();
      return;
    }
    const borrower = meta?.borrower || 'Borrower';
    const win = window.open('', `income-${loanId}`, 'width=900,height=700,resizable=yes,scrollbars=no');
    if (!win) return;
    incomeWindowRef.current = win;

    win.document.title = `Income Calculator — ${borrower} · ${loanId}`;
    win.document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`;
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        if (sheet.href) {
          const link = win.document.createElement('link');
          link.rel = 'stylesheet'; link.href = sheet.href;
          win.document.head.appendChild(link);
        } else if (sheet.cssRules) {
          const style = win.document.createElement('style');
          style.textContent = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
          win.document.head.appendChild(style);
        }
      } catch (_) {}
    });

    win.document.body.style.cssText = 'margin:0;padding:0;height:100vh;display:flex;flex-direction:column;background:var(--bg-canvas,#F8F8F6);';
    const mount = win.document.createElement('div');
    mount.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;overflow:hidden;';
    win.document.body.appendChild(mount);

    const root = createRoot(mount);
    root.render(<IncomeTool loanId={loanId} borrowerName={borrower}/>);

    win.addEventListener('beforeunload', () => { root.unmount(); });
  };

  const openNotesWindow = () => {
    if (notesWindowRef.current && !notesWindowRef.current.closed) {
      notesWindowRef.current.focus();
      return;
    }
    const borrower = meta?.borrower || 'Borrower';
    const win = window.open('', `notes-${loanId}`, 'width=480,height=720,resizable=yes,scrollbars=no');
    if (!win) return;
    notesWindowRef.current = win;

    win.document.title = `Notes — ${borrower} · ${loanId}`;
    win.document.head.innerHTML = `<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">`;
    Array.from(document.styleSheets).forEach(sheet => {
      try {
        if (sheet.href) {
          const link = win.document.createElement('link');
          link.rel = 'stylesheet'; link.href = sheet.href;
          win.document.head.appendChild(link);
        } else if (sheet.cssRules) {
          const style = win.document.createElement('style');
          style.textContent = Array.from(sheet.cssRules).map(r => r.cssText).join('\n');
          win.document.head.appendChild(style);
        }
      } catch (_) {}
    });

    win.document.body.style.cssText = 'margin:0;padding:0;height:100vh;display:flex;flex-direction:column;background:var(--bg-canvas,#F8F8F6);';
    const mount = win.document.createElement('div');
    mount.style.cssText = 'flex:1;display:flex;flex-direction:column;min-height:0;overflow:auto;';
    win.document.body.appendChild(mount);

    const root = createRoot(mount);
    root.render(<NotesDrawerBody/>);

    win.addEventListener('beforeunload', () => { root.unmount(); });
  };

  const openURLA = () => setUrlaOpen(true);
  const closeURLA = () => setUrlaOpen(false);

  const handleTab = (id) => {
    setTab(id);
    if (id !== 'data') setDataSubTab('overview');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0, overflow: 'hidden' }}>
      {/* Fixed top: loan summary + status bar + (optional) FEMA banner */}
      <div style={{ flexShrink: 0 }}>
        <LoanHeader meta={meta} loan={loan} loanId={loanId || 'LN-2024-0234'} onOpenComms={openCommsWindow}/>
        <LoanStatusBar meta={meta} loan={loan}/>
        {/* <StageTrack meta={meta} loanId={loanId || 'LN-2024-0234'}/> */}
        {loan.fema && <FEMABanner fema={loan.fema}/>}
      </div>

      {/* Scrollable region: LeftRail + Main + ToolsPanel.
          Only <main> scrolls vertically; the rails handle their own overflow. */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <LeftRail tab={localTab} onTab={handleTab} onOpenURLA={openURLA} dataSubTab={dataSubTab} onDataSubTab={setDataSubTab} onOpenDocs={openDocsWindow} previewWorkflow={previewWorkflow} loan={loan} favorites={formFavorites}/>

        {/* Main */}
        <main style={{ flex: 1, padding: '24px 28px 40px', overflowY: 'auto', display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {(!localTab || localTab === 'now') && <LoanSummaryCards loan={loan} meta={meta} persona={persona}/>}
          {localTab === 'forms' ? <FormsView loan={loan} favorites={formFavorites} onToggleFavorite={toggleFormFavorite} onOpenForm={(fid) => handleTab('form:' + fid)}/>
           : (typeof localTab === 'string' && localTab.startsWith('form:')) ? <FormDetailView formId={Number(localTab.slice(5))} loan={loan} favorites={formFavorites} onToggleFavorite={toggleFormFavorite} onBack={() => handleTab('forms')}/>
           : localTab === 'story' ? <StoryTab/>
           : localTab === 'data' ? <DataTab subTab={dataSubTab} onOpenURLA={openURLA} loanId={loanId}/>
           : localTab === 'filereview' ? <FileReviewTab borrowerName={meta?.borrower} loanId={loanId}/>
           : localTab === 'conditions' ? <ConditionsTab/>
           : localTab === 'aus' ? <AUSTab/>
           : localTab === 'credit' ? <CreditLiabilitiesTab/>
           : localTab === 'pricing' ? <PricingLockTab/>
           : localTab === 'documents' ? <DocumentsWorkspaceTab/>
           : localTab === 'closing' ? <ClosingTab/>
           : localTab === 'audit' ? <AuditTab/>
           : localTab === 'services' ? <ServicesTab/>
           : localTab === 'borrowerSummary' ? <BorrowerSummaryView loanId={loanId} apps={urlaApps} setApps={setUrlaApps} activeApp={urlaActiveApp} setActiveApp={setUrlaActiveApp} onUpdateApp={updateActiveUrlaApp}/>
           : localTab === 'urla1003' ? <URLA1003View loanId={loanId} apps={urlaApps} setApps={setUrlaApps} activeApp={urlaActiveApp} setActiveApp={setUrlaActiveApp}/>
           : (!localTab || localTab === 'now') ? (
               isApplication ? <NowTabApplication borrowerName={meta.borrower} loanId={loanId} loan={loan} onOpenURLA={openURLA}/>
               : meta.status === 'Processing' ? <NowTabProcessing borrowerName={meta.borrower} loanId={loanId} loan={loan}/>
               : meta.status === 'Underwriting' ? <NowTabUnderwriting borrowerName={meta.borrower} loanId={loanId} loan={loan} fema={loan.fema || null}/>
               : meta.status === 'Closing' ? <NowTabClosing borrowerName={meta.borrower} loanId={loanId} loan={loan}/>
               : meta.status === 'Approval' ? <ApprovalTasks loanId={loanId}/>
               : <NowTab/>
             )
           /* Any configured page without built-out content renders a blank placeholder. */
           : <PlaceholderTab label={humanizeTab(localTab)}/>}
        </main>

        <ToolsPanel onOpenURLA={openURLA} onOpenComms={openCommsWindow} onOpenDocs={openDocsWindow} onOpenIncome={openIncomeWindow} onOpenNotes={openNotesWindow}/>
      </div>

      {urlaOpen && ReactDOM.createPortal(
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, display: 'flex', flexDirection: 'column', background: 'var(--bg-canvas)' }}>
          <URLAView borrowerName={meta.borrower} loanId={loanId} onClose={closeURLA} onSubmit={closeURLA}/>
        </div>,
        document.body
      )}
    </div>
  );
}

// Borrower Summary tab — mirrors Section 1 (Borrower Info) of the URLA 1003.
// Fields are bidirectionally linked to the 1003 via shared `app` state at
// LoanDetailView, so edits here propagate to the 1003 and vice versa.
function BorrowerSummaryView({ loanId, apps, setApps, activeApp, setActiveApp, onUpdateApp }) {
  const app = apps && apps[activeApp];
  if (!app) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <PageHeader
        icon="doc"
        title="Borrower Info"
        actions={<>
          <button className="btn btn-outline btn-sm"><Icon name="download" size={13}/> Export PDF</button>
          <button className="btn btn-primary btn-sm"><Icon name="doc" size={13}/> Save</button>
        </>}
      />
      <BorrowerApplicationTabs
        loanId={loanId}
        apps={apps}
        setApps={setApps}
        activeApp={activeApp}
        setActiveApp={setActiveApp}
      />
      <SectionBorrowerInfo app={app} onUpdateApp={onUpdateApp}/>
    </div>
  );
}

// Generic empty-state placeholder used for Forms and other workspace stubs.
function FormPlaceholder({ title, description, icon = 'doc' }) {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '60px 24px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon name={icon} size={26} color="var(--text-tertiary)" strokeWidth={1.6}/>
      </div>
      <h2 style={{
        margin: 0, fontSize: 17, fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
      }}>
        {title}
      </h2>
      <div style={{
        fontSize: 13.5, color: 'var(--text-tertiary)',
        marginTop: 6, maxWidth: 380, lineHeight: 1.5,
      }}>
        {description}
      </div>
    </div>
  );
}

// Placeholder Credit & Liabilities workspace — empty state for now
function CreditLiabilitiesTab() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '60px 24px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon name="database" size={26} color="var(--text-tertiary)" strokeWidth={1.6}/>
      </div>
      <h2 style={{
        margin: 0, fontSize: 17, fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
      }}>
        Credit &amp; Liabilities
      </h2>
      <div style={{
        fontSize: 13.5, color: 'var(--text-tertiary)',
        marginTop: 6, maxWidth: 380, lineHeight: 1.5,
      }}>
        This workspace is empty. Credit report details, tradelines, dispute tracking,
        and liability calculations will live here.
      </div>
    </div>
  );
}

// Placeholder Documents workspace — empty state for now
function DocumentsWorkspaceTab() {
  return (
    <div style={{
      flex: 1, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '60px 24px',
      color: 'var(--text-secondary)',
    }}>
      <div style={{
        width: 56, height: 56, borderRadius: 14,
        background: 'var(--bg-muted)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 16,
      }}>
        <Icon name="doc" size={26} color="var(--text-tertiary)" strokeWidth={1.6}/>
      </div>
      <h2 style={{
        margin: 0, fontSize: 17, fontWeight: 600,
        color: 'var(--text-primary)', letterSpacing: '-0.01em',
      }}>
        Documents
      </h2>
      <div style={{
        fontSize: 13.5, color: 'var(--text-tertiary)',
        marginTop: 6, maxWidth: 360, lineHeight: 1.5,
      }}>
        This workspace is empty. Document organization, version tracking, and bulk
        actions will live here.
      </div>
    </div>
  );
}

// Turn a content-tab / page id into a readable title for placeholder pages.
function humanizeTab(tab) {
  if (!tab) return 'Page';
  const cleaned = String(tab)
    .replace(/^custom[-_]/, '')          // drop the custom- prefix
    .replace(/[-_]p_[a-z0-9_]+$/i, '')   // drop the generated id suffix
    .replace(/[-_]/g, ' ')               // hyphens/underscores → spaces
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2') // split camelCase
    .trim();
  return cleaned ? cleaned.replace(/\b\w/g, c => c.toUpperCase()) : 'Page';
}

// Blank placeholder shown for a configured page whose content isn't built yet.
function PlaceholderTab({ label }) {
  return (
    <div style={{ padding: '64px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 56, height: 56, borderRadius: 14, background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon name="doc" size={26} color="var(--text-tertiary)" strokeWidth={1.6}/>
      </div>
      <div style={{ fontSize: 17, fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>{label || 'Page'}</div>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 380, lineHeight: 1.55 }}>
        This page is a placeholder — content for <strong style={{ color: 'var(--text-secondary)' }}>{label || 'this page'}</strong> hasn’t been built yet.
      </div>
    </div>
  );
}

function NowTab() {
  return (
    <>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
        What Needs Your Attention
      </h2>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 18 }}>
        AI-curated priority list for this loan
      </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 760 }}>
            {/* URGENT */}
            <ActionCard
              defaultOpen
              tone="red"
              icon={<Icon name="alertOctagon" size={18} strokeWidth={1.7}/>}
              iconBg="#F8DCD4" iconColor="#B33222"
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap' }}>URGENT — Missing Documents (2)</span>
                  <StatusPill tone="red">High Priority</StatusPill>
                </div>
              }
              footer={<>
                <button className="btn btn-primary btn-sm">
                  <Icon name="phone" size={13}/> Request via Text
                </button>
                <button className="btn btn-outline btn-sm">
                  <Icon name="mail" size={13}/> Request via Email
                </button>
                <button className="btn btn-outline btn-sm">
                  <Icon name="upload" size={13}/> Upload Myself
                </button>
                <button className="btn btn-outline btn-sm">Assign to processor</button>
              </>}
            >
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Bank statements (3 months) blocking underwriting review.
              </div>
              <AIInsight>Borrower was active 15 min ago — likely to respond quickly if you request now</AIInsight>
            </ActionCard>

            {/* Conditions */}
            <ActionCard
              tone="amber"
              icon={<Icon name="listCheck" size={18} color="#9C6A1A" strokeWidth={1.7}/>}
              iconBg="#F6E6BD"
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap' }}>4 Open Conditions</span>
                  <StatusPill tone="amber">2 prior-to-doc</StatusPill>
                </div>
              }
              footer={<>
                <button className="btn btn-outline btn-sm">Open conditions manager</button>
                <button className="btn btn-outline btn-sm">Bulk clear</button>
              </>}
            >
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 6, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <div>• Letter of explanation — large deposit (3/14)</div>
                <div>• Updated VOE — within 10 days of closing</div>
                <div>• Hazard insurance binder — 1 year prepaid</div>
                <div>• Subject property final inspection</div>
              </div>
            </ActionCard>

            {/* AI Completed */}
            <ActionCard
              tone="green"
              icon={<Icon name="sparkle" size={18} color="var(--ai-primary)" strokeWidth={1.5}/>}
              iconBg="rgba(255,255,255,0.85)"
              header={
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14.5, fontWeight: 600, whiteSpace: 'nowrap' }}>AI Completed — Income Verified</span>
                  <StatusPill tone="green">95% Confidence</StatusPill>
                </div>
              }
              footer={<>
                <button className="btn btn-outline btn-sm">View Calculation</button>
                <button className="btn btn-outline btn-sm">
                  <Icon name="chevronRight" size={13}/> Pop Out
                </button>
                <button className="btn btn-outline btn-sm">Override</button>
                <button className="btn btn-success btn-sm">
                  <Icon name="check" size={13} strokeWidth={2.2}/> Mark verified
                </button>
              </>}
            >
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr',
                gap: 18, marginTop: 12,
                padding: 14,
                background: 'rgba(255,255,255,0.7)',
                border: '1px solid rgba(215, 232, 218, 0.6)',
                borderRadius: 9,
              }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>Total Income</div>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>$100,000/year</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>
                    W2: $85K + Part-time: $15K
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 4 }}>DTI Ratio</div>
                  <div style={{ fontSize: 17, fontWeight: 600 }}>38%</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--status-green)', marginTop: 4 }}>
                    <Icon name="check" size={11} strokeWidth={2.5}/> Within guidelines
                  </div>
                </div>
              </div>
            </ActionCard>

            {/* Ready to Advance */}
            <ActionCard
              tone="green"
              icon={<Icon name="checkCircle" size={18} color="#1F7A45" strokeWidth={1.85}/>}
              iconBg="rgba(255,255,255,0.85)"
              header={
                <div style={{ fontSize: 14.5, fontWeight: 600 }}>Ready to Advance</div>
              }
              footer={<>
                <button className="btn btn-primary btn-sm">
                  <Icon name="arrowRight" size={13}/> Advance to Approval
                </button>
                <button className="btn btn-outline btn-sm">Review checklist</button>
                <button className="btn btn-outline btn-sm">Reassign</button>
              </>}
            >
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                All underwriting conditions met. 1 of 11 conditions outstanding, none blocking.
              </div>
              <AIInsight>AI suggests: Advance to Approval. All automated checks passed; 1 non-blocking condition can clear in Approval.</AIInsight>
            </ActionCard>

            {/* Waiting on Appraisal */}
            <ActionCard
              tone="neutral"
              icon={<Icon name="clock" size={18} color="var(--text-secondary)" strokeWidth={1.7}/>}
              iconBg="var(--bg-muted)"
              header={<div style={{ fontSize: 14.5, fontWeight: 600 }}>Waiting on Appraisal</div>}
              footer={<>
                <button className="btn btn-outline btn-sm">Check Status</button>
                <button className="btn btn-outline btn-sm">Follow Up</button>
              </>}
            >
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                Ordered 3 days ago from ABC Appraisal Co. Expected completion: Tomorrow
              </div>
            </ActionCard>
      </div>
    </>
  );
}

/* ============= STORY TAB ============= */

const LOAN_PHASES = [
  { id: 'pre-qual',      label: 'Pre-Qual'     },
  { id: 'pre-approval',  label: 'Pre-Approval' },
  { id: 'application',   label: 'Application'  },
  { id: 'processing',    label: 'Processing'   },
  { id: 'underwriting',  label: 'Underwriting' },
  { id: 'approval',      label: 'Approval'     },
  { id: 'closing',       label: 'Closing'      },
];

// Badge colors still used on individual events
const PHASE_BADGE = {
  'pre-qual':     { color: '#7C6FCD', bg: 'rgba(124,111,205,0.12)' },
  'pre-approval': { color: '#3A8294', bg: 'rgba(58,130,148,0.12)'  },
  'application':  { color: '#2A8C53', bg: 'rgba(42,140,83,0.12)'   },
  'processing':   { color: '#C08C2A', bg: 'rgba(192,140,42,0.12)'  },
  'underwriting': { color: '#C25535', bg: 'rgba(194,85,53,0.12)'   },
  'approval':     { color: '#3A6BAD', bg: 'rgba(58,107,173,0.12)'  },
  'closing':      { color: '#7B3FA0', bg: 'rgba(123,63,160,0.12)'  },
};

const STORY_EVENTS = [
  { day: 'Today, May 21, 2026', items: [
    { time: '8:02 AM', phase: 'underwriting', type: 'fema', title: 'FEMA Disaster Flag Added',
      body: 'Property flagged under FEMA declaration DR-4830-FL',
      details: ['Incident: Hurricane Milton', 'County: Miami-Dade', 'Declared: May 19, 2026', 'Incident period: May 16–21, 2026'],
      aiInsight: 'Fannie Mae requires re-inspection certification. Lock extension may be available — contact secondary desk to preserve rate.' },
  ]},
  { day: 'May 19, 2026', items: [
    { time: '9:15 AM', phase: 'underwriting', type: 'doc', title: 'Documents Uploaded',
      body: 'Sarah Anderson uploaded 2 files',
      details: ['Bank_Statement_March.pdf', 'Bank_Statement_April.pdf'],
      aiInsight: 'Validated format, detected $45K balance' },
    { time: '8:45 AM', phase: 'underwriting', type: 'ai', title: 'Automation Completed',
      body: 'Income calculation finished',
      details: ['Result: $100K/year, DTI 38%'],
      aiInsight: 'Within guidelines, approved automatically' },
    { time: '7:30 AM', phase: 'underwriting', type: 'status', title: 'Status Change',
      body: 'Moved to Underwriting',
      details: ['By: Alex Martinez'] },
  ]},
  { day: 'Yesterday, May 20, 2026', items: [
    { time: '4:22 PM', phase: 'processing', type: 'comm', title: 'Email Sent',
      body: 'Document request sent to borrower',
      details: ['To: sarah.anderson@email.com', 'Subject: Additional documentation needed for LN-2024-0267'],
      aiInsight: 'AI drafted email based on missing condition list' },
    { time: '2:10 PM', phase: 'processing', type: 'ai', title: 'AI Insight',
      body: 'Borrower active on portal',
      details: ['Spent 8 min reviewing offer details', 'High engagement signal'],
      aiInsight: 'Likely to respond to outreach within 24h' },
    { time: '11:45 AM', phase: 'processing', type: 'doc', title: 'Appraisal Ordered',
      body: 'Appraisal request sent to ABC Appraisal Co.',
      details: ['Order #: APR-29841', 'Expected: May 19, 2026'] },
  ]},
  { day: 'May 14, 2026', items: [
    { time: '3:18 PM', phase: 'processing', type: 'status', title: 'Rate Locked',
      body: '6.875% locked for 45 days',
      details: ['Lock expires: June 24, 2026'] },
    { time: '10:02 AM', phase: 'application', type: 'doc', title: 'Application Submitted',
      body: 'Loan application LN-2024-0267 created',
      details: ['Loan amount: $425,000', 'Product: Conventional 30yr fixed'],
      aiInsight: 'Prequalification confidence: 94%' },
  ]},
  { day: 'May 10, 2026', items: [
    { time: '2:30 PM', phase: 'application', type: 'status', title: 'Application Started',
      body: '1003 opened and partially completed',
      details: ['By: Sarah Anderson (borrower portal)'] },
    { time: '11:00 AM', phase: 'pre-approval', type: 'doc', title: 'Pre-Approval Issued',
      body: 'Conditional pre-approval letter generated',
      details: ['Amount: $425,000', 'Valid through: Jun 10, 2026'],
      aiInsight: 'Credit score 742 — strong approval likelihood' },
  ]},
  { day: 'May 6, 2026', items: [
    { time: '9:45 AM', phase: 'pre-qual', type: 'status', title: 'Pre-Qualification Complete',
      body: 'Soft credit pull completed, borrower qualified',
      details: ['DTI: 38%', 'Est. purchase price: $530K'],
      aiInsight: 'AI scored lead 91/100 — high conversion probability' },
    { time: '9:00 AM', phase: 'pre-qual', type: 'comm', title: 'Initial Inquiry',
      body: 'Sarah Anderson submitted web inquiry',
      details: ['Source: Zillow referral', 'LO assigned: Alex Martinez'] },
  ]},
];

const STORY_TYPE_META = {
  doc:    { bg: 'var(--bg-muted)',         color: 'var(--text-secondary)', icon: 'doc' },
  ai:     { bg: 'var(--ai-bg)',            color: 'var(--ai-primary)',     icon: 'sparkle' },
  status: { bg: 'var(--status-green-bg)',  color: 'var(--status-green)',   icon: 'trendingUp' },
  comm:   { bg: 'var(--status-blue-bg)',   color: 'var(--status-blue)',    icon: 'mail' },
  fema:   { bg: '#FEE2E2',                 color: '#B91C1C',               icon: 'alertOctagon' },
};

function LOSummaryTabs() {
  const [active, setActive] = React.useState('briefing');

  const tabs = [
    { id: 'briefing', label: 'AI Briefing' },
    { id: 'strip',    label: 'Status Strip' },
    { id: 'pulse',    label: 'Timeline + Pulse' },
  ];

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 12, marginBottom: 24, overflow: 'hidden' }}>
      {/* Tab bar */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border-subtle)' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActive(t.id)} style={{
            padding: '10px 16px', border: 'none', background: 'none', cursor: 'pointer',
            fontSize: 12.5, fontWeight: active === t.id ? 700 : 500, fontFamily: 'inherit',
            color: active === t.id ? 'var(--text-primary)' : 'var(--text-tertiary)',
            borderBottom: active === t.id ? '2px solid var(--text-primary)' : '2px solid transparent',
            marginBottom: -1, transition: 'all 0.12s',
          }}>{t.label}</button>
        ))}
        <div style={{ flex: 1 }}/>
        <span style={{ padding: '10px 14px', fontSize: 11, color: 'var(--text-tertiary)', alignSelf: 'center' }}>LO view · Michael Oben</span>
      </div>

      {/* Option 1 — AI Briefing */}
      {active === 'briefing' && (
        <div style={{ padding: '14px 16px', display: 'flex', gap: 10 }}>
          <Icon name="sparkle" size={14} color="var(--ai-primary)" strokeWidth={1.5} style={{ flexShrink: 0, marginTop: 2 }}/>
          <div style={{ fontSize: 13.5, color: 'var(--text-primary)', lineHeight: 1.65 }}>
            Oben's file is in good shape — UW issued conditional approval May 18 and 2 of 4 PTF conditions are already cleared.{' '}
            <span style={{ color: '#D97706', fontWeight: 600 }}>Rate lock expires tomorrow</span> — extend now or the loan reprices at +$287/mo.{' '}
            Borrower still hasn't acknowledged the CD.{' '}
            <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>Worth a call today before the offer window closes.</span>
          </div>
        </div>
      )}

      {/* Option 2 — Status Strip */}
      {active === 'strip' && (
        <div style={{ padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
          {[
            { icon: '📍', label: 'Conditional Approval', tone: 'green' },
            { icon: '🔒', label: 'Lock exp May 21', tone: 'red' },
            { icon: '✓',  label: '2 / 4 PTF cleared', tone: 'neutral' },
            { icon: '🗓', label: 'Closing Jun 12', tone: 'neutral' },
            { icon: '⚠',  label: 'CD not acknowledged', tone: 'amber' },
          ].map((c, i) => (
            <React.Fragment key={i}>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 10px', borderRadius: 999, fontSize: 12.5, fontWeight: 600,
                background: c.tone === 'green' ? '#E7F8F1' : c.tone === 'red' ? '#FEE2E2' : c.tone === 'amber' ? '#FEF6E7' : 'var(--bg-muted)',
                color:      c.tone === 'green' ? '#065F46' : c.tone === 'red' ? '#991B1B' : c.tone === 'amber' ? '#92400E' : 'var(--text-secondary)',
              }}>
                {c.icon} {c.label}
              </span>
              {i < 4 && <span style={{ color: 'var(--border-default)', fontSize: 16, lineHeight: 1 }}>·</span>}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Option 3 — Timeline + Pulse */}
      {active === 'pulse' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* Mini timeline */}
          <div style={{ padding: '12px 16px', borderRight: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Recent</div>
            {[
              { date: 'May 19', label: 'Appraisal cleared by UW', dot: '#0E9F6E' },
              { date: 'May 18', label: 'Conditional approval issued', dot: '#0E9F6E' },
              { date: 'May 17', label: 'CD delivered to borrower', dot: '#2453D6' },
            ].map((e, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: e.dot, marginTop: 4, flexShrink: 0 }}/>
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 500, color: 'var(--text-primary)' }}>{e.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{e.date}</div>
                </div>
              </div>
            ))}
          </div>
          {/* Pulse indicators */}
          <div style={{ padding: '12px 16px' }}>
            <div style={{ fontSize: 10.5, fontWeight: 700, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 10 }}>Live status</div>
            {[
              { label: 'Rate lock', value: 'Expires tomorrow', dot: '#EF4444' },
              { label: 'Conditions', value: '2 of 4 cleared — on pace', dot: '#0E9F6E' },
              { label: 'Borrower engagement', value: 'CD pending — no response', dot: '#D97706' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: p.dot, flexShrink: 0 }}/>
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{p.label} · </span>
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{p.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StoryTab() {
  const [filter, setFilter] = React.useState('all');

  const filtered = STORY_EVENTS.map(day => ({
    ...day,
    items: filter === 'all' ? day.items : day.items.filter(i => i.phase === filter),
  })).filter(d => d.items.length > 0);

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
        marginBottom: 22,
      }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>
            Complete Loan Timeline
          </h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4 }}>
            Every event from loan number to today
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline btn-sm" style={{ height: 34 }}>
            <Icon name="filter" size={13}/>
            Filter
          </button>
          <button className="btn btn-outline btn-sm" style={{ height: 34 }}>
            <Icon name="download" size={13}/>
            Export Timeline
          </button>
        </div>
      </div>

      {/* LO summary — only on All tab */}
      {filter === 'all' && <LOSummaryTabs/>}

      {/* Stepper track filter */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          {/* "All" reset pill */}
          <button
            onClick={() => setFilter('all')}
            style={{
              height: 26, padding: '0 11px', marginRight: 16,
              borderRadius: 999, border: '1px solid ' + (filter === 'all' ? 'var(--text-primary)' : 'var(--border-subtle)'),
              background: filter === 'all' ? 'var(--text-primary)' : 'transparent',
              color: filter === 'all' ? '#fff' : 'var(--text-tertiary)',
              fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
              flexShrink: 0, transition: 'all 0.12s',
            }}
          >All</button>

          {/* Connected stepper */}
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {LOAN_PHASES.map((phase, i) => {
              const active = filter === phase.id;
              const last = i === LOAN_PHASES.length - 1;
              return (
                <React.Fragment key={phase.id}>
                  <button
                    onClick={() => setFilter(phase.id)}
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                      background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                      padding: 0, flexShrink: 0,
                    }}
                  >
                    <div style={{
                      width: active ? 14 : 10,
                      height: active ? 14 : 10,
                      borderRadius: 999,
                      background: active ? 'var(--text-primary)' : 'var(--border-default)',
                      border: active ? '2.5px solid var(--text-primary)' : '2px solid var(--border-default)',
                      boxShadow: active ? '0 0 0 3px var(--bg-muted)' : 'none',
                      transition: 'all 0.15s',
                    }}/>
                    <span style={{
                      fontSize: 11, fontWeight: active ? 700 : 500,
                      color: active ? 'var(--text-primary)' : 'var(--text-tertiary)',
                      whiteSpace: 'nowrap', letterSpacing: active ? '-0.01em' : 0,
                      transition: 'all 0.15s',
                    }}>{phase.label}</span>
                  </button>
                  {!last && (
                    <div style={{
                      flex: 1, height: 2, marginBottom: 18,
                      background: 'var(--border-subtle)',
                      minWidth: 16,
                    }}/>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 720 }}>
        {filtered.map((day, di) => (
          <div key={di} style={{ marginBottom: 24 }}>
            <div style={{
              fontSize: 13, fontWeight: 600, color: 'var(--text-primary)',
              marginBottom: 16,
            }}>{day.day}</div>

            <div style={{ position: 'relative' }}>
              {/* Vertical line */}
              <div style={{
                position: 'absolute',
                left: 17, top: 8, bottom: 8,
                width: 2, background: 'var(--border-subtle)',
                borderRadius: 2,
              }}/>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
                {day.items.map((ev, i) => (
                  <StoryEvent key={i} event={ev}/>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function StoryEvent({ event }) {
  const meta = STORY_TYPE_META[event.type] || STORY_TYPE_META.doc;
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
      <div style={{
        width: 36, height: 36, borderRadius: 9,
        background: meta.bg, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0, position: 'relative', zIndex: 1,
        border: '2px solid var(--bg-app)',
      }}>
        <Icon name={meta.icon} size={16} strokeWidth={1.7}/>
      </div>

      <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 12.5, color: 'var(--text-tertiary)', fontFamily: 'DM Sans', fontWeight: 500 }}>
            {event.time}
          </span>
          <span style={{ fontSize: 14, fontWeight: 600 }}>{event.title}</span>
          {event.phase && (() => {
            const p = PHASE_BADGE[event.phase];
            const ph = LOAN_PHASES.find(ph => ph.id === event.phase);
            return p && ph ? (
              <span style={{
                fontSize: 10.5, fontWeight: 600, padding: '2px 8px', borderRadius: 999,
                background: p.bg, color: p.color, border: '1px solid ' + p.color + '55',
                letterSpacing: '0.02em',
              }}>{ph.label}</span>
            ) : null;
          })()}
        </div>
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', marginTop: 5 }}>
          {event.body}
        </div>
        {event.details && (
          <ul style={{
            margin: '8px 0 0', padding: 0, listStyle: 'none',
            display: 'flex', flexDirection: 'column', gap: 4,
          }}>
            {event.details.map((d, i) => (
              <li key={i} style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                <span style={{ color: 'var(--text-tertiary)', marginRight: 6 }}>•</span>
                {d}
              </li>
            ))}
          </ul>
        )}
        {event.aiInsight && (
          <div style={{
            marginTop: 12,
            background: 'var(--ai-bg)',
            border: '1px solid var(--ai-border)',
            borderRadius: 9,
            padding: '10px 13px',
            display: 'inline-flex', alignItems: 'center', gap: 9,
            fontSize: 13, color: 'var(--ai-ink)', lineHeight: 1.4,
          }}>
            <Icon name="sparkle" size={13} color="var(--ai-primary)" strokeWidth={1.5}/>
            <span>{event.aiInsight}</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ============= DATA TAB ============= */

function DataAccordion({ icon, title, badge, defaultOpen = false, children }) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="card" style={{ overflow: 'hidden' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        width: '100%',
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px',
        background: 'transparent', border: 'none',
        cursor: 'pointer', fontFamily: 'inherit',
        textAlign: 'left',
      }}>
        <Icon name={icon} size={16} color="var(--text-secondary)" strokeWidth={1.85}/>
        <span style={{ fontSize: 15, fontWeight: 600, flex: 1 }}>{title}</span>
        {badge}
        <Icon name={open ? 'chevronUp' : 'chevronDown'} size={15} color="var(--text-tertiary)"/>
      </button>
      {open && (
        <div style={{
          padding: '4px 20px 20px',
          borderTop: '1px solid var(--border-subtle)',
        }}>{children}</div>
      )}
    </div>
  );
}

function FieldPair({ label, value, mono, readOnly }) {
  const [editing, setEditing] = React.useState(false);
  const [draft, setDraft] = React.useState(value);
  const [saved, setSaved] = React.useState(false);
  const inputRef = React.useRef(null);

  const commit = () => {
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  };

  const cancel = () => {
    setDraft(draft); // keep last committed value
    setEditing(false);
  };

  React.useEffect(() => {
    if (editing && inputRef.current) inputRef.current.select();
  }, [editing]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>{label}</span>
        {saved && (
          <span style={{ fontSize: 11, color: 'var(--status-green)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
            <svg width="9" height="9" viewBox="0 0 12 12" fill="none"><polyline points="2,6 5,9 10,3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Saved
          </span>
        )}
      </div>
      {editing ? (
        <input
          ref={inputRef}
          value={draft}
          onChange={e => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); commit(); } if (e.key === 'Escape') cancel(); }}
          style={{
            width: '100%', padding: '4px 7px',
            fontSize: 15, fontWeight: 500, letterSpacing: '-0.005em',
            fontFamily: mono ? 'DM Sans' : 'inherit',
            border: '1.5px solid var(--ai-primary)', borderRadius: 5,
            outline: 'none', background: 'var(--bg-surface)',
            color: 'var(--text-primary)', boxSizing: 'border-box',
          }}
        />
      ) : (
        <div
          onClick={() => { if (!readOnly) setEditing(true); }}
          title={readOnly ? undefined : 'Click to edit'}
          style={{
            fontSize: 17, fontWeight: 500, letterSpacing: '-0.005em',
            fontFamily: mono ? 'DM Sans' : 'inherit',
            cursor: readOnly ? 'default' : 'text',
            padding: '3px 7px', margin: '0 -7px',
            borderRadius: 5, border: '1.5px solid transparent',
            transition: 'border-color 0.12s, background 0.12s',
          }}
          onMouseEnter={e => { if (!readOnly) { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-muted)'; } }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
        >
          {draft}
        </div>
      )}
    </div>
  );
}

function LibrarySubTab({ tab, onOpenURLA }) {
  const [sortMode, setSortMode]   = React.useState('all');
  const [query, setQuery]         = React.useState('');
  const [selected, setSelected]   = React.useState(null);

  const key = tab.charAt(0).toUpperCase() + tab.slice(1); // 'forms' → 'Documents'
  let items = (FORMS_LIBRARY[key] || []).slice();
  if (sortMode === 'alpha') items.sort((a, b) => a.name.localeCompare(b.name));
  if (query.trim()) items = items.filter(i => i.name.toLowerCase().includes(query.toLowerCase()));

  const handleOpen = () => {
    if (selected?.startsWith('1003') && onOpenURLA) onOpenURLA();
  };

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>{key}</h2>
          <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 3 }}>
            {FORMS_LIBRARY[key].length} items · {items.filter(i => i.status === 'needs').length} need attention
          </div>
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <button className="btn btn-primary btn-sm" onClick={handleOpen} disabled={!selected} style={{ opacity: selected ? 1 : 0.4 }}>
            Open selected
          </button>
          <button className="btn btn-outline btn-sm" title="Upload"><Icon name="upload" size={13}/></button>
          <button className="btn btn-outline btn-sm" title="Download"><Icon name="download" size={13}/></button>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flex: 1, maxWidth: 320, height: 32, padding: '0 10px', background: 'var(--bg-muted)', border: '1px solid var(--border-subtle)', borderRadius: 7 }}>
          <Icon name="search" size={13} color="var(--text-tertiary)"/>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder={`Search ${key.toLowerCase()}…`}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontSize: 13, fontFamily: 'inherit' }}/>
          {query && <button onClick={() => setQuery('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-tertiary)', padding: 0, display: 'flex' }}><Icon name="x" size={11}/></button>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12.5, color: 'var(--text-secondary)' }}>
          Sort:
          <LibRadio checked={sortMode === 'all'}   onChange={() => setSortMode('all')}   label="Default"/>
          <LibRadio checked={sortMode === 'alpha'} onChange={() => setSortMode('alpha')} label="A–Z"/>
        </div>
        {/* Legend */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginLeft: 'auto' }}>
          {[{ c: '#3DA866', l: 'Ready' }, { c: '#E0A23A', l: 'Needs info' }, { c: '#9AA0A6', l: 'Pending' }].map(s => (
            <span key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11.5, color: 'var(--text-tertiary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: s.c }}/>
              {s.l}
            </span>
          ))}
        </div>
      </div>

      {/* List */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: 10, overflow: 'hidden' }}>
        {items.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: 13 }}>No matches for "{query}"</div>
        ) : items.map((item, i) => {
          const isSel = selected === item.name;
          return (
            <button key={item.name}
              onClick={() => setSelected(item.name)}
              onDoubleClick={() => { setSelected(item.name); if (item.name.startsWith('1003') && onOpenURLA) onOpenURLA(); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, width: '100%', textAlign: 'left',
                padding: '11px 16px', border: 'none', fontFamily: 'inherit', fontSize: 13.5, cursor: 'pointer',
                background: isSel ? '#EDE9FE' : 'transparent',
                borderBottom: i < items.length - 1 ? '1px solid var(--border-subtle)' : 'none',
                transition: 'background 0.08s',
              }}
              onMouseEnter={e => { if (!isSel) e.currentTarget.style.background = 'var(--bg-muted)'; }}
              onMouseLeave={e => { if (!isSel) e.currentTarget.style.background = 'transparent'; }}
            >
              <FormStatusDot status={item.status}/>
              <span style={{ flex: 1, fontWeight: isSel ? 600 : 400, color: 'var(--text-primary)' }}>{item.name}</span>
              {item.name.startsWith('1003') && <span style={{ fontSize: 10.5, fontWeight: 700, color: '#7E68FA', background: '#EDE9FE', padding: '2px 6px', borderRadius: 4 }}>1003</span>}
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', textTransform: 'capitalize' }}>{item.status}</span>
            </button>
          );
        })}
      </div>
    </>
  );
}

function DataTab({ subTab = 'overview', onOpenURLA, loanId }) {
  if (subTab === 'forms')    return <LibrarySubTab tab="forms"    onOpenURLA={onOpenURLA}/>;
  if (subTab === 'tools')    return <LibrarySubTab tab="tools"    onOpenURLA={onOpenURLA}/>;
  if (subTab === 'services') return <LibrarySubTab tab="services" onOpenURLA={onOpenURLA}/>;
  if (subTab === 'doc__Loan_Estimate__p1') return <LoanEstimateView loanId={loanId} initialPage={1}/>;
  if (subTab === 'doc__Loan_Estimate__p2') return <LoanEstimateView loanId={loanId} initialPage={2}/>;
  if (subTab === 'doc__Loan_Estimate__p3') return <LoanEstimateView loanId={loanId} initialPage={3}/>;

  return (
    <>
      <h2 style={{ margin: 0, fontSize: 18, fontWeight: 600, letterSpacing: '-0.01em' }}>Loan Data</h2>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 4, marginBottom: 22 }}>
        All details organized and AI-validated
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <DataAccordion icon="settings" title="Borrower & Property" defaultOpen>
          <div style={{ paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px 32px' }}>
            <FieldPair label="Primary Borrower" value="Sarah Anderson"/>
            <FieldPair label="Co-Borrower" value="John Anderson"/>
            <div style={{ gridColumn: '1 / -1' }}>
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 5 }}>Property Address</div>
                <a
                  href="https://maps.google.com/?q=1842+Oak+Street+Denver+CO+80202"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    fontSize: 17, fontWeight: 500, letterSpacing: '-0.005em',
                    color: 'var(--ai-primary)', textDecoration: 'none',
                    padding: '3px 7px', margin: '0 -7px', borderRadius: 5,
                    border: '1.5px solid transparent', transition: 'border-color 0.12s, background 0.12s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; e.currentTarget.style.background = 'var(--bg-muted)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent'; }}
                >
                  1842 Oak Street, Denver CO 80202
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6, flexShrink: 0 }}><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
                </a>
              </div>
            </div>
            <FieldPair label="Purchase Price" value="$500,000"/>
            <FieldPair label="Down Payment" value="$75,000 (15%)"/>
          </div>
          <button style={{
            marginTop: 22,
            background: 'transparent', border: 'none',
            color: 'var(--text-primary)',
            fontFamily: 'inherit', fontSize: 13.5, fontWeight: 500,
            cursor: 'pointer',
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: 0,
          }}>
            View Full Application
            <Icon name="arrowRight" size={13} strokeWidth={2}/>
          </button>
        </DataAccordion>

        <DataAccordion icon="dollar" title="Financial Summary" badge={
          <span className="pill" style={{ background: 'var(--status-green-bg)', color: 'var(--status-green)' }}>
            <Icon name="check" size={11} strokeWidth={2.5}/>
            AI Verified
          </span>
        }>
          <div style={{ paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px 28px' }}>
            <FieldPair label="Annual Income" value="$100,000" mono/>
            <FieldPair label="Monthly Income" value="$8,333" mono readOnly/>
            <FieldPair label="Monthly Debt" value="$3,170" mono/>
            <FieldPair label="DTI Ratio" value="38%" mono readOnly/>
            <FieldPair label="LTV Ratio" value="80%" mono readOnly/>
            <FieldPair label="Credit Score" value="742" mono/>
            <FieldPair label="Liquid Assets" value="$148,500" mono/>
            <FieldPair label="Reserves" value="6.2 months" mono readOnly/>
          </div>
        </DataAccordion>

        <DataAccordion icon="doc" title="Documents Checklist" badge={
          <span className="pill" style={{ background: 'var(--status-amber-bg)', color: 'var(--status-amber)' }}>
            2 Missing
          </span>
        }>
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <DocRow status="received" label="Pay stubs (last 2 months)" detail="Uploaded May 8"/>
            <DocRow status="received" label="W-2 (2024, 2023)" detail="Uploaded May 8"/>
            <DocRow status="received" label="Photo ID" detail="Uploaded May 6"/>
            <DocRow status="missing" label="Bank statements (last 3 months)" detail="Requested May 16"/>
            <DocRow status="missing" label="Tax returns (2023, 2024)" detail="Requested May 16"/>
            <DocRow status="received" label="Purchase contract" detail="Uploaded May 5"/>
            <DocRow status="pending" label="Appraisal report" detail="Ordered May 16"/>
          </div>
        </DataAccordion>

        <DataAccordion icon="shoppingCart" title="Product & Pricing">
          <div style={{ paddingTop: 18, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px 32px' }}>
            <FieldPair label="Product" value="Conventional 30yr fixed"/>
            <FieldPair label="Loan Amount" value="$425,000"/>
            <FieldPair label="Interest Rate" value="6.875%" mono/>
            <FieldPair label="APR" value="7.012%" mono readOnly/>
            <FieldPair label="Monthly P&I" value="$2,792" mono readOnly/>
            <FieldPair label="Lock Period" value="45 days"/>
            <FieldPair label="Lock Expires" value="June 24, 2026" mono readOnly/>
            <FieldPair label="Origination Fee" value="$1,275" mono/>
          </div>
        </DataAccordion>

        <DataAccordion icon="alertOctagon" title="Compliance & Controls" badge={
          <span className="pill" style={{ background: 'var(--status-green-bg)', color: 'var(--status-green)' }}>
            All Passed <Icon name="check" size={11} strokeWidth={2.5} style={{ marginLeft: 2 }}/>
          </span>
        }>
          <div style={{ paddingTop: 14, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <ComplianceRow label="TRID disclosures issued on time" detail="LE issued May 6 (within 3 days)"/>
            <ComplianceRow label="Right of Rescission n/a (purchase)" detail="Not required"/>
            <ComplianceRow label="HMDA fields complete" detail="All required fields captured"/>
            <ComplianceRow label="Fair lending review" detail="No flags detected"/>
            <ComplianceRow label="OFAC screening" detail="Cleared on May 5"/>
          </div>
        </DataAccordion>
        </div>
    </>
  );
}

/* ============= FORMS LIBRARY WIDGET ============= */

const FORMS_LIBRARY = {
  Forms: [
    { name: 'Loan Originator Summary',        status: 'ready'   },
    { name: 'Borrower Summary',               status: 'ready'   },
    { name: 'Processor Summary Form',         status: 'ready'   },
    { name: 'GS Application',                 status: 'needs'   },
    { name: '1003 Page 1',                    status: 'ready'   },
    { name: '1003 Page 2',                    status: 'ready'   },
    { name: '1003 Page 3',                    status: 'ready'   },
    { name: '1003 Page 4',                    status: 'needs'   },
    { name: 'Home Counseling Providers',      status: 'ready'   },
    { name: 'TRID Redisclosure Desk Summary', status: 'ready'   },
    { name: '2015 Itemization',               status: 'ready'   },
    { name: 'RegZ — LE',                      status: 'ready'   },
    { name: 'Loan Estimate Page 1',           status: 'ready',  clickable: true },
    { name: 'Loan Estimate Page 2',           status: 'ready',  clickable: true },
    { name: 'Loan Estimate Page 3',           status: 'needs',  clickable: true },
    { name: 'Closing Disclosure',             status: 'pending' },
  ],
  Tools: [
    { name: 'APR / APY Calculator', status: 'ready' },
    { name: 'Income Calculator', status: 'ready' },
    { name: 'DTI Worksheet', status: 'ready' },
    { name: 'Rate Lock Tool', status: 'ready' },
    { name: 'Fee Comparison', status: 'ready' },
    { name: 'Pricing Engine', status: 'ready' },
    { name: 'Conditions Manager', status: 'ready' },
  ],
  Services: [
    { name: 'Credit — Equifax', status: 'ready' },
    { name: 'Credit — TransUnion', status: 'ready' },
    { name: 'Verification of Employment', status: 'pending' },
    { name: 'Verification of Assets', status: 'pending' },
    { name: 'Flood Determination', status: 'ready' },
    { name: 'AUS — DU', status: 'ready' },
    { name: 'AUS — LP', status: 'ready' },
    { name: 'Title — First American', status: 'ready' },
    { name: 'Appraisal Order', status: 'pending' },
  ],
};

const mkDoc = (name, status, clickable = false, pages = null) => ({
  id: 'doc__' + name.replace(/[\s—]+/g, '_'),
  label: name, status, clickable,
  pages: pages ? pages.map((p, i) => ({
    id: 'doc__' + name.replace(/[\s—]+/g, '_') + '__p' + (i + 1),
    label: p.label, status: p.status, clickable: p.clickable ?? clickable,
  })) : null,
});

const DOC_GROUPS = [
  {
    id: 'loan-estimate', label: 'Loan Estimate', defaultOpen: true,
    docs: [
      mkDoc('Loan Estimate', 'ready', true, [
        { label: 'Page 1 — Loan Terms',     status: 'ready', clickable: true },
        { label: 'Page 2 — Closing Costs',  status: 'ready', clickable: true },
        { label: 'Page 3 — Comparisons',    status: 'needs', clickable: true },
      ]),
      mkDoc('RegZ — LE', 'ready'),
    ],
  },
  {
    id: 'application', label: 'Application', defaultOpen: false,
    docs: [
      mkDoc('1003', 'ready', false, [
        { label: 'Page 1 — Borrower Info',  status: 'ready' },
        { label: 'Page 2 — Employment',     status: 'ready' },
        { label: 'Page 3 — Assets',         status: 'ready' },
        { label: 'Page 4 — Declarations',   status: 'needs' },
      ]),
      mkDoc('GS Application', 'needs'),
    ],
  },
  {
    id: 'closing', label: 'Closing', defaultOpen: false,
    docs: [
      mkDoc('Closing Disclosure', 'pending', false, [
        { label: 'Page 1 — Loan Terms',     status: 'pending' },
        { label: 'Page 2 — Closing Costs',  status: 'pending' },
        { label: 'Page 3 — Cash to Close',  status: 'pending' },
        { label: 'Page 4 — Disclosures',    status: 'pending' },
        { label: 'Page 5 — Loan Tables',    status: 'pending' },
      ]),
    ],
  },
  {
    id: 'disclosures', label: 'Disclosures', defaultOpen: false,
    docs: [
      mkDoc('Home Counseling Providers',      'ready'),
      mkDoc('TRID Redisclosure Desk Summary', 'ready'),
      mkDoc('2015 Itemization',               'ready'),
    ],
  },
  {
    id: 'summaries', label: 'Summaries', defaultOpen: false,
    docs: [
      mkDoc('Loan Originator Summary',  'ready'),
      mkDoc('Borrower Summary',         'ready'),
      mkDoc('Processor Summary Form',   'ready'),
    ],
  },
];

function FormStatusDot({ status }) {
  const color = {
    ready: '#3DA866',
    needs: '#E0A23A',
    pending: '#9AA0A6',
  }[status] || '#9AA0A6';
  return (
    <span style={{
      width: 8, height: 8, borderRadius: 999,
      background: color, flexShrink: 0,
    }}/>
  );
}


function DocRow({ status, label, detail }) {
  const meta = {
    received: { icon: 'check', bg: 'var(--status-green-bg)', color: 'var(--status-green)', text: 'Received' },
    missing:  { icon: 'alertCircle', bg: 'var(--status-amber-bg)', color: 'var(--status-amber)', text: 'Missing' },
    pending:  { icon: 'clock', bg: 'var(--status-blue-bg)', color: 'var(--status-blue)', text: 'Pending' },
  }[status];
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 14,
      padding: '11px 8px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 26, height: 26, borderRadius: 7,
        background: meta.bg, color: meta.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name={meta.icon} size={14} strokeWidth={2}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>
      </div>
      <span className="pill" style={{ background: meta.bg, color: meta.color }}>{meta.text}</span>
    </div>
  );
}

function ComplianceRow({ label, detail }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '11px 8px',
      borderBottom: '1px solid var(--border-subtle)',
    }}>
      <div style={{
        width: 22, height: 22, borderRadius: 999,
        background: 'var(--status-green-bg)', color: 'var(--status-green)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon name="check" size={12} strokeWidth={2.5}/>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 500 }}>{label}</div>
        <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{detail}</div>
      </div>
    </div>
  );
}

export { LoanDetailView };
export default LoanDetailView;
