"use strict";

$(function () {
    var scacchiera = new Scacchiera("000000000");
    var giocatore = 1;
    var livelloProfondita = 0;
    var moltiplicatore = 10000000000;
    // var combinazioni = muoviSuGiocoAttuale(scacchiera, giocatore, moltiplicatore);
    // var combinazioni = valutaAlbero2(scacchiera, giocatore, moltiplicatore, livelloProfondita);
    var temp = [];
    var combinazioni = valutaMossa(scacchiera, giocatore, giocatore, livelloProfondita, temp, moltiplicatore, true);
    console.log(temp);
    console.log("Combinazione attuale: " + scacchiera.scacchiera.join(""));

    // console.log("Valori albero:");
    // combinazioni.forEach(function (item) {
    //     console.log(item.gioco.scacchiera.join("") + " valore combinazione: " + item.valoreMossa);
    // });
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
    // console.log(combinazioni);
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

//costruttore scacchiera - accetta come parametro un array o una stringa
function Scacchiera(scacchiera) {
    //PROPRIETA'
    this.scacchiera = Array.from(scacchiera);
    //METODI
    // ritorna il numero di caselle libere nella scacchiera
    this.caselleLibere = function () {
        var caselleLibere = 0;
        for (var i = 0; i < this.scacchiera.length; i++) {
            if (this.scacchiera[i] === "0") {
                caselleLibere++;
            }
        }
        return caselleLibere;
    };
    //ritorna vero se il giocatore passato vince la partita altrimenti falso
    //in questo metodo vengono stabilite le regole per la vittoria
    this.vinceGiocatore = function (giocatore) {
        giocatore = giocatore.toString();
        return (this.scacchiera[0] === giocatore && this.scacchiera[1] === giocatore && this.scacchiera[2] === giocatore) ||
            (this.scacchiera[3] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[5] === giocatore) ||
            (this.scacchiera[6] === giocatore && this.scacchiera[7] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[0] === giocatore && this.scacchiera[3] === giocatore && this.scacchiera[6] === giocatore) ||
            (this.scacchiera[1] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[7] === giocatore) ||
            (this.scacchiera[2] === giocatore && this.scacchiera[5] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[0] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[8] === giocatore) ||
            (this.scacchiera[2] === giocatore && this.scacchiera[4] === giocatore && this.scacchiera[6] === giocatore);
        // return (this.scacchiera[0] === giocatore && this.scacchiera[3] === giocatore || this.scacchiera[1] === giocatore && this.scacchiera[2] === giocatore)
    };
    //ritorna vero se la partita è in parità altrimenti falso
    this.partitaPatta = function () {
        return !this.vinceGiocatore(2) && !this.vinceGiocatore(1) && this.caselleLibere() === 0;
    };
    //questa funzione crea un nuovo oggetto scacchiera assegnando alla ennesima posizione libera (rappresentata da numeroCasellaLibera con base 0), il simbolo del giocatore
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
    for (cont = 0; cont < combinazioni.length; cont++) {
        if (cont === 0) {
            var valore = combinazioni[cont].valoreMossa;
        } else {
            if (combinazioni[cont].valoreMossa > valore) {
                valore = combinazioni[cont].valoreMossa;
            }
        }
    }
    // var valore = 0;
    // combinazioni.forEach(function (item) {
    //     valore += item.valoreMossa;
    // });
    return valore;
}

function valutaAlbero2(scacchiera, giocatore, moltiplicatore, livelloProfondita) {
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatore, cont)});
    }
    combinazioni.forEach(function (item) {
        if (item.gioco.vinceGiocatore(giocatore)) {
            item.valoreMossa = 10;
            // item.valoreMossa = 10 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatore.avversario())) {
            item.valoreMossa = -10;
            // item.valoreMossa = -10 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            item.valoreMossa = valutaAlbero2(item.gioco, giocatore.avversario(), -moltiplicatore, livelloProfondita + 1);
        }
    });
    // TODO da cancellare
    // console.log("******************** condizione su livello "+livelloProfondita);
    // combinazioni.forEach(function (item) {
    //    var valoreMossa = item.valoreMossa;
    //    var combinazioneMossa = item.gioco.scacchiera.join("");
    //    console.log(combinazioneMossa + "  " + valoreMossa);
    // });
    if (livelloProfondita === 0) {
        return combinazioni;
    }
    for (cont = 0; cont < combinazioni.length; cont++) {
        if (cont === 0) {
            var valore = combinazioni[cont].valoreMossa;
        } else {
            if (combinazioni[cont].valoreMossa > valore) {
                valore = combinazioni[cont].valoreMossa;
            }
        }
    }
    //valuto la migliore mossa
    // var valore = 0;
    // combinazioni.forEach(function (item) {
    //     valore += item.valoreMossa;
    // });
    return valore * moltiplicatore;
}

function valutaMossa(scacchiera, giocatoreCheMuove, giocatoreCorrente, livelloProfondita, temp, moltiplicatore, primoGiocatore) {
    var combinazioni = [];
    for (var cont = 0; cont < scacchiera.caselleLibere(); cont++) {
        combinazioni.push({gioco: scacchiera.clonaEAssegnaCasellaLibera(giocatoreCorrente, cont)});
    }
    combinazioni.forEach(function (item) {
        var a = item.gioco.scacchiera.join("");
        if (item.gioco.vinceGiocatore(giocatoreCheMuove)) {
            item.valoreMossa = 1 * moltiplicatore;
        } else if (item.gioco.vinceGiocatore(giocatoreCheMuove.avversario())) {
            item.valoreMossa = -1 * moltiplicatore;
        } else if (item.gioco.partitaPatta()) {
            item.valoreMossa = 0;
        } else {
            item.valoreMossa = valutaMossa(item.gioco, giocatoreCheMuove, giocatoreCorrente.avversario(), livelloProfondita + 10, temp, moltiplicatore / 10, primoGiocatore);
        }
    });
    if (temp[livelloProfondita] === undefined) {
        temp[livelloProfondita] = [];
    }
    combinazioni.forEach(function (item) {
        temp[livelloProfondita].push(item.gioco.scacchiera.join("") + " = " + item.valoreMossa);
    });
    if (livelloProfondita === 0) {
        return combinazioni;
    }
    for (cont = 0; cont < combinazioni.length; cont++) {
        if (cont === 0) {
            var valore = combinazioni[cont].valoreMossa;
        } else {
            if (primoGiocatore) {
                if (combinazioni[cont].valoreMossa > valore) {
                    valore = combinazioni[cont].valoreMossa;
                }
            } else {
                if (combinazioni[cont].valoreMossa < valore) {
                    valore = combinazioni[cont].valoreMossa;
                }
            }
        }
    }
    // console.log("valore ritornato per combinazione " + scacchiera.scacchiera.join("") + " >>> " + valore);
    return valore;
}
