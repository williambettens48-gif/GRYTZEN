
/* FEU FOLLET — Lecteur d'ambiance compact */
(function () {
  "use strict";

  if (document.getElementById("ff-audio-player")) return;

  const AUDIO_SRC = "/ignis-fatuus/assets/audio/whispers-beyond-time.mp3";

  const style = document.createElement("style");
  style.textContent = `
    #ff-audio-player {
      position:fixed; z-index:99999; right:12px; bottom:12px;
      width:205px; color:#ead9b5; background:#171914;
      border:1px solid #9c7b45; border-radius:30px;
      box-shadow:0 4px 18px #0009; font-family:Georgia,serif;
      overflow:hidden;
    }
    #ff-audio-player * { box-sizing:border-box; }
    #ff-audio-player .head {
      display:flex; align-items:center; gap:9px; padding:7px 9px;
    }
    #ff-audio-player .symbol {
      color:#d6b36f; font-size:19px;
    }
    #ff-audio-player .name {
      flex:1; min-width:0; font-size:11px;
      white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
    }
    #ff-audio-player button {
      border:0; cursor:pointer; font:inherit;
    }
    #ff-audio-player .play {
      width:32px; height:32px; border-radius:50%;
      background:#c5a269; color:#171914; font-size:15px;
    }
    #ff-audio-player .expand {
      background:transparent; color:#d6b36f; font-size:16px;
      padding:5px;
    }
    #ff-audio-player .details {
      display:none; padding:0 13px 12px;
    }
    #ff-audio-player.open { width:min(285px,calc(100vw - 24px)); border-radius:15px; }
    #ff-audio-player.open .details { display:block; }
    #ff-audio-player .title {
      font-size:13px; color:#e4c58b; margin:3px 0 8px;
    }
    #ff-audio-player .volume {
      display:flex; align-items:center; gap:8px;
      font:10px Arial,sans-serif; margin-top:9px;
    }
    #ff-audio-player input { width:100%; accent-color:#c5a269; }
    #ff-audio-player .status {
      font:10px Arial,sans-serif; color:#b8aa8d;
      margin-top:8px; line-height:1.4;
    }
    @media(max-width:400px) {
      #ff-audio-player { right:8px; bottom:8px; }
    }
  `;
  document.head.appendChild(style);

  const player = document.createElement("aside");
  player.id = "ff-audio-player";
  player.innerHTML = `
    <div class="head">
      <span class="symbol">✦</span>
      <span class="name">FEU FOLLET · Ambiance</span>
      <button class="play" aria-label="Lire">▶</button>
      <button class="expand" aria-label="Agrandir">＋</button>
    </div>
    <div class="details">
      <div class="title">Les Murmures de la Terre absente</div>
      <div class="volume">
        <span>VOLUME</span>
        <input class="vol" type="range" min="0" max="1" step="0.01" value="0.22">
      </div>
      <div class="status">L'ambiance vous attend.</div>
    </div>
  `;
  document.body.appendChild(player);

  const audio = new Audio(AUDIO_SRC);
  audio.loop = true;
  audio.preload = "auto";
  audio.volume = 0.22;

  const play = player.querySelector(".play");
  const expand = player.querySelector(".expand");
  const status = player.querySelector(".status");
  const volume = player.querySelector(".vol");

  play.addEventListener("click", async function () {
    if (audio.paused) {
      status.textContent = "Chargement de l'ambiance…";
      try {
        await audio.play();
        play.textContent = "Ⅱ";
        play.setAttribute("aria-label", "Mettre en pause");
        status.textContent = "L'ambiance accompagne votre voyage.";
      } catch (error) {
        status.textContent = "Lecture impossible. Vérifiez le fichier MP3.";
        console.error("FEU FOLLET audio :", error);
      }
    } else {
      audio.pause();
      play.textContent = "▶";
      play.setAttribute("aria-label", "Lire");
      status.textContent = "Ambiance en pause.";
    }
  });

  expand.addEventListener("click", function () {
    player.classList.toggle("open");
    expand.textContent = player.classList.contains("open") ? "−" : "＋";
  });

  volume.addEventListener("input", function () {
    audio.volume = Number(volume.value);
  });

  audio.addEventListener("error", function () {
    status.textContent = "Fichier MP3 introuvable ou inaccessible.";
    console.error("Impossible de charger :", AUDIO_SRC);
  });

  audio.addEventListener("ended", function () {
    play.textContent = "▶";
  });
})();
