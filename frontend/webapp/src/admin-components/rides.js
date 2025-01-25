import React, {useState, useEffect} from "react";
import jsPDF from "jspdf"; 
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
            console.log(id)
            setRides(ridesData);
            console.log(ridesData)
        } catch (error) {
            console.error("Error fetching rides data:", error);
            console.log(id)
        }
    };

    //Button function to save receipt
    const saveReceipt = (ride) => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(`Kvitto för resa ${ride._id}`, 10, 10);

        doc.setFontSize(12);
        doc.text(`Starttid: ${ride.startTime}`, 10, 20);
        doc.text(`Sluttid: ${ride.endTime}`, 10, 30);
        doc.text(`Total tid: ${ride.rideLengthSeconds} sekunder`, 10, 40);
        doc.text(`Pris: ${ride.price} Kr`, 10, 50);

        doc.save(`kvitto_${ride._id}.pdf`);
    };

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
                                <button onClick={() => saveReceipt(ride)}>
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
