var SPRITE_WIDTH = 64;
var SPRITE_HEIGHT = 64;
var DEBUG_NODE_SHOW = false;

var HelloWorldLayer = cc.Layer.extend({
    space: null,
	i : 0,
	
    ctor:function () {
        this._super();
		
		this.initPhysics();
		this.scheduleUpdate();

        return true;
    },
	
	initPhysics:function() {
		var winSize = cc.director.getWinSize();
		this.space = new cp.Space();
		this.setupDebugNode();
		//设置重力
		this.space.gravity = cp.v(0, -1000);
		var staticBody = this.space.staticBody;
		
		//设置空间边界
		var walls = [new cp.SegmentShape(staticBody, cp.v(0, 0),
										cp.v(winSize.width/2, 0), 0),
					 new cp.SegmentShape(staticBody, cp.v(0, winSize.height),
										cp.v(winSize.width, winSize.height), 0),
					 new cp.SegmentShape(staticBody, cp.v(0, 0),
										cp.v(0, winSize.height), 0),
					 new cp.SegmentShape(staticBody, cp.v(winSize.width, 0),
										cp.v(winSize.width, winSize.height), 0)
					];
		for (var i = 0; i < walls.length; i++) {
			var shape = walls[i];
			shape.setElasticity(1);
			shape.setFriction(1);
			shape.collision_type = i;
			this.space.addStaticShape(shape);
		}
	},
	
	addNewSpriteAtPosition:function(p) {
		//cc.log("addNewSpriteAtPosition");
		var body = new cp.Body(1, cp.momentForBox(1, SPRITE_WIDTH, SPRITE_HEIGHT));
		body.setPos(p);
		this.space.addBody(body);
		
		var shape = new cp.BoxShape(body, SPRITE_WIDTH, SPRITE_HEIGHT);
		shape.setElasticity(0.5);
		shape.setFriction(0.5);
		shape.collision_type = ++this.i;
		this.space.addShape(shape);
		
		//创建物理引擎精灵对象
		var sprite = new cc.PhysicsSprite("res/cubes.jpg");
		sprite.setBody(body);
		sprite.setPosition(cc.p(p.x, p.y));
		this.addChild(sprite);
	},
	
	update:function() {
		var timeStep = 0.03;
		this.space.step(timeStep);
	},
	
	setupDebugNode:function() {
		this._debugNode = new cc.PhysicsDebugNode(this.space);
		this._debugNode.visible = DEBUG_NODE_SHOW;
		this.addChild(this._debugNode);
	},
	
	onEnter:function() {
		this._super();
		cc.sys.dumpRoot();
        cc.sys.garbageCollect();
		//cc.log("onEnter");
		cc.eventManager.addListener({
			event: cc.EventListener.TOUCH_ONE_BY_ONE,
			onTouchBegan: this.onTouchBegan
		}, this);
		
		//添加碰撞检测事件
		//系统默认碰撞检测
		/*this.space.setDefaultCollisionHandler(
            this.collisionBegin.bind(this),
            this.collisionPre.bind(this),
            this.collisionPost.bind(this),
            this.collisionSeparate.bind(this)
        );*/
		//important！如果有很多物体，此处需要遍历
		// 1 & 2 检测box和上下BLOCK碰撞
		this.space.addCollisionHandler(0, 1, 
			this.collisionBegin.bind(this),
			this.collisionPre.bind(this),
			this.collisionPost.bind(this),
			this.collisionSeparate.bind(this)
		);
		
		// 1 & 3 检测box和左右边界碰撞
		this.space.addCollisionHandler(1, 2,
			this.collisionBegin.bind(this),
			this.collisionPre.bind(this),
			this.collisionPost.bind(this),
			this.collisionSeparate.bind(this)
		);
	},
	
	//碰撞检测
	collisionBegin:function(arbiter, space) {
		//cc.log("collision began");
		var shapes = arbiter.getShapes();
		var shapeA = shapes[0];
		var shapeB = shapes[1];
		var collTypeA = shapeA.collision_type;
		var collTypeB = shapeB.collision_type;
		
		cc.log(collTypeA);
		cc.log(collTypeB);
		return true;
	},
	
	collisionPre:function(arbiter, space) {
		//cc.log("collision Pre");
		return true;
	},
	
	collisionPost:function(arbiter, space) {
		//cc.log("collision post");
	},
	
	collisionSeparate:function(arbiter, space) {
		//cc.log("collision seperate");
	},
	
	onTouchBegan:function(touch, event) {
		//cc.log("onTouchBegan");
		var target = event.getCurrentTarget();
		var location = touch.getLocation();
		target.addNewSpriteAtPosition(location);
		return false;
	},
	
	onExit:function() {
		this._super();
		//cc.log("onExit");
		cc.eventManager.removeListener(cc.EventListener.TOUCH_ONE_BY_ONE);
	}
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        var layer = new HelloWorldLayer();
        this.addChild(layer);
    }
});

