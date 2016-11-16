var SPRITE_WIDTH = 64;
var SPRITE_HEIGHT = 64;
var DEBUG_NODE_SHOW = false;
var _ball = null;

var HelloWorldLayer = cc.Layer.extend({
	i : 0,
	ball: null,
	_flag: 0,
	
    ctor:function () {
        this._super();
		
		/*this.initPhysics();
		this.scheduleUpdate();*/
		
		//弹射的小球
		_ball = new cc.Sprite("res/cubes.jpg");
		var winSize = cc.director.getWinSize();
		_ball.x = winSize.width / 2;
		_ball.y = winSize.height / 4;
		this.addChild(_ball);
		
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
		var action = cc.jumpTo(0.25, cc.p(winSize.width/2, _ball.y + 150), 50, 1);
		_ball.runAction(action);
	},
	
	_onMainMouseUp:function() {
		this._flag = 1;
	},
	
	update:function() {
		if (this._flag == 1) {
			var winSize = cc.director.getWinSize();
			var action = cc.jumpTo(0.3, cc.p(winSize.width/2, _ball.y - 8), -8, 1);
			_ball.runAction(action);
		}
	}
});

var HelloWorldScene = cc.Scene.extend({
	layer: null,
    onEnter:function () {
        this._super();
        this.layer = new HelloWorldLayer();
        this.addChild(this.layer);
		this.scheduleUpdate();
    },
	
	update:function() {
		var winSize = cc.director.getWinSize();
		if (_ball.y <= 0-_ball.height) {
			cc.log("fail");
		}
		if (_ball.y >= this.layer.height) {
			cc.log("success");
		}
	}
});

