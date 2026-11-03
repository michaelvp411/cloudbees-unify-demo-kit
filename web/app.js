// One page, two demo brands. Each brand reads its flags from its own
// CloudBees Unify application: FinSure Payments Platform or Horizon Patient Platform.
// Without an SDK key the page runs in local demo mode and the inspector toggles stand in for Unify.

const BRANDS = {
  finsure: {
    name: 'FinSure Bank',
    tag: 'Payments Platform',
    logo: 'F',
    unifyApp: 'FinSure Payments Platform',
    personas: [
      { id: 'alex', name: 'Alex Rivera', detail: 'Standard checking', tier: 'standard', isBetaTester: false },
      { id: 'priya', name: 'Priya Shah', detail: 'Premier client', tier: 'premier', isBetaTester: false },
      { id: 'jordan', name: 'Jordan Kim', detail: 'Staff beta tester', tier: 'standard', isBetaTester: true },
    ],
    flags: {
      aiSpendingCoach: { label: 'AI spending coach', ai: true, demoDefault: 'beta' },
      instantTransfers: { label: 'Instant transfers', ai: false, demoDefault: 'off' },
    },
    cards: (p, on) => [
      card('Checking ••4821', `<div class="big">$${p.tier === 'premier' ? '48,210.55' : '3,482.17'}</div><div class="muted">Available balance</div>`),
      card('Recent activity', list([
        ['Blue Bottle Coffee', '−$6.75'], ['Payroll · Acme Corp', '+$2,940.00'], ['Whole Foods', '−$84.12'], ['Con Edison', '−$112.40'],
      ])),
      card('Send money', on.instantTransfers
        ? `<p><span class="pill new">New</span> <strong>Instant transfer</strong>: arrives in seconds, 24/7.</p><button class="primary">Send instantly</button>`
        : `<p>Standard ACH transfer: arrives in 1–3 business days.</p><button class="primary">Send</button>`),
      on.aiSpendingCoach && card('Spending coach', `
        <p>Dining is <strong>23% higher</strong> than your 3-month average ($412 vs $335).
        Moving $75/week into savings keeps you on track for your <em>Emergency fund</em> goal by March.</p>
        <button class="ghost">Set up auto-save</button>
        ${aiFootnote('aiSpendingCoach', 'Insights are generated from your transactions and are not financial advice.')}`, 'ai'),
    ],
  },
  horizon: {
    name: 'Horizon Health',
    tag: 'Patient Platform',
    logo: 'H',
    unifyApp: 'Horizon Patient Platform',
    personas: [
      { id: 'sam', name: 'Sam Patel', detail: 'Patient', tier: 'patient', isBetaTester: false },
      { id: 'lee', name: 'Dr. Morgan Lee', detail: 'Clinician', tier: 'clinician', isBetaTester: false },
      { id: 'ortiz', name: 'Casey Ortiz, RN', detail: 'Pilot clinic beta tester', tier: 'clinician', isBetaTester: true },
    ],
    flags: {
      aiVisitSummary: { label: 'AI visit summary', ai: true, demoDefault: 'beta' },
      telehealthCheckin: { label: 'Telehealth check-in', ai: false, demoDefault: 'off' },
    },
    cards: (p, on) => [
      card(p.tier === 'patient' ? 'Next appointment' : 'Today’s schedule', p.tier === 'patient'
        ? `<div class="big">Thu, Nov 6 · 9:30 AM</div><div class="muted">Dr. Morgan Lee · Primary care</div>`
        : list([['9:30 AM', 'Sam Patel · Follow-up'], ['10:15 AM', 'R. Chen · Annual'], ['11:00 AM', 'L. Gomez · Labs review']])),
      card('Check-in', on.telehealthCheckin
        ? `<p><span class="pill new">New</span> Check in from home and join the video visit when your clinician is ready.</p><button class="primary">Start telehealth check-in</button>`
        : `<p>Please arrive 15 minutes early to check in at the front desk.</p><button class="primary">Get directions</button>`),
      card('Results', list([['Lipid panel', 'Normal'], ['A1C', '5.6%'], ['Vitamin D', 'Low']])),
      on.aiVisitSummary && card('Visit summary', `
        <p><strong>Oct 28 follow-up:</strong> blood pressure improved to 128/82 on current medication.
        Continue lisinopril 10 mg daily, start vitamin D 1,000 IU, recheck labs in 3 months.</p>
        ${aiFootnote('aiVisitSummary', p.tier === 'patient' ? 'Drafted by AI and reviewed by your care team.' : 'AI draft. Review before it is shared with the patient.')}`, 'ai'),
    ],
  },
};

const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { v == null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch {} },
};

const params = new URLSearchParams(location.search);
const brandId = BRANDS[params.get('brand')] ? params.get('brand') : (BRANDS[store.get('brand')] ? store.get('brand') : 'finsure');
const brand = BRANDS[brandId];
store.set('brand', brandId);
let persona = brand.personas.find(p => p.id === store.get(`persona:${brandId}`)) || brand.personas[0];
const sdkKey = store.get(`sdkKey:${brandId}`);
const live = Boolean(sdkKey && window.Rox);

