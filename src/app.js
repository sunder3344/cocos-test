
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

var ParallaxLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var bg = new cc.ParallaxNode();
		var bg1 = new cc.Sprite(res.PARALLAX_LAYER);
		var bg2 = new cc.Sprite(res.PARALLAX_LAYER2);
		var bg3 = new cc.Sprite(res.PARALLAX_LAYER3);
		var bg4 = new cc.Sprite(res.PARALLAX_LAYER4);
		bg.addChild(bg1, 1, cc.p(0.1, 0), cc.p(bg1.width/2, bg1.height/2));
		bg.addChild(bg2, 2, cc.p(0.3, 0), cc.p(bg2.width/2, bg2.height/2));
		bg.addChild(bg3, 3, cc.p(0.5, 0), cc.p(bg3.width/2, bg3.height/2));
		bg.addChild(bg4, 4, cc.p(0.8, 0), cc.p(bg4.width/2, bg4.height/2));
		var action = cc.moveTo(1, -200, 0);
		bg.runAction(cc.sequence(action, action.clone().reverse()).repeatForever());
		this.addChild(bg);
	}
});

var UnlimitedParallaxLayer = cc.Layer.extend({
	_bg1:null,
	_bg2:null,
	_bg3:null,
	_bg4:null,
	speed:5,
	ctor:function() {
		this._super();
		this.scheduleUpdate();
		
		var buildParallaxBackground = function(texture) {
			var layer = new cc.Layer();
			var bg1 = new cc.Sprite(texture);
			bg1.x = bg1.width/2;
			bg1.y = bg1.height/2;
			layer.addChild(bg1);
			var bg2 = new cc.Sprite(texture);
			bg2.x = bg2.width/2 + bg2.width;
			bg2.y = bg2.height/2;
			layer.addChild(bg2);
			return layer;
		};
		this._bg1 = buildParallaxBackground(res.PARALLAX_LAYER);
		this.addChild(this._bg1);
		this._bg2 = buildParallaxBackground(res.PARALLAX_LAYER2);
		this.addChild(this._bg2);
		this._bg3 = buildParallaxBackground(res.PARALLAX_LAYER3);
		this.addChild(this._bg3);
		this._bg4 = buildParallaxBackground(res.PARALLAX_LAYER4);
		this.addChild(this._bg4);
		return true;
	},
	
	update:function(dt) {
		var winSize = cc.director.getWinSize();
		this._bg1.x -= Math.ceil(this.speed * 0.1);
		if (this._bg1.x < -parseInt(winSize.width)) {
			this._bg1.x = 0;
		}
		this._bg2.x -= Math.ceil(this.speed * 0.3);
		if (this._bg2.x < -parseInt(winSize.width)) {
			this._bg2.x = 0;
		}
		this._bg3.x -= Math.ceil(this.speed * 0.5);
		if (this._bg3.x < -parseInt(winSize.width)) {
			this._bg3.x = 0;
		}
		this._bg4.x -= Math.ceil(this.speed * 1.0);
		if (this._bg4.x < -parseInt(winSize.width)) {
			this._bg4.x = 0;
		}
	}
});

//瓦片地图
var TiledMapLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var map = new cc.TMXTiledMap(res.TILED_MAP);
		this.addChild(map);
		var layer = map.getLayer("layer1");
		var tile0 = layer.getTileAt(cc.p(1, 1));
		var rotate = cc.rotateBy(2, 360);
		tile0.runAction(rotate);
		var properties = map.getPropertiesForGID(layer.getTileGIDAt(cc.p(3, 2)));
		cc.log("properties.block", properties.block);
		this.scheduleOnce(function(){
			layer.setTileGID(31, cc.p(0, 0));
		}, 2);
	}
});

