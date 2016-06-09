var numRows = 3;
var filledSpaces = 0;

var winConditions = getWinConditions();

function Player(nm,m) {
	this.name = nm;
	this.marker = m;
	this.pieces = [];
}

var Player1 = new Player("Player 1","X");
var Player2 = new Player("Player 2","O");
var currentPlayer = Player1;



$(document).ready(function(){

	createGameBoard();
	setBoxBorders();

	$('#number-rows-button').on('click', function (e) {
		numRows = $('#number-rows-input').val();
		resetGame();
	});

	$('#change-player-one-name-button').on('click', function (e) {
		Player1.name = $('#change-player-one-name-input').val();
		$('#message-area').text(currentPlayer.name + "'s Turn!");
	});

	$('#change-player-two-name-button').on('click', function (e) {
		Player2.name = $('#change-player-two-name-input').val();
		$('#message-area').text(currentPlayer.name + "'s Turn!");
	});

});




function getWinConditions() {
	winConditions = [];
	let wIndex = 0;
	let arrayToAdd = [];

	for (let i = 0; i < numRows; i++){
		for (let j = 0; j < numRows; j++){
			arrayToAdd.push(getCellNumber(i,j));
		}
		winConditions[wIndex] = arrayToAdd;
		wIndex++;
		arrayToAdd = [];
	}

	for (let i = 0; i < numRows; i++){
		for (let j = 0; j < numRows; j++){
			arrayToAdd.push(getCellNumber(j,i));
			winConditions[wIndex]=[];
		}
		winConditions[wIndex] = arrayToAdd;
		wIndex++;
		arrayToAdd = [];
	}

	for (let m = 1; m <= (numRows * numRows); m += parseInt(numRows) + 1){
		arrayToAdd.push(m);
	}
	winConditions[wIndex] = arrayToAdd;
	wIndex++;
	arrayToAdd = [];

	for (let m = parseInt(numRows); m <= numRows * (numRows-1) + 1 ; m += numRows - 1){
		arrayToAdd.push(m);
	}
	winConditions[wIndex]=arrayToAdd;
	return winConditions;
}

function createGameBoard(){
	$('#game-area').empty();
	let gameBoard = $('<table>').attr('id','game-board');
	for (let i = 0; i < numRows; i++) {
		var rowToAdd = $('<tr>');
		for (let j = 0; j < numRows; j++) {
			rowToAdd.append( $('<td>').addClass("box") )
		}
		gameBoard.append(rowToAdd);
	}
	$('#game-area').append(gameBoard);

	getWinConditions();
	$('.box').on('click', playerTurn);
}



function setBoxBorders(){
	$('.box').removeClass("vertical-border");
	$('.box').removeClass("horizontal-border");

	$('.box').each( function(ind,ent){
		if (ent.cellIndex > 0 && ent.cellIndex < numRows - 1)
			$(ent).addClass("vertical-border");
		if (ent.parentNode.rowIndex > 0 && ent.parentNode.rowIndex < numRows - 1)
			$(ent).addClass("horizontal-border");
	});
}

function checkGameEnd(){
	console.log(filledSpaces);
	console.log(numRows * numRows);
	
	if (filledSpaces == numRows * numRows){
		return 2;
	}
	for (var i in winConditions){
		if ( winConditions[i].every(matchesWinConditions) ) {
			return 1;
		}
	}
	return 0;

	function matchesWinConditions(ent){
		return (currentPlayer.pieces.indexOf(ent) >= 0) ? true : false;
	}
}

function endGame(flag) {
	$('#reset-button').css('display','block');
	$('#reset-button').on('click', resetGame);;
	if (flag == 1){ // someone won
		$('#message-area').text(currentPlayer.name + " Wins!");
	}
	else { // it was a tie
		$('#message-area').text("It's a tie!");
	}
}

function resetGame(){
	filledSpaces = 0
	currentPlayer = (Math.floor(Math.random()*2) == 0)? Player1 : Player2;
	createGameBoard();
	setBoxBorders();
	$('#message-area').text(currentPlayer.name + "'s Turn!");
	$('#reset-button').css('display','none');
	$('.box').text("");
	Player1.pieces = [];
	Player2.pieces = [];
	$(".box").css("pointer-events", "auto"); 
}

function getCellNumber(col,row){
	return (col + 1) + (row) * (numRows);
}

function playerTurn(e) {
	if ( !$(e.target).text() ) {

		currentPlayer.pieces.push(getCellNumber(e.target.cellIndex, e.target.parentNode.rowIndex));

		var playerMarker = $('<div>').text(currentPlayer.marker);
		playerMarker.hide().appendTo(e.target).fadeIn();
		filledSpaces++;
		let gameEndFlag = checkGameEnd();

		if(gameEndFlag == 1){
			$(".box").css("pointer-events", "none");
			endGame(1);
		}
		else if(gameEndFlag == 2){
			$(".box").css("pointer-events", "none");
			endGame(2);
		}
		else {
			currentPlayer = (currentPlayer == Player1)? Player2 : Player1;
			$('#message-area').text(currentPlayer.name + "'s Turn!");
		}
	}
}




