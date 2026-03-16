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

const COLORS: Record<string, string> = {
  center:   "#1a4a2e",
  family:   "#c2603a",
  alliance: "#5a7a5a",
  rival:    "#8b1a1a",
  event:    "#a08a3a",
  entity:   "#3a5a7a",
}

function nodeRadius(type: string) {
  return type === "center" ? 20 : 11
}

const GRAPHS: GraphDataset[] = [
  {
    id: "kipchoge",
    label: "Eliud Kipchoge",
    nodes: [
      { id: "kipchoge",  label: "Eliud Kipchoge",       type: "center",   href: "/Sports/Eliud-Kipchoge",               desc: "The greatest marathon runner of all time. Two Olympic golds. Sub-2-hour. Kaptagat built." },
      { id: "breaking2", label: "Nike Breaking2",        type: "event",    href: "/Sports/Breaking2-Project",            desc: "Nike's 2017 project to break the 2-hour marathon barrier. Kipchoge ran 2:00:25." },
      { id: "berlin",    label: "Berlin Marathon",       type: "event",    href: "/Sports/Berlin-Marathon-Kenya",        desc: "Where Kipchoge set the world record: 2:01:09 in 2018, then 2:01:09 again in 2022." },
      { id: "ineos",     label: "INEOS 1:59 Vienna",     type: "event",    href: "/Sports/INEOS-159-Challenge",          desc: "Vienna, 2019. Kipchoge ran 1:59:40. The first human to break two hours." },
      { id: "rio2016",   label: "Olympic Gold 2016",     type: "event",    href: "/Sports/Kenya-2016-Rio-Olympics",      desc: "Rio de Janeiro. Kipchoge wins marathon gold for Kenya." },
      { id: "nandihills", label: "Nandi Hills",          type: "entity",   href: "/Counties/Nandi/Nandi-Hills",          desc: "The highland terrain that forged Kenya's running dynasty." },
      { id: "keathletics", label: "Kenya Athletics",    type: "entity",   href: "/Sports/Kenya-Athletics-Overview",     desc: "The governing body and machinery behind Kenya's world dominance." },
      { id: "marathon",  label: "Marathon Majors",       type: "entity",   href: "/Sports/Kenya-Marathon-Majors",        desc: "Boston, Berlin, London, Tokyo, Chicago, New York. Kenya owns them." },
      { id: "deepdive",  label: "Kipchoge Deep Dive",    type: "alliance", href: "/Kalenjin/Eliud-Kipchoge-Deep-Dive",  desc: "Full profile: philosophy, training methods, the Kaptagat group." },
      { id: "olympics",  label: "Kenya at Olympics",     type: "entity",   href: "/Sports/Kenya-Olympics-Overview",     desc: "Kenya's remarkable Olympic record across six decades." },
    ],
    links: [
      { source: "kipchoge", target: "breaking2",   type: "event",    label: "nearly broke 2 hours" },
      { source: "kipchoge", target: "berlin",       type: "event",    label: "world record 2018, 2022" },
      { source: "kipchoge", target: "ineos",        type: "event",    label: "sub-2-hour 2019" },
      { source: "kipchoge", target: "rio2016",      type: "event",    label: "Olympic gold" },
      { source: "kipchoge", target: "nandihills",   type: "entity",   label: "Kalenjin highlands home" },
      { source: "kipchoge", target: "keathletics",  type: "entity",   label: "national federation" },
      { source: "kipchoge", target: "marathon",     type: "entity",   label: "dominates world majors" },
      { source: "kipchoge", target: "deepdive",     type: "alliance", label: "full story" },
      { source: "kipchoge", target: "olympics",     type: "entity",   label: "two Olympic golds" },
    ],
  },
  {
    id: "wangari",
    label: "Wangari Maathai",
    nodes: [
      { id: "wangari",    label: "Wangari Maathai",      type: "center",   href: "/Political-Movements/Wangari-Maathai",                                    desc: "Nobel Peace Prize 2004. Founder of the Green Belt Movement. First African woman laureate." },
      { id: "greenbelt",  label: "Green Belt Movement",  type: "entity",   href: "/Conservation/Green-Belt-Movement",                                       desc: "Planted 30 million trees. Mobilised women across Kenya. Global model." },
      { id: "nobel",      label: "Nobel Peace Prize",    type: "event",    href: "/Kikuyu/Wangari-Maathai-Nobel-Prize-2004",                                 desc: "2004. First African woman to win. Link between environment and peace." },
      { id: "moi",        label: "Daniel arap Moi",      type: "rival",    href: "/Presidencies/Daniel-arap-Moi-Presidency/Moi-and-Wangari-Maathai",        desc: "Persecuted her for decades. She refused to stop." },
      { id: "narc",       label: "NARC Coalition",       type: "alliance", href: "/Elections/2002-Election/2002-Election-NARC-Coalition",                   desc: "The coalition that ended Moi's KANU era. Wangari was part of this political wave." },
      { id: "trail",      label: "Trees and Freedom",    type: "entity",   href: "/Trails/Wangari-Maathai:-Trees-and-Freedom",                              desc: "Full story trail: from Nyeri to Oslo." },
      { id: "conservation", label: "Conservation Record", type: "alliance", href: "/Conservation/Wangari-Maathai",                                          desc: "Her conservation legacy: forest restoration, soil, women's empowerment." },
      { id: "women",      label: "Women Green Belt",     type: "family",   href: "/Women/Wangari-Maathai-Green-Belt",                                        desc: "How the movement mobilised rural women as its core agents." },
    ],
    links: [
      { source: "wangari", target: "greenbelt",    type: "entity",   label: "founder" },
      { source: "wangari", target: "nobel",        type: "event",    label: "won 2004" },
      { source: "wangari", target: "moi",          type: "rival",    label: "persecuted for years" },
      { source: "wangari", target: "narc",         type: "alliance", label: "joined democracy wave" },
      { source: "wangari", target: "trail",        type: "entity",   label: "full story" },
      { source: "wangari", target: "conservation", type: "alliance", label: "conservation legacy" },
      { source: "wangari", target: "women",        type: "family",   label: "women led the movement" },
      { source: "greenbelt", target: "women",      type: "family",   label: "women as agents" },
    ],
  },
  {
    id: "swahili",
    label: "The Swahili Coast",
    nodes: [
      { id: "coast",      label: "Swahili Coast",         type: "center",   href: "/Trails/Swahili:-A-Thousand-Years",             desc: "A thousand years of Indian Ocean civilisation. Cities, trade, Islam, and culture." },
      { id: "mombasa",    label: "Mombasa",               type: "entity",   href: "/Swahili/Mombasa",                              desc: "The anchor city. Port, history, culture, Fort Jesus." },
      { id: "malindi",    label: "Malindi",               type: "entity",   href: "/Swahili/Malindi",                              desc: "Ancient rival city to Mombasa. Portuguese landfall point." },
      { id: "lamu",       label: "Lamu",                  type: "entity",   href: "/Swahili/Lamu",                                 desc: "The oldest living Swahili town. UNESCO World Heritage. Donkeys still rule." },
      { id: "arab",       label: "Arab Settlement",       type: "alliance", href: "/Swahili/Arab-Settlement-on-the-Coast",         desc: "Centuries of Arab migration and trade shaped Swahili culture and Islam." },
      { id: "portuguese", label: "Portuguese Rule",       type: "rival",    href: "/Swahili/Portuguese-Domination",                desc: "1500s Portuguese conquest. Fort Jesus built. Two centuries of uneasy rule." },
      { id: "fortjesus",  label: "Fort Jesus",            type: "event",    href: "/Swahili/Fort-Jesus",                           desc: "Built 1593. Fought over for 200 years. Now a World Heritage museum." },
      { id: "ocean",      label: "Indian Ocean World",    type: "entity",   href: "/Swahili/The-Indian-Ocean-World",               desc: "The ocean as highway: monsoon winds connected East Africa to Arabia, India, China." },
      { id: "language",   label: "Swahili Language",      type: "entity",   href: "/Swahili/Swahili-Language",                     desc: "Africa's great lingua franca. Born on the coast. Spoken by 200 million people." },
      { id: "trade",      label: "Indian Ocean Trade",    type: "event",    href: "/Coast-History/Pre-Colonial-Indian-Ocean-Trade", desc: "Gold, ivory, slaves, cloth. The network that made the coast rich." },
    ],
    links: [
      { source: "coast",    target: "mombasa",    type: "entity",   label: "primary city" },
      { source: "coast",    target: "malindi",    type: "entity",   label: "rival city" },
      { source: "coast",    target: "lamu",       type: "entity",   label: "oldest town" },
      { source: "coast",    target: "arab",       type: "alliance", label: "Arab settlers shaped culture" },
      { source: "coast",    target: "portuguese", type: "rival",    label: "Portuguese conquest 1500s" },
      { source: "mombasa",  target: "fortjesus",  type: "event",    label: "built to defend" },
      { source: "portuguese", target: "fortjesus", type: "rival",   label: "built Fort Jesus" },
      { source: "coast",    target: "ocean",      type: "entity",   label: "ocean as highway" },
      { source: "coast",    target: "language",   type: "entity",   label: "Swahili born here" },
      { source: "coast",    target: "trade",      type: "event",    label: "trade routes" },
      { source: "arab",     target: "language",   type: "alliance", label: "Arabic influence on language" },
    ],
  },
  {
    id: "marathon",
    label: "Marathon Dynasty",
    nodes: [
      { id: "dynasty",   label: "Kenya's Runners",       type: "center",   href: "/Sports/Kenya-Marathon-Majors",        desc: "Kenya's marathon dynasty. More wins than any nation. Built on altitude, culture, will." },
      { id: "kipchoge2", label: "Eliud Kipchoge",        type: "entity",   href: "/Sports/Eliud-Kipchoge",              desc: "Greatest of all time. World record. Sub-two hours." },
      { id: "ndereba",   label: "Catherine Ndereba",     type: "family",   href: "/Sports/Catherine-Ndereba",           desc: "Four-time Boston champion. Two-time world champion. The queen of Boston." },
      { id: "tergat",    label: "Paul Tergat",           type: "family",   href: "/Sports/Paul-Tergat",                 desc: "Former world record holder. Berlin 2003. Cross-country legend." },
      { id: "kipsang",   label: "Wilson Kipsang",        type: "family",   href: "/Sports/Wilson-Kipsang",              desc: "Former world record holder. Berlin 2013. Multiple World Major wins." },
      { id: "kosgei",    label: "Brigid Kosgei",         type: "family",   href: "/Kalenjin/Brigid-Kosgei",             desc: "Women's world record holder. Chicago 2019. 2:14:04." },
      { id: "boston",    label: "Boston Marathon",       type: "event",    href: "/Sports/Boston-Marathon-Kenya",       desc: "Kenya's favourite major. Dominated for four decades." },
      { id: "berlin2",   label: "Berlin Marathon",       type: "event",    href: "/Sports/Berlin-Marathon-Kenya",       desc: "World record course. Flat and fast. Kenyan record machine." },
      { id: "nandi2",    label: "Nandi Hills",           type: "entity",   href: "/Counties/Nandi/Nandi-Hills",         desc: "The highland cradle. Altitude, forest paths, Kalenjin culture." },
      { id: "athletics", label: "Kenya Athletics",       type: "entity",   href: "/Sports/Kenya-Athletics-Overview",   desc: "The federation, the talent pool, the system behind the wins." },
    ],
    links: [
      { source: "dynasty",  target: "kipchoge2", type: "entity",   label: "GOAT" },
      { source: "dynasty",  target: "ndereba",   type: "family",   label: "women's legend" },
      { source: "dynasty",  target: "tergat",    type: "family",   label: "former world record" },
      { source: "dynasty",  target: "kipsang",   type: "family",   label: "former world record" },
      { source: "dynasty",  target: "kosgei",    type: "family",   label: "women's world record" },
      { source: "dynasty",  target: "boston",    type: "event",    label: "Boston dominance" },
      { source: "dynasty",  target: "berlin2",   type: "event",    label: "Berlin world records" },
      { source: "dynasty",  target: "nandi2",    type: "entity",   label: "birthplace of champions" },
      { source: "dynasty",  target: "athletics", type: "entity",   label: "federation backing" },
      { source: "kipchoge2", target: "berlin2",  type: "event",    label: "world record holder" },
      { source: "ndereba",  target: "boston",    type: "event",    label: "four wins" },
    ],
  },
  {
    id: "sauti",
    label: "Sauti Sol",
    nodes: [
      { id: "sautisol",  label: "Sauti Sol",              type: "center",   href: "/Trails/Sauti-Sol:-How-Four-Boys-from-Nairobi-Went-Global",  desc: "Four boys from Nairobi who became East Africa's biggest band." },
      { id: "bien",      label: "Bien-Aime Baraza",       type: "family",   href: "/Music/Bien-Aime-Baraza",                                    desc: "Lead vocalist. Songwriter. The voice of a generation." },
      { id: "benga",     label: "Benga Sound of Kenya",   type: "entity",   href: "/Trails/Benga:-The-Sound-of-Kenya",                          desc: "The electric guitar tradition Sauti Sol grew from. Luo and Luhya roots." },
      { id: "luobenga",  label: "Luo Benga Music",        type: "entity",   href: "/Trails/Luo-Benga-Music",                                    desc: "The Luo roots of Kenya's popular music. Guitar as storyteller." },
      { id: "electric",  label: "Benga Revolution",       type: "event",    href: "/Trails/Benga:-Kenya's-Electric-Revolution",                 desc: "How electric guitar transformed Kenyan popular music from the 1960s." },
      { id: "clubs",     label: "Nairobi Music Scene",    type: "entity",   href: "/Music/Music-Clubs-and-Venues-Nairobi-1960s-1970s",          desc: "The clubs, venues, and circuits that shaped Nairobi's sound." },
      { id: "protest",   label: "Music and Politics",     type: "alliance", href: "/Music/Benga-and-Political-Protest",                         desc: "How Kenyan music has always carried political weight." },
      { id: "guitar",    label: "The Guitar in Kenya",    type: "entity",   href: "/Music/The-Guitar-in-Kenyan-Popular-Music",                  desc: "The instrument that defines modern Kenyan popular sound." },
    ],
    links: [
      { source: "sautisol", target: "bien",     type: "family",   label: "lead vocalist" },
      { source: "sautisol", target: "benga",    type: "entity",   label: "rooted in benga tradition" },
      { source: "sautisol", target: "luobenga", type: "entity",   label: "Luo musical roots" },
      { source: "sautisol", target: "electric", type: "event",    label: "electric era inheritors" },
      { source: "sautisol", target: "clubs",    type: "entity",   label: "Nairobi scene" },
      { source: "sautisol", target: "protest",  type: "alliance", label: "music with meaning" },
      { source: "sautisol", target: "guitar",   type: "entity",   label: "guitar-led sound" },
      { source: "benga",    target: "electric", type: "event",    label: "benga went electric" },
      { source: "benga",    target: "luobenga", type: "entity",   label: "Luo origins" },
    ],
  },
  {
    id: "rift",
    label: "Great Rift Valley",
    nodes: [
      { id: "rift",       label: "Great Rift Valley",    type: "center",   href: "/Counties/Nakuru/Rift-Valley-Province-History",      desc: "6,000km crack in the earth. Ancient, dramatic, alive. Kenya's geological spine." },
      { id: "turkana2",   label: "Lake Turkana",         type: "entity",   href: "/Trails/Lake-Turkana:-The-Jade-Sea",                 desc: "The Jade Sea. Largest desert lake in the world. Cradle of humanity." },
      { id: "nakuru2",    label: "Lake Nakuru",          type: "entity",   href: "/Trails/Lake-Nakuru:-The-Flamingo-Mystery",          desc: "The flamingo lake. A million birds at peak. Now under threat." },
      { id: "flamingos",  label: "Flamingo Ecology",     type: "entity",   href: "/Conservation/Flamingo-Ecology-Rift-Valley",        desc: "Why Rift Valley lakes host the world's largest flamingo concentrations." },
      { id: "mara",       label: "Maasai Mara",          type: "entity",   href: "/Trails/The-Maasai-Mara:-Paradise-and-Its-Price",   desc: "The great migration. Lions. Open savannah. Kenya's most famous landscape." },
      { id: "maraeco",    label: "Mara Ecosystem",       type: "alliance", href: "/Trails/The-Maasai-Mara-Ecosystem",                 desc: "How the whole ecosystem works: wildlife, water, pastoralists, tourism." },
      { id: "land",       label: "Land in the Valley",   type: "rival",    href: "/Europeans/Land-in-the-Rift-Valley",                desc: "Colonial land seizure. White Highlands. A dispossession that still echoes." },
      { id: "turkanapeople", label: "Turkana People",    type: "family",   href: "/Turkana/Turkana-People-Overview",                  desc: "Pastoralists who have lived around the Jade Sea for centuries." },
      { id: "pastoralists", label: "Pastoralists",       type: "family",   href: "/Conservation/Pastoralists-and-Conservation",      desc: "The people and cattle that have shaped the Rift Valley for millennia." },
    ],
    links: [
      { source: "rift",    target: "turkana2",     type: "entity",   label: "northernmost lake" },
      { source: "rift",    target: "nakuru2",      type: "entity",   label: "flamingo lake" },
      { source: "nakuru2", target: "flamingos",    type: "entity",   label: "flamingo ecology" },
      { source: "rift",    target: "mara",         type: "entity",   label: "southern savannah" },
      { source: "mara",    target: "maraeco",      type: "alliance", label: "ecosystem dynamics" },
      { source: "rift",    target: "land",         type: "rival",    label: "colonial land seizure" },
      { source: "rift",    target: "turkanapeople", type: "family",  label: "indigenous peoples" },
      { source: "rift",    target: "pastoralists", type: "family",   label: "pastoral communities" },
      { source: "turkana2", target: "turkanapeople", type: "family", label: "home of the Turkana" },
    ],
  },
  {
    id: "turkanaboy",
    label: "Turkana Boy",
    nodes: [
      { id: "boy",       label: "Turkana Boy",           type: "center",   href: "/Turkana/Turkana-Boy",                                  desc: "1.6 million years old. The most complete early human skeleton ever found. Found on the shores of Lake Turkana." },
      { id: "richard",   label: "Richard Leakey",        type: "alliance", href: "/Conservation/Richard-Leakey",                         desc: "Palaeontologist turned conservationist. Found Turkana Boy. Built KWS." },
      { id: "richturk",  label: "Leakey in Turkana",     type: "entity",   href: "/Turkana/Richard-Leakey-in-Turkana",                   desc: "Richard Leakey's decades of fieldwork in Turkana." },
      { id: "koobi",     label: "Koobi Fora",            type: "entity",   href: "/Counties/Turkana-County/Koobi-Fora",                   desc: "The fossil site on the eastern shore of Lake Turkana. Extraordinary finds." },
      { id: "museum",    label: "National Museum Kenya", type: "entity",   href: "/Photography/National-Museum",                         desc: "Nairobi. Home to Turkana Boy and Kenya's fossil record." },
      { id: "africa",    label: "Out of Africa",         type: "event",    href: "/Europeans/Out-of-Africa-and-Its-Legacy",               desc: "The theory that all modern humans originated in Africa. Kenya is central." },
      { id: "homa",      label: "Homa Bay Fossil Sites", type: "entity",   href: "/Counties/Homa-Bay/Homa-Bay-Fossil-Sites",             desc: "Another major fossil site in Kenya. Ancient human presence." },
      { id: "trail",     label: "Leakey Trail",          type: "alliance", href: "/Trails/Richard-Leakey:-The-Man-Who-Built-Conservation", desc: "Full story: from fossils to wildlife conservation." },
    ],
    links: [
      { source: "boy",    target: "richard",  type: "alliance", label: "discovered by Leakey team" },
      { source: "boy",    target: "koobi",    type: "entity",   label: "found at Koobi Fora" },
      { source: "boy",    target: "museum",   type: "entity",   label: "displayed in Nairobi" },
      { source: "boy",    target: "africa",   type: "event",    label: "evidence for Out of Africa" },
      { source: "richard", target: "richturk", type: "entity",  label: "field work in Turkana" },
      { source: "richard", target: "trail",   type: "alliance", label: "full story" },
      { source: "koobi",  target: "homa",    type: "entity",   label: "part of Kenya fossil belt" },
    ],
  },
  {
    id: "mombasa",
    label: "Mombasa",
    nodes: [
      { id: "mombasa2",  label: "Mombasa",              type: "center",   href: "/Swahili/Mombasa",                            desc: "Kenya's second city. Ancient port. Cultural crossroads. 2,000 years of history." },
      { id: "fort",      label: "Fort Jesus",           type: "event",    href: "/Swahili/Fort-Jesus",                         desc: "The fortress that defined centuries of Mombasa's history. Portuguese built. UNESCO listed." },
      { id: "oldtown",   label: "Old Town Mombasa",     type: "entity",   href: "/Swahili/Old-Town-Mombasa",                   desc: "Narrow streets, carved doors, coral stone buildings. Living history." },
      { id: "arabid",    label: "Swahili-Arab Identity", type: "alliance", href: "/Swahili/Swahili-and-Arab-Identity",          desc: "How Arab settlement shaped Swahili identity and culture." },
      { id: "malindi2",  label: "Malindi",              type: "entity",   href: "/Swahili/Malindi",                            desc: "Mombasa's ancient rival and ally. Portuguese first landfall in Kenya." },
      { id: "railway",   label: "The Lunatic Express",  type: "event",    href: "/Asians/The-Lunatic-Express",                 desc: "The Uganda Railway. Built from Mombasa 1896. Transformed East Africa." },
      { id: "food",      label: "Coastal Cuisine",      type: "entity",   href: "/Coast-History/Coastal-Food-Culture",         desc: "Biryani, pilau, samaki. Where Indian Ocean trade becomes food culture." },
      { id: "asians",    label: "Indian Community",     type: "family",   href: "/Asians/Asians-in-Kenya",                     desc: "Brought to build the railway. Stayed to shape commerce and culture." },
      { id: "islam",     label: "Islam on the Coast",   type: "alliance", href: "/Swahili/Islam-on-the-Swahili-Coast",         desc: "A thousand years of Islam shaping law, architecture, and daily life." },
      { id: "lamu2",     label: "Lamu",                 type: "entity",   href: "/Swahili/Lamu",                               desc: "The perfectly preserved Swahili town north of Mombasa." },
    ],
    links: [
      { source: "mombasa2", target: "fort",     type: "event",    label: "city's defining monument" },
      { source: "mombasa2", target: "oldtown",  type: "entity",   label: "historic core" },
      { source: "mombasa2", target: "arabid",   type: "alliance", label: "Arab-Swahili fusion" },
      { source: "mombasa2", target: "malindi2", type: "entity",   label: "rival city" },
      { source: "mombasa2", target: "railway",  type: "event",    label: "railway terminus" },
      { source: "mombasa2", target: "food",     type: "entity",   label: "Indian Ocean cuisine" },
      { source: "mombasa2", target: "asians",   type: "family",   label: "Indian community" },
      { source: "mombasa2", target: "islam",    type: "alliance", label: "Islamic city" },
      { source: "mombasa2", target: "lamu2",    type: "entity",   label: "Swahili sister city" },
      { source: "railway",  target: "asians",  type: "family",   label: "Indians built the railway" },
    ],
  },
  {
    id: "independence",
    label: "Independence 1963",
    nodes: [
      { id: "indep",     label: "Kenya Independence",   type: "center",   href: "/Europeans/Pipeline-of-Independence",                                     desc: "12 December 1963. The end of British rule. The beginning of everything else." },
      { id: "kenyatta2", label: "Jomo Kenyatta",        type: "family",   href: "/Presidencies/Jomo-Kenyatta-Presidency/Kenyatta-Rise-to-Power",           desc: "From detainee to founding president. Complex, contested, consequential." },
      { id: "oginga",    label: "Oginga Odinga",        type: "rival",    href: "/Political-Movements/Oginga-Odinga",                                      desc: "Kenyatta's comrade, then opponent. 'Not Yet Uhuru' was his verdict." },
      { id: "mboya",     label: "Tom Mboya",            type: "alliance", href: "/Political-Movements/Tom-Mboya",                                          desc: "The labour organiser who could have been president. Assassinated 1969." },
      { id: "lancaster", label: "Lancaster House",      type: "event",    href: "/Political-Movements/The-Lancaster-House-Conferences",                   desc: "The London negotiations that shaped Kenya's constitution and independence terms." },
      { id: "maumau",    label: "Mau Mau",              type: "event",    href: "/Trails/Mau-Mau:-The-Forest-War",                                         desc: "The armed uprising that proved British rule was untenable." },
      { id: "departure", label: "British Departure",   type: "event",    href: "/Europeans/Lancaster-House-and-Departure",                                desc: "How and why the British left. Negotiations, concessions, transfers." },
      { id: "legacy",    label: "Independence Dream",   type: "entity",   href: "/Legacy/The-Independence-Dream-and-its-Limits",                          desc: "What Uhuru promised and what it delivered. The gap between vision and reality." },
      { id: "mboyaass",  label: "Mboya Assassination",  type: "event",    href: "/Presidencies/Jomo-Kenyatta-Presidency/Tom-Mboya-Assassination-1969",    desc: "July 1969. Tom Mboya shot in Nairobi. A nation's direction changed." },
      { id: "notyetuhuru", label: "Not Yet Uhuru",      type: "entity",   href: "/Trails/Oginga-Odinga:-Not-Yet-Uhuru",                                   desc: "Oginga Odinga's memoir. A dissenting view of independence from the inside." },
    ],
    links: [
      { source: "indep",   target: "kenyatta2",    type: "family",   label: "founding president" },
      { source: "indep",   target: "oginga",       type: "rival",    label: "VP then opposition" },
      { source: "indep",   target: "mboya",        type: "alliance", label: "key architect" },
      { source: "indep",   target: "lancaster",    type: "event",    label: "negotiated at Lancaster" },
      { source: "indep",   target: "maumau",       type: "event",    label: "Mau Mau forced the issue" },
      { source: "indep",   target: "departure",    type: "event",    label: "British handed over" },
      { source: "indep",   target: "legacy",       type: "entity",   label: "legacy contested" },
      { source: "kenyatta2", target: "oginga",     type: "rival",    label: "allies turned rivals" },
      { source: "mboya",  target: "mboyaass",      type: "event",    label: "assassinated 1969" },
      { source: "oginga", target: "notyetuhuru",   type: "entity",   label: "wrote Not Yet Uhuru" },
    ],
  },
  {
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
      { source: "raila",  target: "oginga2",   type: "family",   label: "father / son" },
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
]

let currentGraphId = "kipchoge"
let currentSimulation: any = null

function buildKnowledgeGraphs() {
  const container = document.getElementById("ok-knowledge-graphs")
  if (!container) return
  if (container.dataset.rendered === "1") return
  container.dataset.rendered = "1"

  container.style.cssText = "width:100%;position:relative"

  // --- Pills row ---
  const pillsWrap = document.createElement("div")
  pillsWrap.style.cssText = [
    "display:flex",
    "flex-direction:row",
    "overflow-x:auto",
    "gap:8px",
    "padding:0 0 10px 0",
    "scrollbar-width:none",
    "-webkit-overflow-scrolling:touch",
    "flex-wrap:nowrap",
  ].join(";")
  // Hide scrollbar
  const scrollStyle = document.createElement("style")
  scrollStyle.textContent = "#ok-knowledge-graphs .ok-pills-row::-webkit-scrollbar{display:none}"
  document.head.appendChild(scrollStyle)
  pillsWrap.className = "ok-pills-row"
  container.appendChild(pillsWrap)

  function renderPills() {
    pillsWrap.innerHTML = ""
    GRAPHS.forEach((g) => {
      const btn = document.createElement("button")
      const isActive = g.id === currentGraphId
      btn.textContent = g.label
      btn.style.cssText = [
        "white-space:nowrap",
        "padding:6px 14px",
        "border-radius:20px",
        "font-size:13px",
        "font-family:Inter,system-ui,sans-serif",
        "cursor:pointer",
        "border:1.5px solid " + (isActive ? "#1a4a2e" : "#c8c2b8"),
        "background:" + (isActive ? "#1a4a2e" : "transparent"),
        "color:" + (isActive ? "#fff" : "#333"),
        "transition:background 0.2s,color 0.2s,border-color 0.2s",
        "outline:none",
        "flex-shrink:0",
      ].join(";")
      btn.addEventListener("click", () => {
        if (g.id === currentGraphId) return
        currentGraphId = g.id
        renderPills()
        switchGraph()
      })
      pillsWrap.appendChild(btn)
    })
  }

  renderPills()

  // --- Purpose text ---
  const hint = document.createElement("p")
  hint.textContent = "Each graph maps a corner of Kenya's story. Click any node to explore."
  hint.style.cssText = [
    "font-size:12px",
    "color:#666",
    "margin:4px 0 8px 0",
    "font-family:Inter,system-ui,sans-serif",
    "font-style:italic",
  ].join(";")
  container.appendChild(hint)

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
  loading.style.cssText = [
    "position:absolute",
    "top:50%",
    "left:50%",
    "transform:translate(-50%,-50%)",
    "font-size:13px",
    "color:#888",
    "font-family:Inter,system-ui,sans-serif",
    "pointer-events:none",
  ].join(";")
  graphWrap.appendChild(loading)

  // Tooltip
  const tip = document.createElement("div")
  tip.style.cssText = [
    "position:absolute",
    "pointer-events:none",
    "background:rgba(20,20,20,0.88)",
    "color:#fff",
    "padding:6px 10px",
    "border-radius:5px",
    "font-size:11px",
    "line-height:1.4",
    "max-width:180px",
    "display:none",
    "z-index:100",
  ].join(";")
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

  // Zoom — only on Ctrl+wheel or trackpad pinch; normal scroll passes through to page
  const zoomBehavior = zoom<SVGSVGElement, unknown>()
    .scaleExtent([0.3, 3])
    .filter((event) => {
      if (event.type === "wheel") return event.ctrlKey || event.metaKey
      return !event.button
    })
    .on("zoom", (event) => gRoot.attr("transform", event.transform))
  svg.call(zoomBehavior as any)
  // Prevent D3 from swallowing wheel events that aren't zoom-intended
  svgEl.addEventListener("wheel", (e) => { if (!e.ctrlKey && !e.metaKey) e.stopPropagation() }, { passive: true })

  // Defs for markers - create once
  const defs = svg.append("defs")
  Object.entries(COLORS).forEach(([type, color]) => {
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
      .attr("fill", color)
      .attr("opacity", 0.6)
  })

  // Legend
  const legendItems = [
    { type: "center",   label: "Center"   },
    { type: "family",   label: "Family"   },
    { type: "alliance", label: "Alliance" },
    { type: "rival",    label: "Rival"    },
    { type: "event",    label: "Event"    },
    { type: "entity",   label: "Entity"   },
  ]
  const legendG = svg.append("g").attr("transform", `translate(8,${H - 8})`)
  legendItems.forEach((item, i) => {
    const row = legendG.append("g").attr("transform", `translate(${i * (isMobile ? 48 : 66)},0)`)
    row.append("circle").attr("r", 5).attr("cx", 5).attr("cy", -5).attr("fill", COLORS[item.type])
    row.append("text")
      .attr("x", 13).attr("y", -1)
      .style("font-size", isMobile ? "7px" : "9px")
      .style("font-family", "Inter,system-ui,sans-serif")
      .style("fill", "var(--dark,#1a1a1a)")
      .text(item.label)
  })

  function renderGraph(graphId: string, animate: boolean) {
    const dataset = GRAPHS.find((g) => g.id === graphId)
    if (!dataset) return

    // Remove loading after first render
    if (loading.parentNode) loading.remove()

    if (currentSimulation) {
      currentSimulation.stop()
      currentSimulation = null
    }

    const nodes = dataset.nodes.map((n) => ({ ...n })) as any[]
    const links = dataset.links.map((l) => ({ ...l })) as any[]

    if (animate) {
      // Fade out existing content
      gRoot.transition().duration(200).style("opacity", 0).on("end", () => {
        gRoot.selectAll("*").remove()
        drawGraph(nodes, links)
        gRoot.style("opacity", 0)
          .transition().duration(300).style("opacity", 1)
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
      .attr("stroke", (d: any) => COLORS[d.type] || "#888")
      .attr("stroke-width", 1.5)
      .attr("stroke-opacity", 0.5)
      .attr("marker-end", (d: any) => `url(#kg-arrow-${d.type})`)

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
      .attr("fill", (d: any) => COLORS[d.type] || "#888")
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
    renderGraph(currentGraphId, true)
  }

  // Initial render (no animation)
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
