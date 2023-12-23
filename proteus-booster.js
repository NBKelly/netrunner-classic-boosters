var prot_common = [
    "Charity Takeover",
    "Corporate Headhunters",
    "Marked Accounts",
    "Project Venice",
    "Project Zurich",
    "Viral Breeding Ground",
    "Brain Wash",
    "Chihuahua",
    "Coyote",
    "Credit Blocks",
    "Datacomb",
    "Death Yo-Yo",
    "Food Fight",
    "Galatea",
    "Gatekeeper",
    "Lesser Arcana",
    "Marionette",
    "Misleading Access Menus",
    "Riddler",
    "Sandstorm",
    "Scaffolding",
    "Snowbank",
    "Tumblers",
    "Twisty Passages",
    "Walking Wall",
    "Washed-Up Solo Construct",
    "Doppelganger Antibody",
//    "Government Contract", - excluded
    "Syd Meyer Superstores",
    "Credit Consolidation",
    "Data Sifters",
    "Manhunt",
    "Underworld Mole",
    "Big Frackin' Gun",
    "Boring Bit",
    "Corrosion",
    "Enterprise, Inc., Shields",
    "Lockjaw",
    "Redecorator",
    "Skeleton Passkeys",
    "Skullcap",
    "Wrecking Ball",
    "Cortical Cybermodem",
    "Cortical Stimulators",
    "Sunburst Cranial Interface",
    "Back Door to Rivals",
    "Bolt-Hole",
    "Chiba Bank Account",
    "Expendable Family Member",
    "HQ Mole",
    "Liberated Savings Account",
    "R&D Mole",
    "Runner Sensei",
    "Streetware Distributor",
    "Swiss Bank Account",
    "Wired Switchboard",
    "All-Hands",
    "Cruising for Netwatch",
    "Decoy Signal",
    "Drone for a Day",
    "Ice and Data Special Report",
    "Reconnaissance",
    "Rush Hour",
    "Stakeout",
    "The Personal Touch",
    "Weefle Initiation"
]

var prot_uncommon = [
    "Bug Zapper",
    "Caryatid",
    "Digiconda",
    "Dog Pile",
    "Homing Missile",
    "Hunting Pack",
    "Mastermind",
    "Minotaur",
    "Sphinx 2006",
    "Sumo 2008",
    "Bel-Digmo Antibody",
    "Pattel Antibody",
    "Siren",
    "Herman Revista",
    "Panic Button",
    "Rasmin Bridger",
    "Raymond Ellison",
    "Simon Francisco",
    "Corporate Guard(r) Temps",
    "Emergency Rig",
    "Rent-to-Own Contract",
    "Schlaghund Pointers",
    "Black Widow",
    "Bulldozer",
    "Crumble",
    "Disintegrator",
    "Forward's Legacy",
    "Fubar",
    "Garbage In",
    "Highlighter",
    "Morphing Tool",
    "Taxman",
    "Vienna 22",
    "Eurocorpse(tm) Spin Chip",
    "Credit Subversion",
    "Get Ready to Rumble",
//    "Mercenary Subcontract", - excluded
    "Precision Bribery",
    "Demolition Run",
    "Disgruntled Ice Technician",
    "Faked Hit",
    "On the Fast Track",
    "Remote Detonator",
    "Subliminal Corruption"
]

var prot_rare = [
    "AI Board Member",
    "Fetal AI",
    "Please Don't Choke Anyone",
    "World Domination",
    "Colonel Failure",
    "Iceberg",
    "Mobile Barricade",
    "Roadblock",
    "Toughonium(tm) Wall",
    "Cybertech Think Tank",
    "Department of Misinformation",
    "Executive Boot Camp",
    "LDL Traffic Analyzers",
    "Stereogram Antibody",
    "Lesley Major",
    "Lisa Blight",
    "Marcel DeSoleil",
    "Networked Center",
    "Obfuscated Fortress",
    "Pavit Bharat",
    "Research Bunker",
    "Weapons Depot",
    "Armageddon",
    "Scaldan",
//    "Viral Pipeline", - excluded
    "Lucidrine(tm) Drip Feed",
    "The Deck",
    "Airport Locker",
    "Back Door to Netwatch",
    "Bargain with Viacox",
    "Death from Above",
    "Simulacrum",
    "Time to Collect",
    "Blackmail",
    "Frame-Up",
    "Hijack",
    "Identity Donor",
    "Live News Feed",
    "Pirate Broadcast",
    "Poisoned Water Supply",
    "Prearranged Drop",
    "Promises, Promises",
    "Senatorial Field Trip",
    "Test Spin"
]

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

/* 10 common, 4 uncommon, 1 rare - side agnostic */
function proteus_booster(seed) {
    let booster = [];

    setSeed(seed);

    for (let i = 0; i < 10; i++)
	booster.push(prot_common[seededRandom(0,  prot_common.length)]);

    for (let i = 0; i < 4; i++)
	booster.push(prot_uncommon[seededRandom(0, prot_uncommon.length)]);

    for (let i = 0; i < 1; i++)
	booster.push(prot_rare[seededRandom(0, prot_rare.length)]);

    return booster;
}
