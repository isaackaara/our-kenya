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
  },
  // === CAT1-PRESIDENCIES ===
  {
      id: "reluctant-father-of-the-nation",
      name: "The Reluctant Father of the Nation",
      category: "Presidencies",
      description: "Kenyatta: mission school boy to first president",
      stops: [
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Early Life", title: "Early Life" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Kenya African Union", title: "Kenya African Union" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kapenguria Trial", title: "Kapenguria Trial" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Release from Detention", title: "Release from Detention" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Rise to Power", title: "Rise to Power" },
        { slug: "Elections/1963 Election/1963 Election", title: "1963 Election" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Jomo Kenyatta Presidency", title: "The Presidency" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Death 1978", title: "Death 1978" }
      ]
    },
    {
      id: "the-schoolmaster-who-became-a-dictator",
      name: "The Schoolmaster Who Became a Dictator",
      category: "Presidencies",
      description: "Daniel arap Moi: the quiet vice president who ruled for 24 years",
      stops: [
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Early Life and Rise", title: "Early Life and Rise" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi as Vice President", title: "Vice President" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Succession 1978", title: "Succession 1978" },
        { slug: "Presidencies/Daniel arap Moi Presidency/1982 Coup Attempt", title: "1982 Coup Attempt" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Nyayo Philosophy", title: "Nyayo Philosophy" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Era Detentions and Torture", title: "Detentions and Torture" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi and Multiparty Transition", title: "Multiparty Transition" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Retirement 2002", title: "Retirement 2002" }
      ]
    },
    {
      id: "the-economist-who-saved-kenya",
      name: "The Economist Who Saved Kenya",
      category: "Presidencies",
      description: "Mwai Kibaki: what actually happened during the economic miracle of 2003-2007",
      stops: [
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Early Life", title: "Early Life" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Opposition Years", title: "Opposition Years" },
        { slug: "Elections/2002 Election/2002 Election", title: "2002 Election" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Economic Revival 2003-2007", title: "Economic Revival" },
        { slug: "Presidencies/Mwai Kibaki Presidency/2005 Referendum", title: "2005 Referendum" },
        { slug: "Elections/2007 Election/2007 Election", title: "2007 Election" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Second Term", title: "Second Term" }
      ]
    },
    {
      id: "the-sons-burden",
      name: "The Son's Burden",
      category: "Presidencies",
      description: "Uhuru Kenyatta: the dynasty, the ICC, the handshake",
      stops: [
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Kenyatta Early Life", title: "Early Life" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Political Rise", title: "Political Rise" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV ICC Uhuru Case", title: "ICC Case" },
        { slug: "Elections/2013 Election/2013 Election", title: "2013 Election" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru First Term", title: "First Term" },
        { slug: "Elections/2017 Election/2017 Election", title: "2017 Election" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/The Handshake 2018", title: "The Handshake 2018" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Second Term", title: "Second Term" }
      ]
    },
    {
      id: "the-hustlers-gambit",
      name: "The Hustler's Gambit",
      category: "Presidencies",
      description: "William Ruto: from chicken seller to president, the story of Kenya's most controversial politician",
      stops: [
        { slug: "Presidencies/William Ruto Presidency/Ruto Early Life", title: "Early Life" },
        { slug: "Presidencies/William Ruto Presidency/Ruto Political Rise", title: "Political Rise" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV ICC Ruto Case", title: "ICC Case" },
        { slug: "Presidencies/William Ruto Presidency/Ruto as Deputy President", title: "Deputy President" },
        { slug: "Elections/2022 Election/2022 Election Hustler Narrative", title: "Hustler Narrative" },
        { slug: "Elections/2022 Election/2022 Election", title: "2022 Election" },
        { slug: "Presidencies/William Ruto Presidency/William Ruto Presidency", title: "The Presidency" }
      ]
    },
    {
      id: "the-vice-presidents-who-never-were",
      name: "The Vice Presidents Who Never Were",
      category: "Presidencies",
      description: "Five men who came close and what happened to each",
      stops: [
        { slug: "Political Movements/Oginga Odinga", title: "Oginga Odinga" },
        { slug: "Political Movements/Tom Mboya", title: "Tom Mboya" },
        { slug: "Political Movements/Raila Odinga", title: "Raila Odinga" },
        { slug: "Political Movements/Kijana Wamalwa", title: "Kijana Wamalwa" },
        { slug: "Political Movements/George Saitoti", title: "George Saitoti" },
        { slug: "Political Movements/Musalia Mudavadi", title: "Musalia Mudavadi" },
        { slug: "Elections/2022 Election/2022 Election Martha Karua", title: "Martha Karua" },
        { slug: "Elections/2022 Election/2022 Election Rigathi Gachagua", title: "Rigathi Gachagua" },
        { slug: "Presidencies/William Ruto Presidency/Gachagua Impeachment 2024", title: "Gachagua Impeachment" }
      ]
    },
    {
      id: "kapenguria-the-trial-that-made-a-nation",
      name: "Kapenguria: The Trial That Made a Nation",
      category: "Presidencies",
      description: "The political show trial of Jomo Kenyatta and its lasting impact",
      stops: [
        { slug: "Kikuyu/Mau Mau Uprising", title: "Mau Mau Uprising" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kapenguria Trial", title: "Kapenguria Trial" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Detention at Lokitaung", title: "Detention at Lokitaung" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Release from Detention", title: "Release from Detention" },
        { slug: "Political Movements/The Lancaster House Conferences", title: "Lancaster House" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Rise to Power", title: "Rise to Power" }
      ]
    },
    {
      id: "state-house-nairobi-what-happens-inside",
      name: "State House, Nairobi: What Happens Inside",
      category: "Presidencies",
      description: "The machinery of Kenyan executive power across all five presidencies",
      stops: [
        { slug: "Presidencies/State House Nairobi", title: "State House" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Inner Circle", title: "Kenyatta Inner Circle" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Inner Circle", title: "Moi Inner Circle" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Inner Circle", title: "Kibaki Inner Circle" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Inner Circle", title: "Uhuru Inner Circle" },
        { slug: "Presidencies/William Ruto Presidency/Ruto Inner Circle", title: "Ruto Inner Circle" },
        { slug: "Presidencies/Presidential Powers in Kenya", title: "Presidential Powers" }
      ]
    },
    {
      id: "the-coup-that-almost-happened",
      name: "The Coup That Almost Happened",
      category: "Presidencies",
      description: "The 1982 air force coup attempt: what went wrong and how close it came",
      stops: [
        { slug: "Presidencies/Daniel arap Moi Presidency/Pre-Coup Political Climate", title: "Pre-Coup Climate" },
        { slug: "Presidencies/Daniel arap Moi Presidency/1982 Coup Attempt", title: "The Coup Attempt" },
        { slug: "Presidencies/Daniel arap Moi Presidency/1982 Coup Aftermath", title: "Aftermath" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Hezekiah Ochuka", title: "Hezekiah Ochuka" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Paranoia After 1982", title: "Moi Paranoia" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Kenya Air Force Dissolution", title: "Air Force Dissolution" }
      ]
    },
    {
      id: "succession-politics-the-kenyan-way",
      name: "Succession Politics: The Kenyan Way",
      category: "Presidencies",
      description: "How power has transferred (or nearly not transferred) across five transitions",
      stops: [
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Death 1978", title: "1978: Kenyatta Death" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Succession 1978", title: "1978: Moi Succession" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Retirement 2002", title: "2002: Moi Retirement" },
        { slug: "Elections/2002 Election/2002 Election Moi Succession", title: "2002: The Project" },
        { slug: "Elections/2013 Election/2013 Election", title: "2013: Kibaki to Uhuru" },
        { slug: "Elections/2022 Election/2022 Election Uhuru Betrayal", title: "2022: Uhuru Betrayal" },
        { slug: "Elections/2022 Election/2022 Election", title: "2022: Ruto Wins" },
        { slug: "Presidencies/Succession Anxiety in Kenyan Politics", title: "Succession Anxiety" }
      ]
    },
    {
      id: "the-detainees",
      name: "The Detainees",
      category: "Presidencies",
      description: "Every major political detention in Kenya's history, from Kenyatta to Koigi wa Wamwere",
      stops: [
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Detention at Lokitaung", title: "Kenyatta at Lokitaung" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Political Detentions Under Kenyatta", title: "Kenyatta Era Detentions" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Era Detentions and Torture", title: "Moi Era Detentions" },
        { slug: "Political Movements/Ngugi wa Thiong'o Detention", title: "Ngugi wa Thiong'o" },
        { slug: "Political Movements/Koigi wa Wamwere", title: "Koigi wa Wamwere" },
        { slug: "Political Movements/Raila Odinga Detentions", title: "Raila Odinga" },
        { slug: "Political Movements/Wangari Maathai", title: "Wangari Maathai" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Release of Political Prisoners 1997", title: "1997 Releases" },
        { slug: "Presidencies/Mwai Kibaki Presidency/End of Political Detention", title: "End of Detention" }
      ]
    },
    {
      id: "1969-the-year-kenya-changed",
      name: "1969: The Year Kenya Changed",
      category: "Presidencies",
      description: "Tom Mboya's assassination, the Kisumu Massacre, the one-party creep",
      stops: [
        { slug: "Political Movements/Tom Mboya", title: "Tom Mboya" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Tom Mboya Assassination", title: "Mboya Assassination" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kisumu Massacre 1969", title: "Kisumu Massacre" },
        { slug: "Elections/1969 Election/1969 Election KPU Ban", title: "KPU Ban" },
        { slug: "Elections/1969 Election/1969 Election", title: "1969 Election" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/One-Party State Formation", title: "One-Party State" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Luo Exclusion Under Kenyatta", title: "Luo Exclusion" }
      ]
    },
    {
      id: "the-nyayo-era-fear-and-development",
      name: "The Nyayo Era: Fear and Development",
      category: "Presidencies",
      description: "How Moi built roads and broke people simultaneously",
      stops: [
        { slug: "Presidencies/Daniel arap Moi Presidency/Nyayo Philosophy", title: "Nyayo Philosophy" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Development Record", title: "Development Record" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Era Infrastructure", title: "Infrastructure" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Era Education Expansion", title: "Education Expansion" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Era Detentions and Torture", title: "Detentions and Torture" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Nyayo House Torture Chambers", title: "Nyayo House" },
        { slug: "Corruption/Moi Era Corruption Economy", title: "Corruption Economy" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Legacy", title: "Moi Legacy" }
      ]
    },
    {
      id: "second-liberation-the-multiparty-struggle",
      name: "Second Liberation: The Multiparty Struggle",
      category: "Presidencies",
      description: "How Kenya got back democracy in 1991-2002",
      stops: [
        { slug: "Political Movements/The Second Liberation", title: "The Second Liberation" },
        { slug: "Political Movements/Saba Saba 1990", title: "Saba Saba 1990" },
        { slug: "Political Movements/Kenneth Matiba", title: "Kenneth Matiba" },
        { slug: "Political Movements/Charles Rubia", title: "Charles Rubia" },
        { slug: "Elections/1992 Election/1992 Election Pressure for Reform", title: "Pressure for Reform" },
        { slug: "Elections/1992 Election/1992 Election", title: "1992 Election" },
        { slug: "Elections/1997 Election/1997 Election IPPG Reforms", title: "IPPG Reforms" },
        { slug: "Elections/2002 Election/2002 Election", title: "2002 Election" }
      ]
    },
    {
      id: "the-constitution-of-2010",
      name: "The Constitution of 2010",
      category: "Presidencies",
      description: "The long road to the new constitution and how it remade Kenya",
      stops: [
        { slug: "Political Movements/Constitutional Reform Movement", title: "Reform Movement" },
        { slug: "Presidencies/Mwai Kibaki Presidency/2005 Referendum", title: "2005 Referendum" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV 2010 Constitution", title: "PEV and Constitution" },
        { slug: "Political Movements/The 2010 Constitution Process", title: "Constitution Process" },
        { slug: "Cross-Ethnic/The Kenyan Constitution 2010", title: "2010 Constitution" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki and the New Constitution", title: "Kibaki and Constitution" },
        { slug: "Political Movements/Devolution Kenya", title: "Devolution" }
      ]
    },
    {
      id: "tribalism-and-the-state",
      name: "Tribalism and the State",
      category: "Presidencies",
      description: "How ethnicity became the operating system of Kenyan politics",
      stops: [
        { slug: "Cross-Ethnic/Ethnic Arithmetic in Politics", title: "Ethnic Arithmetic" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kikuyu Dominance Under Kenyatta", title: "Kikuyu Dominance" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Kalenjin Ascendancy Under Moi", title: "Kalenjin Ascendancy" },
        { slug: "Elections/1992 Election/1992 Election Rift Valley Violence", title: "Rift Valley Violence" },
        { slug: "Corruption/Corruption and Ethnic Politics", title: "Corruption and Ethnicity" },
        { slug: "Elections/2007 Election/2007 Election Post-Election Violence", title: "2007 Violence" },
        { slug: "Cross-Ethnic/National Identity Beyond Tribe", title: "Beyond Tribe" },
        { slug: "Cross-Ethnic/The Kenya We Share", title: "The Kenya We Share" }
      ]
    },
    {
      id: "the-handshake",
      name: "The Handshake",
      category: "Presidencies",
      description: "Uhuru and Raila's mysterious 2018 deal and what it meant for everything",
      stops: [
        { slug: "Elections/2017 Election/2017 Election Handshake Prelude", title: "Handshake Prelude" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/The Handshake 2018", title: "The Handshake" },
        { slug: "Cross-Ethnic/The Handshake Pattern", title: "Handshake Pattern" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/BBI Process", title: "BBI Process" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Ruto-Uhuru Fallout", title: "Ruto-Uhuru Fallout" },
        { slug: "Elections/2022 Election/2022 Election Uhuru Betrayal", title: "2022 Betrayal" }
      ]
    },
    {
      id: "dynasty-vs-hustler-2022",
      name: "Dynasty vs. Hustler: 2022",
      category: "Presidencies",
      description: "The election that defined a generation",
      stops: [
        { slug: "Elections/2022 Election/2022 Election Hustler Narrative", title: "Hustler Narrative" },
        { slug: "Elections/2022 Election/2022 Election Kenya Kwanza", title: "Kenya Kwanza" },
        { slug: "Elections/2022 Election/2022 Election Azimio Coalition", title: "Azimio Coalition" },
        { slug: "Elections/2022 Election/2022 Election Mt Kenya Shift", title: "Mt. Kenya Shift" },
        { slug: "Elections/2022 Election/2022 Election", title: "The Election" },
        { slug: "Elections/2022 Election/2022 Election Supreme Court Petition", title: "Supreme Court" },
        { slug: "Elections/2022 Election/2022 Election Long-Term Impact", title: "Long-Term Impact" }
      ]
    },
    {
      id: "foreign-policy-kenya-and-the-world",
      name: "Foreign Policy: Kenya and the World",
      category: "Presidencies",
      description: "How each president positioned Kenya internationally",
      stops: [
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Foreign Policy", title: "Kenyatta Foreign Policy" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Foreign Policy", title: "Moi Foreign Policy" },
        { slug: "Presidencies/Mwai Kibaki Presidency/Kibaki Foreign Policy", title: "Kibaki Foreign Policy" },
        { slug: "Presidencies/Uhuru Kenyatta Presidency/Uhuru Foreign Policy", title: "Uhuru Foreign Policy" },
        { slug: "Presidencies/William Ruto Presidency/Ruto Foreign Policy", title: "Ruto Foreign Policy" },
        { slug: "East Africa/3_Kenya_in_East_Africa", title: "Kenya in East Africa" },
        { slug: "Political Movements/Kenya and the West", title: "Kenya and the West" }
      ]
    },
    {
      id: "if-mboya-had-lived",
      name: "If Mboya Had Lived",
      category: "Presidencies",
      description: "A counterfactual: what Kenya might have been without the 1969 assassination",
      stops: [
        { slug: "Political Movements/Tom Mboya", title: "Tom Mboya" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Tom Mboya Assassination", title: "Assassination" },
        { slug: "Elections/1969 Election/1969 Election Luo Exclusion", title: "Luo Exclusion" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Succession Planning Under Kenyatta", title: "Succession Planning" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi Succession 1978", title: "Moi Succession" },
        { slug: "Political Movements/The Lost Kenya", title: "The Lost Kenya" }
      ]
    },
  // === CAT2-KIKUYU ===
  {
      id: "gikuyu-and-mumbi-the-creation-story",
      name: "Gikuyu and Mumbi: The Creation Story",
      category: "Kikuyu",
      description: "The Kikuyu origin myth and what it tells us about identity",
      stops: [
        { slug: "Kikuyu/Kikuyu Origins", title: "The People of the Fig Tree" },
        { slug: "Kikuyu/Kikuyu Creation Myth", title: "Gikuyu and Mumbi" },
        { slug: "Kikuyu/Mount Kenya and the Kikuyu", title: "The Sacred Mountain" },
        { slug: "Kikuyu/Kikuyu Clans (Mihiriga)", title: "The Nine Clans" },
        { slug: "Kikuyu/Kikuyu Traditional Religion", title: "Ngai and the Mountain" },
        { slug: "Kikuyu/Kikuyu Oral Literature", title: "Stories of Origin" }
      ]
    },
    {
      id: "the-ridge-farmers",
      name: "The Ridge Farmers",
      category: "Kikuyu",
      description: "How the Kikuyu agricultural system worked before colonialism",
      stops: [
        { slug: "Kikuyu/Kikuyu Agriculture Pre-Colonial", title: "The Ridge System" },
        { slug: "Kikuyu/Kikuyu Land Tenure (Githaka)", title: "Githaka: The Family Estate" },
        { slug: "Kikuyu/Kikuyu Food Culture", title: "What the Ridge Produced" },
        { slug: "Kikuyu/Kikuyu Social Structure", title: "Age-Sets and Land Rights" },
        { slug: "Kikuyu/Kikuyu Women's Work", title: "Cultivating and Gathering" },
        { slug: "Kikuyu/Kikuyu Trade Networks", title: "Exchange Before Money" },
        { slug: "Kikuyu/Mount Kenya and the Kikuyu", title: "Forest and Farmland" }
      ]
    },
    {
      id: "the-githaka-land-as-life",
      name: "The Githaka: Land as Life",
      category: "Kikuyu",
      description: "The Kikuyu land tenure system and why its theft caused a revolution",
      stops: [
        { slug: "Kikuyu/Kikuyu Land Tenure (Githaka)", title: "What Githaka Meant" },
        { slug: "Europeans/The White Highlands", title: "The Theft of the Highlands" },
        { slug: "Europeans/The Squatter System", title: "Forced Labor on Stolen Land" },
        { slug: "Kikuyu/Land Grievance and Kikuyu Politics", title: "The Political Economy of Anger" },
        { slug: "Kikuyu/Land Consolidation and Betterment", title: "The Colonial Solution That Made It Worse" },
        { slug: "Kikuyu/Kikuyu Land Alienation", title: "Measurements of Loss" },
        { slug: "Kikuyu/Land and the Mau Mau", title: "Land or Death" }
      ]
    },
    {
      id: "harry-thuku-and-the-first-protest",
      name: "Harry Thuku and the First Protest",
      category: "Kikuyu",
      description: "The 1922 Harry Thuku arrest and the first mass political action in Kenya",
      stops: [
        { slug: "Kikuyu/Harry Thuku", title: "The First Political Organizer" },
        { slug: "Kikuyu/The East African Association", title: "Cross-Ethnic Organizing, 1921" },
        { slug: "Kikuyu/Harry Thuku Arrest and Massacre 1922", title: "The Day Nairobi Exploded" },
        { slug: "Kikuyu/Mary Muthoni Nyanjiru", title: "The Woman Who Shamed the Men" },
        { slug: "Asians/Harry Thuku and Asian Solidarity", title: "Indian Support for African Protest" },
        { slug: "Kikuyu/Harry Thuku Exile and Return", title: "The Man Who Came Back Changed" }
      ]
    },
    {
      id: "the-kca-and-the-birth-of-kikuyu-politics",
      name: "The KCA and the Birth of Kikuyu Politics",
      category: "Kikuyu",
      description: "The Kikuyu Central Association from 1921 to Kenyatta",
      stops: [
        { slug: "Kikuyu/The Kikuyu Central Association (KCA)", title: "The First Political Party" },
        { slug: "Kikuyu/KCA Land Petition to London", title: "Appealing to the King" },
        { slug: "Kikuyu/Jomo Kenyatta and the KCA", title: "The Young Organizer" },
        { slug: "Kikuyu/Kenyatta in London 1929-1946", title: "Seventeen Years Abroad" },
        { slug: "Kikuyu/Female Circumcision Controversy", title: "The Church, the Body, the Land" },
        { slug: "Kikuyu/KCA Suppression 1940", title: "Banned by the Colonial State" },
        { slug: "Kikuyu/KCA to KAU", title: "Rebirth After the War" }
      ]
    },
    {
      id: "facing-mount-kenya",
      name: "Facing Mount Kenya",
      category: "Kikuyu",
      description: "Kenyatta's anthropological masterwork as political act",
      stops: [
        { slug: "Kikuyu/Jomo Kenyatta Facing Mount Kenya", title: "The Book That Defined a People" },
        { slug: "Kikuyu/Kenyatta and Malinowski", title: "Anthropology as Resistance" },
        { slug: "Kikuyu/Mount Kenya and the Kikuyu", title: "The Sacred Geography" },
        { slug: "Kikuyu/Kikuyu Traditional Religion", title: "Recording the Old Ways" },
        { slug: "Kikuyu/Female Circumcision Controversy", title: "Defending the Custom" },
        { slug: "Kikuyu/Kikuyu Identity Before and After Kenyatta", title: "How the Book Changed Kikuyu Self-Perception" }
      ]
    },
    {
      id: "the-oathing-ceremonies",
      name: "The Oathing Ceremonies",
      category: "Kikuyu",
      description: "The controversial oathing that bound Kikuyu together during and after Mau Mau",
      stops: [
        { slug: "Kikuyu/Kikuyu Oathing Tradition", title: "The Sacred Bond" },
        { slug: "Kikuyu/Mau Mau Oaths", title: "The Oaths of Unity and Combat" },
        { slug: "Kikuyu/British Propaganda on Oathing", title: "How the British Saw It" },
        { slug: "Kikuyu/The Kabiro Oath (1969)", title: "Kenyatta's Post-Independence Oath" },
        { slug: "Kikuyu/Oathing and Kikuyu Solidarity", title: "Binding the Community" },
        { slug: "Kikuyu/GEMA and Kikuyu Unity", title: "From Oath to Political Alliance" },
        { slug: "Kikuyu/Oathing Controversies Today", title: "The Ghost of the Oath" }
      ]
    },
    {
      id: "mau-mau-the-forest-war",
      name: "Mau Mau: The Forest War",
      category: "Kikuyu",
      description: "Into the Aberdare forest with Dedan Kimathi and the Land and Freedom Army",
      stops: [
        { slug: "Kikuyu/Mau Mau Uprising", title: "The War for Land and Freedom" },
        { slug: "Kikuyu/Kenya Land and Freedom Army", title: "The Forest Fighters" },
        { slug: "Kikuyu/Dedan Kimathi", title: "Field Marshal of the Forest" },
        { slug: "Kikuyu/Mau Mau Forest Bases", title: "Living in the Aberdares" },
        { slug: "Kikuyu/Mau Mau Weapons and Tactics", title: "The Guerrilla Arsenal" },
        { slug: "Kikuyu/Mau Mau Women Fighters", title: "The Women Who Fought" },
        { slug: "Kikuyu/Mau Mau Songs and Poetry", title: "The Songs of Resistance" },
        { slug: "Conservation/Aberdare National Park", title: "The Forest Theater of War" },
        { slug: "Kikuyu/Mau Mau Legacy", title: "The War That Made Kenya" }
      ]
    },
    {
      id: "the-home-guard-kikuyu-against-kikuyu",
      name: "The Home Guard: Kikuyu Against Kikuyu",
      category: "Kikuyu",
      description: "The loyalists who fought alongside the British, and how that schism lasted for decades",
      stops: [
        { slug: "Kikuyu/The Kikuyu Home Guard", title: "Collaborators or Survivors?" },
        { slug: "Kikuyu/Chiefs and Loyalists", title: "The Colonial Administration's Allies" },
        { slug: "Kikuyu/Home Guard Violence", title: "The Civil War Within the War" },
        { slug: "Kikuyu/Land Rewards for Loyalists", title: "How Loyalty Was Bought" },
        { slug: "Kikuyu/Mau Mau Trials and Executions", title: "The Home Guard as Witnesses" },
        { slug: "Kikuyu/Post-Mau Mau Reconciliation", title: "The Schism That Never Healed" },
        { slug: "Kikuyu/Kenyatta and the Home Guard", title: "Kenyatta's Choice: Forgiveness or Justice?" }
      ]
    },
    {
      id: "dedan-kimathi-last-days",
      name: "Dedan Kimathi's Last Days",
      category: "Kikuyu",
      description: "Capture, trial, and execution: the making of a martyr",
      stops: [
        { slug: "Kikuyu/Dedan Kimathi", title: "Field Marshal Kimathi" },
        { slug: "Kikuyu/Kimathi Capture 1956", title: "The Trap and the Betrayal" },
        { slug: "Kikuyu/Kimathi Trial", title: "Colonial Justice" },
        { slug: "Kikuyu/Kimathi Execution 1957", title: "The Hanging" },
        { slug: "Kikuyu/Kimathi Burial Controversy", title: "The Missing Grave" },
        { slug: "Kikuyu/Kimathi as National Hero", title: "From Criminal to Martyr" }
      ]
    },
    {
      id: "the-emergency-detention-camps",
      name: "The Emergency Detention Camps",
      category: "Kikuyu",
      description: "Hola, Manyani, and the system of colonial violence",
      stops: [
        { slug: "Kikuyu/The Villagization Programme", title: "Forced Removal and Containment" },
        { slug: "Kikuyu/Detention Camps", title: "The Camp System" },
        { slug: "Kikuyu/Hola Massacre 1959", title: "The Killing That Changed Britain" },
        { slug: "Kikuyu/Pipeline of Brutality", title: "The Systematic Use of Torture" },
        { slug: "Kikuyu/Screening and Interrogation", title: "How Suspects Were Processed" },
        { slug: "Kikuyu/Mau Mau Reparations Case", title: "The British Government in Court, 2011" },
        { slug: "Kikuyu/Caroline Elkins and Imperial Reckoning", title: "The Historian Who Exposed the Truth" }
      ]
    },
    {
      id: "the-gikuyu-and-mumbi-movement",
      name: "The Gikuyu and Mumbi Movement",
      category: "Kikuyu",
      description: "Post-independence Kikuyu ethnic mobilization",
      stops: [
        { slug: "Kikuyu/GEMA (Gikuyu Embu Meru Association)", title: "The Ethnic Alliance" },
        { slug: "Kikuyu/GEMA and Kikuyu Unity", title: "Business and Politics Combined" },
        { slug: "Kikuyu/GEMA and the Moi Presidency", title: "The Threat to Kalenjin Power" },
        { slug: "Kikuyu/GEMA Banned 1980", title: "Moi Shuts It Down" },
        { slug: "Kikuyu/Mount Kenya Mafia", title: "The Business Elite Regroups" },
        { slug: "Kikuyu/Kikuyu Political Unity Myth", title: "The Illusion of Tribal Solidarity" }
      ]
    },
    {
      id: "wangari-maathai-the-woman-who-planted-trees",
      name: "Wangari Maathai: The Woman Who Planted Trees",
      category: "Kikuyu",
      description: "From Nyeri to Oslo, the Green Belt Movement",
      stops: [
        { slug: "Conservation/Wangari Maathai", title: "Nyeri's Daughter" },
        { slug: "Conservation/Green Belt Movement", title: "Trees, Women, Democracy" },
        { slug: "Kikuyu/Wangari Maathai and Moi", title: "Defying the President" },
        { slug: "Kikuyu/Uhuru Park Battle", title: "The Fight for Nairobi's Green Space" },
        { slug: "Kikuyu/Wangari Maathai Nobel Prize 2004", title: "Africa's First Woman Nobel Laureate" },
        { slug: "Kikuyu/Wangari Maathai Death 2011", title: "The Nation Mourns" },
        { slug: "Kikuyu/Wangari Maathai Legacy", title: "What She Left Behind" }
      ]
    },
    {
      id: "the-mount-kenya-mafia",
      name: "The Mount Kenya Mafia",
      category: "Kikuyu",
      description: "How Kikuyu business elites captured the Kenyan economy",
      stops: [
        { slug: "Kikuyu/Mount Kenya Mafia", title: "The Business Elite" },
        { slug: "Kikuyu/Kenyatta Family Business", title: "The First Family's Empire" },
        { slug: "Kikuyu/Kikuyu Land Buying Companies", title: "Pooling Resources to Buy Back the Highlands" },
        { slug: "Kikuyu/Kikuyu in Banking", title: "Controlling the Money" },
        { slug: "Corporate Kenya/Kenyatta Family Business", title: "The Presidential Portfolio" },
        { slug: "Kikuyu/GEMA and Kikuyu Unity", title: "Ethnic Capitalism" },
        { slug: "Kikuyu/Kikuyu Dominance in Business", title: "The Numbers Don't Lie" },
        { slug: "Kikuyu/Resentment and the Kikuyu Question", title: "The Price of Success" }
      ]
    },
    {
      id: "kirinyaga-the-coffee-country",
      name: "Kirinyaga: The Coffee Country",
      category: "Kikuyu",
      description: "The political economy of Kenya's best single-origin coffee",
      stops: [
        { slug: "Counties/Kirinyaga/Kirinyaga County", title: "The Land Between the Rivers" },
        { slug: "Counties/Kirinyaga/Kirinyaga Coffee", title: "The Best Bean in Kenya" },
        { slug: "Counties/Kirinyaga/Kirinyaga Cooperatives", title: "Farmer Cooperatives and Marketing" },
        { slug: "Corporate Kenya/Coffee Industry Kenya", title: "The National Coffee Crisis" },
        { slug: "Counties/Kirinyaga/Mwea Rice", title: "Rice and Coffee: Two Cash Crops" },
        { slug: "Counties/Kirinyaga/Kirinyaga Politics", title: "The Politics of Plenty" },
        { slug: "Counties/Kirinyaga/Kirinyaga Kikuyu Heritage", title: "Cultural Identity in the Shadow of the Mountain" }
      ]
    },
    {
      id: "the-murang-a-massacre-and-the-banana-hill-blues",
      name: "The Murang'a Massacre and the Banana Hill Blues",
      category: "Kikuyu",
      description: "Post-election violence in Kikuyu heartland",
      stops: [
        { slug: "Counties/Murang'a/Murang'a County", title: "Fort Hall and the Kikuyu Heartland" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Nairobi Gangs", title: "The Mungiki Factor" },
        { slug: "Kikuyu/Mungiki Movement", title: "The Sect That Became a Militia" },
        { slug: "Kikuyu/Kikuyu Self-Defense 2007-2008", title: "Vigilante Response to Rift Valley Expulsions" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 PEV Naivasha Reprisals", title: "The Counter-Violence" },
        { slug: "Counties/Kiambu/Kiambu and the 2007 Violence", title: "The Kiambu Experience" }
      ]
    },
    {
      id: "presbyterian-kenya-the-church-and-the-kikuyu",
      name: "Presbyterian Kenya: The Church and the Kikuyu",
      category: "Kikuyu",
      description: "The Church of Scotland Mission and its extraordinary influence",
      stops: [
        { slug: "Kikuyu/Presbyterian Mission to the Kikuyu", title: "The Scots Arrive" },
        { slug: "Europeans/Church of Scotland Mission", title: "Thogoto and Tumutumu" },
        { slug: "Kikuyu/Female Circumcision Controversy", title: "The Great Schism of 1929" },
        { slug: "Kikuyu/Kikuyu Independent Schools", title: "Breaking Away from Mission Control" },
        { slug: "Kikuyu/Presbyterianism and Kikuyu Identity", title: "How the Kirk Shaped the Kikuyu" },
        { slug: "Kikuyu/Presbyterian Church of East Africa (PCEA)", title: "The Independent African Church" },
        { slug: "Kikuyu/PCEA and Kikuyu Politics", title: "The Pulpit and the Presidency" }
      ]
    },
    {
      id: "githunguri-the-independent-school-movement",
      name: "Githunguri: The Independent School Movement",
      category: "Kikuyu",
      description: "Kikuyu-owned schools as anti-colonial resistance",
      stops: [
        { slug: "Kikuyu/Kikuyu Independent Schools", title: "The Schools We Built Ourselves" },
        { slug: "Kikuyu/Githunguri Teachers College", title: "The Crown Jewel" },
        { slug: "Kikuyu/KISA and KKEA", title: "The Independent Schools Associations" },
        { slug: "Kikuyu/Jomo Kenyatta and Githunguri", title: "Kenyatta as Principal" },
        { slug: "Kikuyu/Closure of Independent Schools 1952", title: "The Emergency Shuts Them Down" },
        { slug: "Counties/Kiambu/Alliance High School", title: "The Elite Alternative" }
      ]
    },
    {
      id: "the-kikuyu-diaspora",
      name: "The Kikuyu Diaspora",
      category: "Kikuyu",
      description: "From Kiambu to Kisumu to Westlands: how the Kikuyu colonised Kenya's economy",
      stops: [
        { slug: "Kikuyu/Kikuyu in Nairobi", title: "The City of the Kikuyu" },
        { slug: "Kikuyu/Kikuyu Expansion into the Rift Valley", title: "Settling the White Highlands" },
        { slug: "Kikuyu/Kikuyu in Nakuru", title: "Nakuru as the Second Kikuyu Capital" },
        { slug: "Kikuyu/Kikuyu Traders in Western Kenya", title: "The Kikuyu Duka in Luhya Country" },
        { slug: "Kikuyu/Kikuyu in Mombasa", title: "The Coastal Kikuyu" },
        { slug: "Kikuyu/Kikuyu Diaspora Wealth", title: "Remittances and Rural Investment" },
        { slug: "Kikuyu/Kikuyu and the Kenyan Nation", title: "Are the Kikuyu Kenyans or Just Kikuyu?" }
      ]
    },
    {
      id: "ngai-on-kirinyaga-kikuyu-spirituality",
      name: "Ngai on Kirinyaga: Kikuyu Spirituality",
      category: "Kikuyu",
      description: "The pre-Christian religious world of the mountain",
      stops: [
        { slug: "Kikuyu/Kikuyu Traditional Religion", title: "Ngai, the Creator" },
        { slug: "Kikuyu/Mount Kenya and the Kikuyu", title: "Kirinyaga: The Mountain of Brightness" },
        { slug: "Kikuyu/Kikuyu Sacred Groves", title: "The Shrines of Ngai" },
        { slug: "Kikuyu/Kikuyu Prophets and Seers", title: "The Intermediaries" },
        { slug: "Kikuyu/Kikuyu Sacrifice", title: "The Ritual Economy" },
        { slug: "Kikuyu/Christianization of the Kikuyu", title: "The Arrival of the Gospel" }
      ]
    },
  // === CAT3-LUO ===
  {
      id: "from-the-nile-to-the-lake",
      name: "From the Nile to the Lake",
      category: "Luo",
      description: "The southward migration of the Luo people, where they came from and how they got here",
      stops: [
        { slug: "Luo/Luo Origins and Migration", title: "Origins and Migration" },
        { slug: "Luo/Luo Origins", title: "Luo Origins" },
        { slug: "Luo/Ramogi", title: "Ramogi, the Ancestor" },
        { slug: "Luo/Nam Lolwe", title: "Nam Lolwe (The Lake)" },
        { slug: "Luo/Luo Clan Structure", title: "Clan Structure" },
        { slug: "Luo/Luo Traditional Governance", title: "Traditional Governance" },
        { slug: "Luo/Luo Social Structure", title: "Social Structure" }
      ]
    },
    {
      id: "the-fishing-economy-of-lake-victoria",
      name: "The Fishing Economy of Lake Victoria",
      category: "Luo",
      description: "How the lake shaped Luo society, economy, and identity",
      stops: [
        { slug: "Luo/Lake Victoria Deep Dive", title: "Lake Victoria" },
        { slug: "Luo/Luo Fishing Economy Deep Dive", title: "The Fishing Economy" },
        { slug: "Luo/Luo Land and Fishing", title: "Land and Fishing Rights" },
        { slug: "Counties/Kisumu/Lake Victoria Kisumu", title: "The World's Second-Largest Freshwater Lake" },
        { slug: "Counties/Kisumu/Kisumu Fishing Industry", title: "Kisumu's Fishing Industry" },
        { slug: "Luo/Luo and the Fish Trade", title: "Fish Trade Networks" },
        { slug: "Luo/Luo Cattle and Livestock", title: "Cattle and Livestock" }
      ]
    },
    {
      id: "luo-funerary-customs",
      name: "Luo Funerary Customs",
      category: "Luo",
      description: "Why Luo burial rites became a political battleground in Kenya",
      stops: [
        { slug: "Luo/Luo Death and Mourning", title: "Death and Mourning" },
        { slug: "Luo/Luo Funeral Traditions", title: "Funeral Traditions" },
        { slug: "Luo/Luo Ancestor Veneration", title: "Ancestor Veneration" },
        { slug: "Luo/Chira", title: "Chira (The Curse)" },
        { slug: "Luo/Luo Religion and Cosmology", title: "Religion and Cosmology" },
        { slug: "Luo/Luo Prophets and Seers", title: "Prophets and Seers" }
      ]
    },
    {
      id: "grace-ogot-the-first-voice",
      name: "Grace Ogot: The First Voice",
      category: "Luo",
      description: "Kenya's first published female author, the nurse who wrote the nation",
      stops: [
        { slug: "Luo/Grace Ogot Deep Dive", title: "Grace Ogot" },
        { slug: "Luo/Luo Oral Literature", title: "Oral Literature Traditions" },
        { slug: "Luo/Luo Women in History", title: "Luo Women in History" },
        { slug: "Luo/Luo Women's Roles", title: "Women's Roles" },
        { slug: "Luo/Luo and Education", title: "Education and Literacy" },
        { slug: "Luo/Asenath Bole Odaga", title: "Asenath Bole Odaga" }
      ]
    },
    {
      id: "tom-mboya-the-man-who-should-have-been-president",
      name: "Tom Mboya: The Man Who Should Have Been President",
      category: "Luo",
      description: "Labor leader, Pan-Africanist, assassination victim",
      stops: [
        { slug: "Luo/Tom Mboya", title: "Tom Mboya" },
        { slug: "Elections/1963 Election/1963 Election Tom Mboya", title: "1963 Election Role" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Tom Mboya", title: "Kenyatta and Tom Mboya" },
        { slug: "Luo/Tom Mboya Assassination", title: "The Assassination" },
        { slug: "Counties/Homa Bay/Tom Mboya and Homa Bay", title: "Tom Mboya and Homa Bay" },
        { slug: "Counties/Homa Bay/Rusinga Island", title: "Rusinga Island" },
        { slug: "Legacy/Political Assassination Legacy", title: "Political Assassination Legacy" },
        { slug: "Luo/Luo Political History", title: "Luo Political History" }
      ]
    },
    {
      id: "oginga-odinga-not-yet-uhuru",
      name: "Oginga Odinga: Not Yet Uhuru",
      category: "Luo",
      description: "The original opposition, from independence ally to Kenya's first dissident",
      stops: [
        { slug: "Luo/Jaramogi Oginga Odinga", title: "Jaramogi Oginga Odinga" },
        { slug: "Luo/Oginga Odinga Deep Dive", title: "Oginga Odinga Deep Dive" },
        { slug: "Elections/1963 Election/1963 Election Oginga Odinga", title: "1963 Election" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Oginga Odinga", title: "Kenyatta and Oginga Odinga" },
        { slug: "Luo/Kisumu Massacre 1969", title: "The Kisumu Massacre 1969" },
        { slug: "Presidencies/Daniel arap Moi Presidency/Moi and Oginga Odinga", title: "Moi and Oginga Odinga" },
        { slug: "Elections/1992 Election/1992 Election Oginga Odinga", title: "1992 Election" },
        { slug: "Luo/Luo Political Philosophy", title: "Luo Political Philosophy" }
      ]
    },
    {
      id: "barack-obama-sr-the-brilliant-wastrel",
      name: "Barack Obama Sr: The Brilliant Wastrel",
      category: "Luo",
      description: "The Siaya economist whose American son became president",
      stops: [
        { slug: "Luo/Barack Obama Sr", title: "Barack Obama Sr" },
        { slug: "Counties/Siaya/Barack Obama Sr and Siaya", title: "Barack Obama Sr and Siaya" },
        { slug: "Counties/Siaya/Kogelo Village", title: "Kogelo Village" },
        { slug: "Counties/Siaya/Siaya and Obama Foundation", title: "Siaya and Obama Foundation" },
        { slug: "Counties/Siaya/Siaya County", title: "Siaya County" },
        { slug: "Luo/Luo Diaspora", title: "Luo Diaspora" }
      ]
    },
    {
      id: "jaramogis-ghost-the-luo-opposition-tradition",
      name: "Jaramogi's Ghost: The Luo Opposition Tradition",
      category: "Luo",
      description: "How the Luo community became permanently oppositional, and why",
      stops: [
        { slug: "Luo/Luo Political History", title: "Luo Political History" },
        { slug: "Luo/Luo and the Kenyan State", title: "Luo and the Kenyan State" },
        { slug: "Luo/Luo Political Philosophy", title: "Political Philosophy" },
        { slug: "Luo/Luo-Kikuyu Political Relationship", title: "Luo-Kikuyu Political Relationship" },
        { slug: "Counties/Kisumu/Kisumu Politics", title: "Kisumu Politics: Opposition Stronghold" },
        { slug: "Luo/Luo and the 2007 Election", title: "The 2007 Election" },
        { slug: "Luo/Luo Political Voice Post-2022", title: "Post-2022 Political Voice" }
      ]
    },
    {
      id: "raila-odinga-five-elections",
      name: "Raila Odinga: Five Elections",
      category: "Luo",
      description: "The man who ran for president five times and what each campaign meant",
      stops: [
        { slug: "Luo/Raila Odinga", title: "Raila Odinga" },
        { slug: "Luo/Raila Odinga Biography", title: "Raila Biography" },
        { slug: "Elections/1997 Election/1997 Election Raila Odinga", title: "1997 Election" },
        { slug: "Elections/2007 Election/2007 Election Raila Odinga ODM", title: "2007 Election (ODM)" },
        { slug: "Elections/2013 Election/2013 Election Raila Campaign", title: "2013 Election Campaign" },
        { slug: "Elections/2017 Election/2017 Election Raila Boycott", title: "2017 Election Boycott" },
        { slug: "Elections/2022 Election/2022 Election Azimio Coalition", title: "2022 Election (Azimio)" },
        { slug: "Presidencies/William Ruto Presidency/Ruto and Raila Handshake 2024", title: "Ruto and Raila Handshake 2024" },
        { slug: "Luo/Luo Politics Post-Raila", title: "Luo Politics Post-Raila" }
      ]
    },
    {
      id: "the-kisumu-massacre-1969",
      name: "The Kisumu Massacre, 1969",
      category: "Luo",
      description: "When Kenyatta's security forces opened fire on a crowd greeting Odinga",
      stops: [
        { slug: "Luo/Kisumu Massacre 1969", title: "The Kisumu Massacre 1969" },
        { slug: "Counties/Kisumu/Kisumu Colonial History", title: "Kisumu Under Colonial Rule" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Oginga Odinga", title: "Kenyatta and Oginga Odinga" },
        { slug: "Luo/Luo and the Kenyan State", title: "Luo and the Kenyan State" },
        { slug: "Elections/1969 Election/1969 Election Kisumu Massacre", title: "1969 Election Kisumu Massacre" },
        { slug: "Counties/Kisumu/Kisumu Politics", title: "Kisumu Politics" }
      ]
    },
    {
      id: "omena-the-economy-of-small-fish",
      name: "Omena: The Economy of Small Fish",
      category: "Luo",
      description: "The political economy of the Nile perch invasion and the collapse of the traditional fishery",
      stops: [
        { slug: "Luo/Luo Fishing Economy Deep Dive", title: "The Fishing Economy" },
        { slug: "Counties/Kisumu/Nile Perch Kisumu", title: "The Nile Perch: Ecological Catastrophe" },
        { slug: "Conservation/Nile Perch and Lake Victoria", title: "Nile Perch and Lake Victoria" },
        { slug: "Counties/Kisumu/Water Hyacinth Lake Victoria", title: "Water Hyacinth Crisis" },
        { slug: "Counties/Kisumu/Kisumu Fishing Industry", title: "Kisumu's Fishing Industry" },
        { slug: "Luo/Luo and the Fish Trade", title: "Fish Trade Networks" },
        { slug: "Counties/Kisumu/Kisumu Women", title: "Women in Kisumu's Economy" }
      ]
    },
    {
      id: "rusinga-island-tom-mboyas-home",
      name: "Rusinga Island: Tom Mboya's Home",
      category: "Luo",
      description: "The island, the fossils, the politics, the annual pilgrimage to his grave",
      stops: [
        { slug: "Counties/Homa Bay/Rusinga Island", title: "Rusinga Island" },
        { slug: "Luo/Tom Mboya", title: "Tom Mboya" },
        { slug: "Counties/Homa Bay/Tom Mboya and Homa Bay", title: "Tom Mboya and Homa Bay" },
        { slug: "Counties/Homa Bay/Homa Bay Fossil Sites", title: "Fossil Sites" },
        { slug: "Counties/Homa Bay/Homa Bay County", title: "Homa Bay County" },
        { slug: "Counties/Homa Bay/Homa Bay Lake Victoria Ecology", title: "Lake Victoria Ecology" }
      ]
    },
    {
      id: "luo-benga-music",
      name: "Luo Benga Music",
      category: "Luo",
      description: "From D.O. Misiani to Ayub Ogada: the guitar music of Lake Victoria",
      stops: [
        { slug: "Luo/Benga Music Origins", title: "Benga Music Origins" },
        { slug: "Luo/D.O. Misiani", title: "D.O. Misiani" },
        { slug: "Luo/Luo Music and Culture", title: "Luo Music and Culture" },
        { slug: "Luo/Ohangla Music", title: "Ohangla Music" },
        { slug: "Luo/Nyatiti", title: "Nyatiti (Traditional Lyre)" },
        { slug: "Luo/Luo Music Industry", title: "Luo Music Industry" },
        { slug: "Luo/Luo Dance Forms", title: "Luo Dance Forms" }
      ]
    },
    {
      id: "the-siaya-hiv-crisis",
      name: "The Siaya HIV Crisis",
      category: "Luo",
      description: "Why Siaya County has Kenya's highest HIV rate and what happened as a result",
      stops: [
        { slug: "Luo/HIV_AIDS in Luo Community", title: "HIV/AIDS in Luo Community" },
        { slug: "Luo/Luo and HIV AIDS", title: "Luo and HIV/AIDS" },
        { slug: "Counties/Siaya/Siaya HIV Crisis", title: "Siaya HIV Crisis" },
        { slug: "Counties/Kisumu/Kisumu HIV AIDS Crisis", title: "Kisumu and Nyanza: Kenya's HIV and AIDS Crisis Center" },
        { slug: "Counties/Siaya/Siaya Health", title: "Siaya Health" },
        { slug: "Counties/Homa Bay/Homa Bay HIV", title: "Homa Bay HIV" },
        { slug: "Luo/Luo Sexual Customs and Beliefs", title: "Sexual Customs and Beliefs" }
      ]
    },
    {
      id: "luo-christianity-the-legio-maria-church",
      name: "Luo Christianity: The Legio Maria Church",
      category: "Luo",
      description: "The breakaway Catholic movement that became one of Kenya's most distinctive religious traditions",
      stops: [
        { slug: "Luo/Legio Maria Deep Dive", title: "Legio Maria Deep Dive" },
        { slug: "Luo/Luo Independent Churches", title: "Luo Independent Churches" },
        { slug: "Luo/Luo Christianity", title: "Luo Christianity" },
        { slug: "Luo/Luo and the Catholic and Anglican Churches", title: "Catholic and Anglican Churches" },
        { slug: "Luo/Luo Religion and Cosmology", title: "Religion and Cosmology" },
        { slug: "Luo/Luo Traditional Governance", title: "Traditional Governance" }
      ]
    },
    {
      id: "nyanza-the-forgotten-province",
      name: "Nyanza: The Forgotten Province",
      category: "Luo",
      description: "How political marginalization shaped the economic underdevelopment of Luo Kenya",
      stops: [
        { slug: "Luo/Nyanza Province History", title: "Nyanza Province History" },
        { slug: "Counties/Kisumu/Kisumu Economy", title: "Kisumu's Economy: Fishing, Agriculture, and Regional Decline" },
        { slug: "Counties/Kisumu/Kisumu and Rwanda", title: "Kisumu and Rwanda: A Development Comparison" },
        { slug: "Counties/Siaya/Siaya County", title: "Siaya County" },
        { slug: "Counties/Homa Bay/Homa Bay County", title: "Homa Bay County" },
        { slug: "Luo/Luo and the Informal Economy", title: "Luo and the Informal Economy" },
        { slug: "Counties/Kisumu/Kisumu Youth Unemployment", title: "Kisumu Youth Unemployment: The Boda Boda Economy" },
        { slug: "Luo/Luo and Urban Economy", title: "Luo and Urban Economy" }
      ]
    },
    {
      id: "the-luo-and-the-kikuyu-a-political-history",
      name: "The Luo and the Kikuyu: A Political History",
      category: "Luo",
      description: "The alliance, the rupture, and the recurring pattern of Kenya's central political divide",
      stops: [
        { slug: "Luo/Luo-Kikuyu Political Relationship", title: "Luo-Kikuyu Political Relationship" },
        { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta and Oginga Odinga", title: "Kenyatta and Oginga Odinga" },
        { slug: "Cross-Ethnic/The Luo-Kikuyu Axis", title: "The Luo-Kikuyu Axis" },
        { slug: "Elections/2002 Election/2002 Election NARC Coalition", title: "2002 NARC Coalition" },
        { slug: "Elections/2007 Election/2007 Election Kibaki PNU", title: "2007 Election: Kibaki PNU" },
        { slug: "Elections/2007-08 Post-Election Violence/2007-08 Post-Election Violence", title: "2007-08 Post-Election Violence" },
        { slug: "Elections/2022 Election/2022 Election Mt Kenya Shift", title: "2022 Mt. Kenya Shift" },
        { slug: "Cross-Ethnic/Urban Kikuyu-Luo Marriages", title: "Urban Kikuyu-Luo Marriages" }
      ]
    },
    {
      id: "alego-home-of-the-obamas",
      name: "Alego: Home of the Obamas",
      category: "Luo",
      description: "Following the Obama Sr story from Kogelo to Harvard and back",
      stops: [
        { slug: "Counties/Siaya/Kogelo Village", title: "Kogelo Village" },
        { slug: "Luo/Barack Obama Sr", title: "Barack Obama Sr" },
        { slug: "Counties/Siaya/Barack Obama Sr and Siaya", title: "Barack Obama Sr and Siaya" },
        { slug: "Luo/Gem Constituency", title: "Gem Constituency" },
        { slug: "Counties/Siaya/Siaya County", title: "Siaya County" },
        { slug: "Counties/Siaya/Siaya and Obama Foundation", title: "Siaya and Obama Foundation" },
        { slug: "Luo/Luo Diaspora", title: "Luo Diaspora" }
      ]
    },
    {
      id: "the-dholuo-language",
      name: "The Dholuo Language",
      category: "Luo",
      description: "How language preservation became political resistance",
      stops: [
        { slug: "Luo/Dholuo Language", title: "Dholuo Language" },
        { slug: "Luo/Luo Language Deep Dive", title: "Luo Language Deep Dive" },
        { slug: "Luo/Luo Language", title: "Luo Language" },
        { slug: "Luo/Luo Oral Literature", title: "Oral Literature" },
        { slug: "Legacy/Language Politics", title: "Language Politics" },
        { slug: "Legacy/Language Hierarchies Kenya", title: "Language Hierarchies Kenya" }
      ]
    },
    {
      id: "lupita-nyongo-the-global-luo",
      name: "Lupita Nyong'o: The Global Luo",
      category: "Luo",
      description: "Kisumu to Yale to Hollywood and what it says about modern Kenya",
      stops: [
        { slug: "Luo/Luo Diaspora", title: "Luo Diaspora" },
        { slug: "Luo/Young Luo Identity", title: "Young Luo Identity" },
        { slug: "Luo/Luo Youth and Identity", title: "Luo Youth and Identity" },
        { slug: "Luo/Luo Futures", title: "Luo Futures" },
        { slug: "Counties/Kisumu/Kisumu", title: "Kisumu: Kenya's Third City and Luo Heartland" }
      ]
    },
  // === CAT4-CONSERVATION ===
  {
      id: "the-great-migration-following-the-wildebeest",
      name: "The Great Migration: Following the Wildebeest",
      category: "Conservation",
      description: "From the Serengeti to the Mara and back, the greatest wildlife spectacle on earth",
      stops: [
        { slug: "Conservation/The Great Migration", title: "The Great Migration" },
        { slug: "Conservation/Maasai Mara National Reserve", title: "Maasai Mara National Reserve" },
        { slug: "Counties/Narok/Maasai Mara National Reserve", title: "Maasai Mara in Narok County" },
        { slug: "Counties/Narok/Narok Wildlife", title: "Narok Wildlife" },
        { slug: "Conservation/Climate Change and Wildlife", title: "Climate Change and Wildlife" },
        { slug: "Conservation/Tourism Revenue and Communities", title: "Tourism Revenue and Communities" },
        { slug: "Counties/Narok/Narok Tourist Economy", title: "Narok Tourist Economy" }
      ]
    },
    {
      id: "ivory-wars-how-kenya-saved-its-elephants",
      name: "Ivory Wars: How Kenya Saved Its Elephants",
      category: "Conservation",
      description: "The poaching crisis of the 1970s-80s, the ivory burn, and the recovery",
      stops: [
        { slug: "Conservation/Kenya's Elephant Story", title: "Kenya's Elephant Story" },
        { slug: "Conservation/Poaching Crisis 1970s-1980s", title: "Poaching Crisis (1970s-1980s)" },
        { slug: "Conservation/The Ivory Poaching Crisis", title: "The Ivory Poaching Crisis" },
        { slug: "Conservation/The 1989 Ivory Burning", title: "The 1989 Ivory Burning" },
        { slug: "Conservation/Ivory Ban 1989", title: "Ivory Ban 1989" },
        { slug: "Conservation/Ivory Burns Kenya", title: "Ivory Burns Kenya" },
        { slug: "Conservation/Richard Leakey KWS", title: "Richard Leakey KWS" },
        { slug: "Conservation/Kenya Elephant Population", title: "Kenya Elephant Population" }
      ]
    },
    {
      id: "the-white-rhino-a-species-on-the-edge",
      name: "The White Rhino: A Species on the Edge",
      category: "Conservation",
      description: "From Ol Pejeta to the last two northern white rhinos on earth",
      stops: [
        { slug: "Conservation/Rhinoceros in Kenya", title: "Rhinoceros in Kenya" },
        { slug: "Conservation/Rhino Conservation Kenya", title: "Rhino Conservation Kenya" },
        { slug: "Counties/Laikipia/Ol Pejeta Conservancy", title: "Ol Pejeta Conservancy" },
        { slug: "Conservation/Ol Pejeta Conservancy", title: "Ol Pejeta Conservancy" },
        { slug: "Conservation/Poaching Crisis 1970s-1980s", title: "Poaching Crisis (1970s-1980s)" },
        { slug: "Conservation/Anti-Poaching Technology", title: "Anti-Poaching Technology" },
        { slug: "Counties/Laikipia/Laikipia Rhinos", title: "Laikipia Rhinos" }
      ]
    },
    {
      id: "richard-leakey-the-man-who-built-conservation",
      name: "Richard Leakey: The Man Who Built Conservation",
      category: "Conservation",
      description: "Paleontologist, KWS director, politician, survivor of a plane crash",
      stops: [
        { slug: "Conservation/Richard Leakey", title: "Richard Leakey" },
        { slug: "Conservation/Richard Leakey KWS", title: "Richard Leakey KWS" },
        { slug: "Conservation/Kenya Wildlife Service", title: "Kenya Wildlife Service" },
        { slug: "Conservation/The 1989 Ivory Burning", title: "The 1989 Ivory Burning" },
        { slug: "Conservation/Anti-Poaching Technology", title: "Anti-Poaching Technology" },
        { slug: "Conservation/Conservation and Corruption", title: "Conservation and Corruption" },
        { slug: "Conservation/Kenya Wildlife Service 2026", title: "Kenya Wildlife Service 2026" },
        { slug: "Conservation/Kenya as Global Conservation Model", title: "Kenya as Global Conservation Model" }
      ]
    },
    {
      id: "joy-and-george-adamson-born-free",
      name: "Joy and George Adamson: Born Free",
      category: "Conservation",
      description: "The lions of Meru, the book, the film, Joy's murder at Shaba, George's murder in Kora",
      stops: [
        { slug: "Conservation/Joy Adamson Born Free", title: "Joy Adamson Born Free" },
        { slug: "Counties/Meru/Meru National Park", title: "Meru National Park" },
        { slug: "Conservation/Meru National Park", title: "Meru National Park" },
        { slug: "Counties/Isiolo/Joy Adamson in Shaba", title: "Joy Adamson in Shaba" },
        { slug: "Counties/Isiolo/Shaba National Reserve", title: "Shaba National Reserve" },
        { slug: "Conservation/Lion Population Kenya", title: "Lion Population Kenya" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" },
        { slug: "Europeans/Joy and George Adamson", title: "Joy and George Adamson" }
      ]
    },
    {
      id: "the-maasai-mara-paradise-and-its-price",
      name: "The Maasai Mara: Paradise and Its Price",
      category: "Conservation",
      description: "How Kenya's most visited reserve works, who benefits, and what's at risk",
      stops: [
        { slug: "Conservation/Maasai Mara National Reserve", title: "Maasai Mara National Reserve" },
        { slug: "Counties/Narok/Maasai Mara National Reserve", title: "Maasai Mara in Narok County" },
        { slug: "Conservation/Maasai Mara Conservancies", title: "Maasai Mara Conservancies" },
        { slug: "Conservation/Tourism Revenue and Communities", title: "Tourism Revenue and Communities" },
        { slug: "Conservation/Human-Wildlife Conflict", title: "Human-Wildlife Conflict" },
        { slug: "Counties/Narok/Narok Community Conservancies", title: "Narok Community Conservancies" },
        { slug: "Counties/Narok/Narok Tourist Economy", title: "Narok Tourist Economy" }
      ]
    },
    {
      id: "mount-kenya-the-sacred-mountain",
      name: "Mount Kenya: The Sacred Mountain",
      category: "Conservation",
      description: "The geology, the ecology, the glaciers, the sacred significance to the Kikuyu",
      stops: [
        { slug: "Conservation/Mount Kenya National Park", title: "Mount Kenya National Park" },
        { slug: "Kikuyu/Mount Kenya and the Kikuyu", title: "Mount Kenya and the Kikuyu" },
        { slug: "Counties/Nyeri/Mount Kenya Nyeri Side", title: "Mount Kenya Nyeri Side" },
        { slug: "Counties/Kirinyaga/Mount Kenya Kirinyaga Side", title: "Mount Kenya Kirinyaga Side" },
        { slug: "Embu/Mount Kenya and the Embu", title: "Mount Kenya and the Embu" },
        { slug: "Conservation/Climate Change and Wildlife", title: "Climate Change and Wildlife" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" }
      ]
    },
    {
      id: "lake-turkana-the-jade-sea",
      name: "Lake Turkana: The Jade Sea",
      category: "Conservation",
      description: "The world's largest alkaline lake, the wind farm, the fossil sites, the fishing communities",
      stops: [
        { slug: "Counties/Turkana County/Lake Turkana", title: "Lake Turkana" },
        { slug: "Counties/Turkana County/Lake Turkana Wind Power", title: "Lake Turkana Wind Power" },
        { slug: "Counties/Turkana County/Koobi Fora", title: "Koobi Fora" },
        { slug: "Counties/Turkana County/Sibiloi National Park", title: "Sibiloi National Park" },
        { slug: "Counties/Turkana County/Turkana Boy", title: "Turkana Boy" },
        { slug: "Counties/Turkana County/Turkana Fishing", title: "Turkana Fishing" },
        { slug: "Counties/Turkana County/Cradle of Mankind Turkana", title: "Cradle of Mankind Turkana" },
        { slug: "Counties/Marsabit/Lake Turkana Shore", title: "Lake Turkana's Eastern Shore in Marsabit County" }
      ]
    },
    {
      id: "tsavo-lions-and-railway",
      name: "Tsavo: Lions and Railway",
      category: "Conservation",
      description: "The Man-Eaters of Tsavo, the Uganda Railway, and how a park bigger than Wales was born",
      stops: [
        { slug: "Conservation/Tsavo East and West", title: "Tsavo East and West" },
        { slug: "Asians/Tsavo Man-Eaters", title: "Tsavo Man-Eaters" },
        { slug: "Counties/Taita-Taveta/Tsavo Man-Eaters", title: "Tsavo Man-Eaters" },
        { slug: "Counties/Taita-Taveta/Tsavo East National Park", title: "Tsavo East National Park" },
        { slug: "Counties/Taita-Taveta/Tsavo West National Park", title: "Tsavo West National Park" },
        { slug: "Counties/Taita-Taveta/Uganda Railway Taita-Taveta", title: "Uganda Railway Taita-Taveta" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" }
      ]
    },
    {
      id: "hells-gate-walk-among-the-wildlife",
      name: "Hell's Gate: Walk Among the Wildlife",
      category: "Conservation",
      description: "Kenya's only walking national park and what happened to make it possible",
      stops: [
        { slug: "Conservation/Hell's Gate National Park", title: "Hell's Gate National Park" },
        { slug: "Counties/Nakuru/Hell's Gate National Park", title: "Hell's Gate National Park" },
        { slug: "Conservation/Kenya Wildlife Service", title: "Kenya Wildlife Service" },
        { slug: "Counties/Nakuru/Lake Naivasha", title: "Lake Naivasha" },
        { slug: "Conservation/Lake Naivasha Ecosystem", title: "Lake Naivasha Ecosystem" },
        { slug: "Counties/Nakuru/Nakuru Tourism", title: "Nakuru Tourism" }
      ]
    },
    {
      id: "the-rhino-ark",
      name: "The Rhino Ark",
      category: "Conservation",
      description: "Fencing Mount Kenya and the Aberdares to save what's left",
      stops: [
        { slug: "Conservation/Rhino Conservation Kenya", title: "Rhino Conservation Kenya" },
        { slug: "Conservation/Mount Kenya National Park", title: "Mount Kenya National Park" },
        { slug: "Conservation/Aberdare National Park", title: "Aberdare National Park" },
        { slug: "Conservation/Human-Wildlife Conflict", title: "Human-Wildlife Conflict" },
        { slug: "Conservation/Conservation Economics Kenya", title: "Conservation Economics Kenya" },
        { slug: "Conservation/Fortress Conservation Critique", title: "Fortress Conservation Critique" }
      ]
    },
    {
      id: "david-sheldricks-elephants",
      name: "David Sheldrick's Elephants",
      category: "Conservation",
      description: "The orphanage, the fostering, the rewilding: how Daphne Sheldrick built a global conservation model",
      stops: [
        { slug: "Conservation/David Sheldrick", title: "David Sheldrick" },
        { slug: "Conservation/Daphne Sheldrick", title: "Daphne Sheldrick" },
        { slug: "Conservation/Kenya's Elephant Story", title: "Kenya's Elephant Story" },
        { slug: "Conservation/Tsavo East and West", title: "Tsavo East and West" },
        { slug: "Conservation/Elephant Human Conflict", title: "Elephant Human Conflict" },
        { slug: "Conservation/Kenya Elephant Population", title: "Kenya Elephant Population" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" }
      ]
    },
    {
      id: "black-rhino-recovery",
      name: "Black Rhino Recovery",
      category: "Conservation",
      description: "From 300 survivors to 1,000 and counting",
      stops: [
        { slug: "Conservation/Rhinoceros in Kenya", title: "Rhinoceros in Kenya" },
        { slug: "Conservation/Rhino Conservation Kenya", title: "Rhino Conservation Kenya" },
        { slug: "Conservation/Poaching Crisis 1970s-1980s", title: "Poaching Crisis (1970s-1980s)" },
        { slug: "Conservation/Ol Pejeta Conservancy", title: "Ol Pejeta Conservancy" },
        { slug: "Counties/Laikipia/Lewa Wildlife Conservancy", title: "Lewa Wildlife Conservancy" },
        { slug: "Conservation/Lewa Wildlife Conservancy", title: "Lewa Wildlife Conservancy" }
      ]
    },
    {
      id: "the-community-conservancy-model",
      name: "The Community Conservancy Model",
      category: "Conservation",
      description: "How Northern Kenya saved its wildlife by empowering communities, not fencing them out",
      stops: [
        { slug: "Conservation/Community Conservancies Model", title: "Community Conservancies Model" },
        { slug: "Conservation/Community Conservation Model", title: "Community Conservation Model" },
        { slug: "Conservation/Northern Rangelands Trust", title: "Northern Rangelands Trust" },
        { slug: "Counties/Laikipia/Laikipia Wildlife Conservancies", title: "Laikipia Wildlife Conservancies" },
        { slug: "Conservation/Laikipia Conservancy Network", title: "Laikipia Conservancy Network" },
        { slug: "Conservation/Group Ranch Conservancies", title: "Group Ranch Conservancies" },
        { slug: "Conservation/Pastoralists and Conservation", title: "Pastoralists and Conservation" },
        { slug: "Conservation/Wildlife Conservancy Act 2013", title: "Wildlife Conservancy Act 2013" }
      ]
    },
    {
      id: "lake-nakuru-the-flamingo-mystery",
      name: "Lake Nakuru: The Flamingo Mystery",
      category: "Conservation",
      description: "The pink spectacle, the pollution, and the flamingos' disappearance",
      stops: [
        { slug: "Conservation/Lake Nakuru National Park", title: "Lake Nakuru National Park" },
        { slug: "Counties/Nakuru/Lake Nakuru", title: "Lake Nakuru" },
        { slug: "Conservation/Flamingo Ecology Rift Valley", title: "Flamingo Ecology Rift Valley" },
        { slug: "Conservation/Climate Change and Wildlife", title: "Climate Change and Wildlife" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" },
        { slug: "Counties/Nakuru/Nakuru Water", title: "Nakuru Water Supply and Crisis" }
      ]
    },
    {
      id: "grevys-zebra-racing-extinction",
      name: "Grevy's Zebra: Racing Extinction",
      category: "Conservation",
      description: "Kenya's most endangered large mammal and the race to save it",
      stops: [
        { slug: "Conservation/Grevy's Zebra", title: "Grevy's Zebra" },
        { slug: "Counties/Samburu County/Samburu National Reserve County", title: "Samburu National Reserve" },
        { slug: "Conservation/Samburu National Reserve", title: "Samburu National Reserve" },
        { slug: "Conservation/Northern Rangelands Trust", title: "Northern Rangelands Trust" },
        { slug: "Counties/Laikipia/Laikipia Wildlife Conservancies", title: "Laikipia Wildlife Conservancies" },
        { slug: "Conservation/Climate Change and Wildlife", title: "Climate Change and Wildlife" }
      ]
    },
    {
      id: "the-tana-river-red-colobus",
      name: "The Tana River Red Colobus",
      category: "Conservation",
      description: "Africa's most endangered monkey, found nowhere else on earth",
      stops: [
        { slug: "Counties/Tana River/Tana River Red Colobus", title: "Tana River Red Colobus" },
        { slug: "Counties/Tana River/Tana River Primate Reserve", title: "Tana River Primate Reserve" },
        { slug: "Counties/Tana River/Tana River (the river)", title: "Tana River" },
        { slug: "Conservation/Tana River", title: "Tana River" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" }
      ]
    },
    {
      id: "kenya-wildlife-service-the-kws-story",
      name: "Kenya Wildlife Service: The KWS Story",
      category: "Conservation",
      description: "From creation to crisis to recovery",
      stops: [
        { slug: "Conservation/Kenya Wildlife Service", title: "Kenya Wildlife Service" },
        { slug: "Conservation/Richard Leakey KWS", title: "Richard Leakey KWS" },
        { slug: "Conservation/Kenya Wildlife Service 2026", title: "Kenya Wildlife Service 2026" },
        { slug: "Conservation/The 1989 Ivory Burning", title: "The 1989 Ivory Burning" },
        { slug: "Conservation/Anti-Poaching Technology", title: "Anti-Poaching Technology" },
        { slug: "Conservation/Conservation and Corruption", title: "Conservation and Corruption" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" }
      ]
    },
    {
      id: "the-trophy-hunting-ban",
      name: "The Trophy Hunting Ban",
      category: "Conservation",
      description: "Kenya's 1977 ban and what happened next",
      stops: [
        { slug: "Conservation/Trophy Hunting Ban Kenya", title: "Trophy Hunting Ban Kenya" },
        { slug: "Conservation/Conservation Timeline Kenya", title: "Conservation Timeline Kenya" },
        { slug: "Conservation/Tourism Revenue and Communities", title: "Tourism Revenue and Communities" },
        { slug: "Conservation/Wildlife Tourism Revenue", title: "Wildlife Tourism Revenue" },
        { slug: "Conservation/Conservation Economics Kenya", title: "Conservation Economics Kenya" },
        { slug: "Conservation/Kenya as Global Conservation Model", title: "Kenya as Global Conservation Model" }
      ]
    },
    {
      id: "the-ivory-trade-politics",
      name: "The Ivory Trade Politics",
      category: "Conservation",
      description: "CITES, the international ivory trade, and Kenya's fight to keep the ban",
      stops: [
        { slug: "Conservation/Ivory Trade Politics", title: "Ivory Trade Politics" },
        { slug: "Conservation/Kenya and CITES", title: "Kenya and CITES" },
        { slug: "Conservation/The 1989 Ivory Burning", title: "The 1989 Ivory Burning" },
        { slug: "Conservation/Ivory Ban 1989", title: "Ivory Ban 1989" },
        { slug: "Conservation/Illegal Wildlife Trade", title: "Illegal Wildlife Trade" },
        { slug: "Conservation/21st Century Poaching", title: "21st Century Poaching" },
        { slug: "Conservation/Kenya as Global Conservation Model", title: "Kenya as Global Conservation Model" }
      ]
    },
  // === CAT5-MAASAI ===
  {
      id: "the-warrior-society",
      name: "The Warrior Society",
      category: "Maasai",
      description: "How the Maasai age-grade system transforms boys into moran warriors and warriors into elders",
      stops: [
        { slug: "Maasai/Maasai_Age_Sets", title: "The Age-Grade System" },
        { slug: "Maasai/Maasai_Birth_and_Childhood", title: "Birth and Early Years" },
        { slug: "Maasai/Maasai_Male_Initiation", title: "The Path to Moranhood" },
        { slug: "Maasai/The_Moran", title: "The Moran: Warriors and Icons" },
        { slug: "Maasai/Maasai_Warrior_Initiation", title: "Becoming a Warrior" },
        { slug: "Maasai/Eunoto_Ceremony", title: "Eunoto: Transition to Elderhood" },
        { slug: "Maasai/Maasai_Elders", title: "The Power of Elders" },
        { slug: "Maasai/The_Moran_in_Contemporary_Society", title: "Warriors in the Modern World" }
      ]
    },
    {
      id: "cattle-culture-and-identity",
      name: "Cattle Culture and Identity",
      category: "Maasai",
      description: "Why cattle are not just wealth but the sacred center of Maasai life and worldview",
      stops: [
        { slug: "Maasai/Maasai_Cattle_Culture", title: "Cattle as Sacred Gift" },
        { slug: "Maasai/Maasai_Pastoralism", title: "Transhumance and Ecological Knowledge" },
        { slug: "Maasai/Maasai_Religion", title: "Enkai and the Divine Gift of Cattle" },
        { slug: "Maasai/Maasai_Food_Insecurity_and_Drought", title: "When the Herds Fail" },
        { slug: "Maasai/Maasai_Cattle_Trade", title: "From Sacred to Commercial" },
        { slug: "Maasai/Maasai_and_Dairy_Industry", title: "The Modern Dairy Economy" },
        { slug: "Maasai/Water_and_Maasai_Lands", title: "Water Scarcity and Pastoral Survival" }
      ]
    },
    {
      id: "systematic-land-loss",
      name: "Systematic Land Loss",
      category: "Maasai",
      description: "From the 1904 colonial treaties through group ranches to today's existential land sales crisis",
      stops: [
        { slug: "Maasai/Pre-Colonial_Maasai_Territory", title: "The Original Maasai Lands" },
        { slug: "Maasai/The_1904_and_1911_Maasai_Treaties", title: "Colonial Dispossession Begins" },
        { slug: "Maasai/The_1913_Maasai_Lawsuit", title: "Legal Resistance and Defeat" },
        { slug: "Maasai/Maasai_Colonial_Resistance_and_Accommodation", title: "Navigating Colonial Rule" },
        { slug: "Maasai/The_Maasai_at_Independence", title: "What Independence Meant" },
        { slug: "Maasai/Post-Independence_Land_Issues", title: "New Government, Same Problems" },
        { slug: "Maasai/The_Group_Ranch_System", title: "Group Ranches: Promise and Failure" },
        { slug: "Maasai/Maasai_Land_Loss", title: "Ongoing Dispossession" },
        { slug: "Maasai/Maasai_Land_Sales_Crisis", title: "The Existential Threat of Land Sales" }
      ]
    },
    {
      id: "the-maasai-mara-ecosystem",
      name: "The Maasai Mara Ecosystem",
      category: "Maasai",
      description: "How ancestral Maasai land became Kenya's most famous national reserve and global wildlife spectacle",
      stops: [
        { slug: "Maasai/The_Maasai_Mara", title: "Ancestral Land Becomes Reserve" },
        { slug: "Conservation/Maasai Mara National Reserve", title: "The National Reserve" },
        { slug: "Maasai/The_Great_Migration", title: "Nature's Greatest Spectacle" },
        { slug: "Maasai/The_Mara_River", title: "The River Crossing" },
        { slug: "Maasai/Maasai_Mara_Ecosystem", title: "The Fragile Ecosystem" },
        { slug: "Conservation/Maasai Mara Conservancies", title: "Community Conservancies Emerge" },
        { slug: "Maasai/Mara_Tourism_Economy", title: "The Tourism Economy" },
        { slug: "Maasai/Maasai_Mara_Conservation_Challenges", title: "Conservation Under Pressure" }
      ]
    },
    {
      id: "maasai-women-builders-and-agents",
      name: "Maasai Women: Builders and Agents",
      category: "Maasai",
      description: "How Maasai women build homes, lead change, and challenge both tradition and outsider assumptions",
      stops: [
        { slug: "Maasai/Maasai_Women", title: "Women's Traditional Roles" },
        { slug: "Maasai/Maasai_Architecture", title: "Women Build the Enkaji" },
        { slug: "Maasai/Maasai_Marriage", title: "Marriage and Agency" },
        { slug: "Maasai/Maasai_Female_Circumcision", title: "FGM: Tradition and Resistance" },
        { slug: "Maasai/Maasai_Women_Activists", title: "Women Leading Change" },
        { slug: "Maasai/Maasai_Beadwork_Industry", title: "Economic Power Through Beadwork" },
        { slug: "Maasai/Maasai_Women_in_Business", title: "Women Entrepreneurs" },
        { slug: "Maasai/Maasai_Women_Leadership", title: "New Forms of Leadership" }
      ]
    },
    {
      id: "wildlife-coexistence-to-conflict",
      name: "Wildlife: From Coexistence to Conflict",
      category: "Maasai",
      description: "The disrupted partnership between Maasai pastoralists and East African wildlife",
      stops: [
        { slug: "Maasai/Wildlife_and_Maasai_Coexistence", title: "Traditional Coexistence" },
        { slug: "Maasai/Lion_Killing_and_Conservation", title: "Lions: From Rite to Crime" },
        { slug: "Maasai/Human-Elephant_Conflict", title: "When Elephants Raid Crops" },
        { slug: "Conservation/Human-Wildlife Conflict", title: "The Escalating Conflict" },
        { slug: "Conservation/Community Conservancies Model", title: "The Conservancy Solution" },
        { slug: "Maasai/Community_Conservancies", title: "A Possible Path Forward" },
        { slug: "Maasai/Community_Conservancies_Economics", title: "Making Conservation Pay" }
      ]
    },
    {
      id: "colonial-encounter-and-resistance",
      name: "Colonial Encounter and Resistance",
      category: "Maasai",
      description: "How the Maasai navigated British colonialism through both resistance and strategic accommodation",
      stops: [
        { slug: "Maasai/Pre-Colonial_Maasai_Territory", title: "Before the British" },
        { slug: "Maasai/Maasai_Colonial_Resistance_and_Accommodation", title: "Resistance and Pragmatism" },
        { slug: "Maasai/The_1904_and_1911_Maasai_Treaties", title: "The Treaties That Changed Everything" },
        { slug: "Maasai/The_1913_Maasai_Lawsuit", title: "Taking the British to Court" },
        { slug: "Maasai/Olonana_Lenana", title: "Lenana: Laibon and Negotiator" },
        { slug: "Maasai/The_Laibon", title: "Spiritual Authority in Crisis" },
        { slug: "Maasai/The_Maasai_at_Independence", title: "What 1963 Meant for the Maasai" }
      ]
    },
    {
      id: "the-maasai-brand",
      name: "The Maasai Brand",
      category: "Maasai",
      description: "How the Maasai became Kenya's global icon while remaining politically marginalized at home",
      stops: [
        { slug: "Maasai/Maasai_Brand", title: "The Global Icon" },
        { slug: "Maasai/Maasai_Cultural_Appropriation", title: "When the Brand Is Stolen" },
        { slug: "Maasai/Maasai_in_Global_Media", title: "How the World Sees the Maasai" },
        { slug: "Maasai/Maasai_and_Tourism", title: "Tourism: Reality vs Icon" },
        { slug: "Maasai/Maasai_Visual_Culture", title: "Aesthetics and Exchange" },
        { slug: "Maasai/Maasai_Beadwork", title: "Beadwork: Meaning and Commerce" },
        { slug: "Maasai/Maasai_and_Kenyan_State", title: "Icon Status, Limited Power" }
      ]
    },
    {
      id: "pastoralism-under-pressure",
      name: "Pastoralism Under Pressure",
      category: "Maasai",
      description: "How climate change, land sales, and development threaten the viability of Maasai pastoralism",
      stops: [
        { slug: "Maasai/Maasai_Pastoralism", title: "Traditional Pastoral Practice" },
        { slug: "Maasai/Water_and_Maasai_Lands", title: "Water: The Growing Crisis" },
        { slug: "Maasai/Maasai_and_Climate_Change", title: "Climate Change Impacts" },
        { slug: "Maasai/Maasai_Food_Insecurity_and_Drought", title: "Drought and Hunger" },
        { slug: "Maasai/Maasai_Land_Sales_Crisis", title: "When Pastoralists Sell Land" },
        { slug: "Conservation/Pastoralists and Conservation", title: "Conservation as Competitor" },
        { slug: "Maasai/Maasai_Futures", title: "Existential Questions for 2026" }
      ]
    },
    {
      id: "beadwork-economy",
      name: "The Beadwork Economy",
      category: "Maasai",
      description: "From women's art to commercial industry, how beadwork became both cultural expression and income",
      stops: [
        { slug: "Maasai/Maasai_Beadwork", title: "Color, Meaning, and Identity" },
        { slug: "Maasai/Maasai_Visual_Culture", title: "Aesthetic Traditions" },
        { slug: "Maasai/Maasai_Women", title: "Women as Artisans" },
        { slug: "Maasai/Maasai_Beadwork_Industry", title: "Commercialization and Markets" },
        { slug: "Maasai/Maasai_Women_in_Business", title: "Women's Economic Power" },
        { slug: "Maasai/Maasai_and_Tourism", title: "Tourism as Market" },
        { slug: "Maasai/Maasai_Cultural_Appropriation", title: "When Others Profit" }
      ]
    },
    {
      id: "maasai-across-borders",
      name: "Maasai Across Borders",
      category: "Maasai",
      description: "The Maasai community spans Kenya and Tanzania, with different colonial histories and modern fates",
      stops: [
        { slug: "Maasai/Pre-Colonial_Maasai_Territory", title: "One Territory, No Borders" },
        { slug: "Maasai/The_Maasai_in_Tanzania", title: "Cross-Border Communities" },
        { slug: "Maasai/Maasai_Sub-groups", title: "Internal Diversity" },
        { slug: "Maasai/The_1904_and_1911_Maasai_Treaties", title: "British Policies in Kenya" },
        { slug: "Maasai/The_Maasai_at_Independence", title: "Different Paths After Independence" },
        { slug: "Maasai/Maasai_Diaspora", title: "Global Maasai Networks" }
      ]
    },
    {
      id: "education-journey",
      name: "The Education Journey",
      category: "Maasai",
      description: "From resistance to enrollment, how Maasai attitudes toward formal education have shifted",
      stops: [
        { slug: "Maasai/Maasai_Education", title: "From Resistance to Enrollment" },
        { slug: "Maasai/Maasai_Birth_and_Childhood", title: "Traditional Socialization" },
        { slug: "Maasai/Maasai_Boarding_Schools", title: "Boarding Schools and Identity" },
        { slug: "Samburu/Samburu Girls Education", title: "Girls' Education Challenges" },
        { slug: "Maasai/Maasai_and_Education_Today", title: "Contemporary Educational Landscape" },
        { slug: "Maasai/Young_Maasai_Identity", title: "Youth Between Two Worlds" },
        { slug: "Maasai/Maasai_Intellectual_Life", title: "Emerging Maasai Intellectuals" }
      ]
    },
    {
      id: "the-laibon-system",
      name: "The Laibon System",
      category: "Maasai",
      description: "Spiritual authority, prophecy, and political power in Maasai society from past to present",
      stops: [
        { slug: "Maasai/The_Laibon", title: "Prophet and Spiritual Authority" },
        { slug: "Maasai/Maasai_Religion", title: "Enkai and the Sacred" },
        { slug: "Maasai/Olonana_Lenana", title: "Lenana: Laibon and Colonial Collaborator" },
        { slug: "Maasai/Maasai_Colonial_Resistance_and_Accommodation", title: "Laibons Under Colonialism" },
        { slug: "Samburu/Samburu Laibon", title: "The Samburu Laibon Tradition" },
        { slug: "Maasai/Maasai_and_Christianity", title: "Christianity Challenges Tradition" }
      ]
    },
    {
      id: "maasai-in-tourism",
      name: "Maasai in Tourism",
      category: "Maasai",
      description: "The complex reality of being Kenya's tourism icon, from cultural performances to conservation economics",
      stops: [
        { slug: "Maasai/Maasai_and_Tourism", title: "Icon, Spectacle, Reality" },
        { slug: "Maasai/Maasai_Brand", title: "The Maasai as Global Brand" },
        { slug: "Maasai/Mara_Tourism_Economy", title: "Tourism Revenue in the Mara" },
        { slug: "Conservation/Tourism Revenue and Communities", title: "Who Benefits from Tourism" },
        { slug: "Maasai/Maasai_Beadwork_Industry", title: "Selling Culture" },
        { slug: "Maasai/Maasai_in_Global_Media", title: "Global Media Representations" },
        { slug: "Maasai/Community_Conservancies_Economics", title: "Conservation as Economic Strategy" }
      ]
    },
    {
      id: "the-iloikop-wars",
      name: "The Iloikop Wars",
      category: "Maasai",
      description: "The 19th century civil wars between Maasai groups that weakened them before colonial conquest",
      stops: [
        { slug: "Maasai/Pre-Colonial_Maasai_Territory", title: "Before the Wars" },
        { slug: "Maasai/The_Iloikop_Wars", title: "19th Century Civil War" },
        { slug: "Maasai/The_Laibon", title: "Spiritual Authority in Conflict" },
        { slug: "Maasai/The_Rinderpest_Catastrophe", title: "Ecological Disaster Follows War" },
        { slug: "Maasai/Maasai_Sub-groups", title: "Internal Divisions That Persist" },
        { slug: "Maasai/Maasai_Colonial_Resistance_and_Accommodation", title: "Weakened Before the British" }
      ]
    },
    {
      id: "marriage-and-family",
      name: "Marriage and Family",
      category: "Maasai",
      description: "Arranged marriages, bridewealth, polygamy, and how Maasai family structures are changing",
      stops: [
        { slug: "Maasai/Maasai_Marriage", title: "Marriage Arrangements and Agency" },
        { slug: "Maasai/Maasai_Birth_and_Childhood", title: "Childhood and Socialization" },
        { slug: "Maasai/Samburu Early Marriage", title: "Early Marriage Pressures" },
        { slug: "Maasai/Maasai_Women", title: "Women's Roles in Family Life" },
        { slug: "Maasai/Maasai_Architecture", title: "Women Build the Home" },
        { slug: "Maasai/Young_Maasai_Identity", title: "Youth Challenging Traditions" },
        { slug: "Maasai/Maasai_Women_Activists", title: "Women Demanding Change" }
      ]
    },
    {
      id: "religion-and-cosmology",
      name: "Religion and Cosmology",
      category: "Maasai",
      description: "Enkai, the sacred in nature, and how Christianity is reshaping Maasai spiritual life",
      stops: [
        { slug: "Maasai/Maasai_Religion", title: "Enkai and the Sacred in Nature" },
        { slug: "Maasai/The_Laibon", title: "Spiritual Authority" },
        { slug: "Maasai/Maasai_Cattle_Culture", title: "Cattle as Divine Gift" },
        { slug: "Maasai/Maasai_Oral_Literature", title: "Sacred Stories and Proverbs" },
        { slug: "Maasai/Maasai_and_Christianity", title: "Christianity Arrives" },
        { slug: "Samburu/Samburu Religion", title: "Samburu Religious Continuity" },
        { slug: "Maasai/Maasai_and_Islam", title: "Islam and the Maasai" }
      ]
    },
    {
      id: "food-and-drought",
      name: "Food and Drought",
      category: "Maasai",
      description: "How drought, climate change, and food insecurity are forcing adaptation in Maasai diet and livelihood",
      stops: [
        { slug: "Maasai/Maasai_Cattle_Culture", title: "The Traditional Diet" },
        { slug: "Maasai/Maasai_Pastoralism", title: "Pastoral Mobility" },
        { slug: "Maasai/Water_and_Maasai_Lands", title: "Water Crisis Deepens" },
        { slug: "Maasai/Maasai_and_Climate_Change", title: "Climate Change Effects" },
        { slug: "Maasai/Maasai_Food_Insecurity_and_Drought", title: "Hunger and Adaptation" },
        { slug: "Maasai/Maasai_and_Dairy_Industry", title: "Commercializing Milk Production" },
        { slug: "Maasai/Maasai_Futures", title: "Future of Pastoralism" }
      ]
    },
    {
      id: "the-amboseli-story",
      name: "The Amboseli Story",
      category: "Maasai",
      description: "Elephants, long-term research, Maasai land rights, and the complex politics of Kenya's most researched park",
      stops: [
        { slug: "Maasai/Amboseli", title: "Maasai Land Becomes Park" },
        { slug: "Conservation/Amboseli National Park", title: "The National Park" },
        { slug: "Conservation/Cynthia Moss", title: "Decades of Elephant Research" },
        { slug: "Maasai/Human-Elephant_Conflict", title: "When Elephants Raid Farms" },
        { slug: "Counties/Kajiado/Kajiado Human-Wildlife Conflict", title: "Kajiado's Wildlife Challenge" },
        { slug: "Conservation/Community Conservancies Model", title: "Conservancies Around Amboseli" },
        { slug: "Counties/Kajiado/Kilimanjaro View from Amboseli", title: "The Iconic View" }
      ]
    },
    {
      id: "urban-maasai",
      name: "Urban Maasai",
      category: "Maasai",
      description: "From rural pastoralists to Nairobi security guards, how Maasai navigate urban life while maintaining identity",
      stops: [
        { slug: "Maasai/Maasai_Warriors_in_Modern_Economy", title: "From Moran to Wage Labor" },
        { slug: "Maasai/Maasai_Men_in_Security", title: "Security Work in the City" },
        { slug: "Maasai/Young_Maasai_Identity", title: "Between Cattle Culture and Modernity" },
        { slug: "Maasai/Maasai_Diaspora", title: "Maasai Diaspora Networks" },
        { slug: "Maasai/Maasai_Youth", title: "Maasai Youth Challenges" },
        { slug: "Maasai/Maasai_Intellectual_Life", title: "Emerging Urban Intellectuals" },
        { slug: "Maasai/Maasai_2050", title: "What Does 2050 Look Like" }
      ]
    },
  // === CAT6-MUSIC (merged from trail-staging) ===
  {
    id: "malaika-journey-global",
    name: "The Song That Crossed the World",
    category: "Music",
    description: "Malaika's journey from Kenya to Harry Belafonte's stage, disputed authorship, and the homecoming of Africa's most-covered song.",
    stops: [
      { slug: "Music/Fadhili Williams", title: "Fadhili Williams" },
      { slug: "Music/Harry Belafonte Kenya Connection", title: "Harry Belafonte's Cover" },
      { slug: "Music/East African Gramophone Records 1920s", title: "Early Recording Industry" },
      { slug: "Music/Music and Nation Building Kenya 1963-1978", title: "Independence Soundtrack" },
      { slug: "Music/Kenyan Music at International Festivals", title: "Global Stages" },
      { slug: "Swahili/Swahili Language", title: "Swahili as World Language" },
      { slug: "Music/Fadhili Williams Later Career", title: "What Happened After" }
    ]
  },
  {
    id: "mau-mau-forest-songs",
    name: "Sounds of the Mau Mau",
    category: "Music",
    description: "From Kikuyu initiation songs to coded resistance anthems in the forest, the music they sang when words were weapons.",
    stops: [
      { slug: "Kikuyu/Kikuyu Traditional Music", title: "Before the War" },
      { slug: "Music/Mau Mau Songs and the Forest", title: "Songs in the Forest" },
      { slug: "Kikuyu/Mau Mau Uprising", title: "The Uprising" },
      { slug: "Music/Music and Colonial Resistance", title: "Music as Resistance" },
      { slug: "Kikuyu/Dedan Kimathi", title: "Kimathi's Leadership" },
      { slug: "Music/Colonial Music Censorship Kenya", title: "Silencing Dissent" },
      { slug: "Kikuyu/Kenya Land and Freedom Army", title: "After the War" }
    ]
  },
  {
    id: "benga-electric-revolution",
    name: "Benga: Kenya's Electric Revolution",
    category: "Music",
    description: "How a Luo village music style with a guitar plugged in became the national soundtrack in one generation.",
    stops: [
      { slug: "Luo/Nyatiti", title: "The Luo Lyre" },
      { slug: "Music/Luo Benga Origins", title: "Birth of Benga" },
      { slug: "Music/Benga Music", title: "The Sound Defined" },
      { slug: "Music/George Ramogi", title: "George Ramogi" },
      { slug: "Music/D.O. Misiani", title: "D.O. Misiani" },
      { slug: "Music/Benga Guitar Technique", title: "The Guitar Innovation" },
      { slug: "Music/Luo Benga and Nyanza Identity", title: "Luo Identity in Song" },
      { slug: "Music/Benga and Political Protest", title: "Politics in Benga" }
    ]
  },
  {
    id: "misiani-voice-silenced",
    name: "The Voice They Tried to Silence",
    category: "Music",
    description: "D.O. Misiani's political songs, his clash with Moi's government, and how they tried to erase music that spoke too loudly.",
    stops: [
      { slug: "Music/D.O. Misiani", title: "The Musician" },
      { slug: "Music/Benga and Political Protest", title: "Songs Against Power" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi and the Media", title: "Moi's Media Control" },
      { slug: "Music/Moi Era Music and Censorship", title: "Censorship Under Moi" },
      { slug: "Luo/Luo Political History", title: "Luo Political Voice" },
      { slug: "Music/Music and the Multiparty Era", title: "The Second Liberation" },
      { slug: "Luo/Luo Music and Culture", title: "Luo Music Legacy" }
    ]
  },
  {
    id: "indian-ocean-taarab-journey",
    name: "A Thousand Years of Coastal Sound",
    category: "Music",
    description: "Arab traders, the oud arriving in Mombasa, Swahili taarab — how the Indian Ocean made music that is entirely Kenyan.",
    stops: [
      { slug: "Swahili/Indian Ocean Climate and the Coast", title: "The Ocean Highway" },
      { slug: "Swahili/Arab Settlement on the Coast", title: "Arab Settlement" },
      { slug: "Music/Arab Musical Influence on the Kenya Coast", title: "Musical Exchange" },
      { slug: "Music/Mombasa Taarab", title: "Taarab in Mombasa" },
      { slug: "Swahili/Mombasa", title: "Mombasa City" },
      { slug: "Music/East African Indian Ocean Taarab History", title: "Taarab's Evolution" },
      { slug: "Swahili/Swahili Civilization Overview", title: "Swahili Culture Today" }
    ]
  },
  {
    id: "maasai-cattle-camp-concert-hall",
    name: "From Cattle Camp to Concert Hall",
    category: "Music",
    description: "How Maasai vocal music — purely unaccompanied, rooted in warrior culture — reached world music stages without losing its soul.",
    stops: [
      { slug: "Maasai/Maasai_Music_and_Song", title: "Maasai Vocal Tradition" },
      { slug: "Maasai/Maasai_Warrior_Initiation", title: "Warrior Songs" },
      { slug: "Maasai/The_Moran", title: "The Moran" },
      { slug: "Music/Maasai Singing and Olaranyani", title: "Olaranyani Songs" },
      { slug: "Music/Kenyan Music at International Festivals", title: "International Stage" },
      { slug: "Maasai/Maasai_in_Global_Media", title: "Global Visibility" },
      { slug: "Maasai/Maasai_Youth", title: "Young Maasai Identity" }
    ]
  },
  {
    id: "drum-that-built-nation",
    name: "The Drum That Built a Nation",
    category: "Music",
    description: "Percussion traditions from 40+ communities converging into something called 'Kenyan music' — the rhythm of independence.",
    stops: [
      { slug: "Music/Musical Instruments of Kenya - Percussion", title: "Kenya's Drums" },
      { slug: "Luhya/Luhya Music Traditions", title: "Luhya Isukuti" },
      { slug: "Music/Luhya Isukuti Drum Music", title: "The Isukuti Drum" },
      { slug: "Kikuyu/Kikuyu Traditional Music", title: "Kikuyu Percussion" },
      { slug: "Music/Beni Ngoma Colonial Era", title: "Beni Dance" },
      { slug: "Music/Independence Anthems Kenya", title: "Independence Music" },
      { slug: "Music/Music and Nation Building Kenya 1963-1978", title: "Nation-Building Soundtrack" }
    ]
  },
  {
    id: "gengetone-streets-speak",
    name: "Gengetone: The Streets Speak",
    category: "Music",
    description: "Five broke kids from Nairobi's estates made a genre, got condemned by Parliament, played at State House, and changed Kenyan pop.",
    stops: [
      { slug: "Music/Gengetone Movement", title: "The Gengetone Wave" },
      { slug: "Cross-Ethnic/Sheng", title: "Sheng Language" },
      { slug: "Music/Sheng Language and Kenyan Music", title: "Sheng in Music" },
      { slug: "Music/Gengetone and Social Commentary", title: "What They Said" },
      { slug: "Cross-Ethnic/TikTok Kenya", title: "TikTok and Gengetone" },
      { slug: "Music/YouTube and Kenyan Music", title: "YouTube Distribution" },
      { slug: "Music/Music and Religion Kenya Contemporary", title: "Gospel vs Gengetone" }
    ]
  },
  {
    id: "gospel-takeover",
    name: "Gospel Takeover",
    category: "Music",
    description: "How Christian music went from mission hymnals to Kenya's dominant popular genre in 40 years.",
    stops: [
      { slug: "Music/Church Music Africanization", title: "Africanizing Hymns" },
      { slug: "Music/Mission Church Choirs Kenya", title: "Mission Choirs" },
      { slug: "Music/African Gospel Music Kenya", title: "Gospel Boom" },
      { slug: "Music/Kenyan Gospel Music Boom", title: "The Gospel Industry" },
      { slug: "Music/Praise and Worship Movement Kenya", title: "Praise & Worship" },
      { slug: "Music/Female Gospel Artists Kenya", title: "Gospel Queens" },
      { slug: "Music/Gospel Music and Kenyan Politics", title: "Gospel and Power" }
    ]
  },
  {
    id: "nyatiti-player-president",
    name: "The Nyatiti Player and the President",
    category: "Music",
    description: "The Luo lyre's journey from ritual instrument to Ayub Ogada's global career — what it means in a modern Luo household.",
    stops: [
      { slug: "Luo/Nyatiti", title: "The Luo Lyre" },
      { slug: "Music/The Nyatiti", title: "The Instrument" },
      { slug: "Music/Musical Instruments of Kenya - Strings", title: "Kenya's String Instruments" },
      { slug: "Music/Ayub Ogada", title: "Ayub Ogada" },
      { slug: "Luo/Luo Music Industry", title: "Luo Music Today" },
      { slug: "Music/Kenyan Music at International Festivals", title: "Global Recognition" },
      { slug: "Luo/Young Luo Identity", title: "Young Luo and Tradition" }
    ]
  },
  {
    id: "mugithi-nights-kikuyu-bar",
    name: "Mugithi Nights: The Bar Where Kenya Talks",
    category: "Music",
    description: "The Kikuyu roadside music tradition that is more political than any parliament — John De Mathew's life and death.",
    stops: [
      { slug: "Music/Kikuyu Mugithi Music", title: "Mugithi Music" },
      { slug: "Music/Mugithi Music Origins", title: "Birth of Mugithi" },
      { slug: "Music/John De Mathew", title: "John De Mathew" },
      { slug: "Kikuyu/Kikuyu and Real Estate", title: "Kikuyu Roadside Economy" },
      { slug: "Music/Joseph Kamaru", title: "Joseph Kamaru" },
      { slug: "Music/Kikuyu Popular Music 1960s-1970s", title: "Kikuyu Pop History" },
      { slug: "Kikuyu/Young Kikuyu Identity", title: "Young Kikuyu Today" }
    ]
  },
  {
    id: "piracy-killed-star",
    name: "Piracy Killed the Star",
    category: "Music",
    description: "How cassette piracy in the 1980s-90s destroyed the economics of Kenyan music and why it still echoes today.",
    stops: [
      { slug: "Music/Recording Industry Kenya 1960s-1970s", title: "Golden Age of Recording" },
      { slug: "Music/Piracy and the Kenyan Music Industry", title: "The Piracy Plague" },
      { slug: "Music/Music Copyright Society Kenya MCSK", title: "Copyright Wars" },
      { slug: "Music/Copyright Act 1966 Kenya", title: "The Law" },
      { slug: "Music/Recording Studios Kenya 1980s-1990s", title: "Studios Struggle" },
      { slug: "Music/Music Streaming and Kenyan Artists", title: "The Streaming Era" },
      { slug: "Music/The Future of Kenyan Music", title: "What Comes Next" }
    ]
  },
  {
    id: "maasai-women-song-world",
    name: "Beadwork and Song: Maasai Women's World",
    category: "Music",
    description: "Maasai women's music traditions run parallel to men's — what they sing in ceremonies that men never attend.",
    stops: [
      { slug: "Maasai/Maasai_Music_and_Song", title: "Maasai Song Traditions" },
      { slug: "Maasai/Maasai_Women", title: "Maasai Women" },
      { slug: "Maasai/Maasai_Women_Leadership", title: "Women's Leadership" },
      { slug: "Maasai/Maasai_Beadwork", title: "Beadwork Culture" },
      { slug: "Music/Women's Music Traditions Kenya", title: "Women's Songs Across Kenya" },
      { slug: "Maasai/Maasai_Marriage", title: "Marriage Ceremonies" },
      { slug: "Maasai/Maasai_Women_Activists", title: "Contemporary Voices" }
    ]
  },
  {
    id: "fm-radio-revolution",
    name: "FM Radio Changed Everything",
    category: "Music",
    description: "Capital FM arrives in 1996, the playlist wars begin, and two stations rewire what Kenyans listen to within a decade.",
    stops: [
      { slug: "Music/Radio Voice of Kenya Origins", title: "VOK Monopoly" },
      { slug: "Music/FM Radio Revolution Kenya 1990s", title: "FM Radio Arrives" },
      { slug: "Music/Radio DJs as Cultural Gatekeepers Kenya", title: "The DJs" },
      { slug: "Music/Kenya Broadcasting Corporation Music", title: "KBC Music Programming" },
      { slug: "Elections/1992 Election/1992 Election Media Freedom", title: "Media Liberalization" },
      { slug: "Music/Music and Kenyan Radio 1960s-1970s", title: "Before FM" },
      { slug: "Music/The Future of Kenyan Music", title: "Radio Today" }
    ]
  },
  {
    id: "sauti-sol-global-arc",
    name: "Sauti Sol: How Four Boys from Nairobi Went Global",
    category: "Music",
    description: "The full arc from school choir to Grammy nomination to African pop royalty.",
    stops: [
      { slug: "Music/Sauti Sol", title: "Sauti Sol" },
      { slug: "Music/Kenyan Music Videos Origins", title: "Music Video Era" },
      { slug: "Music/Music Videos and Visual Culture Kenya", title: "Visual Culture" },
      { slug: "Music/Kenyan Music at International Festivals", title: "International Festivals" },
      { slug: "Music/Music Award Shows Kenya", title: "Award Shows" },
      { slug: "Music/Social Media and Music Kenya", title: "Social Media Strategy" },
      { slug: "Music/Afrobeats Influence on Kenyan Music", title: "Afrobeats Exchange" }
    ]
  },
  {
    id: "taarab-queens-swahili-coast",
    name: "The Taarab Queens",
    category: "Music",
    description: "How women performers dominated Swahili coastal music while navigating a conservative society.",
    stops: [
      { slug: "Music/Mombasa Taarab", title: "Mombasa Taarab" },
      { slug: "Music/East African Indian Ocean Taarab History", title: "Taarab History" },
      { slug: "Music/Women in Kenyan Music 1960s-1970s", title: "Women Performers" },
      { slug: "Swahili/Islam on the Swahili Coast", title: "Islam and Performance" },
      { slug: "Music/Women Performers Colonial Kenya", title: "Colonial Era" },
      { slug: "Swahili/Swahili Coast Tourism", title: "Tourism Economy" },
      { slug: "Music/Music and Gender Kenya Contemporary", title: "Gender Today" }
    ]
  },
  {
    id: "music-under-moi",
    name: "Music Under Moi",
    category: "Music",
    description: "Which songs got banned, which musicians were jailed or exiled, how others found coded ways to criticize power.",
    stops: [
      { slug: "Music/Moi Era Music and Censorship", title: "Moi's Censorship" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi and the Media", title: "Media Control" },
      { slug: "Music/Benga and Political Protest", title: "Benga's Coded Protest" },
      { slug: "Music/D.O. Misiani", title: "Misiani's Exile" },
      { slug: "Music/Music and the 1982 Coup Kenya", title: "The 1982 Coup" },
      { slug: "Presidencies/Daniel arap Moi Presidency/Moi Detention Policy", title: "Detention State" },
      { slug: "Music/Music and the Multiparty Era", title: "Liberation Music" }
    ]
  },
  {
    id: "isukuti-unesco-rescue",
    name: "Isukuti: The Drum UNESCO Almost Lost",
    category: "Music",
    description: "The Luhya Isukuti drum tradition, why it was nearly extinct, the effort to save it.",
    stops: [
      { slug: "Music/Luhya Isukuti Drum Music", title: "The Isukuti Drum" },
      { slug: "Luhya/Luhya Music Traditions", title: "Luhya Music" },
      { slug: "Music/Musical Instruments of Kenya - Percussion", title: "Kenya's Drums" },
      { slug: "Music/Music and Pre-Christian Religion Kenya", title: "Pre-Christian Rituals" },
      { slug: "Luhya/Luhya Traditional Religion", title: "Luhya Religion" },
      { slug: "Music/Ketebul Music and Preservation", title: "Preservation Efforts" },
      { slug: "Luhya/Luhya Youth and Identity", title: "Young Luhya and Tradition" }
    ]
  },
  {
    id: "sheng-street-language-pop",
    name: "Sheng Speaks: How a Street Language Became Pop Culture",
    category: "Music",
    description: "Sheng's journey from Eastlands slang to Genge's lingua franca to mainstream Kenyan identity.",
    stops: [
      { slug: "Cross-Ethnic/Sheng", title: "Sheng Language" },
      { slug: "Cross-Ethnic/Sheng Evolution", title: "Sheng Evolution" },
      { slug: "Music/Sheng Language and Kenyan Music", title: "Sheng in Music" },
      { slug: "Music/Genge Music Origins", title: "Genge Origins" },
      { slug: "Music/Gengetone Movement", title: "Gengetone" },
      { slug: "Cross-Ethnic/Eastlands Nairobi", title: "Eastlands Culture" },
      { slug: "Cross-Ethnic/Gen Z Kenya", title: "Gen Z and Sheng" }
    ]
  },
  {
    id: "independence-songbook",
    name: "The Independence Songbook",
    category: "Music",
    description: "The music written for Kenya's independence, the national anthem story, what played at Uhuru Gardens on December 12, 1963.",
    stops: [
      { slug: "Music/Independence Anthems Kenya", title: "Independence Songs" },
      { slug: "Music/National Anthem Kenya Creation", title: "National Anthem" },
      { slug: "Elections/1963 Election/1963 Election", title: "1963 Election" },
      { slug: "Music/Kenyan Independence Music Scene Overview", title: "Music Scene 1963" },
      { slug: "Music/Music and Nation Building Kenya 1963-1978", title: "Nation-Building Music" },
      { slug: "Presidencies/Jomo Kenyatta Presidency/Kenyatta Harambee Policy", title: "Harambee Era" },
      { slug: "Music/Dance Bands of Post-WWII Kenya", title: "Dance Bands" }
    ]
  },
]

// Normalize slugs the same way Quartz does: spaces -> hyphens
function normalizeSlug(s: string): string {
  return s
    .split("/")
    .map((segment) => segment.replace(/\s/g, "-").replace(/&/g, "-and-").replace(/%/g, "-percent"))
    .join("/")
}

export function stopHref(stop: TrailStop): string {
  return "/" + normalizeSlug(stop.slug)
}

// Index: slug -> list of trails containing it (and position)
export const slugToTrails: Record<string, { trail: Trail; position: number }[]> = {}
trails.forEach(trail => {
  trail.stops.forEach((stop, i) => {
    const key = normalizeSlug(stop.slug)
    if (!slugToTrails[key]) slugToTrails[key] = []
    slugToTrails[key].push({ trail, position: i })
  })
})
