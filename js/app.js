
const regions={
aurenth:{number:"01",symbol:"A",title:"AURENTH — Les terres des couronnes",description:"Au cœur des terres connues s'étendent les royaumes d'Aurenth. Des routes anciennes relient les cités fortifiées, les marchés et les domaines des grandes maisons. Les chroniques y sont nombreuses, mais certaines pages semblent avoir été volontairement arrachées.",landscape:"Plaines, forêts tempérées, collines et citadelles",people:"Les Auréans",reputation:"Pouvoirs anciens, alliances et rivalités",mystery:"Des archives qui ne racontent pas toute l'histoire"},
varkhol:{number:"02",symbol:"V",title:"VARKHÖL — Les montagnes qui murmurent",description:"Au nord, les chaînes de Varkhöl dressent leurs sommets au-dessus des brumes et des glaces. Des bastions sont creusés dans la montagne. Les voyageurs racontent que, certaines nuits, la roche résonne comme si quelque chose bougeait très loin sous leurs pieds.",landscape:"Glaciers, cols étroits, vallées gelées et cavernes",people:"Les Varkhans",reputation:"Endurance, mémoire orale et forteresses",mystery:"Des sons inexpliqués dans les profondeurs"},
sylvara:{number:"03",symbol:"S",title:"SYLVARA — La forêt aux chemins mouvants",description:"Sylvara est une étendue de forêts anciennes, de clairières brumeuses et d'eaux silencieuses. Les sentiers ne conduisent pas toujours au même endroit. Ceux qui y vivent semblent connaître des passages que les cartes ne peuvent retenir.",landscape:"Forêts monumentales, marais, rivières et clairières",people:"Les Sylvari",reputation:"Savoir des plantes, discrétion et traditions mouvantes",mystery:"Des chemins qui changent lorsque nul ne les regarde"},
drakem:{number:"04",symbol:"D",title:"DRAKEM — Les terres ardentes",description:"Autour des volcans de Drakem s'élèvent des cités de roche sombre et des ateliers où l'on travaille des alliages rares. Des machines anciennes y fonctionnent encore. Leurs gardiens savent les entretenir, mais ignorent qui les a conçues.",landscape:"Volcans, champs de cendres, falaises et coulées pétrifiées",people:"Les Drakéens",reputation:"Forge, savoir-faire technique et secrets industriels",mystery:"Des machines dont personne ne connaît l'origine"},
orvane:{number:"05",symbol:"O",title:"ORVANE — Les îles des routes changeantes",description:"Les îles d'Orvane sont dispersées sur une mer parcourue de courants puissants. Les navigateurs y échangent des marchandises, des récits et des cartes. Certaines routes ne seraient praticables qu'à des périodes précises, comme si la mer ouvrait et refermait ses passages.",landscape:"Falaises, ports, récifs, plages sombres et îlots isolés",people:"Les Orvaniens",reputation:"Navigation, commerce et exploration",mystery:"Des îles absentes de certaines cartes"},
nereth:{number:"06",symbol:"N",title:"NÉRÉTH — Les profondeurs contestées",description:"Néréth n'apparaît sur aucune carte officielle. Pourtant, des récits évoquent des lacs souterrains, des galeries immenses et des cités éclairées par des cristaux. Aucun témoignage n'a encore permis de prouver que ce monde existe.",landscape:"Cavernes, lacs souterrains, failles et galeries profondes",people:"Les Néréthiens — existence non confirmée",reputation:"Légende, silence et savoirs inconnus",mystery:"Une civilisation qui pourrait vivre sous le monde"}
};
function selectRegion(name){
 const r=regions[name]; if(!r)return;
 document.querySelectorAll(".region").forEach(b=>b.classList.toggle("active",b.dataset.region===name));
 document.querySelectorAll(".region-card").forEach(b=>b.classList.toggle("selected",b.dataset.region===name));
 const set=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 set("region-detail",r.description);
 set("dossier-symbol",r.symbol);set("dossier-kicker","FICHE DE RÉGION · "+r.number);
 set("dossier-title",r.title);set("dossier-description",r.description);
 set("dossier-landscape",r.landscape);set("dossier-people",r.people);
 set("dossier-reputation",r.reputation);set("dossier-mystery",r.mystery);
}
document.querySelectorAll("[data-region]").forEach(el=>el.addEventListener("click",()=>selectRegion(el.dataset.region)));

