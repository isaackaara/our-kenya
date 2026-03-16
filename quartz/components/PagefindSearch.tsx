import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const PagefindSearch: QuartzComponent = ({ displayClass }: QuartzComponentProps) => {
  return (
    <div class={classNames(displayClass, "search")}>
      <button class="search-button" id="pagefind-trigger">
        <svg role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 19.9 19.7">
          <title>Search</title>
          <g class="search-path" fill="none">
            <path stroke-linecap="square" d="M18.5 18.3l-5.4-5.4" />
            <circle cx="8" cy="8" r="7" />
          </g>
        </svg>
        <p>Search</p>
      </button>
      <div id="pagefind-container" style="display:none; position:fixed; inset:0; z-index:9999; background:rgba(0,0,0,0.5);">
        <div style="max-width:600px; margin:10vh auto; background:var(--light); border-radius:8px; padding:1.5rem; max-height:80vh; overflow-y:auto;">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
            <strong>Search</strong>
            <button id="pagefind-close" style="background:none; border:none; font-size:1.5rem; cursor:pointer; color:var(--dark);">&times;</button>
          </div>
          <div id="pagefind-search"></div>
        </div>
      </div>
      <script dangerouslySetInnerHTML={{ __html: `
(function() {
  let loaded = false;
  function setup() {
    const trigger = document.getElementById('pagefind-trigger');
    const container = document.getElementById('pagefind-container');
    const closeBtn = document.getElementById('pagefind-close');
    if (!trigger || !container || !closeBtn) return;

    trigger.onclick = async function() {
      container.style.display = '';
      if (!loaded) {
        loaded = true;
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = '/pagefind/pagefind-ui.css';
        document.head.appendChild(link);
        const script = document.createElement('script');
        script.src = '/pagefind/pagefind-ui.js';
        script.onload = function() {
          new PagefindUI({ element: '#pagefind-search', showSubResults: true });
          setTimeout(function() {
            var input = document.querySelector('#pagefind-search input');
            if (input) input.focus();
          }, 100);
        };
        document.head.appendChild(script);
      } else {
        setTimeout(function() {
          var input = document.querySelector('#pagefind-search input');
          if (input) input.focus();
        }, 100);
      }
    };

    closeBtn.onclick = function() {
      container.style.display = 'none';
    };

    container.onclick = function(e) {
      if (e.target === container) container.style.display = 'none';
    };
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setup);
  } else {
    setup();
  }
  document.addEventListener('nav', function() { loaded = false; setup(); });
})();
      `}} />
    </div>
  )
}

export default (() => PagefindSearch) satisfies QuartzComponentConstructor
