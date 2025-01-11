import authModel from "../models/auth.js";
import { toast } from "../utils.js";
import auth from "../models/auth.js";

export default class Account extends HTMLElement {
    constructor() {
        super();
        this.credentials = {
            email: '',
        };
    }

    connectedCallback() {
        const user = JSON.parse(localStorage.getItem('user'));
        if (!user) {
            location.hash = 'login';
            return;
        }
        this.credentials.email = user.email;

        // Create table
        let table = document.createElement("table");
        let tbody = document.createElement("tbody");
        table.classList.add("account-table");

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

        // Balance row
        let balanceRow = document.createElement("tr");
        let balanceTh = document.createElement("td");
        let balanceTd = document.createElement("td");
        balanceTh.textContent = "Balance";
        balanceTd.textContent = user.balance;
        balanceRow.appendChild(balanceTh);
        balanceRow.appendChild(balanceTd);

        // Logout button
        let logoutButton = document.createElement("button");
        logoutButton.textContent = "Logout";
        logoutButton.classList.add("blue-button", "full-width-button");
        logoutButton.addEventListener("click", () => {
            auth.logout();
        });

        // Append rows to table
        tbody.appendChild(emailRow);
        tbody.appendChild(emailRow);
        tbody.appendChild(roleRow);
        tbody.appendChild(balanceRow);
        table.appendChild(tbody);
        this.appendChild(table);
        this.appendChild(logoutButton);
    }
}
