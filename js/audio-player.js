/* =========================================================
   GRYTZEN — RELIQUAIRE SONORE / MÉDAILLON MÉDIÉVAL V2
   Médaillon en forme d'écu ancien, reliefs, gravures et sceau.
   Remplacer entièrement js/audio-player.js par ce fichier.
   ========================================================= */
(function () {
  "use strict";

  if (document.getElementById("ff-audio-player")) return;

  // Chemin relatif au site : ne dépend pas du nom du dépôt GitHub.
  const AUDIO_SRC = "assets/audio/Whispers-Beyond-Time.mp3";
  const PLAY_KEY = "grytzen_music_wanted";
  const TIME_KEY = "grytzen_music_position";
  const VOLUME_KEY = "grytzen_music_volume";

  const style = document.createElement("style");
  style.id = "grytzen-medallion-style";
  style.textContent = `
    #ff-audio-player, #ff-audio-player * { box-sizing: border-box; }
    #ff-audio-player {
      --g1:#fff0bd; --g2:#d9b66f; --g3:#9a6d35; --g4:#422b17;
      position:relative; isolation:isolate; z-index:5;
      width:min(310px, calc(100% - 28px)); height:402px;
      margin:26px auto 34px; color:#f1dfb5; text-align:center;
      font-family:Georgia,serif; filter:drop-shadow(0 16px 15px rgba(0,0,0,.62));
    }
    #ff-audio-player .ff-chain {
      position:absolute; z-index:0; top:22px; left:50%; transform:translateX(-50%);
      width:8px; height:38px; border-left:2px solid #e3c27b; border-right:2px solid #6b4927;
      background:repeating-linear-gradient(180deg,#f4dfa3 0 4px,#76532d 4px 7px);
      box-shadow:0 0 0 2px #24190f,0 0 8px #d5b16b;
    }
    #ff-audio-player .ff-ring {
      position:absolute; z-index:3; top:35px; left:50%; transform:translateX(-50%);
      width:47px; height:47px; border-radius:50%;
      border:7px ridge #c49a55;
      background:radial-gradient(circle at 32% 25%,#fff0b7,#a7793e 52%,#392516 78%);
      box-shadow:inset 0 0 0 3px #302014,0 0 0 2px #ead092,0 3px 7px #000;
    }
    #ff-audio-player .ff-ring:after {
      content:""; position:absolute; inset:8px; border:2px solid #342316;
      border-radius:50%; box-shadow:inset 0 0 0 2px #e5c47e;
    }
    #ff-audio-player .ff-body {
      position:absolute; z-index:1; left:50%; top:67px; transform:translateX(-50%);
      width:292px; height:300px; overflow:visible;
    }
    #ff-audio-player .ff-frame { width:100%; height:100%; overflow:visible; }
    #ff-audio-player .ff-inner {
      position:absolute; left:50%; top:94px; transform:translateX(-50%);
      width:194px; height:206px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:5px; z-index:4;
      padding:12px 10px 17px;
    }
    #ff-audio-player .ff-kicker {
      color:#e8c77f; font:700 8px/1.2 Arial,sans-serif; letter-spacing:2.5px;
      text-shadow:0 2px 3px #000; margin-bottom:1px;
    }
    #ff-audio-player .ff-sigil {
      width:91px; height:91px; flex:0 0 91px;
      filter:drop-shadow(0 3px 3px #000) drop-shadow(0 0 8px rgba(93,192,218,.32));
    }
    #ff-audio-player .ff-play {
      display:grid; place-items:center; width:39px; height:39px; flex:0 0 39px;
      border-radius:50%; cursor:pointer; color:#1a2025;
      border:3px ridge #f4dfa4;
      background:radial-gradient(circle at 30% 22%,#fff8d8,#d5ad63 58%,#79502a 100%);
      box-shadow:0 0 0 3px #2b1d12,0 0 0 5px #b88c4c,inset 0 1px 4px #fff4c8,0 3px 6px #000;
      font:700 16px Georgia,serif; line-height:1; transition:transform .18s,filter .18s;
    }
    #ff-audio-player .ff-play:hover { transform:scale(1.08); filter:brightness(1.15); }
    #ff-audio-player .ff-play:disabled { opacity:.65; cursor:wait; }
    #ff-audio-player .ff-title {
      max-width:175px; color:#f5e7c7; font:10px/1.25 Georgia,serif;
      text-shadow:0 2px 4px #000; margin-top:1px;
    }
    #ff-audio-player .ff-volume-row {
      width:132px; display:flex; align-items:center; gap:7px; margin-top:1px;
    }
    #ff-audio-player .ff-volume-label {
      color:#e0c27f; font:700 7px Arial,sans-serif; letter-spacing:1px;
    }
    #ff-audio-player .ff-volume {
      width:100%; min-width:0; height:12px; accent-color:#d9b66f; cursor:pointer;
    }
    #ff-audio-player .ff-status {
      min-height:13px; max-width:170px; color:#a9dce5;
      font:8px/1.25 Arial,sans-serif; text-shadow:0 1px 3px #000;
    }
    #ff-audio-player .ff-heading {\n      position:absolute; z-index:7; top:2px; left:50%; transform:translateX(-50%);\n      width:100%; color:#f4dfaa; font:700 10px/1.2 Arial,sans-serif;\n      letter-spacing:3px; text-shadow:0 2px 4px #000,0 0 7px rgba(217,182,111,.35);\n    }\n    #ff-audio-player .ff-nameplate {
      position:absolute; z-index:6; left:50%; bottom:2px; transform:translateX(-50%);
      width:190px; min-height:29px; padding:7px 8px 5px;
      border:3px ridge #d9b66f; border-radius:3px;
      color:#f4dfaa; background:linear-gradient(180deg,#70502d,#211a16 48%,#634426);
      box-shadow:0 4px 6px #000,inset 0 0 0 1px #24180e;
      font:700 8px/1 Arial,sans-serif; letter-spacing:2px; text-shadow:0 2px 2px #000;
    }
    #ff-audio-player .ff-nameplate:before,#ff-audio-player .ff-nameplate:after {
      content:"✦"; position:absolute; top:6px; color:#f5d88e; font-size:10px;
    }
    #ff-audio-player .ff-nameplate:before { left:9px; }
    #ff-audio-player .ff-nameplate:after { right:9px; }
    @media(max-width:380px) {
      #ff-audio-player { transform:scale(.92); transform-origin:top center; margin-bottom:5px; }
    }
    @media(prefers-reduced-motion:no-preference) {
      #ff-audio-player .ff-body { animation:gry-relief-breathe 6s ease-in-out infinite alternate; }
    }
    @keyframes gry-relief-breathe {
      from { filter:brightness(.97) drop-shadow(0 0 0 rgba(112,201,220,0)); }
      to { filter:brightness(1.06) drop-shadow(0 0 7px rgba(112,201,220,.2)); }
    }
  `;
  document.head.appendChild(style);

  const player = document.createElement("section");
  player.id = "ff-audio-player";
  player.setAttribute("aria-label", "Médaillon sonore de Grytzen");
  player.innerHTML = `
    <div class="ff-heading">RELIQUE SONORE</div>\n    <div class="ff-chain" aria-hidden="true"></div>
    <div class="ff-ring" aria-hidden="true"></div>
    <div class="ff-body" aria-hidden="true">
      <svg class="ff-frame" viewBox="0 0 300 310" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="gryMetal" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#fff0b8"/><stop offset=".18" stop-color="#bd914d"/>
            <stop offset=".34" stop-color="#f4d991"/><stop offset=".52" stop-color="#624222"/>
            <stop offset=".72" stop-color="#d6b16a"/><stop offset="1" stop-color="#392516"/>
          </linearGradient>
          <linearGradient id="gryDark" x1="0" y1="0" x2="0" y2="1">
            <stop stop-color="#26394a"/><stop offset=".55" stop-color="#101c2a"/><stop offset="1" stop-color="#080d16"/>
          </linearGradient>
          <radialGradient id="gryPatina" cx="35%" cy="22%" r="80%">
            <stop stop-color="#385365"/><stop offset=".55" stop-color="#172737"/><stop offset="1" stop-color="#080e17"/>
          </radialGradient>
          <filter id="gryShadow" x="-30%" y="-30%" width="160%" height="170%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
            <feOffset dy="4" result="off"/><feComponentTransfer><feFuncA type="linear" slope=".7"/></feComponentTransfer>
            <feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <!-- Silhouette d'écu ancien, épaules sculptées et pointe basse -->
        <path d="M150 8 C164 25 180 23 193 18 C202 35 222 38 238 35 C239 54 257 65 274 68 C264 91 282 108 291 119 C273 137 280 159 286 176 C266 187 267 210 268 226 C246 232 239 254 233 268 C210 268 195 285 183 300 L150 307 L117 300 C105 285 90 268 67 268 C61 254 54 232 32 226 C33 210 34 187 14 176 C20 159 27 137 9 119 C18 108 36 91 26 68 C43 65 61 54 62 35 C78 38 98 35 107 18 C120 23 136 25 150 8Z" fill="url(#gryMetal)" stroke="#26180d" stroke-width="5" filter="url(#gryShadow)"/>
        <path d="M150 18 C165 34 181 32 191 27 C204 46 222 47 248 48 C244 69 260 83 278 91 C264 111 274 132 279 145 C260 160 265 181 260 211 C240 218 232 242 222 255 C202 257 184 278 174 290 L150 297 L126 290 C116 278 98 257 78 255 C68 242 60 218 40 211 C35 181 40 160 21 145 C26 132 36 111 22 91 C40 83 56 69 52 48 C78 47 96 46 109 27 C119 32 135 34 150 18Z" fill="url(#gryDark)" stroke="#f0d28b" stroke-width="2.3"/>
        <path d="M150 27 C165 43 183 42 193 37 C207 54 224 57 258 58 C250 78 269 96 282 103 C269 123 278 140 283 151 C264 167 269 186 265 216 C244 224 238 245 226 261 C203 265 186 282 176 294 L150 301 L124 294 C114 282 97 265 74 261 C62 245 56 224 35 216 C31 186 36 167 17 151 C22 140 31 123 18 103 C31 96 50 78 42 58 C76 57 93 54 107 37 C117 42 135 43 150 27Z" fill="url(#gryPatina)" stroke="#9a713c" stroke-width="2"/>
        <!-- gravure intérieure en double filet -->
        <path d="M150 43 C169 57 187 57 199 52 C213 69 231 70 263 72 C252 92 269 107 271 116 C258 135 268 151 269 160 C252 177 257 194 250 222 C230 231 223 249 214 252 C194 261 180 279 171 284 L150 290 L129 284 C120 279 106 261 86 252 C77 249 70 231 50 222 C43 194 48 177 31 160 C32 151 42 135 29 116 C31 107 48 92 37 72 C69 70 87 69 101 52 C113 57 131 57 150 43Z" fill="none" stroke="#d9b66f" stroke-width="1.2" opacity=".9"/>
        <!-- entrelacs gravés sur les épaules -->
        <g fill="none" stroke="#e0bd78" stroke-width="2" opacity=".95" stroke-linecap="round">
          <path d="M52 65 C67 52 83 56 89 70 C94 82 81 91 69 83 C60 77 65 66 75 66 C84 67 86 76 80 80"/>
          <path d="M248 65 C233 52 217 56 211 70 C206 82 219 91 231 83 C240 77 235 66 225 66 C216 67 214 76 220 80"/>
          <path d="M38 177 C52 164 65 168 68 180 C71 192 59 198 51 190 C45 184 50 177 57 178"/>
          <path d="M262 177 C248 164 235 168 232 180 C229 192 241 198 249 190 C255 184 250 177 243 178"/>
          <path d="M86 251 Q101 235 112 249 Q120 260 108 267 M214 251 Q199 235 188 249 Q180 260 192 267"/>
        </g>
        <!-- petits motifs floraux / étoiles -->
        <g fill="#f2d995" stroke="#694725" stroke-width="1">
          <path d="M150 36 l4 10 10 4 -10 4 -4 10 -4 -10 -10 -4 10 -4Z"/>
          <path d="M43 132 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z"/>
          <path d="M257 132 l3 7 7 3 -7 3 -3 7 -3 -7 -7 -3 7 -3Z"/>
          <path d="M150 271 l4 8 8 4 -8 4 -4 8 -4 -8 -8 -4 8 -4Z"/>
        </g>
        <!-- rivets en relief -->
        <g fill="url(#gryMetal)" stroke="#392516" stroke-width="2">
          <circle cx="75" cy="48" r="5"/><circle cx="225" cy="48" r="5"/>
          <circle cx="30" cy="151" r="5"/><circle cx="270" cy="151" r="5"/>
          <circle cx="65" cy="232" r="5"/><circle cx="235" cy="232" r="5"/>
          <circle cx="150" cy="286" r="5"/>
        </g>
        <g fill="#f4dfa4" font-family="Georgia,serif" font-size="10" text-anchor="middle">
          <text x="150" y="67">✦</text><text x="47" y="111">ᚠ</text><text x="253" y="111">ᚱ</text>
          <text x="45" y="208">ᚷ</text><text x="255" y="208">ᛟ</text>
        </g>
      </svg>
    </div>
    <div class="ff-inner">
      <svg class="ff-sigil" viewBox="0 0 100 100" role="img" aria-label="Sceau du dragon de Grytzen">
        <defs>
          <linearGradient id="gryDragonGold" x1="0" y1="0" x2="1" y2="1">
            <stop stop-color="#fff1bd"/><stop offset=".5" stop-color="#d2a85f"/><stop offset="1" stop-color="#79502b"/>
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="45" fill="#0a1723" stroke="url(#gryDragonGold)" stroke-width="3"/>
        <circle cx="50" cy="50" r="39" fill="none" stroke="#c6a260" stroke-width="1" stroke-dasharray="1.5 3"/>
        <path d="M67 19 C52 12 35 19 32 33 C29 44 41 49 32 59 C27 65 18 68 17 80 C29 72 39 75 48 66 C55 59 49 51 60 46 C69 42 78 50 82 59 C88 39 80 25 67 19Z" fill="url(#gryDragonGold)" stroke="#f8e3a5" stroke-width="1.4"/>
        <path d="M60 29 C48 26 41 34 44 43 C47 51 57 49 62 43 C60 54 48 57 43 65 C57 63 68 55 71 44 C74 35 68 29 60 29Z" fill="#142b3a" stroke="#d8b66e" stroke-width="2"/>
        <path d="M39 32 L23 20 L28 39 L16 48 L37 47 M64 25 L76 13 L72 33 M45 65 L35 84 L53 73 L66 84 L62 62" fill="none" stroke="url(#gryDragonGold)" stroke-width="3" stroke-linejoin="round"/>
        <circle cx="63" cy="37" r="2.3" fill="#8fe1ef"/><path d="M66 38 L78 41 L66 44" fill="#8fe1ef"/>
      </svg>
      <button class="ff-play" type="button" aria-label="Lire la musique">▶</button>
      <div class="ff-title">Les Murmures de la Terre absente</div>
      <div class="ff-volume-row"><span class="ff-volume-label">VOL.</span><input class="ff-volume" type="range" min="0" max="1" step="0.01" value="0.22" aria-label="Volume"></div>
      <div class="ff-status" aria-live="polite">Le sceau garde son secret…</div>
    </div>
    <div class="ff-nameplate">GRYTZEN</div>
  `;

  // Le médaillon complet reste sur l'accueil ; les autres pages ont le contrôle discret.
  const isHome = !!document.querySelector(".home-manifesto");
  if (isHome) {
    const anchor = document.querySelector(".home-manifesto");
    anchor.insertBefore(player, anchor.firstChild);
  }

  // Instance audio unique : elle reste en mémoire pendant la navigation PJAX.
  const audio = window.__GRYTZEN_AUDIO__ || (window.__GRYTZEN_AUDIO__ = new Audio(AUDIO_SRC));
  audio.loop = true;
  audio.preload = "auto";
  if (!Number.isFinite(audio.volume)) audio.volume = 0.22;

  const playButton = player.querySelector(".ff-play");
  const volumeSlider = player.querySelector(".ff-volume");
  const status = player.querySelector(".ff-status");
  const compact = document.getElementById("grytzen-silence-toggle");

  function refreshButton() {
    const playing = !audio.paused;
    if (compact) {
      compact.textContent = playing ? "♫ GARDER LE SILENCE" : "♫ MÉDAILLON MUSICAL";
      compact.setAttribute("aria-label", playing ? "Garder le silence" : "Rétablir la mélodie");
    }
    if (playButton) {
      playButton.textContent = playing ? "Ⅱ" : "▶";
      playButton.setAttribute("aria-label", playing ? "Mettre en pause" : "Lire la musique");
    }
    if (status) status.textContent = playing ? "Les murmures accompagnent votre voyage." : "Le sceau garde son secret…";
  }
  async function toggleAudio() {
    if (audio.paused) {
      try { await audio.play(); }
      catch (e) { if (status) status.textContent = "Touchez le médaillon pour lancer la mélodie."; }
    } else {
      audio.pause();
    }
    refreshButton();
  }
  if (compact) compact.addEventListener("click", toggleAudio);
  if (playButton) playButton.addEventListener("click", toggleAudio);
  if (volumeSlider) {
    volumeSlider.value = String(audio.volume);
    volumeSlider.addEventListener("input", () => { audio.volume = Number(volumeSlider.value); });
  }
  audio.addEventListener("play", refreshButton);
  audio.addEventListener("pause", refreshButton);
  audio.addEventListener("playing", refreshButton);
  audio.addEventListener("error", () => {
    if (status) status.textContent = "Fichier audio introuvable ou inaccessible.";
  });
  window.addEventListener("gry-page-ready", function () {
    const target = document.querySelector(".home-manifesto");
    if (target && player.parentElement !== target) target.insertBefore(player, target.firstChild);
    if (!target) { player.style.display = "none"; document.body.appendChild(player); }
    else player.style.display = "";
    refreshButton();
  });
  refreshButton();
})();