// Minigolf : Neuf trous dessinés à la main, avec du sable, de l'eau et des bordures en bois. Tire en arrière pour viser, lâche pour frapper.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Minigolf</span><span class="hint">Clic maintenu et tirer en arrière : viser et doser · lâcher : frapper</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="256" height="192"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button></div>
      <label class="row"><input type="checkbox" id="mgRnd"> Parcours au hasard (9 nouveaux trous à chaque partie)</label>
      <div class="hint">Plus tu tires loin, plus le coup est fort (la jauge passe au rouge au maximum).</div><div class="hint">Le sable freine beaucoup ; l'eau ramène la balle à l'endroit du tir avec un coup de pénalité.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2;min-width:320px;position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{max-width:640px;aspect-ratio:256/192}`;
/* ---------- l'habillage pixel art, dessiné à la main : police bitmap (accents compris), cadres, boutons, icônes ----------
   Tout est en pixels pleins, agrandis par 2 sans lissage : aucun dégradé, aucune ombre floue. */
const PXK = (() => {
  // chaque lettre : ses lignes, de haut en bas, à partir de la ligne 2 de la case (0-1 : accents des majuscules, 9-10 : jambages)
  const S = {
    A: '.###. #...# #...# ##### #...# #...# #...#', B: '####. #...# #...# ####. #...# #...# ####.', C: '.###. #...# #.... #.... #.... #...# .###.',
    D: '####. #...# #...# #...# #...# #...# ####.', E: '##### #.... #.... ####. #.... #.... #####', F: '##### #.... #.... ####. #.... #.... #....',
    G: '.###. #...# #.... #.### #...# #...# .####', H: '#...# #...# #...# ##### #...# #...# #...#', I: '### .#. .#. .#. .#. .#. ###',
    J: '..### ...#. ...#. ...#. #..#. #..#. .##..', K: '#...# #..#. #.#.. ##... #.#.. #..#. #...#', L: '#.... #.... #.... #.... #.... #.... #####',
    M: '#...# ##.## #.#.# #.#.# #...# #...# #...#', N: '#...# ##..# #.#.# #..## #...# #...# #...#', O: '.###. #...# #...# #...# #...# #...# .###.',
    P: '####. #...# #...# ####. #.... #.... #....', Q: '.###. #...# #...# #...# #.#.# #..#. .##.#', R: '####. #...# #...# ####. #.#.. #..#. #...#',
    S: '.#### #.... #.... .###. ....# ....# ####.', T: '##### ..#.. ..#.. ..#.. ..#.. ..#.. ..#..', U: '#...# #...# #...# #...# #...# #...# .###.',
    V: '#...# #...# #...# #...# #...# .#.#. ..#..', W: '#...# #...# #...# #.#.# #.#.# ##.## #...#', X: '#...# #...# .#.#. ..#.. .#.#. #...# #...#',
    Y: '#...# #...# .#.#. ..#.. ..#.. ..#.. ..#..', Z: '##### ....# ...#. ..#.. .#... #.... #####',
    a: '..... ..... .###. ....# .#### #...# .####', b: '#.... #.... ####. #...# #...# #...# ####.', c: '..... ..... .###. #.... #.... #.... .###.',
    d: '....# ....# .#### #...# #...# #...# .####', e: '..... ..... .###. #...# ##### #.... .###.', f: '..## .#.. #### .#.. .#.. .#.. .#..',
    g: '..... ..... .#### #...# #...# #...# .#### ....# .###.', h: '#.... #.... ####. #...# #...# #...# #...#', i: '.#. ... ##. .#. .#. .#. ###',
    'ı': '... ... ##. .#. .#. .#. ###', j: '...# .... ..## ...# ...# ...# ...# #..# .##.', k: '#... #... #..# #.#. ##.. #.#. #..#',
    l: '##. .#. .#. .#. .#. .#. ###', m: '..... ..... ##.#. #.#.# #.#.# #.#.# #...#', n: '..... ..... ####. #...# #...# #...# #...#',
    o: '..... ..... .###. #...# #...# #...# .###.', p: '..... ..... ####. #...# #...# #...# ####. #.... #....', q: '..... ..... .#### #...# #...# #...# .#### ....# ....#',
    r: '.... .... #.## ##.. #... #... #...', s: '..... ..... .#### #.... .###. ....# ####.', t: '.#.. .#.. #### .#.. .#.. .#.. ..##',
    u: '..... ..... #...# #...# #...# #..## .##.#', v: '..... ..... #...# #...# #...# .#.#. ..#..', w: '..... ..... #...# #...# #.#.# #.#.# .#.#.',
    x: '..... ..... #...# .#.#. ..#.. .#.#. #...#', y: '..... ..... #...# #...# #...# #...# .#### ....# .###.', z: '..... ..... ##### ...#. ..#.. .#... #####',
    0: '.###. #...# #..## #.#.# ##..# #...# .###.', 1: '..#.. .##.. ..#.. ..#.. ..#.. ..#.. .###.', 2: '.###. #...# ....# ...#. ..#.. .#... #####',
    3: '####. ....# ....# .###. ....# ....# ####.', 4: '...#. ..##. .#.#. #..#. ##### ...#. ...#.', 5: '##### #.... ####. ....# ....# #...# .###.',
    6: '.###. #.... #.... ####. #...# #...# .###.', 7: '##### ....# ...#. ..#.. .#... .#... .#...', 8: '.###. #...# #...# .###. #...# #...# .###.',
    9: '.###. #...# #...# .#### ....# ....# .###.',
    '.': '. . . . . . #', ',': '.. .. .. .. .. .# .# #.', ':': '. . # . . . #', ';': '.. .. .# .. .. .# .# #.', '!': '# # # # # . #',
    '?': '.###. #...# ....# ...#. ..#.. ..... ..#..', "'": '# # . . . . .', '"': '#.# #.# ... ... ... ... ...', '-': '... ... ... ### ... ... ...',
    '+': '..... ..#.. ..#.. ##### ..#.. ..#.. .....', '/': '....# ...#. ...#. ..#.. .#... .#... #....', '(': '.# #. #. #. #. #. .#', ')': '#. .# .# .# .# .# #.',
    '%': '##..# ##.#. ...#. ..#.. .#... .#.## #..##', '·': '. . . # . . .', '×': '..... ..... #...# .#.#. ..#.. .#.#. #...#',
    '<': '...# ..#. .#.. #... .#.. ..#. ...#', '>': '#... .#.. ..#. ...# ..#. .#.. #...', '=': '.... .... #### .... #### .... ....',
    '_': '..... ..... ..... ..... ..... ..... #####', '#': '.#.#. .#.#. ##### .#.#. ##### .#.#. .#.#.', '&': '.##.. #..#. #.#.. .#... #.#.# #..#. .##.#',
    '…': '..... ..... ..... ..... ..... ..... #.#.#', '«': '..... ..#.# .#.#. #.#.. .#.#. ..#.# .....', '»': '..... #.#.. .#.#. ..#.# .#.#. #.#.. .....',
    '◀': '...# ..## .### #### .### ..## ...#', '▶': '#... ##.. ###. #### ###. ##.. #...', '→': '..... ..#.. ...#. ##### ...#. ..#.. .....',
    '←': '..... ..#.. .#... ##### .#... ..#.. .....', '↑': '..#.. .###. #.#.# ..#.. ..#.. ..#.. ..#..', '↓': '..#.. ..#.. ..#.. ..#.. #.#.# .###. ..#..',
    '*': '..... #.#.# .###. ##### .###. #.#.# .....', '[': '## #. #. #. #. #. ##', ']': '## .# .# .# .# .# ##', '|': '# # # # # # #',
    '@': '.###. #...# #.### #.#.# #.### #.... .###.', '€': '..### .#... ####. .#... ####. .#... ..###', '$': '..#.. .#### #.#.. .###. ..#.# ####. ..#..',
    '°': '.#. #.# .#. ... ... ... ...', '~': '..... ..... .#..# #.##. ..... ..... .....', '♪': '..##. ..#.# ..#.. ..#.. .##.. ###.. .#...',
  };
  const ACC = { a: ['..#', '.#.'], g: ['#..', '.#.'], c: ['.#.', '#.#'], d: ['...', '#.#'], t: ['.#.#', '#.#.'], z: ['.#.', '##.'] };  // aigu, grave, circonflexe, tréma, tilde, cédille
  const COMP = { é: 'ea', è: 'eg', ê: 'ec', ë: 'ed', á: 'aa', à: 'ag', â: 'ac', ä: 'ad', í: 'ıa', ì: 'ıg', î: 'ıc', ï: 'ıd', ó: 'oa', ò: 'og', ô: 'oc', ö: 'od',
    ú: 'ua', ù: 'ug', û: 'uc', ü: 'ud', ÿ: 'yd', ñ: 'nt', ç: 'cz', É: 'Ea', È: 'Eg', Ê: 'Ec', Ë: 'Ed', Á: 'Aa', À: 'Ag', Â: 'Ac', Ä: 'Ad', Í: 'Ia', Î: 'Ic', Ï: 'Id',
    Ó: 'Oa', Ô: 'Oc', Ö: 'Od', Ú: 'Ua', Ù: 'Ug', Û: 'Uc', Ü: 'Ud', Ñ: 'Nt', Ç: 'Cz' };
  const SUB = { 'œ': 'oe', 'Œ': 'OE', '’': "'", '‘': "'", '“': '"', '”': '"', '–': '-', '—': '-', ' ': ' ', ' ': ' ', '•': '·', '✓': 'v', 'ᐸ': '<', 'ᐳ': '>', '＜': '<', '＞': '>', '｜': '|', '／': '/', '！': '!', '？': '?', '（': '(', '）': ')', '：': ':', '　': ' ' };  // ᐸ ᐳ : les < > des titres YouTube
  const H = 11, glyphs = new Map(); let raster;
  function glyph(ch) {
    let g = glyphs.get(ch); if (g) return g;
    const px = [], add = (rows, ox, oy) => rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) if (r[x] === '#') px.push([ox + x, oy + y]); });
    const c = COMP[ch], src = S[c ? c[0] : ch]; let w = 3;
    if (src) {
      const rows = src.split(' '); w = Math.max(...rows.map(r => r.length)); add(rows, 0, 2);
      if (c) { const a = ACC[c[1]]; add(a, Math.floor((w - a[0].length) / 2), c[1] === 'z' ? 9 : /[A-Z]/.test(c[0]) ? 0 : 1); }
    } else if (ch !== ' ') {  // japonais, emoji… : la lettre du système, réduite à des pixels nets (sans lissage) sur la même hauteur que la police
      const q = (raster ??= document.createElement('canvas').getContext('2d', { willReadFrequently: true })), RW = 16;
      q.canvas.width = RW; q.canvas.height = H; q.font = '11px "MS Gothic", "Yu Gothic UI", Meiryo, "Segoe UI Symbol", sans-serif'; q.fillStyle = '#000'; q.fillText(ch, 0, 10);
      const d = q.getImageData(0, 0, RW, H).data; let mx = 0;
      for (let y = 0; y < H; y++) for (let x = 0; x < RW; x++) if (d[(y * RW + x) * 4 + 3] > 110) { px.push([x, y]); mx = Math.max(mx, x + 1); }
      w = mx || 3;
      if (!px.length) { w = 5; add(['#####', '#...#', '#...#', '#...#', '#...#', '#...#', '#####'], 0, 2); }  // vraiment inconnue : une petite case
    }
    g = { w, px }; glyphs.set(ch, g); return g;
  }
  function layout(text) {
    let x = 0; const items = [];
    for (const ch of String(text)) for (const c of SUB[ch] ?? ch) { const g = glyph(c); items.push([g, x]); x += g.w + 1; }
    return { w: Math.max(0, x - 1), items };
  }
  function draw(g, text, x, y, color, s = 1) {  // (x, y) : coin haut gauche de la case
    const L = layout(text); g.fillStyle = color;
    for (const [gl, ox] of L.items) for (const [px, py] of gl.px) g.fillRect(x + (ox + px) * s, y + py * s, s, s);
    return L.w * s;
  }
  const bmp = new Map();
  function sprite(text, color, s = 1) {  // le texte tout prêt, gardé pour les images suivantes du jeu
    const k = text + '|' + color + '|' + s; let c = bmp.get(k); if (c) return c;
    c = document.createElement('canvas'); c.width = Math.max(1, layout(text).w * s); c.height = H * s; draw(c.getContext('2d'), text, 0, 0, color, s);
    if (bmp.size > 400) bmp.delete(bmp.keys().next().value);
    bmp.set(k, c); return c;
  }
  // comme fillText : (x, y) sur la ligne de base, aligné à gauche, au centre ou à droite
  function fill(g, text, x, y, color, s = 1, align = 'left') {
    const c = sprite(String(text), color, s), dx = align === 'center' ? -c.width / 2 : align === 'right' ? -c.width : 0;
    g.drawImage(c, Math.round(x + dx), Math.round(y - 9 * s));
  }
  const scale = size => Math.max(1, Math.round((size || 8) / 8));
  function art(rows, pal, s = 1) {  // un dessin en lignes de caractères, chaque caractère une couleur de la palette (« . » : transparent)
    const c = document.createElement('canvas'); c.width = Math.max(...rows.map(r => r.length)) * s; c.height = rows.length * s;
    const g = c.getContext('2d');
    rows.forEach((r, y) => { for (let x = 0; x < r.length; x++) { const col = pal[r[x]]; if (col) { g.fillStyle = col; g.fillRect(x * s, y * s, s, s); } } });
    return c;
  }
  return { H, layout, draw, sprite, fill, scale, art };
})();

// les pièces de l'interface, pixel par pixel (K : contour, les autres lettres : la palette du jeu)
const PX_PANEL = ['..KKKKKKKKKKKK..', '.KAAAAAAAAAAAAK.', 'KALAAAAAAAAAALSK', 'KAAKKKKKKKKKKSSK', 'KAAKHHHHHHHHKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK',
  'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKHDDDDDDDKSSK', 'KAAKKKKKKKKKKSSK', 'KALSSSSSSSSSSLSK', '.KSSSSSSSSSSSSK.', '..KKKKKKKKKKKK..'];
const PX_CARD = ['.KKKKKKKKKK.', 'KFFFFFFFFFFK', 'KFHHHHHHHHFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFHDDDDDDDFK', 'KFSSSSSSSSFK', 'KFFFFFFFFFFK', '.KKKKKKKKKK.'];
const PX_BTN = ['.KKKKKKKKKK.', 'KWWWWWWWWWWK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KWMMMMMMMMBK', 'KBBBBBBBBBBK', 'KKKKKKKKKKKK', 'KDDDDDDDDDDK', '.KKKKKKKKKK.'];
const PX_BTN_DOWN = ['............', '............', '.KKKKKKKKKK.', 'KBBBBBBBBBBK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KBMMMMMMMMWK', 'KWWWWWWWWWWK', '.KKKKKKKKKK.'];
const PX_TRACK = ['.KKKKKKKKKK.', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KDDDDDDDDDDK', 'KHHHHHHHHHHK', '.KKKKKKKKKK.'];
const PX_KNOB = ['.KKKKK.', 'KWWWWWK', 'KWAAABK', 'KWAAABK', 'KKKKKKK', 'KWAAABK', 'KWAAABK', 'KBBBBBK', 'KDDDDDK', '.KKKKK.'];
const PX_RAIL = ['KDDDDDDK', 'KDDDDDDK', 'KDDDDDDK', 'KDDHHDDK'];
const PX_ICONS = {
  play: ['kk......', 'kakk....', 'kaaakk..', 'kaaaaakk', 'kaaaaaak', 'kaaaaakk', 'kaaakk..', 'kakk....', 'kk......'],
  full: ['www...www', 'w.......w', 'w.......w', '.........', '....a....', '.........', 'w.......w', 'w.......w', 'www...www'],
  note: ['...aaaaaa', '...aaaaaa', '...a....a', '...a....a', '...a....a', '.aaa..aaa', 'aaaa.aaaa', 'aaaa.aaaa', '.aa...aa.'],
  star: ['....g....', '....g....', '...ggg...', 'ggggwgggg', '.ggwwwgg.', '..ggggg..', '..oo.oo..', '.oo...oo.', '.o.....o.'],
  crown: ['g...g...g', 'gg.ggg.gg', 'ggggggggg', 'grgggggrg', 'ggggggggg', 'ooooooooo'],
  folder: ['oooo.....', 'oggoooooo', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ggggggggg', 'ooooooooo'],
  vol: ['....w....', '...ww..b.', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', 'wwwww.b.b', '...ww..b.', '....w....'],
  clock: ['..wwwww..', '.w.....w.', 'w...a...w', 'w...a...w', 'w...aaa.w', 'w.......w', 'w.......w', '.w.....w.', '..wwwww..'],
  cursor: ['....a....', '..aaaaa..', '.a..a..a.', '.a.....a.', 'aaa.w.aaa', '.a.....a.', '.a..a..a.', '..aaaaa..', '....a....'],
  plus: ['...b...', '...b...', '...b...', 'bbbbbbb', '...b...', '...b...', '...b...'],
  down: ['wwwwwww', '.wwwww.', '..www..', '...w...'],
};

/* habille la page du jeu : root = son conteneur, T = sa palette, icons = [motif du texte, icône] pour les boutons et libellés */
function pxSkin(root, { T, icons = [], emblem, title }) {
  root.classList.add('pxk'); const s = 2, url = c => c.toDataURL();
  const btnPal = (M, W, B, D) => ({ K: T.k, W, M, B, D });
  const BN = btnPal(T.btn, T.btnHi, T.btnLo, T.k2), BH = btnPal(T.btnHov, T.btnHovHi, T.btnLo, T.k2);
  const BA = btnPal(T.acc, T.accL, T.accS, T.accD), BAH = btnPal(T.accL, '#ffffff', T.acc, T.accD);
  const img = { panel: PXK.art(PX_PANEL, { K: T.k, A: T.acc, S: T.accS, L: T.rivet, H: T.hl, D: T.fill }, s),
    card: PXK.art(PX_CARD, { K: T.k, F: T.line, H: T.hl, D: T.fill, S: T.k2 }, s), cardOn: PXK.art(PX_CARD, { K: T.k, F: T.acc, H: T.accS, D: T.fillOn, S: T.accD }, s),
    btn: PXK.art(PX_BTN, BN, s), btnH: PXK.art(PX_BTN, BH, s), btnD: PXK.art(PX_BTN_DOWN, BH, s),
    main: PXK.art(PX_BTN, BA, s), mainH: PXK.art(PX_BTN, BAH, s), mainD: PXK.art(PX_BTN_DOWN, BA, s),
    track: PXK.art(PX_TRACK, { K: T.k, D: T.k2, H: T.line }, s), knob: PXK.art(PX_KNOB, { K: T.k, W: T.accL, A: T.acc, B: T.accS, D: T.accD }, s),
    rail: PXK.art(PX_RAIL, { K: T.k, D: T.k2, H: T.line }, s), tile: PXK.art(T.tile, { x: T.bgDot, ':': T.bgDot2, '+': T.spark, '*': T.spark2 }, s) };
  const u = Object.fromEntries(Object.entries(img).map(([k, c]) => [k, url(c)]));
  const nine = (k, sl) => `border-style:solid;border-width:${sl * s}px;border-image:url(${u[k]}) ${sl * s} fill / ${sl * s}px stretch`;
  const IP = { k: T.k, w: T.text, a: T.acc, b: T.acc2, g: T.gold, o: T.orange, r: T.red, n: T.green, N: T.green2, m: T.muted, s: T.accS };
  const iconUrl = new Map(), icon = name => {
    let v = iconUrl.get(name); if (!v) { const c = PXK.art(PX_ICONS[name] || emblem, IP, s); v = { u: url(c), w: c.width, h: c.height }; iconUrl.set(name, v); }
    const b = document.createElement('b'); b.className = 'pxI'; b.setAttribute('aria-hidden', 'true'); b.style.cssText = `width:${v.w}px;height:${v.h}px;background-image:url(${v.u})`; return b;
  };
  const R = '.pxk.pxk';
  const css = document.createElement('style');
  css.textContent = `html,html body{background:${T.bg} url(${u.tile}) 0 0/${img.tile.width}px ${img.tile.height}px repeat!important}
