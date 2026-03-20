const P = ['#2d5be3','#1a8c5a','#d94e3f','#c78a1e','#6b4ed4','#1a8c8c','#e05898','#4a90d9'];

export function getColors(u: string | null, n: number): string[] {
  if (u) {
    const c = u.split(',').map((s) => s.trim());
    while (c.length < n) c.push(P[c.length % 8] ?? P[0]!);
    return c.slice(0, n);
  }
  return P.slice(0, Math.max(n, 1));
}

const L = { text: '#4a4a44', textMuted: '#8a8a80', grid: '#e6e5df', bg: '#ffffff' } as const;
const D = { text: '#b0b0a8', textMuted: '#6a6a62', grid: '#2c2c28', bg: '#1a1a18' } as const;

export function getThemeColor(k: keyof typeof L): string {
  return (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme:dark)').matches ? D : L)[k];
}

export function injectStyles(): void {
  if (document.getElementById('dc-s')) return;
  const s = document.createElement('style');
  s.id = 'dc-s';
  s.textContent = ':root{--dc-font-family:system-ui,-apple-system,sans-serif}table[data-chart]{visibility:hidden;position:absolute;width:0;height:0;overflow:hidden}.data-chart-rendered{display:none!important}.data-chart-source-visible{display:table!important;visibility:visible;position:static;width:auto;height:auto}.data-chart-svg{width:100%;height:auto;display:block}.data-chart-source-toggle{font:12px var(--dc-font-family);color:#8a8a80;background:0 0;border:1px solid #e6e5df;border-radius:6px;padding:4px 12px;cursor:pointer;margin-top:8px}@keyframes dc-fade{from{opacity:0}}.dc-anim .data-chart-dot{opacity:0;animation:dc-fade .3s ease-out both}.dc-anim .data-chart-area{opacity:0;animation:dc-fade .8s ease-out .4s both}@media(prefers-reduced-motion:reduce){.dc-anim .data-chart-dot,.dc-anim .data-chart-area{animation:none}.dc-anim .data-chart-bar,.dc-anim .data-chart-line,.dc-anim .data-chart-slice{transition:none!important}}';
  document.head.appendChild(s);
}
