(() => {
  // Keep bookmarks to sections that used to live on the homepage.
  if (document.body.classList.contains("home-page")) {
    const fragment = location.hash.slice(1);
    const movedSections = { publications: "publications", honors: "honors", service: "service" };
    const destination = fragment.startsWith("pub-") ? "publications" :
      Object.hasOwn(movedSections, fragment) ? movedSections[fragment] : null;
    if (destination) {
      location.replace(destination + ".html" + location.hash);
      return;
    }
  }

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll(".publication-stars").forEach(async (badge) => {
    try {
      const response = await fetch(`https://img.shields.io/github/stars/${badge.dataset.repo}?style=flat-square`);
      if (!response.ok) throw new Error("Star badge unavailable");
      const svg = new DOMParser().parseFromString(await response.text(), "image/svg+xml");
      const count = svg.querySelector('a[href$="/stargazers"] text')?.textContent.trim();
      if (!/^\d+(?:[.,]\d+)?[kKmM]?$/.test(count || "")) throw new Error("Invalid star count");
      badge.querySelector(".star-count").textContent = count;
      badge.title = `${count} GitHub stars`;
    } catch {
      badge.title = "GitHub star count unavailable";
    }
  });

  const scrollToHash = (hash, behavior = "auto") => {
    if (!hash || hash === "#") return;
    const target = document.getElementById(decodeURIComponent(hash.slice(1)));
    if (!target) return;
    target.scrollIntoView({
      behavior: prefersReducedMotion.matches ? "auto" : behavior,
      block: "start"
    });
  };

  document.addEventListener("click", (event) => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute("href");
    if (!hash || !document.getElementById(decodeURIComponent(hash.slice(1)))) return;

    event.preventDefault();
    history.pushState(null, "", hash);
    scrollToHash(hash, "smooth");
  });

  window.addEventListener("popstate", () => scrollToHash(window.location.hash));
  window.addEventListener("load", () => {
    if (window.location.hash) {
      requestAnimationFrame(() => scrollToHash(window.location.hash));
    }
  });
})();
