/* FEU FOLLET — Lecteur d'ambiance officiel
   Lecture volontaire (pas d'autoplay), volume mémorisé, reprise proposée après navigation. */
(function () {
  "use strict";
  if (document.getElementById("ff-audio-player")) return;

  const AUDIO_SRC = "assets/audio/whispers-beyond-time.mp3";
  const STORAGE_KEY = "ff_ambience_settings_v1";
  const SESSION_KEY = "ff_ambience_session_v1";
  const style = document.createElement("style");
  style.textContent = `
    #ff-audio-player{position:fixed;z-index:9999;right:18px;bottom:18px;width:min(360px,calc(100vw - 28px));color:#eee4ce;background:linear-gradient(145deg,rgba(29,27,23,.97),rgba(9,13,19,.98));border:1px solid rgba(190,157,99,.62);border-radius:17px;box-shadow:0 14px 42px rgba(0,0,0,.48),inset 0 0 22px rgba(192,157,93,.06);font-family:Manrope,Arial,sans-serif;backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);overflow:hidden}
    #ff-audio-player *{box-sizing:border-box}#ff-audio-player .ff-ap-head{display:flex;align-items:center;gap:12px;padding:13px 14px 9px}
    #ff-audio-player .ff-ap-emblem{width:43px;height:43px;flex:0 0 43px;border:1px solid rgba(202,169,108,.65);border-radius:50%;display:grid;place-items:center;color:#d9bd83;background:radial-gradient(circle,rgba(199,164,101,.2),rgba(14,18,23,.8));font:24px Georgia,serif;box-shadow:0 0 18px rgba(204,169,105,.13)}
    #ff-audio-player .ff-ap-meta{min-width:0;flex:1}#ff-audio-player .ff-ap-brand{font:10px Cinzel,Georgia,serif;letter-spacing:2px;color:#c7a66a}#ff-audio-player .ff-ap-title{font:600 14px Cinzel,Georgia,serif;line-height:1.35;color:#f3e7cd;margin-top:3px}#ff-audio-player .ff-ap-sub{font-size:10px;color:#aaa18e;margin-top:2px;letter-spacing:.3px}
    #ff-audio-player .ff-ap-toggle{border:0;background:transparent;color:#cbb17e;font-size:18px;padding:8px;cursor:pointer}#ff-audio-player .ff-ap-body{padding:0 14px 13px}#ff-audio-player .ff-ap-track{height:3px;border-radius:5px;background:rgba(222,205,171,.18);overflow:hidden;margin:8px 0 5px}#ff-audio-player .ff-ap-progress{height:100%;width:0;background:linear-gradient(90deg,#8d7044,#e4c78b);border-radius:5px}
    #ff-audio-player .ff-ap-times{display:flex;justify-content:space-between;color:#968e7e;font-size:10px;font-variant-numeric:tabular-nums}#ff-audio-player .ff-ap-controls{display:flex;align-items:center;justify-content:center;gap:17px;margin-top:9px}
    #ff-audio-player button{font:inherit}#ff-audio-player .ff-ap-control{border:0;background:transparent;color:#d8c49d;cursor:pointer;padding:6px;display:grid;place-items:center}#ff-audio-player .ff-ap-play{width:43px;height:43px;border-radius:50%;background:linear-gradient(145deg,#e2c58a,#a8864f);color:#17150f;font-size:17px;box-shadow:0 3px 15px rgba(190,151,82,.22)}#ff-audio-player .ff-ap-volume{display:flex;align-items:center;gap:8px;margin-top:8px;color:#c6b58f}#ff-audio-player input[type=range]{width:100%;accent-color:#c6a36a;height:3px}#ff-audio-player .ff-ap-volume label{font-size:10px;letter-spacing:1px;white-space:nowrap}
    #ff-audio-player .ff-ap-status{font-size:10px;color:#b6a98f;text-align:center;min-height:14px;margin-top:7px}#ff-audio-player .ff-ap-resume{display:none;width:100%;margin-top:9px;padding:9px 12px;border:1px solid rgba(206,174,112,.5);border-radius:9px;background:rgba(197,160,94,.12);color:#e8d4a8;font-size:11px;letter-spacing:.5px;cursor:pointer}
    #ff-audio-player.ff-collapsed{width:auto;min-width:0;border-radius:30px}#ff-audio-player.ff-collapsed .ff-ap-head{padding:7px 11px}#ff-audio-player.ff-collapsed .ff-ap-emblem{width:32px;height:32px;flex-basis:32px;font-size:18px}#ff-audio-player.ff-collapsed .ff-ap-title{font-size:12px}#ff-audio-player.ff-collapsed .ff-ap-sub,#ff-audio-player.ff-collapsed .ff-ap-body{display:none}
    @media(max-width:600px){#ff-audio-player{right:10px;bottom:10px;width:min(340px,calc(100vw - 20px))}#ff-audio-player.ff-collapsed{width:auto}}
    @media(prefers-reduced-motion:no-preference){#ff-audio-player .ff-ap-emblem{animation:ff-ap-glow 4s ease-in-out infinite}@keyframes ff-ap-glow{0%,100%{box-shadow:0 0 12px rgba(204,169,105,.1)}50%{box-shadow:0 0 22px rgba(204,169,105,.28)}}}
  `;
  document.head.appendChild(style);

  const player = document.createElement("aside");
  player.id = "ff-audio-player";
  player.setAttribute("aria-label", "Lecteur d'ambiance FEU FOLLET");
  player.innerHTML = `
    <div class="ff-ap-head">
      <div class="ff-ap-emblem" aria-hidden="true">✦</div>
      <div class="ff-ap-meta"><div class="ff-ap-brand">FEU FOLLET</div><div class="ff-ap-title">Les Murmures de la Terre absente</div><div class="ff-ap-sub">Whispers Beyond Time · Ambiance sonore</div></div>
      <button class="ff-ap-toggle" type="button" aria-label="Réduire le lecteur" title="Réduire">⌄</button>
    </div>
    <div class="ff-ap-body">
      <div class="ff-ap-track" aria-hidden="true"><div class="ff-ap-progress"></div></div>
      <div class="ff-ap-times"><span class="ff-ap-current">0:00</span><span class="ff-ap-duration">--:--</span></div>
      <div class="ff-ap-controls">
        <button class="ff-ap-control ff-ap-restart" type="button" aria-label="Recommencer" title="Recommencer">↺</button>
        <button class="ff-ap-control ff-ap-play" type="button" aria-label="Lire l'ambiance" title="Lire">▶</button>
        <button class="ff-ap-control ff-ap-mute" type="button" aria-label="Couper le son" title="Couper le son">♫</button>
      </div>
      <div class="ff-ap-volume"><label for="ff-ap-volume">VOLUME</label><input id="ff-ap-volume" type="range" min="0" max="1" step="0.01" value="0.22" aria-label="Volume"></div>
      <div class="ff-ap-status" aria-live="polite">L'ambiance vous attend. Activez-la quand vous le souhaitez.</div>
      <button class="ff-ap-resume" type="button">REPRENDRE LÀ OÙ VOUS ÉTIEZ</button>
    </div>`;
  document.body.appendChild(player);

  const audio = new Audio(AUDIO_SRC);
  audio.preload = "metadata";
  audio.loop = true;
  audio.volume = 0.22;
  const $ = (s) => player.querySelector(s);
  const playBtn = $(".ff-ap-play"), status = $(".ff-ap-status"), resumeBtn = $(".ff-ap-resume");
  let settings = {};
  try { settings = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}"); } catch (_) {}
  if (Number.isFinite(settings.volume)) audio.volume = Math.max(0, Math.min(1, settings.volume));
  audio.muted = !!settings.muted;
  $(".ff-ap-mute").textContent = audio.muted ? "∅" : "♫";
  $("#ff-ap-volume").value = String(audio.volume);
  let session = {};
  try { session = JSON.parse(sessionStorage.getItem(SESSION_KEY) || "{}"); } catch (_) {}
  if (session.wantsMusic && Number.isFinite(session.time) && session.time > 1) {
    audio.addEventListener("loadedmetadata", function restorePosition() {
      audio.currentTime = Math.min(session.time, Math.max(0, audio.duration - 2));
      resumeBtn.style.display = "block";
      status.textContent = "Votre écoute précédente peut être reprise.";
      audio.removeEventListener("loadedmetadata", restorePosition);
    });
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds)) return "0:00";
    const m = Math.floor(seconds / 60), s = Math.floor(seconds % 60);
    return m + ":" + String(s).padStart(2, "0");
  }
  function saveSettings() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ volume: audio.volume, muted: audio.muted })); } catch (_) {}
  }
  function saveSession() {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify({ wantsMusic: !audio.paused, time: audio.currentTime || 0 })); } catch (_) {}
  }
  async function startPlayback(fromResume) {
    try {
      await audio.play();
      playBtn.textContent = "Ⅱ";
      playBtn.setAttribute("aria-label", "Mettre en pause");
      status.textContent = "L'ambiance accompagne votre exploration.";
      resumeBtn.style.display = "none";
      saveSession();
    } catch (_) {
      status.textContent = "Touchez lecture pour démarrer l'ambiance sonore.";
    }
  }
  playBtn.addEventListener("click", function () {
    if (audio.paused) startPlayback(false);
    else { audio.pause(); playBtn.textContent = "▶"; playBtn.setAttribute("aria-label", "Lire l'ambiance"); status.textContent = "Ambiance en pause."; saveSession(); }
  });
  resumeBtn.addEventListener("click", function () { startPlayback(true); });
  $(".ff-ap-restart").addEventListener("click", function () { audio.currentTime = 0; if (audio.paused) startPlayback(false); });
  $(".ff-ap-mute").addEventListener("click", function () { audio.muted = !audio.muted; $(".ff-ap-mute").textContent = audio.muted ? "∅" : "♫"; saveSettings(); });
  $("#ff-ap-volume").addEventListener("input", function (event) { audio.volume = Number(event.target.value); if (audio.volume > 0) audio.muted = false; saveSettings(); });
  $(".ff-ap-toggle").addEventListener("click", function () {
    player.classList.toggle("ff-collapsed");
    const collapsed = player.classList.contains("ff-collapsed");
    $(".ff-ap-toggle").textContent = collapsed ? "＋" : "⌄";
    $(".ff-ap-toggle").setAttribute("aria-label", collapsed ? "Développer le lecteur" : "Réduire le lecteur");
  });
  audio.addEventListener("timeupdate", function () {
    $(".ff-ap-current").textContent = formatTime(audio.currentTime);
    $(".ff-ap-progress").style.width = audio.duration ? (audio.currentTime / audio.duration * 100) + "%" : "0%";
    if (Math.floor(audio.currentTime) % 5 === 0) saveSession();
  });
  audio.addEventListener("loadedmetadata", function () { $(".ff-ap-duration").textContent = formatTime(audio.duration); });
  audio.addEventListener("play", function () { saveSession(); });
  audio.addEventListener("pause", function () { saveSession(); });
  audio.addEventListener("error", function () { status.textContent = "Fichier audio introuvable. Vérifiez assets/audio/whispers-beyond-time.mp3."; });
  window.addEventListener("pagehide", saveSession);
  window.addEventListener("beforeunload", saveSession);
})();
