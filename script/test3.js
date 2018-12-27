"use strict";

function calcolaCaselleLibere(scacchiera) {
    var caselleLibere = 0;
    for (var i = 0; i < scacchiera.length; i++) {
        if (scacchiera[i] === "0") {
            caselleLibere++;
        }
    }
    return caselleLibere;
}

Number.prototype.avversario = function () {
    if (this === 1) {
        return 2;
    } else if (this === 2) {
        return 1;
    } else {
        return undefined;
    }
};

function assegnaCasella(giocatore, numeroCasellaLibera, scacchiera) {
    var temp = Array.from(scacchiera);
    var indiceCercato = -1;
    for (var cont = 0; cont <= numeroCasellaLibera; cont++) {
        indiceCercato = temp.indexOf("0", indiceCercato + 1);
    }
    temp[indiceCercato] = giocatore.toString();
    return temp.join("");
}

function calcolaValoreScacchiera(scacchiera, giocatore) {
    giocatore = giocatore.toString();
    if ((scacchiera[0] === giocatore && scacchiera[1] === giocatore && scacchiera[2] === giocatore) ||
        (scacchiera[3] === giocatore && scacchiera[4] === giocatore && scacchiera[5] === giocatore) ||
        (scacchiera[6] === giocatore && scacchiera[7] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[0] === giocatore && scacchiera[3] === giocatore && scacchiera[6] === giocatore) ||
        (scacchiera[1] === giocatore && scacchiera[4] === giocatore && scacchiera[7] === giocatore) ||
        (scacchiera[2] === giocatore && scacchiera[5] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[0] === giocatore && scacchiera[4] === giocatore && scacchiera[8] === giocatore) ||
        (scacchiera[2] === giocatore && scacchiera[4] === giocatore && scacchiera[6] === giocatore)) {
        //vince giocatore
        return 10;
    } else if (calcolaCaselleLibere(scacchiera) === 0) {
        //partià 0
        return 0;
    }
    //non è possibile stabilirlo
    return undefined;
}

function calcolaValoreScacchiera2(scacchiera, giocatore, avversario) {
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

function calcola(scacchiera, giocatoreCheMuove, giocatoreCorrente, livelloRicorsione, moltiplicatore) {

    // if (calcolaValoreScacchiera(scacchiera, giocatoreCheMuove) === 10) {
    //     return {valoreMossa: 10};
    // }
    // if (calcolaValoreScacchiera(scacchiera, giocatoreCheMuove.avversario()) === 10) {
    //     return {valoreMossa: -10};
    // }
    // if (caselleLibere === 0) {
    //     return {valoreMossa: 0};
    // }

    var valoreMossa = calcolaValoreScacchiera2(scacchiera, giocatoreCheMuove, giocatoreCheMuove.avversario());
    if (valoreMossa !== undefined) {
        return {valoreMossa: valoreMossa};
    }

    var mossePossibili = [];
    var caselleLibere = calcolaCaselleLibere(scacchiera);
    //array di mosse possibili
    for (var cont = 0; cont < caselleLibere; cont++) {
        mossePossibili.push({mossa: assegnaCasella(giocatoreCorrente, cont, scacchiera)});
    }
    for (cont = 0; cont < mossePossibili.length; cont++) {
        var mossaEreditata = calcola(mossePossibili[cont].mossa, giocatoreCheMuove, giocatoreCorrente.avversario(), livelloRicorsione + 1, moltiplicatore / 10);
        mossePossibili[cont].valoreMossa = mossaEreditata.valoreMossa * moltiplicatore;
    }
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