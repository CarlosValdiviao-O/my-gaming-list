const data = [
    {
        name: 'Action',
        slug: 'action',
        gamesCount: 164766,
        description: `The action game is a genre that includes fights, puzzles, and strategies emphasizing coordination and reaction. It includes a large variety of sub-genres like fighting, beat'em ups, shooters, survivals, mazes, and platforms; sometimes even multiplayer online battles and real-time strategies. Usually, the player performs as the protagonist with its unique abilities; some games add power-ups along the way. The character aims to complete levels, collect items, avoid obstacles, and battle against antagonists. It's necessary to avoid severe injuries during fights; if the health bar goes low, the player loses. Some games have an unbeatable number of enemies, and the only goal is to maximize score and survive for as long as possible. There might be a boss enemy who appears at the last level; he has unique abilities and a longer health bar. Pong is one of the first action games, released in 1972; the latest include Battlefield, Assasin's Creed, Fortnite and Dark Souls.`
    },
    {
        name: 'Indie',
        slug: 'indie',
        gamesCount: 47995,
        description: `Indie is one of the vaguest categories in video games. Generally, it describes any title developed by independent (thus the name) studio which means that game's launch was not powered with publisher's funds or any financial support other than crowdfunding. The genre is kickstarted mainly because of the variety of crowd-funding policies and many early-access platforms like Steam Greenlight. A corporation does not develop indies, so primarily the genre is associated with single developers or small studios. Lacking the budget, indie games are mostly shorter and lesser than their publisher-financed competitors. Such titles, therefore, bear no attachment to censorship regulations and can express whatever authors wish. It is worth to mention that a large portion of adult games is indie. The rules above can be applied to the most games; however, not all. Some titles may feature publisher, but it cannot affect the final product. Some specific examples of indie are World of Goo, Undertale, and Braid.`,
    },
    {
        name: 'Adventure',
        slug: 'adventure',
        gamesCount: 125636,
        description: `An adventure game is a genre in which the player performs as a protagonist. It is usually supported by puzzle-solving, gathering items, dialogues, and intervening goals. Adventure focus on story, many of them are designed for a single player. Colossal Cave Adventure is known as the first of the genre, released in 1976. They rocketed in the 1980s; later it led to the appearance of independent video game developers. The Walking Dead by TellTale Games is considered as the game which renewed the whole genre. It has a revolutionary mechanics which change the gameplay as the players make their choices. These games are still favorite among the users; independent developers start crowd-funding companies to raise money; the genre is celebrated on practically any platform.`
    },
    {
        name: 'RPG',
        slug: 'role-playing-games-rpg',
        gamesCount: 50181,
        description: `Role-playing games use protagonists as the leading figures in the occurring events. The player performs as a protagonist; his moves affect the setting and the possible outcome. Some RPGs are created in the form of trading card games; some relate to wargames. Except for the video RPGs, the genre is divided into two primary forms; the original tabletop role-playing, handled through discussion, and live-action role-playing, conducted through the characters' actions. Each of them has a game master who's in charge of the rules and settings. The video RPGs include sandboxes, like GTA; tactical games, like Dragonfall; and roguelikes, like Mystery Dungeon. Usually, the primary purpose is to save the world or other characters. That includes taking part in collaborative storytelling, fighting, collecting items and solving puzzles if needed. The plot tends to develop in a fantasy or science fiction universe.`,
    },
    {
        name: 'Strategy',
        slug: 'strategy',
        gamesCount: 50004,
        description: `A strategy is a broad genre, its main feature lies in letting players be autonomous, they claim decision-making and high situational awareness, require private decision tree-style thinking as each action can determine the possible outcome. There are all sorts of strategies such as team plays, simulation games, and wargames. Many actions and adventure games need strategic thinking, but they can be hardly seen as ones. A strategy usually is extensive in range of sub-genres, its primary emphasis is on the player's ability to outthink opponents. It rarely involves a physical challenge, focusing on puzzles. There might be no enemy at all, which makes strategies very different from other genres. Resources, actions, powers, and gaps of each side of competitors are generally balanced. The last strategies released are Total War: Warhammer II, Mutant Year Zero: Road to Eden, and Into the Breach.`
    },
    {
        name: 'Shooter',
        slug: 'shooter',
        gamesCount: 57723,
        description: `A shooter is a sub-genre of action video games the gameplay of which is thoroughly centered around shooting targets. Such games can be presented from first and the third perspectives with the latter being mostly twin-stick platforming shooters. Mouse and keyboard are widely regarded as the best controllers for shooters, as the firing demands high precision achieved only with manual aiming. The primary goal of shooters is to defeat enemies by discharging loads of bullets into them. Shooters are the most discussable video game genre when it comes to judging violence in games, as the gunfire process involves realistic scenes of killing quite often. Sub-genre of shooters is also divided by sub-subgenres such as shoot'em ups, tactical shooters, and hero shooters.  The former involves changing a direction of movement and shooting forward while the latter focuses on wiping out tons of enemies by one protagonist. Notable games of the genre are Resogun, Bulletstorm and Call of Duty.`
    },
    {
        name: 'Casual',
        slug: 'casual',
        gamesCount: 41033,
        description: `Casual games are a sub-genre, they can exhibit any gameplay. They are typically identified by simple rules and low requirements for timing and skills. Usually, casual games impose low production and distribution costs, which is why developers widely produce them. Casual games can perform at any platform; they do not require any individual peripherals. Usually, there's no need to save to continue later, mechanics include a one-button mouse or cellphone keypad, but the gameplay is still puzzling and elegant. They also have simple gameplay and allow to take breaks between rounds without losing interest in it. The first well-known game of the genre is an arcade Pac-Man released in 1980. However, actions, graphics, and sounds are often quite limited but can display additional features in multiplayer modes. Simplicity along with elegance aren't the only traits making the genre popular; these games are also quite cheap.`
    },
    {
        name: 'Simulation',
        slug: 'simulation',
        gamesCount: 62346,
        description: `Simulation games are a diverse and broad genre, commonly created for imitating real-life activities. There are no strict goals, the player is allowed to perform freely; he can play for one or more characters, dabbling into occupations, building towers, making relationships, and doing sports. This genre is divided into sub-genres, such as sports, construction and management, strategies, and wars. Each one has its famous games. Life simulators are known for the Sims series; sports simulators - for the NBA series; city-buildings for the SimCity series. The first simulations ever developed are BMX Simulator, Pro Boxing Simulator, and Grand Prix Simulator; each released in the 1980s. Among recently released, the most famous are Jurassic World Revolution, F1 2018, and Cities: Skylines.`
    },
    {
        name: 'Puzzle',
        slug: 'puzzle',
        gamesCount: 93250,
        description: `Puzzle games are a broad genre that maintains logical and conceptual challenges; it may include concentration, logic, pattern recognition, word completion, and sequence searching. The games have either infinite attempts to solve puzzles and an unlimited amount of time or involve restricted timing and limited tries. They typically offer related puzzles for each theme, using the same colors, shapes, and numbers; however, the game design might be quite simple. There is also a set of rules which form the mechanics, and various outcomes leading to next levels. Sometimes they are tied into a whole story developing throughout the play. Minesweeper is one of the first puzzles developed in the 1980s. The gameplay and mechanics are very easy, and the game itself is cheap. At the time, it led to tremendous success which made puzzles one of the most favored genres ever since. It is now divided into various types and is available via the majority of platforms.`
    },
    {
        name: 'Arcade',
        slug: 'arcade',
        gamesCount: 22515,
        description: `Arcades are the most common and preferred genre of video games. Starting with the arcade machines which were activated by inserting a coin, the history of the genre backtracks to 1978's Space Invaders. Due to the limited time of gameplay, arcades often have short levels and structured as platformers with simple mechanics including jumping, shooting or moving around the screen space. There are little-to-none puzzles in such video games, and a lot of in-game situations are incredibly skill-dependent which is also very much reminiscent of arcade machines past — the leaderboard was an essential element awaking the competitive and exciting element in players. The primary feature to early arcades is their unbeatable nature — most of them focus the attention on an infinite amount of levels making the title practically unbeatable. The most significant examples of the arcades are Pac-Man, Donkey Kong Jr., and Mario Bros.`
    },
    {
        name: 'Platformer',
        slug: 'platformer',
        gamesCount: 96736,
        description: `Platformer is a sub-genre of action games. Normally, the player aims to perform as a protagonist and complete levels and tasks while exploring areas. It often requires solely jumping and climbing, but more complex games also include puzzle solving and fighting enemies. One of the distinctive elements is the jump button, swiping or touchscreen. The players have control over the height and distance of jumps; they have to avoid falling as it leads to either losing points and health bars or their death. However, in some platformers like The Legend of Zelda series, jumps are done automatically. They originated in the 1980s, back then the main mechanics were to climb ladders as much as jumping. Recent developments changed the design a bit; now platformers typically exist in a 3D environment. The last released are Super Mario Galaxy and Ratchet & Clank Future: Tools of Destruction.`
    },
    {
        name: 'Racing',
        slug: 'racing',
        gamesCount: 23156,
        description: `Racing games is the video game genre with a high focus on driving competition. Such games are usually presented from the first-person or a third-person perspective. It is noted that gamepads are generally more suited to control the vehicle than keyboard/mouse pair. Although car avatars may render real-life examples, there are many instances where spaceships, formless mechanisms and other fantastical entities take the role of the avatar. Grand Prix released in 1969 is considered to be the first racing game ever made. Racings is a defining genre of a video game which is, in turn, can be divided into a lot of sub-genres: for instance, a primary focus may be made on destroying enemies' vehicles (FlatOut, Twisted Metal) or crushing as many environments as possible (Split/Second). Those mechanics can alternatively be mixed with open world structure or set in the defined assortment of separate racing events.`
    },
    {
        name: 'Massively Multiplayer',
        slug: 'massively-multiplayer',
        gamesCount: 3042,
        description: `Massively-multiplayer games is an online sub-genre is an online game which includes large numbers of players performing on the same server. The aim is to explore the universe, collect items, complete tasks and participate in battles. Usually, this is pretty much the gameplay; some multiplayer follow a specific plot. They suit every network-capable platform. MMs enable users to cooperate and battle with each other and represent many genres. The most popular type is RPG multiplayer such as World of Warcraft and Final Fantasy XIV. To upgrade avatars or equipment, one should buy it with real money accumulated in the virtual economy; the first game which implemented the system is Ultima Online. This often leads to cheating or pirating. One of the most famous among the recent MMs is SCUM, Battlerite Royale, The Elder Scrolls, and DayZ.`
    },
    {
        name: 'Sports',
        slug: 'sports',
        gamesCount: 19887,
        description: `Sports games are a genre that simulates competitive and single-player sports like arcades, management, simulation, multisport, and fighting. The primary goal is to compete with other players, either online or via consoles, upgrade clubs and buy new players, maintain a team's strategy. The genre was released in the 1970s, and the sales rocketed right away. The games recreate track and field, needed equipment, teams. Some of them maintain playing while others emphasize strategy and sports management. Games like Need for Speed and Punch-Out!!, mock sports for a subtle effect. It can be performed on every platform; some of them, like the Wii console, specialize in featuring sports games. EA and 2K dominate sports and hold licenses for developing games based on official leagues such as the Madden NFL series, the NBA series, the WWE 2K series, the NBA 2K series.`
    },
    {
        name: 'Fighting',
        slug: 'fighting',
        gamesCount: 11225,
        description: `Fighting games are a genre based on combat between several characters in which they fight until defeating each other or until the timer expires. Usually, there are numerous rounds set in an arena. Each personality has its abilities which are relatively free and limited to choose. During combats, the players master fighting techniques and learn how to chain attacks into combos. The first release of the genre was Heavyweight Champ in 1976. From the 1990s, developers spawned dozens of other fighting games, including Street Fighter, Mortal Kombat, and Super Smash Bros. Each protagonist has its health bar and special attacks. Typically, usage of combos, infliction of massive wounds, and, finally, winning gives several points. Sometimes the player can apply them for particular weapons or avatars. This genre can be mixed with others — for example, there are various indie fighting games like Blade Strangers. Every platform supports it.`
    },
    {
        name: 'Family',
        slug: 'family',
        gamesCount: 5371,
        description: `Family games are the genre of casual video games appropriate for the whole family in difficulty and censorship. Nintendo is often considered to be the most efficient family games producer as this company's titles are usually rated 10+ for mild cartoonish violence. Not only the gameplay must not include any forms of sexuality and violent scenes, but also the graphics should be appropriately gentle and fancy as nice visuals define the replayable value of the game. Finally, it is utterly essential for a title not to be too hardcore as it may inflict stress on the player who is not accustomed to such types of games. The story is set to be interesting featuring; however, no complicated twisted for a player to master. The most recognizable examples of family games are as follows: Rayman Origins, Day of the Tentacle Remastered, Flower and many others. Some games belong to various genres simultaneously — Uno, for instance, is both card and family game.`
    },
    {
        name: 'Board Games',
        slug: 'board-games',
        gamesCount: 8212,
        description: `The board game is a small genre based on tabletop games. Mechanics consist of moving pieces on a board and placing them according to a set of rules. Some platforms provide online matches with thousands of users playing all at once. Board games can function as virtual tabletop programs that allow trying multiple types of boards. There are generalized programs like Vassal, Tabletop Simulator and Tabletopia; programs like Roll20 and Fantasy Grounds are more specialized for role-playing games. The players can add extra content through user modifications. The usual goal is to defeat opponents in counters, gain points and win a position. Their representation and design differ, sometimes they have an inherent theme, like checkers, or even a particular theme and narrative, like Cluedo. Rules can stay the same throughout the game or change little by little, like Tic-tac-toe.`
    },
    {
        name: 'Educational',
        slug: 'educational',
        gamesCount: 14647,
        description: `Educational games are the video games genre centered around useful information throughout a playthrough. It is the secondary characteristic in the game's description because it denotes the value a player can make out of the gameplay and say little to nothing about the actual game itself. So, platformers, shooters, puzzles, and card games can be didactic. The ability to educate is utterly mean that playing given title may replace the textbook or a lesson experience due to the procedural nature of a video game medium as it can persuade the players to learn information in a more efficient way than just reading or watching. The most popular genres within the sub-genre are strategies as they teach one to think forward strategically; simulators as they mimic the real working experience and point-and-click adventures as they train logic, teach how to solve puzzles and guide the player through the variety of tricky situations.`
    },
    {
        name: 'Card',
        slug: 'card',
        gamesCount: 4407,
        description: `Card video games is the wide genre of titles using cards as main gameplay units. There is a common division between games derived originally from tabletop and card games and ones initially created for computer medium. The first type covers a large variety of traditional card games such as poker, monopoly, go and many others. There are no definite mechanics to such games except the "imperfect information" gamble meaning that there is always unknown elements to the game which spice it up. The titles of that sort are often hard to transfer to video games because the cooperative action takes place within one screen so the most popular games are played remotely. Finally, the second type features a similar variety in sub-genres, however, collectible card games prevail in quantity — games like Gwent, Hearthstone with their vast audience and many alike illustrate that turn-based combats with the cards collected can be popular within the medium.`
    }
]

export default data