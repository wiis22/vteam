import axios from "axios";

const city = {
    //City get request function.
    getCities: function getAllCities() {
        return axios.get(`https://server:1337/api/cities`)
        .then(res => {
            res.data;
        })
        .catch(error => {
            throw error;
        });
    },
};

export default city;
