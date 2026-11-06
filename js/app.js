
/* FEU FOLLET — app.js complet — V3.1
   Corrections : illustration distincte pour le témoin de Valombre ; lien Episode-02.html avec E majuscule. */
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
function ffEpisodeState(){return ffLoad().episode01||{stage:"intro",sequence:[]}}
function ffSetEpisodeState(stage,sequence){
 const data=ffLoad();data.episode01={stage:stage,sequence:sequence||[]};ffSave(data);
 const progress=document.getElementById("episode-progress");
 if(progress){const levels={intro:0,symbol:1,witness:1,register:2,riddle:3,solved:4,complete:5};progress.textContent="ÉTAPE "+(levels[stage]||0)+" / 5";}
}
function episodeChoice(choice){
 if(choice==="examiner"){
  ffRecord("Le Signe sans royaume");ffSetEpisodeState("symbol",[]);
  ffScene("<p>Tu approches la main du tissu. Le symbole n'est pas dessiné à l'encre : il semble avoir été pressé dans la fibre.</p><p>Au revers, trois mots presque effacés : <strong>règne · demeure · passe</strong>.</p><p>La marque est froide. Pourtant, la toile semble vibrer sous tes doigts.</p>",
  '<button class="game-btn gold" onclick="episodeChoice(\'prendre\')">Ouvrir le paquet</button><button class="game-btn" onclick="episodeChoice(\'appeler\')">Appeler un archiviste</button>',
  "DÉCOUVERTE : LE SIGNE OBSERVÉ","Le Grimoire a enregistré le Signe sans royaume.");
 }else if(choice==="appeler"){
  ffSetEpisodeState("witness",[]);
  ffScene("<p>Un vieux copiste entrouvre la porte voisine. À la vue du symbole, son visage se ferme. Il regarde la rue avant de parler.</p><p>« Ne prononcez pas ce nom ici. Prenez ce paquet, et ne le montrez à personne avant d'avoir compris ce qu'il contient. »</p><p>Il referme presque aussitôt. Tu entends le verrou glisser.</p>",
  '<button class="game-btn gold" onclick="episodeChoice(\'prendre\')">Prendre le paquet</button><button class="game-btn" onclick="episodeChoice(\'examiner\')">Examiner le symbole</button>',
  "RENCONTRE : LE COPISTE","Un témoin a reconnu le signe. Sa peur est désormais un indice.");
 }else{
  ffRecord("Le Registre sans nom");ffSetEpisodeState("register",[]);
  ffScene("<p>La toile se défait. À l'intérieur, un registre sans titre, sans auteur et sans sceau. Plusieurs pages ont été arrachées avec une précision remarquable.</p><p><strong>« Les routes furent comptées. Les couronnes furent nommées. Les frontières furent tracées. Mais nul ne consigna le lieu qui manquait. »</strong></p><p>Dans la reliure, tu découvres un disque de cuivre à trois symboles : une couronne, une montagne et une vague.</p><p><em>Le mécanisme attend un ordre. Les mots gravés au revers de la toile pourraient t'aider.</em></p>",
  '<button class="game-btn gold" onclick="episodeRiddleStart()">Examiner le disque de cuivre</button>',
  "DÉCOUVERTE : LE REGISTRE","Le Registre sans nom a été ajouté à ton Grimoire.");
 }
}
let riddleSequence=[];
function episodeRiddleStart(preserve=false){
 if(!preserve){riddleSequence=[];ffSetEpisodeState("riddle",[]);}
 ffScene("<p>Trois signes sont gravés sur le disque : une couronne, une montagne et une vague.</p><p>Sur la toile, tu as lu trois mots : <strong>règne · demeure · passe</strong>.</p><p>Associe chaque mot à son symbole, puis compose la séquence complète.</p><p><strong>Ordre choisi :</strong> <span id=\"riddle-sequence\">Aucun symbole</span></p>",
 '<div class="game-riddle"><button class="riddle-choice" onclick="riddleAdd(\'couronne\')">Couronne</button><button class="riddle-choice" onclick="riddleAdd(\'montagne\')">Montagne</button><button class="riddle-choice" onclick="riddleAdd(\'vague\')">Vague</button></div><div class="game-actions"><button class="game-btn gold" onclick="episodeCheckRiddle()">Vérifier l’ordre</button><button class="game-btn" onclick="riddleReset()">Recommencer</button></div>',
 "ÉNIGME : LE DISQUE DE CUIVRE","Indice : règne, demeure, passe. Chaque mot correspond à un symbole.");
}
function riddleAdd(symbol){
 if(riddleSequence.length>=3)return;
 riddleSequence.push(symbol);ffSetEpisodeState("riddle",riddleSequence);
 const labels={couronne:"Couronne",montagne:"Montagne",vague:"Vague"};
 const display=document.getElementById("riddle-sequence");if(display)display.textContent=riddleSequence.map(x=>labels[x]).join(" → ");
 const status=document.getElementById("game-status");if(status)status.textContent="SYMBOLES SÉLECTIONNÉS : "+riddleSequence.length+"/3";
}
function riddleReset(){riddleSequence=[];episodeRiddleStart();}
function episodeCheckRiddle(){
 if(riddleSequence.length!==3){const fb=document.getElementById("game-feedback");if(fb)fb.textContent="Il faut choisir les trois symboles avant de vérifier.";return;}
 const answer=["couronne","montagne","vague"];
 if(riddleSequence.every((v,i)=>v===answer[i]))episodeSolve();
 else{const fb=document.getElementById("game-feedback");if(fb)fb.textContent="Le disque tremble puis se bloque. L'ordre n'est pas le bon. Relis les mots : règne · demeure · passe, puis recommence.";const st=document.getElementById("game-status");if(st)st.textContent="ORDRE INCORRECT · NOUVEL ESSAI POSSIBLE";}
}
function episodeSolve(){
 ffRecord("Fragment de carte inconnu");ffRecord("Énigme du disque résolue");ffSetEpisodeState("solved",[]);
 ffScene("<p>La couronne s'aligne avec la montagne, puis la vague. Un déclic traverse le cuivre. Un compartiment s'ouvre dans la reliure.</p><p>À l'intérieur repose un fragment de carte sans nom. Une côte y est dessinée, puis une ligne de points qui s'interrompt au milieu de la mer.</p><p>Au bout de la ruelle, une silhouette en manteau sombre apparaît. Une lueur bleue flotte près de son épaule.</p><p><strong>« Je ne garde pas la porte. Je garde le souvenir de ceux qui l'ont franchie. »</strong></p><p>Quand tu relèves les yeux, la silhouette a disparu. Sur la pierre, une phrase demeure : <strong>Hauterive conserve ce que Valombre oublie.</strong></p>",
 '<button class="game-btn gold" onclick="episodeFinish()">Inscrire la découverte au Grimoire</button>',
 "ÉPISODE 01 : LE PREMIER SEUIL","Le disque est ouvert. Le fragment et le Veilleur ont laissé leur trace.");
}
function episodeFinish(){
 ffRecord("Première rencontre avec le Veilleur");ffRecord("Piste vers Hauterive");ffSetEpisodeState("complete",[]);
 ffScene("<p>Tu refermes le registre. Une destination apparaît désormais dans ton Grimoire : <strong>Hauterive, la ville des archives</strong>.</p><p>Valombre t'a livré un premier secret. Mais la carte, elle, demeure incomplète.</p><p><em>Fin de l'épisode 01 — La suite attend à Hauterive.</em></p>",
 '<button class="game-btn gold" onclick="location.href=\'Episode-02.html\'">Poursuivre vers Hauterive</button><button class="game-btn" onclick="showGrimoire()">Consulter mon Grimoire</button>',
 "ÉPISODE 01 TERMINÉ","Ta progression est enregistrée sur cet appareil.");
}
function restoreEpisode(){
 const state=ffEpisodeState();riddleSequence=state.sequence||[];
 if(state.stage==="symbol"){episodeChoice("examiner");}
 else if(state.stage==="witness"){episodeChoice("appeler");}
 else if(state.stage==="register"){episodeChoice("prendre");}
 else if(state.stage==="riddle"){
  episodeRiddleStart(true);
  if(riddleSequence.length){const labels={couronne:"Couronne",montagne:"Montagne",vague:"Vague"};const display=document.getElementById("riddle-sequence");if(display)display.textContent=riddleSequence.map(x=>labels[x]).join(" → ");}
 }else if(state.stage==="solved"){episodeSolve();}
 else if(state.stage==="complete"){episodeFinish();}
}
function resetEpisode(){
 if(!confirm("Recommencer l'épisode 01 ? Tes découvertes déjà inscrites au Grimoire seront conservées."))return;
 ffSetEpisodeState("intro",[]);riddleSequence=[];location.reload();
}

