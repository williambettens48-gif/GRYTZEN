import * as THREE from 'three';

/* GRYTZEN — Prototype du village d'AURENTH
   Scène procédurale de démonstration : bâtiments et habitants sont des volumes 3D temporaires.
   Le code est séparé par systèmes pour permettre le remplacement progressif par des modèles GLB. */

const canvas = document.querySelector('#world');
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x10171b);
scene.fog = new THREE.FogExp2(0x10171b, 0.021);
const camera = new THREE.PerspectiveCamera(58, innerWidth / innerHeight, 0.1, 220);
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

// Lumière nocturne, fenêtres chaudes et brume basse.
scene.add(new THREE.HemisphereLight(0x8795a0, 0x17100b, 1.05));
const moon = new THREE.DirectionalLight(0xa9b6c3, 1.25);
moon.position.set(-18, 28, 12); moon.castShadow = true;
moon.shadow.mapSize.set(1024, 1024);
moon.shadow.camera.left = -42; moon.shadow.camera.right = 42;
moon.shadow.camera.top = 42; moon.shadow.camera.bottom = -42;
scene.add(moon);

const mats = {
  ground: new THREE.MeshStandardMaterial({ color: 0x252a27, roughness: 1 }),
  stone: new THREE.MeshStandardMaterial({ color: 0x555047, roughness: 1 }),
  stoneDark: new THREE.MeshStandardMaterial({ color: 0x302f2b, roughness: 1 }),
  wood: new THREE.MeshStandardMaterial({ color: 0x493326, roughness: 1 }),
  woodLight: new THREE.MeshStandardMaterial({ color: 0x725039, roughness: 1 }),
  roof: new THREE.MeshStandardMaterial({ color: 0x292b2a, roughness: 1 }),
  glass: new THREE.MeshStandardMaterial({ color: 0xffb45e, emissive: 0xff8a32, emissiveIntensity: 1.8 }),
  bark: new THREE.MeshStandardMaterial({ color: 0x29231e, roughness: 1 }),
  flame: new THREE.MeshBasicMaterial({ color: 0xffa34e })
};

function addMesh(parent, geometry, material, position, rotation = null, scale = null) {
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(...position);
  if (rotation) mesh.rotation.set(...rotation);
  if (scale) mesh.scale.set(...scale);
  mesh.castShadow = true; mesh.receiveShadow = true;
  parent.add(mesh); return mesh;
}
function box(parent, x, y, z, w, h, d, material, rz = 0) {
  return addMesh(parent, new THREE.BoxGeometry(w, h, d), material, [x, y, z], [0, 0, rz]);
}

// Sol et place pavée.
addMesh(scene, new THREE.PlaneGeometry(120, 120), mats.ground, [0, -0.09, 0], [-Math.PI / 2]);
for (let i = 0; i < 230; i++) {
  const x = (Math.random() - .5) * 55, z = (Math.random() - .5) * 55;
  const inSquare = Math.abs(x) < 10 && Math.abs(z) < 9;
  const w = inSquare ? .8 + Math.random() * .8 : .5 + Math.random() * 1.3;
  const stone = addMesh(scene, new THREE.BoxGeometry(w, .12, .55 + Math.random() * .8), Math.random() > .45 ? mats.stone : mats.stoneDark, [x, -.015, z]);
  stone.rotation.y = Math.random() * Math.PI;
}

// Place centrale et vieux puits.
const well = new THREE.Group(); well.position.set(0, 0, -1); scene.add(well);
addMesh(well, new THREE.CylinderGeometry(1.35, 1.5, .9, 12), mats.stone, [0, .45, 0]);
addMesh(well, new THREE.CylinderGeometry(1.05, 1.05, .08, 12), mats.stoneDark, [0, .93, 0]);
addMesh(well, new THREE.CylinderGeometry(.72, .72, .05, 12), new THREE.MeshStandardMaterial({ color: 0x182b32, metalness: .2, roughness: .2 }), [0, .99, 0]);
for (const x of [-1.1, 1.1]) box(well, x, 2.05, 0, .18, 2.25, .18, mats.wood);
box(well, 0, 3.2, 0, 2.55, .18, .22, mats.wood);

