const geolib = require('geolib');
const io = require('socket.io-client');

const API_URL = 'http://localhost:1337';

class bikeBrain {
    constructor(bikeData) {
        this.id = bikeData._id;
        this.city = bikeData.city;
        this.charging = bikeData.charging;
        this.position = bikeData.position;
        this.location = bikeData.location; //i.e "field"
        this.available = bikeData.available;
        this.operational = bikeData.operational;
        this.batteryPercentage = bikeData.batteryPercentage;

        this.currentCustomer = null;

        this.log = {};
        this.cityData = bikeData.cityData;

        this.batteryDrainInter = null;

        this.socket = io(API_URL);
        this.socket.emit('joinRoom', {roomName: this.id});
        this.socket.on('startRide', (data) => {
            this.socket.emit('bikeStartRideResponse', {userId: data.userId, bikeId: this.id, started: this.available})
            if (this.available) {
                this.startRide(data.userId);
            }
        })
        this.socket.on('endRide', () => {
            this.endRide();
        })
        this.socket.on('updatePosition', (data) => {
            this.updatePosition(data.position);
        })
    }

    startRide(customer){
        if(!this.available || this.charging || !this.operational){
<<<<<<< HEAD
<<<<<<< HEAD
            //borde lägga till en emit här
=======
>>>>>>> dcd3543 (Fixed some errors)
=======
            //borde lägga till en emit här
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
            console.log("Bike not available");
            return;
        }

        this.currentCustomer = customer;
        this.available = false;

        const startLog = {
            startPosition: this.position,
            startLocation: this.location,
            startTime: new Date().toISOString(),
        };
        Object.assign(this.log, startLog);

        //en update till db att availavble = false
        console.log(`bikeId ${this.id} rented by userId ${customer}.`);

        // Drain battery every minute
        this.batteryDrainInter = setInterval(() => {
            this.drainBattery();
<<<<<<< HEAD
        }, 6000);
=======
        }, 60000);
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
        return;
    }

    endRide() {
        if (this.currentCustomer) {
            this.findLocation(); //kollar även om cykeln ska laddas

            const endLog = {
                endPosition: this.position,
                endLocation: this.location,
                endTime: new Date().toISOString(),
            }
            Object.assign(this.log, endLog);

            //rensa loggen
            this.socket.emit("saveRide", {bikeId: this.id, log: this.log, userId: this.currentCustomer});
            console.log(`Cykeln ${this.id} återlämnas av ${this.currentCustomer}. Resan är loggad.`);
            //en update till db att availavble = true
            this.updateAvailable(true)
            if (this.batteryDrainInter) {
                clearInterval(this.batteryDrainInter)
                this.batteryDrainInter = null;
            }
            this.currentCustomer = null;
        } else {
            console.log("Cykeln är inte i bruk.");
        }
        return;
    }

    drainBattery() {
<<<<<<< HEAD
<<<<<<< HEAD
        if (!this.operational || this.batteryPercentage <= 10) {
=======
        if (!this.operational || this.batteryPercentage <= 0) {
>>>>>>> dcd3543 (Fixed some errors)
=======
        if (!this.operational || this.batteryPercentage <= 10) {
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
            console.log("Bike not available");
            return;
        }
        const speed = 15;
<<<<<<< HEAD
        const batteryLoss = (speed / 15) / 10;
        this.batteryPercentage -= Number(batteryLoss.toPrecision(2));
=======
        const batteryLoss = speed / 15;
<<<<<<< HEAD
        this.batteryPercentage  = this.batteryPercentage - Number(batteryLoss.toPrecision(2));
>>>>>>> dcd3543 (Fixed some errors)
=======
        this.batteryPercentage -= Number(batteryLoss.toPrecision(2));
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)

        if (this.batteryPercentage <= 10) {
            console.log("Cykeln måste laddas och stängs av.");
            this.socket.emit("bikeEndRide", { userId: this.currentCustomer})
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
            this.updateOperational(false); //cykeln är fortfarande unAvailable det är operational som är borde sättas till false
=======
            this.socket.updateOperational(false); //cykeln är fortfarande unAvailable det är operational som är borde sättas till false
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
=======
            this.updateOperational(false); //cykeln är fortfarande unAvailable det är operational som är borde sättas till false
>>>>>>> d623c05 (made some changes to bikebrain and fixed test for better coverage.)

            //tar bort intervallet så att den inte fortsätter att dra batteri
            clearInterval(this.batteryDrainInter)
            this.batteryDrainInter = null;

            this.socket.emit("updateBike", {id: this.id, batteryPercentage: this.batteryPercentage});
            return;
<<<<<<< HEAD
            // this.endRide(); // not used here as mobile app/user gets emit above and will end it like normal
        }

=======
            this.socket.updateAvailable(false);
=======
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
            // this.endRide(); // not used here as mobile app/user gets emit above and will end it like normal
        }

>>>>>>> dcd3543 (Fixed some errors)
        this.batteryPercentage = Math.max(this.batteryPercentage, 0);

        console.log(`Cykel ${this.id}. Batterinivå: ${this.batteryPercentage.toFixed(1)}%`);
        console.log("userId", this.currentCustomer);
        this.socket.emit("updateBike", {id: this.id, batteryPercentage: this.batteryPercentage});
        return;
    }

    locationInDistance(refPoint) {
        for (let point of refPoint) {
            const distance = geolib.getDistance(this.position, point)
            if (distance <= 20) { // 20 m runt punkt
                return true;
            }
        }
        return false;
    }

    findLocation() {
        if (this.locationInDistance(this.cityData.chargingStations)) {
            this.updateLocation("chargingStation");
            this.updateCharging(true);
            setTimeout(() => this.chargingBattery(), 60000)
            return;
        }
        if (this.locationInDistance(this.cityData.parkingZones)) {
            this.updateLocation("parkingZone");
            return;
        }
        this.updateLocation("field");
        return;
    }

    updatePosition(newPosition) {
        console.log("Bike: updatePosition() called with newPosition: ", newPosition)
        this.position = newPosition;
        this.socket.emit("updateBike", {id: this.id, position: this.position});
        console.log(`Cykeln ${this.id} position uppdaterad till ${newPosition}`);
        return;
    }

    updateLocation(newLocation) {
        this.location = newLocation;
<<<<<<< HEAD
<<<<<<< HEAD
        if (this.location == "chargingStation") {
=======
        if (this.location === "chargingStation") {
>>>>>>> 59c11e6 (Added a GracefulShutdown setup for simulation and fixed some issues.)
=======
        if (this.location == "chargingStation") {
>>>>>>> d623c05 (made some changes to bikebrain and fixed test for better coverage.)
            this.updateCharging(true);
            setTimeout(() => this.chargingBattery(), 60000);
        }
        this.socket.emit("updateBike", {id: this.id, location: this.location});
        return;
    }

    updateAvailable(status) {
        this.available = status;
        this.socket.emit("updateBike", {id: this.id, available: this.available});
        return;
    }

    updateOperational(status) {
        this.operational = status;
        this.socket.emit("updateBike", {id: this.id, operational: this.operational});
        return;
    }

    updateCharging(status) {
        this.charging = status;
        this.socket.emit("updateBike", {id: this.id, charging: this.charging});
        this.updateAvailable(!status);
        console.log(`Cykeln ${this.id} : ${status ? "laddar" : "avslutar laddningen"}`);
        return;
    }

    chargingBattery(){
        this.batteryPercentage = 100;
        this.socket.emit("updateBike", {id: this.id, batteryPercentage: this.batteryPercentage});
        return;
    }

}

module.exports = bikeBrain;
