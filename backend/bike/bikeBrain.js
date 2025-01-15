const geolib = require('geolib');
const io = require('socket.io-client');

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
        this.customerCurrent = null;
        this.log = [];
        this.cityData = bikeData.cityData;

        this.batteryDrainInter = null;

        this.socket = io();
        this.socket.emit('joinRoom', this.id);
        this.socket.on('startRide', (userId) => {
            this.startRide(userId);
        })
        this.socket.on('endRide', () => {
            this.endRide();
        })
        this.socket.on('updatePosition', (position) => {
            this.updatePosition(position);
        })
    }

    startRide(customer){
        if(!this.available || this.charging || !this.operational){
            console.log("Bike aint available");
            return;
        }

        this.customerCurrent = customer;
        this.available = false;

        const startLog = {
            customer,
            startingPosition: this.position,
            startingLocation: this.location,
            startTime: new Date().toISOString(),
        };
        this.log.push(startLog);

        //en update till db att availavble = false
        console.log(`Cyckeln ${this.id} är uthyrd till ${customer}.`);

        this.batteryDrainInter = setInterval(() => {
            this.drainBattery();
        }, 60000);
    }

    endRide() {
        if (this.customerCurrent) {
            this.findLocation();

            const endLog = {
                endPosition: this.position,
                endLocation: this.location,
                endTime: new Date().toISOString(),
            }
            this.log.push(endLog);

            //rensa loggen
            this.socket.emit("saveRide", {bikeId: this.id, log: this.log, userId: this.customerCurrent});
            console.log(`Cykeln ${this.id} återlämnas av ${this.customerCurrent}. Resan är loggad.`);
            //en update till db att availavble = true
            // this.socket.emit("rideDone", this.customerCurrent);
            this.updateAvailable(true)
            if (this.batteryDrainInter) {
                clearInterval(this.batteryDrainInter)
                this.batteryDrainInter = null;
            }
            this.customerCurrent = null;
        } else {
            console.log("Cykeln är inte i bruk.");
        }
        return;
    }

    drainBattery() {
        if (!this.operational || this.batteryPercentage <= 0) {
            console.log("Bike aint available");
            return;
        }
        const speed = 15;

        const batteryLoss = speed / 25;
        this.batteryPercentage  = Number(batteryLoss.toPrecision(2));

        if (this.batteryPercentage <= 10) {
            console.log("Cykeln måste laddas och stängs av.");
            this.socket.emit("bikeEndRide", this.customerCurrent)
            // endRide();
        }


        this.batteryPercentage = Math.max(this.batteryPercentage, 0);

        console.log(`Hastighet på cyckeln: ${this.id} och har hastiheten: ${speed}km/h. Batterinivå: ${this.batteryPercentage.toFixed(1)}%`);
        this.socket.emit("updateBike", {id: this.id, batteryPercentage: this.batteryPercentage});
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
            setTimeout(() => this.chargingBattery, 60000)
            return;
        }
        if (this.locationInDistance(this.cityData.parkingZones)) {
            this.updateLocation("parkingZone");
            return;
        }
        this.updateLocation("field");
    }

    updatePosition(newPosition) {
        this.position = newPosition;
        this.socket.emit("updateBike", {id: this.id, position: this.position});
        console.log(`Cykeln ${this.id} position uppdaterad till ${newPosition}`);
    }

    updateLocation(newLocation) {
        this.location = newLocation;
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
    }

    chargingBattery(){
        this.batteryPercentage = 100;
        this.socket.emit("updateBike", {id: this.id, batteryPercentage: this.batteryPercentage})
    }

}

module.exports = bikeBrain;