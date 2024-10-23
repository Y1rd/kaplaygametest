// Import Stuff
import kaplay from "kaplay";
import "kaplay/global";

// Variables
const k = kaplay()
let score = 0;

// Load the sonic sprite and summon it in the game.
scene("game", () => {
	// Load sonic guy
	loadSprite("sonic", "sprites/sonic.png");

	// Load... sonic?
	loadSprite("player", "sprites/sonic1basicsprites.png", {
		sliceX: 7, // how many sprites are in the X axis
		sliceY: 5, // how many sprites are in the Y axis
		anims: {
			idle: { from: 0, to: 0, loop: false },
			jump: { from: 19, to: 23, loop: true },
		},
	});

	score = 0;
	const sonic = k.add([
		k.pos(120, 80),
		k.sprite("player", {anim: "idle",}),
		k.area({scale: 1}),
		k.body(),
		k.scale(3),
	])

	// background
	k.setBackground(52, 83, 207)
	
	// add platform
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
		}
		sonicGrounded()
	});
	
	function sonicGrounded() {
		sonic.onGround(() => {
			sonic.play("idle");
		});
	}

	// add tree
	function spawnTree() {
		add([
			rect(48, rand(24, 64)),
			area(),
			outline(4),
			pos(width(), height() - 48),
			anchor("botleft"),
			color(255, 180, 255),
			move(LEFT, 240),
			"tree", // add a tag here
			k.offscreen({ destroy: true }),
		]);
		wait(rand(0.5, 1.5), () => {
			spawnTree();
		});
	}
	
	//Score
	// increment score every frame
	const scoreLabel = add([text(score), pos(24, 24)]);
	//onUpdate(() => {
    //	score++;
    //	scoreLabel.text = score;
	//});

	sonic.onCollide("tree", () => {
		addKaboom(sonic.pos);
		shake();
		go("lose")
	});
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

setGravity(1600);