// Maisons médiévales : soubassement de pierre, colombages, toit et fenêtres lumineuses.
function createHouse(name, x, z, options = {}) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  const w = options.width || 6, h = options.height || 3.7, d = options.depth || 5;
  addMesh(g, new THREE.BoxGeometry(w, .8, d), mats.stoneDark, [0, .4, 0]);
  addMesh(g, new THREE.BoxGeometry(w - .25, h, d - .25), mats.woodLight, [0, .8 + h / 2, 0]);
  // Façade en colombages.
  for (const xx of [-w / 2 + .22, w / 2 - .22, 0]) box(g, xx, .8 + h / 2, d / 2 + .14, .18, h, .16, mats.wood);
  for (const yy of [1.15, 2.55, 3.75]) box(g, 0, yy, d / 2 + .15, w, .16, .16, mats.wood);
  // Toit à deux pans.
  const roofA = addMesh(g, new THREE.BoxGeometry(w + .8, .22, d * .72), mats.roof, [0, .8 + h + .95, -d * .18], [0, 0, -.48]);
  const roofB = addMesh(g, new THREE.BoxGeometry(w + .8, .22, d * .72), mats.roof, [0, .8 + h + .95, d * .18], [0, 0, .48]);
  // Pignons.
  addMesh(g, new THREE.ConeGeometry(w * .57, 1.8, 4), mats.wood, [0, .8 + h + .75, 0], [0, Math.PI / 4, 0], [1, 1, d / w]);
  // Porte et fenêtres.
  box(g, 0, 1.28, d / 2 + .25, 1.05, 2.2, .18, mats.wood);
  for (const xx of [-w * .29, w * .29]) {
    box(g, xx, 2.55, d / 2 + .24, .72, .95, .14, mats.wood);
    box(g, xx, 2.55, d / 2 + .33, .48, .68, .08, mats.glass);
    box(g, xx, 2.55, d / 2 + .39, .07, .82, .06, mats.wood);
    box(g, xx, 2.55, d / 2 + .39, .58, .07, .06, mats.wood);
  }
  // Enseigne suspendue.
  box(g, w / 2 + .25, 2.75, d / 2 + .25, .9, .75, .12, mats.wood);
  const signText = options.sign || name;
  const sign = document.createElement('canvas'); sign.width = 256; sign.height = 96;
  const ctx = sign.getContext('2d'); ctx.fillStyle = '#241a13'; ctx.fillRect(0, 0, 256, 96);
  ctx.strokeStyle = '#c4a36b'; ctx.lineWidth = 5; ctx.strokeRect(5, 5, 246, 86);
  ctx.fillStyle = '#f0d9a8'; ctx.font = 'bold 28px Georgia'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(signText.toUpperCase().slice(0, 14), 128, 49);
  const texture = new THREE.CanvasTexture(sign); texture.colorSpace = THREE.SRGBColorSpace;
  addMesh(g, new THREE.PlaneGeometry(1.1, .42), new THREE.MeshBasicMaterial({ map: texture }), [w / 2 + .25, 2.75, d / 2 + .33]);
  g.userData.placeName = name;
  return g;
}

createHouse('Auberge', -12, -10, { sign: 'Auberge', width: 7, depth: 6, height: 4 });
createHouse('Forge', 12, -10, { sign: 'Forge', width: 6, depth: 5, height: 3.6 });
createHouse('Archives', -12, 10, { sign: 'Archives', width: 7, depth: 6, height: 4.2 });
createHouse('Herboriste', 12, 10, { sign: 'Herboriste', width: 6, depth: 5, height: 3.5 });

