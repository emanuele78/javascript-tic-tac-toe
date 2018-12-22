"use strict";

$(function () {
    var scacchiera = new Scacchiera("0000");
    var giocatore = 1;
    // muovi(scacchiera, giocatore);
    var combinazioni = muoviSuLivelloZero(scacchiera, giocatore, 1);
    console.log(combinazioni);
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

// function muovi(scacchiera, giocatore) {
//     var combinazioni = [];
//     for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
//         combinazioni.push(
//             {mossa: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)}
//         );
//     }
//     //stampo combinazioni
//     combinazioni.forEach(function (item) {
//         console.log(item.mossa.scacchiera);
//     });
//     combinazioni.forEach(function (item) {
//         if (item.mossa.vinceGiocatore(giocatore)) {
//             console.log("vince giocatore");
//             item.valoreMossa = 10;
//             // return 10;
//         } else if (item.vinceGiocatore(giocatore.avversario())) {
//             console.log("vince avversario");
//             item.valoreMossa = -10;
//             // return -10;
//         } else if (item.partitaPatta()) {
//             console.log("patta");
//             item.valoreMossa = 0;
//             // return 0;
//         } else {
//             console.log("FINE CHIAMATA ATTUALE");
//             // item.
//             return muovi(item.mossa, giocatore.avversario());
//         }
//     });
// }

function muoviSuLivelloZero(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push(
            {mossa: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)}
        );
    }
    //stampo combinazioni
    console.log("Combinazioni livello 0");
    combinazioni.forEach(function (item) {
        console.log(item.mossa.scacchiera);
    });
    combinazioni.forEach(function (item) {
        if (item.mossa.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10 * moltiplicatore;
            // return 10;
        } else if (item.mossa.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10 * moltiplicatore;
            // return -10;
        } else if (item.mossa.partitaPatta()) {
            item.valoreMossa = 0;
            // return 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 0");
            item.valoreMossa = muoviSuLivelloUno(item.mossa, giocatore.avversario(), -moltiplicatore);
            console.log(item.valoreMossa);
        }
    });
    return combinazioni;
}

function muoviSuLivelloUno(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push(
            scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)
        );
    }
    //stampo combinazioni
    console.log("Combinazioni livello 1");
    combinazioni.forEach(function (item) {
        console.log(item.scacchiera);
    });
    combinazioni.forEach(function (item) {
        if (item.vinceGiocatore(giocatore)) {
            return 10 * moltiplicatore;
        } else if (item.vinceGiocatore(giocatore.avversario())) {
            return -10 * moltiplicatore;
        } else if (item.partitaPatta()) {
            return 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 1");
            var valore = muoviSuLivelloDue(item, giocatore.avversario(), -moltiplicatore);
            console.log(valore);
            return valore;
        }
    });
}

function muoviSuLivelloDue(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push(
            scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)
        );
    }
    //stampo combinazioni
    console.log("Combinazioni livello 2");
    combinazioni.forEach(function (item) {
        console.log(item.scacchiera);
    });
    combinazioni.forEach(function (item) {
        if (item.vinceGiocatore(giocatore)) {
            return 10 * moltiplicatore;
        } else if (item.vinceGiocatore(giocatore.avversario())) {
            return -10 * moltiplicatore;
        } else if (item.partitaPatta()) {
            return 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 2");
            var valore= muoviSuLivelloTre(item, giocatore.avversario(), -moltiplicatore);
            console.log(valore);
            return valore;
        }
    });
}

function muoviSuLivelloTre(scacchiera, giocatore, moltiplicatore) {
    //la mossa è del giocatore
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push(
            scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)
        );
    }
    //stampo combinazioni
    console.log("Combinazioni livello 3");
    combinazioni.forEach(function (item) {
        console.log(item.scacchiera);
    });
    combinazioni.forEach(function (item) {
        if (item.vinceGiocatore(giocatore)) {
            return 10 * moltiplicatore;
        } else if (item.vinceGiocatore(giocatore.avversario())) {
            return -10 * moltiplicatore;
        } else if (item.partitaPatta()) {
            return 0;
        } else {
            console.log("FINE CHIAMATA LIVELLO 3 - questo non deve essere stampato");
        }
    });
    //**********************
    var nuovaScacchiera = scacchiera.clonaEAssegnaCasellaLibera(giocatore,0);
    console.log(nuovaScacchiera.scacchiera);
    if (nuovaScacchiera.vinceGiocatore(giocatore)) {
        return 10 * moltiplicatore;
    } else if (nuovaScacchiera.vinceGiocatore(giocatore.avversario())) {
        return -10 * moltiplicatore;
    } else if (nuovaScacchiera.partitaPatta()) {
        return 0;
    } else {
        console.log("FINE CHIAMATA LIVELLO 3 - questo non deve essere stampato");
    }
}
