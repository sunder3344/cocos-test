
var HelloWorldLayer = cc.Layer.extend({
    sprite:null,
    ctor:function () {
        //////////////////////////////
        // 1. super init first
        this._super();

        /////////////////////////////
        // 2. add a menu item with "X" image, which is clicked to quit the program
        //    you may modify it.
        // ask the window size
        var size = cc.winSize;

        /////////////////////////////
        // 3. add your codes below...
        // add a label shows "Hello World"
        // create and initialize a label
        var helloLabel = new cc.LabelTTF("Hello World", "Arial", 38);
        // position the label on the center of the screen
        helloLabel.x = size.width / 2;
        helloLabel.y = size.height / 2 + 200;
        // add the label as a child to this layer
        this.addChild(helloLabel, 5);

        // add "HelloWorld" splash screen"
        this.sprite = new cc.Sprite(res.HelloWorld_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        return true;
    }
});

var MenuItemSpriteLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var spriteNormal = new cc.Sprite(res.BALL_JPG);
		var spriteSelected = new cc.Sprite(res.BALL2_JPG);
		cc.log(spriteSelected);
		spriteSelected.scaleX = 0.2;
		spriteSelected.scaleY = 0.2;
		spriteSelected.x = 300;
		spriteSelected.y = 100;
		var spriteDisable = new cc.Sprite(res.BALL3_JPG);
		var menuSprite = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisable, this.startGame, this);
		var menu = new cc.Menu(menuSprite);
		this.addChild(menu);
		menuSprite.setEnabled(false);
		menuSprite.setEnabled(true);
	},
	
	startGame:function() {
		cc.log('This is MenuItemSpriteLayer? ', this instanceof MenuItemSpriteLayer);
	}
});

var MenuItemFontLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var menuFont = new cc.MenuItemFont("Start Game", this.startGame, this);
		menuFont.fontSize = 32;
		menuFont.fontName = "Arial";
		var menu = new cc.Menu(menuFont);
		this.addChild(menu);
	},
	
	startGame:function() {
		cc.log("start game button clicked!");
	}
});

var MenuItemToggleLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		cc.MenuItemFont.setFontName("Arial");
		cc.MenuItemFont.setFontSize(32);
		var on = new cc.MenuItemFont("ON");
		var off = new cc.MenuItemFont("OFF");
		var item = new cc.MenuItemToggle(off, on, this.toggleMusic, this);
		
		var menu = new cc.Menu(item);
		this.addChild(menu);
	},
	
	toggleMusic:function() {
		if (this.musicOff) {
			cc.log("music on");
			this.musicOff = false;
			cc.log(this.musicOff);
		} else {
			cc.log("music off");
			this.musicOff = true;
			cc.log(this.musicOff);
		}
		
		
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new MenuItemSpriteLayer();
        this.addChild(layer);
    }
});

