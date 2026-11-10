import * as THREE from 'three';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const canvas=document.querySelector('#world');
const scene=new THREE.Scene();
scene.background=new THREE.Color(0x111820);
scene.fog=new THREE.FogExp2(0x111820,0.027);
const camera=new THREE.PerspectiveCamera(58,innerWidth/innerHeight,.1,180);
const renderer=new THREE.WebGLRenderer({canvas,antialias:true,powerPreference:'high-performance'});
renderer.setPixelRatio(Math.min(devicePixelRatio,1.35));renderer.setSize(innerWidth,innerHeight);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
scene.add(new THREE.HemisphereLight(0x8795a0,0x17100b,1.15));
const moon=new THREE.DirectionalLight(0x9ba9b9,1.35);moon.position.set(-12,22,8);moon.castShadow=true;moon.shadow.mapSize.set(1024,1024);moon.shadow.camera.left=-28;moon.shadow.camera.right=28;moon.shadow.camera.top=28;moon.shadow.camera.bottom=-28;scene.add(moon);
const warm=new THREE.PointLight(0xff9b45,28,16,2);warm.position.set(3,3,1);scene.add(warm);
// Place centrale et chemins du village : géométrie légère, modèles GLB détaillés chargés ensuite.
const groundMat=new THREE.MeshStandardMaterial({color:0x282a27,roughness:1});
const ground=new THREE.Mesh(new THREE.PlaneGeometry(120,120),groundMat);ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
const pathMat=new THREE.MeshStandardMaterial({color:0x45413a,roughness:1});
function path(x,z,w,d){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,d),pathMat);m.rotation.x=-Math.PI/2;m.position.set(x,.012,z);m.receiveShadow=true;scene.add(m);return m}
path(0,2,7,52);path(0,-3,46,6);path(-11,0,6,28);path(12,-2,6,30);
const stoneMat=new THREE.MeshStandardMaterial({color:0x5a554a,roughness:.96});const darkStone=new THREE.MeshStandardMaterial({color:0x292d2d,roughness:1});
for(let i=0;i<110;i++){const w=.45+Math.random()*1.05,d=.35+Math.random()*.8;const m=new THREE.Mesh(new THREE.BoxGeometry(w,.09,d),stoneMat);m.position.set((Math.random()-.5)*30,.05,(Math.random()-.5)*26);m.rotation.y=Math.random()*Math.PI;m.receiveShadow=true;m.castShadow=true;scene.add(m)}
// Lointaines collines et lisière forestière pour fermer naturellement l'horizon.
const hillMat=new THREE.MeshStandardMaterial({color:0x202a27,roughness:1});
for(let i=0;i<20;i++){const h=5+Math.random()*9;const hill=new THREE.Mesh(new THREE.ConeGeometry(5+Math.random()*5,h,7),hillMat);const a=i/20*Math.PI*2;hill.position.set(Math.cos(a)*43,h/2-1,Math.sin(a)*43);hill.rotation.y=Math.random()*2;hill.receiveShadow=true;scene.add(hill)}
const bark=new THREE.MeshStandardMaterial({color:0x30251e,roughness:1});const leaf=new THREE.MeshStandardMaterial({color:0x26362d,roughness:1});
for(let i=0;i<34;i++){const a=i/34*Math.PI*2,r=28+Math.random()*7,x=Math.cos(a)*r,z=Math.sin(a)*r;const trunk=new THREE.Mesh(new THREE.CylinderGeometry(.13,.27,3.4+Math.random()*1.5,6),bark);trunk.position.set(x,1.7,z);trunk.castShadow=true;scene.add(trunk);const crown=new THREE.Mesh(new THREE.IcosahedronGeometry(1.5+Math.random(),1),leaf);crown.position.set(x,4+Math.random(),z);crown.scale.y=1.2;crown.castShadow=true;scene.add(crown)}
// Lanternes d'ambiance ; les modèles du pack sont chargés en GLB plus bas.
const flameMat=new THREE.MeshBasicMaterial({color:0xffa34e});
for(const [x,z] of [[-5,2],[5,2],[-12,-4],[12,-4],[-8,10],[8,10]]){const post=new THREE.Mesh(new THREE.CylinderGeometry(.07,.11,2.1,7),new THREE.MeshStandardMaterial({color:0x33271d,roughness:.9}));post.position.set(x,1.05,z);post.castShadow=true;scene.add(post);const flame=new THREE.Mesh(new THREE.SphereGeometry(.13,8,7),flameMat);flame.position.set(x,2.2,z);scene.add(flame);const light=new THREE.PointLight(0xffa052,8,8,2);light.position.set(x,2.3,z);scene.add(light)}
// Chargement des modèles libres du pack Medieval Village.
const villageLoader=new GLTFLoader();
const villageModels=[
['half-timbered-tavern.glb',-10,-7,6.8,.12],['thatched-storybook-cottage.glb',9,-8,5.2,-.18],
 ['medieval-stone-windmill.glb',-21,-16,8,0],['medieval-water-sawmill.glb',21,-17,7.2,.15],['medieval-horse-stable.glb',13,5,4.5,Math.PI],
 ['blacksmith-workshop.glb',-15,5,5.2,-Math.PI/2],['archery-range-set.glb',21,12,4,Math.PI/2],['village-square-fountain.glb',0,-1,2.5,0],
 ['medieval-produce-stall.glb',-5,5,2.7,0],['medieval-feast-table.glb',6,6,2.4,Math.PI/2],['modular-castle-wall-kit.glb',0,-31,4.8,0],
 ['farm-sacks-and-bales.glb',-7,8,2.3,0],['tavern-bar-counter.glb',-7,-4,2.8,0],['medieval-bedroom-set.glb',10,-8,2.5,0],
 ['medieval-hay-cart.glb',-3,11,2.2,-.25],['merchants-covered-wagon.glb',5,13,2.8,.2],['village-chapel.glb',18,-5,5.2,0],
 ['medieval-weapon-rack.glb',-13,8,2.8,0],['half-timbered-townhouse.glb',-20,2,5.6,Math.PI/2],['fishmongers-market-stall.glb',-7,5.5,2.5,Math.PI/2],
 ['cloth-merchant-stall.glb',7,5.5,2.8,0],['medieval-banners-set.glb',-2,-5,5.5,0],['knights-tent-camp.glb',20,17,3.5,0],
 ['village-signs-set.glb',3,10,3.1,0],['siege-catapult.glb',23,4,3.2,-Math.PI/2]
];
const loadingEl=document.querySelector('#loading');let modelsLoaded=0,modelsFailed=0;
const solidColliders=[];
const solidBuildingFiles=new Set([
 'half-timbered-tavern.glb','thatched-storybook-cottage.glb','medieval-stone-windmill.glb',
 'medieval-water-sawmill.glb','medieval-horse-stable.glb','blacksmith-workshop.glb',
 'village-chapel.glb','half-timbered-townhouse.glb'
]);
function addVillageModel(file,x,z,targetHeight,rotation=0){
 const url=`assets/aurenth/models/${file}`;
 villageLoader.load(url,gltf=>{
  const object=gltf.scene;object.updateMatrixWorld(true);const box=new THREE.Box3().setFromObject(object);const size=box.getSize(new THREE.Vector3());
  const currentHeight=Math.max(size.y,size.x*.65,size.z*.65,.001);const scale=targetHeight/currentHeight;object.scale.setScalar(scale);object.updateMatrixWorld(true);
  const scaledBox=new THREE.Box3().setFromObject(object);const center=scaledBox.getCenter(new THREE.Vector3());object.position.x-=center.x;object.position.y-=scaledBox.min.y;object.position.z-=center.z;object.position.x+=x;object.position.z+=z;object.rotation.y=rotation;
  object.traverse(child=>{if(child.isMesh){child.castShadow=true;child.receiveShadow=true;if(child.material){child.material.side=THREE.FrontSide}}});scene.add(object);object.updateMatrixWorld(true);
  if(solidBuildingFiles.has(file)){
   const solidBox=new THREE.Box3().setFromObject(object);
   solidColliders.push({minX:solidBox.min.x,maxX:solidBox.max.x,minZ:solidBox.min.z,maxZ:solidBox.max.z});
  }
  modelsLoaded++;loadingEl.innerHTML=`GRYTZEN<small>VILLAGE D’AURENTH · ${modelsLoaded}/${villageModels.length} MODÈLES CHARGÉS${modelsFailed?` · ${modelsFailed} ÉCHEC(S)`:''}</small>`;
 },undefined,error=>{console.warn('Modèle non chargé :',file,error);modelsFailed++;loadingEl.innerHTML=`GRYTZEN<small>CHARGEMENT · ${modelsLoaded}/${villageModels.length} CHARGÉS · ${modelsFailed} ÉCHEC(S)</small>`});
}

