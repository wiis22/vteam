/** global: HTMLElement, localStorage */

import accountModel from "../models/account.js";
import ridesModel from "../models/rides.js";
import auth from "../models/auth.js";
import { badToast, toast } from "../utils.js";

export default class Account extends HTMLElement {
    constructor() {
        super();
    }

    async connectedCallback() {
        const user = JSON.parse(localStorage.getItem('user'));
        const token = localStorage.getItem('jwtToken');
        if (!user) {
            location.hash = 'login';
            return;
        }
        accountModel.refreshAccount();
        // Create container for the account page
        let container = document.createElement("div");

        // Create header section
        let headerSection = document.createElement("div");

        // Logout button
        let logoutButton = document.createElement("button");
        logoutButton.textContent = "Logout";
        logoutButton.classList.add("blue-button", "full-width-button");
        logoutButton.addEventListener("click", () => {
            logoutButton.disabled = true;
            toast("Logging out");
            setTimeout(() => {
                accountModel.logout();
                location.reload();
            }, 2000);
        });
        headerSection.appendChild(logoutButton);

        // Create h1 row with user's first name and last name
        if (user.firstName && user.lastName) {
            let nameRow = document.createElement("h1");
            nameRow.textContent = `${user.firstName} ${user.lastName}`;
            headerSection.appendChild(nameRow);
        };

        container.appendChild(headerSection);

        // Create user info section
        let userInfoSection = document.createElement("div");

        // Create table for user info
        let userInfoTable = document.createElement("table");
        let userInfoTbody = document.createElement("tbody");

        // Email row
        let emailRow = document.createElement("tr");
        let emailTh = document.createElement("td");
        let emailTd = document.createElement("td");
        emailTh.textContent = "Email";
        emailTd.textContent = user.email;
        emailRow.appendChild(emailTh);
        emailRow.appendChild(emailTd);

        // Role row
        let roleRow = document.createElement("tr");
        let roleTh = document.createElement("td");
        let roleTd = document.createElement("td");
        roleTh.textContent = "Role";
        roleTd.textContent = user.role;
        roleRow.appendChild(roleTh);
        roleRow.appendChild(roleTd);

        userInfoTbody.appendChild(emailRow);
        userInfoTbody.appendChild(roleRow);
        userInfoTable.appendChild(userInfoTbody);
        userInfoSection.appendChild(userInfoTable);

        container.appendChild(userInfoSection);

        // Create balance management section
        let balanceSection = document.createElement("div");

        // Balance row
        let balanceRow = document.createElement("tr");
        let balanceTh = document.createElement("td");
        let balanceTd = document.createElement("td");
        balanceTh.textContent = "Balance";
        balanceTd.textContent = user.balance + " sek";
        balanceRow.appendChild(balanceTh);
        balanceRow.appendChild(balanceTd);

        // Balance form
        let balanceFormRow = document.createElement("tr");
        let balanceFormTd = document.createElement("td");
        balanceFormTd.colSpan = 2; // Span across both columns

        let balanceForm = document.createElement("form");
        balanceForm.classList.add("balance-form");

        let balanceInput = document.createElement("input");
        balanceInput.type = "number";
        balanceInput.placeholder = "Add Balance";
        balanceInput.min = "0";
        balanceInput.classList.add("balance-input");

        let balanceButton = document.createElement("button");
        balanceButton.textContent = "Add";
        balanceButton.classList.add("red-button", "full-width-button");

        balanceForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const amount = parseFloat(balanceInput.value);
            if (isNaN(amount) || amount <= 0) {
                toast("Please enter a valid amount");
                return;
            }
            const result = await auth.addBalance(amount);
            if (result.acknowledged == true) {
                balanceTd.textContent = `${user.balance + amount} sek`;
                balanceInput.value = "";
            } else {
                badToast("Issue updating the balance");
            }
        });

        balanceForm.appendChild(balanceInput);
        balanceForm.appendChild(balanceButton);
        balanceFormTd.appendChild(balanceForm);
        balanceFormRow.appendChild(balanceFormTd);

        let balanceTable = document.createElement("table");
        let balanceTbody = document.createElement("tbody");
        balanceTbody.appendChild(balanceRow);
        balanceTbody.appendChild(balanceFormRow);
        balanceTable.appendChild(balanceTbody);
        balanceSection.appendChild(balanceTable);

        container.appendChild(balanceSection);

        // Fetch and display rides
        const rides = await ridesModel.fetchRides(token, user._id);
        if (rides.length > 0) {
            let ridesSection = document.createElement("div");
            ridesSection.classList.add("rides-section");

            let ridesH2 = document.createElement("h2");
            ridesH2.textContent = "Rides:";
            ridesSection.appendChild(ridesH2);

            let ridesTable = document.createElement("table");
            ridesTable.style.maxHeight = "350px";
            ridesTable.classList.add("table-striped", "table", "rides-table");
            let ridesTbody = document.createElement("tbody");

            // Create table header
            let headerRow = document.createElement("tr");
            const headers = ["Start Time", "Bike ID", "Price", "Duration"];
            headers.forEach(headerText => {
                let th = document.createElement("th");
                th.textContent = headerText;
                headerRow.appendChild(th);
            });
            ridesTbody.appendChild(headerRow);

            rides.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
            rides.forEach((ride) => {
                let rideRow = document.createElement("tr");
                let startTimeTd = document.createElement("td");
                startTimeTd.textContent = new Date(ride.startTime).toLocaleString('en-GB', {
                    hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
                });
                rideRow.appendChild(startTimeTd);

                let bikeIdTd = document.createElement("td");
                bikeIdTd.textContent = ride.bikeId;
                rideRow.appendChild(bikeIdTd);

                let priceTd = document.createElement("td");
                priceTd.textContent = `${ride.price} sek`;
                rideRow.appendChild(priceTd);

                let rideLengthTd = document.createElement("td");
                rideLengthTd.textContent = `${ride.rideLengthSeconds.toFixed(1)} s`;
                rideRow.appendChild(rideLengthTd);

                ridesTbody.appendChild(rideRow);
            });

            ridesTable.appendChild(ridesTbody);
            ridesSection.appendChild(ridesTable);
            container.appendChild(ridesSection);
        }

        this.appendChild(container);
    }
}