// Palissade et porte vers la forêt.
for (let x = -23; x <= 23; x += 2.2) {
  if (Math.abs(x) < 3) continue;
  box(scene, x, 1.15, -22, .28, 2.3, .32, mats.wood);
}
box(scene, -2.5, 2.4, -22, .35, 4.8, .5, mats.stone);
box(scene, 2.5, 2.4, -22, .35, 4.8, .5, mats.stone);
box(scene, 0, 4.8, -22, 5.4, .5, .65, mats.stoneDark);
// Sentier forestier au-delà de la porte.
for (let i = 0; i < 28; i++) {
  const side = i % 2 ? 1 : -1, z = -25 - Math.random() * 25;
  const x = side * (7 + Math.random() * 7);
  const trunk = addMesh(scene, new THREE.CylinderGeometry(.16, .35, 4 + Math.random() * 3, 6), mats.bark, [x, 2, z]);
  trunk.rotation.z = (Math.random() - .5) * .18;
  for (let b = 0; b < 3; b++) {
    const branch = addMesh(scene, new THREE.CylinderGeometry(.05, .13, 2.2, 5), mats.bark, [x + (Math.random() - .5) * 1.2, 3.1 + Math.random() * 1.3, z]);
    branch.rotation.z = (Math.random() - .5) * 1.8;
  }
}

// Lanternes : halos chauds qui découpent les ruelles dans la brume.
const lanterns = [];
function addLantern(x, z) {
  const g = new THREE.Group(); g.position.set(x, 0, z); scene.add(g);
  box(g, 0, 1.4, 0, .16, 2.8, .16, mats.wood);
  box(g, 0, 2.85, 0, .65, .12, .65, mats.wood);
  const glow = addMesh(g, new THREE.SphereGeometry(.2, 10, 8), mats.flame, [0, 2.55, 0]);
  const light = new THREE.PointLight(0xff9a4c, 18, 10, 2); light.position.set(0, 2.55, 0); g.add(light);
  lanterns.push({ light, glow });
}
[[-5, -7], [5, -7], [-5, 7], [5, 7], [-17, 0], [17, 0], [0, -17], [0, 15]].forEach(([x, z]) => addLantern(x, z));

// Personnage joueur : avatar procédural personnalisable en attendant un modèle GLB animé.
const player = new THREE.Group(); scene.add(player); player.position.set(0, 0, 8);
const avatar = new THREE.Group(); player.add(avatar);
const avatarMaterials = {
  tunic: new THREE.MeshStandardMaterial({ color: 0x39424a, roughness: .95 }),
  cloak: new THREE.MeshStandardMaterial({ color: 0x171c20, roughness: 1 }),
  leather: new THREE.MeshStandardMaterial({ color: 0x49372b, roughness: .9 }),
  skin: new THREE.MeshStandardMaterial({ color: 0x98775e, roughness: .9 }),
  metal: new THREE.MeshStandardMaterial({ color: 0x77766d, metalness: .45, roughness: .55 }),
  hair: new THREE.MeshStandardMaterial({ color: 0x30231c, roughness: 1 })
};
function limb(parent, geometry, material, position) { return addMesh(parent, geometry, material, position); }
const torso = limb(avatar, new THREE.CapsuleGeometry(.42, .78, 5, 9), avatarMaterials.tunic, [0, 1.35, 0]); torso.scale.set(.9, 1, .62);
const cape = limb(avatar, new THREE.ConeGeometry(.62, 1.55, 8, 1, true), avatarMaterials.cloak, [0, 1.15, .3]); cape.rotation.x = Math.PI; cape.scale.set(1, .95, .48);
const head = limb(avatar, new THREE.SphereGeometry(.29, 14, 12), avatarMaterials.skin, [0, 2.12, 0]);
const hood = limb(avatar, new THREE.SphereGeometry(.35, 14, 12, 0, Math.PI * 2, 0, Math.PI * .64), avatarMaterials.cloak, [0, 2.2, .04]); hood.scale.set(1.08, 1.1, 1.05);
const hair = limb(avatar, new THREE.SphereGeometry(.31, 12, 10), avatarMaterials.hair, [0, 2.18, .02]); hair.visible = false;
const leftArm = new THREE.Group(); leftArm.position.set(-.4, 1.72, 0); avatar.add(leftArm); limb(leftArm, new THREE.CapsuleGeometry(.13, .58, 4, 7), avatarMaterials.leather, [0, -.35, 0]);
const rightArm = new THREE.Group(); rightArm.position.set(.4, 1.72, 0); avatar.add(rightArm); limb(rightArm, new THREE.CapsuleGeometry(.13, .58, 4, 7), avatarMaterials.leather, [0, -.35, 0]);
const leftLeg = new THREE.Group(); leftLeg.position.set(-.19, .72, 0); avatar.add(leftLeg); limb(leftLeg, new THREE.CapsuleGeometry(.16, .62, 4, 7), avatarMaterials.tunic, [0, -.3, 0]); limb(leftLeg, new THREE.BoxGeometry(.3, .15, .48), avatarMaterials.leather, [0, -.64, -.12]);
const rightLeg = new THREE.Group(); rightLeg.position.set(.19, .72, 0); avatar.add(rightLeg); limb(rightLeg, new THREE.CapsuleGeometry(.16, .62, 4, 7), avatarMaterials.tunic, [0, -.3, 0]); limb(rightLeg, new THREE.BoxGeometry(.3, .15, .48), avatarMaterials.leather, [0, -.64, -.12]);
limb(avatar, new THREE.BoxGeometry(.12, .95, .1), avatarMaterials.leather, [.2, 1.45, -.31]).rotation.z = -.3;
limb(avatar, new THREE.BoxGeometry(.38, .4, .24), avatarMaterials.leather, [-.46, 1.1, .04]);

