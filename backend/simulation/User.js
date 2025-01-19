// User class
// const fetch = require('node-fetch');
const io = require('socket.io-client'); 

const API_URL = 'http://localhost:1337';

class User {
    constructor(userIndex) {
        this.userIndex = userIndex;
        this.socket = null;
        this.userId = null;
        this.bikeId = null;
    }

    async register() {
        const userId = await fetchRegister(this.userIndex);
        this.setUserId(userId);
    }

    getRegisterPromise() {
        const promise = fetchRegister(this.userIndex, true)
        return promise;
    }

    setUserId(userId) {
        this.userId = userId;
        this.setupSocket();
    }

    setupSocket() {
        this.socket = io(API_URL);
        this.socket.emit('joinRoom', { roomName: this.userId });
        this.socket.on('bikeStartRideResponse', (data) => {
            console.log("User retreived data from socket route bikeStartRideResponse")
            console.log(data)
            if (data.started) {
                this.rideStarted(data.bikeId)
            }
        })
        this.socket.on('bikeEndRide', () => {
            this.endRide();
        });
        this.socket.on('rideDone', () => {
            // This happens when ride is done and saved to the database by the bike/API
            // not sure yet what will happen here in the simulation
        });
    }

    startRide(bikeId) {
        console.log("startRide() in User called with bikeId", bikeId)
        this.socket.emit('startRide', { userId: this.userId, bikeId: bikeId });
    }

    rideStarted(bikeId) {
        console.log("rideStarted() called with bikeId", bikeId)
        this.bikeId = bikeId
    }

    sendPosition(position) {
        this.socket.emit('updatePosition', { bikeId: this.bikeId, position, position })
    }

    endRide() {
        this.socket.emit('userEndRide', { bikeId: this.bikeId });
        this.bikeId = null;
    }

    delete() {
        this.socket.disconnect();
        const deletePromise = fetchDelete(this.userId);
        return deletePromise;
    }
}

async function fetchDelete(userId) {
    const promise = fetch(`${API_URL}/api/user/${userId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 1337`
        }
    })

    return promise;
}

async function fetchRegister(userIndex, returnPromise = false) {
    const registerData = {
        email: `user${userIndex}@gmail.com`,
        password: `password${userIndex}`,
        firstName: `John${userIndex}`,
        lastName: `Doe${userIndex}`,
    };

    if (returnPromise) {
        const promise = fetch(`${API_URL}/api/user`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer 1337`
            },
            body: JSON.stringify(registerData)
        })
        return promise;
    }

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
