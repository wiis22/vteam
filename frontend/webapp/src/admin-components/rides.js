import React, {useState, useEffect} from "react";
import ridesModel from "../models/rides";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

//Arg, set to "bike" or "user", id: user or bike id, receipt: true or false
const Rides = ({ userOrBike, id, receipt }) => {
    const [rides, setRides] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const receiptButton= receipt
    const itemsPerPage = 10;

    useEffect(() => {
        //fetching data
        fetchRides();
    }, []);

    //sets start index
    const startIndex = (currentPage - 1) * itemsPerPage;
    //sets current rides per page
    const currentRides = rides.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Fetch rides and get data
    const fetchRides = async () => {
        try {
            const ridesData = await ridesModel.getRides(userOrBike, id);
            setRides(ridesData);
            console.log(ridesData)
        } catch (error) {
            console.error("Error fetching rides data:", error);
        }
    };

    //Button functions
    const handleClickReceipt = () => {

    }

    return (
        <div>
            {rides.length === 0 ? (
                <p>No rides to show</p>
            ) : (
                <div>
                    {currentRides.map((ride) => (
                        <div className="ride-list" key={ride._id}>
                            <p>Ride id: {ride._id}</p>
                            <p>Start: {ride.startTime}, Slut: {ride.endTime}, Totaltid: {ride.rideLengthSeconds}</p>
                            <p>Pris: {ride.price}</p>
                            {receiptButton && (
                                <button onClick={handleClickReceipt}>
                                    Kvitto
                                </button>
                            )}
                        </div>
                    ))}
                    <ResponsivePagination
                        current={currentPage}
                        total={Math.ceil(rides.length / itemsPerPage)}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
    
};

export default Rides;