//BM位图字体
var BMFontLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.director.getWinSize();
		var bmFont1 = new cc.LabelBMFont("I am derek sunder", res.BM_FONT_FNT, 500, cc.TEXT_ALIGNMENT_CENTER);
		bmFont1.color = cc.color(255, 0, 0);
		this.addChild(bmFont1);
		bmFont1.scaleX = 4;
		bmFont1.scaleY = 4;
		bmFont1.x = size.width/2;
		bmFont1.y = size.height/2 + 50;
		var bmFont2 = new cc.LabelBMFont("AABBCCDDEEFFGG. ", res.BM_FNT, 500, cc.TEXT_ALIGNMENT_CENTER);
		this.addChild(bmFont2);
		bmFont2.x = size.width/2;
		bmFont2.y = size.height/2 - 100;
	}
});

//粒子效果
var ParticleLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var particleSystem = new cc.ParticleSystem(100);
		this.addChild(particleSystem);
		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_STAR);
		
		var size = cc.director.getWinSize();
		particleSystem.x = size.width/2;
		particleSystem.y = size.height/2;
		particleSystem.posVar = cc.p(0, 0);
		particleSystem.duration = cc.ParticleSystem.DURATION_INFINITY;
		particleSystem.emitterMode = cc.ParticleSystem.MODE_RADIUS;
		particleSystem.startRadius = 0;
		particleSystem.startRadiusVar = 30;
		particleSystem.endRadius = 240;
		particleSystem.endRadiusVar = 30;
		particleSystem.rotatePerS = 180;
		particleSystem.rotatePerSVar = 0;
		particleSystem.angle = 90;
		particleSystem.angleVar = 0;
		particleSystem.life = 10;
		particleSystem.lifeVar = 0;
		particleSystem.startSpin = 0;
		particleSystem.startSpinVar = 0;
		particleSystem.endSpin = 0;
		particleSystem.endSpinVar = 0;
		particleSystem.startColor = cc.color(128, 128, 128, 255);
		particleSystem.startColorVar = cc.color(128, 128, 128, 255);
		particleSystem.endColor = cc.color(128, 128, 128, 50);
		particleSystem.endColorVar = cc.color(26, 26, 26, 0);
		particleSystem.startSize = 32;
		particleSystem.startSizeVar = 0;
		particleSystem.endSize = cc.ParticleSystem.START_SIZE_EQUAL_TO_END_SIZE;
		particleSystem.emissionRate = particleSystem.totalParticles / particleSystem.life;
	}
});

var ParticleDemoLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		//烟花效果
//		var particleSystem = new cc.ParticleFireworks();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIREWORK);
		//火焰效果
		var particleSystem = new cc.ParticleFire();
		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIRE);
		//太阳效果
//		var particleSystem = new cc.ParticleSun();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIRE);
		//银河效果
//		var particleSystem = new cc.ParticleGalaxy();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIRE);
		//花效果
//		var particleSystem = new cc.ParticleFlower();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIREWORK);
		//雪花效果
//		var particleSystem = new cc.ParticleSnow();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_SNOW);
		//雨效果
//		var particleSystem = new cc.ParticleRain();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_SNOW);
		//流星效果
//		var particleSystem = new cc.ParticleMeteor();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIRE);
		//烟效果
//		var particleSystem = new cc.ParticleSmoke();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIRE);
		//螺旋效果
//		var particleSystem = new cc.ParticleSpiral();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_STAR);
		//爆炸效果
//		var particleSystem = new cc.ParticleExplosion();
//		particleSystem.texture = cc.textureCache.addImage(res.PARTICLE_FIREWORK);
		this.addChild(particleSystem);
		var size = cc.director.getWinSize();
		particleSystem.x = size.width / 2;
		particleSystem.y = size.height / 2;
	}
});

//加载第三方粒子编辑系统
var ParticleEditorLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var particleSystem = new cc.ParticleSystem(res.PARTICLE_PLIST);
		this.addChild(particleSystem);
		particleSystem.duration = 3;
		var size = cc.winSize;
		particleSystem.x = size.width/2;
		particleSystem.y = size.height/2;
		//粒子结束后需要回收移除
		particleSystem.setAutoRemoveOnFinish(true);
		//无限循环的需要手动移除
