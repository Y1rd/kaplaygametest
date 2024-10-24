// Import Stuff
import kaplay from "kaplay";
import "kaplay/global";

// Variables
const k = kaplay()
let rings = 0;
setGravity(2200);

// Basic playground to test physics and all
scene("game", () => {
	// Variables
	rings = 0;
	k.setBackground(52, 83, 207);

	// Sonic + Animations
	k.loadSprite("player", "sprites/sonic1basicsprites.png", {
		sliceX: 7,
		sliceY: 5,
		anims: {
			idle: { from: 0, to: 0, loop: false },
			roll: { from: 19, to: 23, loop: true },
			jump: { from: 19, to: 23, loop: true, speed: 14},
			boredstart: { from: 1, to: 2, loop: false},
			boredloop: { from: 3, to: 4, loop: true},
			lookup: { from: 5, to: 5, loop: false},
			lookdown: { from: 6, to: 6, loop: false},
			walk: { from: 7, to: 12, loop: true},
			stop: { from: 13, to: 14, loop: true},
			run: { from: 15, to: 18, loop: true}
		},
	});

	// Player Object
	const sonic = k.add([
		k.pos(120, 80),
		k.sprite("player", {anim: "idle",}),
		k.area({scale: 1}),
		k.body({jumpForce: 1200}),
		k.scale(3),
	])
	
	// Ground
	add([
		rect(width(), 48),
		pos(0, height() - 48),
		outline(4),
		area(),
		body({ isStatic: true }),
		color(127, 200, 255),
		layer(),
	]);
	
	// Jumping
	onKeyPress("space", () => {
		if (sonic.isGrounded()) {
			sonic.jump();
			sonic.play("jump");
			// Hitbox becomes smaller when in ball form, so I'm gonna do this for now
			sonic.area.scale = vec2(0.93);
		}
		sonicGrounded()
	});

	// Prevent the spinning animation from always happening
	function sonicGrounded() {
		sonic.onGround(() => {
			sonic.play("idle");
			sonic.area.scale = vec2(1);
		});
	}

	const scoreLabel = add([text("Rings: " + rings), pos(24, 24)]);

	// Old example code.
	// add tree
	//function spawnTree() {
	//	add([
	//		rect(48, rand(24, 64)),
	//		area(),
	//		outline(4),
	//		pos(width(), height() - 48),
	//		anchor("botleft"),
	//		color(255, 180, 255),
	//		move(LEFT, 240),
	//		"tree", // add a tag here
	//		k.offscreen({ destroy: true }),
	//	]);
	//	wait(rand(0.5, 1.5), () => {
	//		spawnTree();
	//	});
	//}

	//Score
	// increment score every frame
	//onUpdate(() => {
    //	score++;
    //	scoreLabel.text = score;
	//});

	//sonic.onCollide("tree", () => {
	//	addKaboom(sonic.pos);
	//	shake();
	//	go("lose")
	//});
	//spawnTree()
});

scene("lose", () => {
	loadSprite("sonic", "sprites/sonic.png");
	add([
        sprite("sonic"),
        pos(width() / 2, height() / 2 - 80),
        scale(2),
        anchor("center"),
    ]);

    // display score
    add([
        text(score),
        pos(width() / 2, height() / 2 + 80),
        scale(2),
        anchor("center"),
    ]);

    // go back to game with space is pressed
    onKeyPress("space", () => go("game"));
    onClick(() => go("game"));
});

go("game");