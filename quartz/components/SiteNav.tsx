import { QuartzComponent, QuartzComponentConstructor } from "./types"

const navLinks = [
  { href: "/STORY-TRAILS", label: "Story Trails" },
  { href: "/contribute", label: "Add to the story" },
  { href: "/support", label: "Support Our Kenya" },
]

const SiteNav: QuartzComponent = () => {
  return (
    <div class="ok-sitenav-wrapper">
      {/* Desktop: nav links shown below search */}
      <nav class="ok-sitenav">
        {navLinks.map((l) => (
          <a href={l.href} class="ok-sitenav-link">
            {l.label}
          </a>
        ))}
      </nav>

      {/* Mobile: burger button + full-screen overlay */}
      <button class="ok-burger" aria-label="Open menu" aria-expanded="false">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <line x1="4" x2="20" y1="6" y2="6" />
          <line x1="4" x2="20" y1="12" y2="12" />
          <line x1="4" x2="20" y1="18" y2="18" />
        </svg>
      </button>

      <div class="ok-nav-overlay" aria-hidden="true">
        <button class="ok-nav-close" aria-label="Close menu">✕</button>
        <nav class="ok-nav-overlay-links">
          {navLinks.map((l) => (
            <a href={l.href} class="ok-nav-overlay-link">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}

SiteNav.afterDOMLoaded = `
(function() {
  if (window._okNavInit) return;
  window._okNavInit = true;

  function init() {
    var burger = document.querySelector('.ok-burger');
    var overlay = document.querySelector('.ok-nav-overlay');
    var close = document.querySelector('.ok-nav-close');
    if (!burger || !overlay || !close) return;

    burger.onclick = function() {
      var open = overlay.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', open ? 'true' : 'false');
      overlay.setAttribute('aria-hidden', open ? 'false' : 'true');
      document.documentElement.classList.toggle('mobile-no-scroll', open);
    };

    close.onclick = function() {
      overlay.classList.remove('is-open');
      burger.setAttribute('aria-expanded', 'false');
      overlay.setAttribute('aria-hidden', 'true');
      document.documentElement.classList.remove('mobile-no-scroll');
    };

    overlay.querySelectorAll('a').forEach(function(a) {
      a.onclick = function() {
        overlay.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        overlay.setAttribute('aria-hidden', 'true');
        document.documentElement.classList.remove('mobile-no-scroll');
      };
    });
  }

  init();
  document.addEventListener('nav', function() {
    window._okNavInit = false;
    window._okNavInit = true;
    init();
  });
})();
`

export default (() => SiteNav) satisfies QuartzComponentConstructor
