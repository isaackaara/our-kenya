---
title: Our Kenya
description: History written by Kenyans, for everyone. 3,900 notes on Kenya's counties, peoples, elections, and presidencies.
cssclasses:
  - homepage
---

<div class="ok-hero">
<p class="ok-tagline">History written by Kenyans, for everyone.</p>
<p class="ok-intro">3,900 notes. 47 counties. Five presidencies. Hundreds of ethnic stories. One connected knowledge graph of Kenya's past - and present.</p>
<div class="ok-cta-row">
<a href="Kenya" class="ok-cta-primary">Start exploring</a>
<a href="STORY-TRAILS" class="ok-cta-secondary">Browse Story Trails</a>
<a href="contribute" class="ok-cta-outline">Suggest a topic</a>
</div>
</div>

## Explore by storyline

Ten journeys that changed how we see Kenya. Each one pulls you deeper.

<div class="ok-verticals">
<a href="/Trails/The-Reluctant-Father" class="ok-vertical-card">
<strong>The Reluctant Father</strong>
<span>Kenyatta: from detainee to founding father.</span>
</a>
<a href="/Trails/Mau-Mau:-The-Forest-War" class="ok-vertical-card">
<strong>Mau Mau: The Forest War</strong>
<span>The guerrilla war that broke British Kenya.</span>
</a>
<a href="/Trails/Tom-Mboya:-The-Man-Who-Should-Have-Been-President" class="ok-vertical-card">
<strong>Tom Mboya: The Man Who Should Have Been President</strong>
<span>The assassination that changed everything.</span>
</a>
<a href="/Trails/When-Kenya-Burned:-2007-08" class="ok-vertical-card">
<strong>When Kenya Burned: 2007-08</strong>
<span>1,300 dead. How democracy failed.</span>
</a>
<a href="/Trails/The-Running-Phenomenon" class="ok-vertical-card">
<strong>The Running Phenomenon</strong>
<span>How a small community became the world's greatest runners.</span>
</a>
<a href="/Trails/Goldenberg:-The-Heist" class="ok-vertical-card">
<strong>Goldenberg: The Heist</strong>
<span>The gold scam that cost Kenya billions.</span>
</a>
<a href="/Trails/The-Land-Question" class="ok-vertical-card">
<strong>The Land Question</strong>
<span>From colonial theft to modern inequality.</span>
</a>
<a href="/Trails/Wangari-Maathai:-Trees-and-Freedom" class="ok-vertical-card">
<strong>Wangari Maathai: Trees and Freedom</strong>
<span>A Nobel Prize. 30 million trees. A movement.</span>
</a>
<a href="/Trails/Anglo-Leasing:-Phantom-Contracts" class="ok-vertical-card">
<strong>Anglo Leasing: Phantom Contracts</strong>
<span>Ghost firms, real money, no accountability.</span>
</a>
<a href="/Trails/The-Coastal-Land-Problem" class="ok-vertical-card">
<strong>The Coastal Land Problem</strong>
<span>600 years of ownership. Still unresolved.</span>
</a>
</div>

<p class="ok-see-all"><a href="STORY-TRAILS">See all 141 storylines →</a></p>

## Explore by theme

Every theme has its own index. Start at any node - the graph takes you further.

<div class="ok-verticals" id="ok-theme-grid"></div>

<script>
(function() {
  var themes = [
    {name:"Presidencies",href:"/Presidencies",tag:"Five men. One republic. Six decades of power."},
    {name:"Counties",href:"/Counties",tag:"All 47 counties - history, geography, and the stories inside them."},
    {name:"Elections",href:"/Elections",tag:"Every general election from 1963. The contests that shaped the nation."},
    {name:"Corruption",href:"/Corruption",tag:"Goldenberg. Anglo Leasing. Eurobond. The patronage state in full."},
    {name:"Sports",href:"/Sports",tag:"The runners, the footballers, the rugby sevens, and what sport means here."},
    {name:"Conservation",href:"/Conservation",tag:"Parks, poaching, ivory, and the colonial model that still shapes wildlife policy."},
    {name:"Kikuyu",href:"/Kikuyu",tag:"Land, resistance, independence, and the dominant political tradition."},
    {name:"Luo",href:"/Luo",tag:"The lake, the intellect, Oginga, Raila, and the long opposition."},
    {name:"Kalenjin",href:"/Kalenjin",tag:"Runners, the Rift Valley, Moi, and a constructed identity."},
    {name:"Swahili",href:"/Swahili",tag:"The coast, the city-states, the Indian Ocean, a thousand years of trade."},
    {name:"Legacy",href:"/Legacy",tag:"Colonialism's afterlife: land, language, church, and the wounds that won't close."},
    {name:"East Africa",href:"/East-Africa",tag:"Kenya in its regional context - the EAC, the borders, the shared history."},
    {name:"Maasai",href:"/Maasai",tag:"Cattle, beadwork, warriors, and a culture that refused to disappear."},
    {name:"Indian Ocean",href:"/Indian-Ocean",tag:"Kenya's eastern face - the dhows, the traders, the monsoon economy."},
    {name:"Women",href:"/Women",tag:"From Wangari to Mekatilili. The women who shaped Kenya."},
    {name:"Religion",href:"/Religion",tag:"Mission schools, mosques, revival, and the competition for Kenyan souls."},
    {name:"Land",href:"/Land",tag:"Who owns Kenya? The question that has never been answered."},
    {name:"Music",href:"/Music",tag:"Benga, taarab, gospel, genge - the soundtrack of a nation."},
    {name:"Mau Mau",href:"/Mau-Mau",tag:"The forest war, the detention camps, the unfinished reckoning."},
    {name:"Nairobi",href:"/Nairobi",tag:"From a railway depot to East Africa's capital city."},
    {name:"Diaspora",href:"/Diaspora",tag:"Kenyans abroad - who left, why they left, and what they carried."},
    {name:"Trade",href:"/Trade",tag:"The economy of East Africa, from the caravan routes to M-Pesa."},
    {name:"Education",href:"/Education",tag:"The school system that built a nation - and its limits."},
    {name:"Media",href:"/Media",tag:"Radio, newspapers, TV, and the fight for a free press."},
    {name:"Constitution",href:"/Constitution",tag:"The long road to the 2010 constitution - Kenya's second republic."}
  ];
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
  var today = Math.floor(Date.now() / 86400000);
  var pick10 = seededShuffle(themes, today).slice(0, 10);
  var grid = document.getElementById("ok-theme-grid");
  if (grid) {
    var html = "";
    for (var i = 0; i < pick10.length; i++) {
      var t = pick10[i];
      html += '<a href="' + t.href + '" class="ok-vertical-card"><strong>' + t.name + '</strong><span>' + t.tag + '</span></a>';
    }
    grid.innerHTML = html;
  }
})();
</script>

## Story Trails

<div class="ok-trails-callout">
<p>2,000 curated journeys through Kenya's history. Each trail is a sequence of notes ordered to tell a complete story arc. Follow the links. Every note has its own trails branching off.</p>
<p>You may not come back the same way you arrived.</p>
<p><a href="STORY-TRAILS">Browse all Story Trails</a></p>
</div>

## How this works

Our Kenya is a knowledge graph. Every note connects to others via wikilinks. The graph view on the right shows those connections in real time.

Start anywhere - [[Kenya]], a county, a president, an election. Follow any link. You're in.

There is no right place to begin. There is no wrong turn.

## Contribute

This vault grows through research and community suggestions. If you know a story Kenya should tell, we want to hear it.

<a href="contribute" class="ok-section-cta">Suggest a topic</a>
