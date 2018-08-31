var socket = io();
var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son requeridos');
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    socket.emit('entrarChat', usuario, function(data) {
        console.log('Usuarios conectados ', data);
    });
});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});

socket.on('listaPersonas', function(data) {
    console.log(data);
});


// Enviar información
socket.emit('crearMensaje', { usuario: 'Fernando', mensaje: 'Hola Mundo' }, function(resp) {

});

// Escuchar información
socket.on('crearMensaje', function(mensaje) {

    console.log(mensaje);

});

//mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('mensaje privado', mensaje);
});