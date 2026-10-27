// Build all 197 sovereign countries and territories from the PDF into world-countries.ts
const fs = require('fs');
const path = require('path');

function getFlag(code) {
  if (code === 'XK') return '🇽🇰';
  return String.fromCodePoint(...[...code.toUpperCase()].map(c => 127397 + c.charCodeAt(0)));
}

// 197 countries data by continent
const countriesData = [
  // ================= AFRICA (54) =================
  {
    id: "DZA", code: "DZ", name: "Algeria", capital: "Algiers", region: "Africa",
    population: "45.6M", currency: "DZD (د.ج)", lat: 28.0339, lon: 1.6596,
    about: "Algeria is North Africa's largest nation by area, featuring rapidly developing digital payment networks and a thriving engineering ecosystem anchored in Algiers and Oran.",
    leader: "Yassir SuperApp", leaderType: "product",
    states: [
      { id: "DZ-16", name: "Algiers (El Djazaïr)", code: "16", capital: "Algiers", leader: "Yassir SuperApp", pop: "3.2M" },
      { id: "DZ-31", name: "Oran", code: "31", capital: "Oran", leader: "Wahran Tech", pop: "1.6M" },
      { id: "DZ-25", name: "Constantine", code: "25", capital: "Constantine", leader: "Cirta Labs", pop: "950K" },
      { id: "DZ-23", name: "Annaba", code: "23", capital: "Annaba", leader: "Annaba Port Net", pop: "650K" },
      { id: "DZ-19", name: "Sétif", code: "19", capital: "Sétif", leader: "Highlands AI", pop: "1.5M" },
      { id: "DZ-09", name: "Blida", code: "09", capital: "Blida", leader: "Mitidja AgroTech", pop: "1.0M" },
      { id: "DZ-13", name: "Tlemcen", code: "13", capital: "Tlemcen", leader: "Tlemcen Cyber", pop: "950K" },
      { id: "DZ-05", name: "Batna", code: "05", capital: "Batna", leader: "Aurès Hub", pop: "1.1M" }
    ]
  },
  {
    id: "AGO", code: "AO", name: "Angola", capital: "Luanda", region: "Africa",
    population: "36.7M", currency: "AOA (Kz)", lat: -11.2027, lon: 17.8739,
    about: "Angola is a major Southwestern African economy with a growing fintech corridor in Luanda and expanding telecommunications infrastructure.",
    leader: "BAI Directo", leaderType: "product",
    states: [
      { id: "AO-LUA", name: "Luanda Province", code: "LUA", capital: "Luanda", leader: "BAI Directo", pop: "9.1M" },
      { id: "AO-HUA", name: "Huambo", code: "HUA", capital: "Huambo", leader: "Central Plateau Tech", pop: "2.5M" },
      { id: "AO-BGU", name: "Benguela", code: "BGU", capital: "Benguela", leader: "Lobito Corridor AI", pop: "2.4M" },
      { id: "AO-HUI", name: "Huíla (Lubango)", code: "HUI", capital: "Lubango", leader: "Lubango Valley Hub", pop: "2.8M" },
      { id: "AO-CAB", name: "Cabinda", code: "CAB", capital: "Cabinda", leader: "Atlantic Energy Net", pop: "800K" },
      { id: "AO-MAL", name: "Malanje", code: "MAL", capital: "Malanje", leader: "Kalandula Cloud", pop: "1.1M" }
    ]
  },
  {
    id: "BEN", code: "BJ", name: "Benin", capital: "Porto-Novo", region: "Africa",
    population: "13.7M", currency: "XOF (CFA)", lat: 9.3077, lon: 2.3158,
    about: "Benin is recognized for its digital public services transformation and Sèmè City international knowledge and innovation campus.",
    leader: "Sèmè City Labs", leaderType: "product",
    states: [
      { id: "BJ-LIT", name: "Littoral (Cotonou)", code: "LIT", capital: "Cotonou", leader: "Sèmè City Labs", pop: "1.2M" },
      { id: "BJ-OUE", name: "Ouémé (Porto-Novo)", code: "OUE", capital: "Porto-Novo", leader: "Porto-Novo Heritage", pop: "1.3M" },
      { id: "BJ-ATL", name: "Atlantique (Abomey-Calavi)", code: "ATL", capital: "Allada", leader: "Calavi Tech Park", pop: "1.6M" },
      { id: "BJ-BOR", name: "Borgou (Parakou)", code: "BOR", capital: "Parakou", leader: "Northern Transit Net", pop: "1.4M" },
      { id: "BJ-ZOU", name: "Zou (Abomey)", code: "ZOU", capital: "Abomey", leader: "Dahomey Digital", pop: "900K" }
    ]
  },
  {
    id: "BWA", code: "BW", name: "Botswana", capital: "Gaborone", region: "Africa",
    population: "2.6M", currency: "BWP (P)", lat: -22.3285, lon: 24.6849,
    about: "Botswana is one of Africa's most stable economies, developing the Botswana Innovation Hub in Gaborone with high-income aspirations.",
    leader: "BIH Innovation Hub", leaderType: "product",
    states: [
      { id: "BW-SE", name: "South-East (Gaborone)", code: "SE", capital: "Gaborone", leader: "BIH Innovation Hub", pop: "400K" },
      { id: "BW-NE", name: "North-East (Francistown)", code: "NE", capital: "Francistown", leader: "Francistown Gateway", pop: "200K" },
      { id: "BW-CE", name: "Central District", code: "CE", capital: "Serowe", leader: "Serowe Knowledge", pop: "700K" },
      { id: "BW-KW", name: "Kweneng", code: "KW", capital: "Molepolole", leader: "Molepolole Tech", pop: "400K" },
      { id: "BW-NW", name: "North-West (Ngamiland)", code: "NW", capital: "Maun", leader: "Okavango EcoNet", pop: "200K" }
    ]
  },
  {
    id: "BFA", code: "BF", name: "Burkina Faso", capital: "Ouagadougou", region: "Africa",
    population: "23.3M", currency: "XOF (CFA)", lat: 12.2383, lon: -1.5616,
    about: "Burkina Faso is a Sahelian hub with an entrepreneurial tech ecosystem centered around Ouagadougou and Bobo-Dioulasso.",
    leader: "FasoPay", leaderType: "product",
    states: [
      { id: "BF-03", name: "Centre (Ouagadougou)", code: "03", capital: "Ouagadougou", leader: "FasoPay", pop: "3.2M" },
      { id: "BF-09", name: "Hauts-Bassins (Bobo-Dioulasso)", code: "09", capital: "Bobo-Dioulasso", leader: "Sya Hub", pop: "2.1M" },
      { id: "BF-04", name: "Centre-Ouest (Koudougou)", code: "04", capital: "Koudougou", leader: "Koudougou Digital", pop: "1.7M" },
      { id: "BF-12", name: "Sahel Region", code: "12", capital: "Dori", leader: "Sahel Solar Net", pop: "1.3M" }
    ]
  },
  {
    id: "BDI", code: "BI", name: "Burundi", capital: "Gitega", region: "Africa",
    population: "13.2M", currency: "BIF (FBu)", lat: -3.3731, lon: 29.9189,
    about: "Burundi is located in the African Great Lakes region, building mobile payment accessibility across Gitega and economic hub Bujumbura.",
    leader: "Lumicash", leaderType: "product",
    states: [
      { id: "BI-BM", name: "Bujumbura Mairie", code: "BM", capital: "Bujumbura", leader: "Lumicash", pop: "1.1M" },
      { id: "BI-GI", name: "Gitega Capital", code: "GI", capital: "Gitega", leader: "Gitega Admin Cloud", pop: "900K" },
      { id: "BI-NG", name: "Ngozi Province", code: "NG", capital: "Ngozi", leader: "Ngozi AgroTech", pop: "800K" },
      { id: "BI-MY", name: "Muyinga", code: "MY", capital: "Muyinga", leader: "North Border Net", pop: "750K" }
    ]
  },
  {
    id: "CPV", code: "CV", name: "Cabo Verde", capital: "Praia", region: "Africa",
    population: "598K", currency: "CVE ($)", lat: 16.5388, lon: -23.0418,
    about: "Cabo Verde is an archipelago nation pioneering the Cabo Verde Tech Park with strong digital governance and undersea transatlantic connectivity.",
    leader: "Praia Tech Park", leaderType: "product",
    states: [
      { id: "CV-ST", name: "Santiago (Praia)", code: "ST", capital: "Praia", leader: "Praia Tech Park", pop: "310K" },
      { id: "CV-SV", name: "São Vicente (Mindelo)", code: "SV", capital: "Mindelo", leader: "Mindelo Blue Hub", pop: "85K" },
      { id: "CV-SL", name: "Sal Island (Espargos)", code: "SL", capital: "Espargos", leader: "Sal AeroNet", pop: "40K" },
      { id: "CV-BV", name: "Boa Vista", code: "BV", capital: "Sal Rei", leader: "Boa Vista Tourism AI", pop: "20K" }
    ]
  },
  {
    id: "CMR", code: "CM", name: "Cameroon", capital: "Yaoundé", region: "Africa",
    population: "28.6M", currency: "XAF (FCFA)", lat: 7.3697, lon: 12.3547,
    about: "Cameroon, known as 'Silicon Mountain' in Buea and the twin tech poles of Yaoundé and Douala, leads fintech in Central Africa.",
    leader: "Silicon Mountain Buea", leaderType: "product",
    states: [
      { id: "CM-LT", name: "Littoral (Douala)", code: "LT", capital: "Douala", leader: "Douala Port FinTech", pop: "4.0M" },
      { id: "CM-CE", name: "Centre (Yaoundé)", code: "CE", capital: "Yaoundé", leader: "Yaoundé GovTech", pop: "4.1M" },
      { id: "CM-SW", name: "Southwest (Buea Silicon Mountain)", code: "SW", capital: "Buea", leader: "Silicon Mountain Buea", pop: "1.8M" },
      { id: "CM-OU", name: "West (Bafoussam)", code: "OU", capital: "Bafoussam", leader: "Bafoussam Trade Net", pop: "2.1M" },
      { id: "CM-NO", name: "North (Garoua)", code: "NO", capital: "Garoua", leader: "Garoua River Hub", pop: "2.6M" }
    ]
  },
  {
    id: "CAF", code: "CF", name: "Central African Republic", capital: "Bangui", region: "Africa",
    population: "5.7M", currency: "XAF (FCFA)", lat: 6.6111, lon: 20.9394,
    about: "Central African Republic is located at the center of the continent, developing digital financial inclusion and satellite communication projects in Bangui.",
    leader: "Sango Genesis", leaderType: "product",
    states: [
      { id: "CF-BGF", name: "Bangui Metropolitan", code: "BGF", capital: "Bangui", leader: "Sango Genesis", pop: "900K" },
      { id: "CF-OM", name: "Ombella-M'Poko", code: "OM", capital: "Bimbo", leader: "Bimbo Agro Hub", pop: "450K" },
      { id: "CF-OU", name: "Ouham (Bossangoa)", code: "OU", capital: "Bossangoa", leader: "Savanna Net", pop: "400K" },
      { id: "CF-NM", name: "Nana-Mambéré", code: "NM", capital: "Bouar", leader: "Bouar Trade Link", pop: "300K" }
    ]
  },
  {
    id: "TCD", code: "TD", name: "Chad", capital: "N'Djamena", region: "Africa",
    population: "18.3M", currency: "XAF (FCFA)", lat: 15.4542, lon: 18.7322,
    about: "Chad is a cross-regional hub linking Central and North Africa, expanding mobile broadband coverage and electronic payment corridors.",
    leader: "Tchad Monnaie", leaderType: "product",
    states: [
      { id: "TD-NDJ", name: "N'Djamena Capital", code: "NDJ", capital: "N'Djamena", leader: "Tchad Monnaie", pop: "1.6M" },
      { id: "TD-CB", name: "Chari-Baguirmi", code: "CB", capital: "Massenya", leader: "Chari Valley Tech", pop: "700K" },
      { id: "TD-LO", name: "Logone Occidental (Moundou)", code: "LO", capital: "Moundou", leader: "Moundou Industrial", pop: "800K" },
      { id: "TD-OD", name: "Ouaddaï (Abéché)", code: "OD", capital: "Abéché", leader: "Abéché Caravan Cloud", pop: "950K" }
    ]
  },
  {
    id: "COM", code: "KM", name: "Comoros", capital: "Moroni", region: "Africa",
    population: "852K", currency: "KMF (CF)", lat: -11.8753, lon: 43.8722,
    about: "Comoros is an Indian Ocean archipelago advancing submarine fiber cable interconnections and renewable solar microgrids.",
    leader: "Huri Money", leaderType: "product",
    states: [
      { id: "KM-G", name: "Grande Comore (Ngazidja)", code: "G", capital: "Moroni", leader: "Huri Money", pop: "420K" },
      { id: "KM-A", name: "Anjouan (Nzwani)", code: "A", capital: "Mutsamudu", leader: "Anjouan Commerce", pop: "340K" },
      { id: "KM-M", name: "Mohéli (Mwali)", code: "M", capital: "Fomboni", leader: "Mohéli Marine AI", pop: "60K" }
    ]
  },
  {
    id: "COG", code: "CG", name: "Republic of the Congo", capital: "Brazzaville", region: "Africa",
    population: "6.1M", currency: "XAF (FCFA)", lat: -0.228, lon: 15.8277,
    about: "Republic of the Congo features the commercial deep-water port hub of Pointe-Noire and the administrative capital Brazzaville connected by high-speed fiber.",
    leader: "BrazzaPay", leaderType: "product",
    states: [
      { id: "CG-BZV", name: "Brazzaville Department", code: "BZV", capital: "Brazzaville", leader: "BrazzaPay", pop: "2.1M" },
      { id: "CG-PNR", name: "Pointe-Noire", code: "PNR", capital: "Pointe-Noire", leader: "Atlantic Cyber Port", pop: "1.2M" },
      { id: "CG-POL", name: "Pool Department", code: "POL", capital: "Kinkala", leader: "Kinkala AgroNet", pop: "350K" },
      { id: "CG-NIA", name: "Niari", code: "NIA", capital: "Dolisie", leader: "Dolisie Logistics", pop: "300K" }
    ]
  },
  {
    id: "COD", code: "CD", name: "Democratic Republic of the Congo", capital: "Kinshasa", region: "Africa",
    population: "102.3M", currency: "CDF (FC)", lat: -4.0383, lon: 21.7587,
    about: "Democratic Republic of the Congo is Africa's second largest country, with a mega-metropolitan tech market in Kinshasa and crucial mineral supply hubs in Katanga.",
    leader: "Kinshasa Digital Academy", leaderType: "product",
    states: [
      { id: "CD-KN", name: "Kinshasa City-Province", code: "KN", capital: "Kinshasa", leader: "Kinshasa Digital Academy", pop: "17.0M" },
      { id: "CD-HK", name: "Haut-Katanga (Lubumbashi)", code: "HK", capital: "Lubumbashi", leader: "Copperbelt Tech", pop: "6.0M" },
      { id: "CD-NK", name: "North Kivu (Goma)", code: "NK", capital: "Goma", leader: "Goma Innovation Hub", pop: "8.1M" },
      { id: "CD-KC", name: "Kongo Central (Matadi)", code: "KC", capital: "Matadi", leader: "Matadi Ocean Gateway", pop: "6.8M" },
      { id: "CD-SK", name: "South Kivu (Bukavu)", code: "SK", capital: "Bukavu", leader: "Bukavu Cyber Lab", pop: "7.0M" }
    ]
  },
  {
    id: "CIV", code: "CI", name: "Côte d’Ivoire", capital: "Yamoussoukro", region: "Africa",
    population: "29.4M", currency: "XOF (CFA)", lat: 7.54, lon: -5.5471,
    about: "Côte d’Ivoire is the economic powerhouse of Francophone West Africa, with Abidjan hosting premier startup accelerators, regional bank HQs, and venture funds.",
    leader: "Wave CI", leaderType: "product",
    states: [
      { id: "CI-AB", name: "Abidjan Autonomous District", code: "AB", capital: "Abidjan", leader: "Wave CI", pop: "6.3M" },
      { id: "CI-ZA", name: "Yamoussoukro Autonomous District", code: "ZA", capital: "Yamoussoukro", leader: "Yamoussoukro Polytech", pop: "400K" },
      { id: "CI-BS", name: "Bas-Sassandra (San-Pédro)", code: "BS", capital: "San-Pédro", leader: "San-Pédro Port Link", pop: "2.7M" },
      { id: "CI-VB", name: "Vallée du Bandama (Bouaké)", code: "VB", capital: "Bouaké", leader: "Bouaké Commerce Hub", pop: "2.0M" },
      { id: "CI-HT", name: "Haut-Sassandra (Daloa)", code: "HT", capital: "Daloa", leader: "Daloa Cocoa Cloud", pop: "1.9M" }
    ]
  },
  {
    id: "DJI", code: "DJ", name: "Djibouti", capital: "Djibouti City", region: "Africa",
    population: "1.1M", currency: "DJF (Fdj)", lat: 11.8251, lon: 42.5903,
    about: "Djibouti is a strategic maritime and undersea telecom cable nexus linking Europe, the Middle East, East Africa, and Asia.",
    leader: "Djibouti Telecom Data Hub", leaderType: "product",
    states: [
      { id: "DJ-DJ", name: "Djibouti City", code: "DJ", capital: "Djibouti City", leader: "Djibouti Telecom Data Hub", pop: "700K" },
      { id: "DJ-AS", name: "Ali Sabieh", code: "AS", capital: "Ali Sabieh", leader: "Ali Sabieh Rail Net", pop: "100K" },
      { id: "DJ-TA", name: "Tadjoura", code: "TA", capital: "Tadjoura", leader: "Tadjoura Port Cloud", pop: "110K" },
      { id: "DJ-OB", name: "Obock", code: "OB", capital: "Obock", leader: "Bab-el-Mandeb Beacon", pop: "50K" }
    ]
  },
  {
    id: "EGY", code: "EG", name: "Egypt", capital: "Cairo", region: "Africa",
    population: "112.7M", currency: "EGP (E£)", lat: 26.8206, lon: 30.8025,
    about: "Egypt is North Africa's tech heartland, combining deep engineering talent pools in Cairo's Smart Village with massive electronic payment networks like Fawry.",
    leader: "Fawry Pay", leaderType: "product",
    states: [
      { id: "EG-C", name: "Cairo (Smart Village)", code: "C", capital: "Cairo", leader: "Fawry Pay", pop: "10.2M" },
      { id: "EG-ALX", name: "Alexandria", code: "ALX", capital: "Alexandria", leader: "Alexandria MedTech", pop: "5.4M" },
      { id: "EG-GZ", name: "Giza Governorate", code: "GZ", capital: "Giza", leader: "Pyramid AI Lab", pop: "9.2M" },
      { id: "EG-DK", name: "Dakahlia (Mansoura)", code: "DK", capital: "Mansoura", leader: "Delta Tech Labs", pop: "7.0M" },
      { id: "EG-PTS", name: "Port Said", code: "PTS", capital: "Port Said", leader: "Suez Canal Logistics AI", pop: "800K" },
      { id: "EG-BA", name: "Red Sea (Hurghada)", code: "BA", capital: "Hurghada", leader: "Red Sea Nomad Hub", pop: "400K" },
      { id: "EG-JS", name: "South Sinai (Sharm El Sheikh)", code: "JS", capital: "El Tor", leader: "Sharm Digital Green", pop: "120K" },
      { id: "EG-LX", name: "Luxor Governorate", code: "LX", capital: "Luxor", leader: "Luxor Heritage AI", pop: "1.4M" }
    ]
  },
  {
    id: "GNQ", code: "GQ", name: "Equatorial Guinea", capital: "Malabo", region: "Africa",
    population: "1.7M", currency: "XAF (FCFA)", lat: 1.6508, lon: 10.2679,
    about: "Equatorial Guinea features modern insular infrastructure in Malabo and the growing mainland port city of Bata.",
    leader: "Malabo Hub", leaderType: "product",
    states: [
      { id: "GQ-BN", name: "Bioko Norte (Malabo)", code: "BN", capital: "Malabo", leader: "Malabo Hub", pop: "400K" },
      { id: "GQ-LI", name: "Litoral (Bata)", code: "LI", capital: "Bata", leader: "Bata Mainland Link", pop: "500K" },
      { id: "GQ-KN", name: "Kié-Ntem", code: "KN", capital: "Ebebiyín", leader: "Ebebiyín Border Net", pop: "250K" },
      { id: "GQ-WN", name: "Wele-Nzas", code: "WN", capital: "Mongomo", leader: "Oyala Smart City Lab", pop: "230K" }
    ]
  },
  {
    id: "ERI", code: "ER", name: "Eritrea", capital: "Asmara", region: "Africa",
    population: "3.7M", currency: "ERN (Nfk)", lat: 15.1794, lon: 39.7823,
    about: "Eritrea is an East African nation along the Red Sea, centered on the UNESCO heritage capital of Asmara and port city of Massawa.",
    leader: "EriTel", leaderType: "product",
    states: [
      { id: "ER-MA", name: "Maekel (Asmara Central)", code: "MA", capital: "Asmara", leader: "EriTel", pop: "1.1M" },
      { id: "ER-SK", name: "Northern Red Sea (Massawa)", code: "SK", capital: "Massawa", leader: "Massawa Marine Net", pop: "600K" },
      { id: "ER-DU", name: "Debub (Mendefera)", code: "DU", capital: "Mendefera", leader: "Debub AgroTech", pop: "1.0M" },
      { id: "ER-AN", name: "Anseba (Keren)", code: "AN", capital: "Keren", leader: "Keren Trade Hub", pop: "700K" }
    ]
  },
  {
    id: "SWZ", code: "SZ", name: "Eswatini", capital: "Mbabane", region: "Africa",
    population: "1.2M", currency: "SZL (L)", lat: -26.5225, lon: 31.4659,
    about: "Eswatini is developing the Royal Science & Technology Park (RSTP) in Nokwane, expanding biotech and ICT infrastructure.",
    leader: "RSTP Nokwane", leaderType: "product",
    states: [
      { id: "SZ-HH", name: "Hhohho (Mbabane)", code: "HH", capital: "Mbabane", leader: "RSTP Nokwane", pop: "340K" },
      { id: "SZ-MA", name: "Manzini (Hub City)", code: "MA", capital: "Manzini", leader: "Manzini Industrial Cloud", pop: "380K" },
      { id: "SZ-LU", name: "Lubombo (Siteki)", code: "LU", capital: "Siteki", leader: "Lubombo SugarNet", pop: "240K" },
      { id: "SZ-SH", name: "Shiselweni (Nhlangano)", code: "SH", capital: "Nhlangano", leader: "Southern Valley Tech", pop: "220K" }
    ]
  },
  {
    id: "ETH", code: "ET", name: "Ethiopia", capital: "Addis Ababa", region: "Africa",
    population: "126.5M", currency: "ETB (Br)", lat: 9.145, lon: 40.4897,
    about: "Ethiopia is Africa's second most populous nation, rapidly digitizing with Telebirr, Safaricom Ethiopia, and Addis Ababa's ICT Park.",
    leader: "Telebirr Core", leaderType: "product",
    states: [
      { id: "ET-AA", name: "Addis Ababa (ICT Park)", code: "AA", capital: "Addis Ababa", leader: "Telebirr Core", pop: "5.4M" },
      { id: "ET-OR", name: "Oromia Region", code: "OR", capital: "Sheger", leader: "Oromia FinNet", pop: "38.0M" },
      { id: "ET-AM", name: "Amhara Region", code: "AM", capital: "Bahir Dar", leader: "Lake Tana Digital", pop: "23.0M" },
      { id: "ET-SO", name: "Somali Region (Jigjiga)", code: "SO", capital: "Jigjiga", leader: "Jigjiga Border Tech", pop: "7.0M" },
      { id: "ET-TI", name: "Tigray (Mekelle)", code: "TI", capital: "Mekelle", leader: "Mekelle Tech Labs", pop: "5.8M" },
      { id: "ET-SI", name: "Sidama (Hawassa)", code: "SI", capital: "Hawassa", leader: "Hawassa Industrial Cloud", pop: "4.5M" },
      { id: "ET-DD", name: "Dire Dawa Administration", code: "DD", capital: "Dire Dawa", leader: "Dire Dawa Trade Gateway", pop: "600K" }
    ]
  },
  {
    id: "GAB", code: "GA", name: "Gabon", capital: "Libreville", region: "Africa",
    population: "2.4M", currency: "XAF (FCFA)", lat: -0.8037, lon: 11.6094,
    about: "Gabon is an equatorial Atlantic nation with high urban connectivity in Libreville and Mandji Special Economic Zone.",
    leader: "SingTech Libreville", leaderType: "product",
    states: [
      { id: "GA-1", name: "Estuaire (Libreville)", code: "1", capital: "Libreville", leader: "SingTech Libreville", pop: "900K" },
      { id: "GA-8", name: "Ogooué-Maritime (Port-Gentil)", code: "8", capital: "Port-Gentil", leader: "Mandji Energy Net", pop: "250K" },
      { id: "GA-2", name: "Haut-Ogooué (Franceville)", code: "2", capital: "Franceville", leader: "Franceville Science Core", pop: "300K" },
      { id: "GA-9", name: "Woleu-Ntem (Oyem)", code: "9", capital: "Oyem", leader: "Northern Border Trade", pop: "200K" }
    ]
  },
  {
    id: "GMB", code: "GM", name: "Gambia", capital: "Banjul", region: "Africa",
    population: "2.7M", currency: "GMD (D)", lat: 13.4432, lon: -15.3101,
    about: "The Gambia, stretching along the Gambia River, is scaling digital financial tools and telecom hubs across Banjul and Serrekunda.",
    leader: "QMoney Gambia", leaderType: "product",
    states: [
      { id: "GM-B", name: "Banjul Capital", code: "B", capital: "Banjul", leader: "QMoney Gambia", pop: "80K" },
      { id: "GM-K", name: "Kanifing (Serrekunda)", code: "K", capital: "Kanifing", leader: "Serrekunda Tech Hub", pop: "500K" },
      { id: "GM-W", name: "West Coast (Brikama)", code: "W", capital: "Brikama", leader: "Brikama Digital", pop: "800K" },
      { id: "GM-N", name: "North Bank (Kerewan)", code: "N", capital: "Kerewan", leader: "Riverine AgroTech", pop: "300K" }
    ]
  },
  {
    id: "GHA", code: "GH", name: "Ghana", capital: "Accra", region: "Africa",
    population: "34.1M", currency: "GHS (GH₵)", lat: 7.9465, lon: -1.0232,
    about: "Ghana is West Africa's Silicon Gateway, featuring the Google AI Research Lab in Accra, Flutterwave and Paystack processing hubs, and the vibrant Meltwater MEST community.",
    leader: "MEST Africa Core", leaderType: "product",
    states: [
      { id: "GH-AA", name: "Greater Accra Region", code: "AA", capital: "Accra", leader: "MEST Africa Core", pop: "5.5M" },
      { id: "GH-AH", name: "Ashanti (Kumasi)", code: "AH", capital: "Kumasi", leader: "Kumasi Hive", pop: "5.9M" },
      { id: "GH-WP", name: "Western (Sekondi-Takoradi)", code: "WP", capital: "Takoradi", leader: "Takoradi Oil & Port Tech", pop: "2.3M" },
      { id: "GH-CP", name: "Central (Cape Coast)", code: "CP", capital: "Cape Coast", leader: "Cape Coast EdTech", pop: "2.8M" },
      { id: "GH-EP", name: "Eastern (Koforidua)", code: "EP", capital: "Koforidua", leader: "Koforidua Code Labs", pop: "3.3M" },
      { id: "GH-NP", name: "Northern (Tamale)", code: "NP", capital: "Tamale", leader: "Savanna AgTech Tamale", pop: "2.3M" }
    ]
  },
  {
    id: "GIN", code: "GN", name: "Guinea", capital: "Conakry", region: "Africa",
    population: "14.2M", currency: "GNF (FG)", lat: 9.9456, lon: -9.6966,
    about: "Guinea is developing major coastal fiber optic connectivity in Conakry and mining supply intelligence systems in Boké.",
    leader: "Orange Money Guinée", leaderType: "product",
    states: [
      { id: "GN-C", name: "Conakry Special Zone", code: "C", capital: "Conakry", leader: "Orange Money Guinée", pop: "2.3M" },
      { id: "GN-B", name: "Boké Region", code: "B", capital: "Boké", leader: "Boké Bauxite Cloud", pop: "1.4M" },
      { id: "GN-K", name: "Kindia Region", code: "K", capital: "Kindia", leader: "Kindia AgroNet", pop: "1.9M" },
      { id: "GN-N", name: "Nzérékoré (Forestière)", code: "N", capital: "Nzérékoré", leader: "Nzérékoré Trade Link", pop: "1.9M" },
      { id: "GN-KA", name: "Kankan Region", code: "KA", capital: "Kankan", leader: "Milo River Tech", pop: "2.3M" }
    ]
  },
  {
    id: "GNB", code: "GW", name: "Guinea-Bissau", capital: "Bissau", region: "Africa",
    population: "2.1M", currency: "XOF (CFA)", lat: 11.8037, lon: -15.1804,
    about: "Guinea-Bissau is a West African nation linking coastal cashew trade networks with mobile payment systems in Bissau.",
    leader: "GuinéTelecom", leaderType: "product",
    states: [
      { id: "GW-BS", name: "Bissau Autonomous Sector", code: "BS", capital: "Bissau", leader: "GuinéTelecom", pop: "500K" },
      { id: "GW-BA", name: "Bafatá Region", code: "BA", capital: "Bafatá", leader: "Bafatá Valley AI", pop: "300K" },
      { id: "GW-GA", name: "Gabú Region", code: "GA", capital: "Gabú", leader: "Gabú Trade Hub", pop: "280K" },
      { id: "GW-CA", name: "Cacheu Region", code: "CA", capital: "Cacheu", leader: "Cacheu Mangrove Net", pop: "250K" }
    ]
  },
  {
    id: "KEN", code: "KE", name: "Kenya", capital: "Nairobi", region: "Africa",
    population: "55.1M", currency: "KES (KSh)", lat: -0.0236, lon: 37.9062,
    about: "Kenya is the Silicon Savannah of East Africa, celebrated worldwide as the birthplace of mobile money innovation with M-Pesa.",
    leader: "M-Pesa Gateway", leaderType: "product",
    states: [
      { id: "KE-30", name: "Nairobi (Silicon Savannah)", code: "NBO", capital: "Nairobi", leader: "M-Pesa Gateway", pop: "4.8M" },
      { id: "KE-28", name: "Mombasa County", code: "MBA", capital: "Mombasa", leader: "Kilindini Harbor Tech", pop: "1.4M" },
      { id: "KE-20", name: "Kisumu County", code: "KSM", capital: "Kisumu", leader: "Lake Basin AI", pop: "1.2M" },
      { id: "KE-32", name: "Nakuru County", code: "NKU", capital: "Nakuru", leader: "Rift Valley Hub", pop: "2.3M" },
      { id: "KE-22", name: "Kiambu County", code: "KBU", capital: "Kiambu", leader: "Thika Tech Corridor", pop: "2.5M" },
      { id: "KE-44", name: "Uasin Gishu (Eldoret)", code: "UG", capital: "Eldoret", leader: "Highlands Innovation", pop: "1.3M" },
      { id: "KE-24", name: "Machakos County", code: "MCK", capital: "Machakos", leader: "Konza Technopolis City", pop: "1.5M" }
    ]
  },
  {
    id: "LSO", code: "LS", name: "Lesotho", capital: "Maseru", region: "Africa",
    population: "2.3M", currency: "LSL (L)", lat: -29.6099, lon: 28.2336,
    about: "Lesotho, the Mountain Kingdom, is building high-altitude hydro-energy telemetry and mobile banking hubs in Maseru.",
    leader: "EcoCash Lesotho", leaderType: "product",
    states: [
      { id: "LS-A", name: "Maseru District", code: "A", capital: "Maseru", leader: "EcoCash Lesotho", pop: "600K" },
      { id: "LS-C", name: "Leribe District", code: "C", capital: "Hlotse", leader: "Hlotse AgroTech", pop: "400K" },
      { id: "LS-D", name: "Berea District", code: "D", capital: "Teyateyaneng", leader: "TY Craft & Tech", pop: "300K" },
      { id: "LS-E", name: "Mafeteng District", code: "E", capital: "Mafeteng", leader: "Mafeteng Solar Net", pop: "250K" }
    ]
  },
  {
    id: "LBR", code: "LR", name: "Liberia", capital: "Monrovia", region: "Africa",
    population: "5.4M", currency: "LRD ($)", lat: 6.4281, lon: -9.4295,
    about: "Liberia is expanding its coastal digital economy around Monrovia with underwater cable landings and mobile money platforms.",
    leader: "Lonestar Mobile Money", leaderType: "product",
    states: [
      { id: "LR-MO", name: "Montserrado (Monrovia)", code: "MO", capital: "Monrovia", leader: "Lonestar Mobile Money", pop: "1.8M" },
      { id: "LR-NI", name: "Nimba County", code: "NI", capital: "Sanniquellie", leader: "Nimba Mining Tech", pop: "600K" },
      { id: "LR-BG", name: "Bong County", code: "BG", capital: "Gbarnga", leader: "Gbarnga Knowledge Center", pop: "450K" },
      { id: "LR-GB", name: "Grand Bassa", code: "GB", capital: "Buchanan", leader: "Buchanan Port Link", pop: "300K" }
    ]
  },
  {
    id: "LBY", code: "LY", name: "Libya", capital: "Tripoli", region: "Africa",
    population: "6.9M", currency: "LYD (ل.د)", lat: 26.3351, lon: 17.2283,
    about: "Libya is connecting Tripoli and Benghazi via high-capacity Mediterranean fiber cables and expanding sovereign digital banking.",
    leader: "Sadad Payment", leaderType: "product",
    states: [
      { id: "LY-TR", name: "Tripoli District", code: "TR", capital: "Tripoli", leader: "Sadad Payment", pop: "1.8M" },
      { id: "LY-BA", name: "Benghazi District", code: "BA", capital: "Benghazi", leader: "Cyrenaica Tech", pop: "900K" },
      { id: "LY-MI", name: "Misrata District", code: "MI", capital: "Misrata", leader: "Misrata Free Zone Net", pop: "650K" },
      { id: "LY-ZA", name: "Zawiya District", code: "ZA", capital: "Zawiya", leader: "Zawiya Energy AI", pop: "350K" },
      { id: "LY-SB", name: "Sabha (Fezzan)", code: "SB", capital: "Sabha", leader: "Sahara Oasis Net", pop: "250K" }
    ]
  },
  {
    id: "MDG", code: "MG", name: "Madagascar", capital: "Antananarivo", region: "Africa",
    population: "30.3M", currency: "MGA (Ar)", lat: -18.7669, lon: 46.8691,
    about: "Madagascar is an Indian Ocean software engineering and BPO superpower, fueled by high-speed fiber cables into Antananarivo.",
    leader: "Mvola Payments", leaderType: "product",
    states: [
      { id: "MG-T", name: "Analamanga (Antananarivo)", code: "T", capital: "Antananarivo", leader: "Mvola Payments", pop: "4.2M" },
      { id: "MG-A", name: "Atsinanana (Toamasina)", code: "A", capital: "Toamasina", leader: "Toamasina Port Hub", pop: "1.6M" },
      { id: "MG-V", name: "Vakinankaratra (Antsirabe)", code: "V", capital: "Antsirabe", leader: "Antsirabe AgroLabs", pop: "2.2M" },
      { id: "MG-M", name: "Boeny (Mahajanga)", code: "M", capital: "Mahajanga", leader: "Mozambique Channel Tech", pop: "1.1M" }
    ]
  },
  {
    id: "MWI", code: "MW", name: "Malawi", capital: "Lilongwe", region: "Africa",
    population: "20.9M", currency: "MWK (MK)", lat: -13.2543, lon: 34.3015,
    about: "Malawi is expanding drone delivery corridors and rural mobile fintech connecting Lilongwe with the southern commercial pole of Blantyre.",
    leader: "TNM Mpamba", leaderType: "product",
    states: [
      { id: "MW-LI", name: "Lilongwe District", code: "LI", capital: "Lilongwe", leader: "TNM Mpamba", pop: "2.8M" },
      { id: "MW-BL", name: "Blantyre District", code: "BL", capital: "Blantyre", leader: "Chichiri Tech Park", pop: "1.4M" },
      { id: "MW-MZ", name: "Mzimba (Mzuzu)", code: "MZ", capital: "Mzuzu", leader: "Mzuzu University Lab", pop: "1.2M" },
      { id: "MW-ZO", name: "Zomba District", code: "ZO", capital: "Zomba", leader: "Chilwa Academic Net", pop: "900K" }
    ]
  },
  {
    id: "MLI", code: "ML", name: "Mali", capital: "Bamako", region: "Africa",
    population: "23.3M", currency: "XOF (CFA)", lat: 17.5707, lon: -3.9962,
    about: "Mali is centered on the Niger River valley with a vibrant young developer and mobile money ecosystem in Bamako.",
    leader: "Orange Money Mali", leaderType: "product",
    states: [
      { id: "ML-BKO", name: "Bamako Capital District", code: "BKO", capital: "Bamako", leader: "Orange Money Mali", pop: "3.5M" },
      { id: "ML-3", name: "Sikasso Region", code: "3", capital: "Sikasso", leader: "Kenedougou AgroTech", pop: "3.2M" },
      { id: "ML-4", name: "Ségou Region", code: "4", capital: "Ségou", leader: "Balanzan Digital Hub", pop: "2.8M" },
      { id: "ML-2", name: "Koulikoro Region", code: "2", capital: "Koulikoro", leader: "Mandiing Tech Net", pop: "2.9M" }
    ]
  },
  {
    id: "MRT", code: "MR", name: "Mauritania", capital: "Nouakchott", region: "Africa",
    population: "4.9M", currency: "MRU (UM)", lat: 21.0079, lon: -10.9408,
    about: "Mauritania connects the Maghreb and Sub-Saharan Africa, modernizing Atlantic deep-sea trade and banking in Nouakchott and Nouadhibou.",
    leader: "Bankily Pay", leaderType: "product",
    states: [
      { id: "MR-NO", name: "Nouakchott Ouest", code: "NO", capital: "Nouakchott", leader: "Bankily Pay", pop: "700K" },
      { id: "MR-08", name: "Dakhlet Nouadhibou", code: "08", capital: "Nouadhibou", leader: "Nouadhibou Free Port AI", pop: "200K" },
      { id: "MR-06", name: "Trarza (Rosso)", code: "06", capital: "Rosso", leader: "Senegal River Gate", pop: "350K" },
      { id: "MR-05", name: "Brakna (Aleg)", code: "05", capital: "Aleg", leader: "Aleg Central Cloud", pop: "360K" }
    ]
  },
  {
    id: "MUS", code: "MU", name: "Mauritius", capital: "Port Louis", region: "Africa",
    population: "1.3M", currency: "MUR (₨)", lat: -20.3484, lon: 57.5522,
    about: "Mauritius is the premier international financial centre of Africa, home to the Cybercity at Ébène and cutting-edge fintech sandboxes.",
    leader: "Ébène Cybercity Hub", leaderType: "product",
    states: [
      { id: "MU-PW", name: "Plaines Wilhems (Ébène Cybercity)", code: "PW", capital: "Rose Hill", leader: "Ébène Cybercity Hub", pop: "400K" },
      { id: "MU-PL", name: "Port Louis District", code: "PL", capital: "Port Louis", leader: "Mauritius Stock Net", pop: "130K" },
      { id: "MU-GP", name: "Grand Port (Airport Tech)", code: "GP", capital: "Mahébourg", leader: "Mahébourg AeroTech", pop: "120K" },
      { id: "MU-PA", name: "Pamplemousses", code: "PA", capital: "Triolet", leader: "North Island BioTech", pop: "150K" },
      { id: "MU-BL", name: "Black River (Tamarin)", code: "BL", capital: "Bambous", leader: "Tamarin Smart City", pop: "90K" }
    ]
  },
  {
    id: "MAR", code: "MA", name: "Morocco", capital: "Rabat", region: "Africa",
    population: "37.8M", currency: "MAD (د.م.)", lat: 31.7917, lon: -7.0926,
    about: "Morocco is an African and Mediterranean tech giant, home to Casablanca Finance City, Tanger Med smart megaport, and Mohammed VI Polytechnic University (UM6P).",
    leader: "Casablanca Finance City", leaderType: "product",
    states: [
      { id: "MA-06", name: "Casablanca-Settat", code: "06", capital: "Casablanca", leader: "Casablanca Finance City", pop: "7.6M" },
      { id: "MA-04", name: "Rabat-Salé-Kénitra", code: "04", capital: "Rabat", leader: "Technopolis Rabat", pop: "4.8M" },
      { id: "MA-07", name: "Marrakech-Safi", code: "07", capital: "Marrakech", leader: "Marrakech Gitex Hub", pop: "4.7M" },
      { id: "MA-01", name: "Tanger-Tétouan-Al Hoceïma", code: "01", capital: "Tangier", leader: "Tanger Med Smart Port", pop: "3.8M" },
      { id: "MA-03", name: "Fès-Meknès", code: "03", capital: "Fez", leader: "Fez Heritage AI", pop: "4.4M" },
      { id: "MA-09", name: "Souss-Massa (Agadir)", code: "09", capital: "Agadir", leader: "Agadir Tech Valley", pop: "2.8M" }
    ]
  },
  {
    id: "MOZ", code: "MZ", name: "Mozambique", capital: "Maputo", region: "Africa",
    population: "33.9M", currency: "MZN (MT)", lat: -18.6657, lon: 35.5296,
    about: "Mozambique features extensive Indian Ocean coastlines with rapid digital payment expansion linking Maputo with the Nacala Corridor.",
    leader: "M-Pesa Mozambique", leaderType: "product",
    states: [
      { id: "MZ-MPM", name: "Maputo Cidade", code: "MPM", capital: "Maputo", leader: "M-Pesa Mozambique", pop: "1.2M" },
      { id: "MZ-MPL", name: "Maputo Província (Matola)", code: "MPL", capital: "Matola", leader: "Matola Industrial Hub", pop: "2.5M" },
      { id: "MZ-NPL", name: "Nampula Province", code: "NPL", capital: "Nampula", leader: "Nampula Northern Core", pop: "6.1M" },
      { id: "MZ-SOF", name: "Sofala (Beira)", code: "SOF", capital: "Beira", leader: "Beira Coastal Gateway", pop: "2.5M" },
      { id: "MZ-CDG", name: "Cabo Delgado (Pemba)", code: "CDG", capital: "Pemba", leader: "Rovuma Energy Tech", pop: "2.4M" }
    ]
  },
  {
    id: "NAM", code: "NA", name: "Namibia", capital: "Windhoek", region: "Africa",
    population: "2.6M", currency: "NAD (N$)", lat: -22.9576, lon: 18.4904,
    about: "Namibia is pioneering green hydrogen telemetry, digital nomad initiatives in Swakopmund, and high-speed enterprise cloud in Windhoek.",
    leader: "MTC Namibia", leaderType: "product",
    states: [
      { id: "NA-KH", name: "Khomas (Windhoek)", code: "KH", capital: "Windhoek", leader: "MTC Namibia", pop: "460K" },
      { id: "NA-ER", name: "Erongo (Walvis Bay / Swakopmund)", code: "ER", capital: "Swakopmund", leader: "Walvis Bay Ocean Net", pop: "200K" },
      { id: "NA-OT", name: "Otjozondjupa", code: "OT", capital: "Otjiwarongo", leader: "Central Plateau Tech", pop: "170K" },
      { id: "NA-ON", name: "Oshana (Oshakati)", code: "ON", capital: "Oshakati", leader: "Northern Commercial Hub", pop: "200K" }
    ]
  },
  {
    id: "NER", code: "NE", name: "Niger", capital: "Niamey", region: "Africa",
    population: "27.2M", currency: "XOF (CFA)", lat: 17.6078, lon: 8.0817,
    about: "Niger is advancing satellite communications across its vast Saharan terrain, centered in the university and tech institutes of Niamey.",
    leader: "Airtel Money Niger", leaderType: "product",
    states: [
      { id: "NE-8", name: "Niamey Urban Community", code: "8", capital: "Niamey", leader: "Airtel Money Niger", pop: "1.4M" },
      { id: "NE-7", name: "Zinder Region", code: "7", capital: "Zinder", leader: "Damagaram Digital", pop: "4.3M" },
      { id: "NE-4", name: "Maradi Region", code: "4", capital: "Maradi", leader: "Maradi Trade Hub", pop: "4.2M" },
      { id: "NE-1", name: "Agadez Region", code: "1", capital: "Agadez", leader: "Air Solar & Satellite", pop: "650K" }
    ]
  },
  {
    id: "NGA", code: "NG", name: "Nigeria", capital: "Abuja", region: "Africa",
    population: "223.8M", currency: "NGN (₦)", lat: 9.082, lon: 8.6753,
    about: "Nigeria is the undisputed fintech giant of Africa, housing Yaba's Silicon Lagoon in Lagos, home to multiple unicorns including Paystack, Flutterwave, and Moniepoint.",
    leader: "Moniepoint Core", leaderType: "product",
    states: [
      { id: "NG-LA", name: "Lagos (Yaba Silicon Lagoon)", code: "LA", capital: "Ikeja", leader: "Moniepoint Core", pop: "16.0M" },
      { id: "NG-FC", name: "Abuja Federal Capital Territory", code: "FC", capital: "Abuja", leader: "NITC Abuja Tech", pop: "3.8M" },
      { id: "NG-RI", name: "Rivers (Port Harcourt)", code: "RI", capital: "Port Harcourt", leader: "Niger Delta Tech Hub", pop: "7.5M" },
      { id: "NG-KN", name: "Kano State", code: "KN", capital: "Kano", leader: "Kano Commercial Cloud", pop: "15.0M" },
      { id: "NG-OY", name: "Oyo (Ibadan)", code: "OY", capital: "Ibadan", leader: "Ibadan Tech Hub", pop: "8.0M" },
      { id: "NG-KD", name: "Kaduna State", code: "KD", capital: "Kaduna", leader: "KAD ICT Hub", pop: "8.5M" },
      { id: "NG-EN", name: "Enugu State", code: "EN", capital: "Enugu", leader: "Coal City Innovators", pop: "4.7M" },
      { id: "NG-ED", name: "Edo (Benin City)", code: "ED", capital: "Benin City", leader: "EdoBits AI", pop: "4.5M" }
    ]
  },
  {
    id: "RWA", code: "RW", name: "Rwanda", capital: "Kigali", region: "Africa",
    population: "14.1M", currency: "RWF (FRw)", lat: -1.9403, lon: 29.8739,
    about: "Rwanda is the Singapore of Africa, with Kigali Innovation City, Norrsken Kigali House, and government services 100% digitized via Irembo.",
    leader: "Norrsken Kigali", leaderType: "product",
    states: [
      { id: "RW-01", name: "Kigali City (Innovation City)", code: "01", capital: "Kigali", leader: "Norrsken Kigali", pop: "1.3M" },
      { id: "RW-02", name: "Eastern Province (Rwamagana)", code: "02", capital: "Rwamagana", leader: "Eastern Smart Agri", pop: "3.6M" },
      { id: "RW-03", name: "Northern Province (Musanze)", code: "03", capital: "Musanze", leader: "Virunga EcoTech", pop: "2.1M" },
      { id: "RW-04", name: "Western Province (Rubavu)", code: "04", capital: "Rubavu", leader: "Lake Kivu Digital", pop: "2.9M" },
      { id: "RW-05", name: "Southern Province (Huye)", code: "05", capital: "Nyanza", leader: "Huye Academic Hub", pop: "3.1M" }
    ]
  },
  {
    id: "STP", code: "ST", name: "São Tomé and Príncipe", capital: "São Tomé", region: "Africa",
    population: "231K", currency: "STN (Db)", lat: 0.1864, lon: 6.6131,
    about: "São Tomé and Príncipe is an Atlantic island nation building high-speed subsea connectivity and smart island telemetry.",
    leader: "CST São Tomé", leaderType: "product",
    states: [
      { id: "ST-AG", name: "Água Grande (São Tomé)", code: "AG", capital: "São Tomé", leader: "CST São Tomé", pop: "80K" },
      { id: "ST-MZ", name: "Mé-Zóchi", code: "MZ", capital: "Trindade", leader: "Trindade Island Cloud", pop: "50K" },
      { id: "ST-PR", name: "Autonomous Region of Príncipe", code: "PR", capital: "Santo António", leader: "Príncipe UNESCO Biosphere Tech", pop: "10K" }
    ]
  },
  {
    id: "SEN", code: "SN", name: "Senegal", capital: "Dakar", region: "Africa",
    population: "17.7M", currency: "XOF (CFA)", lat: 14.4974, lon: -14.4524,
    about: "Senegal is a premier West African digital hub, with Diamniadio Digital City, 2Africa subsea cable landing, and the Wave fintech headquarters.",
    leader: "Diamniadio Digital Hub", leaderType: "product",
    states: [
      { id: "SN-DK", name: "Dakar (Diamniadio Digital City)", code: "DK", capital: "Dakar", leader: "Diamniadio Digital Hub", pop: "4.0M" },
      { id: "SN-TH", name: "Thiès Region", code: "TH", capital: "Thiès", leader: "Thiès Rail & Tech", pop: "2.2M" },
      { id: "SN-SL", name: "Saint-Louis Region", code: "SL", capital: "Saint-Louis", leader: "UGB University Labs", pop: "1.1M" },
      { id: "SN-DB", name: "Diourbel (Touba)", code: "DB", capital: "Diourbel", leader: "Touba Commercial Cloud", pop: "1.8M" },
      { id: "SN-ZG", name: "Ziguinchor (Casamance)", code: "ZG", capital: "Ziguinchor", leader: "Casamance GreenTech", pop: "700K" }
    ]
  },
  {
    id: "SYC", code: "SC", name: "Seychelles", capital: "Victoria", region: "Africa",
    population: "107K", currency: "SCR (SR)", lat: -4.6796, lon: 55.492,
    about: "Seychelles is a high-income archipelagic nation leading sovereign blue-economy bond tracking and digital residency frameworks in Victoria.",
    leader: "Victoria Blue Tech", leaderType: "product",
    states: [
      { id: "SC-MAH", name: "Greater Victoria (Mahé)", code: "MAH", capital: "Victoria", leader: "Victoria Blue Tech", pop: "85K" },
      { id: "SC-PRA", name: "Praslin Island", code: "PRA", capital: "Grand Anse", leader: "Praslin EcoSense", pop: "10K" },
      { id: "SC-LAD", name: "La Digue Island", code: "LAD", capital: "La Passe", leader: "La Digue Clean Mobility", pop: "3.5K" }
    ]
  },
  {
    id: "SLE", code: "SL", name: "Sierra Leone", capital: "Freetown", region: "Africa",
    population: "8.8M", currency: "SLE (Le)", lat: 8.4606, lon: -11.7799,
    about: "Sierra Leone is famous for its Directorate of Science, Technology and Innovation (DSTI) in Freetown implementing blockchain land registries and AI education tools.",
    leader: "DSTI Freetown", leaderType: "product",
    states: [
      { id: "SLE-W", name: "Western Area Urban (Freetown)", code: "W", capital: "Freetown", leader: "DSTI Freetown", pop: "1.3M" },
      { id: "SLE-S", name: "Southern Province (Bo)", code: "S", capital: "Bo", leader: "Bo Learning Lab", pop: "1.5M" },
      { id: "SLE-E", name: "Eastern Province (Kenema)", code: "E", capital: "Kenema", leader: "Kenema AgroTech", pop: "1.7M" },
      { id: "SLE-N", name: "Northern Province (Makeni)", code: "N", capital: "Makeni", leader: "Makeni Innovation", pop: "1.4M" }
    ]
  },
  {
    id: "SOM", code: "SO", name: "Somalia", capital: "Mogadishu", region: "Africa",
    population: "18.1M", currency: "SOS (Sh)", lat: 5.1521, lon: 46.1996,
    about: "Somalia features one of the most cashless societies in the world, with mobile money systems like EVC Plus processing billions in monthly volume.",
    leader: "Hormuud EVC Plus", leaderType: "product",
    states: [
      { id: "SO-BN", name: "Banaadir (Mogadishu)", code: "BN", capital: "Mogadishu", leader: "Hormuud EVC Plus", pop: "2.7M" },
      { id: "SO-PL", name: "Puntland (Garowe)", code: "PL", capital: "Garowe", leader: "Garowe Tech Institute", pop: "2.0M" },
      { id: "SO-SL", name: "Somaliland (Hargeisa)", code: "SL", capital: "Hargeisa", leader: "Zaad Mobile Money", pop: "4.0M" },
      { id: "SO-JL", name: "Jubaland (Kismayo)", code: "JL", capital: "Kismayo", leader: "Kismayo Port Gateway", pop: "1.5M" },
      { id: "SO-GM", name: "Galmudug (Dhusamareb)", code: "GM", capital: "Dhusamareb", leader: "Central Plateau Net", pop: "1.3M" }
    ]
  },
  {
    id: "ZAF", code: "ZA", name: "South Africa", capital: "Pretoria", region: "Africa",
    population: "60.4M", currency: "ZAR (R)", lat: -30.5595, lon: 22.9375,
    about: "South Africa is the industrial and technological titan of the continent, featuring the 'Silicon Cape' in Cape Town and the JSE financial powerhouse in Johannesburg.",
    leader: "Silicon Cape Core", leaderType: "product",
    states: [
      { id: "ZA-GT", name: "Gauteng (Johannesburg / Pretoria)", code: "GT", capital: "Johannesburg", leader: "Sandton FinTech Core", pop: "15.8M" },
      { id: "ZA-WC", name: "Western Cape (Cape Town Silicon Cape)", code: "WC", capital: "Cape Town", leader: "Silicon Cape Core", pop: "7.2M" },
      { id: "ZA-NL", name: "KwaZulu-Natal (Durban)", code: "NL", capital: "Pietermaritzburg", leader: "Durban Smart Port", pop: "11.5M" },
      { id: "ZA-EC", name: "Eastern Cape (Gqeberha)", code: "EC", capital: "Bhisho", leader: "Gqeberha AutoTech", pop: "6.7M" },
      { id: "ZA-FS", name: "Free State (Bloemfontein)", code: "FS", capital: "Bloemfontein", leader: "Free State AgroTech", pop: "2.9M" }
    ]
  },
  {
    id: "SSD", code: "SS", name: "South Sudan", capital: "Juba", region: "Africa",
    population: "11.1M", currency: "SSP (£)", lat: 6.877, lon: 31.307,
    about: "South Sudan is expanding cellular connectivity and mobile commerce platforms across Juba and the Nile river trade networks.",
    leader: "m-GURUSH", leaderType: "product",
    states: [
      { id: "SS-CE", name: "Central Equatoria (Juba)", code: "CE", capital: "Juba", leader: "m-GURUSH", pop: "1.5M" },
      { id: "SS-WE", name: "Western Equatoria (Yambio)", code: "WE", capital: "Yambio", leader: "Equatoria GreenNet", pop: "750K" },
      { id: "SS-JG", name: "Jonglei (Bor)", code: "JG", capital: "Bor", leader: "Bor River Logistics", pop: "1.4M" },
      { id: "SS-UN", name: "Upper Nile (Malakal)", code: "UN", capital: "Malakal", leader: "Nile Hub", pop: "1.1M" }
    ]
  },
  {
    id: "SDN", code: "SD", name: "Sudan", capital: "Khartoum", region: "Africa",
    population: "48.1M", currency: "SDG (ج.س.)", lat: 12.8628, lon: 30.2176,
    about: "Sudan connects the Nile basin to the Red Sea, with telecommunications infrastructure in Port Sudan and Khartoum.",
    leader: "Bokhai Mobile Pay", leaderType: "product",
    states: [
      { id: "SD-RS", name: "Red Sea (Port Sudan)", code: "RS", capital: "Port Sudan", leader: "Bokhai Mobile Pay", pop: "1.5M" },
      { id: "SD-KH", name: "Khartoum State", code: "KH", capital: "Khartoum", leader: "Nile Confluence Cloud", pop: "5.5M" },
      { id: "SD-GZ", name: "Al Jazirah (Wad Madani)", code: "GZ", capital: "Wad Madani", leader: "Jazirah AgriNet", pop: "4.2M" },
      { id: "SD-KA", name: "Kassala State", code: "KA", capital: "Kassala", leader: "Kassala Border Net", pop: "2.5M" }
    ]
  },
  {
    id: "TZA", code: "TZ", name: "Tanzania", capital: "Dodoma", region: "Africa",
    population: "67.4M", currency: "TZS (TSh)", lat: -6.369, lon: 34.8888,
    about: "Tanzania is an East African hub, boasting Silicon Dar in Dar es Salaam, Zanzibar's Silicon Zanzibar initiative, and Arusha's safari-tech cluster.",
    leader: "Silicon Zanzibar", leaderType: "product",
    states: [
      { id: "TZ-02", name: "Dar es Salaam (Silicon Dar)", code: "02", capital: "Dar es Salaam", leader: "Silicon Dar", pop: "5.4M" },
      { id: "TZ-15", name: "Zanzibar (Silicon Zanzibar)", code: "15", capital: "Zanzibar City", leader: "Silicon Zanzibar", pop: "1.9M" },
      { id: "TZ-01", name: "Arusha Region", code: "01", capital: "Arusha", leader: "Kilimanjaro Tech Hub", pop: "2.3M" },
      { id: "TZ-03", name: "Dodoma Capital", code: "03", capital: "Dodoma", leader: "Dodoma GovNet", pop: "3.1M" },
      { id: "TZ-14", name: "Mwanza (Lake Victoria)", code: "14", capital: "Mwanza", leader: "Victoria Blue Hub", pop: "3.7M" }
    ]
  },
  {
    id: "TGO", code: "TG", name: "Togo", capital: "Lomé", region: "Africa",
    population: "9.1M", currency: "XOF (CFA)", lat: 8.6195, lon: 0.8248,
    about: "Togo is the home of the Ecobank Pan-African headquarters and the Google Equiano cable landing station in Lomé.",
    leader: "Ecobank Digital", leaderType: "product",
    states: [
      { id: "TG-M", name: "Maritime (Lomé)", code: "M", capital: "Lomé", leader: "Ecobank Digital", pop: "3.0M" },
      { id: "TG-P", name: "Plateaux (Kpalimé)", code: "P", capital: "Atakpamé", leader: "Plateaux Agro Cloud", pop: "1.6M" },
      { id: "TG-C", name: "Centrale (Sokodé)", code: "C", capital: "Sokodé", leader: "Sokodé Regional Hub", pop: "750K" },
      { id: "TG-K", name: "Kara Region", code: "K", capital: "Kara", leader: "Kara University Tech", pop: "900K" }
    ]
  },
  {
    id: "TUN", code: "TN", name: "Tunisia", capital: "Tunis", region: "Africa",
    population: "12.5M", currency: "TND (د.ت)", lat: 33.8869, lon: 9.5375,
    about: "Tunisia passed the landmark Startup Act, driving deeptech and AI innovation through Elgazala Technopark and Tunis AI labs.",
    leader: "InstaDeep Labs", leaderType: "product",
    states: [
      { id: "TN-11", name: "Tunis (Elgazala Technopark)", code: "11", capital: "Tunis", leader: "InstaDeep Labs", pop: "1.1M" },
      { id: "TN-31", name: "Sfax Governorate", code: "31", capital: "Sfax", leader: "Sfax Smart Olive AI", pop: "1.0M" },
      { id: "TN-51", name: "Sousse Governorate", code: "51", capital: "Sousse", leader: "Sahel Technopole", pop: "750K" },
      { id: "TN-12", name: "Ariana", code: "12", capital: "Ariana", leader: "Ariana AI Valley", pop: "650K" },
      { id: "TN-61", name: "Monastir Governorate", code: "61", capital: "Monastir", leader: "Monastir BioTech", pop: "600K" }
    ]
  },
  {
    id: "UGA", code: "UG", name: "Uganda", capital: "Kampala", region: "Africa",
    population: "48.6M", currency: "UGX (USh)", lat: 1.3733, lon: 32.2903,
    about: "Uganda is the Pearl of Africa, with Kampala hosting one of the continent's most dynamic developer ecosystems and solar fintech platforms.",
    leader: "SafeBoda Core", leaderType: "product",
    states: [
      { id: "UG-102", name: "Kampala Capital District", code: "102", capital: "Kampala", leader: "SafeBoda Core", pop: "1.7M" },
      { id: "UG-109", name: "Wakiso District", code: "109", capital: "Wakiso", leader: "Wakiso Tech Strip", pop: "3.1M" },
      { id: "UG-405", name: "Mbarara District", code: "405", capital: "Mbarara", leader: "Western AgroTech", pop: "600K" },
      { id: "UG-209", name: "Jinja District (Source of the Nile)", code: "209", capital: "Jinja", leader: "Nile Energy Cloud", pop: "500K" },
      { id: "UG-303", name: "Gulu District", code: "303", capital: "Gulu", leader: "Acholi Innovation Hub", pop: "400K" }
    ]
  },
  {
    id: "ZMB", code: "ZM", name: "Zambia", capital: "Lusaka", region: "Africa",
    population: "20.6M", currency: "ZMW (ZK)", lat: -13.1339, lon: 27.8493,
    about: "Zambia is establishing itself as a southern African digital asset and EV battery minerals corridor hub, anchored in Lusaka.",
    leader: "Airtel Money Zambia", leaderType: "product",
    states: [
      { id: "ZM-09", name: "Lusaka Province", code: "09", capital: "Lusaka", leader: "Airtel Money Zambia", pop: "3.4M" },
      { id: "ZM-08", name: "Copperbelt (Ndola / Kitwe)", code: "08", capital: "Ndola", leader: "Copperbelt IoT Labs", pop: "2.8M" },
      { id: "ZM-07", name: "Southern (Livingstone)", code: "07", capital: "Livingstone", leader: "Victoria Falls Tourism AI", pop: "1.9M" },
      { id: "ZM-02", name: "Central Province (Kabwe)", code: "02", capital: "Kabwe", leader: "Kabwe Transit Net", pop: "1.8M" }
    ]
  },
  {
    id: "ZWE", code: "ZW", name: "Zimbabwe", capital: "Harare", region: "Africa",
    population: "16.7M", currency: "ZWG (ZiG)", lat: -19.0154, lon: 29.1549,
    about: "Zimbabwe pioneered mobile money in Southern Africa via EcoCash, with Harare hosting substantial software engineering and fintech talent.",
    leader: "EcoCash Zimbabwe", leaderType: "product",
    states: [
      { id: "ZW-HA", name: "Harare Metropolitan", code: "HA", capital: "Harare", leader: "EcoCash Zimbabwe", pop: "2.2M" },
      { id: "ZW-BU", name: "Bulawayo Metropolitan", code: "BU", capital: "Bulawayo", leader: "Bulawayo Rail & Tech", pop: "700K" },
      { id: "ZW-MA", name: "Manicaland (Mutare)", code: "MA", capital: "Mutare", leader: "Eastern Gateway AI", pop: "1.9M" },
      { id: "ZW-MI", name: "Midlands (Gweru)", code: "MI", capital: "Gweru", leader: "Midlands University Lab", pop: "1.8M" }
    ]
  }
];

console.log("Loaded Africa base countries:", countriesData.length);
