import {
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  select,
  drag,
  zoom,
} from "d3"

interface KGNode {
  id: string
  label: string
  type: string
  href: string
  desc: string
}

interface KGLink {
  source: string
  target: string
  type: string
  label: string
}

interface GraphDataset {
  id: string
  label: string
  nodes: KGNode[]
  links: KGLink[]
}

interface GraphCategory {
  label: string
  topics: string[]
}

const COLORS: Record<string, string> = {
  // New type scheme
  person:   "#1a1a1a",
  event:    "#8b2c2c",
  place:    "#4a7c59",
  concept:  "#2c5282",
  // Legacy types (kept for backward compat with raila graph)
  center:   "#1a1a1a",
  family:   "#c2603a",
  alliance: "#4a7c59",
  rival:    "#8b2c2c",
  entity:   "#2c5282",
}

const GRAPH_CATEGORIES: GraphCategory[] = [
  { label: "People",  topics: ["raila","jomo-kenyatta","wangari-maathai","tom-mboya","dedan-kimathi","mekatilili","paul-tergat","lupita-nyongo","richard-leakey","ngugi"] },
  { label: "History", topics: ["mau-mau","kenya-railway","pev-2007","lancaster-house","shifta-war","wagalla-massacre","garissa-attack","oathing-ceremonies"] },
  { label: "Places",  topics: ["nairobi-city","lake-turkana","mount-kenya","swahili-coast","rift-valley","lamu-island","mombasa"] },
  { label: "Culture", topics: ["sheng-language","benga-music","safari-rally","maasai-culture","swahili-architecture","kikuyu-oral-tradition"] },
  { label: "Economy", topics: ["mpesa","tea-industry","flower-farming","nse","kenya-tourism"] },
  { label: "Sports",  topics: ["kenya-athletics","harambee-stars","marathon-champions","otieno-wandera"] },
  { label: "Society", topics: ["women-parliament","land-clashes","pastoral-communities","urban-migration","kenyan-diaspora","education-history","media-history","religious-diversity","climate-drought","conservation-history"] },
]

function nodeRadius(type: string) {
  return type === "center" ? 20 : 11
}

// --- GRAPH DATA ---

