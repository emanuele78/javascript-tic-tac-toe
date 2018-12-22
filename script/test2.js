"use strict";

$(function () {
    var scacchiera = new Scacchiera("022210101");
    var giocatore = 1;
    var combinazioni = muoviSuGiocoAttuale(scacchiera, giocatore, 1);
    console.log("Combinazione attuale: " + scacchiera.scacchiera.join(""));
    console.log("Valori albero:");
    combinazioni.forEach(function (item) {
        console.log(item.gioco.scacchiera.join("") + " valore combinazione: " + item.valoreMossa);
    });
    console.log("Valori albero dopo ordinamento:");
    combinazioni.sort(function (a, b) {
        if (a.valoreMossa > b.valoreMossa) {
            return -1;
        }
        if (a.valoreMossa < b.valoreMossa) {
            return 1;
        }
        return 0;
    });
    combinazioni.forEach(function (item) {
        console.log(item.gioco.scacchiera.join("") + " valore combinazione: " + item.valoreMossa);
    });
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
        // return this.scacchiera[0] === giocatore.toString() && this.scacchiera[3] === giocatore.toString();
        giocatore = giocatore.toString();
        return (this.scacchiera[0] === giocatore && this.scacchiera[1] === giocatore && this.scacchiera[2] === giocatore) ||
            (this.scacchiera[3] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[5] === giocatore) ||
            (this.scacchiera[6] === giocatore && this.scacchiera[7] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[0] === giocatore && this.scacchiera[3] === giocatore && this.scacchiera[6] === giocatore) ||
            (this.scacchiera[1] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[7] === giocatore) ||
            (this.scacchiera[2] === giocatore && this.scacchiera[5] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[0] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[2] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[6] === giocatore);
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

function muoviSuGiocoAttuale(scacchiera, giocatore, moltiplicatore) {
    //creo array con tutte le combinazioni di mosse attuabili dal giocatore
    //ogni oggetto dell'array ha una proprietà gioco ovvero un oggetto scacchiera
    //e una proprità valoreMossa che esprime il valore della combinazione
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
            //lo schema attuale del gioco non permette di assegna un valore pertanto valuto l'albero del gioco a cascata
            item.valoreMossa = valutaAlbero(item.gioco, giocatore.avversario(), -moltiplicatore);
        }
    });
    return combinazioni;
}

function valutaAlbero(scacchiera, giocatore, moltiplicatore) {
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

