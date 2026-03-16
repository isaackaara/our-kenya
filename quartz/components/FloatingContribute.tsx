import { QuartzComponent, QuartzComponentConstructor } from "./types"

const FloatingContribute: QuartzComponent = () => {
  return <></>
}

FloatingContribute.afterDOMLoaded = `
(function() {
  function setupFloatingContribute() {
    if (document.getElementById('ok-float-contribute')) return;
    var slug = window.location.pathname.replace(/\\/+$/, '');
    if (slug === '/contribute' || slug.endsWith('/contribute')) return;
    var btn = document.createElement('a');
    btn.id = 'ok-float-contribute';
    btn.href = '/contribute';
    btn.className = 'ok-float-contribute';
    btn.setAttribute('aria-label', 'Add to the story');
    btn.innerHTML = '<span class="ok-float-icon">+</span><span class="ok-float-label">Add to the story</span>';
    document.body.appendChild(btn);
  }

  function removeFloatingContribute() {
    var slug = window.location.pathname.replace(/\\/+$/, '');
    var btn = document.getElementById('ok-float-contribute');
    if (slug === '/contribute' || slug.endsWith('/contribute')) {
      if (btn) btn.remove();
    } else {
      if (!btn) setupFloatingContribute();
    }
  }

  setupFloatingContribute();
  document.addEventListener('nav', removeFloatingContribute);
  window.addCleanup && window.addCleanup(function() {
    document.removeEventListener('nav', removeFloatingContribute);
  });
})();
`

export default (() => FloatingContribute) satisfies QuartzComponentConstructor
