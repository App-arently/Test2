export const productTypes = [
  {
    id: 'tshirt',
    name: 'T-Shirt',
    basePrice: 1200, // $12 in cents
    retailPrice: 3700, // $37 in cents
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White', 'Gray'],
    printfulVariantId: '4012', // Example Printful variant ID
  },
  {
    id: 'hoodie',
    name: 'Hoodie',
    basePrice: 2500, // $25 in cents
    retailPrice: 6900, // $69 in cents
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    colors: ['Black', 'White', 'Gray'],
    printfulVariantId: '4013',
  },
  {
    id: 'cap',
    name: 'Cap',
    basePrice: 1500, // $15 in cents
    retailPrice: 4500, // $45 in cents
    sizes: ['One Size'],
    colors: ['Black', 'White', 'Navy'],
    printfulVariantId: '4014',
  },
  {
    id: 'poster',
    name: 'Poster',
    basePrice: 800, // $8 in cents
    retailPrice: 2700, // $27 in cents
    sizes: ['12x18', '18x24', '24x36'],
    colors: ['Standard'],
    printfulVariantId: '4015',
  },
]

export const designTypes = [
  {
    id: 'player',
    label: 'Player',
    icon: '👤',
    description: 'Feature a specific player',
  },
  {
    id: 'team',
    label: 'Team Logo',
    icon: '⚽',
    description: 'Team-themed design',
  },
  {
    id: 'text',
    label: 'Text Only',
    icon: 'Aa',
    description: 'Typography-based design',
  },
]

export const teams = [
  // English Premier League
  { id: 'manchester-united', name: 'Manchester United', country: 'England' },
  { id: 'manchester-city', name: 'Manchester City', country: 'England' },
  { id: 'liverpool', name: 'Liverpool', country: 'England' },
  { id: 'chelsea', name: 'Chelsea', country: 'England' },
  { id: 'arsenal', name: 'Arsenal', country: 'England' },
  { id: 'tottenham', name: 'Tottenham Hotspur', country: 'England' },

  // La Liga
  { id: 'real-madrid', name: 'Real Madrid', country: 'Spain' },
  { id: 'barcelona', name: 'Barcelona', country: 'Spain' },
  { id: 'atletico-madrid', name: 'Atletico Madrid', country: 'Spain' },
  { id: 'sevilla', name: 'Sevilla', country: 'Spain' },
  { id: 'valencia', name: 'Valencia', country: 'Spain' },
  { id: 'villarreal', name: 'Villarreal', country: 'Spain' },

  // Bundesliga
  { id: 'bayern-munich', name: 'Bayern Munich', country: 'Germany' },
  { id: 'borussia-dortmund', name: 'Borussia Dortmund', country: 'Germany' },
  { id: 'rb-leipzig', name: 'RB Leipzig', country: 'Germany' },
  { id: 'bayer-leverkusen', name: 'Bayer Leverkusen', country: 'Germany' },

  // Serie A
  { id: 'juventus', name: 'Juventus', country: 'Italy' },
  { id: 'ac-milan', name: 'AC Milan', country: 'Italy' },
  { id: 'inter-milan', name: 'Inter Milan', country: 'Italy' },
  { id: 'napoli', name: 'Napoli', country: 'Italy' },
  { id: 'roma', name: 'AS Roma', country: 'Italy' },
  { id: 'lazio', name: 'Lazio', country: 'Italy' },
  { id: 'atalanta', name: 'Atalanta', country: 'Italy' },

  // Ligue 1
  { id: 'psg', name: 'Paris Saint-Germain', country: 'France' },
  { id: 'lyon', name: 'Lyon', country: 'France' },
  { id: 'marseille', name: 'Marseille', country: 'France' },

  // Other Top Clubs
  { id: 'ajax', name: 'Ajax', country: 'Netherlands' },
  { id: 'porto', name: 'FC Porto', country: 'Portugal' },
  { id: 'benfica', name: 'Benfica', country: 'Portugal' },
  { id: 'celtic', name: 'Celtic', country: 'Scotland' },
]