// Local demo mode: each flag is off, on for beta testers, or on for everyone.
const demoState = Object.fromEntries(Object.entries(brand.flags).map(([k, f]) =>
  [k, store.get(`demo:${brandId}:${k}`) || f.demoDefault]));

// Live mode: flags register under the brand's namespace, e.g. finsure.aiSpendingCoach.
const roxFlags = live ? Object.fromEntries(Object.keys(brand.flags).map(k => [k, new Rox.Flag(false)])) : null;

function context() {
  return { persona: persona.id, tier: persona.tier, isBetaTester: persona.isBetaTester };
}

function flagValues() {
  return Object.fromEntries(Object.keys(brand.flags).map(k => [k, live
    ? roxFlags[k].isEnabled(context())
    : demoState[k] === 'all' || (demoState[k] === 'beta' && persona.isBetaTester)]));
}

function card(title, body, cls = '') {
  return `<article class="card ${cls}"><h3>${title}</h3>${body}</article>`;
}

function list(rows) {
  return `<ul class="rows">${rows.map(([a, b]) => `<li><span>${a}</span><span>${b}</span></li>`).join('')}</ul>`;
}

function aiFootnote(flag, note) {
  return `<footer class="ai-foot"><span class="pill ai">AI-assisted</span> ${note}<br><code>${brandId}.${flag}</code></footer>`;
}

const $ = id => document.getElementById(id);

function render() {
  const on = flagValues();
  document.documentElement.dataset.brand = brandId;
  $('logo').textContent = brand.logo;
  $('brand-name').textContent = brand.name;
  $('brand-tag').textContent = brand.tag;

  $('brand-switch').innerHTML = Object.entries(BRANDS).map(([id, b]) =>
    `<a href="?brand=${id}" class="${id === brandId ? 'active' : ''}">${b.name}</a>`).join('');

  $('personas').innerHTML = brand.personas.map(p => `
    <button type="button" data-persona="${p.id}" class="persona ${p.id === persona.id ? 'active' : ''}">
      <strong>${p.name}</strong><span>${p.detail}</span>
    </button>`).join('');

  $('cards').innerHTML = brand.cards(persona, on).filter(Boolean).join('');

  $('mode').textContent = live ? 'Live · Unify' : 'Local demo';
  $('mode').className = `mode ${live ? 'live' : ''}`;
  $('mode-hint').textContent = live
    ? `Flags come from the "${brand.unifyApp}" app in CloudBees Unify. Change targeting or hit the kill switch there; this page re-fetches every 10 seconds.`
    : `Not connected to Unify. These toggles simulate the targeting rules. Add the SDK key for "${brand.unifyApp}" to go live.`;

  $('flags').innerHTML = Object.entries(brand.flags).map(([k, f]) => `
    <li>
      <div class="flag-row">
        <div>
          <div class="flag-name">${f.label} ${f.ai ? '<span class="pill ai">AI</span>' : ''}</div>
          <code>${brandId}.${k}</code>
        </div>
        <span class="state ${on[k] ? 'on' : 'off'}">${on[k] ? 'ON' : 'OFF'}</span>
      </div>
      ${live ? '' : `
      <div class="seg" role="group" aria-label="${f.label} targeting">
        ${[['off', 'Off'], ['beta', 'Beta testers'], ['all', 'Everyone']].map(([v, l]) =>
          `<button type="button" data-flag="${k}" data-value="${v}" class="${demoState[k] === v ? 'active' : ''}">${l}</button>`).join('')}
      </div>`}
    </li>`).join('');
  $('refresh').hidden = !live;
}

document.addEventListener('click', e => {
  const p = e.target.closest('[data-persona]');
  if (p) {
    persona = brand.personas.find(x => x.id === p.dataset.persona);
    store.set(`persona:${brandId}`, persona.id);
    render();
  }
  const f = e.target.closest('[data-flag]');
  if (f) {
    demoState[f.dataset.flag] = f.dataset.value;
    store.set(`demo:${brandId}:${f.dataset.flag}`, f.dataset.value);
    render();
  }
});

$('settings').addEventListener('click', () => {
  $('key-app').textContent = brand.unifyApp;
  $('key-input').value = sdkKey || '';
  $('key-dialog').showModal();
});

$('key-dialog').addEventListener('close', () => {
  if ($('key-dialog').returnValue !== 'save') return;
  store.set(`sdkKey:${brandId}`, $('key-input').value.trim() || null);
  location.reload(); // Rox.setup can only run once per page load
});

$('refresh').addEventListener('click', () => Rox.fetch());

if (live) {
  Rox.setCustomStringProperty('persona', ctx => ctx.persona);
  Rox.setCustomStringProperty('tier', ctx => ctx.tier);
  Rox.setCustomBooleanProperty('isBetaTester', ctx => ctx.isBetaTester);
  Rox.register(brandId, roxFlags);
  Rox.setup(sdkKey, { configurationFetchedHandler: render })
    .catch(err => console.error('Unify flag setup failed', err));
  setInterval(() => Rox.fetch(), 10000);
}

render();