villageModels.forEach(([file,x,z,h,r])=>addVillageModel(file,x,z,h,r));

// Château fort d'AURENTH : enceinte complète, tours, porte et grand hall visitable.
// Les murs sont séparés autour des ouvertures afin que le joueur puisse réellement entrer.
const castleStone=new THREE.MeshStandardMaterial({color:0x77766d,roughness:.94});
const castleDark=new THREE.MeshStandardMaterial({color:0x343633,roughness:1});
const castleWood=new THREE.MeshStandardMaterial({color:0x49301f,roughness:.88});
function castleBlock(x,y,z,w,h,d,mat=castleStone,solid=true){
 const mesh=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mat);
 mesh.position.set(x,y+h/2,z);mesh.castShadow=true;mesh.receiveShadow=true;scene.add(mesh);
 if(solid)solidColliders.push({minX:x-w/2,maxX:x+w/2,minZ:z-d/2,maxZ:z+d/2});
 return mesh;
}
function castleTower(x,z,r=1.65,h=10){
 const tower=new THREE.Mesh(new THREE.CylinderGeometry(r*.88,r,h,12),castleStone);
 tower.position.set(x,h/2,z);tower.castShadow=true;tower.receiveShadow=true;scene.add(tower);
 solidColliders.push({minX:x-r,maxX:x+r,minZ:z-r,maxZ:z+r});
 const cap=new THREE.Mesh(new THREE.CylinderGeometry(r*1.08,r*1.08,.55,12),castleDark);
 cap.position.set(x,h+.2,z);cap.castShadow=true;scene.add(cap);
 for(let i=0;i<8;i++){
  const a=i/8*Math.PI*2;
  const merlon=new THREE.Mesh(new THREE.BoxGeometry(.42,.85,.42),castleStone);
  merlon.position.set(x+Math.cos(a)*r*.82,h+.85,z+Math.sin(a)*r*.82);merlon.castShadow=true;scene.add(merlon);
 }
}
const cz=-39;
// Enceinte extérieure : ouverture centrale de 5,6 m côté village.
castleBlock(0,0,-49,32,7,1.35);
castleBlock(-15.3,0,-39,1.35,7,20);
castleBlock(15.3,0,-39,1.35,7,20);
castleBlock(-10.5,0,-29,9,7,1.35);
castleBlock(10.5,0,-29,9,7,1.35);
castleTower(-15.3,-49,1.8,10);castleTower(15.3,-49,1.8,10);
castleTower(-15.3,-29,1.8,10);castleTower(15.3,-29,1.8,10);
castleTower(-4.8,-29,1.35,8);castleTower(4.8,-29,1.35,8);
// Porte à deux vantaux ouverts, avec un passage central libre.
castleBlock(-3.15,0,-29,0.32,5.5,.65,castleWood,false);
castleBlock(3.15,0,-29,0.32,5.5,.65,castleWood,false);
const archTop=new THREE.Mesh(new THREE.BoxGeometry(6.7,.8,1.2),castleStone);
archTop.position.set(0,6,-29);archTop.castShadow=true;scene.add(archTop);
// Grand hall du château, ouvert par une porte centrale de 2,6 m.
castleBlock(-4.1,0,-42,4.2,8,1.15);
castleBlock(4.1,0,-42,4.2,8,1.15);
castleBlock(0,0,-48,12.4,8,1.15);
castleBlock(-5.65,0,-45,1.15,8,6);
castleBlock(5.65,0,-45,1.15,8,6);
castleBlock(0,7.9,-45,12.4,.45,7.2,castleDark,false);
// Hall entrance lintel and wooden door panels placed open against the sides.
castleBlock(-1.62,0,-42,.22,5.2,.35,castleWood,false);
castleBlock(1.62,0,-42,.22,5.2,.35,castleWood,false);
castleTower(-5.7,-42,1.2,9);castleTower(5.7,-42,1.2,9);
// Courtyard details: well, banners and warm braziers.
const castleFloor=new THREE.Mesh(new THREE.PlaneGeometry(26,17),new THREE.MeshStandardMaterial({color:0x514d43,roughness:1}));
castleFloor.rotation.x=-Math.PI/2;castleFloor.position.set(0,.025,-39);castleFloor.receiveShadow=true;scene.add(castleFloor);
const well=new THREE.Mesh(new THREE.CylinderGeometry(1.05,1.2,.8,12),castleStone);well.position.set(0,.4,-34.5);well.castShadow=true;well.receiveShadow=true;scene.add(well);
const wellWater=new THREE.Mesh(new THREE.CircleGeometry(.82,20),new THREE.MeshStandardMaterial({color:0x253f48,metalness:.25,roughness:.25}));
wellWater.rotation.x=-Math.PI/2;wellWater.position.set(0,.82,-34.5);scene.add(wellWater);
for(const x of [-11.8,11.8]){
 const pole=new THREE.Mesh(new THREE.CylinderGeometry(.055,.075,5,8),castleWood);pole.position.set(x,5.2,-38);pole.castShadow=true;scene.add(pole);
 const banner=new THREE.Mesh(new THREE.PlaneGeometry(1.35,2.1),new THREE.MeshStandardMaterial({color:x<0?0x263e59:0x792f2b,side:THREE.DoubleSide,roughness:.9}));
 banner.position.set(x-.65,6.35,-38);banner.castShadow=true;scene.add(banner);
}
const castleFire=new THREE.PointLight(0xff9b4c,18,18,2);castleFire.position.set(0,3,-34);scene.add(castleFire);
function collidesAt(x,z){
 const radius=.42;
 for(const c of solidColliders){
  const px=THREE.MathUtils.clamp(x,c.minX,c.maxX),pz=THREE.MathUtils.clamp(z,c.minZ,c.maxZ);
  const dx=x-px,dz=z-pz;
  if(dx*dx+dz*dz<radius*radius)return true;
 }
 return false;
}

