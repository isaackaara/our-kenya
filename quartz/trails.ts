export interface TrailStop {
  slug: string  // relative to content/, no .md
  title: string  // display title for prev/next buttons
}

export interface Trail {
  id: string
  name: string
  category: string
  description: string  // 1-2 sentences shown on STORY-TRAILS page
  stops: TrailStop[]
}

export const trails: Trail[] = [
  {
    id: "reluctant-father",
    name: "The Reluctant Father",
    category: "Presidencies",
    description: "Jomo Kenyatta's journey from mission school student to founding father of independent Kenya.",
    stops: [
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Rise to Power", title: "Rise to Power" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Detention Legacy", title: "The Detention Years" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Jomo Kenyatta Presidency", title: "Independence Day" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Cabinet", title: "Building the First Cabinet" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Opposition Suppression", title: "Crushing Dissent" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Final Years", title: "The Final Years" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Legacy", title: "The Legacy" }
    ]
  },
  {
    id: "schoolmaster-dictator",
    name: "The Schoolmaster Dictator",
    category: "Presidencies",
    description: "Daniel arap Moi's transformation from quiet vice president to Kenya's longest-serving ruler.",
    stops: [
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi Rise to Power", title: "The Quiet Vice President" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Daniel arap Moi Presidency", title: "Inheriting Power" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi Nyayo Philosophy", title: "Nyayo: Following the Footsteps" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi and 1982 Coup Attempt", title: "The Coup That Failed" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Nyayo House Torture Chambers", title: "Nyayo House" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi and Multiparty Democracy", title: "Forced to Share Power" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi Legacy", title: "24 Years Later" }
    ]
  },
  {
    id: "mau-mau-forest-war",
    name: "Mau Mau: The Forest War",
    category: "Resistance",
    description: "The oath, the forest fighters, Dedan Kimathi, and the State of Emergency that shaped modern Kenya.",
    stops: [
      { slug: "Kikuyu/Kikuyu Resistance Pre-Mau Mau", title: "Seeds of Resistance" },
      { slug: "Kikuyu/Harry Thuku", title: "Harry Thuku's Arrest" },
      { slug: "Kikuyu/Kenya Land and Freedom Army", title: "The Oath" },
      { slug: "Kikuyu/Mau Mau Uprising", title: "Into the Forest" },
      { slug: "Kikuyu/Dedan Kimathi", title: "Field Marshal Kimathi" },
      { slug: "Kikuyu/State of Emergency 1952", title: "Emergency Declared" },
      { slug: "Kikuyu/The Villagisation Program", title: "The Camps" },
      { slug: "Kikuyu/Kenyatta Detention Legacy", title: "Kenyatta's Detention" }
    ]
  },
  {
    id: "tom-mboya",
    name: "Tom Mboya: The Man Who Should Have Been President",
    category: "Politics",
    description: "Labor organizer, Pan-Africanist, architect of independence, and the assassination that changed Kenya's trajectory.",
    stops: [
      { slug: "Luo/Tom Mboya", title: "The Young Organizer" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Tom Mboya", title: "Kenyatta's Right Hand" },
      { slug: "Luo/Luo Political History", title: "Luo in National Politics" },
      { slug: "Luo/Tom Mboya Assassination", title: "Gunned Down on Moi Avenue" },
      { slug: "Luo/Kisumu Massacre 1969", title: "Kisumu Burns" },
      { slug: "Luo/Luo-Kikuyu Political Relationship", title: "The Rift Opens" },
      { slug: "Luo/Luo and the Kenyan State", title: "Locked Out of Power" }
    ]
  },
  {
    id: "kenya-burned",
    name: "When Kenya Burned: 2007-08",
    category: "Elections",
    description: "A disputed election, post-election violence, the ICC, and the handshake that redefined Kenyan politics.",
    stops: [
      { slug: "Elections/2007 Election/2007 Election", title: "The Election" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Kibaki Swearing-In", title: "Sworn In at Night" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV 41 Days Timeline", title: "41 Days of Chaos" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Eldoret Church Massacre", title: "Kiambaa Church" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Kofi Annan Mediation", title: "Kofi Annan Arrives" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Ocampo Six", title: "The Ocampo Six" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV ICC Collapse", title: "The ICC Cases Collapse" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV The Handshake 2018", title: "The 2018 Handshake" }
    ]
  },
  {
    id: "running-phenomenon",
    name: "The Running Phenomenon",
    category: "Sports",
    description: "Why Kalenjin runners dominate distance running, the science of Iten, and Kipchoge's moonshot.",
    stops: [
      { slug: "Kalenjin/Kalenjin Origins", title: "Who Are the Kalenjin?" },
      { slug: "Kalenjin/Kalenjin Identity and Running", title: "Running as Identity" },
      { slug: "Sports/The Kalenjin Runners", title: "Why They Run" },
      { slug: "Kalenjin/Iten Training Camp", title: "Iten: The Home of Champions" },
      { slug: "Sports/Eliud Kipchoge", title: "Eliud Kipchoge" },
      { slug: "Sports/INEOS 159 Challenge", title: "Breaking Two" },
      { slug: "Kalenjin/Kalenjin Doping Crisis", title: "The Doping Shadow" }
    ]
  },
  {
    id: "goldenberg",
    name: "Goldenberg: The Heist",
    category: "Corruption",
    description: "The corruption scandal that nearly bankrupted Kenya and the man who walked away rich.",
    stops: [
      { slug: "Corruption/Goldenberg Scandal", title: "The Gold Export Scam" },
      { slug: "Corruption/Kamlesh Pattni and Goldenberg", title: "Kamlesh Pattni" },
      { slug: "Corruption/Moi Era Corruption Economy", title: "The Moi System" },
      { slug: "Corruption/John Githongo", title: "John Githongo Investigates" },
      { slug: "Corruption/Impunity Culture", title: "Nobody Goes to Jail" },
      { slug: "Corruption/Corruption and Elections", title: "Buying Power" }
    ]
  },
  {
    id: "land-question",
    name: "The Land Question",
    category: "Politics",
    description: "From colonial theft to today's land clashes, the question that refuses to die.",
    stops: [
      { slug: "Kikuyu/White Highlands", title: "The White Highlands" },
      { slug: "Kikuyu/Kenya Land and Freedom Army", title: "Land and Freedom" },
      { slug: "Kikuyu/Land Tenure Post Independence", title: "Independence Land Deals" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Land Policy", title: "Kenyatta Buys the Highlands" },
      { slug: "Kikuyu/Kikuyu Land Clashes Post-Independence", title: "Rift Valley Clashes" },
      { slug: "Corruption/Land Grabbing Under Jomo Kenyatta", title: "The Grabbing Begins" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Land Unresolved", title: "Still Unresolved" }
    ]
  },
  {
    id: "swahili-civilization",
    name: "Swahili: A Thousand Years",
    category: "Culture",
    description: "The Swahili coast, Indian Ocean trade, city-states, and Islam's arrival in East Africa.",
    stops: [
      { slug: "Swahili/Swahili Civilization Overview", title: "The Swahili World" },
      { slug: "Swahili/The Indian Ocean World", title: "The Indian Ocean Trade" },
      { slug: "Swahili/Kilwa Kisiwani", title: "Kilwa: The Golden City" },
      { slug: "Swahili/Islam on the Swahili Coast", title: "Islam Arrives" },
      { slug: "Swahili/Vasco da Gama and the Coast", title: "Vasco da Gama" },
      { slug: "Swahili/The Omani Conquest", title: "The Omani Conquest" },
      { slug: "Swahili/Swahili Identity", title: "Who Is Swahili?" }
    ]
  },
  {
    id: "wangari-maathai",
    name: "Wangari Maathai: Trees and Freedom",
    category: "Environment",
    description: "The Green Belt Movement, the Nobel Prize, and resistance to authoritarianism.",
    stops: [
      { slug: "Kikuyu/Wangari Maathai", title: "Wangari Maathai" },
      { slug: "Conservation/Green Belt Movement", title: "The Green Belt Movement" },
      { slug: "Kikuyu/Mugumo Tree", title: "The Sacred Mugumo" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi and the Opposition", title: "Standing Up to Moi" },
      { slug: "Conservation/Wangari Maathai", title: "The Nobel Prize" },
      { slug: "Conservation/Conservation vs Land Rights", title: "Trees and Land Rights" }
    ]
  },
  {
    id: "raila-five-campaigns",
    name: "Raila Odinga: Five Campaigns",
    category: "Politics",
    description: "Raila's five presidential runs and what they reveal about Kenyan democracy.",
    stops: [
      { slug: "Luo/Raila Odinga Biography", title: "The Raila Story" },
      { slug: "Elections/1997 Election/1997 Election", title: "1997: The First Run" },
      { slug: "Elections/2007 Election/2007 Election", title: "2007: Stolen Victory" },
      { slug: "Elections/2013 Election/2013 Election", title: "2013: ICC Shadow" },
      { slug: "Elections/2017 Election/2017 Election", title: "2017: Nullified" },
      { slug: "Elections/2022 Election/2022 Election", title: "2022: The Fifth Time" },
      { slug: "Luo/Luo Politics Post-Raila", title: "Luo Politics After Raila" }
    ]
  },
  {
    id: "ivory-wars",
    name: "The Ivory Wars",
    category: "Conservation",
    description: "Poaching crisis, the war on elephants, and the ivory burn that shocked the world.",
    stops: [
      { slug: "Conservation/The Ivory Poaching Crisis", title: "The Poaching Epidemic" },
      { slug: "Conservation/Poaching Crisis 1970s-1980s", title: "The 1970s-80s Crisis" },
      { slug: "Conservation/Richard Leakey KWS", title: "Richard Leakey Takes Charge" },
      { slug: "Conservation/Ivory Ban 1989", title: "The 1989 Ban" },
      { slug: "Conservation/The 1989 Ivory Burning", title: "The Ivory Burn" },
      { slug: "Conservation/21st Century Poaching", title: "Poaching Returns" },
      { slug: "Conservation/Anti-Poaching Technology", title: "Fighting Back with Technology" }
    ]
  },
  {
    id: "dadaab",
    name: "Dadaab: The World's Largest Camp",
    category: "Migration",
    description: "Somali refugees, the world's largest refugee complex, and the politics of hospitality.",
    stops: [
      { slug: "Somali/Dadaab Refugee Complex", title: "Dadaab Opens" },
      { slug: "Somali/Somali Refugee Experience", title: "Life in the Camp" },
      { slug: "Somali/Dadaab Refugee Economy", title: "The Refugee Economy" },
      { slug: "Somali/Second Generation Refugees", title: "Born in Dadaab" },
      { slug: "Somali/Dadaab Closure Threats", title: "Closure Threats" },
      { slug: "Somali/Garissa University Attack 2015", title: "Garissa University Attack" }
    ]
  },
  {
    id: "hustler-gambit",
    name: "The Hustler's Gambit: William Ruto",
    category: "Presidencies",
    description: "From Eldoret chicken seller to Kenya's president, the hustler narrative and what it means.",
    stops: [
      { slug: "Presidencies/William Ruto Presidency/Ruto Rise to Power", title: "The Rise" },
      { slug: "Presidencies/William Ruto Presidency/Ruto Hustler Nation Ideology", title: "Hustler Nation" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV William Ruto Role", title: "2007-08 PEV Role" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV ICC Ruto Case", title: "The ICC Case" },
      { slug: "Presidencies/William Ruto Presidency/Ruto and 2022 Election", title: "The 2022 Victory" },
      { slug: "Presidencies/William Ruto Presidency/Ruto and Gen Z Protests 2024", title: "Gen Z Protests" },
      { slug: "Presidencies/William Ruto Presidency/William Ruto Presidency", title: "Ruto's Presidency" }
    ]
  },
  {
    id: "tsavo-lions",
    name: "Tsavo: Lions and Railway",
    category: "History",
    description: "The Man-Eaters of Tsavo, the Uganda Railway, and the birth of Kenya's conservation movement.",
    stops: [
      { slug: "Counties/Taita-Taveta/Uganda Railway Taita-Taveta", title: "Building the Railway" },
      { slug: "Counties/Taita-Taveta/Tsavo Man-Eaters", title: "The Man-Eaters" },
      { slug: "Taita/Taita and the Railway", title: "Taita and the Railway" },
      { slug: "Counties/Taita-Taveta/Tsavo East National Park", title: "Tsavo East" },
      { slug: "Counties/Taita-Taveta/Tsavo West National Park", title: "Tsavo West" },
      { slug: "Conservation/Tsavo East and West", title: "Kenya's Largest Park" },
      { slug: "Taita/Taita and Wildlife", title: "Living with Wildlife" }
    ]
  },
  {
    id: "handshake",
    name: "The Handshake",
    category: "Politics",
    description: "Uhuru and Raila's 2018 deal, what it meant, and how it reshaped Kenyan politics.",
    stops: [
      { slug: "Elections/2017 Election/2017 Election", title: "The 2017 Election" },
      { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru 2017 Election", title: "Uhuru's Second Term" },
      { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV The Handshake 2018", title: "The Handshake" },
      { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Handshake", title: "Why the Handshake?" },
      { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru BBI", title: "Building Bridges Initiative" },
      { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru and Ruto Fallout", title: "Uhuru-Ruto Fallout" }
    ]
  },
  {
    id: "benga-sound",
    name: "Benga: The Sound of Kenya",
    category: "Culture",
    description: "Luo benga music, D.O. Misiani, and the soundtrack of independent Kenya.",
    stops: [
      { slug: "Luo/Benga Music Origins", title: "Benga Is Born" },
      { slug: "Luo/D.O. Misiani", title: "D.O. Misiani" },
      { slug: "Luo/Luo Music Industry", title: "The Luo Music Industry" },
      { slug: "Luo/Ohangla Music", title: "Ohangla Music" },
      { slug: "Luo/Luo Music and Culture", title: "Music as Politics" },
      { slug: "Kikuyu/Kikuyu Benga and Pop", title: "Kikuyu Benga" }
    ]
  },
  {
    id: "coastal-land",
    name: "The Coastal Land Problem",
    category: "Politics",
    description: "Arab land grants, Crown land, squatters, and the land question at the coast.",
    stops: [
      { slug: "Swahili/Arab Settlement on the Coast", title: "Arab Settlement" },
      { slug: "Swahili/The Omani Conquest", title: "Omani Rule" },
      { slug: "Swahili/Swahili in the Colonial Economy", title: "Crown Land" },
      { slug: "Swahili/Coast Development Gap", title: "The Development Gap" },
      { slug: "Swahili/Mombasa Republican Council", title: "Mombasa Republican Council" },
      { slug: "Mijikenda/Kilifi County Development", title: "Kilifi Land Issues" }
    ]
  },
  {
    id: "anglo-leasing",
    name: "Anglo Leasing: Phantom Contracts",
    category: "Corruption",
    description: "The procurement scandal that defined the Kibaki era and exposed the scale of state capture.",
    stops: [
      { slug: "Corruption/Anglo Leasing Scandal", title: "The Phantom Contracts" },
      { slug: "Corruption/Kibaki Era Corruption", title: "Kibaki's Corruption Record" },
      { slug: "Corruption/John Githongo", title: "John Githongo Blows the Whistle" },
      { slug: "Corruption/Procurement Corruption", title: "How Procurement Works" },
      { slug: "Corruption/Impunity Culture", title: "Nobody Goes to Jail" },
      { slug: "Corruption/Corruption Reform Prospects", title: "Can Kenya Beat Corruption?" }
    ]
  },
  {
    id: "lake-turkana",
    name: "Lake Turkana: The Jade Sea",
    category: "History",
    description: "Fossils, Turkana Boy, wind power, and the Omo River threat to Africa's largest desert lake.",
    stops: [
      { slug: "Turkana/Lake Turkana", title: "The Jade Sea" },
      { slug: "Turkana/The Cradle of Humankind", title: "The Cradle of Humankind" },
      { slug: "Turkana/Turkana Boy", title: "Turkana Boy" },
      { slug: "Turkana/Richard Leakey in Turkana", title: "Richard Leakey's Discoveries" },
      { slug: "Turkana/LTWP Wind Farm", title: "Lake Turkana Wind Power" },
      { slug: "Turkana/The Omo River and Lake Turkana", title: "The Omo River Threat" },
      { slug: "Turkana/Turkana Fishing", title: "Fishing on the Jade Sea" }
    ]
  }
]

// Index: slug -> list of trails containing it (and position)
export const slugToTrails: Record<string, { trail: Trail; position: number }[]> = {}
trails.forEach(trail => {
  trail.stops.forEach((stop, i) => {
    if (!slugToTrails[stop.slug]) slugToTrails[stop.slug] = []
    slugToTrails[stop.slug].push({ trail, position: i })
  })
})
