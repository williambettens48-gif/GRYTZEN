
/* =========================================================
   GRYTZEN — MÉDAILLON SONORE
   Reliquaire ancien gravé, commandes audio intégrées.
   ========================================================= */
(function () {
  "use strict";
  if (document.getElementById("ff-audio-player")) return;

  // Chemin relatif : fonctionne aussi après le renommage du dépôt.
  const AUDIO_SRC = "assets/audio/Whispers-Beyond-Time.mp3";

  const style = document.createElement("style");
  style.textContent = `
    #ff-audio-player, #ff-audio-player * { box-sizing:border-box; }
    #ff-audio-player {
      --gold:#d9b875; --bright:#f5dfa5; --shadow:#624522; --ice:#8ed9e8;
      width:min(292px, calc(100% - 28px)); height:322px;
      margin:36px auto 42px; position:relative; isolation:isolate;
      display:flex; flex-direction:column; align-items:center;
      color:#f3e5c5; font-family:Georgia,serif; text-align:center; z-index:3;
      filter:drop-shadow(0 13px 13px rgba(0,0,0,.58));
    }
    /* Anneau de suspension et petite bélière */
    #ff-audio-player .ff-bail {
      position:absolute; top:0; left:50%; transform:translateX(-50%);
      width:48px; height:48px; border:7px ridge #b58b4d; border-radius:50%;
      background:radial-gradient(circle at 35% 28%,#f8e5ad,#8a6636 58%,#342519 78%);
      box-shadow:inset 0 0 0 3px #352719,0 0 0 2px #e1c17d;
      z-index:0;
    }
    #ff-audio-player .ff-bail:after {
      content:""; position:absolute; width:17px; height:17px; border:3px solid #172536;
      border-radius:50%; top:8px; left:8px; box-shadow:inset 0 0 0 2px #d9b875;
    }
    /* Corps métallique du médaillon */
    #ff-audio-player .ff-medallion {
      position:absolute; top:31px; left:50%; transform:translateX(-50%);
      width:254px; height:254px; border-radius:50%;
      background:radial-gradient(circle at 34% 24%,#f3d99a 0%,#a77a3f 17%,#49351f 24%,#c29a58 31%,#72502c 38%,#d2b16f 44%,#4b3825 49%,#172638 52%,#0a1421 72%,#050a11 100%);
      border:4px ridge #d7b875;
      box-shadow:0 0 0 3px #302519,0 0 0 6px #a47b43,0 0 0 8px #e0c17c,
        inset 0 0 0 3px #332719,inset 0 0 22px 9px rgba(0,0,0,.85),0 0 22px rgba(111,199,220,.17);
      z-index:1;
    }
    #ff-audio-player .ff-medallion:before {
      content:""; position:absolute; inset:10px; border-radius:50%;
      border:1px solid rgba(246,220,158,.8); box-shadow:inset 0 0 0 4px rgba(31,23,15,.75),0 0 0 2px rgba(41,29,17,.9);
    }
    #ff-audio-player .ff-runes {
      position:absolute; inset:17px; border-radius:50%; display:flex; align-items:flex-start;
      justify-content:center; padding-top:2px; color:#f0d69b;
      font: bold 13px/1 Georgia,serif; letter-spacing:5px; text-shadow:0 1px 2px #160f08,0 0 5px #e5bd6e;
      transform:rotate(-3deg); z-index:3; pointer-events:none;
    }
    #ff-audio-player .ff-rivet {
      position:absolute; width:9px; height:9px; border-radius:50%; z-index:4;
      background:radial-gradient(circle at 30% 25%,#fff0bb,#b88b4c 55%,#49321c 80%);
      border:1px solid #382719; box-shadow:0 0 0 1px rgba(245,220,160,.45);
    }
    #ff-audio-player .ff-r1{top:35px;left:50%;transform:translateX(-50%)}
    #ff-audio-player .ff-r2{bottom:35px;left:50%;transform:translateX(-50%)}
    #ff-audio-player .ff-r3{left:35px;top:50%;transform:translateY(-50%)}
    #ff-audio-player .ff-r4{right:35px;top:50%;transform:translateY(-50%)}
    #ff-audio-player .ff-core {
      position:absolute; inset:53px 42px 42px; z-index:5;
      display:flex; flex-direction:column; align-items:center; justify-content:center; gap:4px;
    }
    #ff-audio-player .ff-heading {
      color:#e3c581; font:700 8px/1.2 Arial,sans-serif; letter-spacing:2.5px;
      text-shadow:0 2px 3px #000; margin-top:1px;
    }
    #ff-audio-player .ff-emblem {
      width:79px; height:79px; margin:1px 0 0;
      filter:drop-shadow(0 2px 3px #000) drop-shadow(0 0 7px rgba(108,205,225,.35));
    }
    #ff-audio-player .ff-play {
      width:39px; height:39px; flex:0 0 39px; margin-top:-2px;
      display:grid; place-items:center; border-radius:50%; cursor:pointer;
      border:2px ridge #f1d99b; color:#152333;
      background:radial-gradient(circle at 32% 23%,#fff3c9,#d0a65c 60%,#76502b 100%);
      box-shadow:0 0 0 3px rgba(25,17,10,.85),0 0 0 4px #b88d4d, inset 0 1px 3px #fff1c4;
      font-size:17px; line-height:1; transition:transform .18s,filter .18s;
    }
    #ff-audio-player .ff-play:hover{transform:scale(1.08);filter:brightness(1.14)}
    #ff-audio-player .ff-play:disabled{opacity:.7;cursor:wait}
    #ff-audio-player .ff-title {
      max-width:150px; color:#f4e2b8; font:10px/1.25 Georgia,serif;
      text-shadow:0 2px 3px #000; letter-spacing:.25px;
    }
    #ff-audio-player .ff-volume-row { width:116px; display:flex; align-items:center; gap:6px; margin-top:2px; }
    #ff-audio-player .ff-volume-label { color:#d9bd82; font:700 7px Arial,sans-serif; letter-spacing:1px; }
    #ff-audio-player .ff-volume { width:100%; min-width:0; height:12px; accent-color:#d9b875; cursor:pointer; }
    #ff-audio-player .ff-status {
      max-width:158px; min-height:12px; color:#a8d8e1; font:8px/1.25 Arial,sans-serif;
      text-shadow:0 1px 3px #000; margin-top:0;
    }
    #ff-audio-player .ff-plaque {
      position:absolute; z-index:7; left:50%; bottom:2px; transform:translateX(-50%);
      width:210px; min-height:28px; padding:6px 8px 5px;
      border:2px ridge #d4b16b; border-radius:4px;
      color:#f0d9a5; background:linear-gradient(180deg,#5a4329,#171c23 48%,#49341f);
      box-shadow:0 3px 5px #000, inset 0 0 0 1px #261b11;
      font:700 8px/1 Arial,sans-serif; letter-spacing:2px; text-shadow:0 1px 2px #000;
    }
    #ff-audio-player .ff-plaque:before,#ff-audio-player .ff-plaque:after {
      content:"✦"; position:absolute; top:6px; color:#e7c77e; font-size:10px;
    }
    #ff-audio-player .ff-plaque:before{left:8px} #ff-audio-player .ff-plaque:after{right:8px}
    @media(max-width:480px){#ff-audio-player{margin:31px auto 38px;transform:scale(.96);transform-origin:top center;margin-bottom:24px}}
    @media(prefers-reduced-motion:no-preference){#ff-audio-player .ff-medallion{animation:ff-relic-glow 5s ease-in-out infinite alternate}}
    @keyframes ff-relic-glow{from{filter:brightness(.97)}to{filter:brightness(1.07) drop-shadow(0 0 7px rgba(111,207,228,.18))}}
  `;
  document.head.appendChild(style);

  const player = document.createElement("section");
  player.id = "ff-audio-player";
  player.setAttribute("aria-label", "Médaillon sonore de Grytzen");
  player.innerHTML = `
    <div class="ff-bail" aria-hidden="true"></div>
    <div class="ff-medallion" aria-hidden="true">
      <div class="ff-runes">ᚠ ᚱ ᚷ ᚦ ᛟ ᚨ ᛉ ᚾ</div>
      <i class="ff-rivet ff-r1"></i><i class="ff-rivet ff-r2"></i>
      <i class="ff-rivet ff-r3"></i><i class="ff-rivet ff-r4"></i>
    </div>
    <div class="ff-core">
      <div class="ff-heading">RELIQUE SONORE</div>
      <svg class="ff-emblem" viewBox="0 0 100 100" role="img" aria-label="Sceau du dragon">
        <defs>
          <linearGradient id="ffGold" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#fff0b9"/><stop offset=".48" stop-color="#d5ad62"/><stop offset="1" stop-color="#80552d"/></linearGradient>
        </defs>
        <circle cx="50" cy="50" r="43" fill="#0c1b2a" stroke="url(#ffGold)" stroke-width="2.5"/>
        <circle cx="50" cy="50" r="37" fill="none" stroke="#a98750" stroke-width=".8" stroke-dasharray="2 3"/>
        <path d="M66 22 C54 14 38 20 34 31 C29 43 39 48 31 58 C26 65 18 65 17 76 C28 70 38 72 45 65 C51 59 48 51 57 47 C65 43 74 48 78 56 C83 40 77 29 66 22Z" fill="url(#ffGold)" stroke="#f5dfa5" stroke-width="1.4"/>
        <path d="M57 31 C47 29 41 35 43 42 C45 49 55 48 59 43 C56 53 47 56 43 62 C54 61 65 55 68 45 C72 35 65 28 57 31Z" fill="#132638" stroke="#d9b875" stroke-width="1.8"/>
        <path d="M39 33 L25 23 L29 39 L18 47 L36 46 M62 24 L72 15 L70 31 M44 63 L35 81 L52 72 L64 82 L61 62" fill="none" stroke="url(#ffGold)" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="61" cy="37" r="2" fill="#8ed9e8"/><path d="M65 38 L74 41 L65 43" fill="#8ed9e8"/>
        <path d="M50 8 L53 16 L50 13 L47 16Z M91 50 L83 53 L86 50 L83 47Z M50 92 L47 84 L50 87 L53 84Z M9 50 L17 47 L14 50 L17 53Z" fill="#f0d99e"/>
      </svg>
      <button class="ff-play" type="button" aria-label="Lire la musique">▶</button>
      <div class="ff-title">Les Murmures de la Terre absente</div>
      <div class="ff-volume-row"><span class="ff-volume-label">VOL.</span><input class="ff-volume" type="range" min="0" max="1" step="0.01" value="0.22" aria-label="Volume"></div>
      <div class="ff-status" aria-live="polite">Une présence murmure au loin…</div>
    </div>
    <div class="ff-plaque">GRYTZEN · ARCHIVES ANCIENNES</div>
  `;

  const manifesto = document.querySelector(".home-manifesto");
  if (manifesto) manifesto.insertBefore(player, manifesto.firstChild);
  else document.body.appendChild(player);

  const audio = new Audio(AUDIO_SRC);
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.22;

  const playButton = player.querySelector(".ff-play");
  const volumeSlider = player.querySelector(".ff-volume");
  const status = player.querySelector(".ff-status");

  playButton.addEventListener("click", async function () {
    if (audio.paused) {
      status.textContent = "Le sceau s'éveille…";
      playButton.disabled = true;
      try {
        await audio.play();
        playButton.textContent = "Ⅱ";
        playButton.setAttribute("aria-label", "Mettre en pause");
        status.textContent = "Les murmures accompagnent votre voyage.";
      } catch (error) {
        console.error("GRYTZEN — Erreur audio :", error);
        status.textContent = "Audio inaccessible : vérifiez le fichier MP3.";
      } finally { playButton.disabled = false; }
    } else {
      audio.pause();
      playButton.textContent = "▶";
      playButton.setAttribute("aria-label", "Lire la musique");
      status.textContent = "Le médaillon sommeille.";
    }
  });

  volumeSlider.addEventListener("input", function () { audio.volume = Number(volumeSlider.value); });
  audio.addEventListener("error", function () {
    status.textContent = "Fichier audio introuvable ou inaccessible.";
    playButton.textContent = "▶";
    console.error("GRYTZEN — Fichier audio introuvable :", AUDIO_SRC);
  });
  audio.addEventListener("pause", function () {
    if (audio.ended) return;
    playButton.textContent = "▶";
    playButton.setAttribute("aria-label", "Lire la musique");
  });
  audio.addEventListener("playing", function () { playButton.textContent = "Ⅱ"; });
})();
