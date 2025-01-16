import React, {useState, useEffect} from "react";
import { useLocation } from "react-router-dom";
import cityModel from "../models/city-models";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

export default function BikeList() {
    const location = useLocation();
    const [bikes, setBikes] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;
    // const [totalPages, setTotalPages] = useState(0);
    // const [listOfPages, setListOfPages] = useState([]);

    //sets start index
    const startIndex = (currentPage - 1) * itemsPerPage;
    //sets current bikes per page
    const currentBikes = bikes.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Fetch bikes and get data
    const fetchBikes = async () => {
        try {
            const bikesData = await cityModel.getBikes(location.state.cityName);
            setBikes(bikesData);
            // console.log(bikesData)
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    useEffect(() => {
        //fetching data
        fetchBikes();
        console.log(bikes)
    }, [location.state]);

    return  (
        <div>
        <h1>Cykel lista</h1>
        {currentBikes.map((bike) => (
                <div className="bike-list">
                <p>Bike id:{bike._id}</p>
                <p>På laddning: {bike.charging ? "Yes" : "No"}, Batteri: {bike.batteryPercentage}%</p>
                <p>Plats: {bike.location}, Tillgänglig: {bike.available ? "Yes" : "No"}, Operativ: {bike.operational ? "Yes" : "No"}</p>
                <button>
                    Inställningar
                </button>
                </div>        
            ))}
        <ResponsivePagination
        current={currentPage}
        total={Math.ceil(bikes.length / itemsPerPage)}
        onPageChange={handlePageChange}
        />
        </div>
    );
};
