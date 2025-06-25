const seriesData = [
  {
    title: "Farzi",
    platform: "Prime Video",
    genres: ["Thriller", "Crime"],
    country: "India",
    description: "A gifted artist finds himself pulled into the underground world of fake currency, testing the limits of his morals, skill, and survival instincts.",
    rating: 4
  },
  {
    title: "Wednesday",
    platform: "Netflix",
    genres: ["Supernatural", "Mystery", "Comedy"],
    country: "USA",
    description: "Wednesday Addams investigates a string of murders at Nevermore Academy while mastering her emerging psychic abilities.",
    rating: 4
  },
  {
    title: "Stranger Things",
    platform: "Netflix",
    genres: ["Supernatural", "Thriller", "Sci-Fi"],
    country: "USA",
    description: "In a small town in the 1980s, kids uncover terrifying government secrets and face supernatural creatures after a boy goes missing.",
    rating: 5
  },
  {
    title: "Rudra: The Edge of Darkness",
    platform: "Disney+ Hotstar",
    genres: ["Crime", "Drama", "Psychological"],
    country: "India",
    description: "A brilliant but emotionally haunted cop solves twisted cases while battling his own dark demons in this psychological crime drama.",
    rating: 4
  },
  {
    title: "Scam 1992",
    platform: "SonyLIV",
    genres: ["Drama", "Crime", "Biography"],
    country: "India",
    description: "The rise and fall of Harshad Mehta, the stockbroker behind one of India's biggest financial scams. Based on true events.",
    rating: 5
  },
  {
    title: "The Family Man",
    platform: "Prime Video",
    genres: ["Action", "Drama", "Thriller"],
    country: "India",
    description: "A middle-class man secretly works as an intelligence officer, balancing high-stakes missions with the chaos of family life.",
    rating: 5
  },
  {
    title: "The Boys",
    platform: "Prime Video",
    genres: ["Superhero", "Action", "Satire"],
    country: "USA",
    description: "In a world where superheroes are corrupt celebrities, a group of vigilantes rises to expose and confront them head-on.",
    rating: 5
  },
  {
    title: "All of Us Are Dead",
    platform: "Netflix",
    genres: ["Horror", "Zombie", "Thriller"],
    country: "South Korea",
    description: "A deadly virus outbreak traps students inside a high school as they fight to survive against a growing zombie horde.",
    rating: 4
  },
  {
    title: "The Last of Us",
    platform: "HBO Max",
    genres: ["Drama", "Horror", "Post-Apocalyptic"],
    country: "USA",
    description: "A hardened survivor escorts a teenage girl across a post-apocalyptic America plagued by infected creatures and human cruelty.",
    rating: 5
  },
  {
    title: "Lockwood & Co.",
    platform: "Netflix",
    genres: ["Supernatural", "Mystery", "Adventure"],
    country: "UK",
    description: "Three teens operate a ghost-hunting agency in a haunted London where spirits roam freely and danger is everywhere.",
    rating: 4
  },
  {
    title: "Dahmer – Monster: The Jeffrey Dahmer Story",
    platform: "Netflix",
    genres: ["Crime", "Drama", "True Crime"],
    country: "USA",
    description: "A haunting dramatization of Jeffrey Dahmer’s crimes, exploring how he evaded justice and the impact on his victims' families.",
    rating: 4
  },
  {
    title: "Ozark",
    platform: "Netflix",
    genres: ["Crime", "Drama", "Thriller"],
    country: "USA",
    description: "A financial advisor relocates his family to launder money for a drug cartel, plunging them into a dangerous criminal web.",
    rating: 5
  },
  {
    title: "Taaza Khabar",
    platform: "Disney+ Hotstar",
    genres: ["Fantasy", "Drama", "Comedy"],
    country: "India",
    description: "A sanitation worker's life changes overnight when he discovers he can see the future through a magical newspaper.",
    rating: 3
  },
  {
    title: "1899",
    platform: "Netflix",
    genres: ["Mystery", "Thriller", "Sci-Fi"],
    country: "Germany",
    description: "Passengers aboard a migrant ship face eerie events and shifting realities as they uncover secrets on a journey to America.",
    rating: 4
  },
  {
    title: "Money Heist",
    platform: "Netflix",
    genres: ["Crime", "Thriller", "Drama"],
    country: "Spain",
    description: "A mastermind known as The Professor leads a group of criminals in a daring, high-stakes heist on the Royal Mint of Spain.",
    rating: 5
  },
  {
    title: "Cobra Kai",
    platform: "Netflix",
    genres: ["Action", "Drama", "Martial Arts"],
    country: "USA",
    description: "Decades after the original Karate Kid films, old rivalries reignite as Johnny and Daniel reopen their dojos and clash again.",
    rating: 4
  },
  {
    title: "The Watcher",
    platform: "Netflix",
    genres: ["Mystery", "Thriller", "Horror"],
    country: "USA",
    description: "A couple’s dream home becomes a nightmare when they receive terrifying letters from a mysterious stalker called 'The Watcher'.",
    rating: 3
  },
  {
    title: "Loki",
    platform: "Disney+",
    genres: ["Superhero", "Fantasy", "Adventure"],
    country: "USA",
    description: "After escaping with the Tesseract, Loki faces off against the Time Variance Authority in a multiverse-hopping journey.",
    rating: 4
  },
  {
    title: "Moon Knight",
    platform: "Disney+",
    genres: ["Superhero", "Psychological", "Action"],
    country: "USA",
    description: "Marc Spector, a man with dissociative identity disorder, becomes the avatar of an Egyptian moon god and battles inner demons.",
    rating: 4
  },
  {
    title: "Alice in Borderland",
    platform: "Netflix",
    genres: ["Thriller", "Sci-Fi", "Survival"],
    country: "Japan",
    description: "Trapped in a deserted Tokyo, a group of people must compete in deadly games to survive and uncover the truth behind their world.",
    rating: 5
  },
  {
    title: "Asur",
    platform: "JioCinema",
    genres: ["Thriller", "Mythology", "Crime"],
    country: "India",
    description: "A former forensic expert is drawn into a cat-and-mouse game with a deadly serial killer who believes he's a god in disguise.",
    rating: 4
  },
  {
    title: "College Romance",
    platform: "SonyLIV",
    genres: ["Comedy", "Romance", "Drama"],
    country: "India",
    description: "Three quirky best friends navigate college life, love triangles, and hilarious situations in this relatable youth comedy.",
    rating: 3
  },
  {
    title: "Mismatched",
    platform: "Netflix",
    genres: ["Romance", "Drama", "Coming-of-Age"],
    country: "India",
    description: "Two opposites clash at a tech boot camp and unexpectedly fall into a tangled story of love, ambition, and self-discovery.",
    rating: 3
  },
  {
    title: "Yeh Kaali Kaali Ankhen",
    platform: "Netflix",
    genres: ["Thriller", "Romance", "Drama"],
    country: "India",
    description: "A man’s peaceful life spirals into chaos when the obsessive daughter of a powerful politician declares her love for him.",
    rating: 4
  },
  {
    title: "Mirzapur",
    platform: "Prime Video",
    genres: ["Crime", "Drama", "Action"],
    country: "India",
    description: "Two brothers find themselves caught in the violent power struggle of Mirzapur’s crime-ridden mafia world.",
    rating: 5
  }
];
