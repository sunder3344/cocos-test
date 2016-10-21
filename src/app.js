
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
        this.sprite = new cc.Sprite(res.HelloWorlds_png);
        this.sprite.attr({
            x: size.width / 2,
            y: size.height / 2
        });
        this.addChild(this.sprite, 0);

        return true;
    }
});

var MenuItemSpriteLayer = cc.Layer.extend({
	ball : null,
	animate : null,
	ctor:function() {
		this._super();
//		var spriteNormal = new cc.Sprite(res.BALL_JPG);
//		var spriteSelected = new cc.Sprite(res.BALL2_JPG);
//		cc.log(spriteSelected);
//		spriteSelected.scaleX = 0.2;
//		spriteSelected.scaleY = 0.2;
//		spriteSelected.x = 300;
//		spriteSelected.y = 100;
//		var spriteDisable = new cc.Sprite(res.BALL3_JPG);
//		var menuSprite = new cc.MenuItemSprite(spriteNormal, spriteSelected, spriteDisable, this.startGame, this);
//		var menu = new cc.Menu(menuSprite);
//		this.addChild(menu);
//		menuSprite.setEnabled(false);
//		menuSprite.setEnabled(true);
		var root = ccs.load(res.MainScene_json);
		var button = root.node.getChildByTag(35);
		this.ball = root.node.getChildByTag(37);
		this.animate = root.node.getChildByTag(39);
		this.animate.visible = false;
		
		this.addChild(root.node);
//		var button = root.node.getChildByName("Button_1");
		
		if ("touches" in cc.sys.capabilities) {
			button.addTouchEventListener(this.buttonTouched, this);
		} else {
			button.addClickEventListener(this.buttonClicked.bind(this), this);
		}	
	},
	
	buttonTouched:function(sender, type) {
		switch (type) {
			case ccui.Widget.TOUCH_BEGAN:
				cc.log("touch down");
				break;
			case ccui.Widget.TOUCH_MOVED:
				cc.log("touch move");
				break;
			case ccui.Widget.TOUCH_ENDED:
				cc.log("touch up");
				break;
			case ccui.Widget.TOUCH_CANCELED:
				cc.log("touch canceled");
				break;
		}
	},
	
	buttonClicked:function(sender) {
//		this.ball.visible = false;
		this.ball.x = 129;
		this.ball.y = 153;
		this.animate.visible = true;
		var action = cc.moveTo(10, cc.p(120, 110));
		var reverse = cc.reverseTime(action);
		var sequence = cc.sequence(action, reverse);
		this.animate.runAction(sequence);
		cc.log("button clicked");
		return true;
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

//通过texturepacker添加图片
var TestLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		cc.spriteFrameCache.addSpriteFrames(res.TEST_PLIST);
		var ball = new cc.Sprite("#ball.jpg");
		this.addChild(ball);
	}
});

//组件缓存池
var PoolLayer = cc.Layer.extend({
	tag:0,
	deleteTag:0,
	ctor:function() {
		this._super();
		cc.spriteFrameCache.addSpriteFrames(res.TEST_PLIST);
		deleteTag = tag = 0;
		this.scheduleUpdate();
	},
	
	update:function() {
		var size = cc.winSize;
		if (this.tag - this.deleteTag > 500) {
			var ball = this.getChildByTag(this.deleteTag);
			cc.pool.putInPool(ball);
			this.removeChild(ball);
			this.deleteTag++;
		}
		var param = "anything";
		for (var i = 0; i < 250; i++) {
			var ball = null;
			if (cc.pool.hasObject(ReuseSprite)) {
				ball = cc.pool.getFromPool(ReuseSprite, param);
			} else {
				ball = new ReuseSprite("#ball.jpg");
			}
			this.addChild(ball, 1, this.tag);
			this.tag++;
			ball.x = Math.random() * size.width;
			ball.y = Math.random() * size.height;
		}
	}
});

//动画测试1(important!!!)
var AnimateLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		size = cc.winSize;
		var man = new cc.Sprite();
		/*var animation = new cc.Animation();
		for (var i = 1; i < 15; i++) {
			var img = "res/imgs/grossini_dance_" + ((i < 10) ? ("0" + i) : i) + ".png";
			animation.addSpriteFrameWithFile(img);
		}
		animation.setDelayPerUnit(4/14);
		animation.setRestoreOriginalFrame(true);
		var action = cc.animate(animation);
		action.repeatForever();
		man.runAction(action);
		this.addChild(man);
		man.x = size.width/2;
		man.y = size.height/2;*/
		cc.spriteFrameCache.addSpriteFrames(res.GROSSINI_PNG);
		var frames = [];
		for (var i = 1; i < 15; i++) {
			var frame = cc.spriteFrameCache.getSpriteFrame("grossini_dance_generic_" + ((i < 10) ? ("0" + i) : i) + ".png");
			frames.push(frame);
		}
		var animation = new cc.Animation(frames);
		animation.setDelayPerUnit(4/14);
		var animate = new cc.Animate(animation);
		var action = animate.repeatForever();
		man.runAction(action);
		this.addChild(man);
		man.x = size.width/2;
		man.y = size.height/2;
	}
});

var ArmatureLayer = cc.Layer.extend({
	_armature:null,
	_direction:1,
	ctor:function() {
		this._super();
		var winSize = cc.winSize;
		ccs.armatureDataManager.addArmatureFileInfo(res.ARMATURE_JSON);
		this._armature = new ccs.Armature("myAnimation");
		this._armature.getAnimation().play("action1");
//		this._armature.getAnimation().play("action1", 3, 1);
		this._armature.scaleX = 1;
		this._armature.scaleY = 1;
		this._armature.x = winSize.width / 2 - 150;
		this._armature.y = winSize.height / 2;
//		this._armature.getAnimation().setSpeedScale(30/60);
		cc.log(this._armature.getAnimation());
		this.addChild(this._armature);
		this._direction = 1;
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new ArmatureLayer();
        this.addChild(layer);
    }
});

