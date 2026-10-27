export type VillageOrTown = {
  name: string;
  districtOrState: string;
  type: "Village" | "Town" | "District" | "Municipality" | "Sub-region";
  population?: string;
  status: "Claimed" | "Open Space";
  claimedBy?: string;
  claimAmount?: string;
};

export type Contributor = {
  userName: string;
  avatarUrl?: string;
  amount: string;
  productName: string;
  percentageContribution: number;
};

export type CountryTerritory = {
  id: string;
  name: string;
  code: string;
  region: string;
  capital: string;
  centerLat: number;
  centerLon: number;
  // Border polygon points (lat, lon) for rendering boundary and inward fill
  borderPolygon: [number, number][];
  totalTerritoryArea: string; // e.g. "3.287M km²"
  targetPoolAmount: number;   // Total $ required for 100% border fill
  currentAcquiredAmount: number; // Current pooled $
  acquisitionPercent: number; // 0 - 100%
  dominantLeader: string;
  dominantLogo: string;
  contributors: Contributor[];
  villages: VillageOrTown[];
};

export const WORLD_TERRITORIES: CountryTerritory[] = [
  {
    id: "IND",
    name: "India",
    code: "IN",
    region: "South Asia",
    capital: "New Delhi",
    centerLat: 20.5937,
    centerLon: 78.9629,
    borderPolygon: [
      [35.5, 74.5], [36.0, 78.0], [33.0, 79.5], [31.5, 80.5], [29.5, 81.5],
      [27.5, 88.5], [28.0, 96.5], [26.0, 94.0], [24.0, 92.5], [22.0, 89.0],
      [19.0, 85.0], [15.0, 80.0], [10.5, 79.5], [8.0, 77.5], [10.5, 75.8],
      [15.0, 73.5], [19.0, 72.8], [23.5, 68.5], [27.0, 71.0], [31.0, 74.5],
      [35.5, 74.5]
    ],
    totalTerritoryArea: "3.287M km²",
    targetPoolAmount: 100000,
    currentAcquiredAmount: 76400,
    acquisitionPercent: 76,
    dominantLeader: "Canva",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/0/08/Canva_icon_2021.svg",
    contributors: [
      { userName: "Aarav Sharma", amount: "$24,500", productName: "Canva Pro", percentageContribution: 32 },
      { userName: "Priya Patel", amount: "$18,200", productName: "Razorpay Hub", percentageContribution: 24 },
      { userName: "Vikram Reddy", amount: "$14,800", productName: "Postman API", percentageContribution: 19 },
      { userName: "Ananya Iyer", amount: "$10,900", productName: "Hasura Cloud", percentageContribution: 14 },
      { userName: "Karthik Gowda", amount: "$8,000", productName: "Dukaan Space", percentageContribution: 11 },
    ],
    villages: [
      { name: "Nelamangala", districtOrState: "Bengaluru Rural, Karnataka", type: "Town", population: "37,000", status: "Claimed", claimedBy: "Canva", claimAmount: "$3,200" },
      { name: "Doddaballapura", districtOrState: "Bengaluru Rural, Karnataka", type: "Town", population: "94,000", status: "Claimed", claimedBy: "Razorpay", claimAmount: "$2,800" },
      { name: "Hoskote", districtOrState: "Bengaluru Rural, Karnataka", type: "Municipality", population: "56,000", status: "Open Space", claimAmount: "$1,500" },
      { name: "Channapatna", districtOrState: "Ramanagara, Karnataka", type: "Town", population: "71,000", status: "Open Space", claimAmount: "$1,200" },
      { name: "Kanakapura", districtOrState: "Ramanagara, Karnataka", type: "Municipality", population: "54,000", status: "Claimed", claimedBy: "Hasura", claimAmount: "$2,100" },
      { name: "Magadi", districtOrState: "Ramanagara, Karnataka", type: "Town", population: "27,000", status: "Open Space", claimAmount: "$900" },
      { name: "Malur", districtOrState: "Kolar, Karnataka", type: "Town", population: "32,000", status: "Open Space", claimAmount: "$850" },
      { name: "Anekal", districtOrState: "Bengaluru Urban, Karnataka", type: "Town", population: "44,000", status: "Claimed", claimedBy: "Postman", claimAmount: "$2,600" },
      { name: "Devanahalli", districtOrState: "Bengaluru Rural, Karnataka", type: "Municipality", population: "48,000", status: "Claimed", claimedBy: "Canva", claimAmount: "$4,500" },
      { name: "Sidlaghatta", districtOrState: "Chikkaballapura, Karnataka", type: "Town", population: "42,000", status: "Open Space", claimAmount: "$700" },
      { name: "Bangarapet", districtOrState: "Kolar, Karnataka", type: "Town", population: "44,000", status: "Open Space", claimAmount: "$950" },
      { name: "Gudiyatham", districtOrState: "Vellore, Tamil Nadu", type: "Municipality", population: "91,000", status: "Open Space", claimAmount: "$1,100" },
      { name: "Arakkonam", districtOrState: "Ranipet, Tamil Nadu", type: "Town", population: "78,000", status: "Open Space", claimAmount: "$1,300" },
      { name: "Sriperumbudur", districtOrState: "Kanchipuram, Tamil Nadu", type: "Town", population: "25,000", status: "Claimed", claimedBy: "Razorpay", claimAmount: "$3,400" },
      { name: "Baramati", districtOrState: "Pune, Maharashtra", type: "Town", population: "87,000", status: "Open Space", claimAmount: "$1,800" },
      { name: "Shirwal", districtOrState: "Satara, Maharashtra", type: "Village", population: "14,000", status: "Open Space", claimAmount: "$650" },
      { name: "Mundhwa", districtOrState: "Pune, Maharashtra", type: "Village", population: "19,000", status: "Open Space", claimAmount: "$800" },
      { name: "Sanand", districtOrState: "Ahmedabad, Gujarat", type: "Town", population: "41,000", status: "Claimed", claimedBy: "Dukaan", claimAmount: "$2,200" },
      { name: "Kadi", districtOrState: "Mehsana, Gujarat", type: "Municipality", population: "80,000", status: "Open Space", claimAmount: "$1,100" },
      { name: "Sohna", districtOrState: "Gurugram, Haryana", type: "Town", population: "36,000", status: "Claimed", claimedBy: "Canva", claimAmount: "$3,100" },
      { name: "Manesar", districtOrState: "Gurugram, Haryana", type: "Town", population: "23,000", status: "Claimed", claimedBy: "Razorpay", claimAmount: "$4,200" },
      { name: "Bahadurgarh", districtOrState: "Jhajjar, Haryana", type: "Municipality", population: "170,000", status: "Open Space", claimAmount: "$2,500" },
      { name: "Kundli", districtOrState: "Sonipat, Haryana", type: "Town", population: "28,000", status: "Open Space", claimAmount: "$1,400" },
      { name: "Nandambakkam", districtOrState: "Chennai, Tamil Nadu", type: "Village", population: "12,000", status: "Open Space", claimAmount: "$900" },
      { name: "Thudiyalur", districtOrState: "Coimbatore, Tamil Nadu", type: "Town", population: "33,000", status: "Open Space", claimAmount: "$1,250" },
      { name: "Sulur", districtOrState: "Coimbatore, Tamil Nadu", type: "Town", population: "27,000", status: "Open Space", claimAmount: "$850" },
      { name: "Hinjawadi", districtOrState: "Pune, Maharashtra", type: "Village", population: "24,000", status: "Claimed", claimedBy: "Postman", claimAmount: "$5,100" },
      { name: "Wakad", districtOrState: "Pimpri-Chinchwad, Maharashtra", type: "Town", population: "60,000", status: "Open Space", claimAmount: "$2,400" },
    ],
  },
  {
    id: "USA",
    name: "United States",
    code: "US",
    region: "North America",
    capital: "Washington, D.C.",
    centerLat: 39.8283,
    centerLon: -98.5795,
    borderPolygon: [
      [49.0, -124.5], [49.0, -95.0], [48.0, -89.0], [45.0, -75.0], [45.0, -67.0],
      [41.0, -70.0], [35.0, -75.5], [25.0, -80.0], [30.0, -85.0], [26.0, -97.0],
      [31.5, -106.5], [31.5, -111.0], [32.5, -117.0], [38.0, -123.0], [46.0, -124.0],
      [49.0, -124.5]
    ],
    totalTerritoryArea: "9.834M km²",
    targetPoolAmount: 150000,
    currentAcquiredAmount: 141200,
    acquisitionPercent: 94,
    dominantLeader: "Figma",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
    contributors: [
      { userName: "Dylan Field", amount: "$48,000", productName: "Figma Core", percentageContribution: 34 },
      { userName: "Ivan Zhao", amount: "$38,000", productName: "Notion Team", percentageContribution: 27 },
      { userName: "Guillermo Rauch", amount: "$28,500", productName: "Vercel Edge", percentageContribution: 20 },
      { userName: "Karri Saarinen", amount: "$16,700", productName: "Linear App", percentageContribution: 12 },
      { userName: "Sam Altman", amount: "$10,000", productName: "OpenAI GPT", percentageContribution: 7 },
    ],
    villages: [
      { name: "Palo Alto", districtOrState: "Santa Clara, California", type: "Municipality", population: "68,000", status: "Claimed", claimedBy: "Figma", claimAmount: "$8,500" },
      { name: "Mountain View", districtOrState: "Santa Clara, California", type: "Municipality", population: "82,000", status: "Claimed", claimedBy: "Notion", claimAmount: "$7,800" },
      { name: "Cupertino", districtOrState: "Santa Clara, California", type: "Town", population: "60,000", status: "Claimed", claimedBy: "Vercel", claimAmount: "$7,200" },
      { name: "Los Gatos", districtOrState: "Santa Clara, California", type: "Town", population: "33,000", status: "Claimed", claimedBy: "Figma", claimAmount: "$4,500" },
      { name: "Saratoga", districtOrState: "Santa Clara, California", type: "Town", population: "31,000", status: "Open Space", claimAmount: "$3,600" },
      { name: "Menlo Park", districtOrState: "San Mateo, California", type: "Town", population: "34,000", status: "Claimed", claimedBy: "Notion", claimAmount: "$6,900" },
      { name: "Woodside", districtOrState: "San Mateo, California", type: "Village", population: "5,500", status: "Open Space", claimAmount: "$4,100" },
      { name: "Atherton", districtOrState: "San Mateo, California", type: "Town", population: "7,100", status: "Open Space", claimAmount: "$5,200" },
      { name: "Hillsborough", districtOrState: "San Mateo, California", type: "Town", population: "11,500", status: "Open Space", claimAmount: "$3,800" },
      { name: "Belvedere", districtOrState: "Marin, California", type: "Town", population: "2,100", status: "Open Space", claimAmount: "$2,900" },
      { name: "Tiburon", districtOrState: "Marin, California", type: "Town", population: "9,100", status: "Open Space", claimAmount: "$2,700" },
      { name: "Sausalito", districtOrState: "Marin, California", type: "Town", population: "7,000", status: "Open Space", claimAmount: "$3,200" },
      { name: "Redwood City", districtOrState: "San Mateo, California", type: "Municipality", population: "85,000", status: "Claimed", claimedBy: "Linear", claimAmount: "$5,400" },
      { name: "San Carlos", districtOrState: "San Mateo, California", type: "Town", population: "30,000", status: "Open Space", claimAmount: "$2,400" },
      { name: "Burlingame", districtOrState: "San Mateo, California", type: "Town", population: "31,000", status: "Open Space", claimAmount: "$2,600" },
      { name: "Mill Valley", districtOrState: "Marin, California", type: "Town", population: "14,000", status: "Open Space", claimAmount: "$2,800" },
      { name: "Somerville", districtOrState: "Middlesex, Massachusetts", type: "Municipality", population: "81,000", status: "Claimed", claimedBy: "Figma", claimAmount: "$4,200" },
      { name: "Brookline", districtOrState: "Norfolk, Massachusetts", type: "Town", population: "63,000", status: "Open Space", claimAmount: "$3,100" },
      { name: "Redmond", districtOrState: "King, Washington", type: "Municipality", population: "73,000", status: "Claimed", claimedBy: "Notion", claimAmount: "$6,100" },
      { name: "Kirkland", districtOrState: "King, Washington", type: "Municipality", population: "92,000", status: "Open Space", claimAmount: "$3,800" },
      { name: "Bellevue", districtOrState: "King, Washington", type: "Municipality", population: "152,000", status: "Claimed", claimedBy: "OpenAI", claimAmount: "$7,500" },
      { name: "Mercer Island", districtOrState: "King, Washington", type: "Town", population: "25,000", status: "Open Space", claimAmount: "$2,900" },
      { name: "Bainbridge Island", districtOrState: "Kitsap, Washington", type: "Town", population: "24,000", status: "Open Space", claimAmount: "$2,300" },
      { name: "Boulder", districtOrState: "Boulder, Colorado", type: "Municipality", population: "108,000", status: "Claimed", claimedBy: "Linear", claimAmount: "$4,600" },
    ],
  },
  {
    id: "GBR",
    name: "United Kingdom",
    code: "GB",
    region: "Europe",
    capital: "London",
    centerLat: 55.3781,
    centerLon: -3.4360,
    borderPolygon: [
      [58.5, -5.0], [58.5, -3.0], [56.0, -2.0], [53.5, 0.5], [51.5, 1.5],
      [50.0, -1.0], [50.0, -5.5], [51.5, -4.5], [53.5, -4.5], [55.0, -5.0],
      [58.5, -5.0]
    ],
    totalTerritoryArea: "242K km²",
    targetPoolAmount: 60000,
    currentAcquiredAmount: 48600,
    acquisitionPercent: 81,
    dominantLeader: "ChatGPT",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg",
    contributors: [
      { userName: "Sir Jonathan", amount: "$18,000", productName: "OpenAI UK", percentageContribution: 37 },
      { userName: "DeepMind Team", amount: "$14,200", productName: "AlphaFold Core", percentageContribution: 29 },
      { userName: "Monzo Backers", amount: "$9,400", productName: "Fintech Vault", percentageContribution: 19 },
      { userName: "Revolut Space", amount: "$7,000", productName: "Revolut Pay", percentageContribution: 15 },
    ],
    villages: [
      { name: "Shoreditch", districtOrState: "Hackney, Greater London", type: "District", population: "45,000", status: "Claimed", claimedBy: "ChatGPT", claimAmount: "$4,800" },
      { name: "Cambridge Central", districtOrState: "Cambridgeshire", type: "Town", population: "125,000", status: "Claimed", claimedBy: "AlphaFold", claimAmount: "$5,200" },
      { name: "Oxford Hub", districtOrState: "Oxfordshire", type: "Town", population: "152,000", status: "Claimed", claimedBy: "ChatGPT", claimAmount: "$4,900" },
      { name: "Henley-on-Thames", districtOrState: "South Oxfordshire", type: "Town", population: "11,600", status: "Open Space", claimAmount: "$1,800" },
      { name: "Marlow", districtOrState: "Buckinghamshire", type: "Town", population: "14,300", status: "Open Space", claimAmount: "$1,600" },
      { name: "Ascot", districtOrState: "Windsor and Maidenhead", type: "Village", population: "5,800", status: "Open Space", claimAmount: "$2,200" },
      { name: "Bray", districtOrState: "Berkshire", type: "Village", population: "8,400", status: "Open Space", claimAmount: "$1,400" },
      { name: "Richmond", districtOrState: "Greater London", type: "District", population: "21,000", status: "Claimed", claimedBy: "Monzo", claimAmount: "$3,600" },
      { name: "Wimbledon", districtOrState: "Merton, Greater London", type: "District", population: "68,000", status: "Open Space", claimAmount: "$3,200" },
      { name: "Kew", districtOrState: "Richmond upon Thames", type: "Village", population: "11,400", status: "Open Space", claimAmount: "$1,900" },
      { name: "St Albans", districtOrState: "Hertfordshire", type: "Town", population: "82,000", status: "Open Space", claimAmount: "$2,400" },
      { name: "Harpenden", districtOrState: "Hertfordshire", type: "Town", population: "30,000", status: "Open Space", claimAmount: "$1,950" },
      { name: "Sevenoaks", districtOrState: "Kent", type: "Town", population: "29,500", status: "Open Space", claimAmount: "$1,850" },
      { name: "Godalming", districtOrState: "Surrey", type: "Town", population: "22,000", status: "Open Space", claimAmount: "$1,700" },
      { name: "Farnham", districtOrState: "Surrey", type: "Town", population: "39,000", status: "Open Space", claimAmount: "$1,750" },
      { name: "Cobham", districtOrState: "Surrey", type: "Village", population: "9,700", status: "Open Space", claimAmount: "$2,100" },
      { name: "Alderley Edge", districtOrState: "Cheshire East", type: "Village", population: "4,600", status: "Open Space", claimAmount: "$1,900" },
      { name: "Didsbury", districtOrState: "Greater Manchester", type: "District", population: "26,000", status: "Open Space", claimAmount: "$1,500" },
    ],
  },
  {
    id: "JPN",
    name: "Japan",
    code: "JP",
    region: "East Asia",
    capital: "Tokyo",
    centerLat: 36.2048,
    centerLon: 138.2529,
    borderPolygon: [
      [45.0, 142.0], [43.0, 145.5], [40.0, 142.0], [35.0, 140.5], [33.5, 136.0],
      [31.0, 131.0], [32.5, 130.0], [35.0, 132.5], [37.5, 137.0], [40.5, 140.0],
      [45.0, 142.0]
    ],
    totalTerritoryArea: "377K km²",
    targetPoolAmount: 50000,
    currentAcquiredAmount: 42500,
    acquisitionPercent: 85,
    dominantLeader: "Discord",
    dominantLogo: "https://assets-global.website-files.com/6257adef93867e50d84d30e2/636e0a6a49cf127bf92de1e2_icon_clyde_blurple_RGB.png",
    contributors: [
      { userName: "Kenji Sato", amount: "$17,000", productName: "Discord Nitro", percentageContribution: 40 },
      { userName: "Sakura Tanaka", amount: "$12,500", productName: "Line App Hub", percentageContribution: 29 },
      { userName: "Daiki Watanabe", amount: "$8,000", productName: "Sony Music AI", percentageContribution: 19 },
      { userName: "Yuki Takahashi", amount: "$5,000", productName: "Mercari Space", percentageContribution: 12 },
    ],
    villages: [
      { name: "Roppongi", districtOrState: "Minato, Tokyo", type: "District", population: "13,000", status: "Claimed", claimedBy: "Discord", claimAmount: "$4,500" },
      { name: "Shibuya Core", districtOrState: "Shibuya, Tokyo", type: "District", population: "220,000", status: "Claimed", claimedBy: "Discord", claimAmount: "$6,200" },
      { name: "Akihabara", districtOrState: "Chiyoda, Tokyo", type: "District", population: "11,000", status: "Claimed", claimedBy: "Line App", claimAmount: "$3,800" },
      { name: "Kamakura", districtOrState: "Kanagawa", type: "Municipality", population: "172,000", status: "Claimed", claimedBy: "Discord", claimAmount: "$2,900" },
      { name: "Hakone", districtOrState: "Ashigarashimo, Kanagawa", type: "Town", population: "11,500", status: "Open Space", claimAmount: "$1,800" },
      { name: "Karuizawa", districtOrState: "Kitasaku, Nagano", type: "Town", population: "20,000", status: "Open Space", claimAmount: "$2,400" },
      { name: "Shimoda", districtOrState: "Shizuoka", type: "Municipality", population: "21,000", status: "Open Space", claimAmount: "$1,200" },
      { name: "Hayama", districtOrState: "Miura, Kanagawa", type: "Town", population: "31,000", status: "Open Space", claimAmount: "$1,900" },
      { name: "Zushi", districtOrState: "Kanagawa", type: "Municipality", population: "57,000", status: "Open Space", claimAmount: "$1,700" },
      { name: "Mitaka", districtOrState: "Tokyo Prefecture", type: "Municipality", population: "190,000", status: "Open Space", claimAmount: "$2,600" },
      { name: "Kichijoji", districtOrState: "Musashino, Tokyo", type: "District", population: "38,000", status: "Claimed", claimedBy: "Mercari", claimAmount: "$3,100" },
      { name: "Niseko", districtOrState: "Abuta, Hokkaido", type: "Town", population: "4,900", status: "Open Space", claimAmount: "$2,800" },
      { name: "Furano", districtOrState: "Kamikawa, Hokkaido", type: "Municipality", population: "21,000", status: "Open Space", claimAmount: "$1,400" },
      { name: "Otaru", districtOrState: "Shiribeshi, Hokkaido", type: "Municipality", population: "110,000", status: "Open Space", claimAmount: "$1,900" },
    ],
  },
  {
    id: "DEU",
    name: "Germany",
    code: "DE",
    region: "Europe",
    capital: "Berlin",
    centerLat: 51.1657,
    centerLon: 10.4515,
    borderPolygon: [
      [54.5, 9.0], [54.0, 14.0], [51.0, 15.0], [48.5, 13.5], [47.5, 11.0],
      [47.5, 7.5], [49.5, 6.0], [51.0, 6.0], [53.5, 7.0], [54.5, 9.0]
    ],
    totalTerritoryArea: "357K km²",
    targetPoolAmount: 50000,
    currentAcquiredAmount: 34200,
    acquisitionPercent: 68,
    dominantLeader: "Linear",
    dominantLogo: "https://linear.app/static/favicon.ico",
    contributors: [
      { userName: "Lukas Weber", amount: "$15,000", productName: "Linear Berlin", percentageContribution: 44 },
      { userName: "Maximilian Koch", amount: "$10,200", productName: "N26 Vault", percentageContribution: 30 },
      { userName: "Sophie Wagner", amount: "$9,000", productName: "Celonis Process", percentageContribution: 26 },
    ],
    villages: [
      { name: "Mitte", districtOrState: "Berlin", type: "District", population: "385,000", status: "Claimed", claimedBy: "Linear", claimAmount: "$5,100" },
      { name: "Kreuzberg", districtOrState: "Friedrichshain-Kreuzberg, Berlin", type: "District", population: "153,000", status: "Claimed", claimedBy: "N26", claimAmount: "$4,300" },
      { name: "Prenzlauer Berg", districtOrState: "Pankow, Berlin", type: "District", population: "165,000", status: "Claimed", claimedBy: "Linear", claimAmount: "$3,900" },
      { name: "Starnberg", districtOrState: "Bavaria", type: "Town", population: "23,000", status: "Open Space", claimAmount: "$2,800" },
      { name: "Tegernsee", districtOrState: "Miesbach, Bavaria", type: "Town", population: "3,700", status: "Open Space", claimAmount: "$2,600" },
      { name: "Garmisch-Partenkirchen", districtOrState: "Bavaria", type: "Town", population: "27,000", status: "Open Space", claimAmount: "$1,900" },
      { name: "Potsdam", districtOrState: "Brandenburg", type: "Municipality", population: "183,000", status: "Open Space", claimAmount: "$2,200" },
      { name: "Kleinmachnow", districtOrState: "Potsdam-Mittelmark", type: "Municipality", population: "20,000", status: "Open Space", claimAmount: "$1,750" },
      { name: "Bad Homburg", districtOrState: "Hochtaunuskreis, Hesse", type: "Town", population: "54,000", status: "Open Space", claimAmount: "$2,400" },
      { name: "Kronberg im Taunus", districtOrState: "Hochtaunuskreis, Hesse", type: "Town", population: "18,000", status: "Open Space", claimAmount: "$2,100" },
      { name: "Konstanz", districtOrState: "Baden-Württemberg", type: "Municipality", population: "84,000", status: "Open Space", claimAmount: "$1,800" },
    ],
  },
  {
    id: "BRA",
    name: "Brazil",
    code: "BR",
    region: "South America",
    capital: "Brasília",
    centerLat: -14.2350,
    centerLon: -51.9253,
    borderPolygon: [
      [4.0, -51.0], [-2.0, -44.0], [-7.0, -35.0], [-13.0, -38.0], [-22.0, -41.0],
      [-30.0, -50.0], [-33.0, -53.0], [-25.0, -54.0], [-19.0, -58.0], [-10.0, -69.0],
      [-4.0, -70.0], [2.0, -67.0], [4.0, -60.0], [4.0, -51.0]
    ],
    totalTerritoryArea: "8.515M km²",
    targetPoolAmount: 40000,
    currentAcquiredAmount: 24800,
    acquisitionPercent: 62,
    dominantLeader: "Midjourney",
    dominantLogo: "https://midjourney.com/favicon.ico",
    contributors: [
      { userName: "Mateus Silva", amount: "$12,000", productName: "Midjourney LatAm", percentageContribution: 48 },
      { userName: "Camila Santos", amount: "$7,800", productName: "Nubank Space", percentageContribution: 31 },
      { userName: "Lucas Ferreira", amount: "$5,000", productName: "Hotmart Core", percentageContribution: 21 },
    ],
    villages: [
      { name: "Vila Madalena", districtOrState: "São Paulo Capital", type: "District", population: "32,000", status: "Claimed", claimedBy: "Midjourney", claimAmount: "$3,600" },
      { name: "Itaim Bibi", districtOrState: "São Paulo Capital", type: "District", population: "88,000", status: "Claimed", claimedBy: "Nubank", claimAmount: "$4,200" },
      { name: "Alphaville", districtOrState: "Barueri, São Paulo", type: "District", population: "35,000", status: "Open Space", claimAmount: "$2,800" },
      { name: "Campinas Central", districtOrState: "São Paulo State", type: "Municipality", population: "1,200,000", status: "Open Space", claimAmount: "$2,900" },
      { name: "Vinhedo", districtOrState: "São Paulo State", type: "Municipality", population: "80,000", status: "Open Space", claimAmount: "$1,600" },
      { name: "Valinhos", districtOrState: "São Paulo State", type: "Municipality", population: "130,000", status: "Open Space", claimAmount: "$1,500" },
      { name: "Campos do Jordão", districtOrState: "São Paulo State", type: "Town", population: "52,000", status: "Open Space", claimAmount: "$1,900" },
      { name: "Ilhabela", districtOrState: "São Paulo State", type: "Town", population: "35,000", status: "Open Space", claimAmount: "$1,700" },
      { name: "Paraty", districtOrState: "Rio de Janeiro State", type: "Town", population: "43,000", status: "Open Space", claimAmount: "$1,400" },
      { name: "Tiradentes", districtOrState: "Minas Gerais", type: "Village", population: "7,900", status: "Open Space", claimAmount: "$950" },
      { name: "Ouro Preto", districtOrState: "Minas Gerais", type: "Municipality", population: "74,000", status: "Open Space", claimAmount: "$1,300" },
    ],
  },
  {
    id: "SGP",
    name: "Singapore",
    code: "SG",
    region: "Southeast Asia",
    capital: "Singapore",
    centerLat: 1.3521,
    centerLon: 103.8198,
    borderPolygon: [
      [1.45, 103.65], [1.47, 103.82], [1.42, 104.05], [1.32, 104.08], [1.24, 103.84],
      [1.22, 103.68], [1.30, 103.62], [1.45, 103.65]
    ],
    totalTerritoryArea: "728 km²",
    targetPoolAmount: 30000,
    currentAcquiredAmount: 23100,
    acquisitionPercent: 77,
    dominantLeader: "Vercel",
    dominantLogo: "https://assets.vercel.com/image/upload/front/favicon/vercel/180x180.png",
    contributors: [
      { userName: "Marcus Tan", amount: "$10,500", productName: "Vercel APAC", percentageContribution: 45 },
      { userName: "Grace Lim", amount: "$7,600", productName: "Sea Group Hub", percentageContribution: 33 },
      { userName: "Wei Chen", amount: "$5,000", productName: "Grab Space", percentageContribution: 22 },
    ],
    villages: [
      { name: "One-North", districtOrState: "Queenstown", type: "District", population: "18,000", status: "Claimed", claimedBy: "Vercel", claimAmount: "$4,200" },
      { name: "Marina Bay Node", districtOrState: "Downtown Core", type: "District", population: "6,000", status: "Claimed", claimedBy: "Vercel", claimAmount: "$5,100" },
      { name: "Tanjong Pagar", districtOrState: "Downtown Core", type: "District", population: "15,000", status: "Claimed", claimedBy: "Grab", claimAmount: "$3,600" },
      { name: "Sentosa Cove", districtOrState: "Southern Islands", type: "Village", population: "6,000", status: "Open Space", claimAmount: "$2,800" },
      { name: "Siglap", districtOrState: "Bedok", type: "District", population: "22,000", status: "Open Space", claimAmount: "$1,600" },
      { name: "Katong", districtOrState: "Marine Parade", type: "District", population: "28,000", status: "Open Space", claimAmount: "$1,800" },
      { name: "Holland Village", districtOrState: "Bukit Timah", type: "Village", population: "14,000", status: "Open Space", claimAmount: "$2,400" },
      { name: "Serangoon Gardens", districtOrState: "Serangoon", type: "Town", population: "36,000", status: "Open Space", claimAmount: "$1,700" },
      { name: "Bukit Timah Estate", districtOrState: "Bukit Timah", type: "District", population: "78,000", status: "Open Space", claimAmount: "$2,900" },
      { name: "Changi Village", districtOrState: "Changi", type: "Village", population: "3,200", status: "Open Space", claimAmount: "$1,100" },
    ],
  },
  {
    id: "AUS",
    name: "Australia",
    code: "AU",
    region: "Oceania",
    capital: "Canberra",
    centerLat: -25.2744,
    centerLon: 133.7751,
    borderPolygon: [
      [-12.0, 131.0], [-10.5, 142.5], [-16.0, 146.0], [-24.0, 153.0], [-34.0, 151.5],
      [-38.0, 145.0], [-36.0, 137.0], [-32.0, 125.0], [-34.0, 115.0], [-22.0, 114.0],
      [-16.0, 124.0], [-12.0, 131.0]
    ],
    totalTerritoryArea: "7.692M km²",
    targetPoolAmount: 40000,
    currentAcquiredAmount: 26800,
    acquisitionPercent: 67,
    dominantLeader: "Framer",
    dominantLogo: "https://framer.com/favicon.ico",
    contributors: [
      { userName: "Liam O'Connor", amount: "$11,500", productName: "Framer APAC", percentageContribution: 43 },
      { userName: "Zoe Mitchell", amount: "$8,900", productName: "Atlassian Base", percentageContribution: 33 },
      { userName: "Noah Campbell", amount: "$6,400", productName: "SafetyCulture Space", percentageContribution: 24 },
    ],
    villages: [
      { name: "Surry Hills", districtOrState: "Sydney, NSW", type: "District", population: "16,500", status: "Claimed", claimedBy: "Framer", claimAmount: "$3,800" },
      { name: "Paddington", districtOrState: "Sydney, NSW", type: "District", population: "13,000", status: "Claimed", claimedBy: "Atlassian", claimAmount: "$3,200" },
      { name: "Barangaroo", districtOrState: "Sydney, NSW", type: "District", population: "5,000", status: "Claimed", claimedBy: "Framer", claimAmount: "$4,500" },
      { name: "Byron Bay", districtOrState: "Byron Shire, NSW", type: "Town", population: "10,000", status: "Open Space", claimAmount: "$2,600" },
      { name: "Bangalow", districtOrState: "Byron Shire, NSW", type: "Village", population: "2,200", status: "Open Space", claimAmount: "$1,400" },
      { name: "Bowral", districtOrState: "Wingecarribee, NSW", type: "Town", population: "13,500", status: "Open Space", claimAmount: "$1,700" },
      { name: "Leura", districtOrState: "Blue Mountains, NSW", type: "Village", population: "4,600", status: "Open Space", claimAmount: "$1,300" },
      { name: "Fitzroy", districtOrState: "Melbourne, Victoria", type: "District", population: "10,500", status: "Open Space", claimAmount: "$2,900" },
      { name: "Cremorne", districtOrState: "Melbourne, Victoria", type: "District", population: "2,100", status: "Claimed", claimedBy: "SafetyCulture", claimAmount: "$3,400" },
      { name: "South Yarra", districtOrState: "Melbourne, Victoria", type: "District", population: "25,000", status: "Open Space", claimAmount: "$2,700" },
      { name: "Noosa Heads", districtOrState: "Noosa, Queensland", type: "Town", population: "4,500", status: "Open Space", claimAmount: "$2,200" },
      { name: "Cottesloe", districtOrState: "Perth, WA", type: "Town", population: "7,800", status: "Open Space", claimAmount: "$1,850" },
    ],
  },
  {
    id: "ARE",
    name: "United Arab Emirates",
    code: "AE",
    region: "Middle East",
    capital: "Abu Dhabi",
    centerLat: 23.4241,
    centerLon: 53.8478,
    borderPolygon: [
      [26.0, 56.0], [25.0, 56.5], [24.0, 55.5], [23.0, 54.0], [24.0, 52.0],
      [25.0, 53.0], [25.5, 55.0], [26.0, 56.0]
    ],
    totalTerritoryArea: "83.6K km²",
    targetPoolAmount: 25000,
    currentAcquiredAmount: 19500,
    acquisitionPercent: 78,
    dominantLeader: "Claude",
    dominantLogo: "https://claude.ai/favicon.ico",
    contributors: [
      { userName: "Tariq Al-Mansoor", amount: "$9,000", productName: "Anthropic MENA", percentageContribution: 46 },
      { userName: "Fatima Al-Hashemi", amount: "$6,500", productName: "Careem Hub", percentageContribution: 33 },
      { userName: "Omar Bin Zayed", amount: "$4,000", productName: "Kitopi Space", percentageContribution: 21 },
    ],
    villages: [
      { name: "Dubai Internet City", districtOrState: "Dubai", type: "District", population: "22,000", status: "Claimed", claimedBy: "Claude", claimAmount: "$3,900" },
      { name: "DIFC Gate", districtOrState: "Dubai", type: "District", population: "14,000", status: "Claimed", claimedBy: "Claude", claimAmount: "$4,600" },
      { name: "Al Barari", districtOrState: "Dubai", type: "Village", population: "4,500", status: "Open Space", claimAmount: "$2,200" },
      { name: "Jumeirah Bay", districtOrState: "Dubai", type: "Village", population: "2,000", status: "Open Space", claimAmount: "$3,100" },
      { name: "Saadiyat Cultural", districtOrState: "Abu Dhabi", type: "District", population: "8,000", status: "Claimed", claimedBy: "Careem", claimAmount: "$2,800" },
      { name: "Al Ain Oasis", districtOrState: "Abu Dhabi", type: "Town", population: "12,000", status: "Open Space", claimAmount: "$1,400" },
      { name: "Hatta", districtOrState: "Dubai Enclave", type: "Town", population: "12,200", status: "Open Space", claimAmount: "$1,200" },
      { name: "Masdar City", districtOrState: "Abu Dhabi", type: "District", population: "4,000", status: "Open Space", claimAmount: "$2,500" },
    ],
  },
  {
    id: "FRA",
    name: "France",
    code: "FR",
    region: "Western Europe",
    capital: "Paris",
    centerLat: 46.2276,
    centerLon: 2.2137,
    borderPolygon: [
      [51.0, 2.5], [49.5, 6.0], [48.0, 7.5], [46.0, 6.5], [44.0, 7.0],
      [43.0, 6.0], [42.5, 3.0], [43.5, -1.5], [46.0, -1.5], [48.5, -4.5],
      [49.5, -1.5], [51.0, 2.5]
    ],
    totalTerritoryArea: "643K km²",
    targetPoolAmount: 55000,
    currentAcquiredAmount: 41250,
    acquisitionPercent: 75,
    dominantLeader: "Mistral AI",
    dominantLogo: "https://mistral.ai/favicon.ico",
    contributors: [
      { userName: "Arthur Mensch", amount: "$16,500", productName: "Mistral Core", percentageContribution: 40 },
      { userName: "Céleste Dubois", amount: "$13,200", productName: "Qonto Bank", percentageContribution: 32 },
      { userName: "Julien Chaumond", amount: "$11,550", productName: "Hugging Face EU", percentageContribution: 28 },
    ],
    villages: [
      { name: "Station F Hub", districtOrState: "13th Arrondissement, Paris", type: "District", population: "18,000", status: "Claimed", claimedBy: "Mistral AI", claimAmount: "$5,400" },
      { name: "Giverny", districtOrState: "Eure, Normandy", type: "Village", population: "490", status: "Open Space", claimAmount: "$1,100" },
      { name: "Chamonix-Mont-Blanc", districtOrState: "Haute-Savoie", type: "Town", population: "8,600", status: "Open Space", claimAmount: "$2,300" },
      { name: "Saint-Tropez", districtOrState: "Var, Provence", type: "Town", population: "4,100", status: "Claimed", claimedBy: "Qonto", claimAmount: "$3,600" },
      { name: "Grasse", districtOrState: "Alpes-Maritimes", type: "Town", population: "48,000", status: "Open Space", claimAmount: "$1,600" },
      { name: "Versailles", districtOrState: "Yvelines, Île-de-France", type: "Municipality", population: "85,000", status: "Claimed", claimedBy: "Hugging Face", claimAmount: "$4,200" },
      { name: "Fontainebleau", districtOrState: "Seine-et-Marne", type: "Town", population: "15,000", status: "Open Space", claimAmount: "$1,800" },
      { name: "Rocamadour", districtOrState: "Lot, Occitanie", type: "Village", population: "620", status: "Open Space", claimAmount: "$900" },
      { name: "Èze", districtOrState: "Côte d'Azur", type: "Village", population: "2,200", status: "Open Space", claimAmount: "$2,700" },
      { name: "Biarritz", districtOrState: "Pyrénées-Atlantiques", type: "Town", population: "25,000", status: "Open Space", claimAmount: "$2,100" },
    ],
  },
  {
    id: "CAN",
    name: "Canada",
    code: "CA",
    region: "North America",
    capital: "Ottawa",
    centerLat: 56.1304,
    centerLon: -106.3468,
    borderPolygon: [
      [69.0, -135.0], [70.0, -90.0], [60.0, -65.0], [47.0, -53.0], [45.0, -67.0],
      [45.0, -75.0], [48.0, -89.0], [49.0, -95.0], [49.0, -124.5], [54.0, -130.0],
      [60.0, -140.0], [69.0, -140.0], [69.0, -135.0]
    ],
    totalTerritoryArea: "9.985M km²",
    targetPoolAmount: 70000,
    currentAcquiredAmount: 51800,
    acquisitionPercent: 74,
    dominantLeader: "Shopify",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg",
    contributors: [
      { userName: "Tobi Lütke", amount: "$22,000", productName: "Shopify Global", percentageContribution: 42 },
      { userName: "Aidan Gomez", amount: "$18,500", productName: "Cohere AI", percentageContribution: 36 },
      { userName: "Chloe Tremblay", amount: "$11,300", productName: "Wealthsimple Hub", percentageContribution: 22 },
    ],
    villages: [
      { name: "Waterloo Tech Corridor", districtOrState: "Waterloo Region, Ontario", type: "District", population: "115,000", status: "Claimed", claimedBy: "Shopify", claimAmount: "$4,800" },
      { name: "Whistler", districtOrState: "Squamish-Lillooet, BC", type: "Municipality", population: "13,900", status: "Open Space", claimAmount: "$2,600" },
      { name: "Banff", districtOrState: "Improvement District No. 9, Alberta", type: "Town", population: "7,800", status: "Open Space", claimAmount: "$2,400" },
      { name: "Canmore", districtOrState: "Alberta", type: "Town", population: "16,000", status: "Open Space", claimAmount: "$1,800" },
      { name: "Tofino", districtOrState: "Vancouver Island, BC", type: "District", population: "2,500", status: "Open Space", claimAmount: "$1,900" },
      { name: "Markham Silicon", districtOrState: "York Region, Ontario", type: "Municipality", population: "338,000", status: "Claimed", claimedBy: "Cohere", claimAmount: "$4,100" },
      { name: "Niagara-on-the-Lake", districtOrState: "Niagara, Ontario", type: "Town", population: "17,500", status: "Open Space", claimAmount: "$1,700" },
      { name: "Baie-Saint-Paul", districtOrState: "Charlevoix, Quebec", type: "Municipality", population: "7,200", status: "Open Space", claimAmount: "$1,200" },
      { name: "Lunenburg", districtOrState: "Nova Scotia", type: "Town", population: "2,300", status: "Open Space", claimAmount: "$1,100" },
    ],
  },
  {
    id: "KOR",
    name: "South Korea",
    code: "KR",
    region: "East Asia",
    capital: "Seoul",
    centerLat: 35.9078,
    centerLon: 127.7669,
    borderPolygon: [
      [38.5, 128.3], [37.5, 129.4], [35.5, 129.4], [35.0, 129.0], [34.5, 127.5],
      [34.5, 126.0], [36.5, 126.0], [37.8, 126.5], [38.5, 128.3]
    ],
    totalTerritoryArea: "100K km²",
    targetPoolAmount: 45000,
    currentAcquiredAmount: 39600,
    acquisitionPercent: 88,
    dominantLeader: "Naver",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/2/20/Naver_Line_Logo.svg",
    contributors: [
      { userName: "Min-ho Park", amount: "$17,000", productName: "Naver HyperCLOVA", percentageContribution: 43 },
      { userName: "Ji-eun Kim", amount: "$13,600", productName: "Kakao Pay", percentageContribution: 34 },
      { userName: "Sung-woo Lee", amount: "$9,000", productName: "Toss Core", percentageContribution: 23 },
    ],
    villages: [
      { name: "Pangyo Techno Valley", districtOrState: "Seongnam, Gyeonggi", type: "District", population: "75,000", status: "Claimed", claimedBy: "Naver", claimAmount: "$5,800" },
      { name: "Gangnam Teheran-ro", districtOrState: "Gangnam-gu, Seoul", type: "District", population: "90,000", status: "Claimed", claimedBy: "Toss", claimAmount: "$6,400" },
      { name: "Seongsu-dong", districtOrState: "Seongdong-gu, Seoul", type: "District", population: "42,000", status: "Claimed", claimedBy: "Kakao", claimAmount: "$4,500" },
      { name: "Aewol-eup", districtOrState: "Jeju Special Self-Governing Province", type: "Town", population: "36,000", status: "Open Space", claimAmount: "$1,800" },
      { name: "Gujwa-eup", districtOrState: "Jeju Island", type: "Town", population: "15,000", status: "Open Space", claimAmount: "$1,300" },
      { name: "Yangyang Surf Village", districtOrState: "Gangwon-do", type: "Town", population: "27,000", status: "Open Space", claimAmount: "$1,600" },
      { name: "Damyang Bamboo Village", districtOrState: "Jeollanam-do", type: "Village", population: "11,000", status: "Open Space", claimAmount: "$950" },
      { name: "Andong Hahoe", districtOrState: "Gyeongsangbuk-do", type: "Village", population: "8,500", status: "Open Space", claimAmount: "$1,100" },
    ],
  },
  {
    id: "NLD",
    name: "Netherlands",
    code: "NL",
    region: "Western Europe",
    capital: "Amsterdam",
    centerLat: 52.1326,
    centerLon: 5.2913,
    borderPolygon: [
      [53.5, 6.5], [53.2, 7.2], [51.8, 6.0], [51.3, 6.0], [50.8, 5.7],
      [51.2, 3.4], [52.0, 4.0], [53.0, 4.7], [53.5, 6.5]
    ],
    totalTerritoryArea: "41.5K km²",
    targetPoolAmount: 35000,
    currentAcquiredAmount: 28700,
    acquisitionPercent: 82,
    dominantLeader: "Booking.com",
    dominantLogo: "https://upload.wikimedia.org/wikipedia/commons/b/be/Booking.com_logo.svg",
    contributors: [
      { userName: "Bram Van Dijk", amount: "$12,500", productName: "Booking Engine", percentageContribution: 44 },
      { userName: "Sanne De Jong", amount: "$9,200", productName: "Adyen Payments", percentageContribution: 32 },
      { userName: "Lars Visser", amount: "$7,000", productName: "Mollie Connect", percentageContribution: 24 },
    ],
    villages: [
      { name: "Zuidas Financial District", districtOrState: "Amsterdam", type: "District", population: "24,000", status: "Claimed", claimedBy: "Booking.com", claimAmount: "$4,600" },
      { name: "Brainport High Tech", districtOrState: "Eindhoven, North Brabant", type: "District", population: "32,000", status: "Claimed", claimedBy: "Adyen", claimAmount: "$4,100" },
      { name: "Giethoorn", districtOrState: "Steenwijkerland, Overijssel", type: "Village", population: "2,800", status: "Open Space", claimAmount: "$1,600" },
      { name: "Volendam", districtOrState: "Edam-Volendam, North Holland", type: "Town", population: "22,000", status: "Open Space", claimAmount: "$1,400" },
      { name: "Zaanse Schans", districtOrState: "Zaandam, North Holland", type: "Village", population: "1,200", status: "Open Space", claimAmount: "$1,300" },
      { name: "Wassenaar", districtOrState: "South Holland", type: "Town", population: "26,000", status: "Open Space", claimAmount: "$2,800" },
      { name: "Laren", districtOrState: "Gooi, North Holland", type: "Village", population: "11,500", status: "Open Space", claimAmount: "$2,300" },
    ],
  },
  {
    id: "CHE",
    name: "Switzerland",
    code: "CH",
    region: "Central Europe",
    capital: "Bern",
    centerLat: 46.8182,
    centerLon: 8.2275,
    borderPolygon: [
      [47.8, 8.5], [47.5, 9.5], [46.8, 10.5], [46.3, 9.0], [45.8, 7.0],
      [46.2, 6.0], [47.0, 6.8], [47.6, 7.5], [47.8, 8.5]
    ],
    totalTerritoryArea: "41.3K km²",
    targetPoolAmount: 45000,
    currentAcquiredAmount: 41850,
    acquisitionPercent: 93,
    dominantLeader: "Proton",
    dominantLogo: "https://proton.me/favicon.ico",
    contributors: [
      { userName: "Andy Yen", amount: "$19,000", productName: "Proton Mail & Privacy", percentageContribution: 45 },
      { userName: "Vitalik Buterin", amount: "$14,000", productName: "Zug Crypto Foundation", percentageContribution: 33 },
      { userName: "Marc Bürki", amount: "$8,850", productName: "Swissquote Trade", percentageContribution: 22 },
    ],
    villages: [
      { name: "Crypto Valley Zug", districtOrState: "Canton of Zug", type: "District", population: "30,000", status: "Claimed", claimedBy: "Zug Foundation", claimAmount: "$6,200" },
      { name: "Zermatt", districtOrState: "Valais", type: "Municipality", population: "5,800", status: "Open Space", claimAmount: "$3,100" },
      { name: "St. Moritz", districtOrState: "Graubünden", type: "Town", population: "5,000", status: "Claimed", claimedBy: "Proton", claimAmount: "$3,900" },
      { name: "Grindelwald", districtOrState: "Bernese Oberland", type: "Village", population: "3,800", status: "Open Space", claimAmount: "$2,200" },
      { name: "Lauterbrunnen", districtOrState: "Interlaken-Oberhasli", type: "Village", population: "2,300", status: "Open Space", claimAmount: "$2,400" },
      { name: "Gstaad", districtOrState: "Saanen, Bern", type: "Village", population: "3,200", status: "Open Space", claimAmount: "$3,400" },
      { name: "Davos", districtOrState: "Graubünden", type: "Town", population: "10,800", status: "Open Space", claimAmount: "$3,500" },
    ],
  },
];

