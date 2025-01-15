// bikeBrain.test.js
const bikeBrain = require('../bike/bikeBrain');

jest.mock('socket.io-client', () => {
    return jest.fn().mockReturnValue({
        emit: jest.fn(),
        on: jest.fn
    });
});

const mockBikeData = {
    _id: '1234567890',
    city: "Test",
    charging: false,
    position: { lat: 1, lon: 0},
    location: 'field',
    available: true,
    operational: true,
    batteryPercentage: 100,
    cityData: {
        chargingStations: [{ lat: 1, lon: 0}],
        paringZones: [{ lat: 1, lon: 0}]
    }
};

describe('bikeBrain', () => {
    let bike;

    beforeEach(() => {
        bike = new bikeBrain(mockBikeData);
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('sould create a new bike instance correctly', () => {
        //check the instance so it has the correct data.
        expect(bike.id).toBe(mockBikeData._id);
        expect(bike.city).toBe(mockBikeData.city);
        expect(bike.available).toBe(true);
        expect(bike.batteryPercentage).toBe(100);
    });

    it('sould start a ride and update the available status', () => {
        const customer = 'testUser1';

        const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });


        bike.startRide(customer); // denna sätter interval på 60000

        expect(bike.customerCurrent).toBe(customer);
        expect(bike.available).toBe(false);
        // check if the drainBattery have been called at the start of evry min.
        expect(intervalSpy).toHaveBeenCalledTimes(1);
        intervalSpy.mockRestore();
    });


    it('should not start ride if bike is not available', () => {
        const customer = 'testUser2';
        bike.available = false;

        bike.startRide(customer); // denna sätter interval på 60000

        expect(bike.customerCurrent).toBe(null);
        expect(bike.available).toBe(false);
    });

    it('should end ride and update available status', () => {

        const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });

        const timeOutSpy = jest.spyOn(global, 'setTimeout').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });

        bike.startRide('testUser3');

        bike.endRide(); 

        expect(timeOutSpy).toHaveBeenCalledTimes(1);

        expect(bike.customerCurrent).toBe(null);
        expect(bike.available).toBe(true);

        intervalSpy.mockRestore();
        timeOutSpy.mockRestore();
    });

    it('should update position correctly', () => {
        const newPosition = { lat: 0, lon: 1};

        bike.updatePosition(newPosition);

        expect(bike.position).toBe(newPosition);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, position: newPosition })
    });

    it('should update location correctly', () => {
        const newLocation = "chargingStation";

        bike.updateLocation(newLocation);

        expect(bike.location).toBe(newLocation);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, location: newLocation })
    });

    it('should update available status when charging', () => {
        bike.updateCharging(true);

        expect(bike.available).toBe(false);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, available: false })
    });

    it('should drain battery during ride', () => {
        const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });


        bike.startRide('testUser4'); // denna sätter interval på 60000

        expect(bike.batteryPercentage).toBeLessThan(100);
        intervalSpy.mockRestore(1);
    });

    it('should charge a drained battery to 100%', () => {
        bike.batteryPercentage = 50;
        bike.chargingBattery();

        expect(bike.batteryPercentage).toBe(100);
    });

    it('should not drain battery if bike is not operational', () => {
        bike.operational = false;
        bike.drainBattery();
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, batteryPercentage: 100 })
        expect(bike.batteryPercentage).toBe(100);
    });

    it('should correctly calculate the distance from a point', () => {
        const refPoint = [{ lat: 1, lon: 0}]
        bike.position = { lat: 1, lon: 0}

        const res = bike.locationInDistance(refPoint);

        expect(res).toBe(true);
    });
});