const appearance = { cloak: '171c20', tunic: '39424a', hood: 'capuche' };
function applyAppearance() {
  avatarMaterials.cloak.color.set('#' + appearance.cloak);
  avatarMaterials.tunic.color.set('#' + appearance.tunic);
  hood.visible = appearance.hood === 'capuche';
  hair.visible = appearance.hood === 'cheveux';
}
function saveAppearance() { localStorage.setItem('gryzten-avatar-v1', JSON.stringify(appearance)); }
try { Object.assign(appearance, JSON.parse(localStorage.getItem('gryzten-avatar-v1') || '{}')); } catch (_) {}
applyAppearance();

// Habitants du village — silhouettes provisoires avec points d'interaction.
const npcMaterial = new THREE.MeshStandardMaterial({ color: 0x65503a, roughness: 1 });
const npcSkin = new THREE.MeshStandardMaterial({ color: 0xb38d6a, roughness: 1 });
const npcs = [];
function createNPC(name, role, x, z, color, message) {
  const group = new THREE.Group(); group.position.set(x, 0, z); scene.add(group);
  const clothes = new THREE.MeshStandardMaterial({ color, roughness: 1 });
  addMesh(group, new THREE.CapsuleGeometry(.35, .7, 4, 8), clothes, [0, 1.15, 0]);
  addMesh(group, new THREE.SphereGeometry(.25, 12, 10), npcSkin, [0, 1.9, 0]);
  addMesh(group, new THREE.ConeGeometry(.3, .48, 8), mats.wood, [0, 2.22, 0]);
  const marker = addMesh(group, new THREE.OctahedronGeometry(.13), new THREE.MeshStandardMaterial({ color: 0xd6b36e, emissive: 0x6e461b, emissiveIntensity: 1.4 }), [0, 2.65, 0]);
  npcs.push({ name, role, group, message, marker });
}
createNPC('Maître Odran', 'Gardien de l’auberge', -8.3, -7.2, 0x66513d, 'La nuit, les pierres d’AURENTH murmurent. On raconte qu’un fragment ancien dort près du vieux puits.');
createNPC('Brune la forgeronne', 'Forgeronne', 9.1, -7.2, 0x51434a, 'Les voyageurs arrivent avec des armes, mais repartent parfois avec des questions. La porte nord mène à la forêt interdite.');
createNPC('Sœur Elwen', 'Archiviste', -8.2, 7.4, 0x454b55, 'Les archives parlent d’une porte qui ne s’ouvre qu’à celui qui sait écouter la mémoire de la terre.');
createNPC('Ysilde', 'Herboriste', 9.2, 7.3, 0x46513e, 'Ne cueille jamais les fleurs bleues après le coucher du soleil. Elles poussent là où les anciens serments ont été brisés.');

