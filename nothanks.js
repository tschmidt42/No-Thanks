/**
TODO:
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

    // set up canvas
    let cardBackBitMap = new createjs.Bitmap(cardBack);
    stage.addChild(cardBackBitMap);
    cardBackBitMap.x = 400;
    cardBackBitMap.y = 150;
    cardBackBitMap.scale = 0.1;

    let activeCardBitMap = new createjs.Bitmap(cardFront);
    stage.addChild(activeCardBitMap);
    activeCardBitMap.x = 600;
    activeCardBitMap.y = 150;
    
    activeCardText = new createjs.Text(activeCard.toString(), "24px sans-serif");
    activeCardText.x = 640;
    activeCardText.y = 170;
    stage.addChild(activeCardText);

    activeCountersText = new createjs.Text("Counters: " + activeCounters.toString(),
        "24px sans-serif");
    activeCountersText.x = 550;
    activeCountersText.y = 350;
    stage.addChild(activeCountersText);

    stage.update();

}

function cardTaken() {
    // player takes card and counters on card
    let playerCards = players[player][0];
    // put new card in that players cards in order
    for (let i = 0; i < playerCards.length; i++) {
        if (playerCards[i] > activeCard) {
            playerCards.splice(i, 0, activeCard);
            break;
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
        // next players turn
        player = (player + 1) % playerCount;

        updateCanvas();
    }
}

function cardLeft() {
    // player puts counter on card
    players[player][1] -= 1;
    activeCounters += 1;

    // next players turn
    player = (player + 1) % playerCount;

    updateCanvas();
}
 

// update visuals on cards and chips
function updateCanvas() {
    // update active card and chips
    activeCardText.text = activeCard.toString();
    activeCountersText.text = "Counters: " + activeCounters.toString();

    // update player cards
    // ****** put player cards code here *******
    stage.update();
}

function gameEnd() {
    alert("Thanks for playing!");
}

// score: each card counts for it's value but runs are scored by the lowest value
// remaining chips are worth negative points
function score(cards, chips) {
    let score = -1 * chips;
    let prev = 0;
    for (let card in cards) {
        if (card - prev > 1) {
            score = score + card;
        }
        prev = card;
    }
    return score;
}
