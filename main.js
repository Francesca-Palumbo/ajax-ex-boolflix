// MILESTONE 1
$(document).ready(function() {

    // parametrizziamo e creiamo delle variabili costanti
    var api_key = '7664ea64f1d82f8d17473c3821f01535' ;
    var api_url_base = 'https://api.themoviedb.org/3/' ;
    var api_img_url_base = 'https://image.tmdb.org/t/p/' ;
    // variabile della dimensione della copertina
    var dimensione_img = 'w185' ;

    // recupero la struttura html del template di base
    var template_html = $('#card-template').html();
    // preparo la variabile per compilare il template con il codice
    var template = Handlebars.compile(template_html);

    // intercetto il testo nell'input di ricerca
    $('#testo-ricerca').keyup(function(event){
        // ed aggiungo l'eventualità che l'utente digiti 'invio' sulla tastiera
        if(event.which == 13){
            // avvio la funzione
            ricerca();
        }
    });

    // applico l'evento click sul pulsante-ricerca, dal quale  parte la chiamata ajax
    $('#pulsante-ricerca').click(ricerca)
    // funzione per effettuare una ricerca a 'the movied'
    function ricerca() {
        // recupero il testo inserito dall'utente
        // trim per gli spazi, così parte lo stesso la ricerca se metto degli spazi prima del testo, ma se metto solo spazi non parte la ricerca
        var testo_utente = $('#testo-ricerca').val().trim();

        // controllo che l'utente abbia digitato qualcosa
        // se l'utente ha inserito almeno 1 carattere
        if(testo_utente.length > 1) {
            reset_risultati();

            // faccio la chiamata ajax per cercre i film
            $.ajax({
                'url' : api_url_base + 'search/movie' ,
                'method' : 'GET',
                // aggiungo un'altra chiave al mio oggetto
                'data' : {
                    // informazioni aggiuntive che devo passare insieme alla mia chiamata
                    'api_key' :api_key,
                    'query' : testo_utente,
                    'language' : 'it'
                },
                'success' : function(risposta){
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $('#ricerca-utente').text(testo_utente);
                    // visualizzo il titolo della pagina
                    $('.titolo-ricerca').addClass('visible');
                    gestisci_risposta_api(risposta, 'film');
                },
                'error' : function(){
                   console.log('si è verificato un errore');
                }
            }); // chiudo la chiamata ajax film

            // faccio la chiamata ajax per cercre le serie
            $.ajax({
                'url' : api_url_base + 'search/tv' ,
                'method' : 'GET',
                // aggiungo un'altra chiave al mio oggetto
                'data' : {
                    // informazioni aggiuntive che devo passare insieme alla mia chiamata
                    'api_key' : api_key,
                    'query' : testo_utente,
                    'language' : 'it'
                },
                'success' : function(risposta){
                    // inserisco il testo cercato dall'utente nel titolo della pagina
                    $('#ricerca-utente').text(testo_utente);
                    // visualizzo il titolo della pagina
                    $('.titolo-ricerca').addClass('visible');
                    // 'serie tv' è un parametro scritto come stringa statica perchè è l'end-point della chiamata, e dentro risposta ho l'array di tutte le serie tv che devo distinguere dai film. vedo: di che tipo è.
                    gestisci_risposta_api(risposta, 'serie tv');
                },
                'error' : function(){
                   console.log('si è verificato un errore');
                }
            }); // chiudo la chiamata ajax serie tv
       // chiudo l'if apro else
        }else{
           alert('devi digitare almeno 2 caratteri');
        }
    } // chiudo la funzione 'ricerca'

    // funzione per resettare la pagina e prepararla all'inserimento di nuove ricerche
    function reset_risultati() {
        // resetto l'input testuale
        $('#testo-ricerca').val('');
        // nascondo il titolo della pagina
        $('.titolo-ricerca').removeClass('visible');
        // svuoto il contenitore dei risultati
        // $('.card').remove();
        // $('#risultati-ajax').html('');
        // empty : butta via tutto : contenuto testuale, tag, etc
        $('#risultati-ajax').empty();
        // $('#risultati .card').remove();
        // $('#risultati').html('');
    } // chiudo function reset_risultati

    // conquesta funzione recupero i dati dall'api (risposta_api)
    // ed il tipo passato come stringa (tipo)
    function gestisci_risposta_api(risposta_api, tipo){
        // dentro .result può esserci un array di film o un array di serie tv
        var risultati = risposta_api.results;
        // ciclo l'array
        for (var i = 0; i < risultati.length; i++) {
            // e per ogni risultato
           var risultato_corrente = risultati[i];
           // chiamo disegna_card
           disegna_card(risultato_corrente, tipo);
           // poichè questa stessa funzione la chiamo sia per i film che per le serie, devo sapere di che tipo è, dentro la funzione function disegna_card ci metto la 'tipologia', che mi dirà di quale stringa è
           // gestisci_risposta_api(risposta, 'film'); oppure
           // gestisci_risposta_api(risposta, 'serie tv');
        }
    }

    // funzione per appendere una card ai risultati
    function disegna_card(dati, tipologia) {
        if (tipologia == 'film') {
            var titolo_card = dati.title;
            var titolo_originale_card = dati.original_title;
        } else {
            var titolo_card = dati.name;
            var titolo_originale_card = dati.original_name;
        }

    // verifico che ci sia o no un'immagine di copertina
    // devo vedere se quello che mi arriva dal'API sia diverso !== da null
    // == (diverso sia nel significato che nel tipo)
        if (dati.poster_path !== null) {
            //  se è diverso, costruisco l'URL
            var image = api_img_url_base + dimensione_img + dati.poster_path;
        } else {
            // altrimenti metto il percorso al mio file locale
            // var img = 'img/notavailable.jpg';
            // var imgs = 'image.jpg';
            // var imgs = "images.jpg";
            // var imgs = ".../img/images.jpg";
            // var imgs = "img/not.png";
            // var imgs = '.../img/notavailable.jpg';
            // // var imgs = 'not.jpg';
            var img = document.createElement("img");
            img.src = "not.png";
            var src = document.getElementByClassName("front");
            src.appendChild(img);
        }

        //creo la variabile segnaposto per associare i placeholder alle chiavi ottenute dalla chiamata
        var placeholder = {
            // 'titolo': dati.title,
            'titolo': titolo_card,
            // 'titolo_originale': dati.original_title,
            'titolo_originale': titolo_originale_card,
            'lingua': bandiera_lingua(dati.original_language),
            'voto': stelline(dimezzo_voti(dati.vote_average)),
            'tipo' : tipologia,
            // fatta con la prima parte dell'URL +concateno+ la dimensione + la proprietà che leggo dall'oggetto
            'path_copertina': api_img_url_base + dimensione_img + dati.poster_path,
            'trama' : dati.overview
        };

        var html_card = template(placeholder);
        // appendo la card con i dati del risultato corrente
        $('#risultati-ajax').append(html_card);

    }; //chiudo function disegna_card

    function bandiera_lingua(lingua) {
        // creo un array in cui inserisco il codice delle bandiere che ho a disposizione
        var bandiere_disponibili = ['en', 'it'];
        // se c'è la lingua che sto cercando tra le bandiere disponibili
        if(bandiere_disponibili.includes(lingua)) {
            // devo restituire l'immagine
            // return '<img class="bandiere-img" src="bandiere/' + lingua + '.png" alt-" ' + lingua + ' ">';
            return '<img class="bandiere-img" src="bandiere/' + lingua + '.png" alt=" ' + lingua + ' ">';
        }
        // non c'è la bandierina -> restituisco la stringa così com'è
        return lingua;
    };

    // creo una funzione per dividere in 2 i voti
    function dimezzo_voti(voto){
        var voto_dimezzato = voto / 2;
        // Math.ceil arrotonda per eccesso
        return Math.ceil(voto_dimezzato);
    };


    function stelline(numero_stelle){
        var stelle = '';
        for (var i = 0; i < 5; i++) {
            // stella piena
            if ( i <= numero_stelle ) {
                // L'operatore di assegnazione addizione ( += ) aggiunge un valore a una variabile
                // stella piena
                stelle += '<i id="colore-stella" class="fas fa-star"></i>';
            } else {
                // stella vuota
                stelle += '<i class="far fa-star"></i>';
            }
        }
        return stelle;
    };

}); // chiudo (document.ready)



// var titolo = risultato_corrente.title;
// var titolo_originale = risultato_corrente.original_title;
// var lingua = risultato_corrente.original_language;
// var voto = risultato_corrente.vote_average;
//
// var dati_film = '<ul class="card">';
// dati_film += '<li>' + titolo + '</li>';
// dati_film += '<li>' + titolo_originale + '</li>';
// dati_film += '<li>' + lingua + '</li>';
// dati_film += '<li>' + voto + '</li>';
// dati_film += '</ul>';
// $('#risulati-ajax').append(dati_film)
