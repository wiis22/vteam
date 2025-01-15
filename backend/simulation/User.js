// User class
const fetch = require('node-fetch');
const io = require('socket.io-client'); 

const API_URL = 'http://localhost:1337';

class User {
    constructor(userIndex) {
        this.userIndex = userIndex;
        this.socket = null;
        this.userId = null;
        this.bikeId = null;

        this.setupSocket();
    }

    async register() {
        const userId = await fetchRegister(this.userIndex);
        this.userId = userId;
    }

    setupSocket() {
        this.socket = io(API_URL);
        this.socket.emit('joinRoom', { userId: this.userId });
        this.socket.on('bikeEndRide', () => {
            this.endRide();
        });
        this.socket.on('rideDone', () => {
            // This happens when ride is done and saved to the database by the bike/API
            // not sure yet what will happen here in the simulation
        });
    }

    async startRide(bikeId) {
        this.bikeId = bikeId;
        this.socket.emit('startRide', { userId: this.userId, bikeId: this.bikeId });
    }

    async endRide() {
        this.socket.emit('endRide', { bikeId: this.bikeId });
        this.bikeId = null;
    }
}

async function fetchRegister(userIndex) {
    const registerData = {
        email: `user${userIndex}@gmail.com`,
        password: `password${userIndex}`,
        firstName: `John${userIndex}`,
        lastName: `Doe${userIndex}`,
    };

    const response = await fetch(`${API_URL}/api/user`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        },
        body: JSON.stringify(registerData)
    })

    const data = await response.json();

    return data.userId;
}

module.exports = User;
