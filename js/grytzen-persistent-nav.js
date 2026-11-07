/* GRYTZEN — navigation persistante pour conserver la musique sans coupure */
(function () {
  "use strict";
  if (window.__GRYTZEN_PERSISTENT_NAV__) return;
  window.__GRYTZEN_PERSISTENT_NAV__ = true;

  let appLoaded = !!document.querySelector('script[src$="js/app.js"]');
  let navigating = false;

  function persistentNodes() {
    return [
      document.getElementById("ff-audio-player"),
      document.getElementById("grytzen-silence-toggle")
    ].filter(Boolean);
  }

  function attachControls() {
    const brand = document.querySelector(".site-header .brand, header .brand");
    const toggle = document.getElementById("grytzen-silence-toggle");
    const medallion = document.getElementById("ff-audio-player");
    const home = !!document.querySelector(".home-manifesto");

    if (toggle && brand) {
      toggle.classList.remove("gry-floating");
      brand.insertAdjacentElement("afterend", toggle);
      toggle.classList.add("gry-header-control");
      toggle.style.display = "inline-flex";
    }
    if (medallion) {
      if (home) {
        const target = document.querySelector(".home-manifesto");
        if (target && medallion.parentElement !== target) target.insertBefore(medallion, target.firstChild);
        medallion.style.display = "";
      } else {
        // Le médaillon complet reste réservé à l'accueil, mais le lecteur audio reste vivant.
        medallion.style.display = "none";
        document.body.appendChild(medallion);
      }
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
      window.scrollTo(0, 0);
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