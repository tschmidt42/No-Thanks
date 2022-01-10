/**
TODO:
    fix score
    support differnt player counts
    flip animation
**/

// define card images
let cardBack = new Image();
cardBack.src = "cardBack.jpg";

let cardFront = new Image();
cardFront.src = "cardFront.jpg";

//initialize players, start w no cards and 11 counters 
let playerCount = 3;
let players = Array();
for (let i = 0; i < playerCount; i++) {
    players[i] = [Array(), 11];
}
let player;

// create global variables
let activeCard;
let activeCounters = 0;
let deck = Array();

let gameCanvas = document.getElementById("gamecanvas");
let playersCanvas = document.getElementById("playerscanvas");
let activeCardText;
let activeCountersText;
let stage = new createjs.Stage('gamecanvas');

function startGame() {
    // create deck of 24 cards from cards numbered 3 through 35
    let cards = Array();
    for (let i = 3; i <= 35; i++) {
        cards[i - 3] = i;
    }

    for (let i = 0; i < 24; i++) {
        let randIdx = Math.floor(Math.random() * (cards.length - 1));
        deck.push(cards.splice(randIdx, 1));
    }

    // initilize values
    activeCard = deck.pop();
    activeCounters = 0; 
    player = 0;

    // display deck
    let cardBackBitMap = new createjs.Bitmap(cardBack);
    stage.addChild(cardBackBitMap);
    cardBackBitMap.x = gameCanvas.width / 40;
    // cardBackBitMap.y = gameCanvas.height / 4;
    cardBackBitMap.scaleX = (9 * gameCanvas.width) / (20 * cardBack.width);
    cardBackBitMap.scaleY = gameCanvas.height / (cardBack.height);

    // display active card face
    let activeCardBitMap = new createjs.Bitmap(cardFront);
    stage.addChild(activeCardBitMap);
    activeCardBitMap.x = 21 * gameCanvas.width / 40;
    //activeCardBitMap.y = gameCanvas.height / 4;
    activeCardBitMap.scaleX = (9 * gameCanvas.width) / (20 * cardFront.width);
    activeCardBitMap.scaleY = gameCanvas.height / cardFront.height;
    
    // display active card value
    activeCardText = new createjs.Text(activeCard.toString(), "24px sans-serif");
    activeCardText.x = 6 * gameCanvas.width / 9;
    activeCardText.y = gameCanvas.height / 2;
    stage.addChild(activeCardText);

    // display counters on active cards
    activeCountersText = new createjs.Text("Counters: " + activeCounters.toString(),
        "12px sans-serif");
    activeCountersText.x = 11 * gameCanvas.width / 20;
    activeCountersText.y = 3 * gameCanvas.height / 4;
    stage.addChild(activeCountersText);

    stage.update();
}

function cardTaken() {
    // player takes card and counters on card
    let playerCards = players[player][0];

    // put new card in that players cards in order
    for (let i in playerCards) {
        if (playerCards[i] > activeCard) {
            playerCards.splice(i, 0, activeCard);
            break;
        } else if (i + 1 == playerCards.length) {
            playerCards.push(activeCard);
        }
    }
    // if player had no cards put new card in set
    if (playerCards.length == 0) {
        playerCards.push(activeCard);
    }

    players[player][0] = playerCards;

    // add counters on card to players personal supply
    players[player][1] += activeCounters;

    // flip new card and reset counters
    activeCard = deck.pop()
    activeCounters = 0;

    if (deck.length == 0) {
        gameEnd();
    } else {
        // update player's cards display
        updateplayerCanvas();
        
        // next players turn
        player = (player + 1) % playerCount;

        // update active cards + counters 
        updategameCanvas();
    }
}

function cardLeft() {
    // player puts counter on card
    players[player][1] -= 1;
    activeCounters += 1;

    // next players turn
    player = (player + 1) % playerCount;   
    
    // show new counter on active card
    updategameCanvas();
}
 
// update visuals on active cards and counters
function updategameCanvas() {
    // update active card and counters
    activeCardText.text = activeCard.toString();
    activeCountersText.text = "Counters: " + activeCounters.toString();
    stage.update();
}

//update visuals on which players have which cards
function updateplayerCanvas() {
    // update player cards
    const ctx = playersCanvas.getContext("2d");
    ctx.font = "12px sans-serif";
    const playerWidth = playersCanvas.width / playerCount;
    ctx.clearRect(player * playerWidth, 0, (player + 1) * playerWidth, playersCanvas.height);
    
    const x = player * playerWidth + 10;
    let y = 10;
    ctx.fillText("Player " + player.toString(), x, y);
    let playerCards = players[player][0];
    for (let i in playerCards) {
        y += 15
        ctx.fillText(playerCards[i].toString(), x, y)
    }
}

// when game ends buttons shouldn't do anything and final scores should be displayed
function gameEnd() {
    //let scores = Array();
    let str = "Final scores: \n";
    for (let i = 0; i < playerCount; i++) {
        //scores[i] = score(i);
        str += "Player " + (i + 1) + ": " + score(i) + "\n";
    }

    alert(str);
}

// score: each card counts for it's value but runs are scored by the lowest value
// remaining counters are worth negative points
function score(player) {
    let cards = players[player][0]
    let score = -1 * players[player][1];
    let prev = 0;
    for (let i in cards) {
        let card = cards[i];
        if (card - prev > 1) {
            score += card;
        }
        prev = card;
    }
    return score;
}