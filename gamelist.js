const gameList = [
    {name: "Run 3", url: "https://www.coolmathgames.com/sites/default/files/public_games/49436"},
    {name: "Papa's Freezeria", url: "https://www.coolmathgames.com/sites/default/files/public_games/48987"},
    {name: "Suika Watermelon Game", url: "https://www.coolmathgames.com/sites/default/files/public_games/53294"},
    {name: "Tiny Fishing", url: "https://www.coolmathgames.com/sites/default/files/public_games/52971"},
    {name: "Duck Duck Clicker", url: "https://www.coolmathgames.com/sites/default/files/public_games/50916"},
    {name: "Slice Master", url: "https://www.coolmathgames.com/sites/default/files/public_games/50815"},
    {name: "Fireboy and Water Girl in the Forest Temple", url: "https://www.coolmathgames.com/sites/default/files/public_games/40034"},
    {name: "Moto X3M", url: "https://www.coolmathgames.com/sites/default/files/public_games/47685"},
    {name: "Checkers", url: "https://www.coolmathgames.com/sites/default/files/public_games/51531"},
    {name: "Dino Game", url: "https://www.coolmathgames.com/sites/default/files/public_games/51113"},
    {name: "Planet Clicker", url: "https://www.coolmathgames.com/sites/default/files/public_games/52014"},
    {name: "Appel", url: "https://www.coolmathgames.com/sites/default/files/public_games/52458"},
    {name: "Tag", url: "https://www.coolmathgames.com/sites/default/files/public_games/52751"},
    {name: "Color by Numbers: Pixel House", url: "https://www.coolmathgames.com/sites/default/files/public_games/51684"},
    {name: "Clicker Heroes", url: "https://www.coolmathgames.com/sites/default/files/public_games/49858"},
    {name: "Penalty Kick Online", url: "https://www.coolmathgames.com/sites/default/files/public_games/51559"},
    {name: "Opposite Day", url: "https://www.coolmathgames.com/sites/default/files/public_games/51159"},
    {name: "Mr. Mine", url: "https://www.coolmathgames.com/sites/default/files/public_games/48544"},
    {name: "Snake", url: "https://www.coolmathgames.com/sites/default/files/public_games/47809"},
    {name: "Idle Breakout", url: "https://www.coolmathgames.com/sites/default/files/public_games/49029"},
    {name: "Learn to Fly 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/50678"},
    {name: "TRACE", url: "https://www.coolmathgames.com/sites/default/files/public_games/42551"},
    {name: "OvO", url: "https://www.coolmathgames.com/sites/default/files/public_games/12671"},
    {name: "Bloxorz", url: "https://www.coolmathgames.com/sites/default/files/public_games/48807"},
    {name: "Dominoes", url: "https://www.coolmathgames.com/sites/default/files/public_games/50874"},
    {name: "Retro Ping Pong", url: "https://www.coolmathgames.com/sites/default/files/public_games/48387"},
    {name: "Parking Fury 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/22160"},
    {name: "World's Hardest Game", url: "https://www.coolmathgames.com/sites/default/files/public_games/48362"},
    {name: "Raccoon Retail", url: "https://www.coolmathgames.com/sites/default/files/public_games/50484"},
    {name: "Eggy Car", url: "https://www.coolmathgames.com/sites/default/files/public_games/50081"},
    {name: "Fruit Ninja", url: "https://www.coolmathgames.com/sites/default/files/public_games/50823"},
    {name: "Car Drawing Game", url: "https://www.coolmathgames.com/sites/default/files/public_games/34202"},
    {name: "Candy Clicker 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/52454"},
    {name: "Cell to Singularity: Mesozoic Valley", url: "https://www.coolmathgames.com/sites/default/files/public_games/51584"},
    {name: "SquareX", url: "https://www.coolmathgames.com/sites/default/files/public_games/49868"},
    {name: "Escape from Castle Claymount", url: "https://www.coolmathgames.com/sites/default/files/public_games/50453"},
    {name: "Open 50 Doors", url: "https://www.coolmathgames.com/sites/default/files/public_games/50148"},
    {name: "Jacksmith", url: "https://www.coolmathgames.com/sites/default/files/public_games/49634"},
    {name: "JellyCar Worlds", url: "https://www.coolmathgames.com/sites/default/files/public_games/49850"},
    {name: "Double Cheeseburger, Medium Fries", url: "https://www.coolmathgames.com/sites/default/files/public_games/12606"},
    {name: "Maze", url: "https://www.coolmathgames.com/sites/default/files/public_games/47964"},
    {name: "Curve Ball 3D", url: "https://www.coolmathgames.com/sites/default/files/public_games/47965"},
    {name: "Pou", url: "https://www.coolmathgames.com/sites/default/files/public_games/41519"},
    {name: "Catch the Candy Xmas", url: "https://www.coolmathgames.com/sites/default/files/public_games/23306"},
    {name: "Catch the Candy Halloween", url: "https://www.coolmathgames.com/sites/default/files/public_games/23305"},
    {name: "IQ Ball", url: "https://www.coolmathgames.com/sites/default/files/public_games/48381"},
    {name: "Papa's Cupcakeria", url: "https://www.coolmathgames.com/sites/default/files/public_games/49175"},
    {name: "Red Ball 4 Volume 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/49635"},
    {name: "Awesome Tanks 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/48594"},
    {name: "Atari Breakout", url: "https://www.coolmathgames.com/sites/default/files/public_games/41808"},
    {name: "Basket and Ball", url: "https://www.coolmathgames.com/sites/default/files/public_games/48476"},
    {name: "There Is No Game", url: "https://www.coolmathgames.com/sites/default/files/public_games/21597"},
    {name: "Archery World Tour", url: "https://www.coolmathgames.com/sites/default/files/public_games/47960"},
    {name: "Moto X3M Pool Party", url: "https://www.coolmathgames.com/sites/default/files/public_games/12636"},
    {name: "Red Ball 4 Volume 3", url: "https://www.coolmathgames.com/sites/default/files/public_games/49947"},
    {name: "Tail of the Dragon", url: "https://www.coolmathgames.com/sites/default/files/public_games/48203"},
    {name: "Swing Monkey", url: "https://www.coolmathgames.com/sites/default/files/public_games/48340"},
    {name: "B-Cubed", url: "https://www.coolmathgames.com/sites/default/files/public_games/48834"},
    {name: "Bob the Robber", url: "https://www.coolmathgames.com/sites/default/files/public_games/49669"},
    {name: "Duck Life", url: "https://www.coolmathgames.com/sites/default/files/public_games/48914"},
    {name: "Candy Jump", url: "https://www.coolmathgames.com/sites/default/files/public_games/12566"},
    {name: "Tic Tac Toe", url: "https://www.coolmathgames.com/sites/default/files/public_games/50954"},
    {name: "2048", url: "https://www.coolmathgames.com/sites/default/files/public_games/53448"},
    {name: "Jelly Truck", url: "https://www.coolmathgames.com/sites/default/files/public_games/48376"},
    {name: "Block the Pig", url: "https://www.coolmathgames.com/sites/default/files/public_games/48477"},
    {name: "Crazy Eights", url: "https://www.coolmathgames.com/sites/default/files/public_games/51535"},
    {name: "Handulum+", url: "https://www.coolmathgames.com/sites/default/files/public_games/25799"},
    {name: "Darts", url: "https://www.coolmathgames.com/sites/default/files/public_games/51533"},
    {name: "Mini Golf Battle Royale", url: "https://www.coolmathgames.com/sites/default/files/public_games/36184"},
    {name: "CircloO", url: "https://www.coolmathgames.com/sites/default/files/public_games/23392"},
    {name: "Apple Worm", url: "https://www.coolmathgames.com/sites/default/files/public_games/49138"},
    {name: "Parking Mania", url: "https://www.coolmathgames.com/sites/default/files/public_games/24900"},
    {name: "Defly.io", url: "https://www.coolmathgames.com/sites/default/files/public_games/12531"},
    {name: "The Sun for the Vampire", url: "https://www.coolmathgames.com/sites/default/files/public_games/22617"},
    {name: "The Sun for the Vampire 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/23465"},
    {name: "Tower of Destiny", url: "https://www.coolmathgames.com/sites/default/files/public_games/49105"},
    {name: "Sugar, Sugar 3", url: "https://www.coolmathgames.com/sites/default/files/public_games/49756"},
    {name: "Divide", url: "https://www.coolmathgames.com/sites/default/files/public_games/49071"},
    {name: "Sushi Slicer", url: "https://www.coolmathgames.com/sites/default/files/public_games/21441"},
    {name: "Awesome Tanks", url: "https://www.coolmathgames.com/sites/default/files/public_games/48573"},
    {name: "Parking Fury", url: "https://www.coolmathgames.com/sites/default/files/public_games/22159"},
    {name: "Cannon Basketball", url: "https://www.coolmathgames.com/sites/default/files/public_games/49004"},
    {name: "Cannon Basketball 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/49002"},
    {name: "Cannon Basketball 3", url: "https://www.coolmathgames.com/sites/default/files/public_games/49001"},
    {name: "Pre-Civilization Bronze Age", url: "https://www.coolmathgames.com/sites/default/files/public_games/50319"},
    {name: "Catch the Candy Mech", url: "https://www.coolmathgames.com/sites/default/files/public_games/23010"},
    {name: "Diggy", url: "https://www.coolmathgames.com/sites/default/files/public_games/49685"},
    {name: "Tiny Heist", url: "https://www.coolmathgames.com/sites/default/files/public_games/38968"},
    {name: "Catch the Candy", url: "https://www.coolmathgames.com/sites/default/files/public_games/22955"},
    {name: "Tube Master", url: "https://www.coolmathgames.com/sites/default/files/public_games/22596"},
    {name: "Jet Boy", url: "https://www.coolmathgames.com/sites/default/files/public_games/23876"},
    {name: "Slime Laboratory", url: "https://www.coolmathgames.com/sites/default/files/public_games/53088"},
    {name: "Running Round", url: "https://www.coolmathgames.com/sites/default/files/public_games/49485"},
    {name: "Jelly Escape", url: "https://www.coolmathgames.com/sites/default/files/public_games/52649"},
    {name: "Basketball Master 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/49073"},
    {name: "Slime Laboratory 2", url: "https://www.coolmathgames.com/sites/default/files/public_games/53272"},
    {name: "Don't Cross The Line", url: "https://www.coolmathgames.com/sites/default/files/public_games/21992"},
    {name: "Wheely 7: Detective", url: "https://www.coolmathgames.com/sites/default/files/public_games/52698"},
    {name: "Wheely 6: Fairytale", url: "https://www.coolmathgames.com/sites/default/files/public_games/53478"}
];