/* ÉPISODE 02 — LES ARCHIVES QUI RESPIRENT */
function ffEpisode02State(){return ffLoad().episode02||{stage:"intro",order:[],hints:0};}
function ffSetEpisode02State(stage,extra={}){
 const data=ffLoad();data.episode02={...ffEpisode02State(),...extra,stage};ffSave(data);
 const progress=document.getElementById("episode02-progress");
 if(progress){const levels={intro:0,plaque:1,maelan:2,archives:3,catalogue:4,keyword:5,opened:6,document:7,whisper:8,complete:9};progress.textContent="ÉTAPE "+(levels[stage]??0)+" / 9";}
}
function ffEpisode02Scene(html,buttons,status,feedback){
 ffScene(html,buttons,status,feedback);
 const progress=document.getElementById("episode02-progress");
 const s=ffEpisode02State();
 if(progress){const levels={intro:0,plaque:1,maelan:2,archives:3,catalogue:4,keyword:5,opened:6,document:7,whisper:8,complete:9};progress.textContent="ÉTAPE "+(levels[s.stage]??0)+" / 9";}
}
function episode02Start(){
 const s=ffEpisode02State();
 if(s.stage==="intro"){
  ffEpisode02Scene("<p>Le chemin quitte les terres de Valombre et suit le Fleuve d’Aube. Au détour d’un dernier méandre, Hauterive apparaît : passerelles de pierre, ateliers de copistes et hautes salles d’archives.</p><p>La ville semble calme. Pourtant, plusieurs portes sont fermées malgré l’heure. Des employés transportent des caisses scellées vers un bâtiment sans enseigne.</p><p>Sur une plaque commémorative, une date a été martelée. Les traces sont anciennes. Quelqu’un a voulu retirer un événement, pas simplement corriger une erreur.</p><p><em>Que souhaites-tu examiner ?</em></p>",
  '<button class="game-btn gold" onclick="episode02InspectPlaque()">Examiner la plaque martelée</button><button class="game-btn" onclick="episode02FindMaelan()">Chercher un copiste</button>',
  "ARRIVÉE À HAUTERIVE","Le fragment de Valombre t’a conduit jusqu’à la ville des archives.");
 }else restoreEpisode02();
}
function episode02InspectPlaque(){
 ffRecord("La date martelée de Hauterive");ffSetEpisode02State("plaque");
 ffEpisode02Scene("<p>La pierre a été polie autour de la date, mais pas assez pour effacer les coups d’outil. Ce n’est pas une usure du temps : quelqu’un a volontairement martelé le nom d’un événement.</p><p>Un apprenti archiviste détourne les yeux lorsque tu lui poses une question. Il désigne discrètement une porte latérale.</p><p><em>Une personne pourrait savoir ce qui a été retiré des registres.</em></p>",
 '<button class="game-btn gold" onclick="episode02FindMaelan()">Passer la porte latérale</button>',
 "INDICE : UNE DATE EFFACÉE","La date martelée est ajoutée au Grimoire.");
}
function episode02FindMaelan(){
 ffRecord("Maëlan, copiste des marges");ffSetEpisode02State("maelan");
 ffEpisode02Scene("<p>Dans une salle secondaire, un homme relève la tête au-dessus d’un feuillet abîmé. Il se présente sous le nom de Maëlan. Ses doigts sont tachés d’encre, mais son regard s’arrête aussitôt sur le fragment de carte.</p><p><strong>« Les archives ne mentent pas toujours. Mais elles savent très bien se taire. Montrez-moi ce que vous avez trouvé. »</strong></p><p>Il reconnaît le style du registre, sans pouvoir en nommer l’auteur. Il propose de vous conduire vers une salle de consultation fermée depuis plusieurs années.</p>",
 '<button class="game-btn gold" onclick="episode02ShowFragment()">Lui montrer le fragment de carte</button><button class="game-btn" onclick="episode02AskArchives()">Lui demander ce qu’il sait des archives</button>',
 "RENCONTRE : MAËLAN","Maëlan, copiste des marges, est ajouté à ton Grimoire.");
}
function episode02ShowFragment(){
 ffSetEpisode02State("maelan");
 ffEpisode02Scene("<p>Maëlan approche le fragment d’une lampe. Il suit du doigt la ligne de points qui s’interrompt au milieu de la mer.</p><p>« Ce tracé ne ressemble pas à une route commerciale ordinaire. Mais je ne vais pas prétendre savoir où il mène. Venez. Il existe une salle dont les documents ne figurent plus dans le catalogue public. »</p><p>Il prend une petite clef et attend que tu le suives.</p>",
 '<button class="game-btn gold" onclick="episode02EnterArchives()">Le suivre aux archives</button>',
 "LE FRAGMENT EXAMINÉ","Maëlan accepte de t’aider, sans prétendre connaître la réponse.");
}
function episode02AskArchives(){
 ffEpisode02Scene("<p>« Je conserve des copies de pages retirées des archives officielles. Je les ai trouvées dans des lots de papier destinés au recyclage. Du moins, c’est ce que je peux prouver. »</p><p>Il hésite, puis ajoute : « Si votre registre a été amputé, nous trouverons peut-être son écho dans la Salle des Dépôts Incomplets. »</p>",
 '<button class="game-btn gold" onclick="episode02EnterArchives()">Entrer dans la salle interdite</button>',
 "UN COPISTE DES MARGES","Maëlan garde des copies de documents retirés.");
}
function episode02EnterArchives(){
 ffRecord("La Salle des Dépôts Incomplets");ffSetEpisode02State("archives");
 ffEpisode02Scene("<p>La porte résiste avant de céder. Des étagères portent des numéros sans titres. Certaines boîtes sont vides, mais leur poussière montre qu’elles ont été déplacées récemment.</p><p>Un souffle d’air froid traverse la pièce alors que toutes les fenêtres sont condamnées.</p><p>Au fond, une boîte porte le cercle incomplet traversé par une ligne. À l’intérieur : trois feuillets décrivant des lieux éloignés. Leurs noms ont été grattés.</p><p><strong>« …la porte ne fut pas détruite. Elle fut retirée des itinéraires. Ceux qui savaient la trouver reçurent l’ordre de ne plus la nommer. »</strong></p><p>Trois tiroirs portent une couronne, une montagne et une vague. Un quatrième, sans poignée, porte le signe incomplet.</p>",
 '<button class="game-btn gold" onclick="episode02OpenCatalogue()">Examiner les trois feuillets</button>',
 "DÉCOUVERTE : LA SALLE INTERDITE","La Salle des Dépôts Incomplets est ajoutée au Grimoire.");
}
const ffArchiveFragments=[
 {id:"serment",title:"Le Serment des Couronnes",date:"12e jour du mois des Semences · année 214",detail:"Les maisons d’Aurenth jurent de reconnaître les anciennes routes."},
 {id:"fermeture",title:"La Fermeture du Col",date:"3e jour du mois des Brumes · année 267",detail:"Le passage de montagne est déclaré impraticable et retiré des itinéraires."},
 {id:"depart",title:"Le Départ des Navigateurs",date:"19e jour du mois des Marées · année 311",detail:"Des navigateurs quittent le port sans destination inscrite."}
];
let ffArchiveOrder=[];
function episode02OpenCatalogue(){
 ffSetEpisode02State("catalogue",{order:[],hints:0});ffArchiveOrder=[];
 const cards=ffArchiveFragments.map((f,i)=>'<button class="riddle-choice" type="button" onclick="episode02ChooseFragment(\''+f.id+'\')"><strong>'+f.title+'</strong><br><small>'+f.date+'</small></button>').join("");
 ffEpisode02Scene("<p>Maëlan pose les trois feuillets sur une table.</p><p>« Les catalogues rangent ce qui est connu. Les absents ne peuvent être classés qu’à partir de leurs témoins. »</p><p>Les dates sont inscrites au dos. Replace les événements du plus ancien au plus récent. Les marques au revers ne pourront être lues que dans le bon ordre.</p><p><strong>Ordre choisi :</strong> <span id=\"archive-order\">Aucun feuillet</span></p>",
 '<div class="game-riddle archive-riddle">'+cards+'</div><div class="game-actions"><button class="game-btn gold" onclick="episode02CheckOrder()">Vérifier le classement</button><button class="game-btn" onclick="episode02ResetOrder()">Recommencer</button><button class="game-btn" onclick="episode02Hint()">Demander un indice</button></div>',
 "ÉNIGME : LE CATALOGUE DES ABSENTS","Indice : commence par le plus ancien. Les dates au dos donnent l’ordre.");
}
function episode02ChooseFragment(id){
 if(ffArchiveOrder.includes(id)||ffArchiveOrder.length>=3)return;
 ffArchiveOrder.push(id);ffSetEpisode02State("catalogue",{order:ffArchiveOrder,hints:ffEpisode02State().hints||0});
 const names={serment:"Serment des Couronnes",fermeture:"Fermeture du Col",depart:"Départ des Navigateurs"};
 const el=document.getElementById("archive-order");if(el)el.textContent=ffArchiveOrder.map(x=>names[x]).join(" → ");
 const st=document.getElementById("game-status");if(st)st.textContent="FEUILLETS CLASSÉS : "+ffArchiveOrder.length+" / 3";
}
function episode02ResetOrder(){ffArchiveOrder=[];episode02OpenCatalogue();}
function episode02Hint(){
 const s=ffEpisode02State(),n=(s.hints||0)+1;ffSetEpisode02State("catalogue",{order:ffArchiveOrder,hints:n});
 const hints=["Indice 1 : les titres racontent une suite d’événements. Commence par le plus ancien.","Indice 2 : compare les années inscrites au dos des feuillets.","Indice 3 : l’ordre chronologique est 214, puis 267, puis 311."];
 const fb=document.getElementById("game-feedback");if(fb)fb.textContent=hints[Math.min(n-1,2)];
}
function episode02CheckOrder(){
 if(ffArchiveOrder.length!==3){const fb=document.getElementById("game-feedback");if(fb)fb.textContent="Il faut classer les trois feuillets avant de vérifier.";return;}
 const correct=["serment","fermeture","depart"];
 if(ffArchiveOrder.every((v,i)=>v===correct[i])){
  ffSetEpisode02State("keyword",{order:ffArchiveOrder,hints:ffEpisode02State().hints||0});
  ffEpisode02Scene("<p>Les dates s’alignent. Au revers des feuillets, des fragments de lettres apparaissent : <strong>S</strong>, puis <strong>EU</strong>, puis <strong>IL</strong>.</p><p>Réunis dans le bon ordre, ils forment un mot de cinq lettres. Maëlan regarde le tiroir sans poignée.</p><p><em>Quel mot faut-il prononcer ?</em></p><label for=\"episode02-word\">Mot découvert</label><input id=\"episode02-word\" type=\"text\" maxlength=\"12\" autocomplete=\"off\" placeholder=\"Écrire le mot\" style=\"display:block;max-width:320px;width:100%;padding:13px;margin:12px 0;background:#101c2a;border:1px solid rgba(130,223,241,.45);color:#fff;font:600 16px Georgia,serif;\">",
  '<button class="game-btn gold" onclick="episode02CheckWord()">Prononcer le mot</button><button class="game-btn" onclick="episode02Hint()">Relire un indice</button>',
  "CLASSEMENT CORRECT : UN MOT APPARAÎT","Les fragments ont révélé les lettres S · EU · IL.");
 }else{
  const fb=document.getElementById("game-feedback");if(fb)fb.textContent="Les tiroirs restent immobiles. Les dates ne sont pas encore dans le bon ordre. Tu peux recommencer ou demander un indice.";
 }
}
function episode02CheckWord(){
 const input=document.getElementById("episode02-word"),word=(input?.value||"").trim().normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();
 if(word==="SEUIL")episode02OpenDrawer();
 else{const fb=document.getElementById("game-feedback");if(fb)fb.textContent="Le tiroir ne réagit pas. Relis les fragments de lettres au revers des feuillets.";}
}
function episode02OpenDrawer(){
 ffRecord("Le mot SEUIL");ffRecord("L’empreinte de cire bleue");ffSetEpisode02State("opened");
 ffEpisode02Scene("<p>Un déclic sec résonne sous la table. Le tiroir sans poignée s’ouvre de quelques centimètres.</p><p>Il ne contient pas de livre, seulement une empreinte de cire bleue marquée du Signe sans royaume.</p><p>Maëlan pâlit. « J’ai déjà vu cette cire. Sur un document daté de plusieurs siècles après la fermeture supposée de ces archives. »</p><p>Il sort une copie d’un registre de navigation d’Orvane. Le document mentionne une traversée depuis une île qui n’apparaît sur aucune carte actuelle.</p>",
 '<button class="game-btn gold" onclick="episode02ReadDocument()">Examiner le registre de navigation</button>',
 "LE TIROIR SANS POIGNÉE S’OUVRE","Le mot SEUIL et l’empreinte de cire bleue sont inscrits au Grimoire.");
}
function episode02ReadDocument(){
 ffRecord("La référence à l’île absente");ffSetEpisode02State("document");
 ffEpisode02Scene("<p>La date du voyage est postérieure à celle à laquelle cette île aurait été déclarée inexistante.</p><p>Maëlan relit deux fois la ligne, puis repose le document.</p><p><strong>« Soit quelqu’un a falsifié ces dates. Soit nous avons classé les événements dans le mauvais ordre. Et je ne sais pas laquelle de ces possibilités me plaît le moins. »</strong></p><p>Un bruit léger se fait entendre entre deux rangées. Une silhouette passe derrière les étagères. Vous vous séparez pour vérifier.</p>",
 '<button class="game-btn gold" onclick="episode02FollowWhisper()">Suivre le bruit entre les rayonnages</button>',
 "DOCUMENT IMPOSSIBLE : UNE ÎLE ABSENTE","La référence à l’île absente rejoint ton Grimoire.");
}
function episode02FollowWhisper(){
 ffSetEpisode02State("whisper");
 ffEpisode02Scene("<p>Sur une table, un livre est ouvert à une page entièrement blanche. Une petite lueur bleue flotte au-dessus de l’encre sèche.</p><p>Peu à peu, une écriture apparaît :</p><p><strong>« Ne cherchez pas la page manquante. Cherchez qui a appris au monde à l’oublier. »</strong></p><p>Maëlan revient, mais n’a pas vu la silhouette. Il propose de consulter les cartes de navigation conservées à Orvane. Il avertit que les Ligues n’aiment pas qu’on pose des questions sur les îles absentes.</p>",
 '<button class="game-btn gold" onclick="episode02Finish()">Inscrire les découvertes au Grimoire</button>',
 "UNE PRÉSENCE ENTRE LES RAYONNAGES","Le message bleu ne confirme pas qui l’a laissé. Le mystère demeure.");
}
function episode02Finish(){
 ffRecord("Maëlan, copiste des marges");ffRecord("La Salle des Dépôts Incomplets");ffRecord("L’empreinte de cire bleue");ffRecord("La référence à l’île absente");ffRecord("Le mot SEUIL");ffRecord("Piste vers les Îles d’Orvane");
 ffSetEpisode02State("complete");
 ffEpisode02Scene("<p>Le fragment de Valombre se superpose brièvement au tracé d’une carte maritime. Une zone vide apparaît entre deux routes commerciales.</p><p>Une terre peut disparaître d’une carte. Mais qui peut faire disparaître le souvenir d’une terre ?</p><p><strong>Prochaine destination : les Îles d’Orvane.</strong> Les cartes de navigation y attendent peut-être une réponse — ou une nouvelle contradiction.</p><p><em>Fin de l’épisode 02 — Les archives qui respirent.</em></p>",
 '<button class="game-btn gold" onclick="location.href=\'grimoire.html\'">Consulter le Grimoire</button><button class="game-btn" onclick="location.href=\'atlas.html\'">Explorer l’Atlas</button>',
 "ÉPISODE 02 TERMINÉ · PISTE VERS ORVANE","Toutes les découvertes de Hauterive ont été enregistrées sur cet appareil.");
}
function restoreEpisode02(){
 const s=ffEpisode02State();ffArchiveOrder=s.order||[];
 switch(s.stage){
  case "plaque":episode02InspectPlaque();break;
  case "maelan":episode02FindMaelan();break;
  case "archives":episode02EnterArchives();break;
  case "catalogue":episode02OpenCatalogue();if(ffArchiveOrder.length){const names={serment:"Serment des Couronnes",fermeture:"Fermeture du Col",depart:"Départ des Navigateurs"};const el=document.getElementById("archive-order");if(el)el.textContent=ffArchiveOrder.map(x=>names[x]).join(" → ");}break;
  case "keyword":episode02CheckOrderAfterRestore();break;
  case "opened":episode02OpenDrawer();break;
  case "document":episode02ReadDocument();break;
  case "whisper":episode02FollowWhisper();break;
  case "complete":episode02Finish();break;
  default:episode02Start();
 }
}
function episode02CheckOrderAfterRestore(){
 ffArchiveOrder=ffEpisode02State().order||[];
 ffEpisode02Scene("<p>Les dates sont classées. Au revers des feuillets, les fragments de lettres apparaissent : <strong>S · EU · IL</strong>.</p><p>Quel mot de cinq lettres forment-ils ?</p><label for=\"episode02-word\">Mot découvert</label><input id=\"episode02-word\" type=\"text\" maxlength=\"12\" placeholder=\"Écrire le mot\" style=\"display:block;max-width:320px;width:100%;padding:13px;margin:12px 0;background:#101c2a;border:1px solid rgba(130,223,241,.45);color:#fff;font:600 16px Georgia,serif;\">",
 '<button class="game-btn gold" onclick="episode02CheckWord()">Prononcer le mot</button>',
 "LE MOT ATTEND DERRIÈRE LES LETTRES","Tu peux reprendre ici sans perdre le classement.");
}
function resetEpisode02(){
 if(!confirm("Recommencer l’épisode 02 ? Les découvertes déjà inscrites au Grimoire seront conservées."))return;
 const data=ffLoad();delete data.episode02;ffSave(data);location.reload();
}

