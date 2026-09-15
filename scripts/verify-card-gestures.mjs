/**
 * Headless check of the 15-minute card interaction (jsdom, no browser needed).
 *
 * Verifies:
 *  1. Short tap on a quarter calls toggle_slot for that quarter only
 *  2. Long press calls toggle_hour once and does not also toggle the quarter
 *  3. quarter_labels: 'always' labels every hour, 'selected' only the tapped one
 *  4. Hour numbers are rendered upright (no wedge rotation)
 *
 * Requires jsdom (dev only): npm install --no-save --legacy-peer-deps jsdom
 * Run: node scripts/verify-card-gestures.mjs
 */
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body></body></html>', {
  pretendToBeVisual: true,
  url: 'http://localhost/',
});

// Expose the jsdom window as the global environment the bundle expects
globalThis.window = dom.window;
for (const key of Object.getOwnPropertyNames(dom.window)) {
  if (key in globalThis || key.startsWith('_')) continue;
  const value = dom.window[key];
  try {
    globalThis[key] = typeof value === 'function' && !value.prototype
      ? value.bind(dom.window)
      : value;
  } catch {
    // read-only globals (e.g. navigator) are fine to skip
  }
}
globalThis.document = dom.window.document;
globalThis.Document = dom.window.Document;
globalThis.customElements = dom.window.customElements;
// Node ships its own Event/CustomEvent, which jsdom's dispatchEvent rejects
globalThis.Event = dom.window.Event;
globalThis.CustomEvent = dom.window.CustomEvent;
globalThis.EventTarget = dom.window.EventTarget;

await import('../timer-24h-card.js');

const ENTITY = 'sensor.timer_24h_test';
const calls = [];

function makeSlots() {
  const slots = [];
  for (let hour = 0; hour < 24; hour++) {
    for (const minute of [0, 15, 30, 45]) {
      slots.push({ hour, minute, isActive: false });
    }
  }
  return slots;
}

function makeHass(slots) {
  return {
    language: 'en',
    states: {
      [ENTITY]: {
        entity_id: ENTITY,
        state: 'on',
        attributes: {
          friendly_name: 'Test timer',
          home_status: true,
          enabled: true,
          slot_resolution: 15,
          controlled_entities: [],
          time_slots: slots.map((s) => ({ ...s })),
        },
      },
    },
    callService: async (domain, service, data) => {
      calls.push({ domain, service, data });
    },
  };
}

