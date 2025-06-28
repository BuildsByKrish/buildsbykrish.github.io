const seriesData = [
  {
    title: "Farzi",
    genres: ["Crime", "Thriller"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 53,
    episodes: 8
  },
  {
    title: "Wednesday",
    genres: ["Mystery", "Fantasy", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 49,
    episodes: 8
  },
  {
    title: "Stranger Things",
    genres: ["Horror", "Mystery", "Sci-Fi"],
    rating: 5,
    platform: "Netflix",
    runtime: 51,
    episodes: 34
  },
  {
    title: "Rudra",
    genres: ["Crime", "Psychological"],
    rating: 4,
    platform: "Disney+ Hotstar",
    runtime: 47,
    episodes: 6
  },
  {
    title: "Scam 1992",
    genres: ["Biography", "Crime", "Drama"],
    rating: 5,
    platform: "SonyLIV",
    runtime: 55,
    episodes: 10
  },
  {
    title: "The Family Man",
    genres: ["Action", "Drama", "Thriller"],
    rating: 5,
    platform: "Amazon Prime",
    runtime: 42,
    episodes: 19
  },
  {
    title: "The Boys",
    genres: ["Action", "Drama", "Superhero"],
    rating: 5,
    platform: "Amazon Prime",
    runtime: 60,
    episodes: 24
  },
  {
    title: "All of Us Are Dead",
    genres: ["Horror", "Thriller", "Zombie"],
    rating: 4,
    platform: "Netflix",
    runtime: 58,
    episodes: 12
  },
  {
    title: "The Last of Us",
    genres: ["Drama", "Adventure", "Apocalypse"],
    rating: 5,
    platform: "HBO",
    runtime: 52,
    episodes: 9
  },
  {
    title: "Lockwood & Co.",
    genres: ["Fantasy", "Adventure"],
    rating: 4,
    platform: "Netflix",
    runtime: 47,
    episodes: 8
  },
  {
    title: "Dahmer – Monster: The Jeffrey Dahmer Story",
    genres: ["Crime", "Drama", "Horror"],
    rating: 4,
    platform: "Netflix",
    runtime: 52,
    episodes: 10
  },
  {
    title: "Ozark",
    genres: ["Crime", "Drama", "Thriller"],
    rating: 5,
    platform: "Netflix",
    runtime: 60,
    episodes: 44
  },
  {
    title: "Taaza Khabar",
    genres: ["Drama", "Fantasy"],
    rating: 3,
    platform: "Disney+ Hotstar",
    runtime: 33,
    episodes: 6
  },
  {
    title: "1899",
    genres: ["Mystery", "Drama", "Sci-Fi"],
    rating: 4,
    platform: "Netflix",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Money Heist",
    genres: ["Action", "Thriller", "Crime"],
    rating: 5,
    platform: "Netflix",
    runtime: 45,
    episodes: 41
  },
  {
    title: "Cobra Kai",
    genres: ["Action", "Drama", "Sports"],
    rating: 4,
    platform: "Netflix",
    runtime: 34,
    episodes: 50
  },
  {
    title: "The Watcher",
    genres: ["Mystery", "Drama", "Thriller"],
    rating: 3,
    platform: "Netflix",
    runtime: 48,
    episodes: 7
  },
  {
    title: "Loki",
    genres: ["Superhero", "Fantasy", "Drama"],
    rating: 4,
    platform: "Disney+",
    runtime: 51,
    episodes: 12
  },
  {
    title: "Moon Knight",
    genres: ["Superhero", "Mystery", "Adventure"],
    rating: 4,
    platform: "Disney+",
    runtime: 45,
    episodes: 6
  },
  {
    title: "Alice in Borderland",
    genres: ["Sci-Fi", "Thriller", "Mystery"],
    rating: 4,
    platform: "Netflix",
    runtime: 51,
    episodes: 16
  },
  {
    title: "Asur",
    genres: ["Thriller", "Mystery", "Crime"],
    rating: 5,
    platform: "JioCinema",
    runtime: 40,
    episodes: 16
  },
  {
    title: "College Romance",
    genres: ["Romance", "Comedy", "Drama"],
    rating: 3,
    platform: "SonyLIV",
    runtime: 28,
    episodes: 15
  },
  {
    title: "Mismatched",
    genres: ["Romance", "Drama", "Coming-of-age"],
    rating: 3,
    platform: "Netflix",
    runtime: 35,
    episodes: 12
  },
  {
    title: "Yeh Kaali Kaali Ankhein",
    genres: ["Romantic", "Thriller", "Drama"],
    rating: 3,
    platform: "Netflix",
    runtime: 36,
    episodes: 8
  },
  {
    title: "Mirzapur",
    genres: ["Action", "Crime", "Drama"],
    rating: 5,
    platform: "Amazon Prime",
    runtime: 47,
    episodes: 19
  }
seriesData.push(
  {
    title: "Criminal Justice",
    genres: ["Crime", "Drama", "Courtroom"],
    rating: 4,
    platform: "Disney+ Hotstar",
    runtime: 45,
    episodes: 16
  },
  {
    title: "Lucifer",
    genres: ["Crime", "Fantasy", "Supernatural"],
    rating: 4,
    platform: "Netflix",
    runtime: 48,
    episodes: 93
  },
  {
    title: "Saas Bahu Aur Flamingo",
    genres: ["Action", "Drama", "Dark Comedy"],
    rating: 4,
    platform: "Disney+ Hotstar",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Dahaad",
    genres: ["Crime", "Thriller", "Mystery"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Panchayat",
    genres: ["Comedy", "Drama"],
    rating: 5,
    platform: "Amazon Prime",
    runtime: 35,
    episodes: 16
  },
  {
    title: "Taj",
    genres: ["Historical", "Drama"],
    rating: 4,
    platform: "ZEE5",
    runtime: 48,
    episodes: 10
  },
  {
    title: "The Night Manager",
    genres: ["Spy", "Drama", "Action"],
    rating: 4,
    platform: "Disney+ Hotstar",
    runtime: 45,
    episodes: 7
  },
  {
    title: "Lucky Guy",
    genres: ["Romance", "Drama", "Fantasy"],
    rating: 3,
    platform: "Viki",
    runtime: 25,
    episodes: 6
  },
  {
    title: "Business Proposal",
    genres: ["Romance", "Comedy", "K-Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 62,
    episodes: 12
  },
  {
    title: "One Dollar Lawyer",
    genres: ["Legal", "Comedy"],
    rating: 4,
    platform: "Disney+",
    runtime: 60,
    episodes: 12
  },
  {
    title: "Gen V",
    genres: ["Superhero", "Action", "Sci-Fi"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 51,
    episodes: 8
  },
  {
    title: "November Story",
    genres: ["Thriller", "Drama", "Mystery"],
    rating: 3,
    platform: "Disney+ Hotstar",
    runtime: 42,
    episodes: 7
  },
  {
    title: "Dhindora",
    genres: ["Comedy", "Drama"],
    rating: 4,
    platform: "YouTube",
    runtime: 22,
    episodes: 8
  },
  {
    title: "Breaking Bad",
    genres: ["Crime", "Drama", "Thriller"],
    rating: 5,
    platform: "Netflix",
    runtime: 47,
    episodes: 62
  },
  {
    title: "King the Land",
    genres: ["Romance", "Comedy"],
    rating: 4,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  },
  {
    title: "The King: Eternal Monarch",
    genres: ["Fantasy", "Romance", "Mystery"],
    rating: 4,
    platform: "Netflix",
    runtime: 72,
    episodes: 16
  },
  {
    title: "Goblin: The Lonely and Great God",
    genres: ["Fantasy", "Romance"],
    rating: 5,
    platform: "Viki",
    runtime: 78,
    episodes: 16
  },
  {
    title: "What's Wrong With Secretary Kim",
    genres: ["Romance", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Behind Your Touch",
    genres: ["Mystery", "Drama", "Comedy"],
    rating: 4,
    platform: "Netflix",
    runtime: 70,
    episodes: 16
  },
  {
    title: "Crazy Love",
    genres: ["Romance", "Comedy", "Thriller"],
    rating: 3,
    platform: "Disney+",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Crash Landing on You",
    genres: ["Romance", "Drama", "Military"],
    rating: 5,
    platform: "Netflix",
    runtime: 84,
    episodes: 16
  },
  {
    title: "Flower of Evil",
    genres: ["Thriller", "Crime", "Romance"],
    rating: 5,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  },
  {
    title: "It's Okay to Not Be Okay",
    genres: ["Romance", "Drama", "Mental Health"],
    rating: 5,
    platform: "Netflix",
    runtime: 75,
    episodes: 16
  },
  {
    title: "The King of Pigs",
    genres: ["Thriller", "Crime", "Psychological"],
    rating: 4,
    platform: "Viki",
    runtime: 40,
    episodes: 12
  },
  {
    title: "Vincenzo",
    genres: ["Crime", "Comedy", "Drama"],
    rating: 5,
    platform: "Netflix",
    runtime: 80,
    episodes: 20
  }
);
seriesData.push(
  {
    title: "Lawless Lawyer",
    genres: ["Legal", "Action", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  },
  {
    title: "Strong Girl Nam-soon",
    genres: ["Superhero", "Comedy", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 55,
    episodes: 16
  },
  {
    title: "Legal High",
    genres: ["Comedy", "Courtroom"],
    rating: 3,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Big Mouth",
    genres: ["Thriller", "Crime", "Mystery"],
    rating: 4,
    platform: "Disney+",
    runtime: 62,
    episodes: 16
  },
  {
    title: "Extraordinary Attorney Woo",
    genres: ["Legal", "Drama"],
    rating: 5,
    platform: "Netflix",
    runtime: 70,
    episodes: 16
  },
  {
    title: "A Time Called You",
    genres: ["Romance", "Mystery", "Time Travel"],
    rating: 4,
    platform: "Netflix",
    runtime: 60,
    episodes: 12
  },
  {
    title: "She Was Pretty",
    genres: ["Romance", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 58,
    episodes: 16
  },
  {
    title: "Kill It",
    genres: ["Thriller", "Action", "Mystery"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 12
  },
  {
    title: "The Secret Life of My Secretary",
    genres: ["Romance", "Comedy"],
    rating: 3,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "I Am Not a Robot",
    genres: ["Romance", "Sci-Fi", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 35,
    episodes: 16
  },
  {
    title: "Where Stars Land",
    genres: ["Romance", "Drama"],
    rating: 3,
    platform: "Viki",
    runtime: 65,
    episodes: 16
  },
  {
    title: "Descendants of the Sun",
    genres: ["Action", "Romance", "Military"],
    rating: 5,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Playful Kiss",
    genres: ["Romance", "Comedy", "School"],
    rating: 3,
    platform: "Viki",
    runtime: 50,
    episodes: 16
  },
  {
    title: "Emergency Couple",
    genres: ["Romance", "Medical", "Comedy"],
    rating: 3,
    platform: "Viki",
    runtime: 60,
    episodes: 21
  },
  {
    title: "Familiar Wife",
    genres: ["Romance", "Fantasy", "Time Travel"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Dhootha",
    genres: ["Thriller", "Supernatural"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 45,
    episodes: 8
  },
  {
    title: "Berlin",
    genres: ["Action", "Thriller"],
    rating: 3,
    platform: "Netflix",
    runtime: 45,
    episodes: 8
  },
  {
    title: "Killer Soup",
    genres: ["Dark Comedy", "Thriller"],
    rating: 3,
    platform: "Netflix",
    runtime: 52,
    episodes: 8
  },
  {
    title: "K2",
    genres: ["Action", "Political", "Romance"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Bring It On, Ghost",
    genres: ["Comedy", "Horror", "Romance"],
    rating: 3,
    platform: "Viki",
    runtime: 45,
    episodes: 16
  },
  {
    title: "Catch the Ghost",
    genres: ["Mystery", "Crime", "Comedy"],
    rating: 3,
    platform: "Viki",
    runtime: 58,
    episodes: 16
  },
  {
    title: "Kill Me, Heal Me",
    genres: ["Psychological", "Romance", "Comedy"],
    rating: 5,
    platform: "Viki",
    runtime: 58,
    episodes: 20
  },
  {
    title: "Hotel Del Luna",
    genres: ["Fantasy", "Romance", "Mystery"],
    rating: 5,
    platform: "Netflix",
    runtime: 75,
    episodes: 16
  },
  {
    title: "Miss Hammurabi",
    genres: ["Legal", "Drama"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Angel's Last Mission: Love",
    genres: ["Fantasy", "Romance", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  }
);
seriesData.push(
  {
    title: "Boys Over Flowers",
    genres: ["Romance", "Drama", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 70,
    episodes: 25
  },
  {
    title: "Sweet Sweet",
    genres: ["Romance", "Comedy", "C-Drama"],
    rating: 3,
    platform: "iQIYI",
    runtime: 42,
    episodes: 24
  },
  {
    title: "Fight for My Way",
    genres: ["Romance", "Drama", "Slice of Life"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Who Are You: School 2015",
    genres: ["School", "Drama", "Mystery"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Reacher",
    genres: ["Action", "Thriller", "Drama"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Game of Thrones",
    genres: ["Fantasy", "Drama", "Action"],
    rating: 5,
    platform: "HBO",
    runtime: 57,
    episodes: 73
  },
  {
    title: "The Queen's Gambit",
    genres: ["Drama", "Sports"],
    rating: 5,
    platform: "Netflix",
    runtime: 55,
    episodes: 7
  },
  {
    title: "A Simple Murder",
    genres: ["Dark Comedy", "Crime"],
    rating: 3,
    platform: "SonyLIV",
    runtime: 35,
    episodes: 7
  },
  {
    title: "The Wind Blows",
    genres: ["Romance", "Melodrama"],
    rating: 4,
    platform: "Netflix",
    runtime: 62,
    episodes: 16
  },
  {
    title: "Pill",
    genres: ["Sci-Fi", "Thriller", "Short"],
    rating: 3,
    platform: "YouTube",
    runtime: 15,
    episodes: 1
  },
  {
    title: "Gyaarah Gyaraah",
    genres: ["Mystery", "Adventure", "Time Travel"],
    rating: 4,
    platform: "ZEE5",
    runtime: 45,
    episodes: 8
  },
  {
    title: "Tokyo Swindlers",
    genres: ["Crime", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 50,
    episodes: 6
  },
  {
    title: "Tribhuwan Mishra: C.A Topper",
    genres: ["Comedy", "Drama"],
    rating: 4,
    platform: "Amazon miniTV",
    runtime: 30,
    episodes: 8
  },
  {
    title: "Legend of the Blue Sea",
    genres: ["Fantasy", "Romance", "Comedy"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 20
  },
  {
    title: "My Demon",
    genres: ["Fantasy", "Romance"],
    rating: 4,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  },
  {
    title: "Queen of Tears",
    genres: ["Romance", "Drama"],
    rating: 5,
    platform: "Netflix",
    runtime: 70,
    episodes: 16
  },
  {
    title: "Love to Hate You",
    genres: ["Romantic Comedy"],
    rating: 3,
    platform: "Netflix",
    runtime: 45,
    episodes: 10
  },
  {
    title: "No Gain No Love",
    genres: ["Comedy", "Romance"],
    rating: 3,
    platform: "YouTube",
    runtime: 12,
    episodes: 12
  },
  {
    title: "The Law Cafe",
    genres: ["Romance", "Legal", "Comedy"],
    rating: 3,
    platform: "Viki",
    runtime: 65,
    episodes: 16
  },
  {
    title: "Mere Humsafar",
    genres: ["Romance", "Drama"],
    rating: 4,
    platform: "ARY Digital",
    runtime: 38,
    episodes: 40
  },
  {
    title: "Kabhi Main Kabhi Tum",
    genres: ["Romance", "Drama", "Short"],
    rating: 3,
    platform: "YouTube",
    runtime: 18,
    episodes: 1
  },
  {
    title: "Brinda",
    genres: ["Thriller", "Crime"],
    rating: 3,
    platform: "SonyLIV",
    runtime: 45,
    episodes: 8
  },
  {
    title: "Paatal Lok",
    genres: ["Crime", "Thriller", "Mystery"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 47,
    episodes: 9
  },
  {
    title: "Pinocchio",
    genres: ["Romance", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 60,
    episodes: 20
  },
  {
    title: "Destined With You",
    genres: ["Fantasy", "Romance", "Mystery"],
    rating: 4,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  }
);
seriesData.push(
  {
    title: "Better Call Saul",
    genres: ["Crime", "Drama"],
    rating: 5,
    platform: "Netflix",
    runtime: 47,
    episodes: 63
  },
  {
    title: "Mr. & Mrs. Smith",
    genres: ["Action", "Romance", "Drama"],
    rating: 4,
    platform: "Amazon Prime",
    runtime: 45,
    episodes: 8
  },
  {
    title: "XO, Kitty",
    genres: ["Romantic Comedy", "Drama"],
    rating: 3,
    platform: "Netflix",
    runtime: 33,
    episodes: 10
  },
  {
    title: "Bank Under Siege",
    genres: ["Thriller", "Heist"],
    rating: 4,
    platform: "ZEE5",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Black Warrant",
    genres: ["Action", "Political"],
    rating: 3,
    platform: "YouTube",
    runtime: 30,
    episodes: 3
  },
  {
    title: "Day of the Jackal",
    genres: ["Thriller", "Crime"],
    rating: 4,
    platform: "Sky Atlantic",
    runtime: 45,
    episodes: 6
  },
  {
    title: "Lupin",
    genres: ["Crime", "Thriller"],
    rating: 4,
    platform: "Netflix",
    runtime: 45,
    episodes: 17
  },
  {
    title: "The Gentlemen",
    genres: ["Crime", "Drama", "Action"],
    rating: 4,
    platform: "Netflix",
    runtime: 45,
    episodes: 8
  },
  {
    title: "Marry My Husband",
    genres: ["Romance", "Drama"],
    rating: 4,
    platform: "Prime Video",
    runtime: 60,
    episodes: 16
  },
  {
    title: "The Night Agent",
    genres: ["Thriller", "Spy"],
    rating: 4,
    platform: "Netflix",
    runtime: 48,
    episodes: 10
  },
  {
    title: "The Trauma Code: Heroes on Call",
    genres: ["Medical", "Drama"],
    rating: 3,
    platform: "MBC",
    runtime: 60,
    episodes: 12
  },
  {
    title: "The Lincoln Lawyer",
    genres: ["Legal", "Thriller"],
    rating: 4,
    platform: "Netflix",
    runtime: 47,
    episodes: 20
  },
  {
    title: "Melo Movie",
    genres: ["Romance", "Drama"],
    rating: 3,
    platform: "TVING",
    runtime: 30,
    episodes: 10
  },
  {
    title: "When Life Gives You Tangerines",
    genres: ["Slice of Life", "Drama"],
    rating: 4,
    platform: "IndieVault",
    runtime: 42,
    episodes: 8
  },
  {
    title: "Severance",
    genres: ["Drama", "Sci-Fi", "Thriller"],
    rating: 5,
    platform: "Apple TV+",
    runtime: 55,
    episodes: 9
  },
  {
    title: "Start-Up",
    genres: ["Business", "Drama", "Romance"],
    rating: 4,
    platform: "Netflix",
    runtime: 65,
    episodes: 16
  },
  {
    title: "A Killer Paradox",
    genres: ["Thriller", "Mystery"],
    rating: 4,
    platform: "Netflix",
    runtime: 50,
    episodes: 8
  },
  {
    title: "Juvenile Justice",
    genres: ["Legal", "Crime", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 60,
    episodes: 10
  },
  {
    title: "The Heirs",
    genres: ["Romance", "Drama", "School"],
    rating: 4,
    platform: "Viki",
    runtime: 60,
    episodes: 20
  },
  {
    title: "My ID is Gangnam Beauty",
    genres: ["Romance", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Suspicious Partner",
    genres: ["Romance", "Legal", "Comedy"],
    rating: 4,
    platform: "Netflix",
    runtime: 60,
    episodes: 20
  },
  {
    title: "The Glory",
    genres: ["Thriller", "Revenge", "Drama"],
    rating: 4,
    platform: "Netflix",
    runtime: 55,
    episodes: 16
  },
  {
    title: "The Golden Spoon",
    genres: ["Drama", "Fantasy"],
    rating: 4,
    platform: "Disney+",
    runtime: 60,
    episodes: 16
  },
  {
    title: "Gyeongseong Creature",
    genres: ["Thriller", "Fantasy", "Horror"],
    rating: 4,
    platform: "Netflix",
    runtime: 50,
    episodes: 10
  },
  {
    title: "Sweet Home",
    genres: ["Horror", "Thriller", "Apocalypse"],
    rating: 4,
    platform: "Netflix",
    runtime: 50,
    episodes: 18
  },
  {
    title: "Unlock My Boss",
    genres: ["Fantasy", "Comedy", "Office"],
    rating: 3,
    platform: "Netflix",
    runtime: 55,
    episodes: 12
  },
  {
    title: "Peaky Blinders",
    genres: ["Crime", "Drama", "Historical"],
    rating: 5,
    platform: "Netflix",
    runtime: 55,
    episodes: 36
  }
);
];