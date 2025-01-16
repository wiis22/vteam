import { baseURL } from "./utils.js";

const socket = io("localhost:1337");

socket.on('connect', () => {
    console.log('Socket.IO connection established');
});

socket.on('message', (data) => {
    console.log('Socket.IO message received:', data);
    // Handle incoming messages
});

socket.on('disconnect', () => {
    console.log('Socket.IO connection disconnected');
});

socket.on('error', (error) => {
    console.error('Socket.IO error:', error);
});

export default socket;