// Major Earth continent coastlines (spherical lat/lon polygons) for rendering the world accurately on the 360 globe
export const CONTINENT_POLYGONS: [number, number][][] = [
  // North America
  [
    [71, -156], [70, -135], [69, -120], [68, -85], [60, -65], [47, -53], [44, -66],
    [41, -70], [35, -75], [25, -80], [29, -89], [21, -97], [16, -93], [9, -79],
    [8, -77], [15, -92], [22, -105], [32, -117], [38, -123], [48, -125], [58, -137],
    [60, -145], [65, -168], [71, -156]
  ],
  // South America
  [
    [12, -72], [10, -62], [5, -52], [0, -50], [-5, -35], [-12, -37], [-22, -41],
    [-34, -53], [-42, -64], [-53, -68], [-55, -67], [-50, -74], [-38, -73], [-20, -70],
    [-5, -81], [5, -77], [9, -76], [12, -72]
  ],
  // Europe & Asia (Eurasia)
  [
    [71, 28], [68, 44], [67, 72], [73, 80], [77, 105], [74, 138], [70, 160], [66, 170],
    [60, 165], [52, 142], [43, 132], [38, 120], [30, 122], [22, 114], [10, 105],
    [1, 104], [12, 100], [20, 96], [22, 89], [13, 80], [8, 77], [21, 70], [25, 62],
    [25, 57], [15, 52], [13, 44], [28, 35], [36, 36], [38, 27], [36, 15], [36, -5],
    [43, -9], [48, -5], [51, 2], [54, 9], [58, 11], [63, 20], [70, 20], [71, 28]
  ],
  // Africa
  [
    [37, 10], [36, 15], [32, 25], [31, 32], [22, 37], [12, 44], [12, 51], [0, 42],
    [-11, 40], [-25, 33], [-34, 26], [-34, 18], [-22, 14], [-5, 12], [4, 9],
    [5, -2], [5, -10], [15, -17], [28, -13], [35, -6], [37, 10]
  ],
  // Australia
  [
    [-12, 132], [-11, 142], [-16, 145], [-24, 153], [-34, 151], [-39, 146], [-37, 137],
    [-32, 129], [-34, 115], [-22, 114], [-17, 122], [-12, 132]
  ],
  // Greenland
  [
    [83, -30], [82, -20], [76, -20], [70, -25], [60, -43], [65, -53], [76, -68],
    [82, -60], [83, -30]
  ],
  // Great Britain
  [
    [58, -5], [58, -3], [55, -2], [51, 1], [50, -5], [53, -4], [58, -5]
  ],
  // Japan
  [
    [45, 142], [43, 145], [39, 142], [35, 140], [33, 136], [31, 131], [34, 131],
    [37, 137], [41, 140], [45, 142]
  ],
  // Madagascar
  [
    [-12, 49], [-16, 50], [-25, 47], [-25, 44], [-17, 44], [-12, 49]
  ]
];