const GRAPH_DATA: Record<string, GraphDataset> = {

  // =========================================================
  // PEOPLE
  // =========================================================

  "raila": {
    id: "raila",
    label: "Raila Odinga",
    nodes: [
      { id: "raila",     label: "Raila Odinga",     type: "center",   href: "/Political-Movements/Raila-Odinga",                                        desc: "Kenya's most consequential opposition figure. Five presidential runs." },
      { id: "oginga2",   label: "Oginga Odinga",    type: "family",   href: "/Political-Movements/Oginga-Odinga",                                       desc: "Father. Kenya's first Vice President. The original opposition voice." },
      { id: "uhuru",     label: "Uhuru Kenyatta",   type: "alliance", href: "/Presidencies/Uhuru-Kenyatta-Presidency/Uhuru-and-the-Opposition",         desc: "Bitter rival turned ally. The 2018 Handshake reshaped Kenyan politics." },
      { id: "kibaki",    label: "Mwai Kibaki",      type: "rival",    href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-Uhuru-Kenyatta",           desc: "2007 election rival. The disputed result triggered post-election violence." },
      { id: "ruto",      label: "William Ruto",     type: "rival",    href: "/Trails/The-Hustler%27s-Gambit%3A-William-Ruto",                           desc: "Post-2022 rival. Beat Raila in the 2022 presidential election." },
      { id: "moi2",      label: "Daniel arap Moi",  type: "alliance", href: "/Presidencies/Daniel-arap-Moi-Presidency/Moi-and-Raila-Odinga",           desc: "Detained Raila for years. Later formed a political alliance." },
      { id: "kalonzo",   label: "Kalonzo Musyoka",  type: "alliance", href: "/Kamba/Kalonzo-Musyoka-Deep-Dive",                                         desc: "Coalition partner across multiple elections. NASA alliance 2017." },
      { id: "mudavadi",  label: "Musalia Mudavadi", type: "alliance", href: "/Luhya/Musalia-Mudavadi-Deep-Dive",                                        desc: "Coalition partner. CORD and Orange movement ally." },
      { id: "odm",       label: "ODM Party",        type: "entity",   href: "/Elections/2007-Election/2007-Election-Raila-Odinga-ODM",                  desc: "Orange Democratic Movement. Raila's political vehicle since 2007." },
      { id: "e2007",     label: "2007 Election",    type: "event",    href: "/Trails/When-Kenya-Burned%3A-2007-08",                                     desc: "The disputed election that triggered Kenya's worst post-independence crisis." },
      { id: "handshake", label: "The Handshake",    type: "event",    href: "/Trails/The-Handshake",                                                    desc: "March 2018. Raila and Uhuru end their rivalry and forge a governing deal." },
      { id: "luo",       label: "Luo Community",    type: "entity",   href: "/Luo/Luo",                                                                 desc: "Raila's ethnic base. The lake, the intellect, the long opposition tradition." },
    ],
    links: [
      { source: "raila",  target: "oginga2",   type: "family",   label: "father and son" },
      { source: "raila",  target: "uhuru",     type: "alliance", label: "rivals turned allies (Handshake 2018)" },
      { source: "raila",  target: "kibaki",    type: "rival",    label: "2007 election dispute" },
      { source: "raila",  target: "ruto",      type: "rival",    label: "rivals post-2022" },
      { source: "raila",  target: "moi2",      type: "alliance", label: "detained by Moi, later allied" },
      { source: "raila",  target: "kalonzo",   type: "alliance", label: "NASA coalition 2017" },
      { source: "raila",  target: "mudavadi",  type: "alliance", label: "CORD alliance" },
      { source: "raila",  target: "odm",       type: "entity",   label: "ODM founder" },
      { source: "raila",  target: "e2007",     type: "event",    label: "disputed presidential candidate" },
      { source: "raila",  target: "handshake", type: "event",    label: "architect of the Handshake" },
      { source: "raila",  target: "luo",       type: "entity",   label: "ethnic political base" },
      { source: "uhuru",  target: "handshake", type: "event",    label: "co-architect of the Handshake" },
    ],
  },

  "jomo-kenyatta": {
    id: "jomo-kenyatta",
    label: "Jomo Kenyatta",
    nodes: [
      { id: "jomo",       label: "Jomo Kenyatta",       type: "person",  href: "/Kikuyu/Jomo-Kenyatta",                                                desc: "Founding father of Kenya. President 1963-1978. Complex, contested, consequential." },
      { id: "kapenguria", label: "Kapenguria Trial",     type: "event",   href: "/Trails/Kapenguria:-The-Trial-That-Made-a-Nation",                    desc: "Detained 1952-1961. The trial that made him a national martyr." },
      { id: "facemtkenya",label: "Facing Mount Kenya",   type: "concept", href: "/Kikuyu/Facing-Mount-Kenya",                                          desc: "His 1938 anthropology of Kikuyu society. A manifesto and a masterwork." },
      { id: "oginga",     label: "Oginga Odinga",        type: "person",  href: "/Political-Movements/Oginga-Odinga",                                  desc: "Comrade then opponent. VP who resigned over Kenyatta's rightward turn." },
      { id: "mboya-j",    label: "Tom Mboya",            type: "person",  href: "/Political-Movements/Tom-Mboya",                                      desc: "Labour organiser and KANU architect. Assassinated 1969." },
      { id: "lancaster",  label: "Lancaster House",      type: "event",   href: "/Political-Movements/The-Lancaster-House-Conferences",                desc: "The London negotiations where Kenya's independence terms were set." },
      { id: "maumau-j",   label: "Mau Mau Emergency",   type: "event",   href: "/Trails/Mau-Mau:-The-Forest-War",                                     desc: "Kenyatta detained as Mau Mau leader. The truth was more complex." },
      { id: "harambee",   label: "Harambee Philosophy",  type: "concept", href: "/Legacy/The-Independence-Dream-and-its-Limits",                      desc: "Self-help national philosophy. Practical and politically calculated." },
      { id: "gatundu",    label: "Gatundu",              type: "place",   href: "/Kikuyu/Kenyatta-Detention-Legacy",                                   desc: "Kenyatta's Gatundu homestead. The centre of Kikuyu political gravity." },
      { id: "kanu",       label: "KANU Party",           type: "concept", href: "/Elections/1963-Election",                                            desc: "Kenya African National Union. The vehicle that won independence." },
    ],
    links: [
      { source: "jomo",       target: "kapenguria",   type: "event",   label: "detained 1952-61" },
      { source: "jomo",       target: "facemtkenya",  type: "concept", label: "authored 1938" },
      { source: "jomo",       target: "oginga",       type: "person",  label: "allies turned rivals" },
      { source: "jomo",       target: "mboya-j",      type: "person",  label: "political collaborator" },
      { source: "jomo",       target: "lancaster",    type: "event",   label: "negotiated independence" },
      { source: "jomo",       target: "maumau-j",     type: "event",   label: "accused leader" },
      { source: "jomo",       target: "harambee",     type: "concept", label: "national philosophy" },
      { source: "jomo",       target: "gatundu",      type: "place",   label: "ancestral home" },
      { source: "jomo",       target: "kanu",         type: "concept", label: "founding president of KANU" },
      { source: "kanu",       target: "lancaster",    type: "event",   label: "negotiated at Lancaster" },
    ],
  },

  "wangari-maathai": {
    id: "wangari-maathai",
    label: "Wangari Maathai",
    nodes: [
      { id: "wangari",    label: "Wangari Maathai",      type: "person",  href: "/Political-Movements/Wangari-Maathai",                                    desc: "Nobel Peace Prize 2004. Founder of the Green Belt Movement. First African woman laureate." },
      { id: "greenbelt",  label: "Green Belt Movement",  type: "concept", href: "/Conservation/Green-Belt-Movement",                                       desc: "Planted 30 million trees. Mobilised women across Kenya. Global model." },
      { id: "nobel",      label: "Nobel Peace Prize",    type: "event",   href: "/Kikuyu/Wangari-Maathai-Nobel-Prize-2004",                                 desc: "2004. First African woman to win. Link between environment and peace." },
      { id: "moi-w",      label: "Daniel arap Moi",      type: "person",  href: "/Presidencies/Daniel-arap-Moi-Presidency/Moi-and-Wangari-Maathai",        desc: "Persecuted her for decades. She refused to stop." },
      { id: "narc",       label: "NARC Coalition",       type: "event",   href: "/Elections/2002-Election/2002-Election-NARC-Coalition",                   desc: "The coalition that ended Moi's KANU era. Wangari was part of this political wave." },
      { id: "trail-w",    label: "Trees and Freedom",    type: "concept", href: "/Trails/Wangari-Maathai:-Trees-and-Freedom",                              desc: "Full story trail: from Nyeri to Oslo." },
      { id: "conservation-w", label: "Conservation Legacy", type: "concept", href: "/Conservation/Wangari-Maathai",                                       desc: "Her conservation legacy: forest restoration, soil, women's empowerment." },
      { id: "women-w",    label: "Women Green Belt",     type: "person",  href: "/Women/Wangari-Maathai-Green-Belt",                                        desc: "How the movement mobilised rural women as its core agents." },
    ],
    links: [
      { source: "wangari", target: "greenbelt",      type: "concept", label: "founder" },
      { source: "wangari", target: "nobel",          type: "event",   label: "won 2004" },
      { source: "wangari", target: "moi-w",          type: "person",  label: "persecuted for years" },
      { source: "wangari", target: "narc",           type: "event",   label: "joined democracy wave" },
      { source: "wangari", target: "trail-w",        type: "concept", label: "full story" },
      { source: "wangari", target: "conservation-w", type: "concept", label: "conservation legacy" },
      { source: "wangari", target: "women-w",        type: "person",  label: "women led the movement" },
      { source: "greenbelt", target: "women-w",      type: "person",  label: "women as agents" },
    ],
  },

  "tom-mboya": {
    id: "tom-mboya",
    label: "Tom Mboya",
    nodes: [
      { id: "mboya",       label: "Tom Mboya",           type: "person",  href: "/Political-Movements/Tom-Mboya",                                      desc: "Labour organiser, KANU architect, Pan-Africanist. Shot in Nairobi 1969." },
      { id: "airlift",     label: "Kenya Airlift",       type: "event",   href: "/Trails/Tom-Mboya:-The-Man-Who-Should-Have-Been-President",           desc: "Mboya arranged scholarships to US universities for hundreds of Kenyans." },
      { id: "obama-sr",    label: "Barack Obama Sr",     type: "person",  href: "/Trails/Barack-Obama-Sr:-The-Brilliant-Wastrel",                      desc: "Came to Hawaii on the Airlift. Father of the 44th US President." },
      { id: "kenyatta-m",  label: "Jomo Kenyatta",       type: "person",  href: "/Kikuyu/Jomo-Kenyatta",                                               desc: "Political partner. Kenyatta's government was Mboya's arena." },
      { id: "assassination", label: "1969 Assassination", type: "event",  href: "/Presidencies/Jomo-Kenyatta-Presidency/Tom-Mboya-Assassination-1969", desc: "Shot dead on Government Road, Nairobi. July 1969. A nation's trajectory altered." },
      { id: "kanu-m",      label: "KANU Secretary-General", type: "concept", href: "/Elections/1963-Election",                                        desc: "Mboya was KANU's first Secretary-General. He organised the party into a machine." },
      { id: "panafricanism", label: "Pan-Africanism",    type: "concept", href: "/Trails/If-Mboya-Had-Lived",                                          desc: "Mboya believed in African unity. His AATUF connected labour movements continentally." },
      { id: "oginga-m",    label: "Oginga Odinga",       type: "person",  href: "/Political-Movements/Oginga-Odinga",                                  desc: "Fellow Luo politician. Complex alliance and rivalry within KANU." },
      { id: "mboyastreet", label: "Tom Mboya Street",    type: "place",   href: "/Europeans/Nairobi%27s-Founding",                                     desc: "Named in his honour. Central Nairobi. A small memorial to a giant." },
    ],
    links: [
      { source: "mboya",       target: "airlift",      type: "event",   label: "organised the Airlift" },
      { source: "airlift",     target: "obama-sr",     type: "person",  label: "Obama Sr came on the Airlift" },
      { source: "mboya",       target: "kenyatta-m",   type: "person",  label: "political partner" },
      { source: "mboya",       target: "assassination", type: "event",  label: "assassinated 1969" },
      { source: "mboya",       target: "kanu-m",       type: "concept", label: "Secretary-General" },
      { source: "mboya",       target: "panafricanism", type: "concept", label: "Pan-African vision" },
      { source: "mboya",       target: "oginga-m",     type: "person",  label: "Luo political rivals" },
      { source: "mboya",       target: "mboyastreet",  type: "place",   label: "street named after him" },
      { source: "kenyatta-m",  target: "assassination", type: "event",  label: "under his presidency" },
    ],
  },

  "dedan-kimathi": {
    id: "dedan-kimathi",
    label: "Dedan Kimathi",
    nodes: [
      { id: "kimathi",    label: "Dedan Kimathi",       type: "person",  href: "/Kikuyu/Dedan-Kimathi",                                             desc: "Mau Mau field marshal. Led the forest fighters. Executed 1957." },
      { id: "maumau-k",   label: "Mau Mau Forest War",  type: "event",   href: "/Trails/Mau-Mau:-The-Forest-War",                                   desc: "The armed uprising that made British rule untenable in Kenya." },
      { id: "aberdare",   label: "Aberdare Forest",     type: "place",   href: "/Trails/Dedan-Kimathi%27s-Last-Days",                               desc: "The forest where the Mau Mau fighters lived and fought." },
      { id: "capture",    label: "Capture 1956",        type: "event",   href: "/Trails/Dedan-Kimathi%27s-Last-Days",                               desc: "Captured wounded near Nyeri in October 1956. Betrayed." },
      { id: "execution",  label: "Execution 1957",      type: "event",   href: "/Trails/Dedan-Kimathi%27s-Last-Days",                               desc: "Hanged at Kamiti Prison, February 18 1957. The last major Mau Mau leader." },
      { id: "emergency",  label: "State of Emergency",  type: "event",   href: "/Kikuyu/Detention-Camps",                                           desc: "Declared October 1952. Started the formal suppression of Mau Mau." },
      { id: "land-k",     label: "Land Dispossession",  type: "concept", href: "/Trails/The-Land-Question",                                         desc: "The theft of Kikuyu land by white settlers. The root of Mau Mau." },
      { id: "freedom",    label: "Freedom Fighter Legacy", type: "concept", href: "/Legacy/The-Independence-Dream-and-its-Limits",                  desc: "Now a national hero. His statue stands on Kimathi Street, Nairobi." },
      { id: "detention",  label: "Detention Camps",     type: "place",   href: "/Trails/The-Emergency-Detention-Camps",                             desc: "Thousands detained. Brutal interrogation. The Pipeline system." },
    ],
    links: [
      { source: "kimathi",  target: "maumau-k",  type: "event",   label: "field marshal" },
      { source: "kimathi",  target: "aberdare",  type: "place",   label: "operated from the forest" },
      { source: "kimathi",  target: "capture",   type: "event",   label: "captured 1956" },
      { source: "kimathi",  target: "execution", type: "event",   label: "executed 1957" },
      { source: "maumau-k", target: "emergency", type: "event",   label: "triggered emergency" },
      { source: "maumau-k", target: "land-k",    type: "concept", label: "rooted in land loss" },
      { source: "kimathi",  target: "freedom",   type: "concept", label: "national hero legacy" },
      { source: "emergency", target: "detention", type: "place",  label: "led to mass detention" },
      { source: "land-k",   target: "maumau-k",  type: "event",   label: "drove Mau Mau" },
    ],
  },

  "mekatilili": {
    id: "mekatilili",
    label: "Mekatilili wa Menza",
    nodes: [
      { id: "mekatilili",  label: "Mekatilili wa Menza",   type: "person",  href: "/Mijikenda/Mekatilili-wa-Menza",                                    desc: "Giriama elder who led her community against British rule in 1913." },
      { id: "giriama",     label: "Giriama Uprising 1913", type: "event",   href: "/Mijikenda/Mekatilili-wa-Menza-Extended",                          desc: "Mekatilili mobilised the Giriama to resist forced labour and taxation." },
      { id: "wanje",       label: "Wanje wa Mwadorikola",  type: "person",  href: "/Mijikenda/Mekatilili-wa-Menza",                                    desc: "Male council leader who worked alongside Mekatilili in the uprising." },
      { id: "british-m",   label: "British Administration", type: "concept", href: "/Mijikenda/Mekatilili-wa-Menza-Extended",                         desc: "The colonial regime Mekatilili defied. Forced labour, taxation, land." },
      { id: "detention-m", label: "Detention 1914",        type: "event",   href: "/Mijikenda/Mekatilili-wa-Menza-Extended",                          desc: "Deported to Kismayu then escaped. Her escape itself became legend." },
      { id: "return",      label: "Return and Revival",    type: "event",   href: "/Mijikenda/Mekatilili-wa-Menza-Extended",                          desc: "Escaped detention and returned to continue resistance." },
      { id: "mijikenda",   label: "Mijikenda Heritage",    type: "concept", href: "/Mijikenda/Mijikenda-and-Tourism",                                 desc: "The nine Mijikenda communities of the Kenyan coast." },
      { id: "malindi-m",   label: "Malindi Region",        type: "place",   href: "/Swahili/Malindi",                                                 desc: "The coastal hinterland where the Giriama lived and where the uprising began." },
      { id: "legacy-m",    label: "Anti-Colonial Legacy",  type: "concept", href: "/Legacy/The-Independence-Dream-and-its-Limits",                   desc: "Mekatilili is now a national hero - a woman who said no before it was popular." },
    ],
    links: [
      { source: "mekatilili", target: "giriama",    type: "event",   label: "led the uprising" },
      { source: "mekatilili", target: "wanje",      type: "person",  label: "worked alongside" },
      { source: "mekatilili", target: "british-m",  type: "concept", label: "resisted" },
      { source: "mekatilili", target: "detention-m", type: "event",  label: "detained 1914" },
      { source: "mekatilili", target: "return",     type: "event",   label: "escaped and returned" },
      { source: "giriama",    target: "british-m",  type: "concept", label: "against British rule" },
      { source: "mekatilili", target: "mijikenda",  type: "concept", label: "Giriama community" },
      { source: "mekatilili", target: "malindi-m",  type: "place",   label: "coastal hinterland" },
      { source: "mekatilili", target: "legacy-m",   type: "concept", label: "national hero" },
    ],
  },

  "paul-tergat": {
    id: "paul-tergat",
    label: "Paul Tergat",
    nodes: [
      { id: "tergat",      label: "Paul Tergat",              type: "person",  href: "/Sports/Paul-Tergat",                        desc: "Five-time World Cross Country champion. Berlin 2003 world marathon record." },
      { id: "crosscountry",label: "World Cross Country",      type: "event",   href: "/Sports/Kenya-Cross-Country-Tradition",      desc: "Tergat won five consecutive titles 1999-2003. Dominant across the mud." },
      { id: "berlin-t",    label: "Berlin 2003 World Record", type: "event",   href: "/Sports/Berlin-Marathon-Kenya",              desc: "2:04:55. World marathon record at the time. Took it off Khalid Khannouchi." },
      { id: "gebre",       label: "Haile Gebrselassie",       type: "person",  href: "/Sports/Kenya-Athletics-Overview",           desc: "Ethiopian rival. They pushed each other to records across two decades." },
      { id: "atlanta",     label: "Atlanta Olympics 1996",    type: "event",   href: "/Sports/Kenya-1996-Atlanta-Olympics",        desc: "Silver medal in the 10,000m. Behind Gebrselassie. His great Olympic near-miss." },
      { id: "kabarnet",    label: "Baringo County",           type: "place",   href: "/Counties/Baringo",                          desc: "Tergat's home. The Tugen Hills. Kenya's running highland tradition." },
      { id: "kalenjin-t",  label: "Kalenjin Running Culture", type: "concept", href: "/Kalenjin/Eliud-Kipchoge-Deep-Dive",         desc: "The highland tradition, altitude, and culture that produces champions." },
      { id: "unhcr",       label: "UNHCR Goodwill",           type: "concept", href: "/Sports/Paul-Tergat",                        desc: "Tergat became a UNHCR Goodwill Ambassador. Athletics platform for advocacy." },
      { id: "marathonmaj", label: "Marathon Majors",          type: "concept", href: "/Sports/Kenya-Marathon-Majors",              desc: "Boston, Berlin, London, Tokyo, Chicago, New York. Tergat set records." },
    ],
    links: [
      { source: "tergat",      target: "crosscountry", type: "event",   label: "five world titles" },
      { source: "tergat",      target: "berlin-t",     type: "event",   label: "world record 2003" },
      { source: "tergat",      target: "gebre",        type: "person",  label: "greatest rival" },
      { source: "tergat",      target: "atlanta",      type: "event",   label: "Olympic silver 1996" },
      { source: "tergat",      target: "kabarnet",     type: "place",   label: "home county" },
      { source: "tergat",      target: "kalenjin-t",   type: "concept", label: "Kalenjin running tradition" },
      { source: "tergat",      target: "unhcr",        type: "concept", label: "UNHCR ambassador" },
      { source: "tergat",      target: "marathonmaj",  type: "concept", label: "marathon legacy" },
      { source: "gebre",       target: "berlin-t",     type: "event",   label: "Tergat broke his record" },
    ],
  },

  "lupita-nyongo": {
    id: "lupita-nyongo",
    label: "Lupita Nyong'o",
    nodes: [
      { id: "lupita",      label: "Lupita Nyong'o",        type: "person",  href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Academy Award winner. Global star. Born in Mexico City, raised in Nairobi, Luo heritage." },
      { id: "oscar",       label: "Academy Award 2014",    type: "event",   href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Best Supporting Actress for 12 Years a Slave. First Kenyan Oscar winner." },
      { id: "12years",     label: "12 Years a Slave",      type: "event",   href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Steve McQueen's film. Lupita played Patsey. A devastating performance." },
      { id: "blackpanther", label: "Black Panther",        type: "event",   href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Marvel's global hit. Lupita as Nakia. Black excellence on screen." },
      { id: "nairobi-l",   label: "Nairobi Upbringing",   type: "place",   href: "/Europeans/Nairobi%27s-Founding",                    desc: "Grew up in Nairobi. Her father is politician Peter Anyang' Nyong'o." },
      { id: "luo-l",       label: "Luo Identity",          type: "concept", href: "/Luo/Luo",                                           desc: "Luo heritage is central to how Lupita understands herself." },
      { id: "yale",        label: "Yale School of Drama",  type: "place",   href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Trained at Yale. Where she refined her craft before the world noticed." },
      { id: "global",      label: "Global African Icon",   type: "concept", href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "A face of global Black representation. Beauty, talent, and politics combined." },
      { id: "mexico",      label: "Mexico City Birth",     type: "place",   href: "/Trails/Lupita-Nyong%27o%3A-The-Global-Luo",         desc: "Born in Mexico City. The family returned to Nairobi. Three worlds, one person." },
    ],
    links: [
      { source: "lupita",      target: "oscar",        type: "event",   label: "won Oscar 2014" },
      { source: "oscar",       target: "12years",      type: "event",   label: "for 12 Years a Slave" },
      { source: "lupita",      target: "blackpanther", type: "event",   label: "starred in" },
      { source: "lupita",      target: "nairobi-l",    type: "place",   label: "grew up here" },
      { source: "lupita",      target: "luo-l",        type: "concept", label: "Luo heritage" },
      { source: "lupita",      target: "yale",         type: "place",   label: "trained at Yale" },
      { source: "lupita",      target: "global",       type: "concept", label: "global icon" },
      { source: "lupita",      target: "mexico",       type: "place",   label: "born in Mexico" },
      { source: "nairobi-l",   target: "luo-l",        type: "concept", label: "Luo community in Nairobi" },
    ],
  },

  "richard-leakey": {
    id: "richard-leakey",
    label: "Richard Leakey",
    nodes: [
      { id: "richard",    label: "Richard Leakey",         type: "person",  href: "/Conservation/Richard-Leakey",                              desc: "Palaeontologist, conservationist, and politician. Found Turkana Boy. Built KWS." },
      { id: "turkanaboy", label: "Turkana Boy",            type: "event",   href: "/Turkana/Turkana-Boy",                                      desc: "1.6 million years old. Found by the Leakey team 1984. Most complete early human." },
      { id: "koobi-r",    label: "Koobi Fora",             type: "place",   href: "/Counties/Turkana-County/Koobi-Fora",                       desc: "The fossil site on the eastern shore of Lake Turkana. Extraordinary finds." },
      { id: "kws",        label: "Kenya Wildlife Service", type: "concept", href: "/Trails/Richard-Leakey:-The-Man-Who-Built-Conservation",    desc: "KWS under Leakey transformed anti-poaching. Ivory burning. Game-changing." },
      { id: "ivory",      label: "Ivory Burning 1989",     type: "event",   href: "/Conservation/Conservation-Timeline-Kenya",                 desc: "Moi burned 12 tonnes of ivory on camera. Leakey orchestrated the spectacle." },
      { id: "louis",      label: "Louis Leakey",           type: "person",  href: "/Conservation/Richard-Leakey",                              desc: "Father. The original Leakey fossil hunter. Set Richard on his path." },
      { id: "museum-r",   label: "National Museum Kenya",  type: "place",   href: "/Photography/National-Museum",                             desc: "Nairobi. Home of Kenya's fossil record. Richard led it." },
      { id: "politics-r", label: "Kenyan Politics",        type: "concept", href: "/Trails/Richard-Leakey:-The-Man-Who-Built-Conservation",    desc: "He entered politics, challenged Moi, then served under him. Unpredictable." },
      { id: "trail-r",    label: "Leakey Trail",           type: "concept", href: "/Trails/Richard-Leakey:-The-Man-Who-Built-Conservation",    desc: "Full story: fossils to wildlife to politics." },
    ],
    links: [
      { source: "richard", target: "turkanaboy", type: "event",   label: "team discovered it" },
      { source: "richard", target: "koobi-r",    type: "place",   label: "field work base" },
      { source: "richard", target: "kws",        type: "concept", label: "built and ran KWS" },
      { source: "richard", target: "ivory",      type: "event",   label: "orchestrated ivory burn" },
      { source: "richard", target: "louis",      type: "person",  label: "son of Louis" },
      { source: "richard", target: "museum-r",   type: "place",   label: "led the museum" },
      { source: "richard", target: "politics-r", type: "concept", label: "entered politics" },
      { source: "richard", target: "trail-r",    type: "concept", label: "full story" },
      { source: "koobi-r", target: "turkanaboy", type: "event",   label: "found at Koobi Fora" },
    ],
  },

  "ngugi": {
    id: "ngugi",
    label: "Ngugi wa Thiong'o",
    nodes: [
      { id: "ngugi",      label: "Ngugi wa Thiong'o",       type: "person",  href: "/Kikuyu/Ngugi-wa-Thiong-o",                                      desc: "Kenya's greatest novelist. Writing in Gikuyu as political act. Nobel Prize contender." },
      { id: "weepnot",    label: "Weep Not Child 1964",     type: "event",   href: "/Literature/Ngugi-wa-Thiong%27o-Literature",                     desc: "First novel. First East African novel in English. Mau Mau seen through a child's eyes." },
      { id: "detention",  label: "Detention 1977",          type: "event",   href: "/Political-Movements/Ngugi-wa-Thiong%27o-Detention",             desc: "Detained without trial by Moi's government. Held for a year. No charges filed." },
      { id: "kamiriithu", label: "Kamiriithu Theatre",      type: "place",   href: "/Political-Movements/Ngugi-wa-Thiong%27o-Detention",             desc: "Community theatre project in Limuru. The play got him detained." },
      { id: "decolonise", label: "Decolonising the Mind",   type: "concept", href: "/Legacy/Ngugi-wa-Thiong%27o-as-Legacy-Figure",                  desc: "His 1986 essay collection. The case for African-language literature." },
      { id: "gikuyu",     label: "Writing in Gikuyu",       type: "concept", href: "/Legacy/Ngugi-wa-Thiong%27o-as-Legacy-Figure",                  desc: "Abandoned English after Petals of Blood. Wrote Caitaani Mutharaba-ini in Gikuyu." },
      { id: "alliance",   label: "Alliance High School",    type: "place",   href: "/Education/Alliance-High-School-Elite",                          desc: "Kenya's elite school. Where Ngugi first encountered serious literature." },
      { id: "exile",      label: "Exile",                   type: "event",   href: "/Political-Movements/Ngugi-wa-Thiong%27o-Detention",             desc: "Left Kenya 1982. Returned only in 2004 after Moi's fall." },
      { id: "settler-n",  label: "Settler Colonialism",     type: "concept", href: "/Europeans/Ngugi-wa-Thiong%27o-on-the-Settler",                  desc: "His writing dissects how colonialism operates through culture and language." },
    ],
    links: [
      { source: "ngugi",      target: "weepnot",    type: "event",   label: "debut novel 1964" },
      { source: "ngugi",      target: "detention",  type: "event",   label: "detained 1977-78" },
      { source: "ngugi",      target: "kamiriithu", type: "place",   label: "community theatre" },
      { source: "ngugi",      target: "decolonise", type: "concept", label: "authored 1986" },
      { source: "ngugi",      target: "gikuyu",     type: "concept", label: "choice to write in Gikuyu" },
      { source: "ngugi",      target: "alliance",   type: "place",   label: "educated at Alliance" },
      { source: "ngugi",      target: "exile",      type: "event",   label: "exiled 1982-2004" },
      { source: "ngugi",      target: "settler-n",  type: "concept", label: "settler critique" },
      { source: "detention",  target: "exile",      type: "event",   label: "detention led to exile" },
    ],
  },

  // =========================================================
  // HISTORY
  // =========================================================

  "mau-mau": {
    id: "mau-mau",
    label: "Mau Mau",
    nodes: [
      { id: "maumau",     label: "Mau Mau",               type: "event",   href: "/Trails/Mau-Mau:-The-Forest-War",                           desc: "The armed uprising 1952-1960 that made British rule in Kenya untenable." },
      { id: "kimathi-m",  label: "Dedan Kimathi",         type: "person",  href: "/Kikuyu/Dedan-Kimathi",                                     desc: "Field marshal. The face of forest resistance. Hanged 1957." },
      { id: "emergency-m",label: "State of Emergency",    type: "event",   href: "/Kikuyu/Detention-Camps",                                   desc: "Declared October 1952. 1.5 million Kikuyu screened. Mass detention." },
      { id: "forest",     label: "Aberdare Forest",       type: "place",   href: "/Trails/Dedan-Kimathi%27s-Last-Days",                       desc: "The operational base of the forest fighters for nearly a decade." },
      { id: "oathing-m",  label: "Oathing Ceremonies",    type: "concept", href: "/Trails/The-Oathing-Ceremonies",                            desc: "The binding oaths that recruited members. Feared and misrepresented by British." },
      { id: "hola",       label: "Hola Massacre 1959",    type: "event",   href: "/Kikuyu/Detention-Camps",                                   desc: "British guards beat eleven detainees to death. It broke British resolve." },
      { id: "land-m",     label: "Land Dispossession",    type: "concept", href: "/Trails/The-Land-Question",                                 desc: "The root cause. White Highlands. Kikuyu land taken for settler farms." },
      { id: "homeguard",  label: "Home Guard",            type: "concept", href: "/Trails/The-Home-Guard:-Kikuyu-Against-Kikuyu",             desc: "Loyalist Kikuyu who fought with the British. A civil war within a liberation war." },
      { id: "elkins",     label: "Imperial Reckoning",    type: "concept", href: "/Kikuyu/Caroline-Elkins-and-Imperial-Reckoning",            desc: "Caroline Elkins' Pulitzer-winning account. Exposed the full scale of British brutality." },
      { id: "independence-m", label: "Road to Independence", type: "event", href: "/Europeans/Pipeline-of-Independence",                     desc: "Mau Mau forced the issue. Lancaster House followed. Uhuru in 1963." },
    ],
    links: [
      { source: "maumau",     target: "kimathi-m",   type: "person",  label: "field marshal" },
      { source: "maumau",     target: "emergency-m", type: "event",   label: "triggered emergency" },
      { source: "maumau",     target: "forest",      type: "place",   label: "operated from forest" },
      { source: "maumau",     target: "oathing-m",   type: "concept", label: "recruited via oaths" },
      { source: "emergency-m",target: "hola",        type: "event",   label: "camps led to Hola" },
      { source: "maumau",     target: "land-m",      type: "concept", label: "rooted in land loss" },
      { source: "maumau",     target: "homeguard",   type: "concept", label: "Kikuyu civil war" },
      { source: "maumau",     target: "elkins",      type: "concept", label: "documented by Elkins" },
      { source: "maumau",     target: "independence-m", type: "event", label: "forced independence" },
      { source: "land-m",     target: "maumau",      type: "event",   label: "dispossession drove uprising" },
    ],
  },

  "kenya-railway": {
    id: "kenya-railway",
    label: "The Kenya Railway",
    nodes: [
      { id: "railway",    label: "The Lunatic Express",   type: "event",   href: "/Asians/The-Lunatic-Express",                               desc: "The Uganda Railway. Built 1896-1901. 960km. Called 'the lunatic line' in Parliament." },
      { id: "mombasa-r",  label: "Mombasa Port",          type: "place",   href: "/Swahili/Mombasa",                                          desc: "Where it began. The Indian Ocean terminus that drove the whole project." },
      { id: "nairobi-r",  label: "Nairobi Railhead",      type: "place",   href: "/Europeans/Nairobi%27s-Founding",                           desc: "A depot became a city. Nairobi was born because the railway stopped here." },
      { id: "lakevic",    label: "Lake Victoria",         type: "place",   href: "/Trails/The-Fishing-Economy-of-Lake-Victoria",              desc: "The destination. Connect the lake to the ocean. Open Uganda. That was the plan." },
      { id: "coolies",    label: "Indian Workers",        type: "person",  href: "/Asians/Asians-in-Kenya",                                   desc: "32,000 brought from India. 2,500 died. They built the railway and stayed." },
      { id: "tsavo",      label: "Tsavo Man-Eaters",      type: "event",   href: "/Trails/Tsavo:-Lions-and-Railway",                          desc: "Two lions killed 28-135 workers near Tsavo 1898. Construction halted." },
      { id: "british-r",  label: "British East Africa",   type: "concept", href: "/Europeans/Pipeline-of-Independence",                      desc: "The railway opened the interior to British administration and settlement." },
      { id: "asian-r",    label: "Asian Community Legacy", type: "concept", href: "/Asians/Asians-in-Kenya",                                  desc: "Railway coolies became traders, merchants, professionals. Shaped Kenya." },
      { id: "sgr",        label: "Standard Gauge Railway", type: "event",  href: "/Presidencies/Uhuru-Kenyatta-Presidency/Uhuru-and-the-Nairobi-Expressway", desc: "The 2017 SGR from Mombasa to Nairobi. A century later, the debate repeats." },
    ],
    links: [
      { source: "railway",  target: "mombasa-r",  type: "place",   label: "started at Mombasa" },
      { source: "railway",  target: "nairobi-r",  type: "place",   label: "gave birth to Nairobi" },
      { source: "railway",  target: "lakevic",    type: "place",   label: "destination" },
      { source: "railway",  target: "coolies",    type: "person",  label: "built by Indian workers" },
      { source: "railway",  target: "tsavo",      type: "event",   label: "Tsavo lion attack" },
      { source: "railway",  target: "british-r",  type: "concept", label: "opened British East Africa" },
      { source: "coolies",  target: "asian-r",    type: "concept", label: "workers who stayed" },
      { source: "nairobi-r",target: "british-r",  type: "concept", label: "colonial capital" },
      { source: "railway",  target: "sgr",        type: "event",   label: "century later SGR" },
    ],
  },

  "pev-2007": {
    id: "pev-2007",
    label: "2007 Post-Election Violence",
    nodes: [
      { id: "pev",        label: "2007-08 PEV",            type: "event",   href: "/Trails/When-Kenya-Burned%3A-2007-08",                     desc: "1,300 dead. 600,000 displaced. Kenya's worst post-independence crisis." },
      { id: "raila-p",    label: "Raila Odinga",           type: "person",  href: "/Political-Movements/Raila-Odinga",                        desc: "ODM candidate. Disputed the results. His supporters bore much of the violence." },
      { id: "kibaki-p",   label: "Mwai Kibaki",            type: "person",  href: "/Presidencies/Mwai-Kibaki-Presidency",                     desc: "Declared winner. ECK results disputed. His second term started in chaos." },
      { id: "eldoret",    label: "Eldoret Church Burning", type: "event",   href: "/Elections/2007-08-Post-Election-Violence",                desc: "Rift Valley. Dozens killed sheltering in a church. The image of the crisis." },
      { id: "ethnic",     label: "Ethnic Mobilisation",    type: "concept", href: "/Trails/Tribalism-and-the-State",                          desc: "Politicians mobilised communities against each other. A pattern with a history." },
      { id: "annan",      label: "Kofi Annan Mediation",   type: "event",   href: "/Elections/2007-08-Post-Election-Violence",                desc: "African Union mediation led by Kofi Annan. Accord signed February 2008." },
      { id: "accord",     label: "National Accord 2008",   type: "event",   href: "/Elections/2007-08-Post-Election-Violence",                desc: "Grand coalition government. Kibaki president, Raila prime minister." },
      { id: "idp",        label: "IDP Camps",              type: "place",   href: "/Elections/2007-08-Post-Election-Violence",                desc: "600,000 people displaced. Many never fully returned." },
      { id: "icc",        label: "ICC Cases",              type: "event",   href: "/Presidencies/Uhuru-Kenyatta-Presidency",                  desc: "Uhuru Kenyatta and William Ruto indicted. Cases eventually collapsed." },
      { id: "constitution-p", label: "2010 Constitution", type: "event",   href: "/Trails/The-Constitution-of-2010",                         desc: "Built partly in response to the PEV. Devolution, rights, electoral reforms." },
    ],
    links: [
      { source: "pev",         target: "raila-p",        type: "person",  label: "disputed candidate" },
      { source: "pev",         target: "kibaki-p",       type: "person",  label: "declared winner" },
      { source: "pev",         target: "eldoret",        type: "event",   label: "worst atrocity" },
      { source: "pev",         target: "ethnic",         type: "concept", label: "ethnic mobilisation" },
      { source: "pev",         target: "annan",          type: "event",   label: "Annan mediated" },
      { source: "annan",       target: "accord",         type: "event",   label: "led to National Accord" },
      { source: "pev",         target: "idp",            type: "place",   label: "mass displacement" },
      { source: "pev",         target: "icc",            type: "event",   label: "ICC indictments" },
      { source: "accord",      target: "constitution-p", type: "event",   label: "led to 2010 constitution" },
      { source: "raila-p",     target: "kibaki-p",       type: "person",  label: "opponents" },
    ],
  },

  "lancaster-house": {
    id: "lancaster-house",
    label: "Lancaster House Conference",
    nodes: [
      { id: "lancaster-c",  label: "Lancaster House",       type: "place",   href: "/Political-Movements/The-Lancaster-House-Conferences",     desc: "London. The venue where Kenya's independence constitution was negotiated." },
      { id: "kenyatta-lc",  label: "Jomo Kenyatta",         type: "person",  href: "/Kikuyu/Jomo-Kenyatta",                                    desc: "Still detained during 1960 conference. Released 1961. Led the 1962 delegation." },
      { id: "mboya-lc",     label: "Tom Mboya",             type: "person",  href: "/Political-Movements/Tom-Mboya",                           desc: "Led the KANU delegation. The sharpest negotiator in the room." },
      { id: "conf1960",     label: "First Conference 1960", type: "event",   href: "/Europeans/Lancaster-House-and-Departure",                 desc: "Agreed on majority rule. A massive British concession." },
      { id: "conf1962",     label: "Second Conference 1962", type: "event",  href: "/Europeans/Lancaster-House-and-Departure",                 desc: "Detailed constitution negotiated. Regional federalism (Majimbo) debated." },
      { id: "settlers",     label: "Settler Interests",     type: "concept", href: "/Europeans/The-Ridge-Farmers",                            desc: "White settlers fought for land and minority protections. They lost." },
      { id: "land-lc",      label: "Land Settlement",       type: "concept", href: "/Trails/The-Land-Question",                               desc: "The land question was fudged. Million Acre Settlement Scheme was the compromise." },
      { id: "independence-lc", label: "Independence 1963", type: "event",   href: "/Europeans/Pipeline-of-Independence",                     desc: "December 12 1963. The outcome of what Lancaster House started." },
      { id: "majimbo",      label: "Majimbo Federalism",    type: "concept", href: "/Elections/1963-Election",                                desc: "KADU pushed for regional government. KANU dismantled it after independence." },
    ],
    links: [
      { source: "lancaster-c",  target: "kenyatta-lc",    type: "person",  label: "leading figure" },
      { source: "lancaster-c",  target: "mboya-lc",       type: "person",  label: "key negotiator" },
      { source: "lancaster-c",  target: "conf1960",       type: "event",   label: "first conference" },
      { source: "lancaster-c",  target: "conf1962",       type: "event",   label: "second conference" },
      { source: "lancaster-c",  target: "settlers",       type: "concept", label: "settlers tried to preserve privilege" },
      { source: "lancaster-c",  target: "land-lc",        type: "concept", label: "land question" },
      { source: "lancaster-c",  target: "independence-lc", type: "event",  label: "led to independence" },
      { source: "conf1962",     target: "majimbo",        type: "concept", label: "Majimbo debated" },
      { source: "settlers",     target: "land-lc",        type: "concept", label: "settlers fought for land" },
    ],
  },

  "shifta-war": {
    id: "shifta-war",
    label: "Shifta War",
    nodes: [
      { id: "shifta",     label: "Shifta War",             type: "event",   href: "/Military/Shifta-War",                                      desc: "1963-1967. Somali separatists in NFD fought to join Somalia. Kenya's first post-independence conflict." },
      { id: "nfd",        label: "Northern Frontier District", type: "place", href: "/Somali/Shifta-War-Overview",                             desc: "The arid north. Majority ethnic Somali. They voted to join Somalia in 1962." },
      { id: "somalia-s",  label: "Somalia",                type: "place",   href: "/Somali/Kenya-Somali-and-the-Shifta-War",                   desc: "The Greater Somalia dream. Ogaden and NFD were to be part of it." },
      { id: "kenyatta-s", label: "Jomo Kenyatta",          type: "person",  href: "/Presidencies/Jomo-Kenyatta-Presidency/Kenya-Somalia-Shifta-War", desc: "Refused to cede territory. Declared a state of emergency in the north." },
      { id: "emergency-s",label: "NFD Emergency",          type: "event",   href: "/Military/Shifta-War",                                      desc: "Collective punishment. Villages burned. A brutal counterinsurgency." },
      { id: "garissa-s",  label: "Garissa",                type: "place",   href: "/Counties/Garissa/Garissa-County",                          desc: "Hub of the NFD conflict. The administrative and military centre." },
      { id: "kinshasa",   label: "Kinshasa Accord 1967",   type: "event",   href: "/Somali/Post-Shifta-Reconciliation",                        desc: "OAU mediated ceasefire. Somalia recognised Kenya's territorial integrity." },
      { id: "somali-k",   label: "Somali Kenyans",         type: "concept", href: "/Somali/Garissa-County",                                    desc: "Ethnic Somali citizens. The conflict left a legacy of marginalisation." },
      { id: "atrocities", label: "Shifta War Atrocities",  type: "event",   href: "/Somali/Shifta-War-Atrocities",                             desc: "Villages destroyed, people killed, livestock confiscated. Documented but unacknowledged." },
    ],
    links: [
      { source: "shifta",     target: "nfd",        type: "place",   label: "conflict in the NFD" },
      { source: "shifta",     target: "somalia-s",  type: "place",   label: "backed by Somalia" },
      { source: "shifta",     target: "kenyatta-s", type: "person",  label: "opposed by Kenyatta" },
      { source: "kenyatta-s", target: "emergency-s", type: "event",  label: "declared emergency" },
      { source: "shifta",     target: "garissa-s",  type: "place",   label: "centred on Garissa" },
      { source: "shifta",     target: "kinshasa",   type: "event",   label: "ended by accord" },
      { source: "shifta",     target: "somali-k",   type: "concept", label: "Somali Kenyan legacy" },
      { source: "shifta",     target: "atrocities", type: "event",   label: "atrocities committed" },
      { source: "nfd",        target: "somali-k",   type: "concept", label: "Somali homeland in Kenya" },
    ],
  },

  "wagalla-massacre": {
    id: "wagalla-massacre",
    label: "The Wagalla Massacre",
    nodes: [
      { id: "wagalla",    label: "Wagalla Massacre 1984",  type: "event",   href: "/Somali/The-Wagalla-Massacre-1984",                         desc: "February 1984. 1,000-5,000 Degodia Somali men killed by Kenya security forces at Wajir airstrip." },
      { id: "wajir",      label: "Wajir Airstrip",         type: "place",   href: "/Somali/The-Wagalla-Massacre-1984",                         desc: "Where the men were herded. Days of detention without water. Then killings." },
      { id: "degodia",    label: "Degodia Community",      type: "concept", href: "/Somali/Garissa-County",                                    desc: "Ethnic Somali sub-clan targeted by the security operation." },
      { id: "moi-w",      label: "Daniel arap Moi",        type: "person",  href: "/Presidencies/Daniel-arap-Moi-Presidency",                  desc: "President at the time. His government denied the scale of the massacre." },
      { id: "nyayo-w",    label: "Nyayo Era",              type: "concept", href: "/Trails/The-Nyayo-Era:-Fear-and-Development",               desc: "Moi's era of footsteps, control, and fear. Wagalla fits the pattern." },
      { id: "tjrc",       label: "Truth Justice Reconciliation", type: "event", href: "/Somali/The-Wagalla-Massacre-1984",                    desc: "The TJRC formally documented Wagalla. The scale confirmed. Accountability remains absent." },
      { id: "nfd-w",      label: "NFD Marginalisation",    type: "concept", href: "/Somali/Shifta-War-Overview",                              desc: "The north was treated as enemy territory long after the Shifta War." },
      { id: "silence",    label: "Silence and Denial",     type: "concept", href: "/Somali/The-Wagalla-Massacre-1984",                         desc: "Forty years of government silence. Media blackout. The forgotten massacre." },
    ],
    links: [
      { source: "wagalla", target: "wajir",   type: "place",   label: "occurred at Wajir" },
      { source: "wagalla", target: "degodia", type: "concept", label: "Degodia targeted" },
      { source: "wagalla", target: "moi-w",   type: "person",  label: "under Moi government" },
      { source: "wagalla", target: "nyayo-w", type: "concept", label: "Nyayo era violence" },
      { source: "wagalla", target: "tjrc",    type: "event",   label: "documented by TJRC" },
      { source: "wagalla", target: "nfd-w",   type: "concept", label: "northern marginalisation" },
      { source: "wagalla", target: "silence", type: "concept", label: "decades of silence" },
      { source: "nfd-w",   target: "degodia", type: "concept", label: "Somali in NFD" },
    ],
  },

  "garissa-attack": {
    id: "garissa-attack",
    label: "Garissa University Attack",
    nodes: [
      { id: "garissa",    label: "Garissa Attack 2015",    type: "event",   href: "/Presidencies/Uhuru-Kenyatta-Presidency/Garissa-University-Attack-2015", desc: "April 2 2015. Al-Shabaab gunmen killed 147 at Garissa University. Kenya's deadliest terror attack." },
      { id: "alshabaab",  label: "Al-Shabaab",             type: "concept", href: "/Military/Rapid-Response-Teams",                            desc: "Somali Islamist group. Have attacked Kenya since KDF entered Somalia in 2011." },
      { id: "victims",    label: "147 Students Killed",    type: "event",   href: "/Counties/Garissa/Garissa-University-Attack",               desc: "Mostly Christian students targeted. Worst attack since 1998 US Embassy bombing." },
      { id: "university", label: "Garissa University",     type: "place",   href: "/Counties/Garissa/Garissa-University-Attack",               desc: "Established 2011. Symbol of northern development. Attacked four years later." },
      { id: "kdf-g",      label: "KDF in Somalia",         type: "event",   href: "/Military/Rapid-Response-Teams",                            desc: "Kenya deployed troops to Somalia 2011. Al-Shabaab promised retaliation." },
      { id: "uhuru-g",    label: "Uhuru Kenyatta Response", type: "person", href: "/Presidencies/Uhuru-Kenyatta-Presidency",                   desc: "Promised security response. Critics said it came too late and too slowly." },
      { id: "westgate-g", label: "Westgate Attack 2013",   type: "event",   href: "/Trails/The-Coup-That-Almost-Happened",                    desc: "Nairobi mall attack 2013. 67 killed. Garissa was the second major attack." },
      { id: "nfd-g",      label: "NFD Security Context",   type: "concept", href: "/Counties/Garissa/Garissa-Security",                        desc: "Northern Kenya has always been under-resourced for security. Garissa exposed this." },
    ],
    links: [
      { source: "garissa",   target: "alshabaab", type: "concept", label: "carried out by" },
      { source: "garissa",   target: "victims",   type: "event",   label: "147 killed" },
      { source: "garissa",   target: "university", type: "place",  label: "at Garissa University" },
      { source: "garissa",   target: "kdf-g",     type: "event",   label: "linked to KDF Somalia" },
      { source: "garissa",   target: "uhuru-g",   type: "person",  label: "Uhuru government response" },
      { source: "garissa",   target: "westgate-g", type: "event",  label: "second major attack" },
      { source: "garissa",   target: "nfd-g",     type: "concept", label: "northern security failure" },
      { source: "alshabaab", target: "kdf-g",     type: "event",   label: "retaliation for KDF" },
    ],
  },

  "oathing-ceremonies": {
    id: "oathing-ceremonies",
    label: "Oathing Ceremonies",
    nodes: [
      { id: "oathing",    label: "Oathing Ceremonies",     type: "concept", href: "/Trails/The-Oathing-Ceremonies",                            desc: "Binding oaths used in Mau Mau recruitment and later in Kikuyu political mobilisation." },
      { id: "maumau-o",   label: "Mau Mau Oathing",        type: "event",   href: "/Trails/Mau-Mau:-The-Forest-War",                          desc: "The Mau Mau oath bound members to fight for land and freedom. British called it diabolical." },
      { id: "traditional",label: "Kikuyu Traditional Oath", type: "concept", href: "/Kikuyu/Age-Sets",                                        desc: "Oathing is ancient in Kikuyu society. Used for age-set initiations and binding agreements." },
      { id: "british-o",  label: "British Propaganda",     type: "concept", href: "/Kikuyu/British-Propaganda-on-Oathing",                    desc: "British portrayed oathing as satanic and bestial. A moral justification for repression." },
      { id: "gatundu-o",  label: "Gatundu 1969",           type: "event",   href: "/Kikuyu/Kenyatta-Detention-Legacy",                        desc: "Political oath administered at Kenyatta's home in 1969 to bind Kikuyu loyalty." },
      { id: "kenyatta-o", label: "Jomo Kenyatta",          type: "person",  href: "/Kikuyu/Jomo-Kenyatta",                                    desc: "The 1969 oathing was linked to his government. Used after Mboya's assassination." },
      { id: "kisumu-o",   label: "Luo Kisumu Rejection",   type: "event",   href: "/Trails/The-Kisumu-Massacre,-1969",                        desc: "Luo refused to take the oath. Kisumu massacre followed. Kenya's ethnic fracture deepened." },
      { id: "mwakenya-o", label: "Later Political Oaths",  type: "concept", href: "/Trails/The-Oathing-Ceremonies",                           desc: "Oathing used in 1990s politics. A recurring instrument of ethnic binding." },
    ],
    links: [
      { source: "oathing",     target: "maumau-o",    type: "event",   label: "used in Mau Mau" },
      { source: "oathing",     target: "traditional", type: "concept", label: "ancient Kikuyu practice" },
      { source: "maumau-o",    target: "british-o",   type: "concept", label: "British misrepresented it" },
      { source: "oathing",     target: "gatundu-o",   type: "event",   label: "Gatundu oathing 1969" },
      { source: "gatundu-o",   target: "kenyatta-o",  type: "person",  label: "at Kenyatta's home" },
      { source: "gatundu-o",   target: "kisumu-o",    type: "event",   label: "Luo rejection led to Kisumu" },
      { source: "oathing",     target: "mwakenya-o",  type: "concept", label: "later political uses" },
      { source: "traditional", target: "maumau-o",    type: "event",   label: "tradition adapted for war" },
    ],
  },

  // =========================================================
  // PLACES
  // =========================================================

  "nairobi-city": {
    id: "nairobi-city",
    label: "Nairobi City",
    nodes: [
      { id: "nairobi",    label: "Nairobi",               type: "place",   href: "/Europeans/Nairobi%27s-Founding",                           desc: "Founded 1899 as a railway depot. Now East Africa's largest city. 5 million people." },
      { id: "founding",   label: "Railway Founding 1899", type: "event",   href: "/Europeans/Nairobi%27s-Founding",                           desc: "A swamp became a depot. The Uganda Railway stopped here. A city was born." },
      { id: "colonial-n", label: "Colonial Capital",      type: "concept", href: "/Europeans/Nairobi%27s-Founding",                           desc: "Segregated city. Europeans, Asians, Africans in separate zones." },
      { id: "kibera",     label: "Kibera",                type: "place",   href: "/Counties/Nairobi/Nairobi-Slums",                           desc: "One of Africa's largest informal settlements. 250,000-1 million people." },
      { id: "nairobipark", label: "Nairobi National Park", type: "place",  href: "/Trails/Hell%27s-Gate:-Walk-Among-the-Wildlife",            desc: "A game park inside a capital city. Lions visible from the CBD skyline." },
      { id: "silicon",    label: "Silicon Savannah",      type: "concept", href: "/Corporate-Kenya/iHub-Nairobi",                            desc: "Tech hub of Africa. Fintech, mobile money, startups. iHub is the centre." },
      { id: "independence-n", label: "Independence Capital", type: "event", href: "/Europeans/Pipeline-of-Independence",                     desc: "December 1963. Nairobi became the capital of an independent nation." },
      { id: "devolution-n", label: "Devolution and Nairobi", type: "concept", href: "/Presidencies/Uhuru-Kenyatta-Presidency/Uhuru-and-Margaret-Kenyatta-as-Nairobi-Governor", desc: "2010 devolved power. Nairobi County created with its own governor." },
      { id: "expressway",  label: "Nairobi Expressway",   type: "event",   href: "/Presidencies/Uhuru-Kenyatta-Presidency/Uhuru-and-the-Nairobi-Expressway", desc: "Completed 2022. Toll road over the city. Controversial but transformative." },
    ],
    links: [
      { source: "nairobi",     target: "founding",     type: "event",   label: "founded 1899" },
      { source: "nairobi",     target: "colonial-n",   type: "concept", label: "colonial segregated city" },
      { source: "nairobi",     target: "kibera",       type: "place",   label: "contains Kibera" },
      { source: "nairobi",     target: "nairobipark",  type: "place",   label: "national park inside" },
      { source: "nairobi",     target: "silicon",      type: "concept", label: "Silicon Savannah" },
      { source: "nairobi",     target: "independence-n", type: "event", label: "independence capital" },
      { source: "nairobi",     target: "devolution-n", type: "concept", label: "devolved county" },
      { source: "nairobi",     target: "expressway",   type: "event",   label: "expressway 2022" },
      { source: "founding",    target: "colonial-n",   type: "concept", label: "colonial from birth" },
    ],
  },

  "lake-turkana": {
    id: "lake-turkana",
    label: "Lake Turkana",
    nodes: [
      { id: "turkana",    label: "Lake Turkana",          type: "place",   href: "/Trails/Lake-Turkana:-The-Jade-Sea",                        desc: "The Jade Sea. Largest desert lake in the world. World Heritage Site." },
      { id: "jade",       label: "The Jade Sea",          type: "concept", href: "/Trails/Lake-Turkana:-The-Jade-Sea",                        desc: "Named for its brilliant green colour. Winds, alkaline water, strange beauty." },
      { id: "koobi-t",    label: "Koobi Fora Fossils",    type: "place",   href: "/Counties/Turkana-County/Koobi-Fora",                       desc: "Eastern shore. Some of the most important human fossil sites on earth." },
      { id: "turkanaboy-t", label: "Turkana Boy",         type: "event",   href: "/Turkana/Turkana-Boy",                                      desc: "1.6 million year old skeleton. Found 1984. Homo ergaster. Changed our understanding." },
      { id: "turkanapeople", label: "Turkana People",     type: "person",  href: "/Turkana/Turkana-People-Overview",                          desc: "Pastoralists of the Jade Sea. 1.2 million people. Facing climate crisis." },
      { id: "omo",        label: "Omo River Ethiopia",    type: "place",   href: "/Trails/Lake-Turkana:-The-Jade-Sea",                        desc: "90% of Turkana's water comes from Ethiopia via the Omo. Gibe III dam threatens it." },
      { id: "wind",       label: "Turkana Wind Power",    type: "event",   href: "/Technology/Wind-Energy-Projects",                          desc: "Africa's largest wind farm on the shores of Lake Turkana. 310MW." },
      { id: "fossil",     label: "Cradle of Humanity",    type: "concept", href: "/Trails/Lake-Turkana:-The-Jade-Sea",                        desc: "More hominid fossils found here than anywhere. The beginning of the human story." },
      { id: "lapsset-t",  label: "LAPSSET Corridor",      type: "concept", href: "/Swahili/Lamu-LAPSSET-Project",                             desc: "Pipeline, port, railway. Lake Turkana sits at one node of this mega-project." },
    ],
    links: [
      { source: "turkana",     target: "jade",         type: "concept", label: "the Jade Sea" },
      { source: "turkana",     target: "koobi-t",      type: "place",   label: "Koobi Fora on its shores" },
      { source: "koobi-t",     target: "turkanaboy-t", type: "event",   label: "Turkana Boy found here" },
      { source: "turkana",     target: "turkanapeople", type: "person", label: "home of Turkana people" },
      { source: "turkana",     target: "omo",          type: "place",   label: "fed by Omo River" },
      { source: "turkana",     target: "wind",         type: "event",   label: "wind power project" },
      { source: "turkana",     target: "fossil",       type: "concept", label: "cradle of humanity" },
      { source: "turkana",     target: "lapsset-t",    type: "concept", label: "LAPSSET corridor" },
      { source: "fossil",      target: "koobi-t",      type: "place",   label: "fossils at Koobi Fora" },
    ],
  },

  "mount-kenya": {
    id: "mount-kenya",
    label: "Mount Kenya",
    nodes: [
      { id: "mtkenya",    label: "Mount Kenya",           type: "place",   href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "5,199m. Africa's second highest. Sacred to the Kikuyu. UNESCO World Heritage." },
      { id: "sacred",     label: "Sacred Mountain",       type: "concept", href: "/Trails/Facing-Mount-Kenya",                               desc: "Ngai (God) lives on Mount Kenya. Every Kikuyu home faces it. The spiritual axis." },
      { id: "mackinder",  label: "Mackinder Summit 1899", type: "event",   href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "Halford Mackinder made the first summit attempt in 1899. It took three tries." },
      { id: "batian",     label: "Batian and Nelion",     type: "concept", href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "The twin peaks. Named after Maasai laibon. 5,199m and 5,188m." },
      { id: "glaciers",   label: "Glaciers Retreating",   type: "event",   href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "Mount Kenya's glaciers are vanishing. Climate change. An icon under threat." },
      { id: "kikuyu-m",   label: "Kikuyu Cosmology",      type: "concept", href: "/Kikuyu/Facing-Mount-Kenya",                               desc: "Facing Mount Kenya. Jomo Kenyatta's 1938 book. The mountain as centre of identity." },
      { id: "biosphere",  label: "UNESCO Biosphere",      type: "concept", href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "UNESCO World Heritage Site 1997. Biosphere Reserve. Forest conservation." },
      { id: "naromoru",   label: "Naro Moru Route",       type: "place",   href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",                  desc: "The most popular trekking route. Vertical bog. Moorland. Summit attempt." },
      { id: "kirinyaga",  label: "Kirinyaga County",      type: "place",   href: "/Trails/Kirinyaga:-The-Coffee-Country",                     desc: "The county named for the mountain. Coffee, tea, and sacred forest." },
    ],
    links: [
      { source: "mtkenya",  target: "sacred",    type: "concept", label: "sacred to the Kikuyu" },
      { source: "mtkenya",  target: "mackinder", type: "event",   label: "first summit attempt" },
      { source: "mtkenya",  target: "batian",    type: "concept", label: "twin peaks" },
      { source: "mtkenya",  target: "glaciers",  type: "event",   label: "glaciers disappearing" },
      { source: "mtkenya",  target: "kikuyu-m",  type: "concept", label: "Kikuyu cosmology" },
      { source: "mtkenya",  target: "biosphere", type: "concept", label: "UNESCO heritage" },
      { source: "mtkenya",  target: "naromoru",  type: "place",   label: "Naro Moru trekking route" },
      { source: "mtkenya",  target: "kirinyaga", type: "place",   label: "Kirinyaga county" },
      { source: "sacred",   target: "kikuyu-m",  type: "concept", label: "Kenyatta documented it" },
    ],
  },

  "swahili-coast": {
    id: "swahili-coast",
    label: "The Swahili Coast",
    nodes: [
      { id: "coast",      label: "Swahili Coast",         type: "place",   href: "/Trails/Swahili:-A-Thousand-Years",             desc: "A thousand years of Indian Ocean civilisation. Cities, trade, Islam, and culture." },
      { id: "mombasa-sc", label: "Mombasa",               type: "place",   href: "/Swahili/Mombasa",                              desc: "The anchor city. Port, history, culture, Fort Jesus." },
      { id: "malindi-sc", label: "Malindi",               type: "place",   href: "/Swahili/Malindi",                              desc: "Ancient rival city to Mombasa. Portuguese landfall point." },
      { id: "lamu-sc",    label: "Lamu",                  type: "place",   href: "/Swahili/Lamu",                                 desc: "The oldest living Swahili town. UNESCO World Heritage. Donkeys still rule." },
      { id: "arab-sc",    label: "Arab Settlement",       type: "concept", href: "/Swahili/Arab-Settlement-on-the-Coast",         desc: "Centuries of Arab migration and trade shaped Swahili culture and Islam." },
      { id: "portuguese-sc", label: "Portuguese Rule",    type: "event",   href: "/Swahili/Portuguese-Domination",                desc: "1500s Portuguese conquest. Fort Jesus built. Two centuries of uneasy rule." },
      { id: "fortjesus-sc", label: "Fort Jesus",          type: "place",   href: "/Swahili/Fort-Jesus",                           desc: "Built 1593. Fought over for 200 years. Now a World Heritage museum." },
      { id: "ocean-sc",   label: "Indian Ocean World",    type: "concept", href: "/Swahili/The-Indian-Ocean-World",               desc: "The ocean as highway: monsoon winds connected East Africa to Arabia, India, China." },
      { id: "language-sc",label: "Swahili Language",      type: "concept", href: "/Swahili/Swahili-Language",                     desc: "Africa's great lingua franca. Born on the coast. Spoken by 200 million people." },
      { id: "trade-sc",   label: "Indian Ocean Trade",    type: "event",   href: "/Coast-History/Pre-Colonial-Indian-Ocean-Trade", desc: "Gold, ivory, slaves, cloth. The network that made the coast rich." },
    ],
    links: [
      { source: "coast",       target: "mombasa-sc",    type: "place",   label: "primary city" },
      { source: "coast",       target: "malindi-sc",    type: "place",   label: "rival city" },
      { source: "coast",       target: "lamu-sc",       type: "place",   label: "oldest town" },
      { source: "coast",       target: "arab-sc",       type: "concept", label: "Arab settlers shaped culture" },
      { source: "coast",       target: "portuguese-sc", type: "event",   label: "Portuguese conquest 1500s" },
      { source: "mombasa-sc",  target: "fortjesus-sc",  type: "place",   label: "built to defend" },
      { source: "portuguese-sc", target: "fortjesus-sc", type: "place",  label: "built Fort Jesus" },
      { source: "coast",       target: "ocean-sc",      type: "concept", label: "ocean as highway" },
      { source: "coast",       target: "language-sc",   type: "concept", label: "Swahili born here" },
      { source: "coast",       target: "trade-sc",      type: "event",   label: "trade routes" },
      { source: "arab-sc",     target: "language-sc",   type: "concept", label: "Arabic influence on language" },
    ],
  },

  "rift-valley": {
    id: "rift-valley",
    label: "Rift Valley",
    nodes: [
      { id: "rift",       label: "Great Rift Valley",    type: "place",   href: "/Counties/Nakuru/Rift-Valley-Province-History",      desc: "6,000km crack in the earth. Ancient, dramatic, alive. Kenya's geological spine." },
      { id: "turkana-r",  label: "Lake Turkana",         type: "place",   href: "/Trails/Lake-Turkana:-The-Jade-Sea",                 desc: "The Jade Sea. Largest desert lake in the world. Cradle of humanity." },
      { id: "nakuru-r",   label: "Lake Nakuru",          type: "place",   href: "/Trails/Lake-Nakuru:-The-Flamingo-Mystery",          desc: "The flamingo lake. A million birds at peak. Now under threat." },
      { id: "flamingos",  label: "Flamingo Ecology",     type: "concept", href: "/Conservation/Flamingo-Ecology-Rift-Valley",        desc: "Why Rift Valley lakes host the world's largest flamingo concentrations." },
      { id: "mara-r",     label: "Maasai Mara",          type: "place",   href: "/Trails/The-Maasai-Mara:-Paradise-and-Its-Price",   desc: "The great migration. Lions. Open savannah. Kenya's most famous landscape." },
      { id: "maraeco",    label: "Mara Ecosystem",       type: "concept", href: "/Trails/The-Maasai-Mara-Ecosystem",                 desc: "How the whole ecosystem works: wildlife, water, pastoralists, tourism." },
      { id: "land-r",     label: "Land in the Valley",   type: "concept", href: "/Europeans/Land-in-the-Rift-Valley",                desc: "Colonial land seizure. White Highlands. A dispossession that still echoes." },
      { id: "turkanapeople-r", label: "Turkana People",  type: "person",  href: "/Turkana/Turkana-People-Overview",                  desc: "Pastoralists who have lived around the Jade Sea for centuries." },
      { id: "pastoralists-r", label: "Pastoralists",     type: "concept", href: "/Conservation/Pastoralists-and-Conservation",      desc: "The people and cattle that have shaped the Rift Valley for millennia." },
    ],
    links: [
      { source: "rift",    target: "turkana-r",     type: "place",   label: "northernmost lake" },
      { source: "rift",    target: "nakuru-r",      type: "place",   label: "flamingo lake" },
      { source: "nakuru-r", target: "flamingos",    type: "concept", label: "flamingo ecology" },
      { source: "rift",    target: "mara-r",        type: "place",   label: "southern savannah" },
      { source: "mara-r",  target: "maraeco",       type: "concept", label: "ecosystem dynamics" },
      { source: "rift",    target: "land-r",        type: "concept", label: "colonial land seizure" },
      { source: "rift",    target: "turkanapeople-r", type: "person", label: "indigenous peoples" },
      { source: "rift",    target: "pastoralists-r", type: "concept", label: "pastoral communities" },
      { source: "turkana-r", target: "turkanapeople-r", type: "person", label: "home of the Turkana" },
    ],
  },

  "lamu-island": {
    id: "lamu-island",
    label: "Lamu Island",
    nodes: [
      { id: "lamu",       label: "Lamu Island",           type: "place",   href: "/Swahili/Lamu",                                             desc: "Oldest living Swahili town. UNESCO World Heritage. Donkeys and carved doors." },
      { id: "lamutown",   label: "Lamu Old Town",         type: "place",   href: "/Swahili/Lamu",                                             desc: "13th century. Narrow streets, coral stone houses, no cars. Preserved." },
      { id: "unesco-l",   label: "UNESCO Heritage 2001",  type: "event",   href: "/Swahili/Lamu",                                             desc: "Listed 2001. The best preserved Swahili settlement in East Africa." },
      { id: "maulidi",    label: "Maulidi Festival",      type: "concept", href: "/Swahili/Islam-on-the-Swahili-Coast",                       desc: "Annual celebration of Prophet Muhammad's birthday. Lamu is the epicentre." },
      { id: "doors",      label: "Carved Doors",          type: "concept", href: "/Swahili/Swahili-Architecture",                             desc: "The carved Lamu door. Intricate wood. Symbol of Swahili identity and craft." },
      { id: "donkeys",    label: "Donkeys of Lamu",       type: "concept", href: "/Trails/The-Lamu-Donkey",                                   desc: "3,000 donkeys. No cars allowed. The island's transport system for centuries." },
      { id: "portuguese-l", label: "Portuguese Contact",  type: "event",   href: "/Swahili/Vasco-da-Gama-and-the-Coast",                     desc: "Vasco da Gama passed near Lamu 1498. The coast's encounter with Europe." },
      { id: "lapsset-l",  label: "LAPSSET Threat",        type: "concept", href: "/Swahili/Lamu-LAPSSET-Project",                             desc: "Oil pipeline and port project. Will transform the coast. Conservation vs. development." },
      { id: "siyu",       label: "Siyu Fort",             type: "place",   href: "/Swahili/Lamu",                                             desc: "19th century fort on Pate Island near Lamu. Resistance against Oman." },
    ],
    links: [
      { source: "lamu",     target: "lamutown",  type: "place",   label: "Old Town" },
      { source: "lamu",     target: "unesco-l",  type: "event",   label: "UNESCO 2001" },
      { source: "lamu",     target: "maulidi",   type: "concept", label: "Maulidi Festival" },
      { source: "lamu",     target: "doors",     type: "concept", label: "carved doors" },
      { source: "lamu",     target: "donkeys",   type: "concept", label: "donkeys not cars" },
      { source: "lamu",     target: "portuguese-l", type: "event", label: "Portuguese contact" },
      { source: "lamu",     target: "lapsset-l", type: "concept", label: "LAPSSET threat" },
      { source: "lamu",     target: "siyu",      type: "place",   label: "Siyu Fort nearby" },
      { source: "doors",    target: "lamutown",  type: "place",   label: "doors define the town" },
    ],
  },

  "mombasa": {
    id: "mombasa",
    label: "Mombasa",
    nodes: [
      { id: "mombasa2",  label: "Mombasa",              type: "place",   href: "/Swahili/Mombasa",                            desc: "Kenya's second city. Ancient port. Cultural crossroads. 2,000 years of history." },
      { id: "fort-m",    label: "Fort Jesus",           type: "place",   href: "/Swahili/Fort-Jesus",                         desc: "The fortress that defined centuries of Mombasa's history. Portuguese built. UNESCO listed." },
      { id: "oldtown-m", label: "Old Town Mombasa",     type: "place",   href: "/Swahili/Old-Town-Mombasa",                   desc: "Narrow streets, carved doors, coral stone buildings. Living history." },
      { id: "arabid-m",  label: "Swahili-Arab Identity", type: "concept", href: "/Swahili/Swahili-and-Arab-Identity",         desc: "How Arab settlement shaped Swahili identity and culture." },
      { id: "malindi-m", label: "Malindi",              type: "place",   href: "/Swahili/Malindi",                            desc: "Mombasa's ancient rival and ally. Portuguese first landfall in Kenya." },
      { id: "railway-m", label: "The Lunatic Express",  type: "event",   href: "/Asians/The-Lunatic-Express",                 desc: "The Uganda Railway. Built from Mombasa 1896. Transformed East Africa." },
      { id: "food-m",    label: "Coastal Cuisine",      type: "concept", href: "/Coast-History/Coastal-Food-Culture",         desc: "Biryani, pilau, samaki. Where Indian Ocean trade becomes food culture." },
      { id: "asians-m",  label: "Indian Community",     type: "person",  href: "/Asians/Asians-in-Kenya",                    desc: "Brought to build the railway. Stayed to shape commerce and culture." },
      { id: "islam-m",   label: "Islam on the Coast",   type: "concept", href: "/Swahili/Islam-on-the-Swahili-Coast",         desc: "A thousand years of Islam shaping law, architecture, and daily life." },
      { id: "lamu-m",    label: "Lamu",                 type: "place",   href: "/Swahili/Lamu",                               desc: "The perfectly preserved Swahili town north of Mombasa." },
    ],
    links: [
      { source: "mombasa2", target: "fort-m",     type: "place",   label: "city's defining monument" },
      { source: "mombasa2", target: "oldtown-m",  type: "place",   label: "historic core" },
      { source: "mombasa2", target: "arabid-m",   type: "concept", label: "Arab-Swahili fusion" },
      { source: "mombasa2", target: "malindi-m",  type: "place",   label: "rival city" },
      { source: "mombasa2", target: "railway-m",  type: "event",   label: "railway terminus" },
      { source: "mombasa2", target: "food-m",     type: "concept", label: "Indian Ocean cuisine" },
      { source: "mombasa2", target: "asians-m",   type: "person",  label: "Indian community" },
      { source: "mombasa2", target: "islam-m",    type: "concept", label: "Islamic city" },
      { source: "mombasa2", target: "lamu-m",     type: "place",   label: "Swahili sister city" },
      { source: "railway-m", target: "asians-m",  type: "person",  label: "Indians built the railway" },
    ],
  },

  // =========================================================
  // CULTURE
  // =========================================================

  "sheng-language": {
    id: "sheng-language",
    label: "Sheng Language",
    nodes: [
      { id: "sheng",      label: "Sheng",                 type: "concept", href: "/Cross-Ethnic/Sheng",                                        desc: "Nairobi street language mixing Swahili, English, and ethnic languages. Born 1970s Eastlands." },
      { id: "eastlands",  label: "Nairobi Eastlands",     type: "place",   href: "/Cross-Ethnic/Sheng",                                        desc: "Pumwani, Shauri Moyo, Ziwani. Where Sheng was born among mixed-ethnic youth." },
      { id: "evolution",  label: "Sheng Evolution",       type: "concept", href: "/Cross-Ethnic/Sheng-Evolution",                              desc: "From Nairobi slang to national youth language. It never stops changing." },
      { id: "identity-s", label: "Urban Youth Identity",  type: "concept", href: "/Legacy/Sheng-as-Cultural-Legacy",                          desc: "Sheng is not just a language. It's a marker of urban identity and class." },
      { id: "gengetone",  label: "Gengetone Music",       type: "event",   href: "/Trails/Gengetone:-The-Streets-Speak",                      desc: "Gengetone is Sheng-medium music. The street language became pop culture." },
      { id: "media-s",    label: "Sheng in Media",        type: "event",   href: "/Music/Sheng-Language-and-Kenyan-Music",                    desc: "FM radio, music, social media. Sheng went from streets to mainstream." },
      { id: "digital-s",  label: "Digital Sheng",         type: "concept", href: "/Cross-Ethnic/Sheng-Evolution",                              desc: "Social media has accelerated Sheng's spread and evolution. WhatsApp Sheng." },
      { id: "crossethnic",label: "Cross-Ethnic Bridge",   type: "concept", href: "/Cross-Ethnic/Sheng",                                        desc: "Sheng crosses ethnic lines. In a divided society, it creates shared youth space." },
      { id: "trail-s",    label: "Sheng Pop Culture Trail", type: "concept", href: "/Trails/Sheng-Speaks:-How-a-Street-Language-Became-Pop-Culture", desc: "Full story: from Eastlands to everywhere." },
    ],
    links: [
      { source: "sheng",     target: "eastlands",  type: "place",   label: "born in Eastlands" },
      { source: "sheng",     target: "evolution",  type: "concept", label: "constantly evolving" },
      { source: "sheng",     target: "identity-s", type: "concept", label: "youth identity marker" },
      { source: "sheng",     target: "gengetone",  type: "event",   label: "powered Gengetone" },
      { source: "sheng",     target: "media-s",    type: "event",   label: "mainstream media" },
      { source: "sheng",     target: "digital-s",  type: "concept", label: "digital Sheng" },
      { source: "sheng",     target: "crossethnic", type: "concept", label: "cross-ethnic bridge" },
      { source: "sheng",     target: "trail-s",    type: "concept", label: "full story trail" },
      { source: "gengetone", target: "media-s",    type: "event",   label: "Gengetone in media" },
    ],
  },

  "benga-music": {
    id: "benga-music",
    label: "Benga Music",
    nodes: [
      { id: "benga",      label: "Benga Music",           type: "concept", href: "/Music/Benga-Music",                                        desc: "Kenya's distinctive guitar music. Luo origins. Electric revolution from the 1960s." },
      { id: "misiani",    label: "D.O. Misiani",          type: "person",  href: "/Music/D.O.-Misiani",                                       desc: "The king of benga. Luo benga's greatest voice. Political, witty, beloved." },
      { id: "kabaka",     label: "Daudi Kabaka",          type: "person",  href: "/Music/Daudi-Kabaka",                                       desc: "Pioneered the urban Nairobi sound in the 1950s-60s. Father of Kenya pop." },
      { id: "luo-b",      label: "Luo Guitar Tradition",  type: "concept", href: "/Trails/Luo-Benga-Music",                                   desc: "The Luo nyatiti and orutu gave way to the guitar. The sound of the lake." },
      { id: "electric-b", label: "Electric Revolution",   type: "event",   href: "/Trails/Benga:-Kenya%27s-Electric-Revolution",             desc: "The electric guitar transformed Kenyan music in the 1960s. Benga went national." },
      { id: "protest-b",  label: "Benga and Protest",     type: "concept", href: "/Music/Benga-and-Political-Protest",                        desc: "Benga carried political weight. Misiani criticised Moi. They banned him for it." },
      { id: "guitar-b",   label: "The Guitar in Kenya",   type: "concept", href: "/Music/The-Guitar-in-Kenyan-Popular-Music",                 desc: "The instrument that defines modern Kenyan popular sound. From the coast to the lake." },
      { id: "trail-b",    label: "Benga Trail",           type: "concept", href: "/Trails/Benga:-The-Sound-of-Kenya",                         desc: "Full story: from lakeside villages to national radio." },
      { id: "nyanza",     label: "Nyanza",                type: "place",   href: "/Luo/Kisumu-City",                                          desc: "The western lake region. Heartland of Luo benga. Kisumu the capital." },
    ],
    links: [
      { source: "benga",     target: "misiani",   type: "person",  label: "king of benga" },
      { source: "benga",     target: "kabaka",    type: "person",  label: "urban pioneer" },
      { source: "benga",     target: "luo-b",     type: "concept", label: "Luo roots" },
      { source: "benga",     target: "electric-b", type: "event",  label: "electric revolution" },
      { source: "benga",     target: "protest-b", type: "concept", label: "political tradition" },
      { source: "benga",     target: "guitar-b",  type: "concept", label: "guitar-led sound" },
      { source: "benga",     target: "trail-b",   type: "concept", label: "full story" },
      { source: "benga",     target: "nyanza",    type: "place",   label: "Nyanza origin" },
      { source: "misiani",   target: "protest-b", type: "concept", label: "Misiani criticised Moi" },
    ],
  },

  "safari-rally": {
    id: "safari-rally",
    label: "Safari Rally",
    nodes: [
      { id: "safari",    label: "Safari Rally",           type: "event",   href: "/Sports/Safari-Rally-History",                              desc: "The toughest rally in the world. 1953 to present. East Africa's greatest motorsport." },
      { id: "golden",    label: "Golden Era 1970s-80s",   type: "event",   href: "/Sports/Safari-Rally-Golden-Era",                          desc: "When the Safari was WRC gold. Hannu Mikkola, Bjorn Waldegaard, the legends." },
      { id: "joginder",  label: "Joginder Singh",         type: "person",  href: "/Sports/Safari-Rally-Kenyan-Drivers",                      desc: "The Flying Sikh. Three-time winner. Greatest Kenyan Safari driver." },
      { id: "wrc-return",label: "WRC Return 2021",        type: "event",   href: "/Sports/Safari-Rally-Return-to-WRC",                       desc: "Safari returned to the World Rally Championship after 18 years. Naivasha." },
      { id: "naivasha-s",label: "Naivasha Stage",         type: "place",   href: "/Sports/Safari-Rally-Return-to-WRC",                       desc: "Hell's Gate and Naivasha. The spectacular modern Safari stage." },
      { id: "culture-s", label: "Safari Rally Culture",   type: "concept", href: "/Sports/Safari-Rally-Culture",                             desc: "The fans who sleep in the bush. The drivers who court disaster." },
      { id: "nairobi-s", label: "Nairobi Base",           type: "place",   href: "/Sports/Safari-Rally-History",                             desc: "The rally departs from Nairobi. KICC as service park in the modern era." },
      { id: "kenyan-d",  label: "Kenyan Drivers",         type: "person",  href: "/Sports/Safari-Rally-Kenyan-Drivers",                      desc: "McRae, Singh, Mehta, Dobie. Kenya produced great rally drivers over the decades." },
    ],
    links: [
      { source: "safari",    target: "golden",    type: "event",   label: "golden era" },
      { source: "safari",    target: "joginder",  type: "person",  label: "greatest Kenyan driver" },
      { source: "safari",    target: "wrc-return", type: "event",  label: "WRC return 2021" },
      { source: "wrc-return",target: "naivasha-s", type: "place",  label: "Naivasha stage" },
      { source: "safari",    target: "culture-s", type: "concept", label: "safari culture" },
      { source: "safari",    target: "nairobi-s", type: "place",   label: "Nairobi base" },
      { source: "safari",    target: "kenyan-d",  type: "person",  label: "Kenyan drivers" },
      { source: "joginder",  target: "kenyan-d",  type: "person",  label: "Kenyan driving legend" },
    ],
  },

  "maasai-culture": {
    id: "maasai-culture",
    label: "Maasai Culture",
    nodes: [
      { id: "maasai",    label: "Maasai Culture",         type: "concept", href: "/Maasai/Maasai",                                            desc: "East Africa's iconic pastoralist society. Warriors, beadwork, cattle, ochre." },
      { id: "moran",     label: "Warrior Society (Moran)", type: "concept", href: "/Maasai/Maasai_Warrior_Initiation",                       desc: "Young Maasai men become moran (warriors) through circumcision and initiation." },
      { id: "beadwork-m",label: "Beadwork",               type: "concept", href: "/Maasai/Maasai_Beadwork",                                  desc: "Elaborate beaded jewellery. Colours carry meaning. Women are the beadwork masters." },
      { id: "cattle-m",  label: "Cattle Culture",         type: "concept", href: "/Maasai/Maasai_Cattle_Culture",                            desc: "Cattle are wealth, identity, and spiritual currency. Central to Maasai existence." },
      { id: "agesets",   label: "Age Sets System",        type: "concept", href: "/Maasai/Maasai_Age_Sets",                                  desc: "Social organisation by age. Each generation has its name and responsibilities." },
      { id: "land-ma",   label: "Land Loss",              type: "event",   href: "/Maasai/Maasai_Land_Loss",                                 desc: "Colonial treaties 1904 and 1911 took the best Maasai land. Never returned." },
      { id: "tourism-m", label: "Maasai and Tourism",     type: "concept", href: "/Maasai/Maasai_and_Tourism",                               desc: "The world photographs the Maasai. The Maasai commodify themselves. Complex." },
      { id: "amboseli-m",label: "Amboseli",               type: "place",   href: "/Maasai/Amboseli",                                         desc: "Maasai heartland. Elephants and Kilimanjaro. Conservation versus pastoral rights." },
      { id: "women-ma",  label: "Maasai Women",           type: "person",  href: "/Maasai/Maasai_Women",                                     desc: "Build the houses, lead beadwork businesses. Rising as educators and advocates." },
    ],
    links: [
      { source: "maasai",   target: "moran",     type: "concept", label: "warrior society" },
      { source: "maasai",   target: "beadwork-m", type: "concept", label: "beadwork identity" },
      { source: "maasai",   target: "cattle-m",  type: "concept", label: "cattle culture" },
      { source: "maasai",   target: "agesets",   type: "concept", label: "age set system" },
      { source: "maasai",   target: "land-ma",   type: "event",   label: "land dispossession" },
      { source: "maasai",   target: "tourism-m", type: "concept", label: "tourism economy" },
      { source: "maasai",   target: "amboseli-m", type: "place",  label: "Amboseli homeland" },
      { source: "maasai",   target: "women-ma",  type: "person",  label: "women's roles" },
      { source: "land-ma",  target: "amboseli-m", type: "place",  label: "Amboseli land conflict" },
    ],
  },

  "swahili-architecture": {
    id: "swahili-architecture",
    label: "Swahili Architecture",
    nodes: [
      { id: "swarch",    label: "Swahili Architecture",   type: "concept", href: "/Swahili/Swahili-Architecture",                             desc: "Coral stone, carved doors, plaster courtyards. A thousand years of Indian Ocean building." },
      { id: "coral",     label: "Coral Stone Buildings",  type: "concept", href: "/Swahili/Swahili-Architecture",                             desc: "Dead reef coral cut into blocks. Strong, cool, and sourced from the sea itself." },
      { id: "lamuarch",  label: "Lamu Old Town",          type: "place",   href: "/Swahili/Lamu",                                             desc: "The finest collection of Swahili architecture anywhere. UNESCO listed." },
      { id: "doors-a",   label: "Carved Doors",           type: "concept", href: "/Swahili/Swahili-Architecture",                             desc: "The door is the face of the house. Intricate teak carving. A family's status." },
      { id: "oldtown-a", label: "Old Town Mombasa",       type: "place",   href: "/Swahili/Old-Town-Mombasa",                                 desc: "Mombasa's historic quarter. Swahili houses, mosques, narrow alleys." },
      { id: "indian-a",  label: "Indian Ocean Influence", type: "concept", href: "/Swahili/The-Indian-Ocean-World",                           desc: "Arab, Indian, and Persian architectural ideas merged with local building." },
      { id: "islamic-a", label: "Islamic Influences",     type: "concept", href: "/Swahili/Islam-on-the-Swahili-Coast",                       desc: "Mosques, minarets, and the orientation toward Mecca shaped Swahili space." },
      { id: "fortjesus-a", label: "Fort Jesus",           type: "place",   href: "/Swahili/Fort-Jesus",                                       desc: "Portuguese military architecture on the Swahili coast. 1593." },
      { id: "heritage-a", label: "Heritage Preservation", type: "concept", href: "/Swahili/Swahili-Architecture",                            desc: "Development pressure and neglect threaten Swahili built heritage across the coast." },
    ],
    links: [
      { source: "swarch",   target: "coral",     type: "concept", label: "coral stone technique" },
      { source: "swarch",   target: "lamuarch",  type: "place",   label: "best example in Lamu" },
      { source: "swarch",   target: "doors-a",   type: "concept", label: "carved doors" },
      { source: "swarch",   target: "oldtown-a", type: "place",   label: "Old Town Mombasa" },
      { source: "swarch",   target: "indian-a",  type: "concept", label: "Indian Ocean fusion" },
      { source: "swarch",   target: "islamic-a", type: "concept", label: "Islamic influence" },
      { source: "swarch",   target: "fortjesus-a", type: "place", label: "Portuguese architecture" },
      { source: "swarch",   target: "heritage-a", type: "concept", label: "preservation challenges" },
      { source: "lamuarch", target: "doors-a",   type: "concept", label: "doors define Lamu" },
    ],
  },

  "kikuyu-oral-tradition": {
    id: "kikuyu-oral-tradition",
    label: "Kikuyu Oral Tradition",
    nodes: [
      { id: "oral",      label: "Kikuyu Oral Tradition",  type: "concept", href: "/Kikuyu/Facing-Mount-Kenya",                                desc: "Songs, stories, proverbs, and ritual. The living archive of Kikuyu identity." },
      { id: "gikmumbi",  label: "Gikuyu and Mumbi",       type: "concept", href: "/Trails/Gikuyu-and-Mumbi:-The-Creation-Story",             desc: "The creation myth. God placed Gikuyu and Mumbi on earth. Nine daughters founded the clans." },
      { id: "facemtk",   label: "Facing Mount Kenya",     type: "event",   href: "/Kikuyu/Facing-Mount-Kenya",                               desc: "Kenyatta's 1938 ethnography preserved Kikuyu oral tradition in written form." },
      { id: "proverbs",  label: "Proverbs and Stories",   type: "concept", href: "/Kikuyu/Facing-Mount-Kenya",                               desc: "Kikuyu oral literature is dense with proverbs. Wisdom passed between generations." },
      { id: "iregi",     label: "Iregi Revolution",       type: "event",   href: "/Trails/The-KCA-and-the-Birth-of-Kikuyu-Politics",          desc: "The oral tradition of a generational revolution. When the young overthrew the old." },
      { id: "githunguri",label: "Githunguri Schools",     type: "event",   href: "/Trails/Githunguri:-The-Independent-School-Movement",      desc: "Independent Kikuyu schools in the 1930s-40s. Education as cultural survival." },
      { id: "mugithi",   label: "Mugithi Music",          type: "concept", href: "/Music/Mugithi-Music-Origins",                             desc: "Kikuyu popular music tradition. Guitar and home gathering. Oral tradition meets pop." },
      { id: "ngugi-o",   label: "Ngugi wa Thiong'o",      type: "person",  href: "/Kikuyu/Ngugi-wa-Thiong-o",                               desc: "His novels preserve and challenge Kikuyu oral tradition. Weep Not Child. Petals of Blood." },
      { id: "women-o",   label: "Women as Oral Keepers",  type: "person",  href: "/Kikuyu/Facing-Mount-Kenya",                              desc: "Kikuyu women maintained oral traditions through lullabies, ritual songs, and story." },
    ],
    links: [
      { source: "oral",     target: "gikmumbi",  type: "concept", label: "creation myth" },
      { source: "oral",     target: "facemtk",   type: "event",   label: "documented by Kenyatta" },
      { source: "oral",     target: "proverbs",  type: "concept", label: "proverbs and stories" },
      { source: "oral",     target: "iregi",     type: "event",   label: "Iregi oral tradition" },
      { source: "oral",     target: "githunguri", type: "event",  label: "preserved in schools" },
      { source: "oral",     target: "mugithi",   type: "concept", label: "mugithi carries it" },
      { source: "oral",     target: "ngugi-o",   type: "person",  label: "Ngugi engages tradition" },
      { source: "oral",     target: "women-o",   type: "person",  label: "women as keepers" },
      { source: "facemtk",  target: "ngugi-o",   type: "person",  label: "Ngugi responds to Kenyatta" },
    ],
  },

  // =========================================================
  // ECONOMY
  // =========================================================

  "mpesa": {
    id: "mpesa",
    label: "M-Pesa",
    nodes: [
      { id: "mpesa",      label: "M-Pesa",                type: "concept", href: "/Corporate-Kenya/M-Pesa",                                   desc: "Mobile money service. Launched 2007. Transformed financial access across Africa." },
      { id: "launch",     label: "2007 Launch",           type: "event",   href: "/Corporate-Kenya/M-Pesa",                                   desc: "Safaricom launched M-Pesa in March 2007. Within months it had millions of users." },
      { id: "safaricom",  label: "Safaricom",             type: "concept", href: "/Corporate-Kenya/M-Pesa",                                   desc: "Kenya's dominant telco. M-Pesa became Safaricom's most valuable product." },
      { id: "financial",  label: "Financial Inclusion",   type: "concept", href: "/Corporate-Kenya/M-Pesa-Economic-Impact",                   desc: "Unbanked to banked. Millions of Kenyans with financial access via phone." },
      { id: "unbanked",   label: "Unbanked Population",   type: "concept", href: "/Technology/Digital-Financial-Inclusion",                   desc: "Before M-Pesa, most Kenyans had no formal banking. M-Pesa changed that." },
      { id: "global",     label: "Global Expansion",      type: "event",   href: "/Legacy/M-Pesa-as-Legacy",                                  desc: "M-Pesa launched in Tanzania, Rwanda, DRC, Mozambique, Egypt, Germany." },
      { id: "mshwari",    label: "M-Shwari",              type: "concept", href: "/Technology/Mobile-Banking-Services",                       desc: "Savings and loan product built on M-Pesa. Credit for the previously unserved." },
      { id: "effect",     label: "The M-Pesa Effect",     type: "concept", href: "/Cross-Ethnic/The-M-Pesa-Effect",                           desc: "Poverty reduction, women's empowerment, business growth. Documented impact." },
      { id: "fintech",    label: "Kenya Fintech Scene",   type: "concept", href: "/Technology/Fintech-Development",                           desc: "M-Pesa spawned an ecosystem. Kenya is Africa's leading fintech innovation hub." },
    ],
    links: [
      { source: "mpesa",    target: "launch",     type: "event",   label: "launched 2007" },
      { source: "mpesa",    target: "safaricom",  type: "concept", label: "run by Safaricom" },
      { source: "mpesa",    target: "financial",  type: "concept", label: "financial inclusion" },
      { source: "mpesa",    target: "unbanked",   type: "concept", label: "serves unbanked" },
      { source: "mpesa",    target: "global",     type: "event",   label: "global expansion" },
      { source: "mpesa",    target: "mshwari",    type: "concept", label: "spawned M-Shwari" },
      { source: "mpesa",    target: "effect",     type: "concept", label: "M-Pesa effect" },
      { source: "mpesa",    target: "fintech",    type: "concept", label: "Kenyan fintech" },
      { source: "safaricom",target: "global",     type: "event",   label: "Safaricom expanded globally" },
    ],
  },


  "tea-industry": {
    id: "tea-industry",
    label: "Tea Industry Kenya",
    nodes: [
      { id: "tea",       label: "Tea Industry Kenya",    type: "concept", href: "/Corporate-Kenya/Tea-Industry-Kenya",                     desc: "Kenya is the world's top tea exporter. 500,000 smallholders. Kericho highlands." },
      { id: "kericho",   label: "Kericho",               type: "place",   href: "/Trails/Kirinyaga:-The-Coffee-Country",                   desc: "The tea capital. Cool, wet highlands. Unilever and James Finlay plantations." },
      { id: "ktda",      label: "KTDA Smallholders",     type: "concept", href: "/Corporate-Kenya/Tea-Industry-Kenya",                     desc: "Kenya Tea Development Authority. 500,000 smallholder farmers. A cooperative model." },
      { id: "colonial-t",label: "Colonial Introduction", type: "event",   href: "/Corporate-Kenya/Tea-Industry-Kenya",                     desc: "Tea introduced 1903 by European settlers. Kericho's climate was perfect." },
      { id: "export",    label: "Export Economy",        type: "concept", href: "/Corporate-Kenya/Tea-Industry-Kenya",                     desc: "Tea is Kenya's top agricultural export. Mombasa Tea Auction is a global hub." },
      { id: "nandi-t",   label: "Nandi Hills Tea",       type: "place",   href: "/Counties/Nandi/Nandi-Hills",                            desc: "Nandi Hills produces some of Kenya's finest tea. Smallholders and estates." },
      { id: "auction",   label: "Mombasa Tea Auction",   type: "event",   href: "/Swahili/Mombasa",                                       desc: "The world's largest black tea auction. Buyers from 40 countries." },
      { id: "embu-t",    label: "Embu Tea Sector",       type: "place",   href: "/Embu/Embu-Tea-Sector",                                  desc: "Mount Kenya slopes. Embu farmers produce premium highland tea." },
    ],
    links: [
      { source: "tea",      target: "kericho",    type: "place",   label: "Kericho heartland" },
      { source: "tea",      target: "ktda",       type: "concept", label: "KTDA system" },
      { source: "tea",      target: "colonial-t", type: "event",   label: "colonial introduction" },
      { source: "tea",      target: "export",     type: "concept", label: "export economy" },
      { source: "tea",      target: "nandi-t",    type: "place",   label: "Nandi Hills tea" },
      { source: "tea",      target: "auction",    type: "event",   label: "Mombasa auction" },
      { source: "tea",      target: "embu-t",     type: "place",   label: "Embu tea" },
      { source: "export",   target: "auction",    type: "event",   label: "sold at Mombasa" },
    ],
  },

  "flower-farming": {
    id: "flower-farming",
    label: "Flower Farming Kenya",
    nodes: [
      { id: "flowers",   label: "Flower Farming Kenya",  type: "concept", href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",              desc: "Kenya is the world's third largest cut flower exporter. Naivasha lake basin." },
      { id: "naivasha-f",label: "Lake Naivasha",         type: "place",   href: "/Trails/Lake-Nakuru:-The-Flamingo-Mystery",               desc: "The Rift Valley lake at the centre of Kenya's flower industry. Water at risk." },
      { id: "start",     label: "1970s Industry Start",  type: "event",   href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",              desc: "Dutch and Kenyan investors started farms in the 1970s. Perfect climate." },
      { id: "dutch",     label: "Dutch Auction Link",    type: "concept", href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",              desc: "FloraHolland in the Netherlands. Most Kenyan flowers go through Aalsmeer." },
      { id: "airport-f", label: "Nairobi Airport Hub",   type: "place",   href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",              desc: "Flowers leave Nairobi on overnight flights. Same-day delivery to Europe possible." },
      { id: "kibaki-f",  label: "Kibaki Horticulture Boom", type: "event", href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-Horticulture-Cut-Flower-Boom", desc: "Kibaki era policies accelerated horticulture exports. Economic recovery post-2002." },
      { id: "water-f",   label: "Water Rights Conflict", type: "concept", href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",              desc: "Flower farms drain Lake Naivasha. Fishermen and flamingos suffer." },
      { id: "workers-f", label: "Farm Workers",          type: "person",  href: "/Europeans/The-Naivasha-Flower-Farm-Community",           desc: "100,000 workers on Naivasha farms. Mostly women. Long hours, low pay." },
      { id: "valentine",  label: "Valentine's Day Economy", type: "concept", href: "/Corporate-Kenya/Cut-Flower-Industry-Kenya",           desc: "Peak season. February 14. Kenya supplies a third of UK flowers that day." },
    ],
    links: [
      { source: "flowers",  target: "naivasha-f", type: "place",   label: "Naivasha basin" },
      { source: "flowers",  target: "start",      type: "event",   label: "started 1970s" },
      { source: "flowers",  target: "dutch",      type: "concept", label: "Dutch auction" },
      { source: "flowers",  target: "airport-f",  type: "place",   label: "exported via Nairobi" },
      { source: "flowers",  target: "kibaki-f",   type: "event",   label: "Kibaki boom" },
      { source: "flowers",  target: "water-f",    type: "concept", label: "water rights conflict" },
      { source: "flowers",  target: "workers-f",  type: "person",  label: "100,000 workers" },
      { source: "flowers",  target: "valentine",  type: "concept", label: "Valentine's Day peak" },
      { source: "naivasha-f", target: "water-f",  type: "concept", label: "lake drained" },
    ],
  },

  "nse": {
    id: "nse",
    label: "Nairobi Securities Exchange",
    nodes: [
      { id: "nse",       label: "Nairobi Securities Exchange", type: "concept", href: "/Corporate-Kenya/Nairobi-Stock-Exchange",          desc: "Founded 1954. East Africa's largest bourse. 60+ listed companies." },
      { id: "founded",   label: "Founded 1954",          type: "event",   href: "/Corporate-Kenya/Nairobi-Stock-Exchange",                desc: "Started under British colonial rule. Only Europeans could trade. Changed at independence." },
      { id: "self-reg",  label: "Self-Regulation 1991",  type: "event",   href: "/Corporate-Kenya/Nairobi-Stock-Exchange",                desc: "NSE became self-regulating 1991. Major liberalisation step." },
      { id: "safaricom-ipo", label: "Safaricom IPO 2008", type: "event", href: "/Corporate-Kenya/Nairobi-Stock-Exchange",                desc: "Largest IPO in East African history. 860,000 retail investors. National moment." },
      { id: "mobile-t",  label: "Mobile Trading",        type: "concept", href: "/Technology/Digital-Financial-Inclusion",               desc: "Mobile platforms democratised share trading. M-Akiba government bond via phone." },
      { id: "equity-b",  label: "Equity Bank Listing",   type: "event",   href: "/Corporate-Kenya/Nairobi-Stock-Exchange",               desc: "Equity Bank listed 2006. A bank for the unbanked. Now a blue chip." },
      { id: "east-africa-n", label: "East Africa Hub",   type: "concept", href: "/Corporate-Kenya/Nairobi-Stock-Exchange",               desc: "NSE is East Africa's financial hub. Rwanda, Uganda, Tanzania link up." },
      { id: "bond",      label: "Bond Market",           type: "concept", href: "/Corporate-Kenya/Nairobi-Stock-Exchange",               desc: "Government bonds dominate. Infrastructure finance. Growing corporate bond market." },
    ],
    links: [
      { source: "nse",       target: "founded",      type: "event",   label: "founded 1954" },
      { source: "nse",       target: "self-reg",     type: "event",   label: "self-regulated 1991" },
      { source: "nse",       target: "safaricom-ipo", type: "event",  label: "Safaricom IPO 2008" },
      { source: "nse",       target: "mobile-t",     type: "concept", label: "mobile trading" },
      { source: "nse",       target: "equity-b",     type: "event",   label: "Equity Bank listed" },
      { source: "nse",       target: "east-africa-n", type: "concept", label: "East Africa hub" },
      { source: "nse",       target: "bond",         type: "concept", label: "bond market" },
      { source: "mobile-t",  target: "equity-b",     type: "event",   label: "mobile investors" },
    ],
  },

  "kenya-tourism": {
    id: "kenya-tourism",
    label: "Kenya Tourism History",
    nodes: [
      { id: "tourism",   label: "Kenya Tourism",         type: "concept", href: "/Coast-History/Post-Independence-Tourism",               desc: "Kenya's tourism is older than independence. Safari culture, coast beaches, wildlife." },
      { id: "safari-era",label: "Colonial Safari Era",   type: "event",   href: "/Coast-History/Colonial-Tourism",                        desc: "Hunting safaris for European aristocrats from the 1900s. Roosevelt and Hemingway." },
      { id: "hemingway", label: "Ernest Hemingway",      type: "person",  href: "/Trails/Joy-and-George-Adamson:-Born-Free",              desc: "Hemingway hunted in Kenya in 1933. His writing made the safari romantic." },
      { id: "wildlife-t",label: "Wildlife Tourism",      type: "concept", href: "/Conservation/Wildlife-Tourism-Revenue",                 desc: "National parks opened to photo tourism from the 1950s. Peaceful alternative to hunting." },
      { id: "pev-t",     label: "Post-PEV Recovery",     type: "event",   href: "/Presidencies/Mwai-Kibaki-Presidency/Kibaki-and-Tourism-Post-PEV-Recovery", desc: "2007-08 violence crashed tourism. Recovery took years. The industry's vulnerability." },
      { id: "mara-t",    label: "Maasai Mara",           type: "place",   href: "/Trails/The-Maasai-Mara:-Paradise-and-Its-Price",        desc: "The jewel. Wildebeest migration. Most photographed landscape in Kenya." },
      { id: "diani",     label: "Diani Beach",           type: "place",   href: "/Swahili/Swahili-Coast-Tourism",                         desc: "Kenya's premier beach destination. White sand. Indian Ocean. Year-round sun." },
      { id: "westgate-t",label: "Westgate Attack 2013",  type: "event",   href: "/Presidencies/Uhuru-Kenyatta-Presidency",               desc: "Nairobi mall attack killed 67. Wiped $250m from tourism in weeks." },
      { id: "eco-t",     label: "Eco-Tourism Rise",      type: "concept", href: "/Trails/The-Community-Conservancy-Model",               desc: "Community conservancies sharing tourism revenue. A new model for Kenya." },
    ],
    links: [
      { source: "tourism",   target: "safari-era",  type: "event",   label: "colonial safari origins" },
      { source: "safari-era", target: "hemingway",  type: "person",  label: "Hemingway hunted here" },
      { source: "tourism",   target: "wildlife-t",  type: "concept", label: "wildlife tourism" },
      { source: "tourism",   target: "pev-t",       type: "event",   label: "PEV crash" },
      { source: "tourism",   target: "mara-t",      type: "place",   label: "Maasai Mara centrepiece" },
      { source: "tourism",   target: "diani",       type: "place",   label: "Diani beach" },
      { source: "tourism",   target: "westgate-t",  type: "event",   label: "Westgate attack impact" },
      { source: "tourism",   target: "eco-t",       type: "concept", label: "eco-tourism" },
      { source: "wildlife-t",target: "mara-t",      type: "place",   label: "Mara is the wildlife magnet" },
    ],
  },

  // =========================================================
  // SPORTS
  // =========================================================

  "kenya-athletics": {
    id: "kenya-athletics",
    label: "Kenya Athletics History",
    nodes: [
      { id: "athletics",  label: "Kenya Athletics",       type: "concept", href: "/Sports/Kenya-Athletics-Overview",                        desc: "Kenya dominates middle and long distance running. An unbroken 60-year tradition." },
      { id: "mexico1968", label: "1968 Mexico Olympics",  type: "event",   href: "/Sports/Kenya-1968-Mexico-City-Olympics",                 desc: "Kenya's breakout Games. Kipchoge Keino beat Jim Ryun. The beginning of the dynasty." },
      { id: "keino",      label: "Kipchoge Keino",        type: "person",  href: "/Sports/Kipchoge-Keino",                                  desc: "Kenya's first global athletics superstar. 1500m gold 1968. Fathered the dynasty." },
      { id: "altitude",   label: "Altitude Training",     type: "concept", href: "/Sports/Why-Kenya-Runs",                                  desc: "2000m+ highlands. High-altitude training is a key factor in Kenyan running success." },
      { id: "iten",       label: "Iten Training Camp",    type: "place",   href: "/Sports/Iten-Training-Camp",                              desc: "Home of Champions. Where the world's best runners train on Kenya's highlands." },
      { id: "wcross",     label: "World Cross Country",   type: "event",   href: "/Sports/Kenya-Cross-Country-Tradition",                   desc: "Kenya's most consistent title machine. 25+ team wins. The nursery of champions." },
      { id: "kalenjin-a", label: "Kalenjin Running",      type: "concept", href: "/Kalenjin/Eliud-Kipchoge-Deep-Dive",                      desc: "The Kalenjin community produces 80% of Kenya's runners. Genetics, culture, or both?" },
      { id: "temu",       label: "Naftali Temu",          type: "person",  href: "/Sports/Naftali-Temu",                                    desc: "Kenya's first Olympic gold medalist. 10,000m, Mexico City 1968." },
      { id: "breaking2-a",label: "Breaking2",             type: "event",   href: "/Sports/Breaking2-Project",                               desc: "Nike's 2017 project. Kipchoge ran 2:00:25. Completed the job in 2019 in Vienna." },
    ],
    links: [
      { source: "athletics",  target: "mexico1968", type: "event",   label: "1968 breakthrough" },
      { source: "mexico1968", target: "keino",      type: "person",  label: "Keino starred" },
      { source: "mexico1968", target: "temu",       type: "person",  label: "Temu won 10,000m gold" },
      { source: "athletics",  target: "altitude",   type: "concept", label: "altitude advantage" },
      { source: "athletics",  target: "iten",       type: "place",   label: "Iten training base" },
      { source: "athletics",  target: "wcross",     type: "event",   label: "cross country dominance" },
      { source: "athletics",  target: "kalenjin-a", type: "concept", label: "Kalenjin running culture" },
      { source: "athletics",  target: "breaking2-a", type: "event", label: "sub-2-hour pursuit" },
      { source: "iten",       target: "altitude",   type: "concept", label: "2400m altitude" },
    ],
  },

  "otieno-wandera": {
    id: "otieno-wandera",
    label: "Otieno Wandera",
    nodes: [
      { id: "wandera",    label: "Otieno Wandera",        type: "person",  href: "/Sports/Kenya-Football-Overview",                         desc: "Kenyan football figure. Part of Kenya's football history." },
      { id: "harambee-w", label: "Harambee Stars",        type: "concept", href: "/Sports/Harambee-Stars-History",                          desc: "Kenya's national football team. The arena where Kenyan football legends played." },
      { id: "gor-mahia",  label: "Gor Mahia FC",          type: "concept", href: "/Sports/Gor-Mahia-FC",                                    desc: "Kenya's most successful and popular football club. Founded 1968. Luo community." },
      { id: "kpl",        label: "Kenya Premier League",  type: "concept", href: "/Sports/Kenya-Premier-League",                            desc: "The top domestic league. AFC Leopards, Gor Mahia, Tusker FC." },
      { id: "afc",        label: "AFC Leopards",          type: "concept", href: "/Sports/AFC-Leopards",                                    desc: "The eternal rival of Gor Mahia. Ingwe. The Luhya club. Derby matches define seasons." },
      { id: "football-k", label: "Kenya Football History", type: "concept", href: "/Sports/Kenya-Football-Overview",                        desc: "Football has been Kenya's most popular sport for a century." },
      { id: "grassroots", label: "Football Grassroots",   type: "concept", href: "/Sports/Football-Grassroots-Kenya",                       desc: "Street football, school leagues. Where Kenyan talent is born and mostly lost." },
      { id: "afcon04",    label: "2004 AFCON Kenya",      type: "event",   href: "/Sports/2004-AFCON-Kenya",                                desc: "Kenya hosted the Africa Cup of Nations. A proud moment for the country." },
    ],
    links: [
      { source: "wandera",   target: "harambee-w", type: "concept", label: "played for Harambee Stars" },
      { source: "wandera",   target: "gor-mahia",  type: "concept", label: "club football" },
      { source: "harambee-w",target: "afcon04",    type: "event",   label: "AFCON 2004 host" },
      { source: "harambee-w",target: "kpl",        type: "concept", label: "players from KPL" },
      { source: "gor-mahia", target: "afc",        type: "concept", label: "eternal rivals" },
      { source: "wandera",   target: "football-k", type: "concept", label: "Kenya football tradition" },
      { source: "football-k",target: "grassroots", type: "concept", label: "grassroots pipeline" },
      { source: "kpl",       target: "gor-mahia",  type: "concept", label: "Gor in the league" },
    ],
  },

  "harambee-stars": {
    id: "harambee-stars",
    label: "Harambee Stars",
    nodes: [
      { id: "stars",      label: "Harambee Stars",        type: "concept", href: "/Sports/Harambee-Stars-History",                          desc: "Kenya's national football team. Founded 1960s. Inconsistent but passionate." },
      { id: "afcon-s",    label: "2004 AFCON Host",       type: "event",   href: "/Sports/2004-AFCON-Kenya",                                desc: "Kenya hosted the Africa Cup of Nations 2004. Quarter-finals. National pride." },
      { id: "wanyama",    label: "Victor Wanyama",        type: "person",  href: "/Sports/Victor-Wanyama",                                  desc: "Kenya's greatest ever footballer. Celtic, Tottenham, MLS. 60+ caps." },
      { id: "olunga",     label: "Michael Olunga",        type: "person",  href: "/Sports/Michael-Olunga",                                  desc: "Kenya's most prolific striker. J-League golden boot. Qatar club star." },
      { id: "federation", label: "Football Kenya Federation", type: "concept", href: "/Sports/Football-Kenya-Federation",                   desc: "FKF. Governance scandals, FIFA bans, and the perennial struggle to develop the game." },
      { id: "nyayo",      label: "Nyayo Stadium",         type: "place",   href: "/Sports/Moi-International-Sports-Centre",                 desc: "Kenya's national stadium. 30,000 capacity. Nairobi. The home of Harambee Stars." },
      { id: "cecafa",     label: "CECAFA Championships",  type: "event",   href: "/Sports/Kenya-Football-Overview",                         desc: "East and Central African championship. Kenya's consistent tournament." },
      { id: "corruption-f", label: "Football Governance", type: "concept", href: "/Sports/Football-Kenya-Corruption",                       desc: "Match-fixing, FKF corruption, FIFA bans. Kenyan football's structural problems." },
    ],
    links: [
      { source: "stars",     target: "afcon-s",     type: "event",   label: "hosted AFCON 2004" },
      { source: "stars",     target: "wanyama",     type: "person",  label: "greatest player" },
      { source: "stars",     target: "olunga",      type: "person",  label: "leading striker" },
      { source: "stars",     target: "federation",  type: "concept", label: "governed by FKF" },
      { source: "stars",     target: "nyayo",       type: "place",   label: "home stadium" },
      { source: "stars",     target: "cecafa",      type: "event",   label: "CECAFA competitions" },
      { source: "stars",     target: "corruption-f", type: "concept", label: "governance problems" },
      { source: "federation",target: "corruption-f", type: "concept", label: "FKF corruption" },
    ],
  },

  "marathon-champions": {
    id: "marathon-champions",
    label: "Marathon Champions Kenya",
    nodes: [
      { id: "marathon-c", label: "Kenya Marathon Champions", type: "concept", href: "/Sports/Kenya-Marathon-Majors",                       desc: "More marathon world records than any nation. A half-century of dominance." },
      { id: "kipchoge-c", label: "Eliud Kipchoge",       type: "person",  href: "/Sports/Eliud-Kipchoge",                                  desc: "The GOAT. World record 2:01:09 in 2023. Sub-2 hours in Vienna 2019." },
      { id: "ndereba-c",  label: "Catherine Ndereba",    type: "person",  href: "/Sports/Catherine-Ndereba",                               desc: "Four-time Boston champion. Two-time world champion. Mama Catherine." },
      { id: "kosgei-c",   label: "Brigid Kosgei",        type: "person",  href: "/Kalenjin/Brigid-Kosgei",                                 desc: "Women's world record holder. Chicago 2019. 2:14:04. Kapchorwa trained." },
      { id: "kipsang-c",  label: "Wilson Kipsang",       type: "person",  href: "/Sports/Wilson-Kipsang",                                   desc: "Former world record holder. Berlin 2013. Multiple World Major wins." },
      { id: "tergat-c",   label: "Paul Tergat",          type: "person",  href: "/Sports/Paul-Tergat",                                      desc: "Berlin 2003 world record. Five World Cross Country golds." },
      { id: "boston-c",   label: "Boston Marathon",      type: "event",   href: "/Sports/Boston-Marathon-Kenya",                            desc: "Kenya's favourite major. Dominated for four decades." },
      { id: "berlin-c",   label: "Berlin Marathon",      type: "event",   href: "/Sports/Berlin-Marathon-Kenya",                            desc: "World record course. Flat. Fast. Kenyan world records happen here." },
      { id: "kaptagat",   label: "Kaptagat Group",       type: "place",   href: "/Kalenjin/Eliud-Kipchoge-Deep-Dive",                       desc: "Kipchoge's training camp. High altitude. 120km a week. Champions factory." },
    ],
    links: [
      { source: "marathon-c", target: "kipchoge-c", type: "person",  label: "GOAT" },
      { source: "marathon-c", target: "ndereba-c",  type: "person",  label: "women's legend" },
      { source: "marathon-c", target: "kosgei-c",   type: "person",  label: "women's world record" },
      { source: "marathon-c", target: "kipsang-c",  type: "person",  label: "former world record" },
      { source: "marathon-c", target: "tergat-c",   type: "person",  label: "Berlin 2003 record" },
      { source: "marathon-c", target: "boston-c",   type: "event",   label: "Boston dominance" },
      { source: "marathon-c", target: "berlin-c",   type: "event",   label: "Berlin world records" },
      { source: "kipchoge-c", target: "kaptagat",   type: "place",   label: "trains at Kaptagat" },
      { source: "ndereba-c",  target: "boston-c",   type: "event",   label: "four Boston wins" },
    ],
  },

  // =========================================================
  // SOCIETY
  // =========================================================

  "women-parliament": {
    id: "women-parliament",
    label: "Kenyan Women in Parliament",
    nodes: [
      { id: "women-p",    label: "Women in Parliament",   type: "concept", href: "/Women/Female-Government-Representation",                 desc: "Kenya's female parliamentary representation. Rising since 2010 constitution." },
      { id: "constitution-w", label: "2010 Two-Thirds Rule", type: "event", href: "/Trails/The-Constitution-of-2010",                     desc: "2010 Constitution: no gender can hold more than two-thirds of elective seats. Still unmet." },
      { id: "ngilu",      label: "Charity Ngilu",         type: "person",  href: "/Women/Charity-Ngilu-Political-Career",                   desc: "First woman presidential candidate 1997. Powerful minister. Kitui governor." },
      { id: "karua",      label: "Martha Karua",          type: "person",  href: "/Political-Movements/The-Second-Liberation",              desc: "Iron Lady of politics. Justice minister. 2022 presidential running mate." },
      { id: "ogot-w",     label: "Grace Ogot",            type: "person",  href: "/Luo/Grace-Ogot-Deep-Dive",                               desc: "First East African woman novelist. First woman MP from Nyanza 1983." },
      { id: "firstmp",    label: "First Women MPs",       type: "event",   href: "/Women/Female-Government-Representation",                 desc: "First women elected to parliament in independent Kenya. A long wait." },
      { id: "quota",      label: "Women's Quota Debate",  type: "concept", href: "/Women/Female-Government-Representation",                 desc: "The constitutional gender rule has never been met. Court orders ignored by parliament." },
      { id: "county-w",   label: "County Women Reps",     type: "concept", href: "/Women/Female-Government-Representation",                 desc: "2013 devolution created county women representative seats. Progress." },
      { id: "gbv",        label: "GBV and Leadership",    type: "concept", href: "/Women/Female-Government-Representation",                 desc: "Women politicians face harassment and GBV. A barrier to full participation." },
    ],
    links: [
      { source: "women-p",    target: "constitution-w", type: "event",   label: "2010 two-thirds rule" },
      { source: "women-p",    target: "ngilu",          type: "person",  label: "pioneering leader" },
      { source: "women-p",    target: "karua",          type: "person",  label: "Iron Lady" },
      { source: "women-p",    target: "ogot-w",         type: "person",  label: "first Nyanza MP" },
      { source: "women-p",    target: "firstmp",        type: "event",   label: "first women MPs" },
      { source: "women-p",    target: "quota",          type: "concept", label: "gender quota" },
      { source: "women-p",    target: "county-w",       type: "concept", label: "county women reps" },
      { source: "women-p",    target: "gbv",            type: "concept", label: "GBV barrier" },
      { source: "constitution-w", target: "quota",      type: "concept", label: "quota unmet" },
    ],
  },

  "land-clashes": {
    id: "land-clashes",
    label: "Land Clashes Kenya",
    nodes: [
      { id: "clashes",    label: "Land Clashes Kenya",    type: "event",   href: "/Elections/1992-Election",                                desc: "Repeated cycles of ethnic violence over land. 1992, 1997, 2007. Rift Valley epicentre." },
      { id: "rift-c",     label: "Rift Valley 1992",      type: "event",   href: "/Elections/1992-Election",                                desc: "Multiparty election season. Clashes displaced 300,000. Moi era orchestration." },
      { id: "coast-c",    label: "1997 Coast Clashes",    type: "event",   href: "/Elections/1997-Election",                                desc: "Likoni ferry attacks. Ethnic mobilisation against up-country communities." },
      { id: "moi-c",      label: "Daniel arap Moi",       type: "person",  href: "/Presidencies/Daniel-arap-Moi-Presidency",               desc: "Critics accused Moi of orchestrating 1992-97 clashes to suppress opposition." },
      { id: "colonial-c", label: "Colonial Land Legacy",  type: "concept", href: "/Trails/The-Land-Question",                              desc: "Colonial boundaries and alienation created the land disputes that explode as violence." },
      { id: "pev-c",      label: "2007-08 PEV",           type: "event",   href: "/Trails/When-Kenya-Burned%3A-2007-08",                   desc: "PEV's violence was partially over land in the Rift Valley and Coast." },
      { id: "idp-c",      label: "IDP Communities",       type: "concept", href: "/Elections/2007-08-Post-Election-Violence",              desc: "Millions displaced over the decades. Some IDP camps lasted 20+ years." },
      { id: "reform-c",   label: "Land Reform Commission", type: "event",  href: "/Trails/The-Land-Question",                              desc: "Multiple commissions on land. 2010 NLC created. Implementation slow." },
      { id: "nandik",     label: "Nandi-Kipsigis Conflicts", type: "event", href: "/Counties/Nandi/Nandi-Hills",                           desc: "Internal Kalenjin land conflicts. Land is not just an ethnic but a clan issue." },
    ],
    links: [
      { source: "clashes",  target: "rift-c",    type: "event",   label: "Rift Valley 1992" },
      { source: "clashes",  target: "coast-c",   type: "event",   label: "Coast 1997" },
      { source: "clashes",  target: "moi-c",     type: "person",  label: "Moi implicated" },
      { source: "clashes",  target: "colonial-c", type: "concept", label: "colonial root cause" },
      { source: "clashes",  target: "pev-c",     type: "event",   label: "2007 land dimension" },
      { source: "clashes",  target: "idp-c",     type: "concept", label: "mass displacement" },
      { source: "clashes",  target: "reform-c",  type: "event",   label: "land reform attempts" },
      { source: "clashes",  target: "nandik",    type: "event",   label: "intra-Kalenjin conflicts" },
      { source: "colonial-c", target: "rift-c",  type: "event",   label: "colonial roots of Rift conflict" },
    ],
  },

  "pastoral-communities": {
    id: "pastoral-communities",
    label: "Pastoral Communities Kenya",
    nodes: [
      { id: "pastoral",   label: "Pastoral Communities",  type: "concept", href: "/Conservation/Pastoralists-and-Conservation",            desc: "Kenya's herders: Maasai, Turkana, Samburu, Borana, Rendille. 25% of land area." },
      { id: "maasai-p",   label: "Maasai Pastoralism",    type: "concept", href: "/Maasai/Maasai_Pastoralism",                             desc: "Cattle as wealth and identity. The Mara is Maasai land managed for centuries." },
      { id: "turkana-p",  label: "Turkana People",        type: "person",  href: "/Turkana/Turkana-People-Overview",                        desc: "1.2 million people. One of Kenya's largest pastoralist communities. Jade Sea." },
      { id: "samburu-p",  label: "Samburu",               type: "person",  href: "/Maasai/Samburu",                                        desc: "Northern Kenya. Related to Maasai. Camel and cattle herders of the north." },
      { id: "drought-p",  label: "Drought and Livelihoods", type: "event", href: "/Trails/Food-and-Drought",                               desc: "Drought kills livestock, destroys pastoral livelihoods. Recurring crisis." },
      { id: "land-p",     label: "Land Rights",           type: "concept", href: "/Trails/The-Land-Question",                              desc: "Pastoralists have weak land rights. Settlement programmes pushed them to marginal land." },
      { id: "asal",       label: "Arid and Semi-Arid Lands", type: "place", href: "/Turkana/Turkana-People-Overview",                      desc: "ASAL covers 80% of Kenya. Home to pastoral communities. Long neglected." },
      { id: "farmer-p",   label: "Farmer-Herder Conflict", type: "event",  href: "/Conservation/Pastoralists-and-Conservation",            desc: "Expanding farmland clashes with pastoral migration routes. Violence follows." },
      { id: "climate-p",  label: "Climate Change",        type: "concept", href: "/Maasai/Maasai_and_Climate_Change",                      desc: "Longer droughts, unpredictable rains. Pastoral systems under extreme pressure." },
    ],
    links: [
      { source: "pastoral",  target: "maasai-p",   type: "concept", label: "Maasai pastoralism" },
      { source: "pastoral",  target: "turkana-p",  type: "person",  label: "Turkana herders" },
      { source: "pastoral",  target: "samburu-p",  type: "person",  label: "Samburu herders" },
      { source: "pastoral",  target: "drought-p",  type: "event",   label: "drought crisis" },
      { source: "pastoral",  target: "land-p",     type: "concept", label: "land rights" },
      { source: "pastoral",  target: "asal",       type: "place",   label: "ASAL homeland" },
      { source: "pastoral",  target: "farmer-p",   type: "event",   label: "farmer-herder conflict" },
      { source: "pastoral",  target: "climate-p",  type: "concept", label: "climate pressure" },
      { source: "drought-p", target: "climate-p",  type: "concept", label: "climate worsens drought" },
    ],
  },

  "urban-migration": {
    id: "urban-migration",
    label: "Urban Migration Kenya",
    nodes: [
      { id: "urban",      label: "Urban Migration Kenya",  type: "concept", href: "/Europeans/Nairobi%27s-Founding",                       desc: "Kenya's urbanisation rate is among Africa's fastest. Nairobi is the engine." },
      { id: "nairobi-u",  label: "Nairobi",               type: "place",   href: "/Europeans/Nairobi%27s-Founding",                        desc: "From 350,000 at independence to 5 million today. Kenya's urban magnet." },
      { id: "kibera-u",   label: "Kibera",                type: "place",   href: "/Counties/Nairobi/Nairobi-Slums",                        desc: "250,000 to 1 million people. East Africa's largest informal settlement." },
      { id: "matatu",     label: "Matatu Culture",        type: "concept", href: "/Trails/FM-Radio-Changed-Everything",                    desc: "Minibus taxis that define Nairobi. Art, music, chaos, efficiency." },
      { id: "eastleigh",  label: "Eastleigh",             type: "place",   href: "/Somali/Garissa-County-Economy",                         desc: "Nairobi's Somali commercial hub. From refugee settlement to billion-dollar economy." },
      { id: "rural-u",    label: "Rural-Urban Push",      type: "concept", href: "/Poverty/Rural-Urban-Migration-Kenya",                   desc: "Land scarcity, unemployment, and services push youth to cities." },
      { id: "informal",   label: "Informal Economy",      type: "concept", href: "/Poverty/Urban-Informal-Economy",                        desc: "80% of Nairobi's workers are in the informal sector. Jua kali, hawkers, traders." },
      { id: "mombasa-u",  label: "Mombasa",               type: "place",   href: "/Swahili/Mombasa",                                       desc: "Kenya's second largest city. Port city. Growing urban population." },
      { id: "women-u",    label: "Women in Urban Migration", type: "person", href: "/Women/Female-Headed-Households",                     desc: "Women migrate for education and work. Female-headed households rise in cities." },
    ],
    links: [
      { source: "urban",    target: "nairobi-u", type: "place",   label: "Nairobi as magnet" },
      { source: "urban",    target: "kibera-u",  type: "place",   label: "Kibera informal" },
      { source: "urban",    target: "matatu",    type: "concept", label: "matatu culture" },
      { source: "urban",    target: "eastleigh", type: "place",   label: "Eastleigh hub" },
      { source: "urban",    target: "rural-u",   type: "concept", label: "rural-urban push" },
      { source: "urban",    target: "informal",  type: "concept", label: "informal economy" },
      { source: "urban",    target: "mombasa-u", type: "place",   label: "Mombasa growth" },
      { source: "urban",    target: "women-u",   type: "person",  label: "women migrants" },
      { source: "nairobi-u",target: "kibera-u",  type: "place",   label: "Kibera in Nairobi" },
    ],
  },

  "kenyan-diaspora": {
    id: "kenyan-diaspora",
    label: "Kenyan Diaspora",
    nodes: [
      { id: "diaspora",   label: "Kenyan Diaspora",       type: "concept", href: "/Diaspora/Business-Remittances-Impact",                   desc: "3 million Kenyans abroad. UK, USA, Gulf, Australia. Remittances are $4bn a year." },
      { id: "usa-d",      label: "USA",                   type: "place",   href: "/Diaspora/Academics-Researchers-Abroad",                  desc: "Largest diaspora concentration. 100,000+ Kenyans. Obama connection." },
      { id: "uk-d",       label: "UK",                    type: "place",   href: "/Diaspora/Brain-Drain-Concerns",                          desc: "Second largest. NHS is full of Kenyan nurses and doctors. Historical ties." },
      { id: "remittances",label: "Remittances",           type: "concept", href: "/Diaspora/Business-Remittances-Impact",                   desc: "$4bn a year. Exceed foreign direct investment. Lifeline for families." },
      { id: "obama-d",    label: "Obama Kenya Connection", type: "person", href: "/Trails/Barack-Obama-Sr:-The-Brilliant-Wastrel",          desc: "Barack Obama's father was Kenyan. His presidency changed Kenya's global image." },
      { id: "braindrain", label: "Brain Drain",           type: "concept", href: "/Diaspora/Brain-Drain-Concerns",                          desc: "Kenya's best doctors, engineers, academics leave. Public services suffer." },
      { id: "bonds-d",    label: "Diaspora Bonds",        type: "event",   href: "/Diaspora/Diaspora-Bonds-Investment",                     desc: "Kenya launched diaspora bonds to channel remittances into infrastructure." },
      { id: "identity-d", label: "Identity Abroad",       type: "concept", href: "/Diaspora/Cultural-Assimilation-Pressures",               desc: "Diaspora Kenyans negotiate between Kenyan and adopted identities." },
      { id: "return",     label: "Return Migration",      type: "event",   href: "/Diaspora/Academics-Researchers-Abroad",                  desc: "Younger Kenyans returning with skills and capital. Tech sector benefiting." },
    ],
    links: [
      { source: "diaspora",  target: "usa-d",      type: "place",   label: "USA concentration" },
      { source: "diaspora",  target: "uk-d",       type: "place",   label: "UK concentration" },
      { source: "diaspora",  target: "remittances", type: "concept", label: "sends remittances" },
      { source: "diaspora",  target: "obama-d",    type: "person",  label: "Obama connection" },
      { source: "diaspora",  target: "braindrain", type: "concept", label: "brain drain" },
      { source: "diaspora",  target: "bonds-d",    type: "event",   label: "diaspora bonds" },
      { source: "diaspora",  target: "identity-d", type: "concept", label: "identity abroad" },
      { source: "diaspora",  target: "return",     type: "event",   label: "return migration" },
      { source: "usa-d",     target: "obama-d",    type: "person",  label: "Obama in USA" },
    ],
  },

  "education-history": {
    id: "education-history",
    label: "Education History Kenya",
    nodes: [
      { id: "education",  label: "Kenya Education History", type: "concept", href: "/Education/Colonialism-Education-Legacy",              desc: "From missionary schools to 8-4-4 to CBC. Education has always been political." },
      { id: "mission",    label: "Mission Schools",         type: "event",   href: "/Education/Mission-Schools-Colonial-Era",              desc: "Alliance, Maseno, St Mary's. Mission schools educated Kenya's first elites." },
      { id: "ominde",     label: "Ominde Commission 1964", type: "event",   href: "/Education/Ominde-Commission",                         desc: "Kenya's first education policy. Africanisation. Common curriculum. Rapid expansion." },
      { id: "844",        label: "8-4-4 System",           type: "event",   href: "/Education/8-4-4-System-Implementation",               desc: "Introduced 1985 under Moi. Practical bias. Two generations shaped by it." },
      { id: "harambee-e", label: "Harambee Schools",       type: "event",   href: "/Education/Harambee-Self-Help-Movement",               desc: "Community-built secondary schools. 1963-1980s expansion. Self-help in action." },
      { id: "university", label: "University Expansion",   type: "concept", href: "/Education/Kenyatta-University-Establishment",         desc: "From one university to 70+. Massification has challenged quality." },
      { id: "cbc",        label: "CBC Reform",             type: "event",   href: "/Education/Competency-Based-Curriculum",               desc: "Competency Based Curriculum from 2019. Replacing 8-4-4. Controversial transition." },
      { id: "alliance-h", label: "Alliance High School",   type: "place",   href: "/Education/Alliance-High-School-Elite",                desc: "Kenya's most elite school. Founded 1926. Produced five presidents and two Nobel winners." },
      { id: "inequality", label: "Education Inequality",   type: "concept", href: "/Education/Colonial-Racial-Segregation-Education",     desc: "Urban-rural divide. Private-public divide. Class reproduction through schools." },
    ],
    links: [
      { source: "education", target: "mission",    type: "event",   label: "mission school roots" },
      { source: "education", target: "ominde",     type: "event",   label: "Ominde 1964" },
      { source: "education", target: "844",        type: "event",   label: "8-4-4 system" },
      { source: "education", target: "harambee-e", type: "event",   label: "Harambee schools" },
      { source: "education", target: "university", type: "concept", label: "university expansion" },
      { source: "education", target: "cbc",        type: "event",   label: "CBC reform" },
      { source: "education", target: "alliance-h", type: "place",   label: "Alliance High School" },
      { source: "education", target: "inequality", type: "concept", label: "persistent inequality" },
      { source: "844",       target: "cbc",        type: "event",   label: "CBC replaced 8-4-4" },
    ],
  },

  "media-history": {
    id: "media-history",
    label: "Kenyan Media History",
    nodes: [
      { id: "media",      label: "Kenya Media History",    type: "concept", href: "/Media/East-African-Standard",                          desc: "From colonial newspaper to digital era. A century of press freedom struggles." },
      { id: "standard",   label: "East African Standard", type: "event",   href: "/Media/East-African-Standard",                          desc: "Founded 1902. The oldest newspaper in East Africa. Colonial voice, then independent." },
      { id: "nation",     label: "Daily Nation",           type: "event",   href: "/Media/Daily-Nation-Establishment",                    desc: "Founded 1958 by Aga Khan. Became Kenya's dominant newspaper." },
      { id: "vok",        label: "Voice of Kenya",         type: "event",   href: "/Media/Radio-Voice-of-Kenya-Origins",                  desc: "State broadcaster from 1964. KBC from 1989. Government propaganda tool under Moi." },
      { id: "fm-m",       label: "FM Radio Revolution",    type: "event",   href: "/Trails/FM-Radio-Changed-Everything",                   desc: "1996 liberalisation. FM stations exploded. Private radio transformed public debate." },
      { id: "digital-m",  label: "Digital Media Shift",   type: "event",   href: "/Media/Digital-Media-Shift",                           desc: "Blogs, Twitter, YouTube. 2007 election reported citizen-to-citizen for the first time." },
      { id: "censorship-m", label: "Media Censorship",    type: "concept", href: "/Media/Censorship-Restrictions",                       desc: "Moi regime controlled media tightly. Journalists jailed. Publications banned." },
      { id: "citizen",    label: "Citizen Journalism",     type: "concept", href: "/Media/Citizen-Journalism",                            desc: "Ushahidi was born from the 2007 crisis. Mapping violence via SMS." },
      { id: "mediabill",  label: "Media Bills Controversy", type: "event", href: "/Media/Election-Coverage-Controversies",               desc: "2013-14 media bills threatened press freedom. Journalists resisted." },
    ],
    links: [
      { source: "media",    target: "standard",    type: "event",   label: "East African Standard 1902" },
      { source: "media",    target: "nation",      type: "event",   label: "Daily Nation 1958" },
      { source: "media",    target: "vok",         type: "event",   label: "Voice of Kenya" },
      { source: "media",    target: "fm-m",        type: "event",   label: "FM revolution 1996" },
      { source: "media",    target: "digital-m",   type: "event",   label: "digital era" },
      { source: "media",    target: "censorship-m", type: "concept", label: "Moi censorship" },
      { source: "media",    target: "citizen",     type: "concept", label: "citizen journalism" },
      { source: "media",    target: "mediabill",   type: "event",   label: "media bills 2013" },
      { source: "digital-m",target: "citizen",     type: "concept", label: "digital empowers citizens" },
    ],
  },

  "religious-diversity": {
    id: "religious-diversity",
    label: "Religious Diversity Kenya",
    nodes: [
      { id: "religion",   label: "Religious Diversity",   type: "concept", href: "/Religion/Church-and-State-Relations",                  desc: "80% Christian. 11% Muslim. Indigenous beliefs persist. A remarkably diverse coexistence." },
      { id: "christianity",label: "Christianity",         type: "concept", href: "/Religion/Christianity-and-Colonial-Missions",          desc: "80% of Kenyans. Introduced by missionaries. Now mostly Pentecostal and evangelical." },
      { id: "islam-r",    label: "Islam on Coast and NFD", type: "concept", href: "/Swahili/Islam-on-the-Swahili-Coast",                  desc: "A thousand years on the coast. NFD is majority Muslim. 11% of Kenya." },
      { id: "traditional-r", label: "Traditional Beliefs", type: "concept", href: "/Kikuyu/Facing-Mount-Kenya",                          desc: "Indigenous spiritual traditions persist within and alongside Christianity." },
      { id: "legiomaria", label: "Legio Maria Church",    type: "event",   href: "/Trails/Luo-Christianity:-The-Legio-Maria-Church",       desc: "African independent church founded by Simeo Ondeto 1963. 1 million members." },
      { id: "hinduism",   label: "Hindu Community",       type: "concept", href: "/Asians/Asians-in-Kenya",                               desc: "The Asian community brought Hinduism. Temples in Nairobi, Mombasa, Kisumu." },
      { id: "church-state", label: "Church and State",    type: "concept", href: "/Religion/Church-and-State-Relations",                  desc: "Churches spoke against Moi. Religious leaders shaped the second liberation." },
      { id: "pentecostal", label: "Pentecostal Growth",   type: "event",   href: "/Religion/Charismatic-Christianity-Impact",             desc: "Pentecostalism exploded from the 1980s. Prosperity gospel, miracles, megachurches." },
      { id: "interfaith", label: "Interfaith Relations",  type: "concept", href: "/Religion/Church-and-State-Relations",                  desc: "NCCK, SUPKEM, Hindu Council. Interfaith dialogue navigates a diverse society." },
    ],
    links: [
      { source: "religion",    target: "christianity", type: "concept", label: "80% Christian" },
      { source: "religion",    target: "islam-r",      type: "concept", label: "11% Muslim" },
      { source: "religion",    target: "traditional-r", type: "concept", label: "indigenous beliefs" },
      { source: "religion",    target: "legiomaria",   type: "event",   label: "Legio Maria" },
      { source: "religion",    target: "hinduism",     type: "concept", label: "Hindu community" },
      { source: "religion",    target: "church-state", type: "concept", label: "church and state" },
      { source: "religion",    target: "pentecostal",  type: "event",   label: "Pentecostal boom" },
      { source: "religion",    target: "interfaith",   type: "concept", label: "interfaith dialogue" },
      { source: "christianity", target: "pentecostal", type: "event",  label: "Pentecostal within Christianity" },
    ],
  },

  "climate-drought": {
    id: "climate-drought",
    label: "Climate and Drought Kenya",
    nodes: [
      { id: "climate",    label: "Climate and Drought",   type: "concept", href: "/Trails/Food-and-Drought",                              desc: "Drought is Kenya's oldest and most recurring crisis. Climate change is making it worse." },
      { id: "famine2011", label: "2011 Horn of Africa Famine", type: "event", href: "/Trails/Dadaab:-The-World%27s-Largest-Camp",         desc: "Worst drought in 60 years. 260,000 died. Dadaab overflowed. A climate catastrophe." },
      { id: "turkana-c",  label: "Turkana Drought Zone",  type: "place",   href: "/Turkana/Turkana-People-Overview",                      desc: "Turkana County is in permanent drought crisis. Groundwater and aid keep it alive." },
      { id: "pastoral-c", label: "Pastoral Livelihoods",  type: "concept", href: "/Trails/Food-and-Drought",                              desc: "Drought kills livestock. Pastoral families lose everything in weeks." },
      { id: "asal-c",     label: "ASAL Policy",           type: "concept", href: "/Turkana/Turkana-People-Overview",                      desc: "Arid and Semi-Arid Lands policy. Perennially underfunded. Devolution changed something." },
      { id: "elnino",     label: "El Nino Floods",        type: "event",   href: "/Trails/Food-and-Drought",                              desc: "Kenya swings between drought and floods. El Nino 2023-24 devastated coastal areas." },
      { id: "food",       label: "Food Security",         type: "concept", href: "/Trails/Food-and-Drought",                              desc: "10 million Kenyans food insecure. A chronic crisis masked by average GDP growth." },
      { id: "glaciers-c", label: "Mount Kenya Glaciers",  type: "event",   href: "/Trails/Mount-Kenya:-The-Sacred-Mountain",              desc: "Kenya's glaciers are gone by 2050 on current trajectory. Fresh water threat." },
      { id: "drought2022",label: "2022 Drought Emergency", type: "event",  href: "/Maasai/Maasai_Food_Insecurity_and_Drought",            desc: "Fourth consecutive failed rainy season. 4 million facing starvation in 2022." },
    ],
    links: [
      { source: "climate",    target: "famine2011", type: "event",   label: "2011 famine" },
      { source: "climate",    target: "turkana-c",  type: "place",   label: "Turkana drought" },
      { source: "climate",    target: "pastoral-c", type: "concept", label: "pastoral impact" },
      { source: "climate",    target: "asal-c",     type: "concept", label: "ASAL policy" },
      { source: "climate",    target: "elnino",     type: "event",   label: "El Nino floods" },
      { source: "climate",    target: "food",       type: "concept", label: "food security" },
      { source: "climate",    target: "glaciers-c", type: "event",   label: "glaciers retreating" },
      { source: "climate",    target: "drought2022", type: "event",  label: "2022 drought" },
      { source: "famine2011", target: "pastoral-c", type: "concept", label: "herders worst hit" },
    ],
  },

  "conservation-history": {
    id: "conservation-history",
    label: "Conservation History Kenya",
    nodes: [
      { id: "conservation", label: "Conservation Kenya",  type: "concept", href: "/Conservation/Conservation-Timeline-Kenya",             desc: "From hunting grounds to world-class conservation. Kenya's wildlife story spans 100 years." },
      { id: "huntingban",   label: "1977 Hunting Ban",    type: "event",   href: "/Conservation/Conservation-Timeline-Kenya",             desc: "Kenya banned trophy hunting in 1977. A global first. The poaching crisis followed." },
      { id: "leakey-c",     label: "Richard Leakey KWS",  type: "person",  href: "/Trails/Richard-Leakey:-The-Man-Who-Built-Conservation", desc: "Leakey transformed KWS. Armed rangers. Shoot-to-kill. Poaching crashed." },
      { id: "ivory-c",      label: "Ivory Burning 1989",  type: "event",   href: "/Conservation/Conservation-Timeline-Kenya",             desc: "Moi burned 12 tonnes. Cameras rolled. CITES banned ivory trade that year." },
      { id: "amboseli-c",   label: "Amboseli Conservation", type: "place", href: "/Maasai/Amboseli",                                      desc: "Amboseli ecosystem. Maasai, elephants, and conservation politics." },
      { id: "communitycon", label: "Community Conservancies", type: "event", href: "/Trails/The-Community-Conservancy-Model",             desc: "Laikipia model. Communities benefit from conservation. Lewa, Ol Pejeta." },
      { id: "rhino",        label: "Black Rhino Recovery", type: "event",  href: "/Conservation/Conservation-Timeline-Kenya",             desc: "From 350 in 1984 to 950+ today. Kenya's greatest conservation success." },
      { id: "adamson",      label: "Joy and George Adamson", type: "person", href: "/Trails/Joy-and-George-Adamson:-Born-Free",           desc: "Born Free. Elsa the lioness. They made conservation a global conversation." },
      { id: "hwc",          label: "Human-Wildlife Conflict", type: "concept", href: "/Conservation/Conservation-vs-Land-Rights",          desc: "Elephants raid crops. Lions kill cattle. Communities pay the price of conservation." },
    ],
    links: [
      { source: "conservation", target: "huntingban",   type: "event",   label: "1977 hunting ban" },
      { source: "conservation", target: "leakey-c",     type: "person",  label: "Leakey built KWS" },
      { source: "conservation", target: "ivory-c",      type: "event",   label: "ivory burning 1989" },
      { source: "conservation", target: "amboseli-c",   type: "place",   label: "Amboseli model" },
      { source: "conservation", target: "communitycon", type: "event",   label: "community conservancies" },
      { source: "conservation", target: "rhino",        type: "event",   label: "rhino recovery" },
      { source: "conservation", target: "adamson",      type: "person",  label: "Born Free" },
      { source: "conservation", target: "hwc",          type: "concept", label: "human-wildlife conflict" },
      { source: "leakey-c",     target: "ivory-c",      type: "event",   label: "Leakey orchestrated burn" },
    ],
  },
}

// --- Build flat list from categories ---
const GRAPHS_FLAT = GRAPH_CATEGORIES.flatMap(cat =>
  cat.topics.map(id => GRAPH_DATA[id]).filter(Boolean)
)

let currentGraphId = GRAPHS_FLAT[0]?.id || "raila"
let currentSimulation: any = null

function buildKnowledgeGraphs() {
  const container = document.getElementById("ok-knowledge-graphs")
  if (!container) return
  if (container.dataset.rendered === "1") return
  container.dataset.rendered = "1"

  container.style.cssText = "width:100%;position:relative"

  // --- Inject styles ---
  const styleEl = document.createElement("style")
  styleEl.textContent = `
    .ok-dropdown-btn{width:100%;background:#1a1a1a;color:#ffffff;border:none;border-radius:6px;padding:10px 16px;font-size:14px;font-family:Inter,system-ui,sans-serif;cursor:pointer;display:flex;justify-content:space-between;align-items:center;transition:opacity 0.2s;}
    .ok-dropdown-btn:hover{opacity:0.9;}
    .ok-dropdown-panel{position:absolute;top:calc(100% + 4px);left:0;right:0;background:#fff;border:1px solid #c8c2b8;border-radius:6px;max-height:320px;overflow-y:auto;z-index:100;box-shadow:0 4px 16px rgba(0,0,0,0.12);}
    @media(max-width:640px){.ok-dropdown-panel{max-height:240px;}}
    .ok-dropdown-panel.ok-hidden{display:none;}
    .ok-cat-header{position:sticky;top:0;background:#f5f0e8;color:#1a1a1a;font-weight:700;font-size:0.75rem;text-transform:uppercase;letter-spacing:0.08em;padding:6px 14px;border-bottom:1px solid #e0d8ce;}
    .ok-topic-item{padding:8px 14px;font-size:13px;font-family:Inter,system-ui,sans-serif;cursor:pointer;color:#333;transition:background 0.15s;}
    .ok-topic-item:hover{background:#e8f0eb;}
    .ok-topic-item.ok-selected{background:#1a1a1a;color:#ffffff;}
    .ok-graph-title{color:#1a1a1a;font-weight:700;font-size:14px;font-family:Inter,system-ui,sans-serif;margin:8px 0 4px 0;}
  `
  document.head.appendChild(styleEl)

  // --- Dropdown wrapper ---
  const dropWrap = document.createElement("div")
  dropWrap.style.cssText = "position:relative;margin-bottom:8px;"
  container.appendChild(dropWrap)

  const dropBtn = document.createElement("button")
  dropBtn.className = "ok-dropdown-btn"
  dropWrap.appendChild(dropBtn)

  const dropPanel = document.createElement("div")
  dropPanel.className = "ok-dropdown-panel ok-hidden"
  dropWrap.appendChild(dropPanel)

  function getLabel() {
    const g = GRAPH_DATA[currentGraphId]
    if (!g) return "Select topic"
    return `${g.label} - ${g.nodes.length} nodes`
  }

  function updateBtn() {
    dropBtn.innerHTML = `<span>${getLabel()}</span><span style="font-size:11px;margin-left:8px;">&#9660;</span>`
  }

  function buildPanel() {
    dropPanel.innerHTML = ""
    GRAPH_CATEGORIES.forEach(cat => {
      const hdr = document.createElement("div")
      hdr.className = "ok-cat-header"
      hdr.textContent = cat.label
      dropPanel.appendChild(hdr)
      cat.topics.forEach(topicId => {
        const g = GRAPH_DATA[topicId]
        if (!g) return
        const item = document.createElement("div")
        item.className = "ok-topic-item" + (topicId === currentGraphId ? " ok-selected" : "")
        item.textContent = g.label
        item.addEventListener("click", () => {
          if (topicId === currentGraphId) { closePanel(); return }
          currentGraphId = topicId
          updateBtn()
          buildPanel()
          closePanel()
          switchGraph()
        })
        dropPanel.appendChild(item)
      })
    })
  }

  let panelOpen = false

  function openPanel() {
    dropPanel.classList.remove("ok-hidden")
    panelOpen = true
  }

  function closePanel() {
    dropPanel.classList.add("ok-hidden")
    panelOpen = false
  }

  dropBtn.addEventListener("click", (e) => {
    e.stopPropagation()
    if (panelOpen) closePanel()
    else { buildPanel(); openPanel() }
  })

  document.addEventListener("click", () => { if (panelOpen) closePanel() })
  dropPanel.addEventListener("click", e => e.stopPropagation())

  updateBtn()

  // --- Hint text ---
  const hint = document.createElement("p")
  hint.textContent = "Each graph maps a corner of Kenya's story. Click any node to explore."
  hint.style.cssText = "font-size:12px;color:#666;margin:4px 0 4px 0;font-family:Inter,system-ui,sans-serif;font-style:italic;"
  container.appendChild(hint)

  // --- Graph title ---
  const graphTitle = document.createElement("div")
  graphTitle.className = "ok-graph-title"
  container.appendChild(graphTitle)

  function updateTitle() {
    const g = GRAPH_DATA[currentGraphId]
    graphTitle.textContent = g ? g.label : ""
  }
  updateTitle()

  // --- Graph container ---
  const graphWrap = document.createElement("div")
  const isMobile = window.innerWidth < 640
  const H = isMobile ? 280 : 400
  graphWrap.style.cssText = [
    "width:100%",
    `height:${H}px`,
    "position:relative",
    "overflow:hidden",
    "border-radius:8px",
    "background:var(--light,#f8f6f1)",
  ].join(";")
  container.appendChild(graphWrap)

  // Loading indicator
  const loading = document.createElement("div")
  loading.textContent = "Loading..."
  loading.style.cssText = "position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:13px;color:#888;font-family:Inter,system-ui,sans-serif;pointer-events:none;"
  graphWrap.appendChild(loading)

  // Tooltip
  const tip = document.createElement("div")
  tip.style.cssText = "position:absolute;pointer-events:none;background:rgba(20,20,20,0.88);color:#fff;padding:6px 10px;border-radius:5px;font-size:11px;line-height:1.4;max-width:180px;display:none;z-index:100;"
  graphWrap.appendChild(tip)

  // SVG
  const svgEl = document.createElementNS("http://www.w3.org/2000/svg", "svg")
  svgEl.setAttribute("width", "100%")
  svgEl.setAttribute("height", String(H))
  svgEl.style.display = "block"
  graphWrap.appendChild(svgEl)

  const svg = select(svgEl)
  const gRoot = svg.append("g").attr("class", "kg-root")
  const W = graphWrap.clientWidth || 700

  // Zoom
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 3])
    .filter((event) => {
      if (event.type === "wheel") return event.ctrlKey || event.metaKey
      return !event.button
    })
    .on("zoom", (event) => gRoot.attr("transform", event.transform))
  svg.call(zoomBehavior as any)
  svgEl.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation() }, { passive: true })

  // Arrow markers
  const defs = svg.append("defs")
  const markerTypes = Object.keys(COLORS)
  markerTypes.forEach(type => {
    defs.append("marker")
      .attr("id", `kg-arrow-${type}`)
      .attr("viewBox", "0 -4 8 8")
      .attr("refX", 18)
      .attr("refY", 0)
      .attr("markerWidth", 5)
      .attr("markerHeight", 5)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-4L8,0L0,4")
      .attr("fill", COLORS[type])
      .attr("opacity", 0.6)
  })

  // Legend
  const legendDefs = [
    { type: "person",  label: "Person"  },
    { type: "event",   label: "Event"   },
    { type: "place",   label: "Place"   },
    { type: "concept", label: "Concept" },
  ]
  const legendG = svg.append("g").attr("transform", `translate(8,${H - 8})`)
  legendDefs.forEach((item, i) => {
    const row = legendG.append("g").attr("transform", `translate(${i * (isMobile ? 60 : 80)},0)`)
    row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", -5).attr("fill", COLORS[item.type])
    row.append("text")
      .attr("x", 13).attr("y", -1)
      .style("font-size", isMobile ? "8px" : "10px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .text(item.label)
  })

  function renderGraph(graphId: string, animate: boolean) {
    const dataset = GRAPH_DATA[graphId]
    if (!dataset) return

    if (loading.parentNode) loading.remove()

    if (currentSimulation) {
      currentSimulation.stop()
      currentSimulation = null
    }

    const nodes = dataset.nodes.map(n => ({ ...n })) as any[]
    const links = dataset.links.map(l => ({ ...l })) as any[]

    if (animate) {
      gRoot.transition().duration(200).style("opacity", 0).on("end", () => {
        gRoot.selectAll("*").remove()
        drawGraph(nodes, links)
        gRoot.style("opacity", 0).transition().duration(300).style("opacity", 1)
      })
    } else {
      gRoot.selectAll("*").remove()
      drawGraph(nodes, links)
    }
  }

  function drawGraph(nodes: any[], links: any[]) {
    const currentW = graphWrap.clientWidth || W

    const simulation = forceSimulation(nodes)
      .force("link", forceLink(links).id((d: any) => d.id).distance(isMobile ? 70 : 105))
      .force("charge", forceManyBody().strength(isMobile ? -200 : -280))
      .force("center", forceCenter(currentW / 2, H / 2))
      .force("collision", forceCollide().radius((d: any) => nodeRadius(d.type) + 9))

    currentSimulation = simulation

    const linkSel = gRoot.append("g")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#999")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.6)
      .attr("marker-end", (d: any) => `url(#kg-arrow-${d.type || "concept"})`)

    const dragBehavior = drag<SVGGElement, any>()
      .on("start", (event, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart()
        d.fx = d.x; d.fy = d.y
      })
      .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y })
      .on("end", (event, d) => {
        if (!event.active) simulation.alphaTarget(0)
        d.fx = null; d.fy = null
      })

    const nodeSel = gRoot.append("g")
      .selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(dragBehavior)

    nodeSel.append("circle")
      .attr("r", (d: any) => nodeRadius(d.type))
      .attr("fill", (d: any) => COLORS[d.type] || "#2c5282")
      .attr("stroke", "rgba(255,255,255,0.3)")
      .attr("stroke-width", 1.5)

    nodeSel.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", (d: any) => nodeRadius(d.type) + 12)
      .style("font-size", isMobile ? "8px" : "10px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .style("pointer-events", "none")
      .style("user-select", "none")
      .each(function(d: any) {
        const el = select(this)
        const words = d.label.split(" ")
        if (words.length <= 2 || isMobile) {
          el.text(d.label)
        } else {
          el.text(words.slice(0, 2).join(" "))
          el.append("tspan").attr("x", 0).attr("dy", "1.1em").text(words.slice(2).join(" "))
        }
      })

    nodeSel
      .on("mouseover", (_event: any, d: any) => {
        tip.style.display = "block"
        tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
      })
      .on("mousemove", (event: any) => {
        const rect = graphWrap.getBoundingClientRect()
        let x = event.clientX - rect.left + 12
        const y = event.clientY - rect.top - 10
        if (x + 190 > (graphWrap.clientWidth || W)) x -= 200
        tip.style.left = `${x}px`
        tip.style.top = `${y}px`
      })
      .on("mouseout", () => { tip.style.display = "none" })
      .on("click", (_event: any, d: any) => { if (d.href) window.location.href = d.href })
      .on("touchstart", (event: any, d: any) => {
        event.preventDefault()
        tip.style.display = "block"
        tip.innerHTML = `<strong>${d.label}</strong><br>${d.desc}`
        tip.style.left = "50%"
        tip.style.top = "8px"
        tip.style.transform = "translateX(-50%)"
      })

    simulation.on("tick", () => {
      linkSel
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y)
      nodeSel.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })
  }

  function switchGraph() {
    tip.style.display = "none"
    updateTitle()
    renderGraph(currentGraphId, true)
  }

  renderGraph(currentGraphId, false)
}

function tryInit() {
  const el = document.getElementById("ok-knowledge-graphs")
  if (el) {
    buildKnowledgeGraphs()
    return true
  }
  return false
}

document.addEventListener("nav", () => {
  const el = document.getElementById("ok-knowledge-graphs")
  if (el) {
    el.innerHTML = ""
    el.dataset.rendered = ""
    buildKnowledgeGraphs()
  }
})

tryInit()
