"use strict";
$(function () {
    //listener per pulsante GIOCA
    $(".game_settings__button").click(function () {
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
    if (indice === 1) {
        return {tipo: tipo, indiceGiocatore: indice, audio: $("#beep")[0], timeout: 260, countdown: 16};
    }
    return {tipo: tipo, indiceGiocatore: indice, audio: $("#boop")[0], timeout: 260, countdown: 16};
}

//se il giocatore è umano, si collegano listener sulle caselle libere altrimenti si avvia l'algoritmo di ricerca
function gioca(giocatoreCheMuove, avversario) {
    $(".game_status__content").text("in attesa di giocatore " + giocatoreCheMuove.indiceGiocatore + " (" + giocatoreCheMuove.tipo + ")");
    if (giocatoreCheMuove.tipo === "persona") {
        //collega listener
        collegaListener(giocatoreCheMuove, avversario);
    } else {
        setTimeout(function () {
            var mossaPc = calcola(ottieniStatoScacchiera(), giocatoreCheMuove.indiceGiocatore, giocatoreCheMuove.indiceGiocatore, 0).mossa;
            var indiceCasellaMossaPc = elaboraMossaPc(mossaPc);
            effettuaMossa(giocatoreCheMuove, indiceCasellaMossaPc, avversario);
        }, giocatoreCheMuove.timeout);
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

//posiziona simbolo giocatore sulla scacchiera, riproduce suono, aggiorna stato gioco
function effettuaMossa(giocatoreCheMuove, indiceCasella, avversario) {
    assegnaPosizione(giocatoreCheMuove, indiceCasella);
    giocatoreCheMuove.audio.play();
    setTimeout(function () {
        var statoGioco = calcolaValoreScacchiera(ottieniStatoScacchiera(), giocatoreCheMuove.indiceGiocatore, avversario.indiceGiocatore);
        switch (statoGioco) {
            case 10:
                $(".game_status__content").text("vince giocatore " + giocatoreCheMuove.indiceGiocatore + " (" + giocatoreCheMuove.tipo + ")");
                break;
            case -10:
                $(".game_status__content").text("vince giocatore " + avversario.indiceGiocatore + " (" + avversario.tipo + ")");
                break;
            case 0:
                $(".game_status__content").text("stallo");
                //easter egg
                easterEgg(giocatoreCheMuove, avversario);
                break;
            default:
                //continua a giocare
                gioca(avversario, giocatoreCheMuove);
        }
    }, giocatoreCheMuove.timeout);
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
            scacchiera.push("0");
        } else {
            if ($(".game__cell").eq(cont).has(".game__cell__circle").length) {
                scacchiera.push("2");
            } else {
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

// easter egg
function easterEgg(giocatoreCheMuove, avversario) {
    if (giocatoreCheMuove.tipo === "pc" && avversario.tipo === "pc") {
        if (giocatoreCheMuove.countdown > 0) {
            reset();
            //modifico proprietà giocatore per velocizzare il gioco
            giocatoreCheMuove.countdown--;
            avversario.countdown--;
            giocatoreCheMuove.timeout -= 20;
            avversario.timeout -= 20;
            gioca(giocatoreCheMuove, avversario);
        } else {
            //fine del countdown
            mostraFineEasterEgg();
        }
    }
}

function mostraFineEasterEgg() {
    $(".easteregg").show();
    var frasi = ["Salve professor Falken.", "Strano gioco.", "l'unica mossa vincente è non giocare.", "che ne dice di una bella partita a scacchi?"];
    var contenitori = [$(".easteregg__first_line"), $(".easteregg__second_line"), $(".easteregg__third_line"), $(".easteregg__fourth_line")];
    setTimeout(function () {
        mostraFrase(frasi, contenitori, 0, 0);
    }, 2500);
}

function mostraFrase(frasi, contenitori, indiceLettera, indiceFrase) {
    if (indiceFrase === frasi.length) {
        //le frasi da stampare a schermo sono terminate
        setTimeout(function () {
            $(".easteregg__love").show();
        }, 500);
        return;
    }
    if (indiceLettera > frasi[indiceFrase].length) {
        //la frase corrente è terminata, incremento indice frase
        setTimeout(function () {
            mostraFrase(frasi, contenitori, 0, indiceFrase + 1);
        }, 1600);
    } else {
        // stampo lettera frase corrente
        setTimeout(function () {
            contenitori[indiceFrase].text(frasi[indiceFrase].substring(0, indiceLettera));
            mostraFrase(frasi, contenitori, indiceLettera + 1, indiceFrase);
        }, 50);
    }
}