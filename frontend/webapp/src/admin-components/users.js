import React, {useState, useEffect} from "react";
import adminModel from "../models/admin-models";
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

    useEffect(() => {
        //fetching data
        fetchUsers();
    }, []);

    //sets start index
    const startIndex = (currentPage - 1) * itemsPerPage;
    let currentUsers = [];
    //sets current users per page
    if(users.length !== 0) {
        currentUsers = users.slice(startIndex, startIndex + itemsPerPage);
    }

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    //Fetch users and get data
    const fetchUsers = async () => {
        try {
            const usersData = await adminModel.getUsers();
            setAllUsers(usersData);
            setUsers(usersData);

        } catch (error) {
            console.error("Error fetching users data:", error);
        }
    };

    //handle search submit
    const handleSearchSubmit = async (event) => {
        event.preventDefault();

        //fetch user for new status updates.
        await fetchUsers();

        setUsers(
            allUsers.filter((user) => (
                //Search on string that includes full name and email
                user.firstName.toLowerCase().includes(searchedUsers.toLowerCase()) ||
                user.lastName.toLowerCase().includes(searchedUsers.toLowerCase()) ||
                user.email.toLowerCase().includes(searchedUsers.toLowerCase()) ||
                user.role.toLowerCase().includes(searchedUsers.toLowerCase())
            ))
        );
        setHeading(`Sökt på "${searchedUsers}"`);
        setSearchedUsers("");
        setCurrentPage(1);
    }

    return  (
        <div>
        <h2>{heading} (antal: {users.length})</h2>

        <p>   
        <form onSubmit={handleSearchSubmit}>
            <p><label>Sök på användarnamn, namn eller användarstatus(banned, user, admin): </label></p>
            <input className='textarea'
                    type="text"
                    value={searchedUsers}
                    placeholder='Sök användare, namn eller status'
                    onChange={(e) => setSearchedUsers(e.target.value)}
            />
            <input type="submit" value="Sök"/>
        </form>
        </p>

        {currentUsers.map((user) => <OneUser user={user} />)}
        <ResponsivePagination
        current={currentPage}
        total={Math.ceil(users.length / itemsPerPage)}
        onPageChange={handlePageChange}
        />
        </div>
    );
};
