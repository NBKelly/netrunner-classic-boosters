function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function addParam(link, param, val) {
    if(link === "result.html")
	link = link + "?";
    else
	link = link + "&";

    link = link + param + "=" + encodeURIComponent(val);
    return link;
}

function generateOnce() {
    var starters = document.getElementById('startercount').value;
    //console.log("Starters: " + starters);

    var base_boosters = document.getElementById('starterboostercount').value;
    //console.log("Base Set Boosters: " + base_boosters);

    var proteus_boosters = document.getElementById('proteusboostercount').value;
    //console.log("Proteus Boosters: " + proteus_boosters);

    var classic_boosters = document.getElementById('classicboostercount').value;
    //console.log("Classic Boosters: " + classic_boosters);

    var link = "result.html"

    let extra_cards = [];
    for (let el of document.getElementsByClassName('extra-card')) {
	console.log(el.value);
	extra_cards.push(el.value);
    }

    let json_str = JSON.stringify(extra_cards);

    // attributes - seed
    link = addParam(link, "seed", getRandomInt(1,10000));
    link = addParam(link, "starters", starters);
    link = addParam(link, "base_boosters", base_boosters);
    link = addParam(link, "proteus_boosters", proteus_boosters);
    link = addParam(link, "classic_boosters", classic_boosters);
    link = addParam(link, "extra_cards", json_str);
    console.log(link);

    return link;
}

function generateCards() {
    // get the counts of each booster
    // construct a link to results.html with booster count + random number
    // (do this x times, put the links all in a box)
    var players = document.getElementById('playercount').value;
    if(players == null)
	players = 2;

    var links = "";//[];

    for(let i = 0; i < players; i++) {
	let link = generateOnce();

	link = "<tr><td><a href=\"" + link + "\">Player " + (i + 1) + "<\a></td></tr>";
	links += link;
    }

    document.getElementById('resultsArea').innerHTML = links;
}
