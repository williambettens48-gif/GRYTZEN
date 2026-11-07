/* GRYTZEN — VOLET I : LE REGISTRE SANS NOM — version longue */
(function(){
"use strict";
const KEY="feufollet_grimoire_v1";
const orderStages=["prologue","letter","coin","riddle1","arrival","door","workshop","riddle2","hidden","decision","revelation","ending"];
const labels={prologue:"PROLOGUE",letter:"LA LETTRE",coin:"LA PIÈCE AUX SIX CERCLES",riddle1:"PREMIÈRE ÉPREUVE",arrival:"L'ANCIENNE BOUTIQUE",door:"LA PORTE SCELLÉE",workshop:"LA SALLE DES RELIURES",riddle2:"SECONDE ÉPREUVE",hidden:"LE COMPARTIMENT",decision:"LE CHOIX DU TÉMOIN",revelation:"LA FLAMME BLEUE",ending:"FIN DU CHAPITRE I"};
const $=id=>document.getElementById(id);
function load(){try{return JSON.parse(localStorage.getItem(KEY)||"{}")}catch(e){return {}}}
function save(d){try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){}}
function state(){return load().episode01Long||{stage:"prologue",choices:[],hints:{},answers:{}}}
function record(n){if(typeof window.ffRecord==="function")window.ffRecord(n)}
function norm(s){return (s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").trim().toLowerCase().replace(/[^a-z0-9 ]/g,"").replace(/\s+/g," ")}
function set(patch){let d=load();d.episode01Long={...state(),...patch};save(d);render()}
function btn(t,fn,g=true){return `<button class="game-btn ${g?"gold":""}" type="button" onclick="${fn}">${t}</button>`}
function input(id,ph){return `<input class="puzzle-input" id="${id}" maxlength="40" autocomplete="off" placeholder="${ph}">`}
function show(title,body,buttons,status,feedback){
 $("scene-title").textContent=title;$("game-scene").innerHTML=body;$("game-controls").innerHTML=buttons||"";
 $("game-status").textContent=status||"PROGRESSION ENREGISTRÉE";$("game-feedback").textContent=feedback||"";
 let s=state(),i=Math.max(0,orderStages.indexOf(s.stage)),p=Math.round(i/(orderStages.length-1)*100);
 $("episode-progress").textContent=(labels[s.stage]||"PROLOGUE")+" · "+p+"%";$("episode-progress-bar").style.width=p+"%";
}
function next(stage,choice){let s=state(),d=load();d.episode01Long={...s,stage,choices:choice?[...(s.choices||[]),choice]:(s.choices||[])};save(d);
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
btn("Examiner la pièce","longNext('coin')")+btn("Suivre l'adresse","longNext('arrival')",false),"INDICE : UNE ADRESSE ET UNE PIÈCE","Le billet contient deux avertissements. L'un concerne les noms, l'autre les chemins.");break;
case"coin":show("La pièce aux six cercles",`<div class="chapter-label">OBJET À EXAMINER · OBSERVATION</div>
<p>La pièce est plus lourde qu'elle n'en a l'air. Sur une face, un arbre sans feuilles. Sur l'autre, six petits cercles entourent un cercle central. Aucun chiffre, aucune devise, aucun profil de souverain.</p>
<p>Tu la fais pivoter près de la fenêtre. Une inscription apparaît sur la tranche : <strong>« Le souvenir précède le nom. »</strong></p>
<p>Tu remarques que les six cercles extérieurs ne sont pas identiques : l'un est légèrement plus profond que les autres. Le cercle central porte une petite entaille tournée vers le bord le plus marqué. La pièce semble être un mécanisme, pas une monnaie.</p>`,
btn("Chercher comment activer la pièce","longNext('riddle1')")+btn("Revenir à la lettre","longNext('letter')",false),"OBSERVATION : SIX CERCLES ET UN CENTRE","Retiens la disposition : six marques autour d'un point central.");break;
case"riddle1":show("Première épreuve — Le souvenir avant le nom",`<div class="chapter-label">ÉNIGME 01 · RÉPONSE À SAISIR</div>
<p>Tu poses la pièce sur la lettre. Les six cercles s'alignent avec les six chiffres grattés au bas de l'adresse. Le cercle central recouvre exactement l'emplacement d'un mot qui a été effacé.</p>
<p>Le billet disait : « Le souvenir précède le nom. » Le cercle central est le seul qui ne représente ni une direction ni un lieu. C'est le point à partir duquel les six autres marques semblent avoir été disposées.</p>
<p><strong>Question :</strong> quel élément faut-il consulter en premier pour retrouver le nom effacé ? Saisis le mot qui désigne ce point de départ.</p>${input("long-answer-1","Écrire le mot…")}<p class="game-note">Indice disponible : le mot désigne le milieu d'un ensemble.</p>`,
btn("Valider ma réponse","longCheck1()")+btn("Demander l'indice","longHint(1)",false),"ÉNIGME : LE POINT DE DÉPART","Il faut interpréter la disposition, pas deviner un nom de royaume.");break;
case"arrival":show("La boutique aux volets clos",`<div class="chapter-label">SCÈNE II · L'ADRESSE</div>
<p>La rue indiquée sur la lettre n'apparaît plus sur les plans récents. Après avoir traversé un quartier de maisons étroites, tu trouves pourtant une plaque de pierre dont les lettres ont été polies par le temps : <strong>Ruelle des Relieurs</strong>.</p>
<p>Au bout, une boutique aux volets clos se tient entre un atelier de serrurerie et une maison condamnée. Derrière la vitrine poussiéreuse, des reliures sont empilées par taille, toutes tournées de façon à cacher leur tranche.</p>
<p>Tu frappes. Aucun bruit. Pourtant, une lueur se déplace derrière le volet du haut.</p>
<p>Sur la porte, trois marques : une couronne, une montagne et une vague. Sous elles : <strong>« Ce qui règne n'est pas toujours ce qui demeure. »</strong></p>`,
btn("Examiner les trois marques","longNext('door')")+btn("Contourner la boutique","longNext('workshop')",false),"LIEU REPÉRÉ : RUELLE DES RELIEURS","La boutique est bien réelle. Quelqu'un semble pourtant savoir que tu arrives.");break;
case"door":show("La porte aux trois marques",`<div class="chapter-label">OBSERVATION · LES TRACES DU SERRURIER</div>
<p>La couronne est polie au centre, comme si elle avait été touchée des milliers de fois. La montagne porte trois entailles parallèles. La vague est intacte, mais une fine poussière bleue s'est logée dans son creux.</p>
<p>La poignée n'est pas usée. En revanche, le seuil est profondément marqué du côté intérieur, comme si des caisses lourdes avaient été traînées vers la rue.</p><blockquote>« Si tu viens pour le registre, tu arrives trop tôt. Si tu viens pour la pièce, tu arrives trop tard. »</blockquote>
<p>La voix se tait. Un petit volet s'ouvre à hauteur des yeux.</p>`,
btn("Répondre : « Je viens pour comprendre »","longNext('workshop')")+btn("Demander qui parle","longNext('workshop','question')",false),"UN TÉMOIN DERRIÈRE LA PORTE","Le témoin connaît la pièce, mais semble craindre le registre.");break;
case"workshop":show("La salle des reliures",`<div class="chapter-label">SCÈNE III · RENCONTRE</div>
<p>La porte s'entrouvre enfin. Un homme âgé, les doigts tachés d'encre et de colle, t'observe sans te laisser entrer tout de suite. Il se nomme simplement <strong>le relieur</strong>. Il ne donne pas son prénom.</p>
<p>À la vue de la pièce, il recule d'un pas. « Je croyais qu'ils avaient repris toutes les copies. Cette marque ne doit pas être montrée à la lumière. »</p>
<p>Il reconnaît l'écriture de la lettre, mais refuse d'en prononcer le nom. Une boîte a été cachée dans l'atelier avant la fermeture de la boutique. Depuis, trois personnes sont venues la chercher. Aucune n'a donné la même raison.</p>
<p>Il accepte de te conduire à l'établi, à une condition : tu devras prouver que tu as compris la phrase gravée sur la porte.</p><blockquote>« Ce qui règne n'est pas toujours ce qui demeure. Ce qui demeure n'est pas toujours ce qui passe. »</blockquote>`,
btn("Étudier la phrase et les marques","longNext('riddle2')")+btn("L'interroger sur Valombre","longNext('riddle2','valombre')",false),"RENCONTRE : LE RELIEUR","Il ne fait pas confiance à la pièce. Il teste ta capacité à relier les indices.");break;
case"riddle2":{let a=(s.answers&&s.answers.order)||[];show("Seconde épreuve — Les trois marques",`<div class="chapter-label">ÉNIGME 02 · ORDRE LOGIQUE</div>
<p>Sur l'établi, trois petites plaques sont posées dans le désordre : une couronne, une montagne et une vague. Le relieur répète les verbes gravés : <strong>règne · demeure · passe</strong>.</p>
<p>Une note précise : « La couronne peut régner sans demeurer. La montagne demeure quand les couronnes passent. La vague passe sans jamais régner. »</p>
<p>Choisis les trois symboles dans l'ordre correspondant aux verbes. Tu peux recommencer sans pénalité.</p>
<div class="choice-grid"><button class="game-btn" type="button" onclick="longPick('couronne')">♛ Couronne</button><button class="game-btn" type="button" onclick="longPick('montagne')">⌃ Montagne</button><button class="game-btn" type="button" onclick="longPick('vague')">≈ Vague</button></div>
<p><strong>Ton ordre :</strong> <span id="long-order">${a.join(" → ")||"Aucun symbole"}</span></p>`,
btn("Vérifier l'ordre","longCheck2()")+btn("Effacer et recommencer","longClearOrder()",false)+btn("Indice","longHint(2)",false),"ÉNIGME : RÈGNE · DEMEURE · PASSE","Les phrases du relieur donnent une propriété à chaque symbole.");break}
case"hidden":show("Le compartiment sous l'établi",`<div class="chapter-label">SCÈNE IV · CE QUI ÉTAIT CACHÉ</div>
<p>Les trois plaques s'enfoncent dans leurs logements. Un bruit sec résonne sous l'établi. Une planche glisse, révélant un compartiment étroit enveloppé de toile huilée.</p>
<p>À l'intérieur : une page de registre, une clé sans dents et une bande de parchemin pliée en six. La page porte une liste de lieux. Cinq noms sont rayés. Le sixième a été remplacé par une simple ligne.</p>
<p>Au bas du document : <strong>« Le premier nom a été rendu. Il en reste six. Ne cherchez pas le village sur une carte : cherchez ce qui manque à la carte. »</strong></p>
<p>Le relieur s'assied. Pour la première fois, il semble véritablement inquiet.</p>`,
btn("Déplier la bande de parchemin","longNext('decision')")+btn("Interroger le relieur","longNext('decision','questioned')",false),"DÉCOUVERTE : LE REGISTRE","Une page ancienne et une clé sans dents sont retrouvées.");break;
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
btn("Inscrire les découvertes au Grimoire","longNext('ending')"),"DÉCOUVERTE : LA FLAMME BLEUE","La prochaine destination est révélée : Hauterive.");break;
case"ending":show("Fin du chapitre I — Le premier seuil",`<div class="chapter-label">FIN DU CHAPITRE I · LA ROUTE VERS HAUTERIVE</div>
<p>Tu quittes la boutique alors que la pluie commence à faiblir. La ruelle paraît plus longue qu'à ton arrivée. À l'endroit où tu avais vu la plaque des Relieurs, il n'y a plus qu'un mur de pierre humide.</p>
<p>Dans ta poche, la pièce est devenue tiède. La clé sans dents semble plus lourde. La page du registre porte désormais une destination : <strong>Hauterive</strong>, la ville des archives.</p>
<p>Tu comprends que Valombre n'est pas simplement un village oublié. Quelqu'un a effacé son accès, ses noms et jusqu'au souvenir de son existence. Les six cercles de la pièce ne désignent peut-être pas six lieux, mais six absences.</p>
<blockquote>« Le premier nom a été rendu. Il en reste six. »</blockquote>
<p>La première enquête s'achève. La suivante commence dans les archives d'une ville qui prétend n'avoir jamais entendu parler de Valombre.</p>`,
btn("Ouvrir le Grimoire","location.href='grimoire.html'")+btn("Revoir la révélation","longNext('revelation')",false),"CHAPITRE I TERMINÉ · PISTE VERS HAUTERIVE","Ton parcours et tes découvertes sont sauvegardés. Le volet II pourra reprendre cette piste.");break;
default:next("prologue");
}}
window.longCheck1=function(){let v=norm($("long-answer-1")?.value);if(["centre","central","le centre"].includes(v)){record("Le Signe sans royaume");next("arrival")}else $("game-feedback").textContent="Ce n'est pas le bon point de départ. Observe la géométrie : les six marques entourent un élément unique."};
window.longPick=function(x){let s=state(),a=[...(s.answers?.order||[])];if(a.length>=3)return;a.push(x);set({answers:{...(s.answers||{}),order:a}})};
window.longClearOrder=function(){let s=state();set({answers:{...(s.answers||{}),order:[]}})};
window.longCheck2=function(){let s=state(),a=s.answers?.order||[];if(a.length!==3){$("game-feedback").textContent="Choisis les trois symboles avant de vérifier.";return}if(a.join(",")==="couronne,montagne,vague"){record("Énigme du disque résolue");next("hidden")}else $("game-feedback").textContent="Les plaques vibrent puis reviennent à leur place. Relis les trois propriétés : la couronne règne, la montagne demeure, la vague passe."};
window.longHint=function(n){let s=state(),h={...(s.hints||{})};h[n]=(h[n]||0)+1;save({...load(),episode01Long:{...s,hints:h}});let hints={1:["Le point central est entouré par les six autres.","Cherche le mot qui désigne le milieu, pas une direction."],2:["Une couronne symbolise le pouvoir ; une montagne résiste au temps ; une vague traverse et s'éloigne.","Règne = couronne. Demeure = montagne. Passe = vague."]};let a=hints[n]||[];$("game-feedback").textContent=a[Math.min(h[n]-1,a.length-1)]||a[a.length-1]};
window.longChoose=function(c){let s=state();record("Le copiste de Valombre");record(c==="trust"?"Le témoignage du relieur":"La prudence du voyageur");next("revelation",c)};
window.longEpisodeReset=function(){if(!confirm("Recommencer le volet I ? Les découvertes déjà inscrites au Grimoire seront conservées."))return;let d=load();delete d.episode01Long;save(d);render()};
window.restoreEpisode=function(){render()};
window.episodeChoice=function(){render()};
window.episodeRiddleStart=function(){next("riddle1")};
window.addEventListener("DOMContentLoaded",()=>{if($("game-scene"))render()});
if($("game-scene"))render();
})();