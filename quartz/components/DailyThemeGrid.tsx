import { QuartzComponent, QuartzComponentConstructor } from "./types"

const themes = [
  { name: "Presidencies", href: "/Presidencies", tag: "Five men. One republic. Six decades of power." },
  { name: "Counties", href: "/Counties", tag: "All 47 counties - history, geography, and the stories inside them." },
  { name: "Elections", href: "/Elections", tag: "Every general election from 1963. The contests that shaped the nation." },
  { name: "Corruption", href: "/Corruption", tag: "Goldenberg. Anglo Leasing. Eurobond. The patronage state in full." },
  { name: "Sports", href: "/Sports", tag: "The runners, the footballers, the rugby sevens, and what sport means here." },
  { name: "Conservation", href: "/Conservation", tag: "Parks, poaching, ivory, and the colonial model that still shapes wildlife policy." },
  { name: "Kikuyu", href: "/Kikuyu", tag: "Land, resistance, independence, and the dominant political tradition." },
  { name: "Luo", href: "/Luo", tag: "The lake, the intellect, Oginga, Raila, and the long opposition." },
  { name: "Kalenjin", href: "/Kalenjin", tag: "Runners, the Rift Valley, Moi, and a constructed identity." },
  { name: "Swahili", href: "/Swahili", tag: "The coast, the city-states, the Indian Ocean, a thousand years of trade." },
  { name: "Legacy", href: "/Legacy", tag: "Colonialism's afterlife: land, language, church, and the wounds that won't close." },
  { name: "East Africa", href: "/East-Africa", tag: "Kenya in its regional context - the EAC, the borders, the shared history." },
  { name: "Maasai", href: "/Maasai", tag: "Cattle, beadwork, warriors, and a culture that refused to disappear." },
  { name: "Literature", href: "/Literature", tag: "Ngugi, Ogot, Mwangi - the writers who told Kenya to itself." },
  { name: "Women", href: "/Women", tag: "From Wangari to Mekatilili. The women who shaped Kenya." },
  { name: "Religion", href: "/Religion", tag: "Mission schools, mosques, revival, and the competition for Kenyan souls." },
  { name: "Colonial Kenya", href: "/Colonial-Kenya", tag: "The making of a colony - and the costs Kenya is still paying." },
  { name: "Music", href: "/Music", tag: "Benga, taarab, gospel, genge - the soundtrack of a nation." },
  { name: "Coast History", href: "/Coast-History", tag: "A thousand years before the railway. The Swahili coast and its deep past." },
  { name: "Labour", href: "/Labour", tag: "Who built this country? Migrant workers, squatters, dockworkers, and the history of Kenyan labour." },
  { name: "Diaspora", href: "/Diaspora", tag: "Kenyans abroad - who left, why they left, and what they carried." },
  { name: "Technology", href: "/Technology", tag: "From M-Pesa to Silicon Savannah. How Kenya went digital." },
  { name: "Education", href: "/Education", tag: "The school system that built a nation - and its limits." },
  { name: "Media", href: "/Media", tag: "Radio, newspapers, TV, and the fight for a free press." },
  { name: "Architecture", href: "/Architecture", tag: "Nairobi's buildings tell a history. So do the ones that were never built." },
]

const DailyThemeGrid: QuartzComponent = () => {
  return null
}

DailyThemeGrid.afterDOMLoaded = `
(function() {
  var themes = ${JSON.stringify(themes)};
  function seededShuffle(arr, seed) {
    var a = arr.slice();
    var s = seed;
    for (var i = a.length - 1; i > 0; i--) {
      s = (s * 1664525 + 1013904223) & 0xffffffff;
      var j = Math.abs(s) % (i + 1);
      var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
  }
  function render() {
    var grid = document.getElementById("ok-theme-grid");
    if (!grid) return;
    var today = Math.floor(Date.now() / 86400000);
    var pick10 = seededShuffle(themes, today).slice(0, 10);
    var html = "";
    for (var i = 0; i < pick10.length; i++) {
      var t = pick10[i];
      html += '<a href="' + t.href + '" class="ok-vertical-card"><strong>' + t.name + '</strong><span>' + t.tag + '</span></a>';
    }
    grid.innerHTML = html;
  }
  render();
  document.addEventListener("nav", render);
  // Fallback: module evaluation may race with SPA boot - fire again once page settles
  if (document.readyState !== "complete") {
    window.addEventListener("load", render);
  }
  setTimeout(render, 50);
})();
`

export default (() => DailyThemeGrid) satisfies QuartzComponentConstructor
