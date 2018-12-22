"use strict";
$(function () {
    //albero delle combinazioni, la prima dimensione indica il livello di gioco
    //es tree[0][] indica la scacchiera vuota, tree[1][] indica la scacchiera dopo la prima mossa
    var tree = [
        [],
        [],
        [],
        [],
        [],
        []
    ];
    //creo albero di gioco
    tree[0].push("00000");
    createGameTree(tree, 1, 0);
    console.log(tree);
    // createGameTreeValues(tree);
    var coord = getCoordinatesForAGame(tree, "00210");
    var level = coord.level;
    var branches = tree[level + 1].length / tree[level].length;
    var gameToStartFrom = coord.game * branches;
    var subGames = [];
    console.log(gameToStartFrom);
    for (var cont = gameToStartFrom; cont < gameToStartFrom + branches; cont++) {
        subGames.push(tree[level + 1][cont]);
    }
    console.log(subGames);
});

//crea intero labero delle combinazioni possibili dove 0 casella vuota, 1 primo giocatore e 2 secondo giocatore
function createGameTree(tree, currentPlayer, level) {
    for (var cont = 0; cont < tree[level].length; cont++) {
        for (var i = 0; i < tree.length - 1; i++) {
            if (tree[level][cont][i] === "0") {
                var before = tree[level][cont].substr(0, i);
                var after = tree[level][cont].substr(i + 1);
                tree[level + 1].push(before + currentPlayer + after);
            }
        }
    }
    if (level++ < tree.length - 2) {
        currentPlayer = (currentPlayer === 1 ? 2 : 1);
        createGameTree(tree, currentPlayer, level);
    }
}

function createGameTreeValues(tree, treeValues, currentPlayer, level) {
    console.log(tree.length);
    for (var cont = 0; cont < tree[level].length; cont++) {
        var combinationValue = calcCombinationValue(tree[level][cont]);
        //se la combinazione della scacchiera esaminata è 0 viene ereditato il "miglior" valore del livello sottostante
        //altrimenti viene memorizzato il valore calcolato
        if (combinationValue !== 0) {
            treeValues[level][cont].push(combinationValue);
        } else {
            //la scacchiera corrente non produce vincitore, eredito dal livello sottostante la combinazione
            //a meno che il livello corrente non sia il più basso, in questo caso la il valore della scacchiera rimane 0
            if (level === tree.length - 1) {
                //il livello corrente è l'ultimo, non posso ereditare
                treeValues[level][cont] = combinationValue;
            } else {
                //eredito dal livello sottostante
                // calcolo quante ramificazioni ha la il gioco corrente
                var branches = treeValues[level + 1].length / treeValues[level].length;
                //il seguente array conterrà le mosse della combinazione sottostante
                var subLevelGamesCombination = [];
                for (var i = cont * branches; cont < cont * branches + branches; i++) {
                    subLevelGamesCombination.push(treeValues[level + 1][i]);
                }
                //ciclo nell'array per trovare il migliore valore da assegnare
                var bestValue = 0;

            }
        }
    }
}

//calcola valore di una data posizione di gioco
function calcCombinationValue(currentGame, currentPlayer) {
    if (checkWinForAPlayer(currentGame, currentPlayer)) {
        //questa combinazione è vincente per il giocatore corrente
        return 10;
    } else if (checkWinForAPlayer(currentGame, (currentPlayer === 1 ? 2 : 1))) {
        //questa combinazione è vincente per l'avversario del giocatore corrente
        return -10;
    } else {
        //nessun vincitore
        return 0;
    }
}

//viene passato il giocatore e lo stato corrente della scacchiera. La funzione determina se il giocatore ha vinto o meno
function checkWinForAPlayer(currentGame, player) {
    if (currentGame[0] == player && currentGame[3] == player) {
        return true;
    } else {
        return false;
    }
}

function getCoordinatesForAGame(gameTree, currentGame) {
    var continueSearchInsideTree = true;
    var continueSearchGame = true;
    var level = 0;
    while (continueSearchInsideTree) {
        var game = 0;
        while (continueSearchGame) {
            if (gameTree[level][game] === currentGame) {
                continueSearchGame = false;
                continueSearchInsideTree = false;
            } else {
                game++;
                if (game === gameTree[level].length) {
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
    return {game: game, level: level};
}