// Reliquaire du premier fragment, conservé comme objectif du prototype.
const rune = new THREE.Group(); rune.position.set(0, 1.5, -1); scene.add(rune);
const shardMat = new THREE.MeshStandardMaterial({ color: 0x9bcbd0, emissive: 0x2a9ba6, emissiveIntensity: 2, metalness: .65, roughness: .2 });
const shard = addMesh(rune, new THREE.OctahedronGeometry(.43), shardMat, [0, 0, 0], null, [.7, 1.5, .7]);
const ring = addMesh(rune, new THREE.TorusGeometry(.85, .035, 8, 48), new THREE.MeshBasicMaterial({ color: 0xb7dce0, transparent: true, opacity: .65 }), [0, 0, 0], [Math.PI / 2, 0, 0]);
const runeLight = new THREE.PointLight(0x69c5d0, 17, 9, 2); runeLight.position.set(0, 2, -1); scene.add(runeLight);
const foundKey = 'gryzten-aurneth-fragment';
let found = localStorage.getItem(foundKey) === 'yes';

// Interface : dialogues, personnalisation et interaction contextuelle.
const dialog = document.querySelector('#dialog');
const dialogTitle = document.querySelector('#dialogTitle');
const dialogText = document.querySelector('#dialogText');
const customizePanel = document.querySelector('#customizePanel');
const questText = document.querySelector('.quest p');
let activeNPC = null;
function showDialog(title, text) { dialogTitle.textContent = title; dialogText.textContent = text; dialog.classList.add('show'); }
function nearestNPC() {
  let nearest = null, best = 3.3;
  for (const npc of npcs) { const d = player.position.distanceTo(npc.group.position); if (d < best) { best = d; nearest = npc; } }
  return nearest;
}
function interact() {
  if (customizePanel.classList.contains('show')) return;
  const npc = nearestNPC();
  if (npc) { activeNPC = npc; showDialog(npc.name + ' · ' + npc.role, '« ' + npc.message + ' »'); return; }
  if (!found && player.position.distanceTo(rune.position) < 3.2) {
    found = true; localStorage.setItem(foundKey, 'yes');
    questText.textContent = 'Fragment retrouvé : la première mémoire d’AURENTH est désormais inscrite à votre carnet.';
    document.querySelector('.quest h2').textContent = 'Fragment découvert';
    showDialog('La mémoire de la pierre', '« Là où les couronnes se brisent, la première porte demeure. Ne cherche pas la clé dans la main des rois, mais dans la mémoire de la terre. » Le fragment rejoint votre carnet de voyage.');
    return;
  }
  if (found) { showDialog('Le seuil d’AURENTH', 'Le fragment repose désormais dans votre carnet. Les habitants semblent en savoir davantage sur les terres qui s’étendent au-delà des remparts.'); return; }
  questText.textContent = player.position.distanceTo(rune.position) < 5 ? 'La relique est proche. Approchez-vous et appuyez sur E.' : 'Explorez la place et parlez aux habitants. Une lueur ancienne attend près du puits.';
}