// Le seuil fortifié est complété par une lueur ancienne au bord de la place.
warm.position.set(0,3,0);warm.intensity=20;warm.distance=18;
// Personnage provisoire remplacé par le voyageur encapuchonné d'AURENTH.
const player=new THREE.Group();scene.add(player);player.position.set(0,0,7);
const characterRoot=new THREE.Group();characterRoot.rotation.y=Math.PI;player.add(characterRoot);
const characterLoader=new GLTFLoader();let characterReady=false;
characterLoader.load('assets/aurenth/voyageur-aurenth.glb',gltf=>{
 const character=gltf.scene;

 // Le GLB du voyageur a été exporté avec l'axe Z vertical.
 // Three.js utilise Y comme axe vertical : on remet donc le modèle debout.
 character.rotation.x=-Math.PI/2;
 character.updateMatrixWorld(true);

 // Mise à l'échelle réelle (environ 1,75 m) et pose des pieds au niveau du sol.
 const initialBounds=new THREE.Box3().setFromObject(character);
 const initialSize=initialBounds.getSize(new THREE.Vector3());
 const targetHeight=1.75;
 const scale=targetHeight/Math.max(initialSize.y,0.001);
 character.scale.setScalar(scale);
 character.updateMatrixWorld(true);

 const bounds=new THREE.Box3().setFromObject(character);
 const center=bounds.getCenter(new THREE.Vector3());
 character.position.x-=center.x;
 character.position.y-=bounds.min.y;
 character.position.z-=center.z;

 character.traverse(child=>{
  if(child.isMesh){
   child.castShadow=true;
   child.receiveShadow=true;
   if(child.material) child.material.side=THREE.DoubleSide;
  }
 });
 characterRoot.add(character);
 characterReady=true;
 console.info('Voyageur d’AURENTH chargé et redressé.',{height:targetHeight,meshes:157});
},undefined,error=>console.error('Personnage d’AURENTH non chargé :',error));
// Rune plinth and floating collectible shard
const plinth= new THREE.Mesh(new THREE.CylinderGeometry(1.25,1.5,.65,7),darkStone);plinth.position.set(4,.32,-4);plinth.castShadow=true;plinth.receiveShadow=true;scene.add(plinth);
const rune=new THREE.Group();rune.position.set(4,1.55,-4);scene.add(rune);const shardMat=new THREE.MeshStandardMaterial({color:0x9bcbd0,emissive:0x2a9ba6,emissiveIntensity:2,metalness:.65,roughness:.2});const shard=new THREE.Mesh(new THREE.OctahedronGeometry(.48,0),shardMat);shard.scale.set(.7,1.5,.7);rune.add(shard);const ring=new THREE.Mesh(new THREE.TorusGeometry(.9,.035,8,48),new THREE.MeshBasicMaterial({color:0xb7dce0,transparent:true,opacity:.65}));ring.rotation.x=Math.PI/2;rune.add(ring);const runeLight=new THREE.PointLight(0x69c5d0,22,9,2);runeLight.position.set(4,2,-4);scene.add(runeLight);
// Floating dust motes
const dustGeo=new THREE.BufferGeometry(),dustCount=260,dustPos=new Float32Array(dustCount*3);for(let i=0;i<dustCount;i++){dustPos[i*3]=(Math.random()-.5)*45;dustPos[i*3+1]=Math.random()*8;dustPos[i*3+2]=(Math.random()-.5)*45}dustGeo.setAttribute('position',new THREE.BufferAttribute(dustPos,3));const dust=new THREE.Points(dustGeo,new THREE.PointsMaterial({color:0xc6b78e,size:.045,transparent:true,opacity:.55}));scene.add(dust);
// Controls and camera orbit
const keys={};let yaw=0,pitch=.23,drag=false,lastX=0,lastY=0,moveX=0,moveY=0,running=false,found=localStorage.getItem('gryzten-aurneth-fragment')==='yes';const dialog=document.querySelector('#dialog');
addEventListener('keydown',e=>{keys[e.key.toLowerCase()]=true;if(e.key.toLowerCase()==='e')interact();if(e.key==='Escape')dialog.classList.remove('show')});addEventListener('keyup',e=>keys[e.key.toLowerCase()]=false);
canvas.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'){drag=true;lastX=e.clientX;lastY=e.clientY;canvas.setPointerCapture(e.pointerId)}});canvas.addEventListener('pointermove',e=>{if(!drag)return;yaw-=(e.clientX-lastX)*.005;pitch=Math.max(-.08,Math.min(.72,pitch+(e.clientY-lastY)*.003));lastX=e.clientX;lastY=e.clientY});canvas.addEventListener('pointerup',()=>drag=false);canvas.addEventListener('pointercancel',()=>drag=false);
function bindHold(el,fn){el.addEventListener('pointerdown',e=>{e.preventDefault();fn(true)});for(const ev of ['pointerup','pointercancel','pointerleave'])el.addEventListener(ev,()=>fn(false))}bindHold(document.querySelector('#runTouch'),v=>running=v);document.querySelector('#interactTouch').addEventListener('click',interact);
const stick=document.querySelector('#stick');let stickId=null;stick.addEventListener('pointerdown',e=>{stickId=e.pointerId;stick.setPointerCapture(stickId);moveStick(e)});stick.addEventListener('pointermove',e=>{if(e.pointerId===stickId)moveStick(e)});function moveStick(e){const r=stick.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),len=Math.hypot(dx,dy)||1;moveX=Math.max(-1,Math.min(1,dx/42));moveY=Math.max(-1,Math.min(1,dy/42));stick.style.setProperty('--dx',`${dx/Math.max(1,len)*Math.min(28,len)}px`);stick.style.setProperty('--dy',`${dy/Math.max(1,len)*Math.min(28,len)}px`);stick.style.setProperty('background',`radial-gradient(circle at calc(50% + var(--dx,0px)) calc(50% + var(--dy,0px)),#b9955666 0 22px,#080b1088 23px)`) }for(const ev of ['pointerup','pointercancel'])stick.addEventListener(ev,()=>{stickId=null;moveX=moveY=0;stick.style.background='#080b1088'});
function interact(){if(player.position.distanceTo(rune.position)<3.1&&!found){found=true;localStorage.setItem('gryzten-aurneth-fragment','yes');dialog.classList.add('show');document.querySelector('.quest p').textContent='Fragment retrouvé : la première mémoire d’AURENTH est désormais inscrite à votre carnet.';document.querySelector('.quest h2').textContent='Fragment découvert';}else if(found){dialog.classList.add('show')}else{const d=player.position.distanceTo(rune.position);document.querySelector('.quest p').textContent=d<5?'La relique est proche. Approchez-vous et appuyez sur E.':'La lueur pulse au-delà des pierres. Explorez les ruines pour la trouver.'}}
document.querySelector('#closeDialog').addEventListener('click',()=>dialog.classList.remove('show'));document.querySelector('#soundBtn').addEventListener('click',e=>{e.currentTarget.textContent=e.currentTarget.textContent.includes('ACTIVÉ')?'SON : COUPÉ':'SON : ACTIVÉ'});
const clock=new THREE.Clock();const target=new THREE.Vector3();let step=0;
function animate(){requestAnimationFrame(animate);const dt=Math.min(clock.getDelta(),.04),t=clock.elapsedTime;const forward=(keys['z']||keys['w']?1:0)-(keys['s']?1:0)-moveY;const strafe=(keys['d']?1:0)-(keys['q']||keys['a']?1:0)+moveX;const dir=new THREE.Vector3(strafe,0,forward);if(dir.lengthSq()>1)dir.normalize();const moving=dir.lengthSq()>.01;const speed=(running||keys['shift']?6.2:3.35)*dt;const worldForward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));const worldRight=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));const velocity=worldRight.multiplyScalar(dir.x).add(worldForward.multiplyScalar(dir.z));if(moving){
 const nextX=player.position.x+velocity.x*speed;
 const nextZ=player.position.z+velocity.z*speed;
 if(!collidesAt(nextX,player.position.z))player.position.x=nextX;
 if(!collidesAt(player.position.x,nextZ))player.position.z=nextZ;
 player.rotation.y=Math.atan2(velocity.x,velocity.z);step+=dt*(running?13:8);characterRoot.position.y=Math.abs(Math.sin(step*2))*.045;characterRoot.rotation.z=Math.sin(step)*.018}else{characterRoot.position.y=Math.sin(t*1.8)*.012;characterRoot.rotation.z*=.92}
