// Import Stuff
import kaplay from "kaplay";
import "kaplay/global";

// Variables
const k = kaplay()
let rings = 0;
setGravity(2200);

// Woah
// Add a new variable for ground speed
let groundSpeed = 0;

// Define a maximum speed for Sonic
const topSpeed = 6; // or whatever value represents Sonic's top speed

// Unused Variables
// Need to be converted to the engine, these are the values from Sonic 1 (1991).
const acceleration_speed = 0.046875 //(12 subpixels)
const deceleration_speed = 0.5 // (128 subpixels)
const friction_speed = 0.046875 // (12 subpixels)

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

	// Finally time for some movement
	onUpdate(() => {
		// Apply friction when not pressing keys
		if (!onKeyDown("left") && !onKeyDown("right")) {
			if (groundSpeed > 0) {
				groundSpeed -= Math.min(groundSpeed, friction_speed);
				if (groundSpeed < 0) groundSpeed = 0;
			} else if (groundSpeed < 0) {
				groundSpeed += Math.min(-groundSpeed, friction_speed);
				if (groundSpeed > 0) groundSpeed = 0;
			}
		}
	
		// Handle right movement
		if (onKeyDown("right")) {
			if (groundSpeed < 0) {
				// Decelerate if changing direction
				groundSpeed += deceleration_speed;
				if (groundSpeed > 0) groundSpeed = 0.5; // Quirk
			} else {
				// Accelerate
				groundSpeed += acceleration_speed;
				if (groundSpeed > topSpeed) groundSpeed = topSpeed; // Limit max speed
			}
		}
	
		// Handle left movement
		if (onKeyDown("left")) {
			if (groundSpeed > 0) {
				// Decelerate if changing direction
				groundSpeed -= deceleration_speed;
				if (groundSpeed < 0) groundSpeed = -0.5; // Quirk
			} else {
				// Accelerate
				groundSpeed -= acceleration_speed;
				if (groundSpeed < -topSpeed) groundSpeed = -topSpeed; // Limit max speed
			}
		}
	
		// Move Sonic based on ground speed
		sonic.move(groundSpeed, 0);
	});


	

	const scoreLabel = add([text("Rings: " + rings), pos(24, 24)]);

	// Old example code.
	//Score
	// increment score every frame
	//onUpdate(() => {
    //	score++;
    //	scoreLabel.text = score;
	//});
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