document.querySelector('#closeDialog').addEventListener('click', () => dialog.classList.remove('show'));
document.querySelector('#customizeBtn').addEventListener('click', () => customizePanel.classList.toggle('show'));
document.querySelector('#closeCustomize').addEventListener('click', () => customizePanel.classList.remove('show'));
document.querySelector('#cloakChoice').addEventListener('change', e => { appearance.cloak = e.target.value; applyAppearance(); saveAppearance(); });
document.querySelector('#tunicChoice').addEventListener('change', e => { appearance.tunic = e.target.value; applyAppearance(); saveAppearance(); });
document.querySelector('#hoodChoice').addEventListener('change', e => { appearance.hood = e.target.value; applyAppearance(); saveAppearance(); });
for (const el of [document.querySelector('#cloakChoice'), document.querySelector('#tunicChoice'), document.querySelector('#hoodChoice')]) {
  const value = appearance[el.id === 'cloakChoice' ? 'cloak' : el.id === 'tunicChoice' ? 'tunic' : 'hood'];
  if ([...el.options].some(o => o.value === value)) el.value = value;
}
document.querySelector('#soundBtn').addEventListener('click', e => { e.currentTarget.textContent = e.currentTarget.textContent.includes('ACTIVÉ') ? 'SON : COUPÉ' : 'SON : ACTIVÉ'; });

// Commandes clavier, souris et écran tactile.
const keys = {}; let yaw = 0, pitch = .22, drag = false, lastX = 0, lastY = 0, moveX = 0, moveY = 0, running = false;
addEventListener('keydown', e => { keys[e.key.toLowerCase()] = true; if (e.key.toLowerCase() === 'e') interact(); if (e.key === 'Escape') { dialog.classList.remove('show'); customizePanel.classList.remove('show'); } });
addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
canvas.addEventListener('pointerdown', e => { if (e.pointerType === 'mouse') { drag = true; lastX = e.clientX; lastY = e.clientY; canvas.setPointerCapture(e.pointerId); } });
canvas.addEventListener('pointermove', e => { if (!drag) return; yaw -= (e.clientX - lastX) * .005; pitch = THREE.MathUtils.clamp(pitch + (e.clientY - lastY) * .003, -.08, .72); lastX = e.clientX; lastY = e.clientY; });
canvas.addEventListener('pointerup', () => drag = false); canvas.addEventListener('pointercancel', () => drag = false);
function bindHold(el, fn) { el.addEventListener('pointerdown', e => { e.preventDefault(); fn(true); }); for (const ev of ['pointerup', 'pointercancel', 'pointerleave']) el.addEventListener(ev, () => fn(false)); }
bindHold(document.querySelector('#runTouch'), v => running = v);
document.querySelector('#interactTouch').addEventListener('click', interact);
const stick = document.querySelector('#stick'); let stickId = null;
stick.addEventListener('pointerdown', e => { stickId = e.pointerId; stick.setPointerCapture(stickId); moveStick(e); });
stick.addEventListener('pointermove', e => { if (e.pointerId === stickId) moveStick(e); });
function moveStick(e) { const r = stick.getBoundingClientRect(), dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2), len = Math.hypot(dx, dy) || 1; moveX = THREE.MathUtils.clamp(dx / 42, -1, 1); moveY = THREE.MathUtils.clamp(dy / 42, -1, 1); stick.style.setProperty('--dx', `${dx / len * Math.min(28, len)}px`); stick.style.setProperty('--dy', `${dy / len * Math.min(28, len)}px`); }
for (const ev of ['pointerup', 'pointercancel']) stick.addEventListener(ev, () => { stickId = null; moveX = moveY = 0; stick.style.setProperty('--dx', '0px'); stick.style.setProperty('--dy', '0px'); });

// Particules de brume et poussières lumineuses.
const dustGeo = new THREE.BufferGeometry(), dustCount = 300, dustPos = new Float32Array(dustCount * 3);
for (let i = 0; i < dustCount; i++) { dustPos[i * 3] = (Math.random() - .5) * 48; dustPos[i * 3 + 1] = Math.random() * 7; dustPos[i * 3 + 2] = (Math.random() - .5) * 48; }
dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xc6b78e, size: .035, transparent: true, opacity: .45 })); scene.add(dust);

