/* Globals
*
*/

var tiles;
var timer;

// Stats
var wrong;
var matches;
var remaining;

$(function(){
    startTimer();
    initialiseTiles();
    setUpGame();
    
    $('#start-game').click(function() {
       setUpGame();
       startTimer();
    });

    
    $('#game-board img').click(function() {
        var clickedImg = $(this);
        var tile = clickedImg.data('tile'); 
        if (tile.flipped) {
            return;
        } else {
            flipTile(tile, clickedImg);
        }
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
    //row.addClass('flip-container');
    _.forEach(tilePairs, function(tile, idx){
        if ((idx % 4) == 0) {
            // Every 4 tiles create new row
            gameBoard.append(row);
            row = $(document.createElement('div'));
            //row.addClass('flip-container');
        }
        
        var flipContainer = $(document.createElement('span'));
        flipContainer.addClass('flip-container');

        var flipperDiv = $(document.createElement('span'));
        flipperDiv.addClass('flipper');
        flipperDiv.addEventListener('click', function(){
                   $(this).toggleClass("flipped"); }, false);

        var frontDiv = $(document.createElement('span'));
        frontDiv.addClass('front');
        
        var frontImg = $(document.createElement('img'));
        frontImg.attr({
           src: 'img/tile-back.png',
           alt: 'placeholder'
        });

        frontImg.appendTo(frontDiv);

        var backDiv = $(document.createElement('span'));
        backDiv.addClass('back');
        
        var backImg = $(document.createElement('img'));
        backImg.attr({
           src: 'img/tile' + tile.tileNum + '.jpg',
           alt: 'tile ' + tile.tileNum
        });
        backImg.data('tile', tile);
        
        backImg.appendTo(backDiv);

        frontDiv.appendTo(flipperDiv);
        backDiv.appendTo(flipperDiv);
        
        flipperDiv.appendTo(flipContainer);
        
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