"use strict"
var ticTac = {
	firstPlayerCPU: false,
	secondPlayerCPU: true,
	startingPlayer: 1,
	initializeGame: function () {
		// albero delle combinazioni vuoto
		var tree1 = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var tree2 = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
		// var tree1 = [
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[]
		// ];
		// var tree2 = [
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[]
		// ];
		// situazione iniziale - penso sia il metodo più veloce per avere 2 array di oggetti
		// anziché creare un metodo che faccia un deep shallow copy di un array template
		tree1[0].push("00000");
		tree2[0].push("00000");
		// tree1[0].push("000000000");
		// tree2[0].push("000000000");
		this.currentPlayer = this.startingPlayer;
		var startingLevel = 0;
		// alberi dei giochi per le due mosse iniziali
		this.gameTreeFirstPlayer = tree1;
		this.gameTreeSecondPlayer = tree2;
		this.createGameTree(startingLevel, this.startingPlayer, this.gameTreeFirstPlayer);
		this.createGameTree(startingLevel, (this.startingPlayer == 1 ? 2 : 1), this.gameTreeSecondPlayer);
		// alberi dei valori per le due mosse iniziali
		this.gameTreeValuesFirstPlayer = this.createGameTreeValues2(this.gameTreeFirstPlayer, 1);
		this.gameTreeValuesSecondPlayer = this.createGameTreeValues2(this.gameTreeSecondPlayer, 2);
		// console.log(this.gameTreeFirstPlayer);
		// console.log(this.gameTreeValuesFirstPlayer);
		// this.playGame();
		console.log("search");
		console.log(this.searchCurrentGame(this.gameTreeFirstPlayer));
	},
	// metodo che crea albero di gioco per tutte le possibili mosse
	// in base al giocatore che muove e al livello di partenza
	createGameTree: function (level, currentPlayer, currentGameTree) {
		for (var cont = 0; cont < currentGameTree[level].length; cont++) {
			for (var i = 0; i < currentGameTree.length - 1; i++) {
				if (currentGameTree[level][cont][i] == 0) {
					var before = currentGameTree[level][cont].substr(0, i);
					var after = currentGameTree[level][cont].substr(i + 1);
					currentGameTree[level + 1].push(before + currentPlayer + after);
				}
			}
		}
		if (level++ < currentGameTree.length - 2) {
			currentPlayer = (currentPlayer == 1 ? 2 : 1);
			this.createGameTree(level, currentPlayer, currentGameTree);
		}
	},
	// metodo che collega il listener per il click dell'utente nella scacchiera
	attachListener: function () {
		var thisObject = this;
		$(".game_container .game_cell").click(function () {
			thisObject.userMove.call(thisObject, $(this));
		});
	},
	//metodo che ritorna un nuovo oggetto game dai valori passati
	getGameObject: function (game, level) {
		var game = {
			level: level,
			game: game
		};
		return game;
	},
	// metodo che ritorna lo stato corrente della scacchiera nella forma 00010200
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
		return gameStatus;
	},
	// metodo che ritorna un oggetto coordinate gioco nella forma sotto livello albero e n. gioco dallo
	// stato corrente della scacchiera
	searchCurrentGame: function (gameTree) {
		var continueSearchInsideTree = true;
		var continueSearchGame = true;
		var currentGame = "10210";
		// var currentGame = this.getCurrentGameStatus();
		var level = 0;
		while (continueSearchInsideTree) {
			var game = 0;
			while (continueSearchGame) {
				if (gameTree[level][game] == currentGame) {
					continueSearchGame = false;
					continueSearchInsideTree = false;
				} else {
					game++;
					if (game == gameTree[level].length) {
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
		return this.getGameObject(game, level)
	},
	createGameTreeValues: function (gameTree, player) {
		// var treeValues = [
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[]
		// ];
		var treeValues = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var finalScoreStatus = gameTree[gameTree.length - 1];
		for (var i = 0; i < finalScoreStatus.length; i++) {
			treeValues[treeValues.length - 1].push(this.getFinalScore(finalScoreStatus[i], player));
			treeValues[treeValues.length - 2].push(this.getFinalScore(finalScoreStatus[i], player));
		}
		for (var i = treeValues.length - 2; i > 0; i--) {
			var branches = gameTree[i].length / gameTree[i - 1].length;
			var cont = 0;
			var score = 0;
			for (var z = 0; z < gameTree[i].length; z++) {
				score += treeValues[i][z];
				cont++;
				if (cont == branches) {
					treeValues[i - 1].push(score);
					cont = 0;
					score = 0;
				}
			}
		}
		return treeValues;
	},
	createGameTreeValues2: function (gameTree, player) {
		// var treeValues = [
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[],
		// 	[]
		// ];
		var treeValues = [
			[],
			[],
			[],
			[],
			[],
			[]
		];
		var finalScoreStatus = gameTree[gameTree.length - 1];
		for (var level = 0; level < finalScoreStatus.length; level++) {
			treeValues[treeValues.length - 1].push(this.getFinalScore(finalScoreStatus[level], player));
			treeValues[treeValues.length - 2].push(this.getFinalScore(finalScoreStatus[level], player));
		}
		for (var level = treeValues.length - 2; level > 0; level--) {
			var branches = gameTree[level].length / gameTree[level - 1].length;
			var cont = 0;
			var bestChoice = treeValues[level][0];
			for (var game = 0; game < gameTree[level].length; game++) {
				var miao = treeValues[level][game];
				if (level % 2 == 0) {
					//massimizzare
					bestChoice = (treeValues[level][game] > bestChoice ? treeValues[level][game] : bestChoice);
				} else {
					//minimizzare
					bestChoice = (treeValues[level][game] < bestChoice ? treeValues[level][game] : bestChoice);
				}
				cont++;
				if (cont == branches) {
					treeValues[level - 1].push(bestChoice);
					cont = 0;
					bestChoice = treeValues[level][game+1];
				}
			}
		}
		return treeValues;
	},
	getFinalScore: function (gameStatus, player) {
		if (this.checkWinForAPlayer4(player, gameStatus)) {
			return 10;
		} else if (this.checkWinForAPlayer4((player == 1 ? 2 : 1), gameStatus)) {
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
		var gameTree = (this.startingPlayer == 1 ? this.gameTreeFirstPlayer : this.gameTreeSecondPlayer);
		var cpuMove = gameTree[gameToPlay.level][gameToPlay.game];
		var currentGame = this.getCurrentGameStatus();
		var continueSearch = true;
		var i = 0;
		while (continueSearch) {
			if (cpuMove[i] != currentGame[i]) {
				continueSearch = false;
			} else {
				i++
			}
		}
		$(".game_container .game_cell").eq(i).html("<i class=\"fas fa-times\"></i>");
		this.checkForWinner();
	},
	calculatePossibleMoves: function () {
		var gameCoordinatesForTree = this.searchCurrentGame((this.startingPlayer == 1 ? this.gameTreeFirstPlayer : this.gameTreeSecondPlayer));
		var level = gameCoordinatesForTree.level;
		var treeValues = this.startingPlayer == 1 ? this.gameTreeValuesFirstPlayer : this.gameTreeValuesSecondPlayer;
		var possibleBranches = treeValues[level + 1].length / treeValues[level].length;
		var gameToStartFrom = gameCoordinatesForTree.game * possibleBranches;
		var winningMoves = [];
		var otherMoves = [];
		for (var cont = 1; cont <= possibleBranches; cont++) {
			var game = {
				level: level + 1,
				game: gameToStartFrom
			};
			if (treeValues[level + 1][gameToStartFrom] > 0) {
				winningMoves.push(game);
			} else if (treeValues[level + 1][gameToStartFrom] == 0) {
				otherMoves.push(game);
			}
			gameToStartFrom++;
		}
		if (winningMoves.length > 0) {
			console.log("mosse vincenti:");
			console.log(winningMoves);
			return winningMoves;
		}
		console.log("altre mosse:");
		console.log(otherMoves);
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
		if (this.checkWinForAPlayer4(1, gameStatus)) {
			console.log("vince giocatore 1");
		} else if (this.checkWinForAPlayer4(2, gameStatus)) {
			console.log("vince giocatore 2");
		} else if (this.checkTieGame4(gameStatus)) {
			console.log("partita in parità");
		} else {
			//prossima mossa
			this.currentPlayer = (this.currentPlayer == 1 ? 2 : 1);
			this.playGame();
		}
	},
	checkWinForAPlayer: function (player, gameStatus) {
		if (
			(gameStatus[0] == player && gameStatus[1] == player && gameStatus[2] == player) ||
			(gameStatus[3] == player && gameStatus[4] == player && gameStatus[5] == player) ||
			(gameStatus[6] == player && gameStatus[7] == player && gameStatus[8] == player) ||
			(gameStatus[0] == player && gameStatus[3] == player && gameStatus[6] == player) ||
			(gameStatus[1] == player && gameStatus[4] == player && gameStatus[7] == player) ||
			(gameStatus[2] == player && gameStatus[5] == player && gameStatus[8] == player) ||
			(gameStatus[0] == player && gameStatus[4] == player && gameStatus[8] == player) ||
			(gameStatus[2] == player && gameStatus[4] == player && gameStatus[6] == player)
		) {
			return true;
		} else {
			return false;
		}
	},
	checkTieGame: function (gameStatus) {
		if (gameStatus[0] != 0 && gameStatus[1] != 0 && gameStatus[2] != 0 &&
			gameStatus[3] != 0 && gameStatus[4] != 0 && gameStatus[5] != 0 &&
			gameStatus[6] != 0 && gameStatus[7] != 0 && gameStatus[8] != 0) {
			return true;
		} else {
			return false;
		}
	},
	checkTieGame4: function (gameStatus) {
		if (gameStatus[0] != 0 && gameStatus[1] != 0 && gameStatus[2] != 0 && gameStatus[3] != 0 && gameStatus[4] != 0) {
			// if (gameStatus[0] != 0 && gameStatus[1] != 0 && gameStatus[2] != 0 && gameStatus[3] != 0) {
			return true;
		} else {
			return false;
		}
	},
	checkWinForAPlayer4: function (player, gameStatus) {
		if (gameStatus[0] == player && gameStatus[3] == player) {
			// if (gameStatus[3] == player && gameStatus[2] == player) {
			return true;
		} else {
			return false;
		}
	},
	getRandom: function getIntRandomNumber(min, max) {
		return Math.trunc(Math.random() * (max + 1 - min) + min);
	}
};

$(document).ready(function () {
	ticTac.initializeGame();
});