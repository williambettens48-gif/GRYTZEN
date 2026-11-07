/* GRYTZEN — VOLET I : LE REGISTRE SANS NOM — version longue */
(function(){
"use strict";
const KEY="feufollet_grimoire_v1";
const orderStages=["prologue","letter","envelope","coin","riddle1","cipher","arrival","streetmap","door","threshold","workshop","riddle2","shelves","hidden","parchment","decision","revelation","finaldeduction","ending"];
const labels={prologue:"PROLOGUE",letter:"LA LETTRE",envelope:"L'ENVELOPPE",coin:"LA PIÈCE AUX SIX CERCLES",riddle1:"PREMIÈRE ÉPREUVE",cipher:"LE CODE EFFACÉ",arrival:"L'ANCIENNE BOUTIQUE",streetmap:"LA RUELLE PERDUE",door:"LA PORTE SCELLÉE",threshold:"LES MARQUES DU SEUIL",workshop:"LA SALLE DES RELIURES",riddle2:"SECONDE ÉPREUVE",shelves:"LES RELIURES MUETTES",hidden:"LE COMPARTIMENT",parchment:"LE PARCHEMIN PLIÉ",decision:"LE CHOIX DU TÉMOIN",revelation:"LA FLAMME BLEUE",finaldeduction:"LA DERNIÈRE DÉDUCTION",ending:"FIN DU CHAPITRE I"};
const $=id=>document.getElementById(id);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
function state(){let d=load(),old=d.episode01Long;if(!old)return {stage:"prologue",storyVersion:2,choices:[],hints:{},answers:{}};if(old.storyVersion!==2){let migrated={stage:"prologue",storyVersion:2,choices:old.choices||[],hints:{},answers:{}};d.episode01Long=migrated;save(d);return migrated;}return old}
function record(n){if(typeof window.ffRecord==="function")window.ffRecord(n)}
function norm(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ")}
function set(patch){let d=load();d.episode01Long={...state(),...patch,storyVersion:2};save(d);render()}
function btn(t,fn,g=true){return `<button class="game-btn ${g?"gold":""}" type="button" onclick="${fn}">${t}</button>`}
function input(id,ph){return `<input class="puzzle-input" id="${id}" maxlength="40" autocomplete="off" placeholder="${ph}">`}
function show(title,body,buttons,status,feedback){
 $("scene-title").textContent=title;$("game-scene").innerHTML=body;$("game-controls").innerHTML=buttons||"";
 $("game-status").textContent=status||"PROGRESSION ENREGISTRÉE";$("game-feedback").textContent=feedback||"";
 let s=state(),i=Math.max(0,orderStages.indexOf(s.stage)),p=Math.round(i/(orderStages.length-1)*100);
 $("episode-progress").textContent=(labels[s.stage]||"PROLOGUE")+" · "+p+"%";$("episode-progress-bar").style.width=p+"%";
}
function next(stage,choice){let s=state(),d=load();d.episode01Long={...s,storyVersion:2,stage,choices:choice?[...(s.choices||[]),choice]:(s.choices||[])};save(d);
 if(stage==="coin")record("Le Signe sans royaume");
 if(stage==="arrival")record("Le Registre sans nom");
 if(stage==="hidden")record("Fragment de carte inconnu");
 if(stage==="ending"){record("Première rencontre avec le Veilleur");record("Piste vers Hauterive");}
 render()}
window.longNext=next;
function render(){let s=state();
switch(s.stage){
case"prologue":show("La lettre qui n'aurait jamais dû arriver",`<div class="chapter-label">PROLOGUE · LA DERNIÈRE CHANDELLE</div>
<p>La pluie tombait depuis trois jours. Dans les terres du nord, les habitants avaient appris à ne plus compter les heures. Le soleil avait disparu derrière une épaisse couche de nuages et les routes étaient devenues des rivières de boue.</p>
<p>À plusieurs lieues de toute grande cité, dans une auberge appelée <em>La Dernière Chandelle</em>, un vieil homme attendait. Il n'avait presque rien commandé depuis son arrivée : une soupe froide, un morceau de pain et une chambre qu'il n'avait jamais occupée.</p>
<p>Chaque soir, il posait la même question à l'aubergiste : « Quelqu'un a-t-il demandé après moi ? » Et chaque soir, la réponse était la même : « Personne, vieil homme. »</p>
<p>Mais cette nuit-là, un cavalier arriva au galop. Son cheval était épuisé. Sa cape était déchirée et ses mains couvertes de sang séché. Il entra sans saluer personne.</p><blockquote>— Vous êtes encore vivant…<br>— Cela dépend de qui pose la question.</blockquote>
<p>Le cavalier déposa une petite boîte de bois sur la table. « Elle était cachée sous les fondations. » — « Où ? » — « À Valombre. »</p>
<p>Le vieil homme blêmit. « Ce village n'existe pas. » Le cavalier répondit : « C'est justement ce que nous pensions. Mais quelqu'un y a rallumé les cloches. »</p>
<p>La boîte s'ouvrit. Elle contenait une page : <strong>« Le premier nom a été rendu. Il en reste six. »</strong> Sous la phrase, un symbole : une flamme bleue traversée par trois lignes.</p><blockquote>— Ils ont commencé…</blockquote><p>La chandelle s'éteignit. Et, très loin de l'auberge, quelqu'un venait de recevoir une lettre.</p>`,
btn("Poursuivre","longNext('letter')"),"LE RÉCIT COMMENCE","Valombre vient d'être nommé. Pourtant, ce village n'existe sur aucune carte connue.");break;
case"letter":show("Celui qui reçoit l'inconnu",`<div class="chapter-label">CHAPITRE I · UN MESSAGE SANS SIGNATURE</div>
<p>Tu n'avais aucune raison de croire que cette journée serait différente des autres. Pourtant, en rentrant chez toi, tu découvris une enveloppe glissée sous ta porte.</p>
<p>Aucun sceau royal. Aucun nom d'expéditeur. Seulement ton nom, écrit à l'encre noire.</p>
<p>À l'intérieur : une feuille jaunie portant une adresse, une petite pièce métallique frappée d'un symbole inconnu et un billet.</p><blockquote>« Si tu souhaites connaître la vérité, ne demande jamais ton chemin à quelqu'un qui connaît déjà la destination. »</blockquote>
<p>L'adresse indiquait une ancienne boutique de reliure, fermée depuis des décennies. Au bas de la feuille, une date avait été grattée. On distinguait encore la trace de six chiffres, mais aucun n'était entier.</p><p>Tu retournes le billet. Une seconde phrase apparaît sous la lumière : <strong>« Le souvenir précède le nom. »</strong></p>`,
btn("Examiner l'enveloppe et ses traces","longNext('envelope')"),"INDICE : UNE ADRESSE ET UNE PIÈCE","Le billet contient deux avertissements. L'un concerne les noms, l'autre les chemins.");break;
case"envelope":show("L'enveloppe porte une seconde écriture",`<div class="chapter-label">ÉPREUVE 01 · EXAMEN MATÉRIEL</div>
<p>Tu approches l'enveloppe de la chandelle sans toucher le papier. Une marque en creux apparaît sous l'adresse. Le cachet a été retiré, mais sa pression a laissé une empreinte dans les fibres.</p>
<p>Tu distingues trois couches d'écriture : l'adresse visible, les chiffres grattés au bas de la feuille et une phrase presque invisible au verso. Le relieur a pris soin de ne rien signer.</p>
<p>Sur le rabat, six petites encoches sont disposées autour d'une empreinte ronde. Aucune n'est décorative : elles correspondent exactement aux marques de la pièce jointe.</p>
<p><strong>Question :</strong> combien d'encoches entourent l'empreinte centrale ? Saisis le nombre en lettres.</p>${input("long-envelope-answer","Nombre en lettres…")}
<p class="game-note">Ne compte pas l'empreinte centrale. Seules les encoches autour d'elle sont concernées.</p>`,
btn("Valider l'observation","longCheckEnvelope()")+btn("Indice","longHint(3)",false),"ÉPREUVE : COMPTER SANS CONFONDRE","Une observation précise est nécessaire avant d'étudier la pièce.");break;
case"coin":show("La pièce aux six cercles",`<div class="chapter-label">OBJET À EXAMINER · OBSERVATION</div>
<p>La pièce est plus lourde qu'elle n'en a l'air. Sur une face, un arbre sans feuilles. Sur l'autre, six petits cercles entourent un cercle central. Aucun chiffre, aucune devise, aucun profil de souverain.</p><figure class="clue-illustration"><img src="assets/enigmes/piece-six-cercles.svg" alt="Croquis des deux faces de la pièce : arbre sans feuilles et six cercles autour d’un point central"><figcaption>Pièce retrouvée dans la lettre — observe les deux faces et la disposition des cercles.</figcaption></figure>
<p>Tu la fais pivoter près de la fenêtre. Une inscription apparaît sur la tranche : <strong>« Le souvenir précède le nom. »</strong></p>
<p>Tu remarques que les six cercles extérieurs ne sont pas identiques : l'un est légèrement plus profond que les autres. Le cercle central porte une petite entaille tournée vers le bord le plus marqué. La pièce semble être un mécanisme, pas une monnaie.</p>`,
btn("Chercher comment activer la pièce","longNext('riddle1')")+btn("Revenir à la lettre","longNext('letter')",false),"OBSERVATION : SIX CERCLES ET UN CENTRE","Retiens la disposition : six marques autour d'un point central.");break;
case"riddle1":show("Première épreuve — Le souvenir avant le nom",`<div class="chapter-label">ÉNIGME 01 · RÉPONSE À SAISIR</div>
<figure class="clue-illustration"><img src="assets/enigmes/piece-six-cercles.svg" alt="Détail de la pièce aux six cercles entourant un cercle central"><figcaption>Le croquis du mécanisme — le point central est le seul élément entouré par les six marques.</figcaption></figure><p>Tu poses la pièce sur la lettre. Les six cercles extérieurs se superposent aux six marques grattées au bas de l'adresse. Le cercle central recouvre exactement l'emplacement d'un mot qui a été effacé.</p>
<p>Le billet disait : « Le souvenir précède le nom. » Le cercle central est le seul qui ne représente ni une direction ni un lieu. C'est le point à partir duquel les six autres marques semblent avoir été disposées.</p>
<p><strong>Question :</strong> quel élément faut-il consulter en premier pour retrouver le nom effacé ? Saisis le mot qui désigne ce point de départ.</p>${input("long-answer-1","Écrire le mot…")}<p class="game-note">Indice disponible : le mot désigne le milieu d'un ensemble.</p>`,
btn("Valider ma réponse","longCheck1()")+btn("Demander l'indice","longHint(1)",false),"ÉNIGME : LE POINT DE DÉPART","Il faut interpréter la disposition, pas deviner un nom de royaume.");break;
case"cipher":show("Le code des six absences",`<div class="chapter-label">ÉNIGME 02 · DÉDUCTION NUMÉRIQUE</div>
<p>Le centre de la pièce s'aligne sur le mot effacé. Les six cercles extérieurs se placent chacun face à une encoche de l'enveloppe. Au dos du billet, tu découvres une phrase supplémentaire : « Le centre n'est pas une absence. Il est le compte de celles qui l'entourent, augmenté de lui-même. »</p>
<p>Un ancien copiste a ajouté cette note : « N'inscris jamais le nombre des portes ; inscris celui des positions, même si l'une reste vide. »</p>
<p>Tu dois donc compter l'ensemble du mécanisme, sans oublier son centre.</p>
<p><strong>Question :</strong> quel nombre total de positions la pièce représente-t-elle ?</p>${input("long-cipher-answer","Nombre…")}
<p class="game-note">Indice : six marques extérieures et une position centrale.</p>`,
btn("Valider le nombre","longCheckCipher()")+btn("Indice","longHint(4)",false),"ÉNIGME : LES POSITIONS","Cette réponse servira à comprendre le plan de la ruelle.");break;
case"arrival":show("La boutique aux volets clos",`<div class="chapter-label">SCÈNE II · L'ADRESSE</div>
<p>La rue indiquée sur la lettre n'apparaît plus sur les plans récents. Après avoir traversé un quartier de maisons étroites, tu trouves pourtant une plaque de pierre dont les lettres ont été polies par le temps : <strong>Ruelle des Relieurs</strong>.</p>
<p>Au bout, une boutique aux volets clos se tient entre un atelier de serrurerie et une maison condamnée. Derrière la vitrine poussiéreuse, des reliures sont empilées par taille, toutes tournées de façon à cacher leur tranche.</p>
<p>Tu frappes. Aucun bruit. Pourtant, une lueur se déplace derrière le volet du haut.</p>
<p>Sur la porte, trois marques : une couronne, une montagne et une vague. Sous elles : <strong>« Ce qui règne n'est pas toujours ce qui demeure. »</strong></p>`,
btn("Étudier le plan de la ruelle","longNext('streetmap')"),"LIEU REPÉRÉ : RUELLE DES RELIEURS","La boutique est bien réelle. Quelqu'un semble pourtant savoir que tu arrives.");break;
case"streetmap":show("Le plan qui ne montre pas la rue",`<div class="chapter-label">ÉNIGME 03 · LECTURE D'UN PLAN</div>
<p>À l'angle de la rue, une plaque de cuivre présente un plan ancien. Trois voies y figurent : la rue du Pont, la venelle des Tanneurs et la ruelle des Relieurs. Pourtant, une quatrième ligne a été grattée.</p><figure class="clue-illustration"><img src="assets/enigmes/plan-ruelle.svg" alt="Plan ancien montrant les trois voies, un atelier de serrurerie et une maison murée"><figcaption>Plan retrouvé à l’angle du quartier — observe la voie qui passe entre les deux bâtiments signalés.</figcaption></figure>
<p>Le plan porte cette légende : « Le chemin recherché n'est ni le plus large, ni celui qui rejoint l'eau. Il se trouve entre l'atelier qui ferme les passages et la maison dont les fenêtres sont murées. »</p>
<p>Tu te souviens de la description de la boutique : elle se tient entre un atelier de serrurerie et une maison condamnée. Le plan permet de retrouver le nom de la voie, mais il faut distinguer la rue de ses voisines.</p>
<p><strong>Question :</strong> quel nom complet porte la ruelle où se trouve la boutique ?</p>${input("long-street-answer","Nom de la voie…")}
<p class="game-note">La réponse figure déjà dans le récit, mais il faut la retrouver sans confondre les trois voies.</p>`,
btn("Valider le nom de la voie","longCheckStreet()")+btn("Indice","longHint(5)",false),"ÉNIGME : RETROUVER LA BONNE VOIE","Une adresse exacte est nécessaire pour que la boutique apparaisse.");break;
case"door":show("La porte aux trois marques",`<div class="chapter-label">OBSERVATION · LES TRACES DU SERRURIER</div>
<p>La couronne est polie au centre, comme si elle avait été touchée des milliers de fois. La montagne porte trois entailles parallèles. La vague est intacte, mais une fine poussière bleue s'est logée dans son creux.</p><figure class="clue-illustration"><img src="assets/enigmes/trois-marques.svg" alt="Trois plaques : couronne polie, montagne aux trois entailles et vague contenant une poussière bleue"><figcaption>Les trois marques de la porte — chaque détail correspond à la description du relieur.</figcaption></figure>
<p>La poignée n'est pas usée. En revanche, le seuil est profondément marqué du côté intérieur, comme si des caisses lourdes avaient été traînées vers la rue.</p><blockquote>« Si tu viens pour le registre, tu arrives trop tôt. Si tu viens pour la pièce, tu arrives trop tard. »</blockquote>
<p>La voix se tait. Un petit volet s'ouvre à hauteur des yeux.</p>`,
btn("Examiner les marques du seuil","longNext('threshold')"),"UN TÉMOIN DERRIÈRE LA PORTE","Le témoin connaît la pièce, mais semble craindre le registre.");break;
case"threshold":show("Les marques du seuil",`<div class="chapter-label">ÉNIGME 04 · DÉDUCTION PAR ÉLIMINATION</div>
<p>Le petit volet de la porte s'ouvre. Une voix te demande de nommer la marque qui représente ce qui demeure lorsque les puissants disparaissent.</p>
<p>Tu reprends les observations : la couronne est polie par des mains nombreuses, la montagne porte trois entailles, la vague est intacte mais garde de la poussière bleue. Sur le bois, une phrase a été gravée : « Le pouvoir se transmet, la pierre endure, l'eau emporte. »</p>
<p>La voix ajoute : « Ne choisis pas ce qui attire le regard. Choisis ce qui reste quand le reste a changé. »</p>
<p><strong>Question :</strong> quel symbole désigne ce qui demeure ?</p>${input("long-threshold-answer","Nom du symbole…")}
<p class="game-note">Il ne s'agit ni du pouvoir ni du mouvement.</p>`,
btn("Donner ma réponse","longCheckThreshold()")+btn("Indice","longHint(6)",false),"ÉNIGME : CE QUI DEMEURE","Le relieur n'ouvrira la porte qu'à quelqu'un qui sait lire ses signes.");break;
case"workshop":show("La salle des reliures",`<div class="chapter-label">SCÈNE III · RENCONTRE</div>
<p>La porte s'entrouvre enfin. Un homme âgé, les doigts tachés d'encre et de colle, t'observe sans te laisser entrer tout de suite. Il se nomme simplement <strong>le relieur</strong>. Il ne donne pas son prénom.</p>
<p>À la vue de la pièce, il recule d'un pas. « Je croyais qu'ils avaient repris toutes les copies. Cette marque ne doit pas être montrée à la lumière. »</p>
<p>Il reconnaît l'écriture de la lettre, mais refuse d'en prononcer le nom. Une boîte a été cachée dans l'atelier avant la fermeture de la boutique. Depuis, trois personnes sont venues la chercher. Aucune n'a donné la même raison.</p>
<p>Il accepte de te conduire à l'établi, à une condition : tu devras prouver que tu as compris la phrase gravée sur la porte.</p><blockquote>« Ce qui règne n'est pas toujours ce qui demeure. Ce qui demeure n'est pas toujours ce qui passe. »</blockquote>`,
btn("Étudier la phrase et les marques","longNext('riddle2')")+btn("L'interroger sur Valombre","longNext('riddle2','valombre')",false),"RENCONTRE : LE RELIEUR","Il ne fait pas confiance à la pièce. Il teste ta capacité à relier les indices.");break;
case"riddle2":{let a=(s.answers&&s.answers.order)||[];show("Seconde épreuve — Les trois marques",`<div class="chapter-label">ÉNIGME 02 · ORDRE LOGIQUE</div>
<p>Sur l'établi, trois petites plaques sont posées dans le désordre : une couronne, une montagne et une vague. Le relieur répète les verbes gravés : <strong>règne · demeure · passe</strong>.</p><figure class="clue-illustration"><img src="assets/enigmes/trois-marques.svg" alt="Croquis des trois plaques de la couronne, de la montagne et de la vague"><figcaption>Étudie les trois plaques avant de les placer dans l’ordre logique.</figcaption></figure>
<p>Une note précise : « La couronne peut régner sans demeurer. La montagne demeure quand les couronnes passent. La vague passe sans jamais régner. »</p>
<p>Choisis les trois symboles dans l'ordre correspondant aux verbes. Tu peux recommencer sans pénalité.</p>
<div class="choice-grid"><button class="game-btn" type="button" onclick="longPick('couronne')">♛ Couronne</button><button class="game-btn" type="button" onclick="longPick('montagne')">⌃ Montagne</button><button class="game-btn" type="button" onclick="longPick('vague')">≈ Vague</button></div>
<p><strong>Ton ordre :</strong> <span id="long-order">${a.join(" → ")||"Aucun symbole"}</span></p>`,
btn("Vérifier l'ordre","longCheck2()")+btn("Effacer et recommencer","longClearOrder()",false)+btn("Indice","longHint(2)",false),"ÉNIGME : RÈGNE · DEMEURE · PASSE","Les phrases du relieur donnent une propriété à chaque symbole.");break}
case"shelves":show("Les reliures muettes",`<div class="chapter-label">ÉNIGME 05 · ORDRE ET RECoupement</div>
<p>Le relieur te conduit devant trois rayonnages. Chaque livre porte un symbole sur sa tranche : une couronne, une montagne ou une vague. Les livres ont été rangés dans un ordre qui ne correspond ni à l'alphabet ni à leur taille.</p><figure class="clue-illustration"><img src="assets/enigmes/rayonnage-reliures.svg" alt="Trois livres portant une couronne, une montagne et une vague"><figcaption>Les trois reliures trouvées sur l’étagère — leurs symboles correspondent aux plaques de la porte.</figcaption></figure>
<p>Une fiche de classement indique : « Le livre de la vague vient après celui de la montagne. Le livre de la couronne n'est pas le premier. Le volume le plus ancien est placé avant le livre de la vague. »</p>
<p>Sur une seconde fiche, une annotation précise : « La montagne est le volume le plus ancien. »</p>
<p><strong>Question :</strong> quel symbole doit donc apparaître en deuxième position ?</p>${input("long-shelf-answer","Symbole…")}
<p class="game-note">Commence par placer le plus ancien, puis applique les deux autres indications.</p>`,
btn("Valider l'ordre des reliures","longCheckShelves()")+btn("Indice","longHint(7)",false),"ÉNIGME : LE RAYON DANS LE BON ORDRE","La bonne reliure contient la clé du compartiment.");break;
case"hidden":show("Le compartiment sous l'établi",`<div class="chapter-label">SCÈNE IV · CE QUI ÉTAIT CACHÉ</div>
<p>Les trois plaques s'enfoncent dans leurs logements. Un bruit sec résonne sous l'établi. Une planche glisse, révélant un compartiment étroit enveloppé de toile huilée.</p>
<p>À l'intérieur : une page de registre, une clé sans dents et une bande de parchemin pliée en six. La page porte une liste de lieux. Cinq noms sont rayés. Le sixième a été remplacé par une simple ligne.</p>
<p>Au bas du document : <strong>« Le premier nom a été rendu. Il en reste six. Ne cherchez pas le village sur une carte : cherchez ce qui manque à la carte. »</strong></p>
<p>Le relieur s'assied. Pour la première fois, il semble véritablement inquiet.</p>`,
btn("Étudier le parchemin plié","longNext('parchment')"),"DÉCOUVERTE : LE REGISTRE","Une page ancienne et une clé sans dents sont retrouvées.");break;
case"parchment":show("Le parchemin plié en six",`<div class="chapter-label">ÉNIGME 06 · MESSAGE À RECONSTITUER</div>
<p>La bande de parchemin comporte six volets. Sur chacun, un fragment de phrase a été écrit dans une encre différente. Le relieur t'interdit de les lire au hasard : « L'ordre n'est pas celui du pliage, mais celui du voyage. »</p>
<p>Les fragments lisibles sont : <strong>LE VILLAGE</strong> · <strong>N'A PAS</strong> · <strong>DISPARU</strong> · <strong>SEUL</strong> · <strong>LE CHEMIN</strong> · <strong>A ÉTÉ RETIRÉ</strong>.</p>
<p>Une petite rose des vents est dessinée au revers. Elle montre une route qui part du nord, descend vers le sud, puis s'interrompt avant d'atteindre la côte. La phrase doit désigner ce qui a été effacé, pas ce qui subsiste.</p>
<p><strong>Question :</strong> quel élément a été retiré selon le message ?</p>${input("long-parchment-answer","Élément effacé…")}
<p class="game-note">La réponse est formée par deux mots qui apparaissent ensemble sur les fragments.</p>`,
btn("Valider le message","longCheckParchment()")+btn("Indice","longHint(8)",false),"ÉNIGME : LE MESSAGE CACHÉ","Tu dois comprendre le sens des fragments, pas seulement les réciter.");break;
case"decision":show("Le choix du témoin",`<div class="chapter-label">SCÈNE V · CONFIANCE OU PRUDENCE</div>
<p>La bande contient un dessin sommaire : une auberge, une route noyée de pluie et une cloche suspendue au-dessus d'une porte. Le relieur reconnaît le lieu du prologue : <em>La Dernière Chandelle</em>.</p>
<p>Il affirme n'y être jamais allé. Pourtant, ses doigts tremblent lorsqu'il touche le dessin.</p>
<p>« Je peux te dire ce que je sais, mais alors ils sauront que j'ai parlé. Ou tu peux partir avec la page. Dans ce cas, tu n'auras qu'une moitié de vérité. »</p>
<p>Ce choix ne ferme pas l'aventure, mais il déterminera la première personne qui acceptera de te parler dans la suite.</p>`,
btn("Lui faire confiance et écouter son témoignage","longChoose('trust')")+btn("Partir avec les documents sans insister","longChoose('leave')",false),"CHOIX NARRATIF : LE TÉMOIN","Les deux chemins conduisent à la suite, mais ton choix sera conservé.");break;
case"revelation":show("La flamme qui ne réchauffe rien",`<div class="chapter-label">RÉVÉLATION · LE SIGNE BLEU</div>
<p>Le relieur approche la page de la lampe. L'encre ordinaire pâlit. Une seconde écriture apparaît, tracée dans une substance bleutée qui ne reflète pas la lumière.</p>
<blockquote>« Quand la dernière cloche se taira, cherche la lumière qui ne réchauffe rien. Le village n'a pas disparu. C'est le chemin qui a été retiré. »</blockquote>
<p>Une flamme bleue s'allume dans le miroir terni au fond de l'atelier. Elle ne vacille pas. Elle ne produit aucune chaleur. Dans son reflet se tient une silhouette vêtue d'un manteau sombre.</p>
<p>Le relieur se retourne. Il n'y a personne. Dans le miroir, pourtant, la silhouette lève lentement la main et montre la clé sans dents.</p>
<p>Une phrase se forme sur le verre embué : <strong>« Hauterive conserve ce que Valombre oublie. »</strong></p>`,
btn("Assembler les découvertes","longNext('finaldeduction')"),"DÉCOUVERTE : LA FLAMME BLEUE","La prochaine destination est révélée : Hauterive.");break;
case"finaldeduction":show("La dernière déduction de Valombre",`<div class="chapter-label">ÉNIGME 07 · SYNTHÈSE FINALE</div>
<p>La flamme bleue éclaire simultanément la pièce, la page du registre et le parchemin. Les six cercles de la pièce correspondent aux six noms rayés. La clé sans dents n'ouvre aucune serrure : elle sert à maintenir les six volets du parchemin dans le bon ordre.</p>
<p>Tu relis les trois indices : « Le souvenir précède le nom », « Le chemin a été retiré » et « Hauterive conserve ce que Valombre oublie ».</p>
<p>Le relieur te demande : « Si le village n'a pas disparu, si les noms ont été effacés et si le chemin seul a été retiré, que dois-tu chercher à Hauterive ? »</p>
<p><strong>Question finale :</strong> quel type de document pourrait conserver la trace d'un chemin qui n'existe plus sur les cartes ?</p>${input("long-final-answer","Type de document…")}
<p class="game-note">Pense à ce que les copistes conservent et comparent. Ce n'est pas une carte elle-même.</p>`,
btn("Valider ma déduction","longCheckFinal()")+btn("Indice","longHint(9)",false),"ÉNIGME FINALE : LA TRACE","Cette dernière réponse ouvre réellement la route vers Hauterive.");break;
case"ending":show("Fin du chapitre I — Le premier seuil",`<div class="chapter-label">FIN DU CHAPITRE I · LA ROUTE VERS HAUTERIVE</div>
<p>Tu quittes la boutique alors que la pluie commence à faiblir. La ruelle paraît plus longue qu'à ton arrivée. À l'endroit où tu avais vu la plaque des Relieurs, il n'y a plus qu'un mur de pierre humide.</p>
<p>Dans ta poche, la pièce est devenue tiède. La clé sans dents semble plus lourde. La page du registre porte désormais une destination : <strong>Hauterive</strong>, la ville des archives.</p>
<p>Tu comprends que Valombre n'est pas simplement un village oublié. Quelqu'un a effacé son accès, ses noms et jusqu'au souvenir de son existence. Les six cercles de la pièce ne désignent peut-être pas six lieux, mais six absences.</p>
<blockquote>« Le premier nom a été rendu. Il en reste six. »</blockquote>
<p>La première enquête s'achève. La suivante commence dans les archives d'une ville qui prétend n'avoir jamais entendu parler de Valombre.</p>`,
btn("Poursuivre vers Hauterive","location.href='Episode-02.html'")+btn("Ouvrir le Grimoire","location.href='grimoire.html'")+btn("Revoir la révélation","longNext('revelation')",false),"CHAPITRE I TERMINÉ · PISTE VERS HAUTERIVE","Ton parcours et tes découvertes sont sauvegardés. Le volet II pourra reprendre cette piste.");break;
default:next("prologue");
}}
window.longCheck1=function(){let v=norm($("long-answer-1")?.value);if(["centre","central","le centre"].includes(v)){record("Le Signe sans royaume");next("cipher")}else $("game-feedback").textContent="Ce n'est pas le bon point de départ. Observe la géométrie : les six marques entourent un élément unique."};
window.longCheckEnvelope=function(){let v=norm($("long-envelope-answer")?.value);if(["six","6"].includes(v))next("coin");else $("game-feedback").textContent="Compte uniquement les marques autour de l'empreinte. Le centre ne compte pas comme une encoche."};
window.longCheckCipher=function(){let v=norm($("long-cipher-answer")?.value);if(["7","sept","sept positions"].includes(v)){record("Le compte des six absences");next("arrival")}else $("game-feedback").textContent="Tu as compté les marques extérieures, mais la phrase demande aussi de compter le centre."};
window.longCheckStreet=function(){let v=norm($("long-street-answer")?.value);if(v.includes("relieur"))next("door");else $("game-feedback").textContent="Relis la description de la boutique et distingue la voie de ses voisines."};
window.longCheckThreshold=function(){let v=norm($("long-threshold-answer")?.value);if(["montagne","la montagne"].includes(v))next("workshop");else $("game-feedback").textContent="La couronne représente le pouvoir et la vague le mouvement. Que reste-t-il quand les deux passent ?"};
window.longCheckShelves=function(){let v=norm($("long-shelf-answer")?.value);if(["vague","la vague"].includes(v))next("hidden");else $("game-feedback").textContent="La montagne est première. La vague vient après elle. La couronne n'est pas première : cherche donc le milieu."};
window.longCheckParchment=function(){let v=norm($("long-parchment-answer")?.value);if(["chemin","le chemin","la route","route"].includes(v)){record("Le chemin retiré");next("decision")}else $("game-feedback").textContent="Les fragments disent que le village demeure, mais qu'un élément permettant de l'atteindre a été retiré."};
window.longCheckFinal=function(){let v=norm($("long-final-answer")?.value);if(["registre","un registre","des registres","archives","les archives","registre ancien"].includes(v)){record("La trace des chemins oubliés");next("ending")}else $("game-feedback").textContent="Cherche le document que les copistes utilisent pour garder et recouper les traces du passé."};
window.longPick=function(x){let s=state(),a=[...(s.answers?.order||[])];if(a.length>=3)return;a.push(x);set({answers:{...(s.answers||{}),order:a}})};
window.longClearOrder=function(){let s=state();set({answers:{...(s.answers||{}),order:[]}})};
window.longCheck2=function(){let s=state(),a=s.answers?.order||[];if(a.length!==3){$("game-feedback").textContent="Choisis les trois symboles avant de vérifier.";return}if(a.join(",")==="couronne,montagne,vague"){record("Énigme du disque résolue");next("shelves")}else $("game-feedback").textContent="Les plaques vibrent puis reviennent à leur place. Relis les trois propriétés : la couronne règne, la montagne demeure, la vague passe."};
window.longHint=function(n){let s=state(),h={...(s.hints||{})};h[n]=(h[n]||0)+1;save({...load(),episode01Long:{...s,hints:h}});let hints={1:["Le point central est entouré par les six autres.","Cherche le mot qui désigne le milieu, pas une direction."],2:["Une couronne symbolise le pouvoir ; une montagne résiste au temps ; une vague traverse et s'éloigne.","Règne = couronne. Demeure = montagne. Passe = vague."],3:["L'empreinte ronde est au centre. Compte les petites marques disposées autour.","Il y en a six."],4:["La phrase demande les six marques extérieures plus le centre.","Six plus un."],5:["La boutique est au bout de la Ruelle des Relieurs.","Le nom de la voie est écrit sur la plaque de pierre."],6:["La montagne est la seule qui demeure quand la couronne et la vague ne sont plus là.","La réponse est la montagne."],7:["La montagne est première et la vague vient après elle. La couronne n'est pas première.","L'ordre est montagne, vague, couronne."],8:["Le village est toujours là. Ce qui a été retiré permettait de s'y rendre.","Les deux mots commencent par C et désignent une voie."],9:["Les archives conservent des documents, mais un document précis rassemble les noms et les chemins.","Un ancien registre peut conserver cette trace."]};let a=hints[n]||[];$("game-feedback").textContent=a[Math.min(h[n]-1,a.length-1)]||a[a.length-1]};
window.longChoose=function(c){let s=state();record("Le copiste de Valombre");record(c==="trust"?"Le témoignage du relieur":"La prudence du voyageur");next("revelation",c)};
window.longEpisodeReset=function(){if(!confirm("Recommencer le volet I ? Les découvertes déjà inscrites au Grimoire seront conservées."))return;let d=load();delete d.episode01Long;save(d);render()};
window.restoreEpisode=function(){render()};
window.episodeChoice=function(){render()};
window.episodeRiddleStart=function(){next("riddle1")};
// Le volet I ne doit jamais reprendre la main sur le panneau du volet II.
function isEpisode01Page(){return !!$("episode") && !!$("game-scene");}
window.addEventListener("DOMContentLoaded",()=>{if(isEpisode01Page())render()});
if(isEpisode01Page())render();
})();