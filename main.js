// MILESTONE 1

$(document).ready(function() {

    // creo una variabile per non rendere troppo statica chiave 'query'
    var ricerca = 'batman';

    // creo l'evento click, dal quale  parte la chiamata ajax
    $('#pulsante-ricerca').click(function(){

        // faccio la chiamata ajax
        $.ajax({
            'url' : 'https://api.themoviedb.org/3/search/movie' ,
            'method' : 'GET',
            'data' : {
                'api_key' :'7664ea64f1d82f8d17473c3821f01535',
                'query' : ricerca,
                'language' : 'it'
            },
            'success' : function(data){
                
            },
            'error' : function(){
                console.log('si è verificato un errore');
            }
        // chiudo la chiamata ajax
        });
    // chiudo la funzione click
    });
// chiudo (document.ready)
});
