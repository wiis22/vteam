import React from "react";
import { BrowserRouter, Routes, Route} from "react-router-dom";

import Home from "./components/home";
import Admin from "./components/admin";
import Balance from "./components/balance";
import Details from "./components/details";
import History from "./components/history";
import Navbar from "./components/navbar";
import Users from "./components/users";
import MapView from "./components/map";
import BikeList from "./components/bike-list";
import City from "./components/city";
import Register from "./components/register";
import Login from "./components/login";
import Logout from "./components/logout";
import ChangePassword from "./components/change-password";

export default function Router() {
    return (
        <BrowserRouter>
        {/* All routes */}
        <Routes>
            <Route path="/" element={<Navbar />}>

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
                <Route path=":city" element={<City />}>
                <Route path="users" element={<Users />} />
                <Route path="map" element={<MapView />} />
                <Route path="list" element={<BikeList />} />
                </Route>
            </Route>
            </Route>
        </Routes>
        </BrowserRouter>
    );
}