player.position.x=THREE.MathUtils.clamp(player.position.x,-27,27);player.position.z=THREE.MathUtils.clamp(player.position.z,-54,24);
const distance=7.4;const camX=player.position.x+Math.sin(yaw)*Math.cos(pitch)*distance;const camZ=player.position.z+Math.cos(yaw)*Math.cos(pitch)*distance;const camY=player.position.y+2.5+Math.sin(pitch)*distance;camera.position.lerp(new THREE.Vector3(camX,camY,camZ),.12);target.set(player.position.x,1.55,player.position.z);camera.lookAt(target);
rune.rotation.y+=dt*.4;shard.rotation.y+=dt*.8;shard.position.y= Math.sin(t*1.6)*.12;ring.rotation.z-=dt*.25;runeLight.intensity=18+Math.sin(t*3)*4;warm.intensity=25+Math.sin(t*8)*3;dust.rotation.y+=dt*.008;
if(!found&&player.position.distanceTo(rune.position)<4.8){document.querySelector('.quest p').textContent='Vous sentez une vibration sous les pierres. Appuyez sur E pour examiner la relique.'}renderer.render(scene,camera)}
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);renderer.setPixelRatio(Math.min(devicePixelRatio,1.6))});
if(found){document.querySelector('.quest h2').textContent='Fragment déjà découvert';document.querySelector('.quest p').textContent='Cette mémoire d’AURENTH figure déjà dans votre carnet de voyage.'}
const loadingWatch=setInterval(()=>{if(modelsLoaded+modelsFailed>=villageModels.length){clearInterval(loadingWatch);setTimeout(()=>loadingEl.classList.add('done'),450)}},180);setTimeout(()=>loadingEl.classList.add('done'),12000);animate();
