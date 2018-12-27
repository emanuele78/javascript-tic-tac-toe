"use strict";

$(function () {
    $(".game_settings__button").click(function (event) {
        event.preventDefault();
        avviaGioco();
    });
    $(".game_settings__input").keyup(function (event) {
        var key = event.keyCode;
        switch (key) {
            case 13:
                //invio
                avviaGioco();
                break;
            case 8:
                //cancella - ammesso
                break;
            case 48:
                $(".game_settings__input").val(0);
                break;
            case 49:
                $(".game_settings__input").val(1);
                break;
            case 50:
                $(".game_settings__input").val(2);
                break;
            default:
                //tutto il resto non ammeso
                $(".game_settings__input").val("");
        }
    });
});

function avviaGioco() {
    reset();
    var giocatori = $(".game_settings__input").val();
    if (giocatori !== "0" && giocatori !== "1" && giocatori !== "2") {
        return;
    }
    giocatori = parseInt(giocatori);
    switch (giocatori) {
        case 1:
            var giocatoreUno = creaGiocatore("persona", 1);
            var giocatoreDue = creaGiocatore("pc", 2);
            break;
        case 2:
            giocatoreUno = creaGiocatore("persona", 1);
            giocatoreDue = creaGiocatore("persona", 2);
            break;
        default:
            giocatoreUno = creaGiocatore("pc", 1);
            giocatoreDue = creaGiocatore("pc", 2);
    }
    if (getIntRandomNumber(1, 100) % 2 === 0) {
        gioca(giocatoreDue, giocatoreUno);
    } else {
        gioca(giocatoreUno, giocatoreDue);
    }
}

function creaGiocatore(tipo, indice) {
    return {tipo: tipo, indiceGiocatore: indice};
}

function assegnaPosizione(giocatoreCheMuove, indiceCasella) {
    if (giocatoreCheMuove.indiceGiocatore === 1) {
        var clonedElement = $(".template .game__cell__cross").clone();
    } else {
        clonedElement = $(".template .game__cell__circle").clone();
    }
    $(".game__cell").eq(indiceCasella).html(clonedElement);
}

function gioca(giocatoreCheMuove, avversario) {
    $(".game_status__content").text("in attesa di giocatore " + giocatoreCheMuove.indiceGiocatore + " (" + giocatoreCheMuove.tipo + ")");
    if (giocatoreCheMuove.tipo === "persona") {
        //collega listener
        collegaListener(giocatoreCheMuove, avversario);
    } else {
        setTimeout(function () {
            var mossaPc = calcola(ottieniStatoScacchiera(), giocatoreCheMuove.indiceGiocatore, giocatoreCheMuove.indiceGiocatore, 0, 1000000000).mossa;
            var indiceCasellaMossaPc = elaboraMossaPc(mossaPc);
            effettuaMossa(giocatoreCheMuove, indiceCasellaMossaPc, avversario);
        }, 300);
    }
}

function elaboraMossaPc(mossa) {
    var scacchieraAttuale = ottieniStatoScacchiera();
    var indiceMossaPc = -1;
    var cont = 0;
    while (indiceMossaPc === -1 && cont < scacchieraAttuale.length) {
        if (mossa[cont] !== scacchieraAttuale[cont]) {
            indiceMossaPc = cont;
        }
        cont++
    }
    return indiceMossaPc;
}

function effettuaMossa(giocatoreCheMuove, indiceCasella, avversario) {
    assegnaPosizione(giocatoreCheMuove, indiceCasella);
    if (giocatoreCheMuove.indiceGiocatore === 1) {
        var sound = document.getElementById("beep");
    } else {
        var sound = document.getElementById("boop");
    }
    sound.play();
    setTimeout(function () {
        var statoGioco = controllaScacchiera(giocatoreCheMuove, avversario);
        switch (statoGioco) {
            case 10:
                $(".game_status__content").text("vince giocatore " + giocatoreCheMuove.indiceGiocatore + " (" + giocatoreCheMuove.tipo + ")");
                break;
            case -10:
                $(".game_status__content").text("vince giocatore " + avversario.indiceGiocatore + " (" + avversario.tipo + ")");
                break;
            case 0:
                $(".game_status__content").text("partita in parità - nessun vincitore");
                break;
            default:
                //continua a giocare
                gioca(avversario, giocatoreCheMuove);
        }
    },100);
}

function controllaScacchiera(giocatoreCheMuove, avversario) {
    var statoCorrenteScacchiera = ottieniStatoScacchiera();
    var valoreGioco = calcolaValoreScacchiera2(statoCorrenteScacchiera, giocatoreCheMuove.indiceGiocatore, avversario.indiceGiocatore);
    if (valoreGioco === 10) {
        return 10;
    } else if (valoreGioco === -10) {
        return -10;
    } else if (valoreGioco === 0) {
        return 0;
    } else {
        return undefined;
    }
}

function collegaListener(giocatoreCheMuove, avversario) {
    $(".game__cell:empty").click(function () {
        $(".game__cell").off();
        effettuaMossa(giocatoreCheMuove, $(this).index(), avversario);
    });
}

function ottieniStatoScacchiera() {
    var scacchiera = [];
    for (var cont = 0; cont < 9; cont++) {
        if ($(".game__cell").eq(cont).is(":empty")) {
            // scacchiera.push(cont);
            scacchiera.push("0");
        } else {
            if ($(".game__cell").eq(cont).has(".game__cell__circle").length) {
                // scacchiera.push("2");
                scacchiera.push("2");
            } else {
                // scacchiera.push("1");
                scacchiera.push("1");
            }
        }
    }
    console.log(scacchiera);
    return scacchiera;
}

function reset() {
    $(".game__cell").off();
    $(".game__cell").empty();
}

//funzione random
function getIntRandomNumber(min, max) {
    return Math.trunc(Math.random() * (max + 1 - min) + min);
}