// 23 North America + 12 South America + 14 Oceania countries from the PDF
module.exports = [
  // ================= NORTH AMERICA (23) =================
  {
    id: "ATG", code: "AG", name: "Antigua and Barbuda", capital: "St. John's", region: "North America",
    population: "94K", currency: "XCD ($)", lat: 17.0608, lon: -61.7964,
    about: "Antigua and Barbuda was an early pioneer in digital gaming regulation and provides subsea fiber connectivity through St. John's.",
    leader: "Antigua FinTech Net", leaderType: "product",
    states: [
      { id: "AG-04", name: "Saint John (Capital Tech)", code: "04", capital: "St. John's", leader: "Antigua FinTech Net", pop: "32K" },
      { id: "AG-03", name: "Saint George Parish", code: "03", capital: "Piggots", leader: "VC Bird Aero Hub", pop: "8K" },
      { id: "AG-05", name: "Saint Mary Parish", code: "05", capital: "Bolans", leader: "Jolly Harbour Marine Net", pop: "7K" },
      { id: "AG-10", name: "Barbuda Island Council", code: "10", capital: "Codrington", leader: "Codrington Green Energy", pop: "1.8K" }
    ]
  },
  {
    id: "BHS", code: "BS", name: "Bahamas", capital: "Nassau", region: "North America",
    population: "410K", currency: "BSD ($)", lat: 25.0343, lon: -77.3963,
    about: "The Bahamas created the Sand Dollar, the world's very first nationwide Central Bank Digital Currency (CBDC), launched in Nassau.",
    leader: "Sand Dollar CBDC", leaderType: "product",
    states: [
      { id: "BS-NP", name: "New Providence (Nassau Sand Dollar)", code: "NP", capital: "Nassau", leader: "Sand Dollar CBDC", pop: "280K" },
      { id: "BS-FP", name: "Grand Bahama (Freeport Tech Port)", code: "FP", capital: "Freeport", leader: "Freeport Maritime AI", pop: "55K" },
      { id: "BS-AB", name: "Abaco Islands", code: "AB", capital: "Marsh Harbour", leader: "Marsh Harbour Solar Link", pop: "18K" },
      { id: "BS-EX", name: "Exuma and Cays", code: "EX", capital: "George Town", leader: "Exuma Marine BioTech", pop: "8K" }
    ]
  },
  {
    id: "BRB", code: "BB", name: "Barbados", capital: "Bridgetown", region: "North America",
    population: "282K", currency: "BBD ($)", lat: 13.1939, lon: -59.5432,
    about: "Barbados pioneered the Barbados Welcome Stamp digital nomad visa, the Bridgetown Initiative, and fintech pioneer Bitt.",
    leader: "Bitt Global", leaderType: "product",
    states: [
      { id: "BB-08", name: "Saint Michael (Bridgetown Hub)", code: "08", capital: "Bridgetown", leader: "Bitt Global", pop: "90K" },
      { id: "BB-02", name: "Christ Church (Grantley Adams)", code: "02", capital: "Oistins", leader: "Grantley Adams AeroTech", pop: "55K" },
      { id: "BB-07", name: "Saint James (Platinum Coast)", code: "07", capital: "Holetown", leader: "Platinum Coast Nomads", pop: "29K" },
      { id: "BB-09", name: "Saint Peter (Speightstown)", code: "09", capital: "Speightstown", leader: "Northern Innovation Hub", pop: "12K" }
    ]
  },
  {
    id: "BLZ", code: "BZ", name: "Belize", capital: "Belmopan", region: "North America",
    population: "405K", currency: "BZD ($)", lat: 17.1899, lon: -88.4976,
    about: "Belize connects the Caribbean and Central America, advancing barrier reef conservation telemetry and e-governance in Belmopan and Belize City.",
    leader: "Belize DigiNet", leaderType: "product",
    states: [
      { id: "BZ-BZ", name: "Belize District (Belize City)", code: "BZ", capital: "Belize City", leader: "Belize DigiNet", pop: "125K" },
      { id: "BZ-CY", name: "Cayo (Belmopan Capital / San Ignacio)", code: "CY", capital: "Belmopan", leader: "Belmopan GovCloud", pop: "100K" },
      { id: "BZ-SC", name: "Stann Creek (Hopkins / Placencia)", code: "SC", capital: "Dangriga", leader: "Reef Guardian Tech", pop: "45K" },
      { id: "BZ-OW", name: "Orange Walk District", code: "OW", capital: "Orange Walk", leader: "Sugar City AgroTech", pop: "54K" }
    ]
  },
  {
    id: "CAN", code: "CA", name: "Canada", capital: "Ottawa", region: "North America",
    population: "40.1M", currency: "CAD ($)", lat: 56.1304, lon: -106.3468,
    about: "Canada is a world pioneer in artificial intelligence (Geoffrey Hinton, Yoshua Bengio), quantum computing (D-Wave), and e-commerce (Shopify) across Toronto, Montreal, Waterloo, and Vancouver.",
    leader: "Shopify Core", leaderType: "product",
    states: [
      { id: "CA-ON", name: "Ontario (Toronto-Waterloo Tech Corridor)", code: "ON", capital: "Toronto", leader: "Shopify Core", pop: "15.6M" },
      { id: "CA-QC", name: "Quebec (Montreal AI & Mila)", code: "QC", capital: "Quebec City", leader: "Mila AI Institute", pop: "8.9M" },
      { id: "CA-BC", name: "British Columbia (Vancouver Silicon Rainforest)", code: "BC", capital: "Victoria", leader: "Slack Canadian Roots", pop: "5.5M" },
      { id: "CA-AB", name: "Alberta (Calgary / Edmonton Amii)", code: "AB", capital: "Edmonton", leader: "Amii AI Labs", pop: "4.7M" },
      { id: "CA-MB", name: "Manitoba (Winnipeg AgTech)", code: "MB", capital: "Winnipeg", leader: "Winnipeg Prairie Tech", pop: "1.4M" },
      { id: "CA-NS", name: "Nova Scotia (Halifax Ocean Tech)", code: "NS", capital: "Halifax", leader: "COVE Ocean Tech", pop: "1.0M" }
    ]
  },
  {
    id: "CRI", code: "CR", name: "Costa Rica", capital: "San José", region: "North America",
    population: "5.2M", currency: "CRC (₡)", lat: 9.7489, lon: -83.7534,
    about: "Costa Rica is the Silicon Valley of Central America, hosting Intel's mega semiconductor design center and global medical device engineering hubs in San José.",
    leader: "Intel Costa Rica", leaderType: "product",
    states: [
      { id: "CR-SJ", name: "San José (Capital Tech Core)", code: "SJ", capital: "San José", leader: "Intel Costa Rica", pop: "1.6M" },
      { id: "CR-A", name: "Alajuela (Coyol Free Zone)", code: "A", capital: "Alajuela", leader: "Coyol MedTech Hub", pop: "1.0M" },
      { id: "CR-H", name: "Heredia (Global Services Hub)", code: "H", capital: "Heredia", leader: "America Free Zone AFZ", pop: "530K" },
      { id: "CR-C", name: "Cartago (Tech Institute ITCR)", code: "C", capital: "Cartago", leader: "TEC Innovation Campus", pop: "540K" },
      { id: "CR-G", name: "Guanacaste (Digital Nomads & Space)", code: "G", capital: "Liberia", leader: "Ad Astra Rocket Tech", pop: "400K" }
    ]
  },
  {
    id: "CUB", code: "CU", name: "Cuba", capital: "Havana", region: "North America",
    population: "11.2M", currency: "CUP ($)", lat: 21.5218, lon: -77.7812,
    about: "Cuba is recognized for its medical biotechnology institutes (BioCubaFarma) and the University of Information Sciences (UCI) in Havana.",
    leader: "UCI Habana", leaderType: "product",
    states: [
      { id: "CU-03", name: "Havana (UCI Technology Campus)", code: "03", capital: "Havana", leader: "UCI Habana", pop: "2.1M" },
      { id: "CU-13", name: "Santiago de Cuba", code: "13", capital: "Santiago de Cuba", leader: "Oriente Tech Lab", pop: "1.0M" },
      { id: "CU-05", name: "Villa Clara (Santa Clara UCLV)", code: "05", capital: "Santa Clara", leader: "UCLV Computational Labs", pop: "770K" },
      { id: "CU-04", name: "Matanzas (Varadero Coastal Link)", code: "04", capital: "Matanzas", leader: "Yumuri Coastal Tech", pop: "715K" }
    ]
  },
  {
    id: "DMA", code: "DM", name: "Dominica", capital: "Roseau", region: "North America",
    population: "72K", currency: "XCD ($)", lat: 15.415, lon: -61.371,
    about: "The Commonwealth of Dominica is building the world's first climate-resilient nation with geothermal telemetry and digital identity tokens.",
    leader: "Dominica Crypto Token", leaderType: "product",
    states: [
      { id: "DM-04", name: "Saint George (Roseau Capital)", code: "04", capital: "Roseau", leader: "Dominica Crypto Token", pop: "21K" },
      { id: "DM-10", name: "Saint Paul (Canefield Airport Tech)", code: "10", capital: "Pont Cassé", leader: "Canefield Logistics", pop: "10K" },
      { id: "DM-02", name: "Saint Andrew (Portsmouth Hub)", code: "02", capital: "Portsmouth", leader: "Ross Tech Legacy", pop: "10K" },
      { id: "DM-08", name: "Saint Patrick", code: "08", capital: "Berekua", leader: "South Coast Geothermal", pop: "8K" }
    ]
  },
  {
    id: "DOM", code: "DO", name: "Dominican Republic", capital: "Santo Domingo", region: "North America",
    population: "11.3M", currency: "DOP (RD$)", lat: 18.7357, lon: -70.1627,
    about: "The Dominican Republic is the Caribbean's fastest-growing economy, home to Cybernetic Park of Santo Domingo (PCSD) and fintech corridor.",
    leader: "PCSD Silicon Park", leaderType: "product",
    states: [
      { id: "DOM-01", name: "Distrito Nacional (Santo Domingo)", code: "01", capital: "Santo Domingo", leader: "PCSD Silicon Park", pop: "1.4M" },
      { id: "DOM-31", name: "Santiago (Santiago Tech Valley)", code: "31", capital: "Santiago", leader: "Santiago Innovation Hub", pop: "1.1M" },
      { id: "DOM-11", name: "La Altagracia (Punta Cana Smart Resort)", code: "11", capital: "Higüey", leader: "Punta Cana Aviation AI", pop: "440K" },
      { id: "DOM-23", name: "Puerto Plata (North Coast Nomads)", code: "23", capital: "Puerto Plata", leader: "Cabarete Nomad Village", pop: "340K" }
    ]
  },
  {
    id: "SLV", code: "SV", name: "El Salvador", capital: "San Salvador", region: "North America",
    population: "6.3M", currency: "USD ($)", lat: 13.7942, lon: -88.8965,
    about: "El Salvador made history as the first sovereign nation to adopt Bitcoin as legal tender, pioneering zero tech taxes and Bitcoin Beach in El Zonte.",
    leader: "Chivo Wallet Core", leaderType: "product",
    states: [
      { id: "SV-SS", name: "San Salvador (Capital FinTech)", code: "SS", capital: "San Salvador", leader: "Chivo Wallet Core", pop: "1.8M" },
      { id: "SV-LI", name: "La Libertad (Bitcoin Beach El Zonte)", code: "LI", capital: "Santa Tecla", leader: "Bitcoin Beach Zonte", pop: "850K" },
      { id: "SV-SA", name: "Santa Ana Department", code: "SA", capital: "Santa Ana", leader: "Western Tech Center", pop: "600K" },
      { id: "SV-SM", name: "San Miguel (Eastern Hub)", code: "SM", capital: "San Miguel", leader: "San Miguel Commerce Net", pop: "510K" }
    ]
  },
  {
    id: "GRD", code: "GD", name: "Grenada", capital: "St. George's", region: "North America",
    population: "125K", currency: "XCD ($)", lat: 12.1165, lon: -61.679,
    about: "Grenada, the Spice Isle, hosts St. George's University and is expanding digital blue economy telemetry and regional undersea cable landings.",
    leader: "Spicenet Cyber", leaderType: "product",
    states: [
      { id: "GD-01", name: "Saint George (St. George's / SGU)", code: "01", capital: "St. George's", leader: "Spicenet Cyber", pop: "40K" },
      { id: "GD-02", name: "Saint Andrew (Grenville Hub)", code: "02", capital: "Grenville", leader: "Grenville AgroTech", pop: "28K" },
      { id: "GD-03", name: "Saint David Parish", code: "03", capital: "St. David's", leader: "Virgin Valley EcoNet", pop: "13K" },
      { id: "GD-10", name: "Carriacou and Petite Martinique", code: "10", capital: "Hillsborough", leader: "Sister Isles Satellite", pop: "10K" }
    ]
  },
  {
    id: "GTM", code: "GT", name: "Guatemala", capital: "Guatemala City", region: "North America",
    population: "18.1M", currency: "GTQ (Q)", lat: 15.7835, lon: -90.2308,
    about: "Guatemala is home to Cuatro Grados Norte, Central America's first dedicated technology and cultural district in Guatemala City.",
    leader: "Cuatro Grados Norte", leaderType: "product",
    states: [
      { id: "GT-GU", name: "Guatemala Department (Cuatro Grados Norte)", code: "GU", capital: "Guatemala City", leader: "Cuatro Grados Norte", pop: "3.5M" },
      { id: "GT-QZ", name: "Quetzaltenango (Xela Tech)", code: "QZ", capital: "Quetzaltenango", leader: "Xela Highlands Code", pop: "900K" },
      { id: "GT-SA", name: "Sacatepéquez (Antigua Nomad Center)", code: "SA", capital: "Antigua Guatemala", leader: "Antigua Digital Nomads", pop: "390K" },
      { id: "GT-ES", name: "Escuintla (Pacific Logistics Corridor)", code: "ES", capital: "Escuintla", leader: "Puerto Quetzal Tech", pop: "800K" }
    ]
  },
  {
    id: "HTI", code: "HT", name: "Haiti", capital: "Port-au-Prince", region: "North America",
    population: "11.7M", currency: "HTG (G)", lat: 18.9712, lon: -72.2852,
    about: "Haiti relies heavily on mobile money networks like MonCash, with software development communities in Port-au-Prince and Cap-Haïtien.",
    leader: "MonCash Core", leaderType: "product",
    states: [
      { id: "HT-OU", name: "Ouest (Port-au-Prince)", code: "OU", capital: "Port-au-Prince", leader: "MonCash Core", pop: "4.2M" },
      { id: "HT-ND", name: "Nord (Cap-Haïtien)", code: "ND", capital: "Cap-Haïtien", leader: "Cap-Haïtien Heritage Tech", pop: "1.1M" },
      { id: "HT-AR", name: "Artibonite (Gonaïves)", code: "AR", capital: "Gonaïves", leader: "Artibonite Valley Agro", pop: "1.8M" },
      { id: "HT-SD", name: "Sud (Les Cayes)", code: "SD", capital: "Les Cayes", leader: "Southern Coast Net", pop: "800K" }
    ]
  },
  {
    id: "HND", code: "HN", name: "Honduras", capital: "Tegucigalpa", region: "North America",
    population: "10.6M", currency: "HNL (L)", lat: 15.2, lon: -86.2419,
    about: "Honduras is famous for Próspera ZEDE in Roatán (a charter city with common law regulations and crypto integration) and San Pedro Sula industrial tech.",
    leader: "Próspera ZEDE", leaderType: "product",
    states: [
      { id: "HN-IB", name: "Bay Islands (Roatán / Próspera ZEDE)", code: "IB", capital: "Coxen Hole", leader: "Próspera ZEDE", pop: "75K" },
      { id: "HN-FM", name: "Francisco Morazán (Tegucigalpa)", code: "FM", capital: "Tegucigalpa", leader: "Tegucigalpa GovTech", pop: "1.7M" },
      { id: "HN-CR", name: "Cortés (San Pedro Sula Industrial)", code: "CR", capital: "San Pedro Sula", leader: "Sula Valley Tech Hub", pop: "1.8M" },
      { id: "HN-AT", name: "Atlántida (La Ceiba Port)", code: "AT", capital: "La Ceiba", leader: "Ceiba Maritime Net", pop: "480K" }
    ]
  },
  {
    id: "JAM", code: "JM", name: "Jamaica", capital: "Kingston", region: "North America",
    population: "2.8M", currency: "JMD (J$)", lat: 18.1096, lon: -77.2975,
    about: "Jamaica launched the JAM-DEX central bank digital currency and features Kingston's creative media and BPO tech clusters.",
    leader: "JAM-DEX Core", leaderType: "product",
    states: [
      { id: "JM-01", name: "Kingston Parish & Saint Andrew", code: "01", capital: "Kingston", leader: "JAM-DEX Core", pop: "670K" },
      { id: "JM-09", name: "Saint James (Montego Bay BPO / Tech)", code: "09", capital: "Montego Bay", leader: "Montego Bay FreeZone", pop: "190K" },
      { id: "JM-14", name: "Saint Catherine (Spanish Town)", code: "14", capital: "Spanish Town", leader: "Twickenham Tech Strip", pop: "520K" },
      { id: "JM-12", name: "Manchester (Mandeville BPO)", code: "12", capital: "Mandeville", leader: "Northern Caribbean Uni Labs", pop: "190K" }
    ]
  },
  {
    id: "MEX", code: "MX", name: "Mexico", capital: "Mexico City", region: "North America",
    population: "128.5M", currency: "MXN ($)", lat: 23.6345, lon: -102.5528,
    about: "Mexico is Latin America's manufacturing and nearshoring giant, featuring Guadalajara (the Silicon Valley of Mexico), Monterrey's industrial tech, and Mexico City unicorns (Kavak, Bitso).",
    leader: "Kavak Motors Tech", leaderType: "product",
    states: [
      { id: "MX-CMX", name: "Mexico City (CDMX Tech Core)", code: "CMX", capital: "Mexico City", leader: "Kavak Motors Tech", pop: "9.2M" },
      { id: "MX-JAL", name: "Jalisco (Guadalajara Silicon Valley)", code: "JAL", capital: "Guadalajara", leader: "Guadalajara Semi Hub", pop: "8.4M" },
      { id: "MX-NLE", name: "Nuevo León (Monterrey Tech Valley)", code: "NLE", capital: "Monterrey", leader: "Tec de Monterrey Hub", pop: "5.8M" },
      { id: "MX-MEX", name: "State of Mexico", code: "MEX", capital: "Toluca", leader: "Toluca Logistics Tech", pop: "17.0M" },
      { id: "MX-QUE", name: "Querétaro (Data Center Capital of LatAm)", code: "QUE", capital: "Querétaro", leader: "Querétaro Cloud Corridor", pop: "2.4M" },
      { id: "MX-BCN", name: "Baja California (Tijuana Nearshore)", code: "BCN", capital: "Mexicali", leader: "Tijuana Innovación", pop: "3.8M" },
      { id: "MX-YUC", name: "Yucatán (Mérida Cyber Hub)", code: "YUC", capital: "Mérida", leader: "Mérida Tech Coast", pop: "2.3M" }
    ]
  },
  {
    id: "NIC", code: "NI", name: "Nicaragua", capital: "Managua", region: "North America",
    population: "6.9M", currency: "NIO (C$)", lat: 12.8654, lon: -85.2072,
    about: "Nicaragua is developing fiber broadband and mobile money networks connecting capital Managua with the university centers of León and Granada.",
    leader: "Billetera Móvil", leaderType: "product",
    states: [
      { id: "NI-MN", name: "Managua Department", code: "MN", capital: "Managua", leader: "Billetera Móvil", pop: "1.5M" },
      { id: "NI-LE", name: "León Department", code: "LE", capital: "León", leader: "UNAN León Software", pop: "420K" },
      { id: "NI-CI", name: "Chinandega", code: "CI", capital: "Chinandega", leader: "Corinto Ocean Gateway", pop: "440K" },
      { id: "NI-GR", name: "Granada Department", code: "GR", capital: "Granada", leader: "Granada Digital Valley", pop: "215K" }
    ]
  },
  {
    id: "PAN", code: "PA", name: "Panama", capital: "Panama City", region: "North America",
    population: "4.4M", currency: "USD ($)", lat: 8.538, lon: -80.7821,
    about: "Panama is the Digital Hub of the Americas, home to the City of Knowledge (Ciudad del Saber), Panama Canal logistics telemetry, and 8 subsea fiber optic cables.",
    leader: "Ciudad del Saber", leaderType: "product",
    states: [
      { id: "PA-8", name: "Panamá Province (City of Knowledge)", code: "8", capital: "Panama City", leader: "Ciudad del Saber", pop: "1.8M" },
      { id: "PA-13", name: "Panamá Oeste (Pacific Hub)", code: "13", capital: "La Chorrera", leader: "Panama Pacifico Park", pop: "600K" },
      { id: "PA-4", name: "Chiriquí (David / Boquete Nomads)", code: "4", capital: "David", leader: "Boquete Mountain Nomads", pop: "470K" },
      { id: "PA-3", name: "Colón (Free Zone Canal Logistics)", code: "3", capital: "Colón", leader: "Colón Smart Port", pop: "300K" }
    ]
  },
  {
    id: "KNA", code: "KN", name: "Saint Kitts and Nevis", capital: "Basseterre", region: "North America",
    population: "48K", currency: "XCD ($)", lat: 17.3578, lon: -62.783,
    about: "Saint Kitts and Nevis is a pioneer of citizenship by investment programs and green energy integration with Nevis geothermal projects.",
    leader: "Basseterre Smart Island", leaderType: "product",
    states: [
      { id: "KN-01", name: "Saint George Basseterre", code: "01", capital: "Basseterre", leader: "Basseterre Smart Island", pop: "13K" },
      { id: "KN-02", name: "Saint Peter Basseterre", code: "02", capital: "Monkey Hill", leader: "Monkey Hill Digital", pop: "5K" },
      { id: "KN-N", name: "Nevis Island (Charlestown Geothermal)", code: "N", capital: "Charlestown", leader: "Nevis Geothermal Labs", pop: "12K" }
    ]
  },
  {
    id: "LCA", code: "LC", name: "Saint Lucia", capital: "Castries", region: "North America",
    population: "180K", currency: "XCD ($)", lat: 13.9094, lon: -60.9789,
    about: "Saint Lucia offers the Saint Lucia Digital Nomad Visa and expands Caribbean software development hubs in Castries and Rodney Bay.",
    leader: "Rodney Bay Tech Hub", leaderType: "product",
    states: [
      { id: "LC-01", name: "Castries District (Capital Core)", code: "01", capital: "Castries", leader: "Castries Port Tech", pop: "70K" },
      { id: "LC-06", name: "Gros Islet (Rodney Bay Marina Hub)", code: "06", capital: "Gros Islet", leader: "Rodney Bay Tech Hub", pop: "25K" },
      { id: "LC-11", name: "Vieux Fort (Southern AeroTech Zone)", code: "11", capital: "Vieux Fort", leader: "Hewanorra Aero Cluster", pop: "17K" },
      { id: "LC-10", name: "Soufrière (Pitons EcoSense)", code: "10", capital: "Soufrière", leader: "Pitons EcoTelemetry", pop: "9K" }
    ]
  },
  {
    id: "VCT", code: "VC", name: "Saint Vincent and the Grenadines", capital: "Kingstown", region: "North America",
    population: "104K", currency: "XCD ($)", lat: 13.2528, lon: -61.1971,
    about: "Saint Vincent and the Grenadines is developing smart tourism telemetry and clean solar island microgrids across the Grenadine archipelago.",
    leader: "Kingstown Marine Cloud", leaderType: "product",
    states: [
      { id: "VC-01", name: "Saint George (Kingstown)", code: "01", capital: "Kingstown", leader: "Kingstown Marine Cloud", pop: "53K" },
      { id: "VC-06", name: "Grenadines (Bequia Crypto Island)", code: "06", capital: "Port Elizabeth", leader: "Bequia Bitcoin Society", pop: "10K" },
      { id: "VC-02", name: "Charlotte Parish (Georgetown)", code: "02", capital: "Georgetown", leader: "Charlotte AgroTech", pop: "38K" }
    ]
  },
  {
    id: "TTO", code: "TT", name: "Trinidad and Tobago", capital: "Port of Spain", region: "North America",
    population: "1.5M", currency: "TTD (TT$)", lat: 10.6918, lon: -61.2225,
    about: "Trinidad and Tobago is the Caribbean's energy and industrial hub, home to UWI St. Augustine engineering faculty and Tamana InTech Park.",
    leader: "Tamana InTech Park", leaderType: "product",
    states: [
      { id: "TT-POS", name: "Port of Spain (Capital FinTech)", code: "POS", capital: "Port of Spain", leader: "WiPay Caribbean", pop: "50K" },
      { id: "TT-TP", name: "Tunapuna-Piarco (Tamana InTech / UWI)", code: "TP", capital: "Tunapuna", leader: "Tamana InTech Park", pop: "220K" },
      { id: "TT-SFO", name: "San Fernando (Energy Tech Corridor)", code: "SFO", capital: "San Fernando", leader: "Point Lisas Industrial IoT", pop: "60K" },
      { id: "TT-TOB", name: "Tobago Island (Scarborough)", code: "TOB", capital: "Scarborough", leader: "Tobago EcoTech", pop: "65K" }
    ]
  },
  {
    id: "USA", code: "US", name: "United States", capital: "Washington, D.C.", region: "North America",
    population: "335.9M", currency: "USD ($)", lat: 37.0902, lon: -95.7129,
    about: "United States is the foremost technology and economic superpower on the planet, home to Silicon Valley, Seattle cloud titans, Austin silicon hills, and NYC Silicon Alley.",
    leader: "OpenAI ChatGPT", leaderType: "product",
    states: [
      { id: "US-CA", name: "California (Silicon Valley / SF)", code: "CA", capital: "Sacramento", leader: "OpenAI ChatGPT", pop: "39.0M" },
      { id: "US-NY", name: "New York (Silicon Alley / Wall St)", code: "NY", capital: "Albany", leader: "Stripe US Hub", pop: "19.5M" },
      { id: "US-TX", name: "Texas (Austin Silicon Hills / Dallas)", code: "TX", capital: "Austin", leader: "Tesla Cyber Hub", pop: "30.0M" },
      { id: "US-WA", name: "Washington (Seattle Cloud Titans)", code: "WA", capital: "Olympia", leader: "Amazon AWS", pop: "7.8M" },
      { id: "US-MA", name: "Massachusetts (Boston / Cambridge MIT)", code: "MA", capital: "Boston", leader: "Boston BioTech AI", pop: "7.0M" },
      { id: "US-FL", name: "Florida (Miami Tech & Crypto Capital)", code: "FL", capital: "Tallahassee", leader: "Miami Tech Valley", pop: "22.2M" },
      { id: "US-IL", name: "Illinois (Chicago FinTech Corridor)", code: "IL", capital: "Springfield", leader: "Chicago Trading Tech", pop: "12.6M" },
      { id: "US-CO", name: "Colorado (Denver / Boulder Quantum)", code: "CO", capital: "Denver", leader: "Boulder Quantum Hub", pop: "5.8M" },
      { id: "US-NC", name: "North Carolina (Research Triangle RTP)", code: "NC", capital: "Raleigh", leader: "Research Triangle Park", pop: "10.7M" },
      { id: "US-GA", name: "Georgia (Atlanta FinTech & Tech Square)", code: "GA", capital: "Atlanta", leader: "Atlanta Tech Village", pop: "10.9M" }
    ]
  },

  // ================= SOUTH AMERICA (12) =================
  {
    id: "ARG", code: "AR", name: "Argentina", capital: "Buenos Aires", region: "South America",
    population: "46.6M", currency: "ARS ($)", lat: -38.4161, lon: -63.6167,
    about: "Argentina is the birthplace of Latin America's top tech unicorns including MercadoLibre, Globant, Auth0, and Decentraland in Buenos Aires.",
    leader: "MercadoLibre Core", leaderType: "product",
    states: [
      { id: "AR-C", name: "Autonomous City of Buenos Aires (Palermo Tech)", code: "C", capital: "Buenos Aires", leader: "MercadoLibre Core", pop: "3.1M" },
      { id: "AR-B", name: "Buenos Aires Province", code: "B", capital: "La Plata", leader: "Pampa IT Hub", pop: "17.5M" },
      { id: "AR-X", name: "Córdoba (Silicon Valley of Argentina)", code: "X", capital: "Córdoba", leader: "Córdoba Tech Cluster", pop: "3.9M" },
      { id: "AR-S", name: "Santa Fe (Rosario Biotech / Polo Tecnológico)", code: "S", capital: "Santa Fe", leader: "Rosario BioTech", pop: "3.5M" },
      { id: "AR-M", name: "Mendoza (Wine & Tech Oasis)", code: "M", capital: "Mendoza", leader: "Mendoza Valley AI", pop: "2.0M" }
    ]
  },
  {
    id: "BOL", code: "BO", name: "Bolivia", capital: "Sucre", region: "South America",
    population: "12.2M", currency: "BOB (Bs)", lat: -16.2902, lon: -63.5887,
    about: "Bolivia features Santa Cruz de la Sierra as its dynamic entrepreneurial center and La Paz with telecommunications high above the Andes.",
    leader: "Santa Cruz InnoHub", leaderType: "product",
    states: [
      { id: "BO-S", name: "Santa Cruz (Commercial & Tech Capital)", code: "S", capital: "Santa Cruz", leader: "Santa Cruz InnoHub", pop: "3.4M" },
      { id: "BO-L", name: "La Paz (Government & Universities)", code: "L", capital: "La Paz", leader: "Illimani Cyber Net", pop: "2.9M" },
      { id: "BO-C", name: "Cochabamba (Software City)", code: "C", capital: "Cochabamba", leader: "Jalasoft Tech Campus", pop: "2.1M" },
      { id: "BO-P", name: "Potosí (Salar de Uyuni Lithium Tech)", code: "P", capital: "Potosí", leader: "Uyuni Lithium IoT", pop: "900K" }
    ]
  },
  {
    id: "BRA", code: "BR", name: "Brazil", capital: "Brasília", region: "South America",
    population: "216.4M", currency: "BRL (R$)", lat: -14.235, lon: -51.9253,
    about: "Brazil is Latin America's largest tech and venture market, creator of instant payment revolution Pix, Nubank (world's largest digital bank), and São Paulo tech corridor.",
    leader: "Nubank Core", leaderType: "product",
    states: [
      { id: "BR-SP", name: "São Paulo (Faria Lima / San Pedro Valley)", code: "SP", capital: "São Paulo", leader: "Nubank Core", pop: "44.4M" },
      { id: "BR-SC", name: "Santa Catarina (Florianópolis Silicon Island)", code: "SC", capital: "Florianópolis", leader: "Silicon Island Floripa", pop: "7.6M" },
      { id: "BR-MG", name: "Minas Gerais (San Pedro Valley BH)", code: "MG", capital: "Belo Horizonte", leader: "San Pedro Valley", pop: "20.5M" },
      { id: "BR-RJ", name: "Rio de Janeiro (Porto Maravilha Tech)", code: "RJ", capital: "Rio de Janeiro", leader: "Porto Maravilha Tech", pop: "16.0M" },
      { id: "BR-PR", name: "Paraná (Curitiba Smart City)", code: "PR", capital: "Curitiba", leader: "Curitiba Vale do Pinhão", pop: "11.4M" },
      { id: "BR-PE", name: "Pernambuco (Porto Digital Recife)", code: "PE", capital: "Recife", leader: "Porto Digital Recife", pop: "9.0M" },
      { id: "BR-DF", name: "Federal District (Brasília GovTech)", code: "DF", capital: "Brasília", leader: "Brasília GovTech", pop: "2.8M" }
    ]
  },
  {
    id: "CHL", code: "CL", name: "Chile", capital: "Santiago", region: "South America",
    population: "19.6M", currency: "CLP ($)", lat: -35.6751, lon: -71.543,
    about: "Chile is known as 'Chilecon Valley', famous for Start-Up Chile (world's first government startup accelerator), NotCo, and astronomical data observatories.",
    leader: "Start-Up Chile", leaderType: "product",
    states: [
      { id: "CL-RM", name: "Santiago Metropolitan (Chilecon Valley)", code: "RM", capital: "Santiago", leader: "Start-Up Chile", pop: "7.1M" },
      { id: "CL-VS", name: "Valparaíso (Viña del Mar Tech Coast)", code: "VS", capital: "Valparaíso", leader: "Valparaíso BioLabs", pop: "1.9M" },
      { id: "CL-BI", name: "Biobío (Concepción Tech Hub)", code: "BI", capital: "Concepción", leader: "Concepción University Lab", pop: "1.6M" },
      { id: "CL-AN", name: "Antofagasta (Atacama Space & AstroData)", code: "AN", capital: "Antofagasta", leader: "ALMA Observatory Data", pop: "690K" }
    ]
  },
  {
    id: "COL", code: "CO", name: "Colombia", capital: "Bogotá", region: "South America",
    population: "52.2M", currency: "COP ($)", lat: 4.5709, lon: -74.2973,
    about: "Colombia has one of LatAm's most vibrant startup landscapes, with delivery titan Rappi from Bogotá and Medellín recognized worldwide as an Innovation City.",
    leader: "Rappi Ecosystem", leaderType: "product",
    states: [
      { id: "CO-DC", name: "Bogotá Capital District", code: "DC", capital: "Bogotá", leader: "Rappi Ecosystem", pop: "8.0M" },
      { id: "CO-ANT", name: "Antioquia (Medellín Ruta N)", code: "ANT", capital: "Medellín", leader: "Ruta N Innovation", pop: "6.9M" },
      { id: "CO-VAC", name: "Valle del Cauca (Cali Tech Valley)", code: "VAC", capital: "Cali", leader: "Zonamerica Cali", pop: "4.5M" },
      { id: "CO-ATL", name: "Atlántico (Barranquilla Puerta de Oro)", code: "ATL", capital: "Barranquilla", leader: "Barranquilla Caribbean Hub", pop: "2.7M" },
      { id: "CO-SAN", name: "Santander (Bucaramanga)", code: "SAN", capital: "Bucaramanga", leader: "UIS Guatiguará Science Park", pop: "2.3M" }
    ]
  },
  {
    id: "ECU", code: "EC", name: "Ecuador", capital: "Quito", region: "South America",
    population: "18.2M", currency: "USD ($)", lat: -1.8312, lon: -78.1834,
    about: "Ecuador operates on the US Dollar, featuring tech incubators in Quito, commercial logistics in Guayaquil, and Yachay Tech City.",
    leader: "Kushki Pay", leaderType: "product",
    states: [
      { id: "EC-P", name: "Pichincha (Quito Innovation Hub)", code: "P", capital: "Quito", leader: "Kushki Pay", pop: "3.2M" },
      { id: "EC-G", name: "Guayas (Guayaquil Commercial Tech)", code: "G", capital: "Guayaquil", leader: "Guayaquil Digital Port", pop: "4.4M" },
      { id: "EC-A", name: "Azuay (Cuenca Creative Hub)", code: "A", capital: "Cuenca", leader: "Cuenca Craft & Code", pop: "900K" },
      { id: "EC-I", name: "Imbabura (Yachay Tech City)", code: "I", capital: "Ibarra", leader: "Yachay University Hub", pop: "480K" }
    ]
  },
  {
    id: "GUY", code: "GY", name: "Guyana", capital: "Georgetown", region: "South America",
    population: "815K", currency: "GYD ($)", lat: 4.8604, lon: -58.9302,
    about: "Guyana is one of the world's fastest-growing economies, transforming into a digital and energy powerhouse centered around Georgetown.",
    leader: "Georgetown Cyber Hub", leaderType: "product",
    states: [
      { id: "GY-DE", name: "Demerara-Mahaica (Georgetown)", code: "DE", capital: "Georgetown", leader: "Georgetown Cyber Hub", pop: "320K" },
      { id: "GY-EB", name: "East Berbice-Corentyne", code: "EB", capital: "New Amsterdam", leader: "Berbice AgroTech", pop: "110K" },
      { id: "GY-ES", name: "Essequibo Islands-West Demerara", code: "ES", capital: "Vreed-en-Hoop", leader: "Vreed-en-Hoop Port Tech", pop: "110K" },
      { id: "GY-UD", name: "Upper Demerara-Berbice (Linden)", code: "UD", capital: "Linden", leader: "Linden Solar Net", pop: "40K" }
    ]
  },
  {
    id: "PRY", code: "PY", name: "Paraguay", capital: "Asunción", region: "South America",
    population: "6.8M", currency: "PYG (₲)", lat: -23.4425, lon: -58.4438,
    about: "Paraguay is a leading zero-carbon cryptocurrency mining destination powered by Itaipu Dam clean hydropower, with tech centers in Asunción.",
    leader: "Itaipu Clean Compute", leaderType: "product",
    states: [
      { id: "PY-ASU", name: "Asunción Capital District", code: "ASU", capital: "Asunción", leader: "Asunción Fintech Hub", pop: "520K" },
      { id: "PY-11", name: "Central Department", code: "11", capital: "Areguá", leader: "Gran Asunción Tech", pop: "2.2M" },
      { id: "PY-10", name: "Alto Paraná (Ciudad del Este / Itaipu)", code: "10", capital: "Ciudad del Este", leader: "Itaipu Clean Compute", pop: "830K" },
      { id: "PY-07", name: "Itapúa (Encarnación)", code: "07", capital: "Encarnación", leader: "Encarnación Beach Nomads", pop: "600K" }
    ]
  },
  {
    id: "PER", code: "PE", name: "Peru", capital: "Lima", region: "South America",
    population: "34.3M", currency: "PEN (S/)", lat: -9.19, lon: -75.0152,
    about: "Peru has a thriving fintech scene centered in Lima around mobile wallets Yape and Plin, alongside mining technology automation in Arequipa.",
    leader: "Yape Core", leaderType: "product",
    states: [
      { id: "PE-LIM", name: "Lima Metropolitan (San Isidro / Miraflores)", code: "LIM", capital: "Lima", leader: "Yape Core", pop: "10.0M" },
      { id: "PE-ARE", name: "Arequipa (White City Tech)", code: "ARE", capital: "Arequipa", leader: "Arequipa Mining Tech", pop: "1.5M" },
      { id: "PE-LAL", name: "La Libertad (Trujillo)", code: "LAL", capital: "Trujillo", leader: "Trujillo AgroExport Tech", pop: "2.0M" },
      { id: "PE-CUS", name: "Cusco (Inca Valley Nomads)", code: "CUS", capital: "Cusco", leader: "Sacred Valley Nomads", pop: "1.3M" }
    ]
  },
  {
    id: "SUR", code: "SR", name: "Suriname", capital: "Paramaribo", region: "South America",
    population: "623K", currency: "SRD ($)", lat: 3.9193, lon: -56.0278,
    about: "Suriname is developing digital infrastructure and offshore energy logistics telemetry centered around Paramaribo.",
    leader: "Telesur Digital", leaderType: "product",
    states: [
      { id: "SR-PM", name: "Paramaribo District", code: "PM", capital: "Paramaribo", leader: "Telesur Digital", pop: "240K" },
      { id: "SR-WA", name: "Wanica District", code: "WA", capital: "Lelydorp", leader: "Lelydorp Tech Hub", pop: "120K" },
      { id: "SR-NI", name: "Nickerie (New Nickerie Port)", code: "NI", capital: "Nieuw Nickerie", leader: "Nickerie Agro Logistics", pop: "40K" },
      { id: "SR-CM", name: "Commewijne", code: "CM", capital: "Nieuw Amsterdam", leader: "Commewijne River Tech", pop: "35K" }
    ]
  },
  {
    id: "URY", code: "UY", name: "Uruguay", capital: "Montevideo", region: "South America",
    population: "3.4M", currency: "UYU ($U)", lat: -32.5228, lon: -55.7658,
    about: "Uruguay is the #1 software exporter per capita in Latin America, home to payments unicorn dLocal, Plan Ceibal (first 1-to-1 laptop country), and Punta del Este nomad hub.",
    leader: "dLocal Global", leaderType: "product",
    states: [
      { id: "UY-MO", name: "Montevideo (Zonamerica Free Zone)", code: "MO", capital: "Montevideo", leader: "dLocal Global", pop: "1.4M" },
      { id: "UY-MA", name: "Maldonado (Punta del Este Nomad City)", code: "MA", capital: "Maldonado", leader: "Punta Tech Meetup", pop: "180K" },
      { id: "UY-CA", name: "Canelones (Science Park Polo)", code: "CA", capital: "Canelones", leader: "Parque Científico Canelones", pop: "580K" },
      { id: "UY-CO", name: "Colonia del Sacramento (Silicon Valley River)", code: "CO", capital: "Colonia", leader: "+Colonia Smart City", pop: "135K" }
    ]
  },
  {
    id: "VEN", code: "VE", name: "Venezuela", capital: "Caracas", region: "South America",
    population: "28.8M", currency: "VES (Bs.)", lat: 6.4238, lon: -66.5897,
    about: "Venezuela is one of the highest adopters of peer-to-peer cryptocurrency and digital remittance networks in Latin America.",
    leader: "Pago Móvil Core", leaderType: "product",
    states: [
      { id: "VE-A", name: "Capital District (Caracas)", code: "A", capital: "Caracas", leader: "Pago Móvil Core", pop: "3.3M" },
      { id: "VE-M", name: "Miranda (Chacao / Baruta Tech)", code: "M", capital: "Los Teques", leader: "Chacao Digital Zone", pop: "3.2M" },
      { id: "VE-V", name: "Zulia (Maracaibo Tech)", code: "V", capital: "Maracaibo", leader: "Maracaibo Lake Net", pop: "4.3M" },
      { id: "VE-G", name: "Carabobo (Valencia Industrial)", code: "G", capital: "Valencia", leader: "Valencia Industrial AI", pop: "2.5M" }
    ]
  },

  // ================= OCEANIA (14) =================
  {
    id: "AUS", code: "AU", name: "Australia", capital: "Canberra", region: "Oceania",
    population: "26.5M", currency: "AUD (A$)", lat: -25.2744, lon: 133.7751,
    about: "Australia is a tier-one global technology powerhouse, home to Atlassian, Canva, and quantum computing champions across Sydney and Melbourne.",
    leader: "Atlassian Core", leaderType: "product",
    states: [
      { id: "AU-NSW", name: "New South Wales (Sydney Tech Central)", code: "NSW", capital: "Sydney", leader: "Atlassian Core", pop: "8.3M" },
      { id: "AU-VIC", name: "Victoria (Melbourne Cremorne Tech)", code: "VIC", capital: "Melbourne", leader: "Canva Design Space", pop: "6.8M" },
      { id: "AU-QLD", name: "Queensland (Brisbane Fortitude Valley)", code: "QLD", capital: "Brisbane", leader: "Brisbane Innovation Hub", pop: "5.4M" },
      { id: "AU-WA", name: "Western Australia (Perth Resources Tech)", code: "WA", capital: "Perth", leader: "Perth Autonomous Mining", pop: "2.8M" },
      { id: "AU-SA", name: "South Australia (Adelaide Lot Fourteen)", code: "SA", capital: "Adelaide", leader: "Lot Fourteen Space AI", pop: "1.8M" },
      { id: "AU-ACT", name: "Australian Capital Territory (Canberra)", code: "ACT", capital: "Canberra", leader: "Canberra Cyber Precinct", pop: "460K" },
      { id: "AU-TAS", name: "Tasmania (Hobart Blue Tech)", code: "TAS", capital: "Hobart", leader: "Hobart Antarctic Tech", pop: "570K" }
    ]
  },
  {
    id: "FJI", code: "FJ", name: "Fiji", capital: "Suva", region: "Oceania",
    population: "936K", currency: "FJD (FJ$)", lat: -17.7134, lon: 178.065,
    about: "Fiji is the diplomatic and communications hub of the South Pacific, connecting regional island nations through Southern Cross Cable landings in Suva.",
    leader: "Vodafone M-PAiSA", leaderType: "product",
    states: [
      { id: "FJ-C", name: "Central Division (Suva Capital)", code: "C", capital: "Suva", leader: "Vodafone M-PAiSA", pop: "380K" },
      { id: "FJ-W", name: "Western Division (Nadi / Lautoka)", code: "W", capital: "Lautoka", leader: "Nadi Aviation Hub", pop: "330K" },
      { id: "FJ-N", name: "Northern Division (Labasa / Vanua Levu)", code: "N", capital: "Labasa", leader: "Vanua Levu AgroNet", pop: "135K" },
      { id: "FJ-E", name: "Eastern Division (Levuka)", code: "E", capital: "Levuka", leader: "Levuka Heritage Net", pop: "40K" }
    ]
  },
  {
    id: "KIR", code: "KI", name: "Kiribati", capital: "Tarawa", region: "Oceania",
    population: "131K", currency: "AUD (A$)", lat: -3.3704, lon: -168.734,
    about: "Kiribati is a Pacific atoll nation straddling all four hemispheres, pioneering satellite climate monitoring and digital ocean sensors.",
    leader: "Tarawa Blue Net", leaderType: "product",
    states: [
      { id: "KI-G", name: "Gilbert Islands (South Tarawa)", code: "G", capital: "South Tarawa", leader: "Tarawa Blue Net", pop: "115K" },
      { id: "KI-L", name: "Line Islands (Kiritimati / Christmas Island)", code: "L", capital: "London", leader: "Kiritimati Ocean Station", pop: "10K" },
      { id: "KI-P", name: "Phoenix Islands Protected Area", code: "P", capital: "Kanton", leader: "PIPA Marine Sanctuary AI", pop: "500" }
    ]
  },
  {
    id: "MHL", code: "MH", name: "Marshall Islands", capital: "Majuro", region: "Oceania",
    population: "42K", currency: "USD ($)", lat: 7.1315, lon: 171.1845,
    about: "The Marshall Islands recognized Decentralized Autonomous Organizations (DAOs) as legal entities and leads global maritime registry telemetry.",
    leader: "Marshall Islands DAO", leaderType: "product",
    states: [
      { id: "MH-MAJ", name: "Majuro Atoll (Capital DAO Hub)", code: "MAJ", capital: "Majuro", leader: "Marshall Islands DAO", pop: "28K" },
      { id: "MH-KWA", name: "Kwajalein Atoll (Space Tracking)", code: "KWA", capital: "Ebeye", leader: "Kwajalein Telemetry Net", pop: "11K" },
      { id: "MH-ARN", name: "Arno Atoll", code: "ARN", capital: "Arno", leader: "Arno Organic Hub", pop: "2K" }
    ]
  },
  {
    id: "FSM", code: "FM", name: "Micronesia", capital: "Palikir", region: "Oceania",
    population: "115K", currency: "USD ($)", lat: 7.4256, lon: 150.5508,
    about: "Federated States of Micronesia connects four island states with undersea fiber optic cables linked to Guam and international networks.",
    leader: "FSM Telecom", leaderType: "product",
    states: [
      { id: "FM-PNI", name: "Pohnpei State (Palikir Capital)", code: "PNI", capital: "Palikir", leader: "FSM Telecom", pop: "36K" },
      { id: "FM-TRK", name: "Chuuk State (Weno Island)", code: "TRK", capital: "Weno", leader: "Chuuk Lagoon Net", pop: "48K" },
      { id: "FM-YAP", name: "Yap State (Stone Money Island)", code: "YAP", capital: "Colonia", leader: "Yap Digital Stone", pop: "11K" },
      { id: "FM-KSA", name: "Kosrae State", code: "KSA", capital: "Tofol", leader: "Kosrae EcoTech", pop: "7K" }
    ]
  },
  {
    id: "NRU", code: "NR", name: "Nauru", capital: "Yaren", region: "Oceania",
    population: "12K", currency: "AUD (A$)", lat: -0.5228, lon: 166.9315,
    about: "Nauru is an equatorial island nation connecting to high-speed undersea cables and pioneering digital corporate registries.",
    leader: "Nauru DigiGate", leaderType: "product",
    states: [
      { id: "NR-14", name: "Yaren District (Government Center)", code: "14", capital: "Yaren", leader: "Nauru DigiGate", pop: "800" },
      { id: "NR-06", name: "Denigomodu (Commercial Center)", code: "06", capital: "Denigomodu", leader: "Denigomodu Port Link", pop: "1.8K" },
      { id: "NR-01", name: "Aiwo District", code: "01", capital: "Aiwo", leader: "Aiwo Industrial Node", pop: "1.3K" },
      { id: "NR-09", name: "Meneng District", code: "09", capital: "Meneng", leader: "Meneng Hotel Net", pop: "1.4K" }
    ]
  },
  {
    id: "NZL", code: "NZ", name: "New Zealand", capital: "Wellington", region: "Oceania",
    population: "5.2M", currency: "NZD (NZ$)", lat: -40.9006, lon: 174.886,
    about: "New Zealand created cloud accounting giant Xero and Rocket Lab, featuring Auckland's commercial hub and Wellington's creative tech and Wētā FX.",
    leader: "Xero Core", leaderType: "product",
    states: [
      { id: "NZ-AUK", name: "Auckland Region (Commercial Tech)", code: "AUK", capital: "Auckland", leader: "Xero Core", pop: "1.7M" },
      { id: "NZ-WGN", name: "Wellington Region (Wētā FX / GovTech)", code: "WGN", capital: "Wellington", leader: "Wētā FX Digital", pop: "540K" },
      { id: "NZ-CAN", name: "Canterbury (Christchurch Aerospace)", code: "CAN", capital: "Christchurch", leader: "Christchurch Aerospace", pop: "650K" },
      { id: "NZ-WKO", name: "Waikato (Hamilton Agritech)", code: "WKO", capital: "Hamilton", leader: "Hamilton Agritech Labs", pop: "500K" },
      { id: "NZ-OTA", name: "Otago (Queenstown Nomads / Dunedin)", code: "OTA", capital: "Dunedin", leader: "Silicon Wakatipu", pop: "245K" }
    ]
  },
  {
    id: "PLW", code: "PW", name: "Palau", capital: "Ngerulmud", region: "Oceania",
    population: "18K", currency: "USD ($)", lat: 7.515, lon: 134.5825,
    about: "Palau made global headlines with its Sovereign Digital Residency program (RootName / RNS.ID) and the Palau National Stablecoin pilot with Ripple.",
    leader: "Palau Digital Residency", leaderType: "product",
    states: [
      { id: "PW-150", name: "Koror State (Commercial Center)", code: "150", capital: "Koror", leader: "Palau Digital Residency", pop: "11K" },
      { id: "PW-222", name: "Melekeok (Ngerulmud Capital)", code: "222", capital: "Ngerulmud", leader: "Capitol GovNet", pop: "400" },
      { id: "PW-004", name: "Airai State (International Airport)", code: "004", capital: "Airai", leader: "Airai AeroTech", pop: "2.5K" }
    ]
  },
  {
    id: "PNG", code: "PG", name: "Papua New Guinea", capital: "Port Moresby", region: "Oceania",
    population: "10.3M", currency: "PGK (K)", lat: -6.314993, lon: 143.95555,
    about: "Papua New Guinea connects the Coral Sea Cable into Port Moresby, scaling digital banking and rural mobile money solutions.",
    leader: "MiBank PNG", leaderType: "product",
    states: [
      { id: "PG-NCD", name: "National Capital District (Port Moresby)", code: "NCD", capital: "Port Moresby", leader: "MiBank PNG", pop: "400K" },
      { id: "PG-MPM", name: "Morobe (Lae Industrial Gateway)", code: "MPM", capital: "Lae", leader: "Lae Port Digital Hub", pop: "700K" },
      { id: "PG-WHM", name: "Western Highlands (Mount Hagen)", code: "WHM", capital: "Mount Hagen", leader: "Highlands AgroNet", pop: "400K" },
      { id: "PG-EBR", name: "East New Britain (Kokopo)", code: "EBR", capital: "Kokopo", leader: "Gazelle Peninsula Tech", pop: "400K" }
    ]
  },
  {
    id: "WSM", code: "WS", name: "Samoa", capital: "Apia", region: "Oceania",
    population: "205K", currency: "WST (T)", lat: -13.759, lon: -172.1046,
    about: "Samoa hosts the Tui-Samoa submarine fiber cable, powering high-speed cloud access and mobile banking in Apia.",
    leader: "Vodafone M-Tala", leaderType: "product",
    states: [
      { id: "WS-TU", name: "Tuamasaga (Apia Capital)", code: "TU", capital: "Apia", leader: "Vodafone M-Tala", pop: "95K" },
      { id: "WS-AT", name: "Atua District", code: "AT", capital: "Lufilufi", leader: "Aleipata Coastal Net", pop: "23K" },
      { id: "WS-AA", name: "A'ana District", code: "AA", capital: "Leulumoega", leader: "Faleolo Airport Link", pop: "24K" },
      { id: "WS-FA", name: "Savai'i Island (Fa'asaleleaga)", code: "FA", capital: "Salelologa", leader: "Savai'i Solar Cloud", pop: "44K" }
    ]
  },
  {
    id: "SLB", code: "SB", name: "Solomon Islands", capital: "Honiara", region: "Oceania",
    population: "740K", currency: "SBD (SI$)", lat: -9.6457, lon: 160.1562,
    about: "Solomon Islands is connected via the Coral Sea Cable System into Honiara, accelerating fintech inclusion across Guadalcanal and the Western Province.",
    leader: "Our Telekom Solomon", leaderType: "product",
    states: [
      { id: "SB-CT", name: "Capital Territory (Honiara)", code: "CT", capital: "Honiara", leader: "Our Telekom Solomon", pop: "90K" },
      { id: "SB-GU", name: "Guadalcanal Province", code: "GU", capital: "Honiara", leader: "Guadalcanal Plains Net", pop: "155K" },
      { id: "SB-WE", name: "Western Province (Gizo)", code: "WE", capital: "Gizo", leader: "Gizo Blue Waters Tech", pop: "100K" },
      { id: "SB-ML", name: "Malaita Province (Auki)", code: "ML", capital: "Auki", leader: "Auki Island Connect", pop: "160K" }
    ]
  },
  {
    id: "TON", code: "TO", name: "Tonga", capital: "Nuku'alofa", region: "Oceania",
    population: "107K", currency: "TOP (T$)", lat: -21.1789, lon: -175.1982,
    about: "The Kingdom of Tonga is expanding resilient undersea fiber connections and digital remittance channels in Nuku'alofa and Vava'u.",
    leader: "Digicel Tonga", leaderType: "product",
    states: [
      { id: "TO-04", name: "Tongatapu (Nuku'alofa Capital)", code: "04", capital: "Nuku'alofa", leader: "Digicel Tonga", pop: "75K" },
      { id: "TO-05", name: "Vava'u Island Group", code: "05", capital: "Neiafu", leader: "Neiafu Tourism AI", pop: "14K" },
      { id: "TO-02", name: "Ha'apai Island Group", code: "02", capital: "Pangai", leader: "Ha'apai Solar Net", pop: "6K" }
    ]
  },
  {
    id: "TUV", code: "TV", name: "Tuvalu", capital: "Funafuti", region: "Oceania",
    population: "11K", currency: "AUD (A$)", lat: -7.1095, lon: 177.6493,
    about: "Tuvalu is famous globally for managing the sovereign .tv country code top-level domain and building a complete Digital Twin of the nation.",
    leader: "Tuvalu .TV Digital Twin", leaderType: "product",
    states: [
      { id: "TV-FUN", name: "Funafuti Atoll (Vaiaku)", code: "FUN", capital: "Vaiaku", leader: "Tuvalu .TV Digital Twin", pop: "7K" },
      { id: "TV-VAI", name: "Vaitupu Island", code: "VAI", capital: "Asau", leader: "Vaitupu Motufoua Hub", pop: "1.5K" },
      { id: "TV-NAN", name: "Nanumea Atoll", code: "NAN", capital: "Lolua", leader: "Northern Coral Node", pop: "600" }
    ]
  },
  {
    id: "VUT", code: "VU", name: "Vanuatu", capital: "Port Vila", region: "Oceania",
    population: "330K", currency: "VUV (VT)", lat: -15.3767, lon: 166.9592,
    about: "Vanuatu pioneered early cryptocurrency adoption in real estate and residency, with submarine fiber cable connectivity in Port Vila.",
    leader: "Port Vila FinTech", leaderType: "product",
    states: [
      { id: "VU-SEE", name: "Shefa Province (Port Vila Capital)", code: "SEE", capital: "Port Vila", leader: "Port Vila FinTech", pop: "100K" },
      { id: "VU-SAM", name: "Sanma Province (Luganville Port)", code: "SAM", capital: "Luganville", leader: "Santo Maritime Link", pop: "60K" },
      { id: "VU-MAL", name: "Malampa Province", code: "MAL", capital: "Lakatoro", leader: "Central Isles Net", pop: "40K" },
      { id: "VU-TAE", name: "Tafea Province (Tanna Island)", code: "TAE", capital: "Isangel", leader: "Tanna EcoGeo Tech", pop: "40K" }
    ]
  }
];
