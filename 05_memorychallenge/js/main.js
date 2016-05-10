/* Globals
*
*/

var tiles;

// Stats
var wrong;
var matches;
var remaining;

$(function(){
    startTimer();
    initialiseTiles();
    setUpGame();
});

/* 
* Starts the elapsed time timer
*/
function startTimer() {
    var startTime = Date.now();
    var timer = window.setInterval(function() {
        var secondsElapsed = Math.floor((Date.now() - startTime) / 1000);
        $('#elapsed-seconds').text(secondsElapsed + ' seconds');
    }, 1000);
}

/*
* Initial set up
*/

function initialiseTiles() {
    // Initialise the tiles
    var numTiles = 32;
    tiles = [];  // Array of tile objects
    
    for (var i=0; i <= 32; i++) {
        tiles.push({
            tileNum: i,
            src: 'img/tile' + i + '.jpg',
            flipped: false,
            matched: false
        });
    }
}

/* 
* Statistics
*/ 
function resetStats() {
    wrong = 0;
    matches = 0;
    remaining = 8;
}


/*
* Sets up and displays game board
*/

function setUpGame() {
    resetStats();
    
    tiles = _.shuffle(tiles);
    
    // Get pairs of tiles
    var selectedTiles = tiles.slice(0, 8);
    var selectedTilesClone = _.clone(selectedTiles);
    var tilePairs = _.concat(selectedTiles, selectedTilesClone);
    tilePairs = _.shuffle(tilePairs);
    
    drawGame(tilePairs);
    
}

/* 
* Draws the game board 
*/
function drawGame(tilePairs) {
    var gameBoard = $('#game-board');
    gameBoard.empty();
    
    var row = $(document.createElement('div'));
    _.forEach(tilePairs, function(tile, idx){
        if ((idx % 4) == 0) {
            // Every 4 tiles create new row
            gameBoard.append(row);
            row = $(document.createElement('div'));
        }
        
        // Create tile images
        var img = $(document.createElement('img'));
        img.attr({
           src: 'img/tile-back.png',
           alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
    });
    
    gameBoard.append(row);
}