export type StateRegion = {
  id: string;
  countryId: string;
  name: string;
  code: string;
  centerLat: number;
  centerLon: number;
  timezone: string;
  utcOffset: string;
  totalAreaKm2: number;
  acquiredAreaKm2: number;
  dominantProfile: string;
  profileType: "product" | "@profile";
  borderPolygon: [number, number][];
};

export type CityVillageSpace = {
  id: string;
  name: string;
  countryId: string;
  stateId: string;
  district: string;
  type: "Mega City" | "City" | "Town" | "Village" | "Tech District" | "District" | "Municipality" | "Taluk";
  lat: number;
  lon: number;
  timezone: string;
  utcOffset: string;
  population: string;
  status: "Claimed" | "Open Space";
  currentHolder: string; // e.g. "@chethan", "@canva", "@figma"
  holderType: "product" | "@profile";
  holderAvatar?: string;
  currentBid: number;
  minBid: number;
  acquiredAreaKm2: number; // Expanding territory area
  expansionRadiusKm: number; // Visual expanding radius
  expansionRateKm2Per100: number; // +km² per $100 contribution
  contributors: Contributor[];
  localBorders: [number, number][];
};

export const STATE_REGIONS: StateRegion[] = [
  {
    id: "IN-KA",
    countryId: "IND",
    name: "Karnataka",
    code: "KA",
    centerLat: 15.3173,
    centerLon: 75.7139,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    totalAreaKm2: 191791,
    acquiredAreaKm2: 145000,
    dominantProfile: "@canva_india",
    profileType: "@profile",
    borderPolygon: [
      [18.4, 77.5], [17.8, 77.6], [16.5, 77.4], [15.5, 76.5], [14.0, 78.0],
      [13.0, 78.5], [12.0, 77.0], [11.8, 75.8], [13.5, 74.8], [14.5, 74.3],
      [15.5, 74.0], [17.0, 74.5], [18.4, 77.5]
    ],
  },
  {
    id: "IN-MH",
    countryId: "IND",
    name: "Maharashtra",
    code: "MH",
    centerLat: 19.7515,
    centerLon: 75.7139,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    totalAreaKm2: 307713,
    acquiredAreaKm2: 210000,
    dominantProfile: "@postman_api",
    profileType: "product",
    borderPolygon: [
      [22.0, 73.0], [21.5, 78.5], [20.0, 80.5], [18.5, 77.5], [16.0, 74.0],
      [16.5, 73.3], [19.0, 72.8], [20.5, 72.8], [22.0, 73.0]
    ],
  },
  {
    id: "IN-TN",
    countryId: "IND",
    name: "Tamil Nadu",
    code: "TN",
    centerLat: 11.1271,
    centerLon: 78.6569,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    totalAreaKm2: 130060,
    acquiredAreaKm2: 98000,
    dominantProfile: "@razorpay",
    profileType: "product",
    borderPolygon: [
      [13.5, 80.2], [12.0, 79.8], [10.5, 79.8], [9.2, 79.2], [8.1, 77.5],
      [8.8, 77.2], [10.5, 76.8], [12.0, 77.8], [13.5, 80.2]
    ],
  },
  {
    id: "IN-DL",
    countryId: "IND",
    name: "Delhi NCR",
    code: "DL",
    centerLat: 28.7041,
    centerLon: 77.1025,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    totalAreaKm2: 1484,
    acquiredAreaKm2: 1390,
    dominantProfile: "@dukaan_hq",
    profileType: "product",
    borderPolygon: [
      [28.9, 76.9], [28.9, 77.3], [28.5, 77.3], [28.4, 77.0], [28.9, 76.9]
    ],
  },
  {
    id: "US-CA",
    countryId: "USA",
    name: "California",
    code: "CA",
    centerLat: 36.7783,
    centerLon: -119.4179,
    timezone: "America/Los_Angeles",
    utcOffset: "-07:00",
    totalAreaKm2: 423970,
    acquiredAreaKm2: 395000,
    dominantProfile: "@figma",
    profileType: "product",
    borderPolygon: [
      [42.0, -124.4], [42.0, -120.0], [39.0, -120.0], [35.0, -114.6], [32.7, -114.7],
      [32.5, -117.1], [34.0, -119.0], [37.0, -122.5], [40.0, -124.3], [42.0, -124.4]
    ],
  },
  {
    id: "US-NY",
    countryId: "USA",
    name: "New York",
    code: "NY",
    centerLat: 40.7128,
    centerLon: -74.0060,
    timezone: "America/New_York",
    utcOffset: "-04:00",
    totalAreaKm2: 141300,
    acquiredAreaKm2: 125000,
    dominantProfile: "@notion",
    profileType: "product",
    borderPolygon: [
      [45.0, -74.8], [45.0, -73.3], [41.0, -72.0], [40.5, -74.0], [42.0, -79.8],
      [43.0, -79.0], [44.0, -76.5], [45.0, -74.8]
    ],
  },
  {
    id: "GB-ENG",
    countryId: "GBR",
    name: "England",
    code: "ENG",
    centerLat: 52.3555,
    centerLon: -1.1743,
    timezone: "Europe/London",
    utcOffset: "+01:00",
    totalAreaKm2: 130279,
    acquiredAreaKm2: 112000,
    dominantProfile: "@chatgpt",
    profileType: "product",
    borderPolygon: [
      [55.8, -2.0], [53.5, 0.3], [51.5, 1.4], [50.8, -0.5], [50.0, -5.5],
      [51.5, -4.5], [53.5, -3.0], [54.5, -3.5], [55.8, -2.0]
    ],
  },
  {
    id: "JP-13",
    countryId: "JPN",
    name: "Tokyo Prefecture",
    code: "TK",
    centerLat: 35.6762,
    centerLon: 139.6503,
    timezone: "Asia/Tokyo",
    utcOffset: "+09:00",
    totalAreaKm2: 2194,
    acquiredAreaKm2: 1980,
    dominantProfile: "@discord_jp",
    profileType: "@profile",
    borderPolygon: [
      [35.9, 139.1], [35.9, 139.9], [35.5, 139.9], [35.5, 139.1], [35.9, 139.1]
    ],
  },
  {
    id: "DE-BY",
    countryId: "DEU",
    name: "Bavaria",
    code: "BY",
    centerLat: 48.7904,
    centerLon: 11.4979,
    timezone: "Europe/Berlin",
    utcOffset: "+02:00",
    totalAreaKm2: 70550,
    acquiredAreaKm2: 52000,
    dominantProfile: "@linear_app",
    profileType: "product",
    borderPolygon: [
      [50.5, 10.0], [50.5, 12.0], [49.0, 13.5], [47.5, 13.0], [47.5, 10.0],
      [49.0, 9.0], [50.5, 10.0]
    ],
  },
];

