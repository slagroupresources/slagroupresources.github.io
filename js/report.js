// Read-only tracker report, used for "Save as PDF" and private links shared with a therapist.
// makeSnapshot() picks what the person chose to share; renderReport() turns it into HTML.

const CORE_COLORS = { Joy: '#f2d27a', Calm: '#9cc5b0', Sadness: '#8fa9d1', Anger: '#e09a8a', Fear: '#c4a5d6', Shame: '#d9b38c' };
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const when = (t) => new Date(t).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
const toUTC = (s) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const addDays = (s, n) => new Date(toUTC(s) + n * 864e5).toISOString().slice(0, 10);
const diffDays = (a, b) => Math.round((toUTC(b) - toUTC(a)) / 864e5);
const nice = (s) => new Date(toUTC(s)).toLocaleDateString([], { timeZone: 'UTC', dateStyle: 'medium' });
const localYmd = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

// opts: { feelings, ninety, coping, notes (bool), days (0 = everything) }
export function makeSnapshot(data, opts) {
  const since = opts.days ? Date.now() - opts.days * 864e5 : 0;
  const snap = { v: 1, made: new Date().toISOString(), today: localYmd(new Date()),
                 rangeLabel: opts.days ? `Last ${opts.days} days` : 'Everything', notes: !!opts.notes };
  if (opts.feelings) snap.feelings = (data.feelings || []).filter(f => Date.parse(f.t) >= since)
    .map(f => ({ t: f.t, word: f.word, core: f.core, intensity: f.intensity, note: opts.notes ? f.note : '' }));
  if (opts.ninety && data.tracker && data.tracker.start) snap.tracker = { start: data.tracker.start, days: data.tracker.days, past: data.tracker.past || [] };
  if (opts.coping) snap.coping = (data.coping || []).filter(c => Date.parse(c.t) >= since)
    .map(c => opts.notes ? c : { ...c, thoughts: '', results: '' });
  return snap;
}

const STYLE = `<style>
  .rp { -webkit-print-color-adjust: exact; print-color-adjust: exact; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #1d2420; line-height: 1.45; max-width: 860px; margin: 0 auto; }
  .rp h1 { font-size: 1.6rem; margin: 0 0 2px; }
  .rp h2 { font-size: 1.2rem; margin: 26px 0 8px; padding-bottom: 4px; border-bottom: 2px solid #1f3a2b; }
  .rp .meta { color: #5b665f; margin: 0 0 6px; font-size: .92rem; }
  .rp .stats { display: flex; flex-wrap: wrap; gap: 10px; margin: 8px 0 12px; }
  .rp .stat { border: 1px solid #dde3df; border-radius: 10px; padding: 8px 12px; min-width: 120px; }
  .rp .stat b { display: block; font-size: 1.3rem; }
  .rp .stat span { font-size: .82rem; color: #5b665f; }
  .rp .grid { display: grid; grid-template-columns: repeat(15, 1fr); gap: 3px; max-width: 560px; }
  .rp .grid i { aspect-ratio: 1; border-radius: 4px; border: 1px solid #dde3df; font-size: 9px; font-style: normal; display: flex; align-items: center; justify-content: center; color: #5b665f; }
  .rp .grid i.y { background: #5f9a73; border-color: #5f9a73; color: #fff; }
  .rp .grid i.s { background: #e8b65c; border-color: #e8b65c; color: #3b2a00; }
  .rp .grid i.f { background: #f3f5f4; }
  .rp .legend { font-size: .8rem; color: #5b665f; margin-top: 4px; }
  .rp .bars div { display: grid; grid-template-columns: 80px 1fr 130px; gap: 8px; align-items: center; font-size: .9rem; margin: 3px 0; }
  .rp .bars span.f { display: block; height: 10px; border-radius: 5px; }
  .rp .tw { overflow-x: auto; }   /* wide tables scroll sideways on phones */
  .rp table { width: 100%; border-collapse: collapse; font-size: .88rem; }
  .rp th { text-align: left; font-size: .78rem; text-transform: uppercase; letter-spacing: .04em; color: #5b665f; border-bottom: 1px solid #1d2420; padding: 6px 6px; }
  .rp td { border-bottom: 1px solid #dde3df; padding: 6px; vertical-align: top; }
  .rp .none { color: #5b665f; }
  .rp .foot { margin-top: 28px; font-size: .8rem; color: #5b665f; }
  @media print { .rp .tw { overflow: visible; } .rp h2 { break-after: avoid; } .rp tr { break-inside: avoid; } .rp .keep { break-inside: avoid; } }
</style>`;

