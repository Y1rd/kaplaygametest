// Import Stuff
import kaplay from "kaplay";
import "kaplay/global";

// Variables
const k = kaplay()
let score = 0;

// Load the bean sprite and summon it in the game.
scene("game", () => {
	loadSprite("bean", "sprites/bean.png");
	score = 0;
	const bean = k.add([
		k.pos(120, 80),
		k.sprite("bean"),
		k.area(),
		k.body()
	])
	
	// add platform
	add([
		rect(width(), 48),
		pos(0, height() - 48),
		outline(4),
		area(),
		body({ isStatic: true }),
		color(127, 200, 255),
	]);
	
	// Jumping
	onKeyPress("space", () => {
		if (bean.isGrounded()) {
			bean.jump();
		}
	});
	
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
	onUpdate(() => {
    	score++;
    	scoreLabel.text = score;
	});

	bean.onCollide("tree", () => {
		addKaboom(bean.pos);
		shake();
		go("lose")
	});
	spawnTree()
});

scene("lose", () => {
	loadSprite("bean", "sprites/bean.png");
	add([
        sprite("bean"),
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