import { io } from "socket.io-client";

let socket = null;

/**
 * Conecta al servidor de Socket.IO y configura los eventos.
 * @param {Function} onNotificationUpdate - Callback para manejar el evento `notificationUpdate`.
 * @param {Function} onGatewayUpdate - Callback para manejar el evento `stateGatewayUpdate`.
 * @param {Function} onError - Callback para manejar errores de la conexión.
 * @param {String} customerid - ID del cliente para autenticación.
 */
export function connectNotificationSocket(onNotificationUpdate, onGatewayUpdate, onError, customerid) {
  const staticSocketURL = "https://api.bwasi.maquiadev.com";

  // Crear la conexión al servidor de Socket.IO
  socket = io(staticSocketURL, {
    extraHeaders: {
      auth: customerid,
    },
  });

  // Escuchar conexión exitosa
  socket.on("connect", () => {
    console.log("Conexión establecida con el servidor de Socket.IO");
  });

  // Escuchar el evento `notificationUpdate`
  socket.on("notificationUpdate", (data) => {
    console.log("Evento notificationUpdate recibido:", data);
    if (onNotificationUpdate) {
      onNotificationUpdate(data);
    }
  });

  // Escuchar el evento `stateGatewayUpdate`
  socket.on("stateGatewayUpdate", (data) => {
    console.log("Evento stateGatewayUpdate recibido:", data);
    if (onGatewayUpdate) {
      onGatewayUpdate(data);
    }
  });

  // Manejar errores de conexión
  socket.on("connect_error", (error) => {
    console.error("Error de conexión Socket.IO:", error);
    if (onError) {
      onError(error);
    }
  });

  // Manejar desconexión
  socket.on("disconnect", () => {
    console.log("Conexión Socket.IO cerrada.");
  });
}

/**
 * Desconecta el cliente de Socket.IO.
 */
export function disconnectNotificationSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
