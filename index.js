// Minigolf : Neuf trous dessinés à la main, avec du sable, de l'eau et des bordures en bois. Tire en arrière pour viser, lâche pour frapper.
// Jeu NeoDex en pixel art dessiné à la main (police bitmap, cadres et boutons en pixels). Il tourne dans le bac à sable de NeoDex.
const HTML = `<div class="appWrap wide">
  <div class="agHead"><span class="label">Minigolf</span><span class="hint">Clic maintenu et tirer en arrière : viser et doser · lâcher : frapper</span></div>
  <div class="gMain"><div class="gameBox"><canvas id="gc" width="256" height="192"></canvas></div>
    <div class="gSide">
      <div class="sysCard"><b>RECORDS</b><div class="gStats" id="gStats"></div></div>
      <div class="row"><button class="btn main" id="gNew">NOUVELLE PARTIE</button><button class="btn" id="gFs">PLEIN ÉCRAN</button></div>
      <label class="row">Joueurs <select class="gSel" id="mgPlayers"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option></select></label>
      <label class="row">Parcours <select class="gSel" id="mgCourse"><option value="classique">Classique</option><option value="pirate">Île aux pirates</option><option value="glace">Banquise</option><option value="espace">Station spatiale</option><option value="hasard">Au hasard (9 nouveaux trous)</option></select></label>
      <div class="hint">Plus tu tires loin, plus le coup est fort (la jauge passe au rouge au maximum).</div><div class="hint">Le sable freine beaucoup ; l'eau ramène la balle à l'endroit du tir avec un coup de pénalité.</div><div class="hint">Obstacles qui bougent : le moulin ne laisse passer qu'entre ses ailes, le pont-levis se lève (dessous, c'est l'eau), le tapis roulant pousse la balle. Sur la banquise, la glace glisse ; dans l'espace, les trous noirs avalent la balle.</div>
    </div></div>
</div>`;
const CSS = `.gMain{display:flex;gap:22px;align-items:flex-start;flex-wrap:wrap}
.gameBox{display:grid;place-items:center;padding:10px;background:#05010b;flex:2 1 560px;min-width:min(100%,560px);position:relative}
.gameBox canvas{width:100%;image-rendering:pixelated;cursor:var(--cp,pointer);touch-action:none}
.gSide{display:flex;flex-direction:column;gap:14px;flex:1;min-width:250px;max-width:420px}
.gSide .sysCard{display:flex;flex-direction:column}
.gStats{display:grid;grid-template-columns:1fr auto;gap:4px 14px}
.gStats b{text-align:right}
.gameBox canvas{width:min(100%,max(320px,calc((100vh - 190px) * 256 / 192)));height:auto;aspect-ratio:256/192}
.gameBox:fullscreen{padding:0}
.gameBox:fullscreen canvas{width:min(100vw,calc(100vh * 256 / 192))}`;
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
  // et sur les autres parcours : W moulin  B pont-levis  > < ^ v tapis roulant  * glace  X trou noir  o vide (comme l'eau)
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
const mgs = gstore('minigolf', {rounds: 0, aces: 0, bestRound: 0}); mgs.best ??= {}; if (mgs.rnd && !mgs.course) mgs.course = 'hasard'; delete mgs.rnd;
const MG_CONV = {'>': [1, 0], '<': [-1, 0], '^': [0, -1], 'v': [0, 1]};
const MG_WET = c => c === '~' || c === 'o';  // les dangers : on revient au tir d'avant, un coup de pénalité
// les parcours : leurs couleurs, et les obstacles que le tirage peut placer
const MG_THEMES = {
  classique: {dots: [.08, .12], kinds: [], fair: ['#4ab04a', '#56bc52'], bg: ['#1e3a1e', '#22421f', '#2a4a22', '#4a3a6a'], wood: ['#a06a30', '#7a4a20', '#8a5a28'], water: ['#2a5ac0', '#1a3a7a', '#5a9aff'], flag: '#ff4a5a', wet: 'PLOUF ! +1'},
  hasard: {dots: [.08, .12], kinds: ['~', ':', ':', ' ', 'W', 'B', 'C'], fair: ['#4ab04a', '#56bc52'], bg: ['#1e3a1e', '#22421f', '#2a4a22', '#4a3a6a'], wood: ['#a06a30', '#7a4a20', '#8a5a28'], water: ['#2a5ac0', '#1a3a7a', '#5a9aff'], flag: '#ff4a5a', wet: 'PLOUF ! +1'},
  pirate: {dots: [.025, .035], seed: 101, kinds: ['~', '~', ':', ':', 'B', 'W', 'B'], fair: ['#5ac06a', '#66cc70'], bg: ['#1a4a8a', '#1e5296', '#8ac8ff', '#c8a860'], wood: ['#8a6a48', '#5a3a20', '#7a5a38'], water: ['#1a5aa8', '#0e3a78', '#8ad8ff'], flag: '#1a1a1a', skull: true, wet: 'PLOUF ! +1'},
  glace: {dots: [.035, .045], seed: 202, kinds: ['*', '*', '*', '~', ' ', 'C', 'W'], fair: ['#d8ecff', '#e8f4ff'], bg: ['#1a2a4a', '#22325a', '#e8f4ff', '#5a7aa8'], wood: ['#8ac0e8', '#4a80b0', '#6aa0d0'], water: ['#1a4a8a', '#0e2e5e', '#8ac8ff'], flag: '#3a8aff', wet: 'PLOUF ! +1'},
  espace: {dots: [.004, .008], seed: 303, kinds: ['X', 'X', 'o', 'C', 'C', ' ', 'B'], fair: ['#4a4a6a', '#55557a'], bg: ['#05010b', '#0a0618', '#ffffff', '#8a7ad8'], wood: ['#9a9ab8', '#5a5a78', '#7a7a98'], water: ['#05010b', '#0a0618', '#ffffff'], flag: '#7fe0ee', wet: 'PERDUE DANS LE VIDE ! +1'},
};
function mgPath(m, s, e) {  // le plus court chemin à pied sec (ni décor ni eau) du départ au trou, en cases ; -1 s'il n'y en a pas
  const seen = new Set([s + '']); let q = [s], d = 0;
  while (q.length) { const nq = []; for (const [x, y] of q) { if (x === e[0] && y === e[1]) return d; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const c = m[y + dy]?.[x + dx], k = [x + dx, y + dy] + ''; if (c && c !== ' ' && !MG_WET(c) && !seen.has(k)) { seen.add(k); nq.push([x + dx, y + dy]); } } } q = nq; d++; }
  return -1;
}
function mgRandomHole(R = Math.random, kinds = MG_THEMES.hasard.kinds) {  // un trou au hasard : une allée de 3 cases qui serpente par des points tirés au sort, puis des obstacles du parcours, sans jamais couper le chemin
  const rnd = (a, b) => a + Math.floor(R() * (b - a + 1));
  for (;;) {
    const m = Array.from({length: 11}, () => Array(16).fill(' ')), pts = [[rnd(2, 4), rnd(2, 8)]];
    for (let i = rnd(0, 2); i > 0; i--) pts.push([rnd(4, 11), rnd(2, 8)]); pts.push([rnd(11, 13), rnd(2, 8)]);
    if (R() < .5) pts.forEach(p => p[0] = 15 - p[0]);
    const paint = (x, y) => { for (let j = -1; j <= 1; j++) for (let i = -1; i <= 1; i++) if (x + i >= 1 && y + j >= 1 && x + i < 15 && y + j < 10) m[y + j][x + i] = '.'; };
    for (let k = 0; k + 1 < pts.length; k++) {
      let [x, y] = pts[k]; const [x2, y2] = pts[k + 1], goX = () => { while (x !== x2) { paint(x, y); x += Math.sign(x2 - x); } }, goY = () => { while (y !== y2) { paint(x, y); y += Math.sign(y2 - y); } };
      if (R() < .5) { goX(); goY(); } else { goY(); goX(); } paint(x, y);
    }
    const T = pts[0], O = pts.at(-1), fair = []; let water = false;
    m.forEach((r, y) => r.forEach((c, x) => { if (c === '.' && Math.hypot(x - T[0], y - T[1]) > 2 && Math.hypot(x - O[0], y - O[1]) > 2) fair.push([x, y]); }));
    const K = kinds.length ? kinds : ['~', ':', ':', ' '], moving = [];
    for (let h = rnd(1, 3) + (kinds.length ? 1 : 0); h > 0 && fair.length; h--) {
      const [x, y] = fair[rnd(0, fair.length - 1)], kind = K[rnd(0, K.length - 1)], save = m.map(r => [...r]);
      if (m[y][x] !== '.') continue;
      if (kind === 'W' || kind === 'B') {  // le moulin ou le pont, au milieu d'une barrière (haie pour le moulin, eau pour le pont) qui coupe l'allée
        const wall = kind === 'W' ? ' ' : '~', horiz = rnd(0, 1);
        for (let k = -2; k <= 2; k++) { const cx = horiz ? x + k : x, cy = horiz ? y : y + k; if (k && m[cy]?.[cx] === '.') m[cy][cx] = wall; }
        m[y][x] = kind;
      } else if (kind === 'C') {  // un tapis roulant de 2 à 3 cases, qui sort sur du gazon
        const [d, [dx, dy]] = Object.entries(MG_CONV)[rnd(0, 3)], n = rnd(2, 3); let ok = true;
        for (let k = 0; k < n; k++) if (m[y + dy * k]?.[x + dx * k] !== '.') ok = false;
        if (!ok || m[y + dy * n]?.[x + dx * n] !== '.') continue;
        for (let k = 0; k < n; k++) m[y + dy * k][x + dx * k] = d;
      } else if (kind === 'X') m[y][x] = 'X';
      else { const sz = kind === ' ' ? 1 : rnd(1, 2); for (let j = 0; j < sz; j++) for (let i = 0; i < sz; i++) if (m[y + j]?.[x + i] === '.') m[y + j][x + i] = kind; }
      // jamais de chemin coupé, ni de trou noir collé au départ ou au trou
      if (mgPath(m, T, O) < 0 || kind === 'X' && Math.min(Math.hypot(x - T[0], y - T[1]), Math.hypot(x - O[0], y - O[1])) < 3) save.forEach((r, i) => m[i] = r);
      else if (MG_WET(kind) || kind === 'B') water = true; else if ('WC'.includes(kind)) moving.push(kind);
    }
    m[T[1]][T[0]] = 'T'; m[O[1]][O[0]] = 'O';
    const d = mgPath(m, T, O); if (d < 7) continue;
    return [Math.min(5, 2 + Math.floor(d / 9) + water + (moving.length > 1)), m.map(r => r.join(''))];
  }
}
let mg = null;
// à plusieurs sur le même PC : chacun sa balle (blanche, rouge, bleue, jaune), on joue à tour de rôle ; 10 coups au plus par trou
const MG_PCOL = ['#ffffff', '#ff6a6a', '#6aa8ff', '#ffd84a'], MG_PF = ['bx', 'by', 'vx', 'vy', 'lastX', 'lastY', 'strokes'], MG_CAP = 10;
const mgSave = () => MG_PF.forEach(k => mg.pl[mg.cur][k] = mg[k]);
const mgLoad = i => { mg.cur = i; MG_PF.forEach(k => mg[k] = mg.pl[i][k]); mg.turnAt = mg.tick; };
const mgSum = p => p.cards.reduce((a, b) => a + (b || 0), 0);
function mgTurnEnd() {
  mgSave(); const p = mg.pl[mg.cur]; if (!p.done && p.strokes >= MG_CAP) { p.done = true; p.cards[mg.hole] = MG_CAP; }
  if (mg.pl.every(q => q.done)) { mg.mode = 'sunk'; mg.sunkAt = mg.tick; if (mg.hole === 8) { mgs.rounds++; saveGames(); } mgInfo(); return; }
  let i = mg.cur; do i = (i + 1) % mg.n; while (mg.pl[i].done); mgLoad(i);
}
const mgTile = (x, y) => mg.map[Math.floor((y - MG.TOP) / MG.T)]?.[Math.floor(x / MG.T)] ?? ' ';
const mgOpen = c => c !== ' ';
// le moulin : quatre ailes qui tournent ; la porte est fermée quand une aile passe devant (un peu moins de la moitié du temps)
const mgMillA = () => mg.tick * .025;
const mgMillShut = () => [0, 1, 2, 3].some(k => { const a = ((mgMillA() + k * Math.PI / 2) % (Math.PI * 2) + Math.PI * 2) % (Math.PI * 2); return Math.abs(a - Math.PI / 2) < .38; });
const mgBridgeUp = () => mg.tick % 300 < 110;  // le pont-levis : levé un peu plus d'un tiers du temps
const mgBlocks = (x, y) => { const c = mgTile(x, y); if (!mgOpen(c)) return true; if (c !== 'W' || !mgMillShut()) return false; return mgTile(mg.bx, mg.by) !== 'W'; };
function mgFind(map, ch) { for (let y = 0; y < map.length; y++) { const x = map[y].indexOf(ch); if (x >= 0) return [x * MG.T + 8, MG.TOP + y * MG.T + 8]; } }
function mgHole(n) {
  const [par, map] = mg.holes[n], [tx, ty] = mgFind(map, 'T'), [cx, cy] = mgFind(map, 'O');
  Object.assign(mg, {hole: n, par, map, bx: tx, by: ty, vx: 0, vy: 0, lastX: tx, lastY: ty, cupX: cx, cupY: cy, strokes: 0, aim: null, sunkAt: 0, mode: 'play', splash: 0, bg: null, moveT: 0,
    wells: map.flatMap((r, y) => [...r].map((c, x) => c === 'X' ? [x * MG.T + 8, MG.TOP + y * MG.T + 8] : null)).filter(Boolean)});
  if (mg.n > 1) { mg.pl = mg.pl.map(p => ({...p, bx: tx, by: ty, vx: 0, vy: 0, lastX: tx, lastY: ty, strokes: 0, done: false})); mg.cur = 0; mg.turnAt = mg.tick; mg.sunkMsg = null; }
}
function mgCourse(c) {  // les 9 trous d'un parcours : faits main (classique), tirés une fois pour toutes (thèmes, même graine), ou nouveaux (au hasard)
  const T = MG_THEMES[c] || MG_THEMES.classique;
  if (c === 'hasard') return Array.from({length: 9}, () => mgRandomHole(Math.random, T.kinds));
  if (!T.seed) return MG_HOLES;
  const R = seeded(T.seed); return T.holes ??= Array.from({length: 9}, () => mgRandomHole(R, T.kinds));
}
function mgNew() { const course = MG_THEMES[mgs.course] ? mgs.course : 'classique', n = mgs.players || 1; mg = Object.assign(mg || {tick: 0, raf: 0}, {cards: [], course, th: MG_THEMES[course], holes: mgCourse(course), n, pl: Array.from({length: n}, () => ({cards: []}))}); mgHole(0); mgInfo(); }
function mgPenalty(text) { mg.splash = mg.tick; mg.splashText = text; mg.bx = mg.lastX; mg.by = mg.lastY; mg.vx = mg.vy = 0; mg.strokes++; beep(200, .3, 'sine', 80, .1); }
function mgUpdate() { mgPhys(); if (mg.moving && !mg.vx && !mg.vy && mg.mode === 'play') { mg.moving = false; if (mg.n > 1) mgTurnEnd(); } }  // le coup est fini quand la balle s'arrête
function mgPhys() {
  const t0 = mgTile(mg.bx, mg.by), push = MG_CONV[t0];
  if (t0 === 'B' && mgBridgeUp()) return mgPenalty(mg.th.wet);  // le pont s'est levé sous la balle
  if (push) { mg.vx += push[0] * .045; mg.vy += push[1] * .045; }  // le tapis roulant pousse, même une balle arrêtée
  for (const [wx, wy] of mg.wells) { const d = Math.hypot(wx - mg.bx, wy - mg.by); if (d < 3) return mgPenalty('AVALÉE ! +1'); if (d < 22) { mg.vx += (wx - mg.bx) / d * .09 * (1 - d / 22); mg.vy += (wy - mg.by) / d * .09 * (1 - d / 22); } }
  const sp = Math.hypot(mg.vx, mg.vy); if (!sp) return;
  if (++mg.moveT > 900) { mg.vx = mg.vy = 0; return; }  // shortcut: une balle qui tourne sans fin (tapis contre un mur) s'arrête au bout de 15 s
  for (let s = 0; s < 4; s++) {  // petits pas : la balle ne traverse jamais une bordure
    const nx = mg.bx + mg.vx / 4; if ([-MG.R, MG.R].some(d => mgBlocks(nx + d, mg.by - MG.R) || mgBlocks(nx + d, mg.by + MG.R))) { mg.vx = -mg.vx * .78; beep(300, .02, 'square', 0, .04); } else mg.bx = nx;
    const ny = mg.by + mg.vy / 4; if ([-MG.R, MG.R].some(d => mgBlocks(mg.bx - MG.R, ny + d) || mgBlocks(mg.bx + MG.R, ny + d))) { mg.vy = -mg.vy * .78; beep(300, .02, 'square', 0, .04); } else mg.by = ny;
  }
  const t = mgTile(mg.bx, mg.by), f = t === ':' ? .9 : t === '*' ? .996 : .982; mg.vx *= f; mg.vy *= f;
  const dc = Math.hypot(mg.bx - mg.cupX, mg.by - mg.cupY);
  if (dc < 6 && sp < 3.2) { mg.vx += (mg.cupX - mg.bx) * .08; mg.vy += (mg.cupY - mg.by) * .08; }  // le bord du trou attire un peu
  if (dc < 2.5 && sp < 3.2) { mg.vx = mg.vy = 0; mg.bx = mg.cupX; mg.by = mg.cupY; mgSunk(); return; }
  if (MG_WET(t)) return mgPenalty(mg.th.wet);
  if (Math.hypot(mg.vx, mg.vy) < (MG_CONV[t] ? .01 : .05)) { mg.vx = mg.vy = 0; }
}
function mgSunk() {
  if (mg.n > 1) { const p = mg.pl[mg.cur]; p.done = true; p.cards[mg.hole] = mg.strokes; if (mg.strokes === 1) mgs.aces++; mg.sunkMsg = {t: mg.tick, who: mg.cur, n: mg.strokes}; mg.moving = false; mgTurnEnd(); return; }
  mg.mode = 'sunk'; mg.sunkAt = mg.tick; mg.cards[mg.hole] = mg.strokes; if (mg.strokes === 1) mgs.aces++;
  [659, 784, 988].forEach((f, i) => setTimeout(() => beep(f, .12, 'triangle'), i * 90 + 100));
  if (mg.hole === 8) { const tot = mg.cards.reduce((a, b) => a + b, 0); mgs.rounds++; if (mg.course === 'classique') { if (!mgs.bestRound || tot < mgs.bestRound) mgs.bestRound = tot; } else if (!mgs.best[mg.course] || tot < mgs.best[mg.course]) mgs.best[mg.course] = tot; saveGames(); }
  saveGames(); mgInfo();
}
function mgBg() {  // le parcours, dessiné une fois par trou : gazon tondu en bandes, bordures de bois, sable, eau, haies
  return cnv(W, H, b => {
    const th = mg.th, [bg0, bg1, bg2, bg3] = th.bg, [wd0, wd1, wd2] = th.wood, [wa0, wa1, wa2] = th.water;
    px(b, bg0, 0, 0, W, H);
    const [d1, d2] = th.dots; for (let y = MG.TOP; y < H; y++) for (let x = 0; x < W; x++) { let h = Math.imul(x, 374761393) + Math.imul(y, 668265263) | 0; h = Math.imul(h ^ h >>> 13, 1274126177); h = ((h ^ h >>> 16) >>> 0) / 4294967296; px(b, h < d1 ? bg2 : h < d2 ? bg3 : (x + y) % 3 ? bg0 : bg1, x, y); }
    if (mg.course === 'pirate') for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) if (!mgOpen(mg.map[r][c]) && (c * 7 + r * 5) % 9 === 0) {  // des palmiers sur l'île
      const X = c * MG.T + 8, Y = MG.TOP + r * MG.T + 8; px(b, '#c8a860', X - 6, Y + 4, 12, 3); px(b, '#6a4a28', X, Y - 4, 2, 9); for (const [dx, dy] of [[-6, -6], [2, -7], [-4, -3], [4, -4]]) px(b, '#2a8a3a', X + dx, Y + dy, 5, 2); }
    if (mg.course === 'glace') for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) if (!mgOpen(mg.map[r][c]) && (c * 5 + r * 3) % 7 === 0) {  // des sapins sous la neige
      const X = c * MG.T + 8, Y = MG.TOP + r * MG.T + 8; for (let k = 0; k < 4; k++) px(b, k % 2 ? '#2a6a4a' : '#e8f4ff', X - 1 - k, Y - 6 + k * 2, 3 + k * 2, 2); px(b, '#5a3a20', X, Y + 2, 1, 3); }
    for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) {
      const ch = mg.map[r][c], X = c * MG.T, Y = MG.TOP + r * MG.T; if (!mgOpen(ch)) continue;
      if (ch === '~' || ch === 'B' || ch === 'o') { const wet = ch === 'o' ? ['#05010b', '#0a0618', '#ffffff'] : [wa0, wa1, wa2]; for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) px(b, (x + y * 2 + c * 3) % (ch === 'o' ? 23 : 9) === 0 ? wet[2] : y < 2 && !MG_WET(mg.map[r - 1]?.[c]) && mg.map[r - 1]?.[c] !== 'B' ? wet[1] : wet[0], X + x, Y + y); continue; }
      for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) px(b, ch === ':' ? ((x * 3 + y * 5) % 7 < 2 ? '#c8a860' : '#e0c47a') : ch === '*' ? ((x - y + 32) % 11 === 0 ? '#ffffff' : (x + y) % 2 ? '#9ad0f0' : '#a8daf6') : ((Math.floor((X + x) / 8) + Math.floor((Y + y) / 8)) % 2 ? th.fair[0] : th.fair[1]), X + x, Y + y);
      if (MG_CONV[ch]) { px(b, '#2a2a34', X, Y, 16, 16); px(b, '#3a3a48', X + 1, Y + 1, 14, 14); }
      if (ch === 'X') for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) { const d = Math.hypot(x - 7.5, y - 7.5); if (d < 7.5) px(b, d < 3 ? '#05010b' : d < 5 ? '#2a0a4a' : '#4a1a7a', X + x, Y + y); }
      if (ch === 'W') { px(b, '#05010b', X + 3, Y + 4, 10, 12); px(b, '#e8d8c0', X + 4, Y + 5, 8, 11); px(b, '#c02a2a', X + 3, Y + 1, 10, 4); px(b, '#3a2a1a', X + 6, Y + 10, 4, 6); }  // la maison du moulin, sa porte au milieu
    }
    for (let r = 0; r < 11; r++) for (let c = 0; c < 16; c++) {  // les bordures en bois, côté décor de chaque case ouverte
      const X = c * MG.T, Y = MG.TOP + r * MG.T; if (!mgOpen(mg.map[r][c])) continue; const shut = (dr, dc) => !mgOpen(mg.map[r + dr]?.[c + dc] ?? ' ');
      if (shut(-1, 0)) { px(b, '#05010b', X - 1, Y - 3, 18, 3); px(b, wd0, X - 1, Y - 3, 18, 2); }
      if (shut(1, 0)) { px(b, '#05010b', X - 1, Y + 16, 18, 3); px(b, wd1, X - 1, Y + 16, 18, 2); }
      if (shut(0, -1)) { px(b, '#05010b', X - 3, Y - 1, 3, 18); px(b, wd2, X - 3, Y - 1, 2, 18); }
      if (shut(0, 1)) { px(b, '#05010b', X + 16, Y - 1, 3, 18); px(b, wd2, X + 17, Y - 1, 2, 18); }
    }
    const [tx, ty] = mgFind(mg.map, 'T'); px(b, '#3a8a3a', tx - 5, ty - 5, 10, 10); px(b, '#e8e0d0', tx - 6, ty - 6, 2, 2); px(b, '#e8e0d0', tx + 4, ty + 4, 2, 2);
    px(b, '#05010b', 0, 0, W, MG.TOP);
  });
}
function mgDraw() {
  if (!mg.bg) mg.bg = mgBg(); g.drawImage(mg.bg, 0, 0);
  // ce qui bouge : tapis, pont-levis, trous noirs, ailes du moulin
  const up = mgBridgeUp(), shutNow = mgMillShut();
  mg.map.forEach((r, ry) => [...r].forEach((ch, rx) => {
    const X = rx * MG.T, Y = MG.TOP + ry * MG.T, cv2 = MG_CONV[ch];
    if (cv2) { const o = (mg.tick >> 2) % 6; for (let k = -1; k < 3; k++) { const s = k * 6 + o; for (let j = -2; j <= 2; j++) { const a = s - Math.abs(j); if (a < 1 || a > 14) continue; const [x, y] = cv2[0] ? [cv2[0] > 0 ? a : 15 - a, 7 + j] : [7 + j, cv2[1] > 0 ? a : 15 - a]; px(g, '#ffd84a', X + x, Y + y, 1, 1); } } }
    if (ch === 'B') { if (!up) { px(g, '#05010b', X - 1, Y, 18, 16); for (let k = 0; k < 4; k++) px(g, k % 2 ? '#8a5a28' : '#a06a30', X, Y + k * 4, 16, 4); px(g, '#5a3a18', X, Y + 15, 16, 1); }
      else { px(g, '#05010b', X + 2, Y - 10, 12, 12); px(g, '#a06a30', X + 3, Y - 9, 10, 10); px(g, '#8a8aa8', X + 1, Y - 12, 1, 12); px(g, '#8a8aa8', X + 14, Y - 12, 1, 12); } }
    if (ch === 'X') { const a = mg.tick / 10; for (let k = 0; k < 3; k++) px(g, '#c86aff', X + 7.5 + Math.cos(a + k * 2.1) * 5, Y + 7.5 + Math.sin(a + k * 2.1) * 5, 1, 1); }
    if (ch === 'W') { const a0 = mgMillA(); for (let k = 0; k < 4; k++) { const a = a0 + k * Math.PI / 2; for (let i = 2; i < 11; i++) { px(g, '#05010b', X + 8 + Math.cos(a) * i - 1, Y + 6 + Math.sin(a) * i - 1, 3, 3); } for (let i = 2; i < 11; i++) px(g, i > 4 ? '#f0e8d8' : '#8a5a28', X + 8 + Math.cos(a) * i, Y + 6 + Math.sin(a) * i, 1, 1); } px(g, '#ffd84a', X + 7, Y + 5, 2, 2);
      if (shutNow) px(g, '#ff4a5a', X + 6, Y + 15, 4, 1); }
  }));
  // le trou et son drapeau
  px(g, '#05010b', mg.cupX - 3, mg.cupY - 2, 6, 5); px(g, '#05010b', mg.cupX - 2, mg.cupY - 3, 4, 7); px(g, '#2a2a2a', mg.cupX - 2, mg.cupY, 4, 2);
  const wave = Math.floor(mg.tick / 12) % 2, fl = mg.th.flag; px(g, '#e8e0d0', mg.cupX, mg.cupY - 16, 1, 14); px(g, fl, mg.cupX + 1, mg.cupY - 16, 6 + wave, 2); px(g, fl, mg.cupX + 1, mg.cupY - 14, 4 + wave, 2); px(g, '#05010b', mg.cupX + 1, mg.cupY - 12, 2, 1);
  if (mg.th.skull) { px(g, '#ffffff', mg.cupX + 3, mg.cupY - 15, 2, 2); px(g, '#ffffff', mg.cupX + 3, mg.cupY - 13, 1, 1); }  // le drapeau pirate
  if (mg.splash && mg.tick - mg.splash < 40) pxFont(g, mg.splashText || 'PLOUF ! +1', Math.max(60, Math.min(W - 60, mg.bx)), Math.max(26, mg.by - 8), '#a8d0ff', 6, 'center');
  // la visée : pointillés dans le sens du tir, longueur = force
  if (mg.aim && mg.mode === 'play') {
    const [ax, ay] = mg.aim, p = Math.min(MG.MAXP, Math.hypot(ax, ay) / 9), a = Math.atan2(ay, ax), col = p > MG.MAXP * .75 ? '#ff4a5a' : p > MG.MAXP * .4 ? '#ffd84a' : '#ffffff';
    for (let i = 1; i <= Math.round(p * 5); i++) if (i % 2) px(g, col, mg.bx + Math.cos(a) * i * 3 - 1, mg.by + Math.sin(a) * i * 3 - 1, 2, 2);
    px(g, '#05010b', 6, H - 10, 52, 6); px(g, col, 7, H - 9, Math.round(50 * p / MG.MAXP), 4);
  }
  if (mg.n > 1) mg.pl.forEach((p, i) => { if (i === mg.cur || p.done) return; px(g, '#05010b', p.bx - 2, p.by - 1, 5, 4); px(g, '#05010b', p.bx - 1, p.by - 2, 3, 6); px(g, MG_PCOL[i], p.bx - 1, p.by - 1, 3, 3); });  // les balles qui attendent leur tour
  if (mg.mode !== 'sunk' || mg.tick - mg.sunkAt < 6) { px(g, '#05010b', mg.bx - 2, mg.by - 1, 5, 4); px(g, '#05010b', mg.bx - 1, mg.by - 2, 3, 6); px(g, MG_PCOL[mg.n > 1 ? mg.cur : 0], mg.bx - 1, mg.by - 1, 3, 3); px(g, '#c8c8d8', mg.bx + 1, mg.by + 1, 1, 1); }
  pxFont(g, 'TROU ' + (mg.hole + 1) + '/9', 6, 11, '#ffffff', 6); pxFont(g, ({classique: '', pirate: 'PIRATES · ', glace: 'BANQUISE · ', espace: 'ESPACE · ', hasard: 'HASARD · '})[mg.course] + 'PAR ' + mg.par, W / 2, 11, '#a8d8a0', 6, 'center'); pxFont(g, (mg.n > 1 ? 'J' + (mg.cur + 1) + ' · ' : '') + 'COUPS ' + mg.strokes, W - 6, 11, mg.n > 1 ? MG_PCOL[mg.cur] : '#ffd84a', 6, 'right');
  if (mg.n > 1 && mg.mode === 'play') { if (mg.sunkMsg && mg.tick - mg.sunkMsg.t < 70) pxFont(g, 'J' + (mg.sunkMsg.who + 1) + ' : DANS LE TROU EN ' + mg.sunkMsg.n, W / 2, 28, MG_PCOL[mg.sunkMsg.who], 8, 'center');
    else if (mg.tick - mg.turnAt < 60) pxFont(g, 'AU TOUR DE J' + (mg.cur + 1), W / 2, 28, MG_PCOL[mg.cur], 8, 'center'); }
  if (mg.n > 1 && mg.mode === 'sunk' && mg.tick - mg.sunkAt > 20) {  // le tableau des scores, à la fin de chaque trou
    const tot = mg.pl.map(mgSum), low = Math.min(...tot), win = tot.filter(t => t === low).length > 1 ? 'ÉGALITÉ !' : 'J' + (tot.indexOf(low) + 1) + ' GAGNE !';
    gameText(g, W, [[mg.hole < 8 ? 'TROU ' + (mg.hole + 1) + ' FINI' : win, '#ffd84a', 12], ...mg.pl.map((p, i) => ['J' + (i + 1) + ' : ' + p.cards[mg.hole] + ' · total ' + tot[i], MG_PCOL[i]]), [mg.hole < 8 ? 'Clic : trou suivant' : 'Clic : nouveau parcours', '#b8b0c8']], 56);
    return;
  }
  if (mg.mode === 'sunk' && mg.tick - mg.sunkAt > 20) {
    const d = mg.strokes - mg.par, word = mg.strokes === 1 ? 'TROU EN UN !' : ['', 'ALBATROS', 'EAGLE', 'BIRDIE', 'PAR', 'BOGEY', 'DOUBLE BOGEY'][4 + Math.max(-3, Math.min(2, d))] || '+' + d;
    if (mg.hole < 8) gameText(g, W, [[word, d < 0 ? '#5fdf6a' : d === 0 ? '#ffffff' : '#ffa030', 12], [mg.strokes + ' coup' + (mg.strokes > 1 ? 's' : ''), '#ffffff'], ['Clic : trou suivant', '#ffd84a']], 70);
    else { const tot = mg.cards.reduce((a, b) => a + b, 0), par = mg.holes.reduce((a, h) => a + h[0], 0); gameText(g, W, [['PARCOURS FINI', '#ffd84a', 12], [tot + ' coups (par ' + par + ')', '#ffffff'], [tot <= par ? 'Sous le par, bravo !' : (tot - par) + ' au-dessus du par', '#a8d8a0'], ['Clic : nouveau parcours', '#ffd84a']], 62); }
  }
}
cv.onpointerdown = e => {
  e.preventDefault(); if (!mg) return;
  if (mg.mode === 'sunk') { if (mg.tick - mg.sunkAt > 20) { if (mg.hole < 8) mgHole(mg.hole + 1); else mgNew(); mgInfo(); } return; }
  if (mg.vx || mg.vy) return; const [x, y] = cpos(e); mg.start = [x, y]; mg.aim = [0, 0]; try { cv.setPointerCapture(e.pointerId); } catch {}
};
cv.onpointermove = e => { if (!mg?.aim) return; const [x, y] = cpos(e); mg.aim = [mg.start[0] - x, mg.start[1] - y]; };
cv.onpointerup = () => {
  if (!mg?.aim) return; const [ax, ay] = mg.aim, p = Math.min(MG.MAXP, Math.hypot(ax, ay) / 9); mg.aim = null;
  if (p < .3) return; const a = Math.atan2(ay, ax); mg.lastX = mg.bx; mg.lastY = mg.by; mg.vx = Math.cos(a) * p; mg.vy = Math.sin(a) * p; mg.moveT = 0; mg.strokes++; mg.moving = true; beep(500, .04, 'triangle', 300, .08);
};
document.addEventListener('keydown', e => { if (!keyOk(e) || !mg) return; if ((e.key === ' ' || e.key === 'Enter') && mg.mode === 'sunk' && mg.tick - mg.sunkAt > 20) { e.preventDefault(); if (mg.hole < 8) mgHole(mg.hole + 1); else mgNew(); mgInfo(); } });
function mgInfo() { const bst = !mg || mg.course === 'classique' ? mgs.bestRound : mgs.best[mg.course]; showStats([['Meilleur parcours', bst ? bst + ' coups' : '—'], ['Parcours finis', mgs.rounds], ['Trous en un', mgs.aces], ['Ce parcours', mg ? mg.cards.reduce((a, b) => a + b, 0) + ' coups' : '—']]); }
$('gNew').onclick = () => { mgNew(); $('gNew').blur(); };
$('mgPlayers').value = String(mgs.players || 1); $('mgPlayers').onchange = () => { mgs.players = +$('mgPlayers').value; saveGames(); mgNew(); $('mgPlayers').blur(); };
$('mgCourse').value = MG_THEMES[mgs.course] ? mgs.course : 'classique'; $('mgCourse').onchange = () => { mgs.course = $('mgCourse').value; saveGames(); mgNew(); };
$('gFs').onclick = () => { $('gFs').blur(); try { if (document.fullscreenElement) document.exitFullscreen(); else cv.parentElement.requestFullscreen?.().catch(() => {}); } catch {} };
function mgCheck() {  // vérification : les obstacles qui bougent font ce qu'ils disent, chaque parcours à thème a les siens
  const bad = [], keep = mg, step = n => { for (let i = 0; i < n; i++) { mgUpdate(); mg.tick++; } };
  const lab = rows => { mg = {tick: 0, th: MG_THEMES.hasard, course: 'hasard', holes: [[3, rows.map(r => r.padEnd(16, ' '))]], cards: []}; mgHole(0); };
  lab(['', '  ..........  ', '  .T..W...O.  ', '  ..........  ']);  // le moulin : fermé, la balle rebondit ; ouvert, elle passe
  mg.tick = [...Array(400).keys()].find(t => { mg.tick = t; return mgMillShut(); }); mg.bx = 6 * 16 - 4; mg.by = MG.TOP + 2 * 16 + 8; mg.vx = 2; mg.vy = 0; const t0 = mg.tick; for (let i = 0; i < 4; i++) { mgUpdate(); mg.tick = t0; } if (mg.vx >= 0) bad.push('moulin fermé');
  mg.tick = [...Array(400).keys()].find(t => { mg.tick = t; return !mgMillShut(); }); mg.bx = 6 * 16 - 4; mg.vx = 2; const t1 = mg.tick; for (let i = 0; i < 6; i++) { mgUpdate(); mg.tick = t1; } if (mg.vx <= 0) bad.push('moulin ouvert');
  lab(['', '  ..........  ', '  .T..>>..O.  ', '  ..........  ']); mg.bx = 6 * 16 + 4; mg.by = MG.TOP + 2 * 16 + 8; step(30); if (!(mg.bx > 6 * 16 + 10)) bad.push('tapis');
  lab(['', '  ..........  ', '  .T..B...O.  ', '  ..........  ']); mg.tick = 0; mg.bx = 6 * 16 + 8; mg.by = MG.TOP + 2 * 16 + 8; mgUpdate(); if (mg.strokes !== 1) bad.push('pont levé');
  lab(['', '  ..........  ', '  .T..X...O.  ', '  ..........  ']); mg.bx = 6 * 16 + 8 + 12; mg.by = MG.TOP + 2 * 16 + 8; step(200); if (mg.strokes !== 1) bad.push('trou noir');
  lab(['', '  ..........  ', '  .T..*...O.  ', '  ..........  ']); mg.bx = 6 * 16 + 1; mg.by = MG.TOP + 2 * 16 + 8; mg.vx = 1; mgUpdate(); mgUpdate(); const vIce = mg.vx; mg.bx = 3 * 16 + 1; mg.vx = 1; mgUpdate(); mgUpdate(); if (!(vIce > mg.vx)) bad.push('glace');
  for (const [c, need] of [['pirate', /[WB]/], ['glace', /\*/], ['espace', /X/]]) { const holes = mgCourse(c), all = holes.map(h => h[1].join('')).join(''); if (holes.length !== 9 || !need.test(all)) bad.push('parcours ' + c); if (holes !== mgCourse(c)) bad.push('parcours ' + c + ' qui change'); }
  for (let i = 0; i < 20; i++) { const [par, m] = mgRandomHole(Math.random, MG_THEMES[['hasard', 'pirate', 'glace', 'espace'][i % 4]].kinds), at = ch => { const y = m.findIndex(r => r.includes(ch)); return [m[y].indexOf(ch), y]; }; if (mgPath(m, at('T'), at('O')) < 0 || par < 2 || par > 5) bad.push('trou tiré'); }
  mg = {tick: 0, th: MG_THEMES.hasard, course: 'hasard', holes: [[3, ['', '  ..........  ', '  .T.......O.  ', '  ..........  '].map(r => r.padEnd(16, ' '))]], cards: [], n: 2, pl: [{cards: []}, {cards: []}]}; mgHole(0);
  mg.vx = 1; mg.moving = true; mg.strokes = 1; step(300); if (mg.cur !== 1 || mg.pl[0].strokes !== 1 || mg.strokes !== 0) bad.push('tour suivant');
  mg.bx = mg.cupX - 6; mg.by = mg.cupY; mg.vx = 1; mg.moving = true; mg.strokes = 1; step(200); if (!mg.pl[1].done || mg.cur !== 0 || mg.mode !== 'play') bad.push('trou du second');
  mg.bx = mg.cupX - 6; mg.by = mg.cupY; mg.vx = 1; mg.moving = true; mg.strokes = 2; step(200); if (mg.mode !== 'sunk' || mg.pl[0].cards[0] !== 2 || mg.pl[1].cards[0] !== 1) bad.push('fin du trou à deux');
  mg = keep;
  return bad.length ? [...new Set(bad)].join(', ') : 'ok';
}
console.assert(mgCheck() === 'ok', 'minigolf', mgCheck());
cv.__mg = {st: () => mg, check: mgCheck, course: c => { $('mgCourse').value = c; $('mgCourse').dispatchEvent(new Event('change')); }, shut: () => mgMillShut(), up: () => mgBridgeUp()};
{  // vérification : chaque trou (faits main et 30 au hasard) a 16 × 11 cases, un départ et un trou, reliés sans passer par l'eau
  const at = (m, ch) => { const y = m.findIndex(r => r.includes(ch)); return y < 0 ? null : [m[y].indexOf(ch), y]; };
  const ok = [...MG_HOLES, ...Array.from({length: 30}, mgRandomHole)].map(([par, m]) => m.length === 11 && m.every(r => r.length === 16) && m.join('').split('O').length === 2 && at(m, 'T') && par >= 2 && par <= 5 && mgPath(m, at(m, 'T'), at(m, 'O')) > 0);
  console.assert(ok.every(Boolean), 'minigolf', ok);
}
ctx.onOpen(() => { if (!mg) mgNew(); gameLoop(mg, 'minigolf', mgUpdate, mgDraw); mgInfo(); });

}
