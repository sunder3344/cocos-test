var SPRITE_WIDTH = 64;
var SPRITE_HEIGHT = 64;
var DEBUG_NODE_SHOW = false;

var HelloWorldLayer = cc.Layer.extend({
	i : 0,
	ball: null,
	_flag: 0,
	
    ctor:function () {
        this._super();
		
		/*this.initPhysics();
		this.scheduleUpdate();*/
		
		//弹射的小球
		this.ball = new cc.Sprite("res/cubes.jpg");
		var winSize = cc.director.getWinSize();
		this.ball.x = winSize.width / 2;
		this.ball.y = winSize.height / 4;
		this.addChild(this.ball);
		
		if ("touches" in cc.sys.capabilities) {
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ONE_BY_ONE,
				onTouchBegan: this._onMainTouchBegan.bind(this)
			}, this);
		} else {
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				onMouseDown: this._onMainMouseDown.bind(this),
				onMouseUp: this._onMainMouseUp.bind(this)
			}, this);
		}
		this.scheduleUpdate();

        return true;
    },
	
	//手指开始
	_onMainTouchBegan:function(touch, event) {
		var pos = touch.getLocation();
		cc.log(pos.x + "--" + pos.y);
		return true;
	},
	
	//鼠标开始
	_onMainMouseDown:function(event) {
		this._flag = 0;
		var pos = event.getLocation();
		var winSize = cc.director.getWinSize();
		var action = cc.jumpTo(0.25, cc.p(winSize.width/2, this.ball.y + 50), 50, 1);
		this.ball.runAction(action);
	},
	
	_onMainMouseUp:function() {
		this._flag = 1;
	},
	
	update:function() {
		if (this._flag == 1) {
			var winSize = cc.director.getWinSize();
			var action = cc.jumpTo(0.3, cc.p(winSize.width/2, this.ball.y - 3), -3, 1);
			this.ball.runAction(action);
		}
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
		this.scheduleUpdate();
    },
	
	update:function() {
		cc.log('asdf111');
	}
});

