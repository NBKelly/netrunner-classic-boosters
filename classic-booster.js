var common = ["Badtimes", "Corporate Shuffle", "Self-Destruct", "Sterdroid", "Satellite Monitors",
	      "Data Fort Remapping", "Unlisted Research Lab", "Bolter Swarm", "Deadeye",
	      "Entrapment", "Imperial Guard", "Puzzle", "Vortex", "Finders Keepers",
	      "Library Search", "Networking", "Panzer Run", "Early Worm", "Matador",
	      "MS-todon", "Psychic Friend", "Superglue", "Vintage Camaro", "Zetatech Portastation",
	      "Executive File Clerk", "Sandbox Dig"]
var rare = ["Reclamation Project", "London City Grid", "Shock Treatment", "Street Enforcer",
	    "Indiscriminate Response Team", "Strategic Planning Group", "Superserum",
	    "Theorem Proof", "Baskerville", "Brain Drain", "Dumpster", "Glacier",
	    "Trapdoor", "Boostergang Connections", "Corruption", "Do the 'Drine [TM]",
	    "Gypsy [TM] Schedule Analyzer", "Meat Upgrade", "Running Interference",
	    "Rent-I-Con", "Schematics Search Engine", "Little Black Box",
	    "Omnitech \"Spinal Tap\" Cybermodem", "Omnitech Wet Drive",
	    "Crash Space", "Elena Laskova"]

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

/* 6 common, 2 rare - side agnostic */
function classic_booster(seed) {
    booster = [];

    let rand = (mulberry32(seed));

    for (let i = 0; i < 6; i++)
	booster.push(common[Math.floor(rand() * common.length)]);

    for (let i = 0; i < 2; i++)
	booster.push(rare[Math.floor(rand() *  rare.length)]);

    return booster;
}