function ninetySection(t, today) {
  if (!t) return '';
  const dayNum = diffDays(t.start, today) + 1;
  let kept = 0, slips = 0, cells = '';
  for (let i = 0; i < 90; i++) {
    const d = addDays(t.start, i), v = t.days[d], fut = d > today;
    if (!fut && v === 'yes') kept++; if (!fut && v === 'slip') slips++;
    cells += `<i class="${fut ? 'f' : v === 'yes' ? 'y' : v === 'slip' ? 's' : ''}">${i + 1}</i>`;
  }
  const reached = [30, 60, 90].filter(m => dayNum >= m);
  const past = t.past.length ? `<p class="meta">Earlier runs: ${t.past.map(p => `${nice(p.start)} to ${nice(p.end)} (${diffDays(p.start, p.end) + 1} days, ${p.kept} kept)`).join('; ')}</p>` : '';
  return `<section class="keep"><h2>90-day tracker</h2>
    <p class="meta">Started ${nice(t.start)}</p>
    <div class="stats">
      <div class="stat"><b>Day ${Math.max(1, dayNum)}</b><span>of 90</span></div>
      <div class="stat"><b>${kept}</b><span>days kept commitments</span></div>
      <div class="stat"><b>${slips}</b><span>slips</span></div>
      <div class="stat"><b>${reached.length ? reached[reached.length - 1] : '–'}</b><span>latest milestone</span></div>
    </div>
    <div class="grid">${cells}</div>
    <p class="legend">Green: kept commitments · Amber: slipped · White: no check-in</p>${past}</section>`;
}

function feelingsSection(list, notes) {
  if (!list) return '';
  if (!list.length) return '<section><h2>Feelings check-in</h2><p class="none">No feelings logged in this time range.</p></section>';
  const by = {};
  list.forEach(f => { (by[f.core] = by[f.core] || []).push(f.intensity); });
  const max = Math.max(...Object.values(by).map(a => a.length));
  const bars = Object.keys(CORE_COLORS).filter(c => by[c]).map(c => {
    const a = by[c], avg = a.reduce((x, y) => x + y, 0) / a.length;
    return `<div><span>${c}</span><span><span class="f" style="width:${a.length / max * 100}%;background:${CORE_COLORS[c]}"></span></span><span>${a.length}× · avg ${avg.toFixed(1)}/10</span></div>`;
  }).join('');
  const rows = list.map(f => `<tr><td>${when(f.t)}</td><td><b>${esc(f.word)}</b> (${esc(f.core)})</td><td>${f.intensity}/10</td>${notes ? `<td>${esc(f.note)}</td>` : ''}</tr>`).join('');
  return `<section><h2>Feelings check-in</h2>
    <p class="meta">${list.length} entr${list.length === 1 ? 'y' : 'ies'}</p>
    <div class="bars keep">${bars}</div>
    <div class="tw"><table><thead><tr><th>When</th><th>Feeling</th><th>Strength</th>${notes ? '<th>Note</th>' : ''}</tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

function copingSection(list, notes) {
  if (!list) return '';
  if (!list.length) return '<section><h2>Coping skills log</h2><p class="none">No coping entries in this time range.</p></section>';
  const by = {};
  list.forEach(c => { const k = c.skill.toLowerCase(); (by[k] = by[k] || { name: c.skill, d: [] }).d.push(c.before - c.after); });
  const best = Object.values(by).map(x => ({ name: x.name, n: x.d.length, avg: x.d.reduce((a, b) => a + b, 0) / x.d.length }))
    .sort((a, b) => b.avg - a.avg).map(r => `<li><b>${esc(r.name)}</b>: dropped ${r.avg.toFixed(1)} points on average (${r.n} time${r.n === 1 ? '' : 's'})</li>`).join('');
  const rows = list.map(c => `<tr><td>${when(c.t)}</td><td>${esc(c.trigger)}${notes && c.thoughts ? `<br><i>${esc(c.thoughts)}</i>` : ''}</td>
    <td>${esc(c.beforeEm)} ${c.before}/10</td><td>${esc(c.skill)}</td>${notes ? `<td>${esc(c.results)}</td>` : ''}<td>${esc(c.afterEm)} ${c.after}/10</td></tr>`).join('');
  return `<section><h2>Coping skills log</h2>
    <div class="keep"><p class="meta">What helped most</p><ul>${best}</ul></div>
    <div class="tw"><table><thead><tr><th>When</th><th>Situation${notes ? ' / thoughts' : ''}</th><th>Before</th><th>Coping skill</th>${notes ? '<th>Results</th>' : ''}<th>After</th></tr></thead><tbody>${rows}</tbody></table></div></section>`;
}

export function renderReport(snap) {
  return `${STYLE}<div class="rp">
    <h1>Recovery tracker report</h1>
    <p class="meta">Prepared ${when(snap.made)} · ${esc(snap.rangeLabel)}${snap.notes ? '' : ' · written notes left out'}</p>
    ${ninetySection(snap.tracker, snap.today)}
    ${feelingsSection(snap.feelings, snap.notes)}
    ${copingSection(snap.coping, snap.notes)}
    <p class="foot">Shared from slagroupresources.com. Entries are self-reported by the person who shared this report.</p>
  </div>`;
}
