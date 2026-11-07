
/* =====================================================
   GRYTZEN — LES MURMURES DE LA TERRE ABSENTE
   Lecteur audio intégré au décor du site
   ===================================================== */

(function () {
  "use strict";

  if (document.getElementById("ff-audio-player")) return;

  const AUDIO_SRC =
    "assets/audio/Whispers-Beyond-Time.mp3";

  /* ---------- STYLE DU LECTEUR ---------- */

  const style = document.createElement("style");

  style.textContent = `
    #ff-audio-player {
      width: min(250px, calc(100% - 36px)); aspect-ratio: 1 / 1;
      margin: 28px auto 34px; padding: 17px; position: relative;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px;
      color: #f2dfb8; border-radius: 50%; border: 3px double #c7a56a;
      background: radial-gradient(circle at 50% 42%,rgba(74,151,174,.28),transparent 43%),
        radial-gradient(circle,#1b2a3c 0%,#0c1421 66%,#070b13 100%);
      box-shadow: 0 0 0 5px #111a28,0 0 0 7px rgba(199,165,106,.65),
        0 12px 38px rgba(0,0,0,.55),inset 0 0 28px rgba(0,0,0,.8);
      font-family: Georgia,serif; box-sizing: border-box; z-index: 2; text-align: center;
    }
    #ff-audio-player:before,#ff-audio-player:after{content:"✦";position:absolute;color:#82dff1;font-size:17px;text-shadow:0 0 12px #55c9ee}
    #ff-audio-player:before{top:13px}#ff-audio-player:after{bottom:12px}
    #ff-audio-player *{box-sizing:border-box}
    #ff-audio-player .ff-label{color:#c7a56a;font:700 9px Manrope,Arial,sans-serif;letter-spacing:2px;text-transform:uppercase;margin-top:8px}
    #ff-audio-player .ff-title{max-width:175px;color:#f2dfb8;font:12px/1.35 Cinzel,Georgia,serif;letter-spacing:.5px}
    #ff-audio-player button{cursor:pointer;font-family:inherit}
    #ff-audio-player .ff-play{width:62px;height:62px;flex:0 0 62px;border:2px solid #e4c681;border-radius:50%;color:#07111d;
      background:radial-gradient(circle at 35% 25%,#fff0bd,#c7a56a 62%,#795a31);box-shadow:0 0 0 5px rgba(199,165,106,.16),0 0 24px rgba(85,201,238,.28);font-size:23px}
    #ff-audio-player .ff-play:hover{filter:brightness(1.15);transform:scale(1.04)}
    #ff-audio-player .ff-controls{width:78%;display:flex;align-items:center;gap:7px;margin-top:3px}
    #ff-audio-player .ff-volume-label{color:#b9c7d4;font:700 8px Manrope,Arial,sans-serif;letter-spacing:1px}
    #ff-audio-player .ff-volume{flex:1;min-width:0;accent-color:#82dff1;cursor:pointer}
    #ff-audio-player .ff-status{max-width:180px;color:#aeb8c6;font:9px/1.35 Manrope,Arial,sans-serif}
    @media(max-width:480px){#ff-audio-player{width:224px;margin:24px auto 30px}}
  `;

  document.head.appendChild(style);

  /* ---------- STRUCTURE DU LECTEUR ---------- */

  const player = document.createElement("div");
  player.id = "ff-audio-player";

  player.innerHTML = `
    <div class="ff-label">RELIQUE SONORE</div>
    <div class="ff-title">Les Murmures de la Terre absente</div>
    <button class="ff-play" type="button" aria-label="Lire la musique">▶</button>
    <div class="ff-controls"><span class="ff-volume-label">VOL.</span>
      <input class="ff-volume" type="range" min="0" max="1" step="0.01" value="0.22" aria-label="Volume">
    </div>
    <div class="ff-status" aria-live="polite">Une présence murmure au loin…</div>
  `;

  /* ---------- POSITION SUR LA PAGE ---------- */

  const manifesto = document.querySelector(".home-manifesto");

  if (manifesto && manifesto.parentNode) {
    manifesto.insertBefore(player, manifesto.firstChild);
  } else {
    document.body.appendChild(player);
  }

  /* ---------- AUDIO ---------- */

  const audio = new Audio(AUDIO_SRC);
  audio.loop = true;
  audio.preload = "none";
  audio.volume = 0.22;

  const playButton = player.querySelector(".ff-play");
  const volumeSlider = player.querySelector(".ff-volume");
  const status = player.querySelector(".ff-status");

  /* ---------- LECTURE / PAUSE ---------- */

  playButton.addEventListener("click", async function () {
    if (audio.paused) {
      status.textContent = "Les murmures s'éveillent…";
      playButton.disabled = true;

      try {
        await audio.play();

        playButton.textContent = "Ⅱ";
        playButton.setAttribute(
          "aria-label",
          "Mettre en pause"
        );

        status.textContent =
          "Les murmures accompagnent votre voyage.";

      } catch (error) {
        console.error("GRYTZEN - Erreur audio :", error);

        status.textContent =
          "Impossible de lire le fichier audio. Vérifiez son accès.";

      } finally {
        playButton.disabled = false;
      }

    } else {
      audio.pause();

      playButton.textContent = "▶";
      playButton.setAttribute(
        "aria-label",
        "Lire la musique"
      );

      status.textContent = "Les murmures sont en pause.";
    }
  });

  /* ---------- VOLUME ---------- */

  volumeSlider.addEventListener("input", function () {
    audio.volume = Number(volumeSlider.value);
  });

  /* ---------- ERREURS ET ÉVÉNEMENTS ---------- */

  audio.addEventListener("error", function () {
    status.textContent =
      "Fichier audio introuvable ou inaccessible.";

    playButton.textContent = "▶";

    console.error(
      "GRYTZEN - Fichier audio introuvable :",
      AUDIO_SRC
    );
  });

  audio.addEventListener("pause", function () {
    if (audio.ended) return;

    playButton.textContent = "▶";
    playButton.setAttribute(
      "aria-label",
      "Lire la musique"
    );
  });

  audio.addEventListener("playing", function () {
    playButton.textContent = "Ⅱ";
  });

})();
