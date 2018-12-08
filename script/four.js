"use strict"
var ticTac = {
	currentPlayer: 1,
	initializeGame: function () {
		var tree = [
			[],
			[],
			[],
			[],
			[]
		];
		tree[0].push("0000")
		var startingLevel = 0;
		this.gameTree = tree;
		this.createGameTree(startingLevel, this.currentPlayer);
		// this.attachListener();
		this.createGameTreeValues();
		// this.searchCurrentGame();
		this.playGame();
	},
	createGameTree: function (level, currentPlayer) {
		for (var cont = 0; cont < this.gameTree[level].length; cont++) {
			for (var i = 0; i < 4; i++) {
				if (this.gameTree[level][cont][i] == 0) {
					var before = this.gameTree[level][cont].substr(0, i);
					var after = this.gameTree[level][cont].substr(i + 1);
					this.gameTree[level + 1].push(before + currentPlayer + after);
				}
			}
		}
		if (level++ < 3) {
			currentPlayer = (currentPlayer == 1 ? 2 : 1);
			this.createGameTree(level, currentPlayer);
		}
	},
	attachListener: function () {
		var thisObject = this;
		$(".game_container .game_cell").click(function () {
			thisObject.userMove.call(thisObject, $(this));
		});
	},
	getCurrentGameStatus: function () {
		var gameStatus = "";
		$(".game_container .game_cell").each(function () {
			if ($(this).find(".fa-times").length > 0) {
				//croce
				gameStatus = gameStatus.concat("1")
			} else if ($(this).find(".fa-circle").length > 0) {
				//cerchio
				gameStatus = gameStatus.concat("2")
			} else {
				//vuoto
				gameStatus = gameStatus.concat("0")
			}
		});
		console.log(gameStatus);
		return gameStatus;
	},
	searchCurrentGame: function () {
		var continueSearchInsideTree = true;
		var continueSearchGame = true;
		var currentGame = this.getCurrentGameStatus();
		var level = 0;
		while (continueSearchInsideTree) {
			var game = 0;
			while (continueSearchGame) {
				if (this.gameTree[level][game] == currentGame) {
					continueSearchGame = false;
					continueSearchInsideTree = false;
				} else {
					game++;
					if (game == this.gameTree[level].length) {
						continueSearchGame = false;
					}
				}
			}
			if (continueSearchInsideTree) {
				game = 0;
				level++;
				continueSearchGame = true;
			}
		}
		console.log("level: " + level + " game: " + game);
		var game = {
			level: level,
			game: game
		};
		return game;
	},
	createGameTreeValues: function () {
		var treeValues = [
			[],
			[],
			[],
			[],
			[]
		];
		var finalScoreStatus = this.gameTree[this.gameTree.length - 1];
		for (var i = 0; i < finalScoreStatus.length; i++) {
			treeValues[treeValues.length - 1].push(this.getFinalScore(finalScoreStatus[i]));
			treeValues[treeValues.length - 2].push(this.getFinalScore(finalScoreStatus[i]));
		}
		for (var i = treeValues.length - 2; i > 0; i--) {
			var branches = this.gameTree[i].length / this.gameTree[i - 1].length;
			var cont = 0;
			var score = 0;
			for (var z = 0; z < this.gameTree[i].length; z++) {
				score += treeValues[i][z];
				cont++;
				if (cont == branches) {
					treeValues[i - 1].push(score);
					cont = 0;
					score = 0;
				}
			}
		}
		this.treeValues = treeValues;
	},
	getFinalScore: function (gameStatus) {
		if (gameStatus[0] == 1 && gameStatus[3] == 1) {
			return 10;
		} else if (gameStatus[0] == 2 && gameStatus[3] == 2) {
			return -10;
		} else {
			return 0;
		}
	},
	playGame: function () {
		if (this.currentPlayer == 1) {
			//mossa cpu
			this.cpuMove();
		} else {
			//mossa giocatore
			this.attachListener();
			console.log("in attesa mossa giocatore");
		}
	},
	cpuMove: function () {
		console.log("mossa cpu");
		var branches = this.calculatePossibleMoves();
		if (branches.length > 1) {
			var gameToPlay = branches[this.getRandom(0, branches.length - 1)];
		} else {
			var gameToPlay = branches[0];
		}
		var cpuMove = this.gameTree[gameToPlay.level][gameToPlay.game];
		var currentGame = this.getCurrentGameStatus();
		var continueSearch = true;
		var i = 0;
		while (continueSearch) {
			if (cpuMove[i] != currentGame[i]) {
				continueSearch = false;
			}else{
				i++
			}
		}
		$(".game_container .game_cell").eq(i).html("<i class=\"fas fa-times\"></i>");
		this.checkForWinner();
	},
	calculatePossibleMoves: function () {
		var gameCoordinatesForTree = this.searchCurrentGame();
		var level = gameCoordinatesForTree.level;
		var possibleBranches = this.treeValues[level + 1].length / this.treeValues[level].length;
		var gameToStartFrom = gameCoordinatesForTree.game * possibleBranches;
		var winningMoves = [];
		var otherMoves = [];
		for (var cont = 1; cont <= possibleBranches; cont++) {
			var game = {
				level: level + 1,
				game: gameToStartFrom
			};
			if (this.treeValues[level + 1][gameToStartFrom] > 0) {
				winningMoves.push(game);
			} else if (this.treeValues[level + 1][gameToStartFrom] == 0) {
				otherMoves.push(game);
			}
			gameToStartFrom++;
		}
		if (winningMoves.length > 0) {
			return winningMoves;
		}
		return otherMoves;
	},
	userMove: function (element) {
		if (element.find("i").length == 0) {
			//rimuovo listener
			$(".game_container .game_cell").off();
			//aggiungo cerchio
			element.html("<i class=\"far fa-circle\"></i>");
			this.checkForWinner();
		}
	},
	checkForWinner: function () {
		var gameStatus = this.getCurrentGameStatus();
		if (gameStatus[0] == 1 && gameStatus[3] == 1) {
			//vince cpu
			console.log("vince cpu");
		} else if (gameStatus[0] == 2 && gameStatus[3] == 2) {
			//vince utente
			console.log("vince utente");
		} else if (gameStatus[0] != 0 && gameStatus[1] != 0 && gameStatus[2] != 0 && gameStatus[3] != 0) {
			//fine - patta
			console.log("patta");
		} else {
			//prossima mossa
			this.currentPlayer = (this.currentPlayer == 1 ? 2 : 1);
			this.playGame();
		}
	},
	getRandom: function getIntRandomNumber(min, max) {
		return Math.trunc(Math.random() * (max + 1 - min) + min);
	}
};

$(document).ready(function () {
	ticTac.initializeGame();
	// console.log(ticTac.gameTree);
});