// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

// Additional variables
var score = 0;
var label_score;
var player;
var pipes;
var pipe_speed = -200;


/*
 * Loads all resources for the game and gives them names.
 */
function preload() {
    game.load.image("player", "assets/jamesBond.gif");
    game.load.image("pipe","assets/pipe.png");
    game.load.audio("score", "assets/point.ogg");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    // Set the background colour.
    game.stage.setBackgroundColor("#800000");

    // Create objects.
    player = game.add.sprite(40, 200, "player");
    pipes = game.add.group();

    // Register handlers.
    game.input.keyboard.addKey(
        Phaser.Keyboard.SPACEBAR).onDown.add(jump);
    label_score = game.add.text(20, 20, score.toString());

    // Set up physics.
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.gravity.y = 100;

    // Generate pipes regularly.
    game.time.events.loop(
        1.75 * Phaser.Timer.SECOND,
        makePipe);
}

/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    // Terminate the game when the player hits the pipes.
    game.physics.arcade.overlap(player, pipes, endGame);
}

function jump() {
    player.body.velocity.y = -100;
}

function increaseScore() {
    score += 1;
    label_score.setText(score.toString());

    // Increase difficulty.
    pipe_speed -= 1;
    if (score % 5 == 0) {
        player.body.gravity.y += 10;
    }
}

function addPipeBlock(x, y) {
    var pipe = pipes.create(x, y, "pipe");
    game.physics.arcade.enable(pipe);
    pipe.body.velocity.x = pipe_speed;
}

function makePipe() {
    var gap_start = game.rnd.integerInRange(1, 4);
    for (var i = 0; i < 8; i++) {
        if (i < gap_start || i > gap_start + 2) {
            addPipeBlock(740, i * 50);
        }
    }

    // Increase the score each time a new pipe is introduced.
    increaseScore();
}

function endGame() {
    game.add.text(200, 300, "Game Over!", {font: "30px Arial", fill: "#FFFFFF"});
    game.destroy();
}