::-webkit-scrollbar{width:16px;height:16px} ::-webkit-scrollbar-track{background:url(${u.rail}) 0 0/16px 8px repeat-y} ::-webkit-scrollbar-thumb{${nine('main', 4)}} ::-webkit-scrollbar-corner{background:none}
${R}{color:${T.text}}
${R} .px{box-shadow:none;background:none}
${R} .agHead{gap:18px;margin:0}
${R} .agHead .label{display:flex;align-items:center;gap:12px}
${R} .btn,${R} .tab{${nine('btn', 4)};height:auto;min-height:0;padding:0 6px 4px;margin:0;color:${T.text};font:12px/1 monospace;display:inline-flex;align-items:center;gap:6px;filter:none;text-shadow:none;letter-spacing:0;cursor:var(--cp,pointer)}
${R} .btn:hover,${R} .tab:hover{border-image-source:url(${u.btnH})}
${R} .btn:active,${R} .tab:active{border-image-source:url(${u.btnD});padding:4px 6px 0}
${R} .btn.main,${R} .tab.on{border-image-source:url(${u.main});color:${T.k}}
${R} .btn.main:hover,${R} .tab.on:hover{border-image-source:url(${u.mainH})}
${R} .btn.main:active,${R} .tab.on:active{border-image-source:url(${u.mainD})}
${R} .btn:focus-visible,${R} .tab:focus-visible{outline:2px dashed ${T.acc2};outline-offset:2px}
${R} .btn .pxV,${R} .tab .pxV{white-space:nowrap}
${R} .sysCard{${nine('card', 4)};padding:4px 6px;gap:8px;background:none}
${R} .sysCard.on{border-image-source:url(${u.cardOn})}
${R} .sysCard.on>b{color:${T.acc}}
${R} .sysCard>b{color:${T.text}}
${R} .row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
${R} .gameBox,${R} .thBox{${nine('panel', 5)};box-shadow:none;background:none;padding:2px;gap:8px;grid-template-rows:auto auto}
${R} .gameBox canvas,${R} .thBox canvas{display:block;background:#05010b}
${R} .gameBox:fullscreen,${R} .thBox:fullscreen{border:0;padding:0;background:#000}
${R} .rhFs{position:static;opacity:1;justify-self:end;margin:0 6px 6px 0}
${R} .rhTabs{gap:8px;flex-wrap:wrap}
${R} .hint{color:${T.muted};line-height:24px}
${R} label{color:${T.muted};display:inline-flex;align-items:center;gap:8px}
${R} .rhDel{color:${T.red};top:6px;right:8px}
${R} input[type=range]{-webkit-appearance:none;appearance:none;background:none;height:20px;width:150px}
${R} input[type=range]::-webkit-slider-runnable-track{height:12px;${nine('track', 2)}}
${R} input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:14px;height:20px;border:0;background:url(${u.knob}) 0 0/100% 100%;margin-top:-8px;cursor:var(--cp,pointer)}
${R} .pxSel{justify-content:space-between;gap:10px;max-width:100%;overflow:hidden}
${R} .rhImport .pxSel{flex:1;min-width:0}
.pxMenu{position:fixed;z-index:50;${nine('card', 4)};padding:2px;max-height:280px;overflow-y:auto;display:flex;flex-direction:column;gap:2px;color:${T.text}}
.pxMenu button{all:unset;padding:3px 8px;cursor:var(--cp,pointer);white-space:nowrap}
.pxMenu button:hover,.pxMenu button:focus-visible,.pxMenu button.on{background:${T.btnHov};color:${T.text}}
.pxMenu button.on{color:${T.acc}}
.pxT{position:relative;white-space:normal;font:12px/1 monospace;letter-spacing:0;text-transform:none}
.pxT i{display:inline-block;vertical-align:middle;background:currentColor;-webkit-mask:var(--m) 0 0/100% 100% no-repeat;mask:var(--m) 0 0/100% 100% no-repeat;image-rendering:pixelated}
.pxI{display:inline-block;vertical-align:middle;background:0 0/100% 100% no-repeat;image-rendering:pixelated;margin-right:6px}
.pxV>.pxI+.pxI{margin-left:-4px}
.pxSr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`;
  document.head.append(css);
  // un mot = une image (en masque : sa couleur suit celle du texte), une règle par mot pour ne pas répéter l'image
  const words = new Map(), sheet = document.head.appendChild(document.createElement('style')).sheet;
  const word = w => {
    let k = words.get(w);
    if (!k) { const c = PXK.sprite(w, '#fff', s); k = 'pw' + words.size; words.set(w, k); sheet.insertRule(`.${k}{--m:url(${c.toDataURL()});width:${c.width}px;height:${c.height}px}`, sheet.cssRules.length); }
    const i = document.createElement('i'); i.className = k; return i;
  };
  function render(vis, text, lead) {
    const parts = [], ic = lead && icons.find(([re]) => re.test(text.trim()));
    if (ic) parts.push(icon(ic[1]));
    for (const m of text.matchAll(/(★+)|(\s+)|([^\s★]+)/g)) {
      if (m[1]) for (const _ of m[1]) parts.push(icon('star'));
      else if (m[2]) parts.push(document.createTextNode(' '));
      else parts.push(word(m[3]));
    }
    vis.replaceChildren(...parts);
  }
  const lead = node => node.parentElement?.matches('button,label,.tab,.btn') && !node.previousSibling;
  function pixText(node) {  // le texte reste dans la page (lecteur d'écran, copier) ; on voit ses lettres en pixels
    const wrap = document.createElement('span'), sr = document.createElement('span'), vis = document.createElement('span');
    wrap.className = 'pxT'; sr.className = 'pxSr'; vis.className = 'pxV'; vis.setAttribute('aria-hidden', 'true');
    const first = lead(node); node.replaceWith(wrap); sr.append(node); wrap.append(sr, vis); render(vis, node.data, first);
  }
  function pxSelect(sel) {  // une liste déroulante en pixels ; la vraie reste cachée et garde sa valeur et ses événements
    sel.dataset.px = '1'; sel.style.display = 'none';
    const b = document.createElement('button'), lab = document.createElement('span'); b.type = 'button'; b.className = 'btn pxSel'; b.append(lab, icon('down')); sel.after(b);
    const sync = () => { const t = sel.selectedOptions[0]?.textContent || '—'; if (lab.dataset.t !== t) { lab.dataset.t = t; lab.textContent = t; } };
    const d = Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value');
    Object.defineProperty(sel, 'value', { configurable: true, get() { return d.get.call(this); }, set(v) { d.set.call(this, v); sync(); } });
    new MutationObserver(sync).observe(sel, { childList: true, subtree: true, characterData: true, attributes: true });
    sel.addEventListener('change', sync);
    b.onclick = () => {
      document.querySelector('.pxMenu')?.remove();
      const m = document.createElement('div'), r = b.getBoundingClientRect(); m.className = 'pxMenu'; m.setAttribute('role', 'listbox');
      for (const o of sel.options) {
        const it = document.createElement('button'); it.type = 'button'; it.textContent = o.textContent; it.className = o.selected ? 'on' : ''; it.setAttribute('role', 'option');
        it.onclick = () => { sel.value = o.value; sel.dispatchEvent(new Event('input', { bubbles: true })); sel.dispatchEvent(new Event('change', { bubbles: true })); close(); b.focus(); };
        m.append(it);
      }
      root.append(m);
      const below = innerHeight - r.bottom; m.style.minWidth = r.width + 'px'; m.style.left = Math.min(r.left, innerWidth - m.offsetWidth - 4) + 'px';
      m.style.top = (below > m.offsetHeight + 8 || below > r.top ? r.bottom + 2 : r.top - m.offsetHeight - 2) + 'px';
      const close = () => { m.remove(); removeEventListener('pointerdown', out, true); removeEventListener('keydown', key, true); removeEventListener('blur', close); };
      const out = e => { if (!m.contains(e.target) && e.target !== b && !b.contains(e.target)) close(); };
      const key = e => { if (e.key === 'Escape') { e.stopPropagation(); close(); b.focus(); } };
      addEventListener('pointerdown', out, true); addEventListener('keydown', key, true); addEventListener('blur', close);
      (m.querySelector('.on') || m.firstChild)?.focus();
    };
    sync();
  }
  const SKIP = 'select,option,textarea,script,style,canvas,.pxT,[data-pxskip]';
  let queued = false;
  function pass() {
    queued = false;
    root.querySelectorAll('select.gSel:not([data-px])').forEach(pxSelect);
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), todo = [];
    for (let n; (n = w.nextNode());) if (n.data.trim() && n.parentElement && !n.parentElement.closest(SKIP)) todo.push(n);
    todo.forEach(pixText);
  }
  new MutationObserver(ms => {
    for (const m of ms) if (m.type === 'characterData') { const wrap = m.target.parentNode?.closest?.('.pxT'); if (wrap) render(wrap.lastChild, m.target.data, false); }
    if (!queued) { queued = true; queueMicrotask(pass); }
  }).observe(root, { childList: true, subtree: true, characterData: true });
  // le titre : grosses lettres à contour, trois tons, et l'emblème du jeu
  const lab = root.querySelector('.agHead .label');
  if (lab) {
    const L = PXK.layout(title), c = document.createElement('canvas'), g = c.getContext('2d'), on = [];
    c.width = L.w + 3; c.height = PXK.H + 3;
    for (const [gl, ox] of L.items) for (const [x, y] of gl.px) on.push([ox + x + 1, y + 1]);
    g.fillStyle = T.k; for (const [x, y] of on) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [2, 2], [1, 2], [2, 1]]) g.fillRect(x + dx, y + dy, 1, 1);
    for (const [x, y] of on) { g.fillStyle = y <= 5 ? T.accL : y <= 7 ? T.acc : T.accS; g.fillRect(x, y, 1, 1); }
    const big = document.createElement('canvas'), z = 4; big.width = c.width * z; big.height = c.height * z;
    const bg = big.getContext('2d'); bg.imageSmoothingEnabled = false; bg.drawImage(c, 0, 0, big.width, big.height);
    const t = document.createElement('b'); t.className = 'pxI'; t.style.cssText = `width:${big.width}px;height:${big.height}px;background-image:url(${big.toDataURL()})`;
    const e = PXK.art(emblem, IP, 3), em = document.createElement('b'); em.className = 'pxI'; em.style.cssText = `width:${e.width}px;height:${e.height}px;background-image:url(${e.toDataURL()})`;
    const sr = document.createElement('span'); sr.className = 'pxSr'; sr.textContent = lab.textContent;
    lab.dataset.pxskip = '1'; lab.replaceChildren(em, t, sr);
  }
  pass();
}

export default async function (ctx) {
  const view = ctx.view;
  if (!ctx.host) { view.textContent = "Ce plugin doit être approuvé par NeoDex pour s'ouvrir."; return; }
  const host = ctx.host, { el, toast, sfx } = host;
  const folder = ctx.folder;
  host.addStyle(CSS);
  view.innerHTML = HTML;
  pxSkin(view.querySelector('.appWrap'), { title: "MINIGOLF", T: {"k": "#050c06", "k2": "#0c1a0e", "fill": "#142a18", "fillOn": "#1c3a22", "hl": "#24482a", "line": "#3a6a40", "acc": "#5fdf6a", "accL": "#c8ffc8", "accS": "#2a9a3a", "accD": "#0a3a10", "rivet": "#c8ffc8", "btn": "#24482a", "btnHi": "#5a9a5a", "btnLo": "#0c1a0e", "btnHov": "#2a5430", "btnHovHi": "#7aba7a", "text": "#f0fff0", "muted": "#b0d0a8", "acc2": "#ffd84a", "gold": "#ffd84a", "orange": "#ffa030", "red": "#ff4a5a", "green": "#7ee07a", "green2": "#2f8a3a", "bg": "#060e08", "bgDot": "#142a18", "bgDot2": "#0c1a0e", "spark": "#3a6a40", "spark2": "#ffd84a", "tile": ["................", "...:............", "................", "..........+.....", "................", "................", ".....:..........", "................", "................", ".............:..", "................", "..+.............", "................", ".........:......", "................", "................"]},
  emblem: ["......w.....", "......wrr...", "......wrrr..", "......wr....", "......w.....", "......w.....", "......w.....", "..nnnnwnnn..", ".nnnnkkknnn.", "nnnnnnnnnnnn", ".nnnnnnnnnn.", "............"],
  icons: [[/^NOUVELLE/, "play"], [/^RECORDS/, "crown"]] });
  const $ = id => view.querySelector('#' + id) || document.getElementById(id);
  const doc = async n => { try { return await folder.read(n); } catch { return null; } };
  const games = { best: {}, ...(await doc('games')) };
  let gamesTimer = null;
  const saveGames = () => { clearTimeout(gamesTimer); gamesTimer = setTimeout(() => { gamesTimer = null; folder.write('games', games).catch(() => {}); }, 500); };
  const best = (k, v) => { const b = games.best[k]; if (b == null || v > b) { games.best[k] = v; saveGames(); return true; } return false; };
  const gstore = (k, init) => (games[k] ??= init);
function gameLoop(st, appKey, update, draw) {
  cancelAnimationFrame(st.raf);
  const STEP = 1000 / 60; let acc = 0, last = performance.now();
  const frame = t => {
    if (!view.classList.contains('on')) { st.raf = 0; if (st.mode === 'play') st.mode = 'pause'; return; }  // leaving the tab pauses the game
    st.raf = requestAnimationFrame(frame);
    acc += Math.min(200, t - last); last = t;
    while (acc >= STEP) { if (st.mode === 'play') update(); st.tick++; acc -= STEP; }
    draw();
  };
  st.raf = requestAnimationFrame(frame);
}
function gameText(g, w, lines, y0) {  // lignes centrées en police pixel, sur une bande sombre
  g.fillStyle = 'rgba(11,3,28,.72)'; g.fillRect(0, y0 - 14, w, lines.length * 14 + 14);
  lines.forEach(([text, color, size], i) => PXK.fill(g, text, w / 2, y0 + i * 14, color, PXK.scale(size), 'center'));
}
const px = (g, color, x, y, w = 1, h = 1) => { g.fillStyle = color; g.fillRect(Math.round(x), Math.round(y), w, h); };
function sprite(g, rows, x, y, pal) { rows.forEach((r, j) => { for (let i = 0; i < r.length; i++) { const c = pal[r[i]]; if (c) px(g, c, x + i, y + j); } }); }
const seeded = s => () => { s = s + 0x6D2B79F5 | 0; let t = Math.imul(s ^ s >>> 15, 1 | s); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
const pxFont = (g, text, x, y, color, size = 8, align = 'left') => { const s = PXK.scale(size); PXK.fill(g, text, x + s, y + s, '#05010b', s, align); PXK.fill(g, text, x, y, color, s, align); };

const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
// petits outils communs aux jeux : une toile pré-dessinée, la position du pointeur dans le canevas, un bip
const cnv = (w, h, fn) => { const c = el('canvas'); c.width = w; c.height = h; const g = c.getContext('2d'); g.imageSmoothingEnabled = false; fn(g); return c; };
const spr = (rows, pal) => cnv(Math.max(...rows.map(r => r.length)), rows.length, g => sprite(g, rows, 0, 0, pal));
const W = 256, H = 192, cv = $('gc'), g = cv.getContext('2d'); g.imageSmoothingEnabled = false;
const cpos = e => { const r = cv.getBoundingClientRect(); return [(e.clientX - r.left) / r.width * W, (e.clientY - r.top) / r.height * H]; };
let actx = null;
const beep = (f, d = .1, type = 'square', slide = 0, vol = .08) => { try { actx ??= new AudioContext(); const o = actx.createOscillator(), gn = actx.createGain(), t = actx.currentTime; o.type = type; o.frequency.setValueAtTime(f, t); if (slide) o.frequency.exponentialRampToValueAtTime(slide, t + d); gn.gain.setValueAtTime(vol, t); gn.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(gn).connect(actx.destination); o.start(t); o.stop(t + d + .02); } catch {} };
const keyOk = e => view.classList.contains('on') && !/INPUT|SELECT|TEXTAREA/.test(e.target.tagName);
const showStats = rows => $('gStats').replaceChildren(...rows.flatMap(([a, b]) => [el('span', '', a), el('b', '', String(b))]));

/* ---------- Minigolf : neuf trous dessinés à la main. Tirer en arrière pour viser, lâcher pour frapper. Le sable freine, l'eau coûte un coup. ---------- */
const MG = {T: 16, TOP: 16, R: 2, MAXP: 5.2};
const MG_HOLES = [  // . gazon  : sable  ~ eau  T départ  O trou  (espace : décor, la balle rebondit dessus)
  [2, ['                ', '                ', '                ', '  ............  ', '  .T........O.  ', '  ............  ', '                ', '                ', '                ', '                ', '                ']],
  [3, ['                ', '  .....         ', '  .T...         ', '  .....         ', '  .....         ', '  ............  ', '  ..........O.  ', '  ............  ', '                ', '                ', '                ']],
  [3, ['                ', '                ', '  ............  ', '  ....::::....  ', '  .T..::::..O.  ', '  ....::::....  ', '  ............  ', '                ', '                ', '                ', '                ']],
  [3, ['                ', '  ......~.....  ', '  .T....~.....  ', '  ......~.....  ', '  ............  ', '  ......~.....  ', '  ......~...O.  ', '  ......~.....  ', '                ', '                ', '                ']],
  [4, ['                ', '  .T......      ', '  ........      ', '      ....      ', '      ....      ', '      ........  ', '      ........  ', '  ........      ', '  ..O.....      ', '                ', '                ']],
  [3, ['                ', '  ............  ', '  ............  ', '  .T..    ..O.  ', '  ....    ....  ', '  ....    ....  ', '  ............  ', '  ............  ', '                ', '                ', '                ']],
  [4, ['                ', ' ..............', ' .T.  .  .  .O.', ' ..............', ' .  .  .  .  ..', ' ..............', '                ', '                ', '                ', '                ', '                ']],
  [4, ['                ', '  ............  ', '  .~~~~~~~~~~.  ', '  .~~~~~~~~~~.  ', '  .T~~~..~~~O.  ', '  .~~~~~~~~~~.  ', '  .~~~~~~~~~~.  ', '  ............  ', '                ', '                ', '                ']],
  [5, ['                ', '  ...........   ', '  .T.........   ', '  ...........   ', '          ...   ', '  ::.......::   ', '  ...........   ', '  .O.           ', '  ...           ', '                ', '                ']],
].map(([par, m], i) => [par, m.map(row => row.padEnd(16, ' ').slice(0, 16))]);
const mgs = gstore('minigolf', {rounds: 0, aces: 0, bestRound: 0});
function mgPath(m, s, e) {  // le plus court chemin à pied sec (ni décor ni eau) du départ au trou, en cases ; -1 s'il n'y en a pas
  const seen = new Set([s + '']); let q = [s], d = 0;
  while (q.length) { const nq = []; for (const [x, y] of q) { if (x === e[0] && y === e[1]) return d; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = m[y + dy]?.[x + dx], k = [x + dx, y + dy] + ''; if (c && c !== ' ' && c !== '~' && !seen.has(k)) { seen.add(k); nq.push([x + dx, y + dy]); } } } q = nq; d++; }
  return -1;
}
function mgRandomHole() {  // un trou au hasard : une allée de 3 cases qui serpente par des points tirés au sort, puis du sable, de l'eau ou un plot, sans jamais couper le chemin
  const rnd = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  for (;;) {
    const m = Array.from({length: 11}, () => Array(16).fill(' ')), pts = [[rnd(2, 4), rnd(2, 8)]];
    for (let i = rnd(0, 2); i > 0; i--) pts.push([rnd(4, 11), rnd(2, 8)]); pts.push([rnd(11, 13), rnd(2, 8)]);
    if (Math.random() < .5) pts.forEach(p => p[0] = 15 - p[0]);
    const paint = (x, y) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (x + i >= 1 && y + j >= 1 && x + i < 15 && y + j < 10) m[y + j][x + i] = '.'; };
    for (let k = 0; k + 1 < pts.length; k++) {
      let [x, y] = pts[k]; const [x2, y2] = pts[k + 1], goX = () => { while (x !== x2) { paint(x, y); x += Math.sign(x2 - x); } }, goY = () => { while (y !== y2) { paint(x, y); y += Math.sign(y2 - y); } };
      if (Math.random() < .5) { goX(); goY(); } else { goY(); goX(); } paint(x, y);
    }
    const T = pts[0], O = pts.at(-1), fair = []; let water = false;
    m.forEach((r, y) => r.forEach((c, x) => { if (c === '.' && Math.hypot(x - T[0], y - T[1]) > 2 && Math.hypot(x - O[0], y - O[1]) > 2) fair.push([x, y]); }));
    for (let h = rnd(1, 3); h > 0 && fair.length; h--) {
      const [x, y] = fair[rnd(0, fair.length - 1)], kind = ['~', ':', ':', ' '][rnd(0, 3)], sz = kind === ' ' ? 1 : rnd(1, 2), save = m.map(r => [...r]);
      for (let j = 0; j < sz; j++) for (let i = 0; i < sz; i++) if (m[y + j]?.[x + i] === '.') m[y + j][x + i] = kind;
      if (mgPath(m, T, O) < 0) save.forEach((r, i) => m[i] = r); else if (kind === '~') water = true;
    }
    m[T[1]][T[0]] = 'T'; m[O[1]][O[0]] = 'O';
    const d = mgPath(m, T, O); if (d < 7) continue;
    return [Math.min(5, 2 + Math.floor(d / 9) + water), m.map(r => r.join(''))];
  }
}
let mg = null;
const mgTile = (x, y) => mg.map[Math.floor((y - MG.TOP) / MG.T)]?.[Math.floor(x / MG.T)] ?? ' ';
const mgOpen = c => c !== ' ';
function mgFind(map, ch) { for (let y = 0; y < map.length; y++) { const x = map[y].indexOf(ch); if (x >= 0) return [x * MG.T + 8, MG.TOP + y * MG.T + 8]; } }
function mgHole(n) {
  const [par, map] = mg.holes[n], [tx, ty] = mgFind(map, 'T'), [cx, cy] = mgFind(map, 'O');
  Object.assign(mg, {hole: n, par, map, bx: tx, by: ty, vx: 0, vy: 0, lastX: tx, lastY: ty, cupX: cx, cupY: cy, strokes: 0, aim: null, sunkAt: 0, mode: 'play', splash: 0, bg: null});
}
function mgNew() { mg = Object.assign(mg || {tick: 0, raf: 0}, {cards: [], holes: mgs.rnd ? Array.from({length: 9}, mgRandomHole) : MG_HOLES}); mgHole(0); mgInfo(); }
function mgUpdate() {
  const sp = Math.hypot(mg.vx, mg.vy); if (!sp) return;
  for (let s = 0; s < 4; s++) {  // petits pas : la balle ne traverse jamais une bordure
    const nx = mg.bx + mg.vx / 4; if ([-MG.R, MG.R].some(d => !mgOpen(mgTile(nx + d, mg.by - MG.R)) || !mgOpen(mgTile(nx + d, mg.by + MG.R)))) { mg.vx = -mg.vx * .78; beep(300, .02, 'square', 0, .04); } else mg.bx = nx;
    const ny = mg.by + mg.vy / 4; if ([-MG.R, MG.R].some(d => !mgOpen(mgTile(mg.bx - MG.R, ny + d)) || !mgOpen(mgTile(mg.bx + MG.R, ny + d)))) { mg.vy = -mg.vy * .78; beep(300, .02, 'square', 0, .04); } else mg.by = ny;
  }
  const t = mgTile(mg.bx, mg.by), f = t === ':' ? .9 : .982; mg.vx *= f; mg.vy *= f;
  const dc = Math.hypot(mg.bx - mg.cupX, mg.by - mg.cupY);
  if (dc < 6 && sp < 3.2) { mg.vx += (mg.cupX - mg.bx) * .08; mg.vy += (mg.cupY - mg.by) * .08; }  // le bord du trou attire un peu
  if (dc < 2.5 && sp < 3.2) { mg.vx = mg.vy = 0; mg.bx = mg.cupX; mg.by = mg.cupY; mgSunk(); return; }
  if (t === '~') { mg.splash = mg.tick; mg.bx = mg.lastX; mg.by = mg.lastY; mg.vx = mg.vy = 0; mg.strokes++; beep(200, .3, 'sine', 80, .1); return; }
  if (Math.hypot(mg.vx, mg.vy) < .05) { mg.vx = mg.vy = 0; }
}
function mgSunk() {
  mg.mode = 'sunk'; mg.sunkAt = mg.tick; mg.cards[mg.hole] = mg.strokes; if (mg.strokes === 1) mgs.aces++;
  [659, 784, 988].forEach((f, i) => setTimeout(() => beep(f, .12, 'triangle'), i * 90 + 100));
  if (mg.hole === 8) { const tot = mg.cards.reduce((a, b) => a + b, 0); mgs.rounds++; if (!mgs.bestRound || tot < mgs.bestRound) mgs.bestRound = tot; saveGames(); }
  saveGames(); mgInfo();
}
function mgBg() {  // le parcours, dessiné une fois par trou : gazon tondu en bandes, bordures de bois, sable, eau, haies
  return cnv(W, H, b => {
    px(b, '#1a2a1a', 0, 0, W, H);
    for (let y = MG.TOP; y < H; y++) for (let x = 0; x < W; x++) { const h = (Math.imul(x * 31 + y * 17, 2654435761) >>> 0) / 4294967296; px(b, h < .08 ? '#2a4a22' : h < .12 ? '#4a3a6a' : (x + y) % 3 ? '#1e3a1e' : '#22421f', x, y); }
    for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) {
      const ch = mg.map[r][c], X = c * MG.T, Y = MG.TOP + r * MG.T; if (!mgOpen(ch)) continue;
      if (ch === '~') { for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) px(b, (x + y * 2 + c * 3) % 9 === 0 ? '#5a9aff' : y < 2 && !(mg.map[r - 1]?.[c] === '~') ? '#1a3a7a' : '#2a5ac0', X + x, Y + y); continue; }
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) px(b, ch === ':' ? ((x * 3 + y * 5) % 7 < 2 ? '#c8a860' : '#e0c47a') : ((Math.floor((X + x) / 8) + Math.floor((Y + y) / 8)) % 2 ? '#4ab04a' : '#56bc52'), X + x, Y + y);
    }
    for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) {  // les bordures en bois, côté décor de chaque case ouverte
      const X = c * MG.T, Y = MG.TOP + r * MG.T; if (!mgOpen(mg.map[r][c])) continue; const shut = (dr, dc) => !mgOpen(mg.map[r + dr]?.[c + dc] ?? ' ');
      if (shut(-1, 0)) { px(b, '#05010b', X - 1, Y - 3, 18, 3); px(b, '#a06a30', X - 1, Y - 3, 18, 2); }
      if (shut(1, 0)) { px(b, '#05010b', X - 1, Y + 16, 18, 3); px(b, '#7a4a20', X - 1, Y + 16, 18, 2); }
      if (shut(0, -1)) { px(b, '#05010b', X - 3, Y - 1, 3, 18); px(b, '#8a5a28', X - 3, Y - 1, 2, 18); }
      if (shut(0, 1)) { px(b, '#05010b', X + 16, Y - 1, 3, 18); px(b, '#8a5a28', X + 17, Y - 1, 2, 18); }
    }
    const [tx, ty] = mgFind(mg.map, 'T'); px(b, '#3a8a3a', tx - 5, ty - 5, 10, 10); px(b, '#e8e0d0', tx - 6, ty - 6, 2, 2); px(b, '#e8e0d0', tx + 4, ty + 4, 2, 2);
    px(b, '#05010b', 0, 0, W, MG.TOP);
  });
}
function mgDraw() {
  if (!mg.bg) mg.bg = mgBg(); g.drawImage(mg.bg, 0, 0);
  // le trou et son drapeau
  px(g, '#05010b', mg.cupX - 3, mg.cupY - 2, 6, 5); px(g, '#05010b', mg.cupX - 2, mg.cupY - 3, 4, 7); px(g, '#2a2a2a', mg.cupX - 2, mg.cupY, 4, 2);
  const wave = Math.floor(mg.tick / 12) % 2; px(g, '#e8e0d0', mg.cupX, mg.cupY - 16, 1, 14); px(g, '#ff4a5a', mg.cupX + 1, mg.cupY - 16, 6 + wave, 2); px(g, '#ff4a5a', mg.cupX + 1, mg.cupY - 14, 4 + wave, 2); px(g, '#c02030', mg.cupX + 1, mg.cupY - 12, 2, 1);
  if (mg.splash && mg.tick - mg.splash < 30) pxFont(g, 'PLOUF ! +1', mg.bx, mg.by - 8, '#a8d0ff', 6, 'center');
  // la visée : pointillés dans le sens du tir, longueur = force
  if (mg.aim && mg.mode === 'play') {
    const [ax, ay] = mg.aim, p = Math.min(MG.MAXP, Math.hypot(ax, ay) / 9), a = Math.atan2(ay, ax), col = p > MG.MAXP * .75 ? '#ff4a5a' : p > MG.MAXP * .4 ? '#ffd84a' : '#ffffff';
    for (let i = 1; i <= Math.round(p * 5); i++) if (i % 2) px(g, col, mg.bx + Math.cos(a) * i * 3 - 1, mg.by + Math.sin(a) * i * 3 - 1, 2, 2);
    px(g, '#05010b', 6, H - 10, 52, 6); px(g, col, 7, H - 9, Math.round(50 * p / MG.MAXP), 4);
  }
  if (mg.mode !== 'sunk' || mg.tick - mg.sunkAt < 6) { px(g, '#05010b', mg.bx - 2, mg.by - 1, 5, 4); px(g, '#05010b', mg.bx - 1, mg.by - 2, 3, 6); px(g, '#ffffff', mg.bx - 1, mg.by - 1, 3, 3); px(g, '#c8c8d8', mg.bx + 1, mg.by + 1, 1, 1); }
  pxFont(g, 'TROU ' + (mg.hole + 1) + '/9', 6, 11, '#ffffff', 6); pxFont(g, 'PAR ' + mg.par, W / 2, 11, '#a8d8a0', 6, 'center'); pxFont(g, 'COUPS ' + mg.strokes, W - 6, 11, '#ffd84a', 6, 'right');
  if (mg.mode === 'sunk' && mg.tick - mg.sunkAt > 20) {
    const d = mg.strokes - mg.par, word = mg.strokes === 1 ? 'TROU EN UN !' : ['', 'ALBATROS', 'EAGLE', 'BIRDIE', 'PAR', 'BOGEY', 'DOUBLE BOGEY'][4 + Math.max(-3, Math.min(2, d))] || '+' + d;
    if (mg.hole < 8) gameText(g, W, [[word, d < 0 ? '#5fdf6a' : d === 0 ? '#ffffff' : '#ffa030', 12], [mg.strokes + ' coup' + (mg.strokes > 1 ? 's' : ''), '#ffffff'], ['Clic : trou suivant', '#ffd84a']], 70);
    else { const tot = mg.cards.reduce((a, b) => a + b, 0), par = mg.holes.reduce((a, h) => a + h[0], 0); gameText(g, W, [['PARCOURS FINI', '#ffd84a', 12], [tot + ' coups (par ' + par + ')', '#ffffff'], [tot <= par ? 'Sous le par, bravo !' : (tot - par) + ' au-dessus du par', '#a8d8a0'], ['Clic : nouveau parcours', '#ffd84a']], 62); }
  }
}
cv.onpointerdown = e => {
  e.preventDefault(); if (!mg) return;
  if (mg.mode === 'sunk') { if (mg.tick - mg.sunkAt > 20) { if (mg.hole < 8) mgHole(mg.hole + 1); else mgNew(); mgInfo(); } return; }
  if (mg.vx || mg.vy) return; const [x, y] = cpos(e); mg.start = [x, y]; mg.aim = [0, 0]; cv.setPointerCapture(e.pointerId);
};
cv.onpointermove = e => { if (!mg?.aim) return; const [x, y] = cpos(e); mg.aim = [mg.start[0] - x, mg.start[1] - y]; };
cv.onpointerup = () => {
  if (!mg?.aim) return; const [ax, ay] = mg.aim, p = Math.min(MG.MAXP, Math.hypot(ax, ay) / 9); mg.aim = null;
  if (p < .3) return; const a = Math.atan2(ay, ax); mg.lastX = mg.bx; mg.lastY = mg.by; mg.vx = Math.cos(a) * p; mg.vy = Math.sin(a) * p; mg.strokes++; beep(500, .04, 'triangle', 300, .08);
};
document.addEventListener('keydown', e => { if (!keyOk(e) || !mg) return; if ((e.key === ' ' || e.key === 'Enter') && mg.mode === 'sunk' && mg.tick - mg.sunkAt > 20) { e.preventDefault(); if (mg.hole < 8) mgHole(mg.hole + 1); else mgNew(); mgInfo(); } });
function mgInfo() { showStats([['Meilleur parcours', mgs.bestRound ? mgs.bestRound + ' coups' : '—'], ['Parcours finis', mgs.rounds], ['Trous en un', mgs.aces], ['Ce parcours', mg ? mg.cards.reduce((a, b) => a + b, 0) + ' coups' : '—']]); }
$('gNew').onclick = () => { mgNew(); $('gNew').blur(); };
$('mgRnd').checked = !!mgs.rnd; $('mgRnd').onchange = () => { mgs.rnd = $('mgRnd').checked; saveGames(); mgNew(); $('mgRnd').blur(); };
{  // vérification : chaque trou (faits main et 30 au hasard) a 16 × 11 cases, un départ et un trou, reliés sans passer par l'eau
  const at = (m, ch) => { const y = m.findIndex(r => r.includes(ch)); return y < 0 ? null : [m[y].indexOf(ch), y]; };
  const ok = [...MG_HOLES, ...Array.from({length: 30}, mgRandomHole)].map(([par, m]) => m.length === 11 && m.every(r => r.length === 16) && m.join('').split('O').length === 2 && at(m, 'T') && par >= 2 && par <= 5 && mgPath(m, at(m, 'T'), at(m, 'O')) > 0);
  console.assert(ok.every(Boolean), 'minigolf', ok);
}
ctx.onOpen(() => { if (!mg) mgNew(); gameLoop(mg, 'minigolf', mgUpdate, mgDraw); mgInfo(); });

}