export const CITY_SPACES: CityVillageSpace[] = [
  // India Cities & Villages
  {
    id: "city-blr",
    name: "Bengaluru Innovation Valley",
    countryId: "IND",
    stateId: "IN-KA",
    district: "Bengaluru Urban",
    type: "Mega City",
    lat: 12.9716,
    lon: 77.5946,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    population: "13,600,000",
    status: "Claimed",
    currentHolder: "@chethan",
    holderType: "@profile",
    currentBid: 34500,
    minBid: 34501,
    acquiredAreaKm2: 741,
    expansionRadiusKm: 28,
    expansionRateKm2Per100: 4.2,
    contributors: [
      { userName: "@chethan", amount: "$18,500", productName: "Antigravity Dev", percentageContribution: 54 },
      { userName: "@aarav_sharma", amount: "$9,000", productName: "Canva Pro", percentageContribution: 26 },
      { userName: "@karthik_tech", amount: "$7,000", productName: "Dukaan Hub", percentageContribution: 20 },
    ],
    localBorders: [
      [13.15, 77.45], [13.15, 77.75], [12.80, 77.75], [12.80, 77.45], [13.15, 77.45]
    ],
  },
  {
    id: "city-hoskote",
    name: "Hoskote Taluk Sovereign Space",
    countryId: "IND",
    stateId: "IN-KA",
    district: "Bengaluru Rural",
    type: "District",
    lat: 13.0716,
    lon: 77.7983,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    population: "270,000",
    status: "Claimed",
    currentHolder: "@chethan",
    holderType: "@profile",
    currentBid: 12500,
    minBid: 12600,
    acquiredAreaKm2: 345,
    expansionRadiusKm: 24,
    expansionRateKm2Per100: 5.5,
    contributors: [
      { userName: "@chethan", amount: "$6,500", productName: "Antigravity HQ", percentageContribution: 52 },
      { userName: "@canva_design", amount: "$3,500", productName: "Canva Spatial", percentageContribution: 28 },
      { userName: "@razorpay_gateway", amount: "$2,500", productName: "Razorpay Geo", percentageContribution: 20 },
    ],
    localBorders: [
      [13.2185, 77.7820], [13.2080, 77.8340], [13.1890, 77.8920], [13.1490, 77.9620],
      [13.1040, 77.9650], [13.0610, 77.9480], [13.0150, 77.9250], [12.9680, 77.8840],
      [12.9420, 77.8340], [12.9580, 77.7780], [12.9980, 77.7420], [13.0490, 77.7280],
      [13.1070, 77.7410], [13.1680, 77.7550], [13.2185, 77.7820]
    ],
  },
  {
    id: "city-nelamangala",
    name: "Nelamangala Gateway",
    countryId: "IND",
    stateId: "IN-KA",
    district: "Bengaluru Rural",
    type: "Village",
    lat: 13.0973,
    lon: 77.3916,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    population: "37,000",
    status: "Claimed",
    currentHolder: "@canva",
    holderType: "product",
    currentBid: 4200,
    minBid: 4250,
    acquiredAreaKm2: 124,
    expansionRadiusKm: 8,
    expansionRateKm2Per100: 6.5,
    contributors: [
      { userName: "@priya_design", amount: "$2,400", productName: "Canva India", percentageContribution: 57 },
      { userName: "@rahul_gowda", amount: "$1,800", productName: "Village Cloud", percentageContribution: 43 },
    ],
    localBorders: [
      [13.14, 77.35], [13.14, 77.43], [13.05, 77.43], [13.05, 77.35], [13.14, 77.35]
    ],
  },
  {
    id: "city-doddaballapura",
    name: "Doddaballapura Silk Town",
    countryId: "IND",
    stateId: "IN-KA",
    district: "Bengaluru Rural",
    type: "Town",
    lat: 13.2924,
    lon: 77.5432,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    population: "94,000",
    status: "Claimed",
    currentHolder: "@razorpay",
    holderType: "product",
    currentBid: 3800,
    minBid: 3850,
    acquiredAreaKm2: 180,
    expansionRadiusKm: 11,
    expansionRateKm2Per100: 5.8,
    contributors: [
      { userName: "@vikram_pay", amount: "$2,200", productName: "Razorpay Hub", percentageContribution: 58 },
      { userName: "@shashank_k", amount: "$1,600", productName: "Silk Route API", percentageContribution: 42 },
    ],
    localBorders: [
      [13.34, 77.49], [13.34, 77.59], [13.24, 77.59], [13.24, 77.49], [13.34, 77.49]
    ],
  },
  {
    id: "city-hinjawadi",
    name: "Hinjawadi Tech Zone",
    countryId: "IND",
    stateId: "IN-MH",
    district: "Pune",
    type: "Village",
    lat: 18.5913,
    lon: 73.7389,
    timezone: "Asia/Kolkata",
    utcOffset: "+05:30",
    population: "24,000",
    status: "Claimed",
    currentHolder: "@postman",
    holderType: "product",
    currentBid: 5600,
    minBid: 5650,
    acquiredAreaKm2: 88,
    expansionRadiusKm: 7,
    expansionRateKm2Per100: 7.2,
    contributors: [
      { userName: "@abhinav_api", amount: "$3,600", productName: "Postman Flows", percentageContribution: 64 },
      { userName: "@tanvi_dev", amount: "$2,000", productName: "Pune Tech", percentageContribution: 36 },
    ],
    localBorders: [
      [18.63, 73.70], [18.63, 73.78], [18.55, 73.78], [18.55, 73.70], [18.63, 73.70]
    ],
  },
  // USA Cities & Villages
  {
    id: "city-paloalto",
    name: "Palo Alto Silicon Core",
    countryId: "USA",
    stateId: "US-CA",
    district: "Santa Clara County",
    type: "Tech District",
    lat: 37.4419,
    lon: -122.1430,
    timezone: "America/Los_Angeles",
    utcOffset: "-07:00",
    population: "68,000",
    status: "Claimed",
    currentHolder: "@figma",
    holderType: "product",
    currentBid: 28400,
    minBid: 28450,
    acquiredAreaKm2: 66,
    expansionRadiusKm: 14,
    expansionRateKm2Per100: 3.1,
    contributors: [
      { userName: "@dylan_field", amount: "$16,000", productName: "Figma Core", percentageContribution: 56 },
      { userName: "@designer_sara", amount: "$12,400", productName: "Design Tokens", percentageContribution: 44 },
    ],
    localBorders: [
      [37.48, -122.19], [37.48, -122.09], [37.40, -122.09], [37.40, -122.19], [37.48, -122.19]
    ],
  },
  {
    id: "city-woodside",
    name: "Woodside Valley",
    countryId: "USA",
    stateId: "US-CA",
    district: "San Mateo County",
    type: "Village",
    lat: 37.4299,
    lon: -122.2539,
    timezone: "America/Los_Angeles",
    utcOffset: "-07:00",
    population: "5,500",
    status: "Open Space",
    currentHolder: "@available_space",
    holderType: "@profile",
    currentBid: 4100,
    minBid: 4100,
    acquiredAreaKm2: 32,
    expansionRadiusKm: 5,
    expansionRateKm2Per100: 8.5,
    contributors: [],
    localBorders: [
      [37.46, -122.28], [37.46, -122.22], [37.39, -122.22], [37.39, -122.28], [37.46, -122.28]
    ],
  },
  {
    id: "city-nyc",
    name: "New York Silicon Alley",
    countryId: "USA",
    stateId: "US-NY",
    district: "Manhattan",
    type: "Mega City",
    lat: 40.7128,
    lon: -74.0060,
    timezone: "America/New_York",
    utcOffset: "-04:00",
    population: "8,335,000",
    status: "Claimed",
    currentHolder: "@notion",
    holderType: "product",
    currentBid: 31200,
    minBid: 31250,
    acquiredAreaKm2: 780,
    expansionRadiusKm: 26,
    expansionRateKm2Per100: 3.8,
    contributors: [
      { userName: "@ivan_zhao", amount: "$18,000", productName: "Notion Team", percentageContribution: 58 },
      { userName: "@sam_altman", amount: "$13,200", productName: "OpenAI Vault", percentageContribution: 42 },
    ],
    localBorders: [
      [40.85, -74.05], [40.85, -73.90], [40.65, -73.90], [40.65, -74.05], [40.85, -74.05]
    ],
  },
  // UK
  {
    id: "city-ldn",
    name: "Shoreditch Tech City",
    countryId: "GBR",
    stateId: "GB-ENG",
    district: "Hackney, London",
    type: "Tech District",
    lat: 51.5260,
    lon: -0.0780,
    timezone: "Europe/London",
    utcOffset: "+01:00",
    population: "45,000",
    status: "Claimed",
    currentHolder: "@chatgpt",
    holderType: "product",
    currentBid: 24500,
    minBid: 24550,
    acquiredAreaKm2: 120,
    expansionRadiusKm: 12,
    expansionRateKm2Per100: 5.0,
    contributors: [
      { userName: "@jonathan_ai", amount: "$14,000", productName: "OpenAI UK", percentageContribution: 57 },
      { userName: "@deepmind_team", amount: "$10,500", productName: "AlphaFold Base", percentageContribution: 43 },
    ],
    localBorders: [
      [51.55, -0.12], [51.55, -0.04], [51.49, -0.04], [51.49, -0.12], [51.55, -0.12]
    ],
  },
  // Japan
  {
    id: "city-shibuya",
    name: "Shibuya AI Crossing",
    countryId: "JPN",
    stateId: "JP-13",
    district: "Shibuya",
    type: "Mega City",
    lat: 35.6595,
    lon: 139.7004,
    timezone: "Asia/Tokyo",
    utcOffset: "+09:00",
    population: "220,000",
    status: "Claimed",
    currentHolder: "@discord",
    holderType: "product",
    currentBid: 21800,
    minBid: 21850,
    acquiredAreaKm2: 150,
    expansionRadiusKm: 15,
    expansionRateKm2Per100: 4.8,
    contributors: [
      { userName: "@kenji_sato", amount: "$12,000", productName: "Discord Nitro", percentageContribution: 55 },
      { userName: "@sakura_t", amount: "$9,800", productName: "Line App Core", percentageContribution: 45 },
    ],
    localBorders: [
      [35.69, 139.66], [35.69, 139.74], [35.62, 139.74], [35.62, 139.66], [35.69, 139.66]
    ],
  },
  // Germany
  {
    id: "city-mitte",
    name: "Berlin Mitte",
    countryId: "DEU",
    stateId: "DE-BY",
    district: "Mitte",
    type: "City",
    lat: 52.5200,
    lon: 13.4050,
    timezone: "Europe/Berlin",
    utcOffset: "+02:00",
    population: "385,000",
    status: "Claimed",
    currentHolder: "@linear",
    holderType: "product",
    currentBid: 19400,
    minBid: 19450,
    acquiredAreaKm2: 240,
    expansionRadiusKm: 18,
    expansionRateKm2Per100: 4.5,
    contributors: [
      { userName: "@lukas_weber", amount: "$11,000", productName: "Linear Berlin", percentageContribution: 57 },
      { userName: "@maximilian_k", amount: "$8,400", productName: "N26 Space", percentageContribution: 43 },
    ],
    localBorders: [
      [52.56, 13.34], [52.56, 13.46], [52.48, 13.46], [52.48, 13.34], [52.56, 13.34]
    ],
  },
];


