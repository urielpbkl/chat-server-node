import express from "express";
import morgan from "morgan"; //MORGAN PERMITE QUE SE MUESTRE EN CONSOLA LOS REQUEST DEL USUARIO
import { Server as sockeServer } from "socket.io";
import http from 'http'
import cors from 'cors'
import { PORT } from './config.js'

const app = express() //APLICACIÓN DE EXPRESS
const server = http.createServer(app) //LA CONVERTIMOS A UN SERVIDOR "http"
const io = new sockeServer(server, {
    cors: {
        //origin: 'http://127.0.0.1:5173'
        origin: 'https://chatt-app-node.netlify.app/'
    }
})// EL SERVIDOR DE ARRIBA SE LO PASAMOS COMO PARÁMETRO AL SERVIDOR DE WEBSOCKETS


app.use(cors())
app.use((morgan('dev')))

io.on('connection', (socket) => {
    console.log(`Usuario con el id ${socket.id} conectado`)
    socket.on('mensaje-cliente', (mensaje) => {
        socket.broadcast.emit('mensaje-servidor', {
            body: mensaje,
            from: socket.id
        })
    })
})


server.listen(PORT)
console.log(`Servidor corriendo en el puerto ${PORT}`)