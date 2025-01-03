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

export default function App() {
  return (
    <BrowserRouter>
      {/* All routes */}
      <Routes>
        <Route path="/" element={<Navbar />}>
          <Route index element={<Home />} />
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
