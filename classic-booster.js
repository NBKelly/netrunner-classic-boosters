var classic_common = ["Badtimes", "Corporate Shuffle", "Self-Destruct", "Sterdroid", "Satellite Monitors",
	      "Data Fort Remapping", "Unlisted Research Lab", "Bolter Swarm", "Deadeye",
	      "Entrapment", "Imperial Guard", "Puzzle", "Vortex", "Finders Keepers",
	      "Library Search", "Networking", "Panzer Run", "Early Worm", "Matador",
	      "MS-todon", "Psychic Friend", "Superglue", "Vintage Camaro", "Zetatech Portastation",
	      "Executive File Clerk", "Sandbox Dig"]
var classic_rare = ["Reclamation Project", "London City Grid", "Shock Treatment", "Street Enforcer",
	    "Indiscriminate Response Team", "Strategic Planning Group", "Superserum",
	    "Theorem Proof", "Baskerville", "Brain Drain", "Dumpster", "Glacier",
	    "Trapdoor", "Boostergang Connections", "Corruption", "Do the 'Drine [TM]",
	    "Gypsy [TM] Schedule Analyzer", "Meat Upgrade", "Running Interference",
	    "Rent-I-Con", "Schematics Search Engine", "Little Black Box",
	    "Omnitech \"Spinal Tap\" Cybermodem", "Omnitech Wet Drive",
	    "Crash Space", "Elena Laskova"]

function setSeed(seed) {
    Math.seed = seed;
}
function seededRandom(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return Math.floor(min + rnd * (max - min));
}

/* 6 common, 2 rare - side agnostic */
function classic_booster(seed) {
    setSeed(seed);
    let booster = [];

    for (let i = 0; i < 6; i++)
	booster.push(classic_common[seededRandom(0, classic_common.length)]);

    for (let i = 0; i < 2; i++)
	booster.push(classic_rare[seededRandom(0, classic_rare.length)]);

    return booster;
}
