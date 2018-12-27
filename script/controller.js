"use strict";

$(function () {
    //listener per pulsante GIOCA
    $(".game_settings__button").click(function (event) {
        event.preventDefault();
        preparaGioco();
    });
    //listener per input text
    $(".game_settings__input").keyup(function (event) {
        var key = event.keyCode;
        switch (key) {
            case 13:
                //invio
                preparaGioco();
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

// funzione che prepare il gioco, resettando la scacchiera e creando i giocatori
function preparaGioco() {
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
    // il giocatore che inizia è deciso randomicamente
    if (getIntRandomNumber(1, 100) % 2 === 0) {
        gioca(giocatoreDue, giocatoreUno);
    } else {
        gioca(giocatoreUno, giocatoreDue);
    }
}

// funzione di utilità
function creaGiocatore(tipo, indice) {
    return {tipo: tipo, indiceGiocatore: indice};
}

//se il giocatore è umano, si collegano listener sulle caselle libere altrimenti si avvia l'algoritmo di ricerca
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

// assegno una data posizione libera a un giocatore
function assegnaPosizione(giocatoreCheMuove, indiceCasella) {
    if (giocatoreCheMuove.indiceGiocatore === 1) {
        var clonedElement = $(".template .game__cell__cross").clone();
    } else {
        clonedElement = $(".template .game__cell__circle").clone();
    }
    $(".game__cell").eq(indiceCasella).html(clonedElement);
}

// l'algoritmo di ricerca ritorna la mogliore combinazione possibile, estrapolo da essa la casella in cui muovere
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
        var statoGioco = calcolaValoreScacchiera(ottieniStatoScacchiera(),giocatoreCheMuove.indiceGiocatore, avversario.indiceGiocatore);
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

// collega listener su caselle vuote e dopo che la mossa del giocatore umano viene effettuata rimuovi il listener
function collegaListener(giocatoreCheMuove, avversario) {
    $(".game__cell:empty").click(function () {
        $(".game__cell").off();
        effettuaMossa(giocatoreCheMuove, $(this).index(), avversario);
    });
}

//ritorna una array dallo stato corrente della scacchiera con 0 casella libera e 1/2 i giocatori
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
    return scacchiera;
}

//resetta il gioco rimuovendo pedine e cancellando i listener
function reset() {
    $(".game__cell").off();
    $(".game__cell").empty();
}

//funzione random
function getIntRandomNumber(min, max) {
    return Math.trunc(Math.random() * (max + 1 - min) + min);
}