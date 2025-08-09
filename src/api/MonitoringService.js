import axiosInstance from "@/config/http.config";
import { io } from "socket.io-client";
const baseURL = process.env.VUE_APP_BASE_URL;
// const baseWebsocket = process.env.VUE_APP_WEB_SOCKET;
export function listmonitoringApi(token) {
  return axiosInstance.get(`${baseURL}/monitoring`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


let socket = null;

/**
 * Conecta al servidor de Socket.IO y configura los eventos.
 * @param {Function} onMonitoringUpdate - Callback para manejar el evento `monitoringUpdate`.
 * @param {Function} onError - Callback para manejar errores de la conexión.
 */
export function connectMonitoringSocket(onMonitoringUpdate, onError, customerid) {
  // URL estática para la conexión al servidor Socket.IO
  const staticSocketURL = "http://67.205.184.183:3000"; // Reemplaza con tu URL de WebSocket
  console.log(customerid , "<<<<>>>>>")
  // Crear la conexión al servidor Socket.IO
  socket = io(staticSocketURL, {
    // transports: ["websocket"], // Forzar transporte WebSocket
    extraHeaders: {
      auth: customerid,
    },
  });

  // Escuchar conexión exitosa
  socket.on("connect", () => {
    console.log("Conexión establecida con el servidor de Socket.IO");
  });

  // Escuchar el evento `monitoringUpdate`
  socket.on("monitoringUpdate", (data) => {
    console.log("Evento monitoringUpdate recibido:", data);
    if (onMonitoringUpdate) {
      onMonitoringUpdate(data);
    }
  });

  // Manejar errores
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
export function disconnectMonitoringSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
