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
  },
  {
    title: "Criminal Justice",
    platform: "Disney+ Hotstar",
    genres: ["Crime", "Legal", "Drama"],
    country: "India",
    description: "A cab driver’s life turns upside down when he becomes the prime suspect in a murder case, leading to a gripping courtroom battle and a deep dive into the criminal justice system.",
    rating: 4
  },
  {
    title: "Lucifer",
    platform: "Netflix",
    genres: ["Supernatural", "Crime", "Drama"],
    country: "USA",
    description: "The Devil abandons Hell to run a nightclub in Los Angeles and ends up helping the LAPD solve crimes while exploring his own redemption.",
    rating: 5
  },
  {
    title: "Saas Bahu Aur Flamingo",
    platform: "Disney+ Hotstar",
    genres: ["Crime", "Drama", "Action"],
    country: "India",
    description: "A fierce matriarch runs a covert drug cartel with her daughters-in-law, challenging stereotypes in a gritty tale of power, loyalty, and rebellion.",
    rating: 4
  },
  {
    title: "Dahaad",
    platform: "Prime Video",
    genres: ["Crime", "Thriller", "Mystery"],
    country: "India",
    description: "A female cop investigates a series of mysterious deaths in a small town, uncovering chilling secrets and a possible serial killer.",
    rating: 4
  },
  {
    title: "Panchayat",
    platform: "Prime Video",
    genres: ["Comedy", "Drama", "Slice of Life"],
    country: "India",
    description: "An engineering graduate reluctantly takes a government job in a remote village, navigating quirky locals and unexpected challenges.",
    rating: 5
  },
  {
    title: "Taj: Divided by Blood",
    platform: "ZEE5",
    genres: ["Historical", "Drama", "Political"],
    country: "India",
    description: "Set in the Mughal era, this epic saga explores the power struggles and betrayals within Emperor Akbar’s court as his sons vie for the throne.",
    rating: 4
  },
  {
    title: "The Night Manager",
    platform: "Disney+ Hotstar",
    genres: ["Thriller", "Espionage", "Drama"],
    country: "India",
    description: "A hotel night manager is recruited to infiltrate an arms dealer’s inner circle, leading to a high-stakes game of deception and danger.",
    rating: 4
  },
  {
    title: "Lucky Guy",
    platform: "Amazon miniTV",
    genres: ["Fantasy", "Comedy", "Drama"],
    country: "India",
    description: "A young man’s life changes when he receives a magical locket that brings him extraordinary luck—but at a cost he never expected.",
    rating: 4
  },
  {
    title: "Business Proposal",
    platform: "Netflix",
    genres: ["Romance", "Comedy", "Drama"],
    country: "South Korea",
    description: "A woman goes on a blind date in place of her friend, only to discover her date is her company’s CEO—leading to a hilarious and heartwarming office romance.",
    rating: 4
  },
  {
    title: "One Dollar Lawyer",
    platform: "Disney+ Hotstar",
    genres: ["Legal", "Comedy", "Drama"],
    country: "South Korea",
    description: "A quirky lawyer with unmatched skills charges only one dollar for his services, fighting for justice against the rich and powerful.",
    rating: 4
  },
{
    title: "Crash Landing on You",
    platform: "Netflix",
    genres: ["Romance", "Drama", "Comedy"],
    country: "South Korea",
    description: "A South Korean heiress crash-lands in North Korea and falls for a soldier, leading to a heart-tugging story of love across borders.",
    rating: 5
  },
  {
    title: "Flower of Evil",
    platform: "Netflix",
    genres: ["Thriller", "Crime", "Melodrama"],
    country: "South Korea",
    description: "A detective wife investigates a serial murder case, only to suspect her own loving husband — a man hiding a dark secret.",
    rating: 5
  },
  {
    title: "It's Okay to Not Be Okay",
    platform: "Netflix",
    genres: ["Romance", "Psychological", "Drama"],
    country: "South Korea",
    description: "A children’s book author with antisocial traits and a caretaker for his autistic brother confront past traumas and find healing through love.",
    rating: 5
  },
  {
    title: "The King of Pigs",
    platform: "TVING",
    genres: ["Thriller", "Mystery", "Drama"],
    country: "South Korea",
    description: "Two former victims of school bullying are drawn together again when a series of murders seemingly linked to their past resurfaces.",
    rating: 4
  },
  {
    title: "Vincenzo",
    platform: "Netflix",
    genres: ["Crime", "Dark Comedy", "Legal Drama"],
    country: "South Korea",
    description: "A Korean-Italian mafia consigliere returns to Seoul, using his underworld tactics to fight a corrupt conglomerate with a quirky legal team.",
    rating: 5
  },
  {
    title: "Extraordinary Attorney Woo",
    platform: "Netflix",
    genres: ["Legal", "Drama", "Slice of Life"],
    country: "South Korea",
    description: "A brilliant attorney with autism spectrum disorder tackles complex cases and social prejudices in a law firm where every victory is earned.",
    rating: 5
  },

