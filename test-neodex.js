// lancé par le test « local » de NeoDex : la vérification interne (moulin, tapis, pont-levis, trou noir, glace), un coup joué à la souris,
// les trois parcours à thème et le hasard, le plein écran et la place prise (avec NEO_SHOTS : garde des images du jeu)
module.exports = async ({ pj, sleep }) => {
  const C = code => pj(`(() => { const T = document.getElementById('gc').__mg, mg = T.st(); ${code} })()`);
  const shot = async n => { if (!process.env.NEO_SHOTS) return; const d = await pj(`document.getElementById('gc').toDataURL()`); require('fs').writeFileSync(require('path').join(process.env.NEO_SHOTS, 'minigolf-' + n + '.png'), Buffer.from(d.split(',')[1], 'base64')); };
  await pj(`window.__e = []; addEventListener('error', e => __e.push(e.message)); 0`);
  const chk = await C('return T.check();'); if (chk !== 'ok') throw new Error('vérification : ' + chk);
  const keep = await C('return mg.course;');
  await C(`T.course('classique'); return 0;`); await sleep(300);
  // un coup à la souris : on tire en arrière vers la gauche, la balle part vers la droite
  const r = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(), mg = c.__mg.st(), k = r.width / 256, x = r.left + mg.bx * k, y = r.top + mg.by * k;
    const ev = (t, dx) => c.dispatchEvent(new PointerEvent(t, {clientX: x + dx * k, clientY: y, pointerId: 1, bubbles: true}));
    ev('pointerdown', 0); ev('pointermove', -30); ev('pointerup', -30); return mg.vx + '|' + mg.strokes; })()`);
  const [vx, st] = r.split('|').map(Number); if (!(vx > 1) || st !== 1) throw new Error('le coup devait partir vers la droite : ' + r);
  await sleep(1500); await shot('0-classique');
  // les parcours à thème : chacun a ses obstacles, toujours les mêmes trous
  const marks = {pirate: /[WB]/, glace: /\*/, espace: /X/, hasard: /./};
  for (const c of ['pirate', 'glace', 'espace', 'hasard']) {
    await C(`T.course('${c}'); return 0;`); await sleep(150);
    const n = await C(`const re = ${marks[c]}; return mg.course + '|' + (mg.holes.findIndex(h => re.test(h[1].join(''))));`); const [name, idx] = n.split('|');
    if (name !== c || +idx < 0) throw new Error('le parcours ' + c + ' devait avoir ses obstacles : ' + n);
    if (+idx > 0) {  // aller au trou qui a l'obstacle, comme après avoir fini le trou d'avant
      await C(`mg.mode = 'sunk'; mg.sunkAt = -99; mg.hole = ${+idx} - 1; return 0;`);
      await pj(`document.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true})), 0`);
    }
    await sleep(700); await shot('1-' + c);
  }
  await C(`T.course('${keep}'); return 0;`);
  const errs = await pj(`window.__e.join(' | ')`); if (errs) throw new Error('erreur : ' + errs);
  // plein écran, et la zone de jeu qui tient dans la fenêtre
  await pj(`document.getElementById('gFs').click(), 0`); await sleep(700);
  const fs = await pj(`(() => { const c = document.getElementById('gc'), r = c.getBoundingClientRect(); return document.fullscreenElement === c.parentElement && (Math.abs(r.height - innerHeight) < 3 || Math.abs(r.width - innerWidth) < 3); })()`);
  await pj(`document.fullscreenElement && document.exitFullscreen(), 0`); await sleep(300);
  if (!fs) throw new Error('le plein écran ne remplit pas l\'écran');
  const L = await pj(`(() => { const r = document.getElementById('gc').getBoundingClientRect(); let s = 0; for (let e = document.getElementById('gc').parentElement; e; e = e.parentElement) s += e.scrollTop; return { bottom: Math.round(r.bottom + s), h: Math.round(r.height), wh: innerHeight, ww: innerWidth, sw: document.documentElement.scrollWidth }; })()`);
  if (process.env.NEO_FIT_LOG) console.log('FIT', JSON.stringify(L));
  if (L.bottom > L.wh + 1 || L.sw > L.ww + 1 || L.h < 280) throw new Error('la zone de jeu dépasse la fenêtre ou reste petite : ' + JSON.stringify(L));
  return 'vérification ok · coup à la souris · parcours pirate, banquise, espace et hasard · plein écran · ' + L.h + ' px dans ' + L.ww + '×' + L.wh;
};
