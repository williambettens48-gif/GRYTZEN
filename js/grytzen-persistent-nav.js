/* GRYTZEN — navigation persistante pour conserver la musique sans coupure */
(function () {
  "use strict";
  if (window.__GRYTZEN_PERSISTENT_NAV__) return;
  window.__GRYTZEN_PERSISTENT_NAV__ = true;

  let appLoaded = !!document.querySelector('script[src$="js/app.js"]');
  let navigating = false;

  function persistentNodes() {
    const host = document.getElementById("gry-audio-host");
    const anchor = document.getElementById("medaillon-musical");
    // Avant de remplacer la page, ranger le grand médaillon dans son hôte invisible.
    if (host && anchor && anchor.parentElement !== host) host.appendChild(anchor);
    if (host) {
      host.hidden = true;
      host.style.display = "none";
      host.setAttribute("aria-hidden", "true");
    }
    return [host].filter(Boolean);
  }

  function attachControls() {
    const host = document.getElementById("gry-audio-host");
    if (host) {
      host.hidden = true;
      host.style.display = "none";
      host.setAttribute("aria-hidden", "true");
    }
    if (typeof window.__GRYTZEN_PLACE_PLAYER__ === "function") {
      window.__GRYTZEN_PLACE_PLAYER__();
    }
  }

  function syncHead(nextDoc) {
    document.title = nextDoc.title || document.title;
    const oldPageStyles = [...document.head.querySelectorAll('style[data-page-style], style:not(#grytzen-medallion-style):not(#grytzen-pjax-style)')];
    oldPageStyles.forEach(el => el.remove());
    [...nextDoc.head.querySelectorAll("style")].forEach((el, i) => {
      const copy = document.createElement("style");
      copy.textContent = el.textContent;
      copy.dataset.pageStyle = "true";
      document.head.appendChild(copy);
    });
    const nextBodyClass = nextDoc.body.className;
    document.body.className = nextBodyClass;
  }

  async function loadAppIfNeeded(nextDoc) {
    const needsApp = !!nextDoc.querySelector('script[src$="js/app.js"]');
    if (!needsApp || appLoaded) return;
    appLoaded = true;
    await new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = "js/app.js";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    });
  }

  function announcePageReady() {
    document.dispatchEvent(new Event("DOMContentLoaded", { bubbles: true }));
    window.dispatchEvent(new Event("gry-page-ready"));
  }

  async function navigate(url, pushState) {
    if (navigating) return;
    navigating = true;
    try {
      const response = await fetch(url, { credentials: "same-origin" });
      if (!response.ok) throw new Error("Page introuvable");
      const html = await response.text();
      const nextDoc = new DOMParser().parseFromString(html, "text/html");
      if (!nextDoc.body || !nextDoc.querySelector("main")) {
        window.location.href = url;
        return;
      }

      const keep = persistentNodes();
      syncHead(nextDoc);
      document.body.innerHTML = nextDoc.body.innerHTML;
      keep.forEach(node => document.body.appendChild(node));

      await loadAppIfNeeded(nextDoc);
      attachControls();
      announcePageReady();
      if (pushState) history.pushState({ grytzen: true }, "", url);
      if (url.hash) {
        const target = document.getElementById(decodeURIComponent(url.hash.slice(1)));
        if (target) target.scrollIntoView({ behavior: "smooth", block: "center" });
        else window.scrollTo(0, 0);
      } else {
        window.scrollTo(0, 0);
      }
    } catch (err) {
      console.warn("Navigation GRYTZEN classique utilisée :", err);
      window.location.href = url;
    } finally {
      navigating = false;
    }
  }

  document.addEventListener("click", function (event) {
    const link = event.target.closest("a[href]");
    if (!link || event.defaultPrevented || event.button !== 0 ||
        event.metaKey || event.ctrlKey || event.shiftKey || event.altKey ||
        link.target || link.hasAttribute("download")) return;
    const raw = link.getAttribute("href");
    if (!raw || raw.startsWith("#") || /^(mailto:|tel:|javascript:)/i.test(raw)) return;
    const url = new URL(raw, location.href);
    if (url.origin !== location.origin || !/\.(html?)$/i.test(url.pathname)) return;
    event.preventDefault();
    navigate(url.href, true);
  });

  window.addEventListener("popstate", function () {
    navigate(location.href, false);
  });

  window.addEventListener("load", attachControls);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", attachControls, { once: true });
  } else {
    attachControls();
  }
})();