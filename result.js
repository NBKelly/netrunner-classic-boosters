var script = document.createElement('script');
script.src = 'https://code.jquery.com/jquery-3.6.3.min.js'; // Check https://jquery.com/ for the current version
document.getElementsByTagName('head')[0].appendChild(script);

// the initial seed
Math.seed = 6;

// in order to work 'Math.seed' must NOT be undefined,
// so in any case, you HAVE to provide a Math.seed
Math.setSeed = function(seed) {
    Math.seed = seed;
}
Math.seededRandom = function(max, min) {
    max = max || 1;
    min = min || 0;

    Math.seed = (Math.seed * 9301 + 49297) % 233280;
    var rnd = Math.seed / 233280;

    return min + rnd * (max - min);
}

function displayCorp() {
    document.getElementById("Corp").style.display = "block";
    document.getElementById("Runner").style.display = "none";
}

function displayRunner() {
    document.getElementById("Corp").style.display = "none";
    document.getElementById("Runner").style.display = "block";
}

class Card {
    constructor(name, ap) {
	this.name = name;
	this.ap = ap;
	this.imageName;
    }
}

var zones = {
    // ----- corp pool
    "corp-pool-agenda": new Map(),
    "corp-pool-ice": new Map(),
    "corp-pool-operation": new Map(),
    "corp-pool-asset": new Map(),
    "corp-pool-upgrade": new Map(),
    // ----- corp deck
    "corp-deck-agenda": new Map(),
    "corp-deck-ice": new Map(),
    "corp-deck-operation": new Map(),
    "corp-deck-asset": new Map(),
    "corp-deck-upgrade": new Map(),
    // ----- runner pool
    "runner-pool-program": new Map(),
    "runner-pool-hardware": new Map(),
    "runner-pool-event": new Map(),
    "runner-pool-resource": new Map(),
    // ----- runner deck
    "runner-deck-program": new Map(),
    "runner-deck-hardware": new Map(),
    "runner-deck-event": new Map(),
    "runner-deck-resource": new Map()
};

/**
 * replaces the name string of a zone between the deck and the pool
 */
function invert_zone(zone) {
    if(zone.includes("pool"))
	return zone.replace("pool", "deck");
    return zone.replace("deck", "pool");
}

function move_fn(name, fromZone, toZone) {
    let from = zones[fromZone];
    let to = zones[toZone];

    //console.log(from);

    //* decrement or remove from _from_
    if (from.get(name) > 1)
	from.set(name, from.get(name) - 1);
    else
	from.delete(name);

    // increment or add to _to_
    if(to.get(name) != null)
	to.set(name, to.get(name) + 1);
    else
	to.set(name, 1);

    render_zone(fromZone);
    render_zone(toZone);
}


/* TODO !important the following cards need a special string:
   Pi in the face
   R&D-Protocol Files
   Bodyweight Synthetic Blood
   Lucidrine Booster Drug
 */
function populate_teki(zone) {
    if(zone.includes("corp")) {
	let element = document.getElementById('corp-teki-list');
	element.innerHTML = "";
	let t_zones = ['corp-deck-agenda', 'corp-deck-ice','corp-deck-asset',
		       'corp-deck-upgrade','corp-deck-operation',];
	for(let zone_name of t_zones) {
	    for (let [key, value] of zones[zone_name]) {
		let jnet_str = value + " ONR " + fix_name(key.replaceAll("(r)", " [R]").replaceAll("(tm)", " [TM]"));
		let sp = document.createElement("span");
		sp.innerHTML = jnet_str;
		element.appendChild(sp);
		element.appendChild(document.createElement("br"));
	    }
	}
    }
    else {
	let element = document.getElementById('runner-teki-list');
	element.innerHTML = "";
	let t_zones = ['runner-deck-program', 'runner-deck-hardware',
		       'runner-deck-event','runner-deck-resource',];
	for(let zone_name of t_zones) {
	    for (let [key, value] of zones[zone_name]) {
		let jnet_str = value + " ONR " + fix_name(key.replaceAll("(r)", " [R]").replaceAll("(tm)", " [TM]"));
		let sp = document.createElement("span");
		sp.innerHTML = jnet_str;
		element.appendChild(sp);
		element.appendChild(document.createElement("br"));
	    }
	}
    }
}

function create_list_element(text, qty, from, to) {
    var node = document.createElement("li");
    let image_url = to_image_name(text);
    let div = document.createElement("div");
    div.className = "cardDiv hover_img";
    node.className = ".cardLi";

    /**
     * TODO - this placement doesn't look great with ice because it has a different template
     *        so we should rotate this on ice to be vertical (look at my other project for that)
     *        but first, some ice has another tempalte entirely, so we need to split the ice
     *        into those two different templates first!!!
     */

    node.setAttribute("style", "background-image: url(" + image_url + ");" +
		      "width: 280px;" +
		      "background-repeat: no-repeat;" +
		      "background-size: 280px 392px;" + //H = width * 1.4
		      "background-position: 0px -100px;");

    let c = new Card(text, 0, image_url);
    //node.setAttribute("data-card", c);

    let span_numbers = document.createElement("DIV");
    let span_name = document.createElement("DIV");
    span_numbers.className = "numberSpan";
    span_name.className = "titleSpan";

    let text_name = document.createTextNode(text.toUpperCase());
    let text_numbers = document.createTextNode(qty);

    let overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.setAttribute("style", "background-image: url(" + image_url + ");" +
			 "width: 280px;" +
			 "height: 392px;" +
			 "background-repeat: no-repeat;" +
			 "background-size: 280px 392px;"); //H = width * 1.4

    span_numbers.appendChild(text_numbers);
    span_name.appendChild(text_name);

    div.appendChild(span_numbers);
    div.appendChild(span_name);
    div.appendChild(overlay);

    node.appendChild(div);

    let move_fn_str = "move_fn(\"" + text.replaceAll("\"", "\\\"") + "\", \"" + from + "\", \"" + to + "\")";
    //console.log(move_fn_str);
    node.setAttribute("onclick", move_fn_str);

    return node;
}

