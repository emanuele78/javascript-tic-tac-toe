"use strict";

$(function () {
    var scacchiera = new Scacchiera("2000");
    var giocatore = 1;
    // muovi(scacchiera, giocatore);
    var combinazioni = muoviSuLivelloZero(scacchiera, giocatore, 1);
    console.log("Combinazione attuale: "+scacchiera.scacchiera.join(""));
    console.log("Valori albero:");
    combinazioni.forEach(function (item) {
       console.log(item.gioco.scacchiera.join("") + " valore combinazione: " + item.valoreMossa);
       // console.log(item.valoreMossa);
    });
});

Number.prototype.avversario = function () {
    if (this === 1) {
        return 2;
    } else if (this === 2) {
        return 1;
    } else {
        return undefined;
    }
};

function Scacchiera(scacchiera) {
    this.scacchiera = Array.from(scacchiera);
    this.caselleLibere = function () {
        var caselleLibere = 0;
        for (var i = 0; i < this.scacchiera.length; i++) {
            if (this.scacchiera[i] === "0") {
                caselleLibere++;
            }
        }
        return caselleLibere;
    };
    this.vinceGiocatore = function (giocatore) {
        //regole per la vittoria
        return this.scacchiera[0] === giocatore.toString() && this.scacchiera[3] === giocatore.toString();
    };
    this.partitaPatta = function () {
        return !this.vinceGiocatore(2) && !this.vinceGiocatore(1) && this.caselleLibere() === 0;
    };
    //questa funzione crea un nuovo oggetto scacchiera assegnando alla ennesima posizione libera rappresentata da numeroCasellaLibera (base 0), il simbolo del giocatore
    //es clonaEAssegnaCasellaLibera(1, 2) => crea nuovo oggetto scacchiera partendo dalla scacchiera corrente e assegna alle 3° casella libera della scacchiera il giocatore 1
    this.clonaEAssegnaCasellaLibera = function (giocatore, numeroCasellaLibera) {
        var nuovaScacchiera = this.clona();
        var indiceCercato = -1;
        for (var cont = 0; cont <= numeroCasellaLibera; cont++) {
            indiceCercato = nuovaScacchiera.scacchiera.indexOf("0", indiceCercato + 1);
        }
        nuovaScacchiera.scacchiera[indiceCercato] = giocatore.toString();
        return nuovaScacchiera;
    };
    //metodo che ritorna un nuovo oggetto scacchiera avente lo stato attuale del gioco
    this.clona = function () {
        return new Scacchiera(this.scacchiera.slice());
    }
}

function muoviSuLivelloZero(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push(
            {gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)}
        );
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            // item.valoreMossa = muoviSuLivelloUno2(item.gioco, giocatore.avversario(), -moltiplicatore);
            item.valoreMossa = valutaAlbero(item.gioco, giocatore.avversario(), -moltiplicatore);
        }
    });
    return combinazioni;
}

function valutaAlbero(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)});
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            item.valoreMossa = valutaAlbero(item.gioco, giocatore.avversario(), -moltiplicatore);
        }
    });
    //valuto la migliore mossa
    var valore = 0;
    combinazioni.forEach(function (item) {
        valore += item.valoreMossa;
    });
    return valore;
}


function muoviSuLivelloUno2(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)});
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 1");
            item.valoreMossa = muoviSuLivelloDue2(item.gioco, giocatore.avversario(), -moltiplicatore);
        }
    });
    //valuto la migliore mossa
    var valore = 0;
    combinazioni.forEach(function (item) {
        valore += item.valoreMossa;
    });
    return valore;
}

// function muoviSuLivelloDue(scacchiera, giocatore, moltiplicatore) {
//     //la mossa è del giocatore
//     var combinazioni = [];
//     for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
//         combinazioni.push(
//             scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)
//         );
//     }
//     // TODO 1021 mol 1
//     //stampo combinazioni
//     console.log("Combinazioni livello 2");
//     combinazioni.forEach(function (item) {
//         console.log(item.scacchiera);
//     });
//     cont = 0;
//     var value = -1;
//     while (cont < combinazioni.length && value === -1) {
//         if (combinazioni[cont].vinceGiocatore(giocatore)) {
//             value = 10 * moltiplicatore;
//         } else if (combinazioni[cont].vinceGiocatore(giocatore.avversario())) {
//             value = -10 * moltiplicatore;
//         } else if (combinazioni[cont].partitaPatta()) {
//             value = 0;
//         } else {
//             console.log("FINE CHIAMATA LIVELLO 2");
//             value = muoviSuLivelloTre(combinazioni[cont], giocatore.avversario(), -moltiplicatore);
//         }
//         cont++;
//     }
//     return value;
// }

function muoviSuLivelloDue2(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)});
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 2");
            item.valoreMossa = muoviSuLivelloTre2(item.gioco, giocatore.avversario(), -moltiplicatore);
        }
    });
    //valuto la migliore mossa
    var valore = 0;
    combinazioni.forEach(function (item) {
        valore += item.valoreMossa;
    });
    return valore;
}


function muoviSuLivelloTre2(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)});
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 3 - questo non deve essere stampato");
        }
    });
    //valuto la migliore mossa
    var valore = 0;
    combinazioni.forEach(function (item) {
        valore += item.valoreMossa;
    });
    return valore;
}