const FF_SAVE_KEY="feufollet_grimoire_v1";
function ffLoad(){
 try{return JSON.parse(localStorage.getItem(FF_SAVE_KEY)||"{}")}catch(e){return {}}
}
function ffSave(data){
 try{localStorage.setItem(FF_SAVE_KEY,JSON.stringify(data))}catch(e){}
}
function ffRecord(item){
 const data=ffLoad();data.discoveries=data.discoveries||[];
 if(!data.discoveries.includes(item))data.discoveries.push(item);
 ffSave(data);
 if(document.getElementById("grimoire-entries"))refreshGrimoire();
}
function ffScene(text,controls,status,feedback){
 const scene=document.getElementById("game-scene");
 const actions=document.getElementById("game-controls");
 if(scene)scene.innerHTML=text;
 if(actions)actions.innerHTML=controls;
 const st=document.getElementById("game-status");if(st)st.textContent=status||"PROGRESSION ENREGISTRÉE";
 const fb=document.getElementById("game-feedback");if(fb&&feedback)fb.textContent=feedback;
}
function episodeChoice(choice){
 if(choice==="examiner"){
  ffRecord("Le Signe sans royaume");
  ffScene("<p>Tu approches la main du tissu. Le symbole n'est pas dessiné à l'encre : il semble avoir été pressé dans la fibre.</p><p>Au revers, trois mots presque effacés : <strong>règne · demeure · passe</strong>.</p><p>Le paquet est toujours là. Il semble attendre que tu l'ouvres.</p>",
  '<button class="game-btn gold" onclick="episodeChoice(\'prendre\')">Ouvrir le paquet</button><button class="game-btn" onclick="episodeChoice(\'appeler\')">Appeler un archiviste</button>',
  "DÉCOUVERTE : LE SYMBOLE OBSERVÉ","Le grimoire a enregistré le Signe sans royaume.");
 }else if(choice==="appeler"){
  ffScene("<p>Un vieux copiste entrouvre la porte voisine. À la vue du symbole, son visage se ferme.</p><p>« Ne prononcez pas ce nom ici. Prenez ce paquet, et ne le montrez à personne avant d'avoir compris ce qu'il contient. »</p>",
  '<button class="game-btn gold" onclick="episodeChoice(\'prendre\')">Prendre le paquet</button><button class="game-btn" onclick="episodeChoice(\'examiner\')">Examiner le symbole</button>',
  "RENCONTRE : LE COPISTE","Un témoin a reconnu le signe. Sa peur est désormais un indice.");
 }else{
  ffRecord("Le Registre sans nom");
  ffScene("<p>La toile se défait. À l'intérieur, un registre sans titre, sans auteur et sans sceau. Plusieurs pages ont été arrachées avec une précision remarquable.</p><p><strong>« Les routes furent comptées. Les couronnes furent nommées. Les frontières furent tracées. Mais nul ne consigna le lieu qui manquait. »</strong></p><p>Dans la reliure, tu découvres un disque de cuivre à trois symboles : une couronne, une montagne et une vague.</p><p><em>Dans quel ordre faut-il les placer ?</em></p>",
  '<button class="game-btn gold" onclick="episodeRiddleStart()">Composer l’ordre des trois symboles</button>',
  "ÉNIGME : LE DISQUE DE CUIVRE","Le registre est ajouté à votre grimoire.");
 }
}
let riddleSequence=[];
function episodeRiddle(first){
 riddleSequence=[first];
 const labels={couronne:"Couronne",montagne:"Montagne",vague:"Vague"};
 ffScene(
  "<p>Le disque réagit au premier symbole. Les trois mots gravés sur la toile semblent indiquer une action pour chaque signe : <strong>règne · demeure · passe</strong>.</p><p>Compose maintenant l'ordre complet en touchant les trois symboles, un par un.</p><p><strong>Ordre choisi :</strong> <span id=\"riddle-sequence\">"+labels[first]+"</span></p>",
  '<div class="game-riddle"><button class="riddle-choice" onclick="riddleAdd(\'couronne\')">Couronne</button><button class="riddle-choice" onclick="riddleAdd(\'montagne\')">Montagne</button><button class="riddle-choice" onclick="riddleAdd(\'vague\')">Vague</button></div><div class="game-actions"><button class="game-btn gold" onclick="episodeCheckRiddle()">Vérifier l’ordre</button><button class="game-btn" onclick="riddleReset()">Recommencer</button></div>',
  "ÉNIGME : LE DISQUE DE CUIVRE",
  "Indice : règne, demeure, passe. Chaque mot correspond à un symbole."
 );
}
function riddleAdd(symbol){
 if(riddleSequence.length>=3)return;
 riddleSequence.push(symbol);
 const labels={couronne:"Couronne",montagne:"Montagne",vague:"Vague"};
 const display=document.getElementById("riddle-sequence");
 if(display)display.textContent=riddleSequence.map(x=>labels[x]).join(" → ");
 const status=document.getElementById("game-status");
 if(status)status.textContent="SYMBOLES SÉLECTIONNÉS : "+riddleSequence.length+"/3";
}
function riddleReset(){
 riddleSequence=[];
 episodeRiddleStart();
}
function episodeRiddleStart(){
 ffScene(
  "<p>Les trois mots gravés sur la toile semblent indiquer une action pour chaque signe : <strong>règne · demeure · passe</strong>.</p><p>Compose l'ordre complet en touchant les trois symboles, un par un.</p><p><strong>Ordre choisi :</strong> <span id=\"riddle-sequence\">Aucun symbole</span></p>",
  '<div class="game-riddle"><button class="riddle-choice" onclick="riddleAdd(\'couronne\')">Couronne</button><button class="riddle-choice" onclick="riddleAdd(\'montagne\')">Montagne</button><button class="riddle-choice" onclick="riddleAdd(\'vague\')">Vague</button></div><div class="game-actions"><button class="game-btn gold" onclick="episodeCheckRiddle()">Vérifier l’ordre</button><button class="game-btn" onclick="riddleReset()">Recommencer</button></div>',
  "ÉNIGME : LE DISQUE DE CUIVRE",
  "Indice : règne, demeure, passe. Chaque mot correspond à un symbole."
 );
}
function episodeCheckRiddle(){
 if(riddleSequence.length!==3){
  const fb=document.getElementById("game-feedback");
  if(fb)fb.textContent="Il faut choisir les trois symboles avant de vérifier.";
  return;
 }
 const answer=["couronne","montagne","vague"];
 if(riddleSequence.every((v,i)=>v===answer[i])){
  episodeSolve();
 }else{
  const fb=document.getElementById("game-feedback");
  if(fb)fb.textContent="Le disque tremble puis se bloque. L'ordre n'est pas le bon. Relis les mots : règne · demeure · passe, puis recommence.";
  const st=document.getElementById("game-status");
  if(st)st.textContent="ORDRE INCORRECT · NOUVEL ESSAI POSSIBLE";
 }
}
function episodeSolve(){
 ffRecord("Fragment de carte inconnu");
 ffRecord("Énigme du disque résolue");
 ffScene("<p>Le disque s'aligne. Un compartiment s'ouvre dans la reliure. Il contient un fragment de carte sans nom. Une côte y est dessinée, puis une ligne de points qui s'interrompt au milieu de la mer.</p><p>Au bout de la ruelle, une silhouette en manteau sombre apparaît. Une lueur bleue flotte près de son épaule.</p><p><strong>« Je ne garde pas la porte. Je garde le souvenir de ceux qui l'ont franchie. »</strong></p><p>Quand tu relèves les yeux, la silhouette a disparu. Sur la pierre, une phrase : <strong>Hauterive conserve ce que Valombre oublie.</strong></p>",
 '<button class="game-btn gold" onclick="episodeFinish()">Inscrire la découverte au grimoire</button>',
 "ÉPISODE 01 : PREMIÈRE PORTE OBSERVÉE","Bravo. Vous avez découvert le premier fragment de l'histoire.");
}
function episodeFinish(){
 ffRecord("Première rencontre avec le Veilleur");
 ffRecord("Piste vers Hauterive");
 ffScene("<p>Le grimoire se referme. Une nouvelle destination y apparaît : <strong>Hauterive, la ville des archives</strong>.</p><p>Tu peux revenir plus tard. Le monde, lui, n'a pas fini de parler.</p>",
 '<button class="game-btn gold" onclick="showGrimoire()">Consulter mon grimoire</button><button class="game-btn" onclick="location.hash=\'atlas\'">Explorer l’atlas</button>',
 "ÉPISODE 01 TERMINÉ","Votre progression est enregistrée sur cet appareil.");
}
const grimoireCatalog=[
 {name:"Le Signe sans royaume",art:"sigil",type:"SYMBOLE",desc:"Un cercle incomplet traversé par une ligne verticale.",detail:"Le signe a été pressé dans la fibre d'une toile ancienne. Il ne porte le blason d'aucune dynastie connue. Pourtant, certains témoins le reconnaissent et préfèrent se taire.",note:"Un signe sans royaume… ou le souvenir d'un royaume que les cartes ont effacé ?",origin:"Valombre · Première observation",lockHint:'Une marque que personne ne revendique. Pourtant, elle est reconnue.'},
 {name:"Le Registre sans nom",art:"book",type:"RELIQUE",desc:"Un registre ancien dont plusieurs pages ont été arrachées.",detail:"La reliure est usée par l'humidité et le temps. Les pages manquantes ont été retirées avec soin, comme si quelqu'un avait voulu effacer non pas un récit, mais les preuves de son existence.",note:"Nul ne consigna le lieu qui manquait.",origin:"Valombre · La ruelle des copistes",lockHint:'Un livre mutilé. Quelqu’un a voulu faire disparaître une trace.'},
 {name:"Fragment de carte inconnu",art:"map",type:"FRAGMENT",desc:"Une côte dessinée, puis une ligne de points qui s'interrompt en mer.",detail:"Le fragment ne porte ni nom de port ni indication de latitude. La ligne de points s'arrête au milieu de l'eau, sans rejoindre aucune terre répertoriée. Le papier semble plus ancien que les frontières actuelles.",note:"Une route peut-elle conduire à un lieu qui n'apparaît sur aucune carte ?",origin:"Découvert dans la reliure du registre",lockHint:'Une route s’interrompt là où aucune terre ne devrait manquer.'},
 {name:"Énigme du disque résolue",art:"disk",type:"ÉNIGME",desc:"Le disque de cuivre a révélé son mécanisme.",detail:"Trois symboles étaient gravés sur le disque : une couronne, une montagne et une vague. Leur ordre a libéré un compartiment dissimulé dans la reliure. Le mécanisme n'était pas un verrou ordinaire : il répondait à une suite de sens.",note:"Règne · demeure · passe.",origin:"Valombre · Le Registre sans nom",lockHint:'Trois signes, un ordre. Le mécanisme attend encore son témoin.'},
 {name:"Première rencontre avec le Veilleur",art:"watcher",type:"RENCONTRE",desc:"Une silhouette au manteau sombre et une lueur bleue.",detail:"Au bout de la ruelle, une silhouette immobile apparaît. Son visage demeure caché. Une faible lueur bleue flotte près de son épaule. Lorsque le regard se détourne un instant, il n'y a déjà plus personne.",note:"Je ne garde pas la porte. Je garde le souvenir de ceux qui l'ont franchie.",origin:"Valombre · Après l'ouverture du disque",lockHint:'Une silhouette apparaît parfois là où les souvenirs se dérobent.'},
 {name:"Piste vers Hauterive",art:"path",type:"DESTINATION",desc:"Hauterive conserve ce que Valombre oublie.",detail:"La phrase laissée sur la pierre désigne Hauterive, ville d'archives et de copistes. Si quelqu'un a conservé la trace du lieu absent, ce pourrait être dans ses dépôts, ses registres ou ses marges oubliées.",note:"Hauterive conserve ce que Valombre oublie.",origin:"Indice laissé à Valombre",lockHint:'Une phrase désigne une ville où les archives ont de longues mémoires.'},
 {name:"Le copiste de Valombre",art:"quill",type:"TÉMOIN",desc:"Un témoin a reconnu le symbole et en connaît la crainte.",detail:"Le vieux copiste n'a pas expliqué ce qu'il savait. À la vue du signe, son visage s'est fermé. Il a conseillé de prendre le paquet et de ne le montrer à personne avant d'en comprendre le contenu.",note:"Ne prononcez pas ce nom ici.",origin:"Valombre · La porte voisine",lockHint:'Un témoin s’est tu devant un symbole qu’il connaissait.'}
];
function grimoireArt(kind,large=false){
 const images={sigil:"signe-sans-royaume.png",book:"registre-sans-nom.png",map:"fragment-carte.png",disk:"disque-cuivre.png",watcher:"veilleur-seuil.png",path:"chemin-hauterive.png",quill:"plume-copiste.png"};
 const labels={sigil:"Le Signe sans royaume",book:"Le Registre sans nom",map:"Fragment de carte",disk:"Disque de cuivre",watcher:"Le Veilleur du Seuil",path:"Chemin vers Hauterive",quill:"La plume du copiste"};
 const file=images[kind]||images.sigil;
 return '<div class="'+(large?'detail-art':'entry-art')+'"><img src="assets/grimoire/'+file+'" alt="'+(labels[kind]||'Illustration du Grimoire')+'" loading="lazy"></div>';
}
function refreshGrimoire(){
 const data=ffLoad(),found=data.discoveries||[],container=document.getElementById("grimoire-entries");
 if(!container)return;
 const count=grimoireCatalog.filter(x=>found.includes(x.name)).length;
 const total=grimoireCatalog.length;
 const countEl=document.getElementById("grimoire-count");if(countEl)countEl.textContent=count;
 const pct=Math.round(count/total*100);
 const ep=document.getElementById("grimoire-episode");if(ep)ep.textContent=pct+"%";
 const dest=document.getElementById("grimoire-destination");
 if(dest)dest.textContent=found.includes("Piste vers Hauterive")?"HAUTERIVE":"À DÉCOUVRIR";
 const bar=document.getElementById("grimoire-progress-bar");if(bar)bar.style.width=pct+"%";
 const label=document.getElementById("grimoire-progress-label");
 if(label)label.textContent=count+" / "+total+" PAGES RÉVÉLÉES";
 container.innerHTML=grimoireCatalog.map((item,index)=>{
  const yes=found.includes(item.name);
  const title=yes?item.name:"Page scellée";
  const description=yes?item.desc:"Cette page refuse encore de livrer son contenu.";
  return '<button type="button" class="grimoire-entry '+(yes?'found':'locked')+'" data-entry-index="'+index+'" '+(yes?'aria-label="Ouvrir la fiche : '+item.name+'"':'disabled aria-disabled="true" aria-label="Page scellée"')+'>'+grimoireArt(item.art,false)+'<span class="entry-type">'+item.type+' · '+(yes?'DÉCOUVERT':'SCELLÉ')+'</span><h3>'+title+'</h3><p>'+description+'</p>'+(yes?'<span class="entry-open">OUVRIR LA FICHE ↗</span>':'<span class="sealed-hint">'+item.lockHint+'</span>')+'</button>';
 }).join("");
 const detail=document.getElementById("grimoire-detail");
 if(detail&&!detail.classList.contains("open"))detail.innerHTML="";
}
function openGrimoireEntry(index){
  const item=grimoireCatalog[index];
  const found=ffLoad().discoveries||[];
  const detail=document.getElementById("grimoire-detail");
  if(!item||!found.includes(item.name)||!detail)return;

  detail.innerHTML=
    grimoireArt(item.art,true)+
    '<div class="detail-type">'+item.type+' · ARCHIVES DU GRIMOIRE</div>'+
    '<h3>'+item.name+'</h3>'+
    '<p>'+item.detail+'</p>'+
    '<div class="detail-note">'+item.note+'</div>'+
    '<p><strong>Origine :</strong> '+item.origin+'</p>'+
    '<button type="button" class="detail-close" onclick="closeGrimoireEntry()">Refermer cette page</button>';

  detail.classList.remove("open");
  void detail.offsetWidth;
  detail.classList.add("open");
  detail.scrollIntoView({behavior:"smooth",block:"start"});
}
function closeGrimoireEntry(){
  const detail=document.getElementById("grimoire-detail");
  if(!detail)return;
  detail.classList.remove("open");
  detail.innerHTML="";
  document.getElementById("grimoire-entries")?.scrollIntoView({
    behavior:"smooth",
    block:"nearest"
  });
}

function showGrimoire(){
 const section=document.getElementById("grimoire");
 refreshGrimoire();
 if(section){
  location.hash="grimoire";
  section.scrollIntoView({behavior:"smooth",block:"start"});
 }else{
  location.href="grimoire.html";
 }
}
window.addEventListener("hashchange",()=>{
 if(location.hash==="#grimoire")refreshGrimoire();
});
// Gestion des cartes par délégation : fonctionne aussi après chaque reconstruction de la grille.
function bindGrimoireCards(){
 const container=document.getElementById("grimoire-entries");
 if(!container||container.dataset.clickBound==="true")return;
 container.dataset.clickBound="true";
 container.addEventListener("click",function(event){
  const card=event.target.closest("button.grimoire-entry[data-entry-index]");
  if(!card||card.disabled)return;
  const index=Number(card.dataset.entryIndex);
  if(Number.isInteger(index))openGrimoireEntry(index);
 });
}
window.addEventListener("DOMContentLoaded",function(){bindGrimoireCards();refreshGrimoire();});
// Le script est placé en fin de page : le conteneur existe déjà au moment de l'exécution.
bindGrimoireCards();

