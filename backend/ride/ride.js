/**
 * Functions to calculate values for a ride.
 */

const ride = {
    getPrice: function (startLocation, endLocation, startTime, endTime) {
        const startCost = 10;
        const pricePerMin = 3;
        let priceOffset = 0;

        if (startLocation === "field") {
            priceOffset -= 10;
        }
        if (endLocation === "field") {
            priceOffset += 10;
        }

        const rideLengthSeconds = this.getLengthSeconds(startTime, endTime);
        const price = Math.round(startCost + (pricePerMin * rideLengthSeconds) / 60 + priceOffset);

        return price;
    },

    getLengthSeconds: function (startTime, endTime) {
        const startDate = new Date(startTime);
        const endDate = new Date(endTime);
        return (endDate - startDate) / 1000;
    }
}

module.exports = ride;