function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

var generatedCards = [];
var freqCards = new Map();

/* this generates all the cards we choose in a repeatable way
   (same seed always give the same results) */

function render_zone(zone_name) {
    let from = zone_name;
    let to = invert_zone(zone_name);

    let canvas = document.getElementById(from);
    //console.log(canvas);
    canvas.innerHTML = "";

    /* sort the zone */
    let cards = new Map([...zones[from]].sort((a, b) => String(a[0]).localeCompare(b[0])));

    for (let [key, value] of cards) {
	let tmp_node = create_list_element(key, value, from, to);
	canvas.appendChild(tmp_node);
    }

    /*
     * TODO - additional boilerplate for card count, agenda point count
     */
    /* render agenda points */
    if(zone_name.includes("corp")) {
	let count = count_deck(zones['corp-deck-agenda'])
	    + count_deck(zones['corp-deck-ice'])
	    + count_deck(zones['corp-deck-operation'])
	    + count_deck(zones['corp-deck-asset'])
	    + count_deck(zones['corp-deck-upgrade']);

	let ap_lim = ap_limit(count);
	let ap = count_ap(zones['corp-deck-agenda']);

	document.getElementById("ccc").innerHTML = (count + " Cards (min 45)");
	document.getElementById("capc").innerHTML = (ap + " / " + ap_lim + " Agenda Points");
    }
    else {
	let count = count_deck(zones['runner-deck-program'])
	    + count_deck(zones['runner-deck-hardware'])
	    + count_deck(zones['runner-deck-event'])
	    + count_deck(zones['runner-deck-resource']);

	document.getElementById("rcc").innerHTML = (count + " Cards (min 45)");
    }

    if(zone_name.includes("deck"))
	populate_teki(zone_name);
}

function assembleCards() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let seed = urlParams.get('seed');

    let rand = (mulberry32(seed));
    let seeds = [];
    for(let i = 0; i < 500; i++)
	seeds.push(Math.floor(rand()*9999999));

    let starters = urlParams.get('starters');
    let base_boosters = urlParams.get('base_boosters');
    let proteus_boosters = urlParams.get('proteus_boosters');
    let classic_boosters = urlParams.get('classic_boosters');
    let extra_cards = urlParams.get('extra_cards');
    console.log(extra_cards);

    generatedCards = generatedCards.concat(JSON.parse(extra_cards));
    // get all the boosters we need
    for(let i = 0; i < starters; i++) {
	let x = base_set_starter(seeds[i]);
	//console.log(x);
	generatedCards = generatedCards.concat(x);
	//console.log(generatedCards);
    }

    for(let i = 0; i < base_boosters; i++) {
	let x = base_set_booster(seeds[i]);
	//console.log(x);
	generatedCards = generatedCards.concat(x);
	//console.log(generatedCards);
    }

    for(let i = 0; i < proteus_boosters; i++) {
	let x = proteus_booster(seeds[i]);
	//console.log(x);
	generatedCards = generatedCards.concat(x);
	//console.log(generatedCards);
    }

    for(let i = 0; i < classic_boosters; i++) {
	let x = classic_booster(seeds[i]);
	//console.log(x);
	generatedCards = generatedCards.concat(x);
    }



    /* map all our cards by frequency */
    for (const card of generatedCards) {
	freqCards.set(card, freqCards.get(card) ? freqCards.get(card) + 1 : 1);
    }

    /*for (const card of runner_cards_array) {
	console.log(card);
	freqCards.set(card, 1);
    }*/

    console.log(freqCards);

    let corp_co = "";
    let runner_co = "";

    for (let [key, value] of freqCards) {
	if(is_corp_card(key)) {
	    let target_zone = 'corp-pool-' + corp_card_type(key);
	    zones[target_zone].set(key, value);
	    corp_co = corp_co + "\n" + value + " ONR " + key.replaceAll("(r)", " [R]").replaceAll("(tm)", " [TM]");
	}
	else {
	    console.log(key);
	    let target_zone = 'runner-pool-' + runner_card_type(key);
	    //console.log(target_zone);
	    zones[target_zone].set(key, value);
	    runner_co = runner_co + "\n" + value + " ONR " + key.replaceAll("(r)", " [R]").replaceAll("(tm)", " [TM]");
	}
    }

    console.log(corp_co);
    console.log(runner_co);

    /* now we want to insert all of these into our pool */
    //corp_cards = freqCards; // todo - update once we seperate out the cards

    render_zone('corp-pool-agenda');
    render_zone('corp-pool-ice');
    render_zone('corp-pool-asset');
    render_zone('corp-pool-operation');
    render_zone('corp-pool-upgrade');

    render_zone('runner-pool-program');
    render_zone('runner-pool-hardware');
    render_zone('runner-pool-resource');
    render_zone('runner-pool-event');
}
