import React, {useState, useEffect} from "react";
import cityModel from "../models/city-models";
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import OneUser from "./one-user";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [heading, setHeading] = useState('Alla användare');
    const [searchedUsers, setSearchedUsers] = useState('');
    const itemsPerPage = 20;
    document.title = "Användare"

    //sets start index
    const startIndex = (currentPage - 1) * itemsPerPage;
    //sets current users per page
    const currentUsers = users.slice(startIndex, startIndex + itemsPerPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Fetch users and get data
    const fetchUsers = async () => {
        try {
            const usersData = await cityModel.getUsers();
            setAllUsers(usersData);
            setUsers(usersData);

        } catch (error) {
            console.error("Error fetching users data:", error);
        }
    };

    useEffect(() => {
        //fetching data
        fetchUsers();
    }, []);

    //Button functions
    const filterAdmins = async () => {
        await fetchUsers();
        setUsers(
            allUsers.filter((user) => (
                user.role === "admin"
            ))
        );
        console.log(users)
        setHeading("Admin användare");
        setCurrentPage(1);
    }

    const filterBannedUsers = async () => {
        await fetchUsers();
        setUsers(
            allUsers.filter((user) => (
                user.role === "banned"
            ))
        );
        setHeading("Bannade användare")
        setCurrentPage(1);
    }

    const filterNonAdmin = async () => {
        await fetchUsers();
        setUsers(
            allUsers.filter((user) => (
                user.role !== "admin"
            ))
        );
        setHeading("Icke admin användare")
        setCurrentPage(1);
    }

    const showAllUsers = () => {
        setUsers(allUsers);
        setHeading("Alla användare")
        setCurrentPage(1);
    }

    //handle search submit
    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        setUsers(
            allUsers.filter((user) => (
                //Search on string that includes full name and email
                user.firstName.toLowerCase().includes(searchedUsers.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchedUsers.toLowerCase()) ||
                user.email.toLowerCase().includes(searchedUsers.toLowerCase())
            ))
        );
        setHeading(`Sök på användare "${searchedUsers}"`);
        setSearchedUsers("");
        setCurrentPage(1);
    }

    return  (
        <div>
        <h2>{heading} (antal: {users.length})</h2>

        <p>   
        <form onSubmit={handleSearchSubmit}>
            <p><label>Sök användare: </label></p>
            <input className='textarea'
                    type="text"
                    value={searchedUsers}
                    placeholder='Sök på användare eller namn'
                    onChange={(e) => setSearchedUsers(e.target.value)}
                    required
            />
            <input type="submit" value="Sök"/>
        </form>
        </p>

        <button onClick={showAllUsers}>
            Alla användare
        </button>

        <button onClick={filterNonAdmin}>
            Icke admin användare
        </button>

        <button onClick={filterBannedUsers}>
            Bannade användare
        </button>

        <button onClick={filterAdmins}>
            Admins
        </button>

        {currentUsers.map((user) => <OneUser user={user} />)}
        <ResponsivePagination
        current={currentPage}
        total={Math.ceil(users.length / itemsPerPage)}
        onPageChange={handlePageChange}
        />
        </div>
    );
};
