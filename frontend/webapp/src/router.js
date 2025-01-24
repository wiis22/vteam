import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./components/home";
import Admin from "./admin-components/admin";
import Balance from "./components/balance";
import Details from "./components/details";
import History from "./components/history";
import Users from "./admin-components/users";
import MapView from "./admin-components/map";
import BikeList from "./admin-components/bike-list";
import City from "./admin-components/city";
import Register from "./components/register";
import Login from "./components/login";
import Logout from "./components/logout";
import ChangePassword from "./components/change-password";
import SingleBike from "./admin-components/single-bike";
import UserRides from "./admin-components/user-rides";

export default function Router() {
    return (
        <BrowserRouter>
        {/* All routes */}
        <Routes>
            <Route index element={<Home />} />
            <Route path="/login" element={<Login  />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/register" element={<Register />} />
            <Route path="/change-password" element={<ChangePassword />} />
            {/* User routes */}
            <Route path="/balance" element={<Balance />} />
            <Route path="/details" element={<Details />} />
            <Route path="/history" element={<History />} />
            {/* Admin routes */}
            <Route path="/admin" element={<Admin />}>
            <Route path="user-rides" element={<UserRides />} />
                <Route path=":city" element={<City />}>
                    <Route path="users" element={<Users />} />
                    <Route path="map" element={<MapView />} />
                    <Route path="list" element={<BikeList />} />
                    <Route path="single-bike" element={<SingleBike />} />
                </Route>
            </Route>
        </Routes>
        </BrowserRouter>
    );
}
