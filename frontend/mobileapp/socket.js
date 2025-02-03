/* global io */

import { baseURL } from "./utils.js";

class Socket {
    constructor(userId, serverURL = baseURL) {
        this.userId = userId;
        this.serverURL = serverURL;
        this.socket = null;
        this.bikeId = null;
        this.logMessages = true;
        this.onRideDone = null;
    }

    // Log messages if debug mode is enabled
    log(message, data = null) {
        if (this.logMessages) {
            console.log("Socket: ", message, data);
        }
    }

    // Setup the socket connection and event listeners
    setupSocket() {
        this.socket = io(this.serverURL);

        // Handle connection event
        this.socket.on('connect', () => {
            this.log("Connected to server");
            this.socket.emit('joinRoom', { roomName: this.userId });
            this.log("User joined room", this.userId);
        });

        // Handle bike start ride response
        this.socket.on('bikeStartRideResponse', (data) => {
            this.log("Received bikeStartRideResponse", data);
            if (data.started) {
                this.rideStarted(data.bikeId);
            }
        });

        // Handle bike end ride event
        this.socket.on('bikeEndRide', () => {
            this.endRide();
        });

        // Handle ride done event
        this.socket.on('rideDone', (data) => {
            this.log("Ride completed:", data);
            if (this.onRideDone) {
                this.onRideDone(data);
            }
        });

        // Ensure disconnect is called when the window is closed or refreshed
        window.addEventListener('beforeunload', () => {
            this.disconnect();
        });
    }

    // Handle ride started event
    rideStarted(bikeId) {
        this.log("rideStarted() called with bikeId", bikeId);
        this.bikeId = bikeId;
    }

    // Start a ride by emitting the startRide event
    startRide(bikeId) {
        this.log("startRide() called with bikeId", bikeId);
        this.bikeId = bikeId;
        this.socket.emit('startRide', { userId: this.userId, bikeId: bikeId });
    }

    // Send the current position of the bike
    sendPosition(position) {
        console.log("Sending position:", position);
        this.socket.emit('updatePosition', { bikeId: this.bikeId, position });
    }

    // End the ride by emitting the userEndRide event
    endRide() {
        this.log("Ending ride for bikeId:", this.bikeId);
        this.socket.emit('userEndRide', { bikeId: this.bikeId });
        this.bikeId = null;
    }

    // Disconnect the socket and remove event listeners
    disconnect() {
        this.log("Disconnecting socket...");
        this.socket.off('bikeStartRideResponse');
        this.socket.off('bikeEndRide');
        this.socket.off('rideDone');
        this.socket.disconnect();
        this.log("Socket disconnected");
    }
}

export default Socket;