{
    title: "A Time Called You",
    platform: "Netflix",
    genres: ["Romance", "Mystery", "Time Travel"],
    country: "South Korea",
    description: "After her boyfriend's death, a woman magically travels back in time and wakes up in another body, uncovering secrets that blur time and identity.",
    rating: 4
  },
  {
    title: "She Was Pretty",
    platform: "Viki",
    genres: ["Romantic Comedy", "Drama"],
    country: "South Korea",
    description: "An unattractive woman reconnects with her childhood crush who has grown into a handsome man, but pretends not to be herself when they meet again.",
    rating: 4
  },
  {
    title: "Kill It",
    platform: "Viki",
    genres: ["Action", "Crime", "Thriller"],
    country: "South Korea",
    description: "A veterinarian with a secret past as a contract killer gets entangled with a detective investigating his past crimes — not knowing their lives are already connected.",
    rating: 4
  },
  {
    title: "The Secret Life of My Secretary",
    platform: "Viki",
    genres: ["Romantic Comedy", "Office", "Drama"],
    country: "South Korea",
    description: "After an accident leaves him unable to recognize faces, a cold-hearted boss relies on his secretary, leading to unexpected romance and hilarious misunderstandings.",
    rating: 4
  },
  {
    title: "I Am Not a Robot",
    platform: "Viki",
    genres: ["Sci-Fi", "Romance", "Comedy"],
    country: "South Korea",
    description: "A man allergic to human touch falls for a woman pretending to be an AI robot in this quirky and emotional love story.",
    rating: 4
  },
  {
    title: "Where Stars Land",
    platform: "Disney+ Hotstar",
    genres: ["Romance", "Drama"],
    country: "South Korea",
    description: "Incheon Airport employees navigate love, ambition, and hidden identities as they work behind the scenes of the busy terminal.",
    rating: 3
  },
  {
    title: "Descendants of the Sun",
    platform: "Netflix",
    genres: ["Military", "Romance", "Action"],
    country: "South Korea",
    description: "A soldier and a doctor fall in love amid perilous missions and disasters in a war-torn area. Duty, honor, and love collide in this global sensation.",
    rating: 5
  },
  {
    title: "Playful Kiss",
    platform: "Netflix",
    genres: ["Romantic Comedy", "Youth"],
    country: "South Korea",
    description: "A cheerful high school girl falls for her cold and brilliant classmate, chasing him with infectious optimism and clumsy charm.",
    rating: 3
  },
  {
    title: "Emergency Couple",
    platform: "Netflix",
    genres: ["Romantic Comedy", "Medical", "Drama"],
    country: "South Korea",
    description: "A divorced couple is forced to work together during their medical internship, rekindling sparks in chaotic hospital corridors.",
    rating: 4
  },
  {
    title: "Familiar Wife",
    platform: "Netflix",
    genres: ["Fantasy", "Romance", "Drama"],
    country: "South Korea",
    description: "A man dissatisfied with his life makes a supernatural choice that gives him a second chance — but the new reality comes with emotional consequences.",
    rating: 4
  }
];
