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
let playersCanvas = document.getElementById("playerscanvas");

let activeCardText;
let activeCountersText;
let currPlayerText;
let currPlayerCountersText;

let stage = new createjs.Stage('gamecanvas');

function startGame() {
    // explain rules 
    let txt = "No Thanks is a card game in which players take turns either taking the face up" +
     "card in the middle or putting a counter on it. When a card is taken a new one is flipped over." +
     "There are 24 cards in the deck each which has a number between 3 and 35," +
     "the game ends when this deck is exausted. \n" +
     "The object of No Thanks is to have the least points at the end of the game." +
     "Each card is worth the number value on it, but runs are only worth the lowest value." +
     "Each counter is a negative point.";
    alert(txt); 

    // create deck of 24 cards from cards numbered 3 through 35
    let cards = Array();
    for (let i = 3; i <= 35; i++) {
        cards[i - 3] = i;
    }

    for (let i = 0; i < 24; i++) {
        let randIdx = Math.floor(Math.random() * (cards.length - 1));
        deck.push(cards.splice(randIdx, 1)[0]);
    }

    // initilize values
    activeCard = deck.pop();
    activeCounters = 0; 
    player = 0;

    // display deck
    const margin = gameCanvas.width /40
    let cardBackBitMap = new createjs.Bitmap(cardBack);
    stage.addChild(cardBackBitMap);
    cardBackBitMap.x = margin;
    cardBackBitMap.y = 2 * gameCanvas.height / 5;
    cardBackBitMap.scaleX = (9 * gameCanvas.width) / (20 * cardBack.width);
    cardBackBitMap.scaleY = 3 * gameCanvas.height / (5 * cardBack.height);

    // display active card face
    let activeCardBitMap = new createjs.Bitmap(cardFront);
    stage.addChild(activeCardBitMap);
    activeCardBitMap.x = 21 * margin;
    activeCardBitMap.y = 2 * gameCanvas.height / 5;
    activeCardBitMap.scaleX = (18 * margin) / cardFront.width;
    activeCardBitMap.scaleY = 3 * gameCanvas.height / (5 * cardFront.height);
    
    // display active card value
    activeCardText = new createjs.Text(activeCard, "24px sans-serif");
    activeCardText.x = 6 * gameCanvas.width / 9;
    activeCardText.y = 2 * gameCanvas.height / 3;
    stage.addChild(activeCardText);

    // display counters on active cards
    activeCountersText = new createjs.Text(`Counters: ${activeCounters}`,
        "12px sans-serif");
    activeCountersText.x = 11 * gameCanvas.width / 20;
    activeCountersText.y = 5 * gameCanvas.height / 6;
    stage.addChild(activeCountersText);

    // display current player
    currPlayerText = new createjs.Text(`Player: ${player + 1}`, "14px sans-serif", "#F1F1F1");
    currPlayerText.x = margin;
    currPlayerText.y = gameCanvas.height / 20;
    stage.addChild(currPlayerText);

    // display current player's counters
    currPlayerCountersText = new createjs.Text(`Current Player Counters: ${players[player][1]}`,
        "14px sans-serif", "#F1F1F1");
    currPlayerCountersText.x = margin;
    currPlayerCountersText.y = gameCanvas.height / 6;
    stage.addChild(currPlayerCountersText);

    stage.update();
}

function cardTaken() {
    // player takes card and counters on card
    let playerCards = players[player][0];

    // put new card in that players cards in order
    addCard: {
        for (let i = 0; i < playerCards.length; i++) {
            if (playerCards[i] > activeCard) {
                playerCards.splice(i, 0, activeCard);
                break addCard;
            } else if (i + 1 == playerCards.length) {
                playerCards.push(activeCard);
                break addCard;
            }
        }
        // if player had no cards put new card in set
        if (playerCards.length == 0) {
            playerCards.push(activeCard);
        }
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
    activeCountersText.text = `Counters: ${activeCounters.toString()}`;
    currPlayerText.text = `Player: ${player + 1}`;
    currPlayerCountersText.text = `Current Player Counters: ${players[player][1]}`;
    stage.update();
}

//update visuals on which players have which cards
function updateplayerCanvas() {
    // update player cards
    const ctx = playersCanvas.getContext("2d");
    ctx.font = "12px sans-serif";
    const playerWidth = playersCanvas.width / playerCount;
    ctx.clearRect(player * playerWidth, 0, (player + 1) * playerWidth, playersCanvas.height);
    
    // only need to update the current player
    const x = player * playerWidth + 10;
    let y = 10;
    ctx.fillText(`Player ${(player + 1).toString()}`, x, y);
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
        str += `Player ${(i + 1)}: ${score(i)}\n`;
    }

    alert(str);
    window.close()
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