const grimoireCatalog=[
 {name:"Le Signe sans royaume",art:"sigil",type:"SYMBOLE",desc:"Un cercle incomplet traversé par une ligne verticale.",detail:"Le signe a été pressé dans la fibre d'une toile ancienne. Il ne porte le blason d'aucune dynastie connue. Pourtant, certains témoins le reconnaissent et préfèrent se taire.",note:"Un signe sans royaume… ou le souvenir d'un royaume que les cartes ont effacé ?",origin:"Valombre · Première observation",lockHint:'Une marque que personne ne revendique. Pourtant, elle est reconnue.'},
 {name:"Le Registre sans nom",art:"book",type:"RELIQUE",desc:"Un registre ancien dont plusieurs pages ont été arrachées.",detail:"La reliure est usée par l'humidité et le temps. Les pages manquantes ont été retirées avec soin, comme si quelqu'un avait voulu effacer non pas un récit, mais les preuves de son existence.",note:"Nul ne consigna le lieu qui manquait.",origin:"Valombre · La ruelle des copistes",lockHint:'Un livre mutilé. Quelqu’un a voulu faire disparaître une trace.'},
 {name:"Fragment de carte inconnu",art:"map",type:"FRAGMENT",desc:"Une côte dessinée, puis une ligne de points qui s'interrompt en mer.",detail:"Le fragment ne porte ni nom de port ni indication de latitude. La ligne de points s'arrête au milieu de l'eau, sans rejoindre aucune terre répertoriée. Le papier semble plus ancien que les frontières actuelles.",note:"Une route peut-elle conduire à un lieu qui n'apparaît sur aucune carte ?",origin:"Découvert dans la reliure du registre",lockHint:'Une route s’interrompt là où aucune terre ne devrait manquer.'},
 {name:"Énigme du disque résolue",art:"disk",type:"ÉNIGME",desc:"Le disque de cuivre a révélé son mécanisme.",detail:"Trois symboles étaient gravés sur le disque : une couronne, une montagne et une vague. Leur ordre a libéré un compartiment dissimulé dans la reliure. Le mécanisme n'était pas un verrou ordinaire : il répondait à une suite de sens.",note:"Règne · demeure · passe.",origin:"Valombre · Le Registre sans nom",lockHint:'Trois signes, un ordre. Le mécanisme attend encore son témoin.'},
 {name:"Première rencontre avec le Veilleur",art:"watcher",type:"RENCONTRE",desc:"Une silhouette au manteau sombre et une lueur bleue.",detail:"Au bout de la ruelle, une silhouette immobile apparaît. Son visage demeure caché. Une faible lueur bleue flotte près de son épaule. Lorsque le regard se détourne un instant, il n'y a déjà plus personne.",note:"Je ne garde pas la porte. Je garde le souvenir de ceux qui l'ont franchie.",origin:"Valombre · Après l'ouverture du disque",lockHint:'Une silhouette apparaît parfois là où les souvenirs se dérobent.'},
 {name:"Piste vers Hauterive",art:"path",type:"DESTINATION",desc:"Hauterive conserve ce que Valombre oublie.",detail:"La phrase laissée sur la pierre désigne Hauterive, ville d'archives et de copistes. Si quelqu'un a conservé la trace du lieu absent, ce pourrait être dans ses dépôts, ses registres ou ses marges oubliées.",note:"Hauterive conserve ce que Valombre oublie.",origin:"Indice laissé à Valombre",lockHint:'Une phrase désigne une ville où les archives ont de longues mémoires.'},
 {name:"Le copiste de Valombre",art:"book",type:"TÉMOIN",desc:"Un témoin a reconnu le symbole et en connaît la crainte.",detail:"Le vieux copiste n'a pas expliqué ce qu'il savait. À la vue du signe, son visage s'est fermé. Il a conseillé de prendre le paquet et de ne le montrer à personne avant d'en comprendre le contenu.",note:"Ne prononcez pas ce nom ici.",origin:"Valombre · La porte voisine",lockHint:'Un témoin s’est tu devant un symbole qu’il connaissait.'},
 {name:"Maëlan, copiste des marges",art:"quill",type:"PERSONNAGE",desc:"Un copiste prudent qui conserve les pages retirées des archives.",detail:"Maëlan travaille dans une salle secondaire de Hauterive. Il préfère les documents abîmés aux manuscrits prestigieux et possède une mémoire remarquable des textes. Il ne croit pas aux légendes, mais sait reconnaître une falsification.",note:"Les archives ne mentent pas toujours. Mais elles savent très bien se taire.",origin:"Hauterive · Salle des copistes",lockHint:'Un homme préfère les pages que les archives ont rejetées.'},
 {name:"La Salle des Dépôts Incomplets",art:"book",type:"LIEU",desc:"Une salle fermée depuis plusieurs années, absente des parcours officiels.",detail:"Des étagères portent des numéros sans titres. Certaines boîtes sont vides, mais la poussière indique qu'elles ont été déplacées récemment. Un souffle froid traverse la pièce alors que toutes les fenêtres sont condamnées.",note:"Les absents ont parfois une place réservée.",origin:"Hauterive · Archives secondaires",lockHint:'Une salle fermée, des boîtes déplacées et un courant d’air sans fenêtre.'},
 {name:"L’empreinte de cire bleue",art:"disk",type:"RELIQUE",desc:"Une empreinte marquée du Signe sans royaume.",detail:"Le tiroir sans poignée s'est ouvert après la résolution du catalogue. Il ne contenait aucun livre, seulement une empreinte de cire bleue portant le cercle incomplet traversé d'une ligne. Maëlan affirme avoir déjà vu cette cire sur un document bien plus récent.",note:"La même marque traverse des dates qui ne devraient pas se rencontrer.",origin:"Hauterive · Le tiroir sans poignée",lockHint:'Une cire bleue porte le signe aperçu à Valombre.'},
 {name:"La référence à l’île absente",art:"map",type:"DOCUMENT",desc:"Un registre de navigation mentionne une île après sa disparition officielle.",detail:"Une copie d'un registre maritime d'Orvane décrit une traversée depuis une île qui n'apparaît sur aucune carte actuelle. La date du voyage est postérieure à celle où cette île aurait été déclarée inexistante. Maëlan hésite entre falsification et chronologie erronée.",note:"Soit quelqu'un a falsifié ces dates. Soit nous avons classé les événements dans le mauvais ordre.",origin:"Hauterive · Registre de navigation d’Orvane",lockHint:'Un document parle d’une île après la date de sa disparition.'},
 {name:"Le mot SEUIL",art:"sigil",type:"MOT-CLEF",desc:"Cinq lettres révélées par le classement des feuillets.",detail:"Les trois fragments, replacés dans leur ordre chronologique, ont révélé des marques au revers. Réunies, elles forment le mot SEUIL. Le tiroir sans poignée a répondu à ce mot, comme s'il attendait depuis longtemps qu'on le prononce.",note:"La porte ne fut pas détruite. Elle fut retirée des itinéraires.",origin:"Hauterive · Catalogue des absents",lockHint:'Trois fragments, plusieurs dates et un mot à reconstituer.'},
 {name:"Piste vers les Îles d’Orvane",art:"path",type:"DESTINATION",desc:"Les cartes de navigation pourraient conserver la trace de l’île absente.",detail:"Maëlan propose de consulter les cartes de navigation conservées à Orvane. Les Ligues n'aiment pas qu'on pose des questions sur les îles absentes. Dans le Grimoire, le fragment de Valombre semble brièvement se superposer au tracé d'une carte maritime.",note:"Une terre peut disparaître d'une carte. Mais qui peut faire disparaître le souvenir d'une terre ?",origin:"Hauterive · Fin de l’épisode 02",lockHint:'Une route maritime attend au-delà des archives.'}
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
 const episodeOneNames=grimoireCatalog.slice(0,7).map(x=>x.name);
 const episodeOneCount=episodeOneNames.filter(name=>found.includes(name)).length;
 const pct=Math.round(episodeOneCount/7*100);
 const countEl=document.getElementById("grimoire-count");if(countEl)countEl.textContent=count;
 const ep=document.getElementById("grimoire-episode");if(ep)ep.textContent=pct+"%";
 const dest=document.getElementById("grimoire-destination");
 if(dest)dest.textContent=found.includes("Piste vers les Îles d’Orvane")?"ORVANE":(found.includes("Piste vers Hauterive")?"HAUTERIVE":"À DÉCOUVRIR");
 const bar=document.getElementById("grimoire-progress-bar");if(bar)bar.style.width=pct+"%";
 const label=document.getElementById("grimoire-progress-label");
 if(label)label.textContent=episodeOneCount+" / 7 PAGES · ÉPISODE 01";
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

window.addEventListener("DOMContentLoaded",function(){if(document.getElementById("game-scene"))restoreEpisode();});

window.addEventListener("DOMContentLoaded",function(){if(document.getElementById("episode02-scene")){episode02Start();}});
