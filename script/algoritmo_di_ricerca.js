"use strict";

//calcola il numero delle caselle libere sulla scacchiera
function calcolaCaselleLibere(scacchiera) {
    var caselleLibere = 0;
    for (var i = 0; i < scacchiera.length; i++) {
        if (scacchiera[i] === "0") {
            caselleLibere++;
        }
    }
    return caselleLibere;
}

//funzione prototype per switchare da giocatore 1 a giocatore 2
Number.prototype.avversario = function () {
    if (this === 1) {
        return 2;
    } else if (this === 2) {
        return 1;
    } else {
        return undefined;
    }
};

// funzione che ritorna una nuova scacchiera con su assegnato il giocatore passato nella casella libera indicata (baase 0)
function assegnaCasella(giocatore, numeroCasellaLibera, scacchiera) {
    var temp = Array.from(scacchiera);
    var indiceCercato = -1;
    for (var cont = 0; cont <= numeroCasellaLibera; cont++) {
        indiceCercato = temp.indexOf("0", indiceCercato + 1);
    }
    temp[indiceCercato] = giocatore.toString();
    return temp.join("");
}

//funzione che calcola il valore della scacchiera (vittoria giocatore, vittoria avversario, patta o gioco in corso)
function calcolaValoreScacchiera(scacchiera, giocatore, avversario) {
    avversario = avversario.toString();
    giocatore = giocatore.toString();
    if ((scacchiera[0] === giocatore && scacchiera[1] === giocatore && scacchiera[2] === giocatore) ||
        (scacchiera[3] === giocatore && scacchiera[4] === giocatore && scacchiera[5] === giocatore) ||
        (scacchiera[6] === giocatore && scacchiera[7] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[0] === giocatore && scacchiera[3] === giocatore && scacchiera[6] === giocatore) ||
        (scacchiera[1] === giocatore && scacchiera[4] === giocatore && scacchiera[7] === giocatore) ||
        (scacchiera[2] === giocatore && scacchiera[5] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[0] === giocatore && scacchiera[4] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[2] === giocatore && scacchiera[4] === giocatore && scacchiera[6] === giocatore)) {
        return 10;
    } else if ((scacchiera[0] === avversario && scacchiera[1] === avversario && scacchiera[2] === avversario) ||
        (scacchiera[3] === avversario && scacchiera[4] === avversario && scacchiera[5] === avversario) ||
        (scacchiera[6] === avversario && scacchiera[7] === avversario && scacchiera[8] === avversario) ||
        (scacchiera[0] === avversario && scacchiera[3] === avversario && scacchiera[6] === avversario) ||
        (scacchiera[1] === avversario && scacchiera[4] === avversario && scacchiera[7] === avversario) ||
        (scacchiera[2] === avversario && scacchiera[5] === avversario && scacchiera[8] === avversario) ||
        (scacchiera[0] === avversario && scacchiera[4] === avversario && scacchiera[8] === avversario) ||
        (scacchiera[2] === avversario && scacchiera[4] === avversario && scacchiera[6] === avversario)) {
        return -10;
    } else if (calcolaCaselleLibere(scacchiera) === 0) {
        //partià 0
        return 0;
    }
    //non è possibile stabilirlo
    return undefined;
}

//algoritmo ricorsivo
function calcola(scacchiera, giocatoreCheMuove, giocatoreCorrente, livelloRicorsione, moltiplicatore) {
    //controllo se la combinazione corrente può determinare una vittoria o una patta
    var valoreMossa = calcolaValoreScacchiera(scacchiera, giocatoreCheMuove, giocatoreCheMuove.avversario());
    if (valoreMossa !== undefined) {
        return {valoreMossa: valoreMossa};
    }
    //non è possibile stabilirlo quindi creo tutte le combinazioni di gioco possibili per il giocatore corrente e la scacchiera corrente
    //array di mosse possibili
    var mossePossibili = [];
    var caselleLibere = calcolaCaselleLibere(scacchiera);
    for (var cont = 0; cont < caselleLibere; cont++) {
        mossePossibili.push({mossa: assegnaCasella(giocatoreCorrente, cont, scacchiera)});
    }
    for (cont = 0; cont < mossePossibili.length; cont++) {
        var valoreScacchieraDallaRicorsione = calcola(mossePossibili[cont].mossa, giocatoreCheMuove, giocatoreCorrente.avversario(), livelloRicorsione + 1, moltiplicatore / 10);
        mossePossibili[cont].valoreMossa = valoreScacchieraDallaRicorsione.valoreMossa * moltiplicatore;
    }
    //calcolo la migliore combinazione e il relativo valore da ritornare
    //per il giocatore che muove sarà il valore più alto mentre per l'avversario il valore più basso
    for (cont = 0; cont < mossePossibili.length; cont++) {
        if (cont === 0) {
            var valore = mossePossibili[0].valoreMossa;
            var miglioreScelta = mossePossibili[0].mossa;
        } else {
            if (giocatoreCorrente === giocatoreCheMuove) {
                if (mossePossibili[cont].valoreMossa > valore) {
                    valore = mossePossibili[cont].valoreMossa;
                    miglioreScelta = mossePossibili[cont].mossa;
                }
            } else {
                if (mossePossibili[cont].valoreMossa < valore) {
                    valore = mossePossibili[cont].valoreMossa;
                    miglioreScelta = mossePossibili[cont].mossa;
                }
            }
        }
    }
    return {valoreMossa: valore, mossa: miglioreScelta};
}