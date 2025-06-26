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
  },
{
    title: "Dhootha",
    platform: "Prime Video",
    genres: ["Supernatural", "Thriller", "Mystery"],
    country: "India",
    description: "A journalist discovers a strange pattern behind mysterious deaths foretold by possessed newspapers, plunging him into dark secrets and danger.",
    rating: 4
  },
  {
    title: "Berlin",
    platform: "Netflix",
    genres: ["Crime", "Thriller", "Heist"],
    country: "Spain",
    description: "A spin-off of Money Heist following the flamboyant thief Berlin as he assembles a new team for an ambitious jewelry heist in Paris.",
    rating: 4
  },
  {
    title: "Killer Soup",
    platform: "Netflix",
    genres: ["Dark Comedy", "Crime", "Drama"],
    country: "India",
    description: "A failing cook and her lover attempt to replace her husband with his doppelgänger, leading to a darkly funny descent into chaos and deception.",
    rating: 4
  },
  {
    title: "The K2",
    platform: "Netflix",
    genres: ["Action", "Political", "Romance"],
    country: "South Korea",
    description: "A former mercenary becomes a bodyguard to a presidential candidate’s secret daughter, uncovering corruption, revenge, and forbidden love.",
    rating: 4
  },
  {
    title: "Bring It On, Ghost",
    platform: "Viki",
    genres: ["Supernatural", "Romance", "Comedy"],
    country: "South Korea",
    description: "A high schooler who can see ghosts teams up with a sassy spirit to exorcise the undead — and maybe catch feelings along the way.",
    rating: 4
  },
  {
    title: "Catch the Ghost",
    platform: "Netflix",
    genres: ["Crime", "Detective", "Romance"],
    country: "South Korea",
    description: "A rookie detective searching for her missing sister joins the subway police squad and butts heads with her by-the-book partner.",
    rating: 4
  },
  {
    title: "Kill Me, Heal Me",
    platform: "Viki",
    genres: ["Psychological", "Romance", "Drama"],
    country: "South Korea",
    description: "A wealthy man with dissociative identity disorder and a psychiatric resident confront trauma and healing in this emotionally intense ride.",
    rating: 5
  },
  {
    {
    title: "Hotel Del Luna",
    platform: "Netflix",
    genres: ["Fantasy", "Romance", "Drama"],
    country: "South Korea",
    description: "An elite hotel for ghosts run by a moody, centuries-old spirit and a human manager with a mysterious past.",
    image: "images/hotelldelluna.jpg",
    rating: 5
  },
  {
    title: "Miss Hammurabi",
    platform: "Viki",
    genres: ["Legal", "Drama", "Slice of Life"],
    country: "South Korea",
    description: "A passionate rookie judge teams up with a principled senior judge as they tackle tough civil cases and the gray zones of justice.",
    rating: 4
  },
  {
    title: "Angel's Last Mission: Love",
    platform: "Viki",
    genres: ["Fantasy", "Romance", "Drama"],
    country: "South Korea",
    description: "A carefree angel must help a blind ballerina find love — but ends up falling for her himself, risking everything to save her heart.",
    rating: 4
  },
  {
    title: "Boys Over Flowers",
    platform: "Netflix",
    genres: ["Romance", "Comedy", "School"],
    country: "South Korea",
    description: "A working-class girl attends an elite school and clashes with — and captures the heart of — the leader of a wealthy group of boys.",
    rating: 4
  },
  {
    title: "Sweet Sweet",
    platform: "YouTube",
    genres: ["Romantic Comedy", "Youth"],
    country: "China",
    description: "A socially awkward programmer and a cheerful designer unexpectedly become neighbors and slowly fall for each other through their quirky bond.",
    rating: 3
  },
  {
    title: "Fight for My Way",
    platform: "Netflix",
    genres: ["Romance", "Drama", "Slice of Life"],
    country: "South Korea",
    description: "Two long-time friends chase their dreams and struggle through life’s setbacks, discovering love and purpose along the way.",
    rating: 5
  },
  {
    title: "Who Are You: School 2015",
    platform: "Viki",
    genres: ["Mystery", "Romance", "School"],
    country: "South Korea",
    description: "A bullied student wakes up with no memory and is mistaken for her missing twin, sparking a mystery of identity, trauma, and healing.",
    rating: 4
  },
  {
    title: "Reacher",
    platform: "Prime Video",
    genres: ["Action", "Thriller", "Crime"],
    country: "USA",
    description: "Ex-military investigator Jack Reacher drifts into a small town and uncovers a deadly conspiracy behind a string of murders.",
    rating: 4
  },
  {
    title: "Game of Thrones",
    platform: "HBO Max",
    genres: ["Fantasy", "Drama", "Action"],
    country: "USA/UK",
    description: "Noble families vie for the Iron Throne in this epic saga of betrayal, war, and power across the mythical land of Westeros.",
    rating: 5
  },
  {
    title: "The Queen's Gambit",
    platform: "Netflix",
    genres: ["Drama", "Sports", "Coming-of-Age"],
    country: "USA",
    description: "An orphaned chess prodigy rises to global fame while battling addiction, trauma, and the pressure to stay on top.",
    rating: 5
  },
  {
    title: "A Simple Murder",
    platform: "SonyLIV",
    genres: ["Dark Comedy", "Crime", "Thriller"],
    country: "India",
    description: "A struggling man stumbles into a web of hitmen, mistaken identities, and hilarious chaos when a contract killing goes wrong.",
    rating: 4
  },
  {
    title: "The Wind Blows",
    platform: "Viki",
    genres: ["Romance", "Melodrama"],
    country: "South Korea",
    description: "A man divorces his wife without telling her he has Alzheimer’s, hoping to spare her the pain — but fate brings them back together.",
    rating: 4
  },
  {
    title: "Pill",
    platform: "Netflix",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    country: "India",
    description: "An experimental drug that eliminates sleep spreads through society — exposing secrets, disrupting relationships, and unraveling lives.",
    rating: 3
  },
  {
    title: "Gyaarah Gyaaraah",
    platform: "Zee5",
    genres: ["Sci-Fi", "Mystery", "Thriller"],
    country: "India",
    description: "Three interconnected timelines in 1990, 2001, and 2023 converge through a chilling murder mystery that defies the boundaries of time.",
    rating: 4
  },
  {
    title: "Tokyo Swindlers",
    platform: "Netflix",
    genres: ["Crime", "Heist", "Drama"],
    country: "Japan",
    description: "A group of con artists poses as real estate agents in Tokyo, scamming the rich and uncovering a deeper corporate conspiracy.",
    rating: 4
  },
  {
    title: "Tribhuwan Mishra: C.A. Topper",
    platform: "Netflix",
    genres: ["Comedy", "Drama"],
    country: "India",
    description: "A small-town chartered accountant gets caught between audits, ambition, and awkward family chaos in this satirical slice of life.",
    rating: 3
  },
  {
    title: "Legend of the Blue Sea",
    platform: "Viki",
    genres: ["Fantasy", "Romance", "Comedy"],
    country: "South Korea",
    description: "A mermaid from the Joseon era ends up in modern-day Seoul, where she reunites with her reincarnated love — a con artist.",
    rating: 4
  },
  {
    title: "My Demon",
    platform: "Netflix",
    genres: ["Fantasy", "Romance", "Mystery"],
    country: "South Korea",
    description: "A wealthy heiress and a demon who’s lost his powers form a contract marriage that blurs the lines between love and supernatural danger.",
    rating: 4
  },
  {
    title: "Queen of Tears",
    platform: "tvN / Netflix",
    genres: ["Romance", "Drama"],
    country: "South Korea",
    description: "A chaebol heiress and her estranged husband navigate heartbreak, healing, and high-stakes family drama.",
    image: "images/queenoftears.jpg",
    rating: 5
  },
{
    title: "Love to Hate You",
    platform: "Netflix",
    genres: ["Romantic Comedy"],
    country: "South Korea",
    description: "A lawyer and a top actor—both cynical about love—are forced into a fake relationship that turns all too real.",
    rating: 4
  },
  {
    title: "No Gain No Love",
    platform: "Netflix",
    genres: ["Romance", "Drama"],
    country: "India",
    description: "Two strangers meet through a boxing club and dance studio, clashing fiercely before discovering unexpected feelings.",
    rating: 4
  },
  {
    title: "Law Cafe",
    platform: "Viki",
    genres: ["Legal", "Romance", "Drama"],
    country: "South Korea",
    description: "A former prosecutor and a café owner team up to solve clients’ casual legal troubles — and maybe find love themselves.",
    rating: 4
  },
  {
    title: "Mere Humsafar",
    platform: "ZEE5",
    genres: ["Romance", "Drama"],
    country: "Pakistan",
    description: "A young woman’s world is upended when she’s forced to marry her former employer, leading to betrayal, heartbreak, and growth.",
    rating: 4
  },
  {
    title: "Kabhi Main Kabhi Tum",
    platform: "ZEE5",
    genres: ["Romance", "Drama"],
    country: "India",
    description: "Two siblings swap identities in college to escape pressure — only to fall for each other’s close friends in hilarious fashion.",
    rating: 3
  },
  {
    title: "Brinda",
    platform: "YouTube",
    genres: ["Drama"],
    country: "India",
    description: "A family reunited by fate uncovers buried secrets when a chance encounter reignites past conflicts and hidden bonds.",
    rating: 3
  },
  {
    title: "Pataal Lok",
    platform: "Prime Video",
    genres: ["Crime", "Thriller", "Drama"],
    country: "India",
    description: "A disillusioned cop investigates a high-profile assassination attempt, plunging him into the dark underworld of patriarchy and politics.",
    rating: 5
  },
  {
    title: "Pinocchio",
    platform: "Netflix",
    genres: ["Romance", "Drama", "Fantasy"],
    country: "South Korea",
    description: "A reporter who can’t lie and a TV anchor searching for the truth form an unlikely partnership to expose media corruption.",
    rating: 4
  },
  {
    title: "Destined With You",
    platform: "Netflix",
    genres: ["Romance", "Fantasy", "Drama"],
    country: "South Korea",
    description: "Two strangers discover they’re bound by a mythical talisman that draws them together through past lives and fate.",
    rating: 4
  },
  {
    title: "Better Call Saul",
    platform: "Netflix",
    genres: ["Legal", "Crime", "Drama"],
    country: "USA",
    description: "The transformation of small-time lawyer Jimmy McGill into morally challenged attorney Saul Goodman — darkly funny and tragic.",
    rating: 5
  },
  {
    title: "Mr. & Mrs. Smith",
    platform: "Prime Video",
    genres: ["Action", "Comedy", "Drama"],
    country: "USA",
    description: "A high-profile assassin couple goes cold on each other after new missions pit them on opposite sides.",
    rating: 4
  },
  {
    title: "Xo, Kitty",
    platform: "Netflix",
    genres: ["Romance", "Comedy", "Drama"],
    country: "USA/Korea",
    description: "Kitty Song-Covey navigates love and friendship at boarding school, facing all the awkwardness of teenage crushes.",
    rating: 3
  },
  {
    title: "Bank Under Siege",
    platform: "Netflix",
    genres: ["Action", "Thriller"],
    country: "USA",
    description: "A small‐town bank is overtaken by a ruthless gang on Christmas Eve, forcing employees and customers into a fight for survival.",
    rating: 3
  },
  {
    title: "Black Warrant",
    platform: "Netflix",
    genres: ["True Crime", "Documentary"],
    country: "USA",
    description: "An inside look at the high‐stakes world of federal executions through the eyes of the people who carry them out.",
    rating: 3
  },
  {
    title: "Day of the Jackal",
    platform: "Netflix",
    genres: ["Thriller", "Drama"],
    country: "UK/France",
    description: "A master assassin is hired to kill the French president, while detectives race against time to thwart his meticulous plan.",
    rating: 4
  },
  {
    title: "Lupin",
    platform: "Netflix",
    genres: ["Crime", "Thriller", "Drama"],
    country: "France",
    description: "A gentleman thief inspired by Arsène Lupin sets out to avenge his father for a crime committed by a wealthy family.",
    rating: 5
  },
  {
    title: "The Gentleman",
    platform: "Netflix",
    genres: ["Crime", "Comedy"],
    country: "UK",
    description: "An American expat tries to sell his highly profitable marijuana empire — and discovers that everyone wants a piece.",
    rating: 4
  },
  {
    title: "Marry My Husband",
    platform: "Netflix",
    genres: ["Romance", "Fantasy", "Drama"],
    country: "South Korea",
    description: "A woman wakes up in her fiancé’s former fiancée’s body and races to prevent betrayal and reclaim her happily ever after.",
    rating: 4
  },
  {
    title: "The Night Agent",
    platform: "Netflix",
    genres: ["Thriller", "Action", "Drama"],
    country: "USA",
    description: "An FBI agent answers a call that drags him into a deadly conspiracy reaching the highest levels of government.",
    rating: 4
  },
  {
    title: "The Trauma Code: Heroes On Call",
    platform: "Netflix",
    genres: ["Documentary", "Medical"],
    country: "USA",
    description: "An inside look at emergency responders tackling mass‐casualty events and the toll it takes on their lives.",
    rating: 3
  },
  {
    title: "Lincoln Lawyer",
    platform: "Netflix",
    genres: ["Legal", "Crime", "Drama"],
    country: "USA",
    description: "Defense attorney Mickey Haller runs his practice from the back of his Lincoln — taking on cases that challenge his ethics.",
    rating: 4
  },
  {
    title: "Melo Movie",
    platform: "Netflix",
    genres: ["Comedy", "Drama"],
    country: "South Korea",
    description: "A group of mismatched strangers collaborate on a low‐budget film, discovering laughter and heartbreak behind the camera.",
    rating: 3
  },
  {
    title: "When Life Gives You Tangerines",
    platform: "Netflix",
    genres: ["Romance", "Comedy"],
    country: "South Korea",
    description: "Two childhood friends reconnect on a tangerine farm, confronting past wounds and new desires amid the harvest.",
    rating: 4
  },
  {
    title: "Severance",
    platform: "Apple TV+",
    genres: ["Sci-Fi", "Thriller", "Drama"],
    country: "USA",
    description: "Employees undergo a procedure to sever work memories from personal life — until one begins to question the reality of it all.",
    rating: 5
  },
  {
    title: "Start-Up",
    platform: "Netflix",
    genres: ["Business", "Comedy", "Romance"],
    country: "South Korea",
    description: "Aspiring entrepreneurs navigate love, friendship, and fierce competition in the cutthroat world of tech start-ups.",
    rating: 4
  },
  {
    title: "A Killer Paradox",
    platform: "Netflix",
    genres: ["Crime", "Thriller"],
    country: "South Korea",
    description: "A detective races to stop a copycat killer inspired by a notorious serial murderer — but uncovers deeper conspiracies.",
    rating: 3
  },
  {
    title: "Juvenile Justice",
    platform: "Netflix",
    genres: ["Legal", "Drama"],
    country: "South Korea",
    description: "A cold-hearted judge in the juvenile court system confronts her biases as she handles cases of crime, punishment, and redemption.",
    rating: 4
  },
  {
    title: "The Heirs",
    platform: "Netflix",
    genres: ["Romance", "Drama", "School"],
    country: "South Korea",
    description: "A privileged high school girl and a tough heir from a rival family clash and fall in love amid teenage power struggles.",
    rating: 4
  },
  {
    title: "My ID Is Gangnam Beauty",
    platform: "Netflix",
    genres: ["Romance", "Drama", "Slice of Life"],
    country: "South Korea",
    description: "After plastic surgery, a shy woman struggles for acceptance on campus and finds an unexpected ally in a mysterious classmate.",
    rating: 4
  },
  {
    title: "Suspicious Partner",
    platform: "Netflix",
    genres: ["Romance", "Mystery", "Thriller"],
    country: "South Korea",
    description: "A prosecutor and a judicial trainee team up to solve a murder case while navigating budding romance and hidden secrets.",
    rating: 4
  },
  {
    title: "The Glory",
    platform: "Netflix",
    genres: ["Drama", "Revenge"],
    country: "South Korea",
    description: "A woman plots elaborate revenge against her high school bullies, sacrificing everything for justice and closure.",
    rating: 4
  },
  {
    title: "The Golden Spoon",
    platform: "Netflix",
    genres: ["Fantasy", "Drama", "Comedy"],
    country: "South Korea",
    description: "A young man from poverty finds a golden spoon that lets him swap lives — but soon discovers the cost of others’ fortunes.",
    rating: 4
  },
  {
    title: "Gyeongseong Creature",
    platform: "Netflix",
    genres: ["Horror", "Thriller"],
    country: "South Korea",
    description: "In 1945 Gyeongseong, two friends discover a terrifying creature released in the final days of colonial rule.",
    rating: 4
  },
  {
    title: "Sweet Home",
    platform: "Netflix",
    genres: ["Horror", "Drama"],
    country: "South Korea",
    description: "Residents of a shrinking apartment complex fight to survive as humans turn into monsters driven by their darkest desires.",
    rating: 5
  },
  {
    title: "Unlock My Boss",
    platform: "Netflix",
    genres: ["Fantasy", "Comedy", "Thriller"],
    country: "South Korea",
    description: "A tech CEO trapped in his own smartphone enlists a struggling young man to save both his company and his body.",
    rating: 4
  }
];
