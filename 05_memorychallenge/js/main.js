/* Globals
*
*/

var tiles;
var tilePairs;
var timer;

// Stats
var wrong;
var matches;
var remaining;
var matchingInProgress = false;

$(function(){
    startTimer();
    initialiseTiles();
    setUpGame();
    
    $('#start-game').click(function() {
       setUpGame();
       startTimer();
    });
    
    console.log(tilePairs);
    
    $('#game-board img').click(function() {
        var clickedImg = $(this);
        var parent = clickedImg.parent().parent();
        var parentNodes = parent.get(0);
        var imgName = $('img', parentNodes)[1].getAttribute("src");
        
        // Find image and check if has class flipped
        
        //var imgNum = String(imgName).match(/\d+/)[0];
        
        //console.log(imgName + " " + imgNum);
        parent.toggleClass('flipped');
    });
});

/* 
* Starts the elapsed time timer
*/
function startTimer() {
    clearInterval(timer);
    var startTime = Date.now();
    timer = window.setInterval(function() {
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
    
    for (var i=1; i <= 32; i++) {
        tiles.push({
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
    matchingInProgress = false;
}

/* 
* Display statistics 
*/ 

function displayStats() {
    $('#matches').text(matches);
    $('#remaining').text(remaining);
    $('#wrong').text(wrong);
}

/*
* Sets up and displays game board
*/

function setUpGame() {
    resetStats();
    displayStats();
    
    tiles = _.shuffle(tiles);
    
    // Get pairs of tiles
    var selectedTiles = tiles.slice(0, 8);
    var selectedTilesClone = _.clone(selectedTiles);
    tilePairs = _.concat(selectedTiles, selectedTilesClone);
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
    row.addClass('row');
    _.forEach(tilePairs, function(tile, idx){
        if ((idx % 4) == 0) {
            // Every 4 tiles create new row
            gameBoard.append(row);
            row = $(document.createElement('div'));
            row.addClass('row');
        }
        
        var flipContainer = '<div class="flip-container">' +
                //'<div class="flipper" onclick="this.classList.toggle(\'flipped\')">' +
                '<div class="flipper">' +
                '<div class="front"><img src="img/tile-back.png"/>' +
                '</div>' + '<div class="back"><img src="' + tile.src + '"/>' +
                '</div></div></div>'
        
        row.append(flipContainer);

        /* 
        // Simple image appending
        var img = $(document.createElement('img'));
        img.attr({
           src: 'img/tile-back.png',
           alt: 'tile ' + tile.tileNum
        });
        img.data('tile', tile);
        row.append(img);
        */
    });
    
    gameBoard.append(row);
}

/*
* Flips the tile 
*/
function flipTile(tile, img) {
    
}