async function mountCard(quarterLabels) {
  const card = document.createElement('timer-24h-card');
  card.setConfig({ entity: ENTITY, show_title: true, quarter_labels: quarterLabels });
  card.hass = makeHass(makeSlots());
  document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

function quarterPaths(card) {
  return [...card.shadowRoot.querySelectorAll('path')].filter((p) => {
    const title = p.querySelector('title')?.textContent?.trim() ?? '';
    return /^\d{2}:\d{2}$/.test(title);
  });
}

function pathFor(card, label) {
  return quarterPaths(card).find(
    (p) => p.querySelector('title').textContent.trim() === label
  );
}

// Hour numbers and quarter labels share values (hour "15" vs quarter "15"),
// so classify them by font size: hours are 13, quarters 9.5
const HOUR_FONT = '13';
const QUARTER_FONT = '9.5';

function texts(card) {
  return [...card.shadowRoot.querySelectorAll('text')].map((t) => ({
    value: t.textContent.trim(),
    fontSize: t.getAttribute('font-size') || '',
    transform: t.getAttribute('transform') || '',
  }));
}

function hourLabels(card) {
  return texts(card).filter((t) => t.fontSize === HOUR_FONT);
}

function quarterLabels(card) {
  return texts(card).filter(
    (t) => t.fontSize === QUARTER_FONT && ['15', '30', '45'].includes(t.value)
  );
}

function fire(el, type) {
  el.dispatchEvent(new dom.window.Event(type, { bubbles: true, cancelable: true }));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const results = [];
function check(name, condition, detail = '') {
  results.push({ name, ok: Boolean(condition), detail });
}

// --- 1. short tap toggles only the tapped quarter ---------------------------
{
  const card = await mountCard('always');
  const target = pathFor(card, '09:30');
  calls.length = 0;
  fire(target, 'pointerdown');
  fire(target, 'pointerup');
  await sleep(50);

  check('short tap fires exactly one service call', calls.length === 1, JSON.stringify(calls));
  check(
    'short tap calls toggle_slot for 09:30 only',
    calls[0]?.service === 'toggle_slot' &&
      calls[0]?.data?.hour === 9 &&
      calls[0]?.data?.minute === 30,
    JSON.stringify(calls[0])
  );
  card.remove();
}

// --- 2. tap on the outer ring (:00) does not fill the whole hour ------------
{
  const card = await mountCard('always');
  const target = pathFor(card, '14:00');
  calls.length = 0;
  fire(target, 'pointerdown');
  fire(target, 'pointerup');
  await sleep(50);

  check(
    'tap on :00 stays a single quarter toggle',
    calls.length === 1 &&
      calls[0].service === 'toggle_slot' &&
      calls[0].data.minute === 0,
    JSON.stringify(calls)
  );
  card.remove();
}

// --- 3. long press toggles the whole hour, and only that -------------------
{
  const card = await mountCard('always');
  const target = pathFor(card, '21:15');
  calls.length = 0;
  fire(target, 'pointerdown');
  await sleep(700);
  fire(target, 'pointerup');
  await sleep(50);

  check('long press fires exactly one service call', calls.length === 1, JSON.stringify(calls));
  check(
    'long press calls toggle_hour for hour 21',
    calls[0]?.service === 'toggle_hour' && calls[0]?.data?.hour === 21,
    JSON.stringify(calls[0])
  );
  check(
    'long press does not also toggle the held quarter',
    !calls.some((c) => c.service === 'toggle_slot'),
    JSON.stringify(calls)
  );
  card.remove();
}

// --- 4. labels: always vs selected ----------------------------------------
{
  const card = await mountCard('always');
  check(
    "quarter_labels 'always' renders 15/30/45 for all 24 hours",
    quarterLabels(card).length === 72,
    `found ${quarterLabels(card).length}`
  );
  const hours = hourLabels(card);
  check(
    'all 24 hour numbers render, upright (rotate 0)',
    hours.length === 24 && hours.every((t) => /rotate\(0 /.test(t.transform)),
    `${hours.length} labels, sample: ${hours[22]?.value} ${hours[22]?.transform}`
  );
  card.remove();
}

{
  const card = await mountCard('selected');
  check(
    "quarter_labels 'selected' hides quarter labels before any tap",
    quarterLabels(card).length === 0,
    `found ${quarterLabels(card).length}`
  );

  const target = pathFor(card, '07:45');
  fire(target, 'pointerdown');
  fire(target, 'pointerup');
  await card.updateComplete;
  await sleep(50);
  await card.updateComplete;

  check(
    "quarter_labels 'selected' shows 3 labels for the tapped hour",
    quarterLabels(card).length === 3,
    `found ${quarterLabels(card).length}`
  );
  card.remove();
}

// --- 5. regression: 30-minute view still toggles the half-hour pair --------
{
  const card = document.createElement('timer-24h-card');
  card.setConfig({ entity: ENTITY, show_title: true });
  const hass = makeHass(makeSlots());
  hass.states[ENTITY].attributes.slot_resolution = 30;
  card.hass = hass;
  document.body.appendChild(card);
  await card.updateComplete;

  const target = pathFor(card, '10:30');
  calls.length = 0;
  fire(target, 'click');
  await sleep(50);

  check(
    '30-minute view still toggles via click',
    calls.length === 1 &&
      calls[0].service === 'toggle_slot' &&
      calls[0].data.hour === 10 &&
      calls[0].data.minute === 30,
    JSON.stringify(calls)
  );
  card.remove();
}

// --- 6. editor exposes the quarter labels option ---------------------------
{
  // The card bundle inlines the editor, so the element is already registered
  const editor = document.createElement('timer-24h-card-editor');
  editor.setConfig({ entity: ENTITY, show_title: true });
  editor.hass = makeHass(makeSlots());
  document.body.appendChild(editor);
  await editor.updateComplete;

  const buttons = [...editor.shadowRoot.querySelectorAll('button')];
  const always = buttons.find((b) => b.textContent.trim() === 'Always visible');
  const onlyOnTap = buttons.find((b) => b.textContent.trim() === 'Only on tap');
  check('editor shows both quarter label options', Boolean(always && onlyOnTap));

  let emitted = null;
  editor.addEventListener('config-changed', (e) => {
    emitted = e.detail?.config;
  });
  onlyOnTap?.click();
  await editor.updateComplete;
  check(
    "editor writes quarter_labels: 'selected' on click",
    emitted?.quarter_labels === 'selected',
    JSON.stringify(emitted)
  );
  editor.remove();
}

let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`${r.ok ? 'PASS' : 'FAIL'}  ${r.name}${r.ok ? '' : ` — ${r.detail}`}`);
}
console.log(`\n${results.length - failed}/${results.length} checks passed`);
process.exit(failed === 0 ? 0 : 1);
