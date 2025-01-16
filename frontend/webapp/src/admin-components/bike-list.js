import React, {useState, useEffect} from "react";
import { useLocation, Link } from "react-router-dom";
import cityModel from "../models/city-models";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';

export default function BikeList() {
    const location = useLocation();
    const [bikes, setBikes] = useState([])
    const [allBikes, setAllBikes] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [heading, setHeading] = useState('Alla cyklar')
    const itemsPerPage = 20;

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
            setAllBikes(bikesData);
            setBikes(bikesData);
            // console.log(bikesData)
        } catch (error) {
            console.error("Error fetching city data:", error);
        }
    };

    useEffect(() => {
        //fetching data
        fetchBikes();
        // console.log(bikes)
    }, [location.state]);

    //Button funktions
    const filterLowBattery = () => {
        setBikes(
            allBikes.filter((bike) => (
                bike.batteryPercentage < 30
            ))
        );
        setHeading("Cyklar med låg batterinivå");
        setCurrentPage(1);
    }

    const filterOperational = () => {
        setBikes(
            allBikes.filter((bike) => (
                bike.operational
            ))
        );
        setHeading("Operativa cyklar");
        setCurrentPage(1);
    }

    const filterNotOperational = () => {
        setBikes(
            allBikes.filter((bike) => (
                !bike.operational
            ))
        );
        setHeading("Icke operativa cyklar");
        setCurrentPage(1);
    }

    const filterAvailable = () => {
        setBikes(
            allBikes.filter((bike) => (
                bike.available
            ))
        );
        setHeading("Tillgängliga cyklar")
        setCurrentPage(1);
    }

    const filterNotAvailable = () => {
        setBikes(
            allBikes.filter((bike) => (
                !bike.available
            ))
        );
        setHeading("Otillgängliga cyklar")
        setCurrentPage(1);
    }

    const showAllBikes = () => {
        setBikes(allBikes);
        setHeading("Alla cyklar")
        setCurrentPage(1);
    }

    return  (
        <div>
        <h1>{heading}</h1>
        <button onClick={showAllBikes}>
            Visa alla cyklar
        </button>
        <button onClick={filterLowBattery}>
            Cyklar med låg batterinivå
        </button>
        <button onClick={filterOperational}>
            Operativa cyklar
        </button>
        <button onClick={filterNotOperational}>
            Icke operativa cyklar
        </button>
        <button onClick={filterAvailable}>
            Tillgängliga cyklar
        </button>
        <button onClick={filterNotAvailable}>
            Otillgängliga cyklar
        </button>
        {currentBikes.map((bike) => (
                <div className="bike-list">
                <p>Bike id:{bike._id}</p>
                <p>På laddning: {bike.charging ? "Ja" : "Nej"}, Batteri: {bike.batteryPercentage}%</p>
                <p>Plats: {bike.location}, Tillgänglig: {bike.available ? "Ja" : "Nej"}, Operativ: {bike.operational ? "Ja" : "Nej"}</p>
                <Link to={`/admin/${ location.state.cityName }/single-bike`} state={{
                    bikeId: `${ bike._id }` 
                    }} className="button" >Inställningar & Historik</Link>
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
