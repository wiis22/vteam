// bikeBrain.test.js
const bikeBrain = require('../bike/bikeBrain');

jest.mock('socket.io-client', () => {
    return jest.fn().mockReturnValue({
        emit: jest.fn(),
        on: jest.fn()
    });
});

const mockBikeData = {
    _id: '123456789000000987654321',
    city: "Test",
    charging: false,
    position: { lat: 1, lon: 0},
    location: 'field',
    available: true,
    operational: true,
    batteryPercentage: 100,
    cityData: {
        chargingStations: [{ lat: 1, lon: 0}],
        parkingZones: [{ lat: 10, lon: 0}]
    }
};

describe('bikeBrain', () => {
    let bike;
    let intervalSpy;
    let timeOutSpy;

    beforeEach(() => {
        jest.useFakeTimers();

        intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });
        timeOutSpy = jest.spyOn(global, 'setTimeout').mockImplementationOnce((callback, delay) => {
            callback();
            return 1;
        });;

        bike = new bikeBrain(mockBikeData);
    });

    afterEach(() => {
        intervalSpy.mockRestore();
        timeOutSpy.mockRestore();
        jest.restoreAllMocks();
        bike = null;
    });

    it('should create a new bike instance correctly', () => {
        expect(bike.id).toBe(mockBikeData._id);
        expect(bike.city).toBe(mockBikeData.city);
        expect(bike.available).toBe(true);
        expect(bike.batteryPercentage).toBe(100);
    });

    
    it('should join room when a bike instance is created', () => {
        expect(bike.socket.emit).toHaveBeenCalledWith('joinRoom', { roomName: mockBikeData._id });
    });


    it('should just return if endRide is called without a current customer', () => {
        bike.endRide();

        expect(bike.currentCustomer).toBe(null);
        expect(bike.available).toBe(true);
    });


    it('should start a ride and update the available status', () => {
        const customer = 'testUser1';
        bike.available = true;
        // const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
        //     callback();
        //     return 1;
        // });

        bike.startRide(customer); //interval på 60000

        // console.log("bike: ",bike);
        

        expect(bike.currentCustomer).toBe(customer);
        expect(bike.available).toBe(false);
        // check if the drainBattery have been called at the start of every min.
        expect(intervalSpy).toHaveBeenCalledTimes(1);
        // intervalSpy.mockRestore();
    });


    it('should not start ride if bike is not available', () => {
        const customer = 'testUser2';
        bike.available = false;

        bike.startRide(customer); //interval på 60000

        expect(bike.currentCustomer).toBe(null);
        expect(bike.available).toBe(false);
    });

    it('should end ride and update available status', () => {

        // const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
        //     callback();
        //     return 1;
        // });

        // const timeOutSpy = jest.spyOn(global, 'setTimeout').mockImplementationOnce((callback, delay) => {
        //     callback();
        //     return 1;
        // });

        bike.startRide('testUser3');

        bike.endRide();

        expect(intervalSpy).toHaveBeenCalledTimes(1);

        expect(timeOutSpy).toHaveBeenCalledTimes(2);

        expect(bike.currentCustomer).toBe(null);
        expect(bike.available).toBe(true);

        // intervalSpy.mockRestore();
        // timeOutSpy.mockRestore();
    });

    it('should change battery %', () => {
        expect(bike.operational).toBe(true);
        bike.batteryPercentage = 11;
        bike.drainBattery();

        // expect(bike.socket.emit).toHaveBeenCalledWith("bikeEndRide", { userId: bike.currentCustomer });
        expect(bike.batteryPercentage).toBe(10.9);
        // expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, operational: false });
    });

    it('should update position correctly', () => {
        const newPosition = { lat: 0, lon: 1};

        bike.updatePosition(newPosition);

        expect(bike.position).toBe(newPosition);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, position: newPosition });
    });

    it('should update location correctly', () => {
        const newLocation = "chargingStation";

        // const timeOutSpy = jest.spyOn(global, 'setTimeout').mockImplementationOnce((callback, delay) => {
        //     callback();
        //     return 1;
        // });

        bike.updateLocation(newLocation); //setTimeout på 60000

        expect(bike.location).toBe(newLocation);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, location: newLocation });
        expect(timeOutSpy).toHaveBeenCalledTimes(1);
        // timeOutSpy.mockRestore();
    });

    it('should update available status when charging', () => {
        bike.updateCharging(true);

        expect(bike.available).toBe(false);
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, available: false });
    });

    it('should drain battery during ride', () => {
        // const intervalSpy = jest.spyOn(global, 'setInterval').mockImplementationOnce((callback, delay) => {
        //     callback();
        //     return 1;
        // });


        bike.startRide('testUser4'); // interval på 60000

        expect(bike.batteryPercentage).toBeLessThan(100);
        // intervalSpy.mockRestore(1);
    });

    it('should charge a drained battery to 100%', () => {
        bike.batteryPercentage = 50;
        bike.chargingBattery();

        expect(bike.batteryPercentage).toBe(100);
    });

    it('should not drain battery if bike is not operational', () => {
        bike.operational = false;
        bike.drainBattery();
        expect(bike.socket.emit).toHaveBeenCalledWith("updateBike", { id: bike.id, batteryPercentage: 100 });
        expect(bike.batteryPercentage).toBe(100);
    });

    it('should correctly calculate the distance from a point', () => {
        const refPoint = [{ lat: 1, lon: 0}];
        bike.position = { lat: 1, lon: 0};

        const res = bike.locationInDistance(refPoint);

        expect(res).toBe(true);
    });

    it('should find a parkingZone if within distance', () => {
        bike.position = { lat: 10, lon: 0};
        bike.findLocation();

        expect(bike.location).toBe("parkingZone");
    });

    it('should be in field if not within a distance of a refpoit', () => {
        bike.position = { lat: 0, lon: 0};
        bike.findLocation();

        expect(bike.location).toBe("field");
    });
});

