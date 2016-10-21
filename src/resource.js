var res = {
    HelloWorlds_png : "res/HelloWorld.png",
    BALL_JPG : "res/ball.jpg",
    BALL2_JPG : "res/ball2.jpg",
    BALL3_JPG : "res/ball3.jpg",
	HelloWorld_png : "res/demo/HelloWorld.png",
	MainScene_json : "res/demo/MainScene.json",
	TEST_PLIST : "res/test.plist",
	TEST_PNG : "res/test.png",
	GROSSINI_PNG : "res/grossini-generic.plist",
	ARMATURE_JSON : "res/testAnimate/myAnimation.ExportJson",
	ARMATURE_PLIST : "res/testAnimate/animated-grossini.plist",
	ARMETURE_PNG : "res/testAnimate/animated-grossini.png",
	HERO_JSON : "res/hero/Hero.ExportJson",
	HERO_PLIST : "res/hero/Hero0.plist",
	HERO_BLOOD_PLIST : "res/hero/blood.plist",
	HERO_PNG : "res/hero/Hero0.png",
	FIREMAN_JSON : "res/fireman/Demon.ExportJson",
	FIREMAN_PLIST : "res/fireman/Demon0.plist",
	FIREMAN_PNG : "res/fireman/Demon0.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
