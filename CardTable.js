class CardTable extends Phaser.Scene {

    constructor() 
    {
        super({key:"CardTable"});
        this.cardSheetWidth = 334;
        this.cardSheetHeight = 440;
        this.cardScaleSmall = 0.25;
        this.cardScaleLarge = 0.75;
        this.cardGap = 0.01;
        this.cardDropLeft = 300;
        this.cardDropRight = 600;
        this.cardDropTop = 400;
        this.cardDropBot = 730;
        this.newGame = new GameState();
    }

    preload()
    {
        this.load.image('bg', 'assets/background.png');
        this.load.spritesheet('cards', 'assets/cards.png', { frameWidth: this.cardSheetWidth, frameHeight: this.cardSheetHeight });
        this.load.image('cardback', 'assets/back.png');
    }

    create()
    {
        // draw the background
        var background = this.add.tileSprite(600, 400, 1200, 800, 'bg');
        
        // start the game state
        this.newGame.startGame();

        var cards = this.add.group();
        const playerHand = this.newGame.player.getHand();
        const dealerHand = this.newGame.dealer.getHand();

        // display player hand
        for (var i = 0; i < playerHand.length; i++)
        {
            var x = i * this.cardSheetWidth * (this.cardScaleSmall + this.cardGap);

            var newCard = new CardSprite(this, x + 71, 700, 'cards', playerHand[i]);
            var image = this.add.existing(newCard);

            //image.setInteractive();

            //image.on('clicked', this.onCardClick, this);

            image.setScale(this.cardScaleSmall);

            //this.input.setDraggable(image);

            cards.add(image);
        }

        for (var i = 0; i < dealerHand.length; i++)
        {
            var x = i * this.cardSheetWidth * (this.cardScaleSmall + this.cardGap);

            var newCard;
            if (dealerHand[i].hidden)
            {
                newCard = this.add.sprite(x + 71, 200, 'cardback');
            }
            else
            {
                newCard = new CardSprite(this, x + 71, 200, 'cards', dealerHand[i]);
            }
            var image = this.add.existing(newCard);

            //image.setInteractive();

            //image.on('clicked', this.onCardClick, this);

            image.setScale(this.cardScaleSmall);

            //this.input.setDraggable(image);

            cards.add(image);
        }

        var oldX = 0;
        var oldY = 0;
        // Move dragged card to top
        this.input.on('dragstart', function (pointer, gameObject) {

            this.children.bringToTop(gameObject);
            oldX = gameObject.x;
            oldY = gameObject.y;

        }, this);

        // Card dragging
        this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
            gameObject.x = dragX;
            gameObject.y = dragY;

        });

        // Emits clicked event on gameobjects
        this.input.on('gameobjectup', function (pointer, gameObject) {
            console.log('X: ' + gameObject.x + 'Y: ' + gameObject.y);
            gameObject.emit('clicked', gameObject);
            gameObject.x = oldX;
            gameObject.y = oldY;
        }, this)
    }

    update()
    {
        
    }

    onCardClick(card)
    {
        if (card.x >= this.cardDropLeft && card.x <= this.cardDropRight)
        {
            card.off('clicked', this.onCardClick);
            card.input.enabled = false;
            card.setVisible(false);
            this.newGame.playCard(this.newGame.player, card.card);
            this.addToPile();
        }
        
    }

    addToPile()
    {
        var pileCard = new CardSprite(this, 300, 400, 'cards', this.newGame.getTopCard());
        pileCard.setScale(this.cardScaleLarge);
        this.add.existing(pileCard);
    }
}