// Caméra troisième personne et boucle de jeu.
const clock = new THREE.Clock(); const target = new THREE.Vector3(); let step = 0;
function animate() {
  requestAnimationFrame(animate);
  const dt = Math.min(clock.getDelta(), .04), t = clock.elapsedTime;
  const forward = (keys.z || keys.w ? 1 : 0) - (keys.s ? 1 : 0) - moveY;
  const strafe = (keys.d ? 1 : 0) - (keys.q || keys.a ? 1 : 0) + moveX;
  const dir = new THREE.Vector3(strafe, 0, forward); if (dir.lengthSq() > 1) dir.normalize();
  const moving = dir.lengthSq() > .01, speed = (running || keys.shift ? 6.1 : 3.25) * dt;
  const worldForward = new THREE.Vector3(-Math.sin(yaw), 0, -Math.cos(yaw));
  const worldRight = new THREE.Vector3(Math.cos(yaw), 0, -Math.sin(yaw));
  const velocity = worldRight.multiplyScalar(dir.x).add(worldForward.multiplyScalar(dir.z));
  if (moving && !dialog.classList.contains('show') && !customizePanel.classList.contains('show')) {
    player.position.addScaledVector(velocity, speed); player.rotation.y = Math.atan2(velocity.x, velocity.z);
    step += dt * (running ? 13 : 8); const swing = Math.sin(step) * .55;
    leftLeg.rotation.x = swing; rightLeg.rotation.x = -swing; leftArm.rotation.x = -swing * .7; rightArm.rotation.x = swing * .7;
    torso.position.y = 1.35 + Math.abs(Math.sin(step * 2)) * .035; cape.rotation.z = Math.sin(step) * .035;
  } else {
    leftLeg.rotation.x *= .82; rightLeg.rotation.x *= .82; leftArm.rotation.x *= .82; rightArm.rotation.x *= .82;
    torso.position.y = 1.35 + Math.sin(t * 1.8) * .012;
  }
  // Limites du village, avec ouverture au nord vers le sentier.
  player.position.x = THREE.MathUtils.clamp(player.position.x, -21, 21);
  player.position.z = THREE.MathUtils.clamp(player.position.z, -29, 19);
  if (player.position.z < -21 && Math.abs(player.position.x) > 3.2) player.position.z = -21;
  const distance = 7.6;
  const camPos = new THREE.Vector3(player.position.x + Math.sin(yaw) * Math.cos(pitch) * distance, player.position.y + 2.55 + Math.sin(pitch) * distance, player.position.z + Math.cos(yaw) * Math.cos(pitch) * distance);
  camera.position.lerp(camPos, .12); target.set(player.position.x, 1.55, player.position.z); camera.lookAt(target);
  rune.rotation.y += dt * .4; shard.rotation.y += dt * .8; shard.position.y = Math.sin(t * 1.6) * .12; ring.rotation.z -= dt * .25; runeLight.intensity = 16 + Math.sin(t * 3) * 4;
  lanterns.forEach((l, i) => { l.light.intensity = 15 + Math.sin(t * 5 + i) * 2.5; l.glow.scale.y = .9 + Math.sin(t * 9 + i) * .12; });
  npcs.forEach((n, i) => { n.marker.rotation.y += dt * .8; n.marker.position.y = 2.65 + Math.sin(t * 2 + i) * .08; });
  dust.rotation.y += dt * .004;
  const npc = nearestNPC();
  if (npc) { questText.textContent = npc.name + ' est à portée. Appuyez sur E ou INTERAGIR pour lui parler.'; }
  else if (!found && player.position.distanceTo(rune.position) < 4.8) { questText.textContent = 'Une lueur pulse près du vieux puits. Approchez-vous et appuyez sur E.'; }
  renderer.render(scene, camera);
}
addEventListener('resize', () => { camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix(); renderer.setSize(innerWidth, innerHeight); renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5)); });
if (found) { document.querySelector('.quest h2').textContent = 'Fragment déjà découvert'; questText.textContent = 'Cette mémoire d’AURENTH figure déjà dans votre carnet de voyage.'; }
requestAnimationFrame(() => document.querySelector('#loading').classList.add('done'));
animate();
