const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const usuarios = new Usuarios();
const { crearMensaje } = require('../utils/utils');

io.on('connection', (client) => {

    client.on('entrarChat', function(usuario, callback) {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                ok: false,
                mensaje: 'no viene el nombre o la sala'
            });
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listaPersonas', usuarios.getPersonasPorSala(usuario.sala));
        client.broadcast.to(usuario.sala).emit('crearMensaje', crearMensaje('Admin', `${usuario.nombre} se unió al chat`));
        callback(usuarios.getPersonasPorSala(usuario.sala));

    });

    client.on('disconnect', () => {
        let personaDesconectada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaDesconectada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaDesconectada.nombre} abandonó el chat`));
        client.broadcast.to(personaDesconectada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaDesconectada.sala));
    });

    client.on('crearMensaje', (data, callback) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);
        callback(mensaje);
    });

    //mensajes privados
    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });
});