export const players = [
  // Current Top Stars
  { id: 'messi', name: 'Lionel Messi', team: 'Inter Miami' },
  { id: 'ronaldo', name: 'Cristiano Ronaldo', team: 'Al Nassr' },
  { id: 'mbappe', name: 'Kylian Mbappe', team: 'Real Madrid' },
  { id: 'haaland', name: 'Erling Haaland', team: 'Manchester City' },
  { id: 'debruyne', name: 'Kevin De Bruyne', team: 'Manchester City' },
  { id: 'salah', name: 'Mohamed Salah', team: 'Liverpool' },
  { id: 'lewandowski', name: 'Robert Lewandowski', team: 'Barcelona' },
  { id: 'neymar', name: 'Neymar Jr', team: 'Al Hilal' },
  { id: 'modric', name: 'Luka Modric', team: 'Real Madrid' },
  { id: 'benzema', name: 'Karim Benzema', team: 'Al Ittihad' },

  // Premier League Stars
  { id: 'saka', name: 'Bukayo Saka', team: 'Arsenal' },
  { id: 'foden', name: 'Phil Foden', team: 'Manchester City' },
  { id: 'son', name: 'Son Heung-min', team: 'Tottenham' },
  { id: 'bruno', name: 'Bruno Fernandes', team: 'Manchester United' },
  { id: 'rashford', name: 'Marcus Rashford', team: 'Manchester United' },
  { id: 'rice', name: 'Declan Rice', team: 'Arsenal' },
  { id: 'palmer', name: 'Cole Palmer', team: 'Chelsea' },
  { id: 'vandijk', name: 'Virgil van Dijk', team: 'Liverpool' },
  { id: 'odegaard', name: 'Martin Odegaard', team: 'Arsenal' },
  { id: 'alisson', name: 'Alisson Becker', team: 'Liverpool' },

  // La Liga Stars
  { id: 'vinicius', name: 'Vinicius Jr', team: 'Real Madrid' },
  { id: 'bellingham', name: 'Jude Bellingham', team: 'Real Madrid' },
  { id: 'pedri', name: 'Pedri', team: 'Barcelona' },
  { id: 'gavi', name: 'Gavi', team: 'Barcelona' },
  { id: 'griezmann', name: 'Antoine Griezmann', team: 'Atletico Madrid' },
  { id: 'oblak', name: 'Jan Oblak', team: 'Atletico Madrid' },
  { id: 'kounde', name: 'Jules Kounde', team: 'Barcelona' },

  // Bundesliga Stars
  { id: 'musiala', name: 'Jamal Musiala', team: 'Bayern Munich' },
  { id: 'sane', name: 'Leroy Sane', team: 'Bayern Munich' },
  { id: 'wirtz', name: 'Florian Wirtz', team: 'Bayer Leverkusen' },
  { id: 'davies', name: 'Alphonso Davies', team: 'Bayern Munich' },
  { id: 'kimmich', name: 'Joshua Kimmich', team: 'Bayern Munich' },

  // Serie A Stars
  { id: 'osimhen', name: 'Victor Osimhen', team: 'Napoli' },
  { id: 'lautaro', name: 'Lautaro Martinez', team: 'Inter Milan' },
  { id: 'leao', name: 'Rafael Leao', team: 'AC Milan' },
  { id: 'chiesa', name: 'Federico Chiesa', team: 'Juventus' },
  { id: 'vlahovic', name: 'Dusan Vlahovic', team: 'Juventus' },

  // Legends (Still popular for merch)
  { id: 'zidane', name: 'Zinedine Zidane', team: 'Legend' },
  { id: 'beckham', name: 'David Beckham', team: 'Legend' },
  { id: 'ronaldinho', name: 'Ronaldinho', team: 'Legend' },
  { id: 'henry', name: 'Thierry Henry', team: 'Legend' },
  { id: 'gerrard', name: 'Steven Gerrard', team: 'Legend' },
  { id: 'lampard', name: 'Frank Lampard', team: 'Legend' },
  { id: 'rooney', name: 'Wayne Rooney', team: 'Legend' },
  { id: 'iniesta', name: 'Andres Iniesta', team: 'Legend' },
  { id: 'xavi', name: 'Xavi Hernandez', team: 'Legend' },
  { id: 'pirlo', name: 'Andrea Pirlo', team: 'Legend' },
  { id: 'delpiero', name: 'Alessandro Del Piero', team: 'Legend' },
  { id: 'kaka', name: 'Kaka', team: 'Legend' },
]

export function getProductById(id: string) {
  return productTypes.find(p => p.id === id)
}

export function getTeamById(id: string) {
  return teams.find(t => t.id === id)
}

export function getPlayerById(id: string) {
  return players.find(p => p.id === id)
}
