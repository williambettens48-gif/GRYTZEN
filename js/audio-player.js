
/* =====================================================
   FEU FOLLET — LES MURMURES DE LA TERRE ABSENTE
   Lecteur audio intégré au décor du site
   ===================================================== */

(function () {
  "use strict";

  if (document.getElementById("ff-audio-player")) return;

  const AUDIO_SRC =
    "/ignis-fatuus/assets/audio/Whispers-Beyond-Time.mp3";

  /* ---------- STYLE DU LECTEUR ---------- */

  const style = document.createElement("style");

  style.textContent = `
    #ff-audio-player {
      position: relative;
      display: block;
      width: min(290px, calc(100% - 32px));
      margin: 24px auto 30px;
      padding: 12px 15px;
      color: #e9d8b5;
      background: linear-gradient(145deg, #24231c, #11130f);
      border: 1px solid #927345;
      border-radius: 12px;
      box-shadow: 0 5px 18px rgba(0,0,0,.35);
      font-family: Georgia, serif;
      box-sizing: border-box;
      z-index: 2;
    }

    #ff-audio-player * {
      box-sizing: border-box;
    }

    #ff-audio-player .ff-top {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    #ff-audio-player .ff-emblem {
      color: #d6b36f;
      font-size: 23px;
      line-height: 1;
    }

    #ff-audio-player .ff-info {
      flex: 1;
      min-width: 0;
    }

    #ff-audio-player .ff-label {
      color: #c6a36a;
      font-size: 9px;
      letter-spacing: 2px;
      text-transform: uppercase;
      margin-bottom: 4px;
    }

    #ff-audio-player .ff-title {
      color: #f0e4cb;
      font-size: 12px;
      line-height: 1.3;
    }

    #ff-audio-player button {
      cursor: pointer;
      font-family: inherit;
    }

    #ff-audio-player .ff-play {
      flex: 0 0 36px;
      width: 36px;
      height: 36px;
      border: 1px solid #d1ad70;
      border-radius: 50%;
      color: #171610;
      background: linear-gradient(145deg, #e0c184, #a77e42);
      font-size: 15px;
    }

    #ff-audio-player .ff-play:hover {
      filter: brightness(1.15);
    }

    #ff-audio-player .ff-controls {
      margin-top: 10px;
      padding-top: 9px;
      border-top: 1px solid rgba(190,155,95,.25);
      display: flex;
      align-items: center;
      gap: 9px;
    }

    #ff-audio-player .ff-volume-label {
      color: #b9a783;
      font-family: Arial, sans-serif;
      font-size: 9px;
      letter-spacing: 1px;
    }

    #ff-audio-player .ff-volume {
      flex: 1;
      min-width: 0;
      accent-color: #c5a269;
      cursor: pointer;
    }

    #ff-audio-player .ff-status {
      margin-top: 8px;
      color: #a99b7d;
      font-family: Arial, sans-serif;
      font-size: 10px;
      line-height: 1.4;
      text-align: center;
    }

    @media (max-width: 480px) {
      #ff-audio-player {
        width: min(270px, calc(100% - 28px));
        margin: 20px auto 25px;
      }
    }
  `;

  document.head.appendChild(style);

  /* ---------- STRUCTURE DU LECTEUR ---------- */

  const player = document.createElement("div");
  player.id = "ff-audio-player";

  player.innerHTML = `
    <div class="ff-top">
      <span class="ff-emblem">✦</span>

      <div class="ff-info">
        <div class="ff-label">Ambiance sonore</div>
        <div class="ff-title">
          Les Murmures de la Terre absente
        </div>
      </div>

      <button class="ff-play" type="button"
        aria-label="Lire la musique">▶</button>
    </div>

    <div class="ff-controls">
      <span class="ff-volume-label">VOLUME</span>
      <input class="ff-volume" type="range"
        min="0" max="1" step="0.01" value="0.22"
        aria-label="Volume">
    </div>

    <div class="ff-status" aria-live="polite">
      Une présence murmure au loin…
    </div>
  `;

  /* ---------- POSITION SUR LA PAGE ---------- */

  const manifesto = document.querySelector(".manifesto");

  if (manifesto && manifesto.parentNode) {
    manifesto.parentNode.insertBefore(player, manifesto);
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
        console.error("FEU FOLLET - Erreur audio :", error);

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
      "FEU FOLLET - Fichier audio introuvable :",
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
