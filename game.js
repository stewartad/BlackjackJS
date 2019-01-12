var config = {
    type: Phaser.AUTO,
    width: 1200,
    height: 800,
    
    scene: [CardTable]
    
};

var game = new Phaser.Game(config);

/*
 * A card object that holds suit, value, and framenumber for sprite creation
 */
class Card {
    constructor(number, suit)
    {
        this.number = number;
        this.suit = suit;
        this.name = this.getName();
        this.frameNum = this.getFrameNumber();
    }

    getName()
    {
        if (this.number === 11) {
            return "Jack";
        }
        else if (this.number === 12) {
            return "Queen";
        }
        else if (this.number === 13) {
            return "King";
        }
        else if (this.number === 1) {
            return "Ace";
        }
        else {
            return String(this.number);
        }
    }

    getFrameNumber()
    {
        // the card images are taken from a sheet of all 52 cards
        // each row has 13 cards
        if (this.suit.localeCompare("Spades") === 0) {
            return (this.number - 1);
        }
        else if (this.suit.localeCompare("Clubs") === 0) {
            return 13 + (this.number - 1);
        }
        else if (this.suit.localeCompare("Diamonds") === 0) {
            return 26 + (this.number - 1);
        }
        else if (this.suit.localeCompare("Hearts") === 0) {
            return 39 + (this.number - 1);
        }
    }
}

/*
 * Deck object holds a list of cards
 */
class Deck {
    constructor()
    {
        this.deckList = [];
        this.populateDeck();
    }

    /*
     * Fills the deck with cards
     */
    populateDeck()
    {
        var suits = ['Spades', 'Clubs', 'Diamonds', 'Hearts'];
        for (var i = 0; i < 4; i++)
        {
            for (var j = 1; j < 14; j++)
            {
                this.deckList.push(new Card(j, suits[i]));
            }
        }
    }

    /*
     * Fisher-Yates algorithm to shuffle the deck
     */
    shuffle()
    {
        var i, j, x;
        for (i = this.deckList.length - 1; i > 0; i--)
        {
            j = Math.floor(Math.random() * (i + 1));
            x = this.deckList[i];
            this.deckList[i] = this.deckList[j];
            this.deckList[j] = x;
        }
    }

    /*
     * Get the card at the top of the deck and remove it from the list
     */
    dealCard()
    {
        return this.deckList.pop();
    }
}

class Player {
    constructor()
    {
        this.hand = new Hand;
    }

    getHand()
    {
        return this.hand.cardList;
    }
}

class Hand {
    constructor()
    {
        this.cardList = []
    }

    /*
     * Add card to the end of the hand array
     */
    addCard(card)
    {
        this.cardList.push(card);
    }

    /*
     * Gets the positon of given card in the array and removes it from the hand
     */
    removeCard(card)
    {
        this.cardList.splice(this.cardList.indexOf(card), 1);
    }

    printContents()
    {
        for (var i = 0; i < this.cardList.length; i++)
        {
            console.log(i + ': ' + this.cardList[i].name + ' of ' + this.cardList[i].suit);
        }
    }
}

class GameState {
    constructor()
    {
        this.deck = new Deck();
        this.players = [];
        this.pile = [];
    }

    /*
     * Initializes the game state by creating 4 players and dealing out the deck to them
     */
    startGame()
    {
        for (var i = 0; i < 4; i++)
        {
            this.players[i] = new Player();
        }

        this.deck.shuffle();

        for (var i = 0; i < 52; i++)
        {
            this.players[i % 4].hand.addCard(this.deck.dealCard());
        }

        // Debug Code
        // for (var i = 0; i < 4; i++)
        // {
        //     this.players[i].hand.printContents();
        // }

    }

    getPlayerHand(index)
    {
        return this.players[index].getHand();
    }

    playCard(player, card)
    {
        this.pile.push(card);
        player.hand.removeCard(card);
    }

    getTopCard()
    {
        return this.pile[this.pile.length - 1];
    }
}

class CardSprite extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, cardObj) {
        super(scene, x, y, texture, cardObj.frameNum);
        this.card = cardObj;
        this.startX = x;
        this.startY = y;
    }
}