//		particleSystem.stopSystem();
//		this.removeChild(particleSystem);
	}
});

/******************************************************************************************/
//弹弹堂游戏
function trace() {
	cc.log(Array.prototype.join.call(arguments, ", "));
}

var GameLayer = cc.Layer.extend({
	mapPanel:null,
	ui:null,
	
	score:0,
	level:0,
	steps:0,
	limitStep:0,
	targetScore:0,
	map:null,
	
	/**
     * 糖果还在移动，不接受再次点击
     */
	moving:false,
	
    ctor:function() {
		this._super();
		var size = cc.winSize;
		var bg = new cc.Sprite("res/lolipop/bg.jpg");
		this.addChild(bg, 1);
		bg.x = size.width/2;
		bg.y = size.height/2;
		
		var clippingPanel = new cc.ClippingNode();
		this.addChild(clippingPanel, 2);
		this.mapPanel = new cc.Layer();
		this.mapPanel.x = (size.width - Constant.CANDY_WIDTH*Constant.MAP_SIZE)/2;
		this.mapPanel.y = (size.height - Constant.CANDY_WIDTH*Constant.MAP_SIZE)/2;
		clippingPanel.addChild(this.mapPanel, 1);
		
		var stencil = new cc.DrawNode();
		stencil.drawRect(cc.p(this.mapPanel.x, this.mapPanel.y), cc.p(this.mapPanel.x + Constant.CANDY_WIDTH * Constant.MAP_SIZE, 
			this.mapPanel.y + Constant.CANDY_WIDTH * Constant.MAP_SIZE), cc.color(0, 0, 0), 1, cc.color(0, 0, 0));
		clippingPanel.stencil = stencil;
		
		if ("touches" in cc.sys.capabilities) {
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: this._onTouchBegan.bind(this)
			}, this.mapPanel);
		} else {
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseDown: this._onMouseDown.bind(this)
			}, this.mapPanel);
		}
		
		this._init();
		
		this.ui = new GameUI(this);
		this.addChild(this.ui, 3);
		return true;
	},
	
	_init:function() {
		this.steps = 0;
		this.level = Storage.getCurrentLevel();
		this.score = Storage.getCurrentScore();
		this.limitStep = Constant.levels[this.level].limitStep;
		this.targetScore = Constant.levels[this.level].targetScore;
		
		this.map = [];
		for (var i = 0; i < Constant.MAP_SIZE; i++) {
			var column = [];
			for (var j = 0; j < Constant.MAP_SIZE; j++) {
				var candy = Candy.createRandomType(i, j);
				this.mapPanel.addChild(candy);
				candy.x = i * Constant.CANDY_WIDTH + Constant.CANDY_WIDTH/2;
				candy.y = j * Constant.CANDY_WIDTH + Constant.CANDY_WIDTH/2;
				column.push(candy);
			}
			this.map.push(column);
		}
	},
	
	_onTouchBegan:function(touch, event) {
		var column = Math.floor((touch.getLocation().x - this.mapPanel.x)/Constant.CANDY_WIDTH);
		var row = Math.floor((touch.getLocation().y - this.mapPanel.y)/Constant.CANDY_WIDTH);
		this._popCandy(column, row);
		return true;
	},
	
	_onMouseDown:function(event) {
		var column = Math.floor((event.getLocation().x - this.mapPanel.x)/Constant.CANDY_WIDTH);
		var row = Math.floor((event.getLocation().y - this.mapPanel.y)/Constant.CANDY_WIDTH);
		this._popCandy(column, row);
	},
	
	_popCandy:function(column, row) {
		if (this.moving) {
			return;
		}
		var joinCandys = [this.map[column][row]];
		var index = 0;
		var pushIntoCandys = function(element) {
			if (joinCandys.indexOf(element) < 0) {
				joinCandys.push(element);
			}
		};
		while (index < joinCandys.length) {
			var candy = joinCandys[index];
			if (this._checkCandyExist(candy.column-1, candy.row) && this.map[candy.column-1][candy.row].type == candy.type) {
				pushIntoCandys(this.map[candy.column-1][candy.row]);
			}
			if (this._checkCandyExist(candy.column+1, candy.row) && this.map[candy.column+1][candy.row].type == candy.type) {
				pushIntoCandys(this.map[candy.column+1][candy.row]);
			}
			if (this._checkCandyExist(candy.column, candy.row-1) && this.map[candy.column][candy.row-1].type == candy.type) {
				pushIntoCandys(this.map[candy.column][candy.row-1]);
			}
			if (this._checkCandyExist(candy.column, candy.row+1) && this.map[candy.column][candy.row+1].type == candy.type) {
				pushIntoCandys(this.map[candy.column][candy.row+1]);
			}
			index++;
		}
		if (joinCandys.length <= 2) {
			return;
		}
		this.steps++;
		this.moving = true;
		for (var i = 0; i < joinCandys.length; i++) {
			var candy = joinCandys[i];
			this.mapPanel.removeChild(candy);
			this.map[candy.column][candy.row] = null;
		}
		this.score += joinCandys.length * joinCandys.length;
		this._generateNewCandy();
		this._checkSucceedOrFail();
	},
	
	_checkCandyExist:function(i, j) {
		if (i >= 0 && i < Constant.MAP_SIZE && j >= 0 && j < Constant.MAP_SIZE) {
			return true;
		}
		return false;
	},
	
	_generateNewCandy:function() {
		var maxTime = 0;
		for (var i = 0; i < Constant.MAP_SIZE; i++) {			//deal each column
			var missCount = 0;
			for (var j = 0; j < this.map[i].length; j++) {
				var candy = this.map[i][j];
				if (!candy) {
					var candy = Candy.createRandomType(i, Constant.MAP_SIZE + missCount);
					this.mapPanel.addChild(candy);
					candy.x = candy.column * Constant.CANDY_WIDTH + Constant.CANDY_WIDTH/2;
					candy.y = candy.row * Constant.CANDY_WIDTH + Constant.CANDY_WIDTH/2;
					this.map[i][candy.row] = candy;
					missCount++;
				} else {
					var fallLength = missCount;
					if (fallLength > 0) {
						var duration = Math.sqrt(2 * fallLength / Constant.FALL_ACCELERATION);
						if (duration > maxTime) {
							maxTime = duration;
						}
						var move = cc.moveTo(duration, candy.x, candy.y - Constant.CANDY_WIDTH * fallLength).easing(cc.easeIn(2));    //easeIn参数是幂，以几次幂加速
						candy.runAction(move);
						candy.row -= fallLength;        //adjust all candy's row
						this.map[i][j] = null;
						this.map[i][candy.row] = candy;
					}
				}
			}
			//移除超出地图的临时元素位置
			for (var j = this.map[i].length; j >= Constant.MAP_SIZE; j--) {
				this.map[i].splice(j, 1);
			}
		}
		this.scheduleOnce(this._finishCandyFalls.bind(this), maxTime);
	},
	
	_finishCandyFalls:function() {
		this.moving = false;
	},
	
	_checkSucceedOrFail:function() {
		if (this.score > this.targetScore) {
			this.ui.showSuccess();
			this.score += (this.limitStep - this.steps) * 30;
			Storage.setCurrentLevel(this.level + 1);
			Storage.setCurrentScore(this.score);
			this.scheduleOnce(function() {
				cc.director.runScene(new GameScene());
			}, 3);
		} else if (this.steps >= this.limitStep) {
			this.ui.showFail();
			Storage.setCurrentLevel(0);
			Storage.setCurrentScore(0);
			this.scheduleOnce(function() {
				cc.director.runScene(new GameScene());
			}, 3);
		}
	}
});


/******************************************************************************************/

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new GameLayer();
        this.addChild(layer);
    }
});

