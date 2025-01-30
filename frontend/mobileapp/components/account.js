import accountModel from "../models/account.js";
import auth from "../models/auth.js";
import { toast } from "../utils.js";

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
        balanceTd.textContent = user.balance + " sek";
        balanceRow.appendChild(balanceTh);
        balanceRow.appendChild(balanceTd);

        // Balance form
        let balanceFormRow = document.createElement("tr");
        let balanceFormTd = document.createElement("td");
        let balanceForm = document.createElement("form");
        let balanceInput = document.createElement("input");
        let balanceButton = document.createElement("button");

        balanceInput.type = "number";
        balanceInput.placeholder = "Enter new balance";
        balanceInput.min = "0";
        balanceButton.textContent = "Update";
        balanceButton.classList.add("red-button", "full-width-button");
        balanceForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const amount = parseFloat(balanceInput.value);
            if (isNaN(amount) || amount <= 0) {
                toast("Please enter a valid amount");
                return;
            }
            const result = await auth.addBalance(amount);
            console.log("Adding balance:", amount);
            console.log("Result of adding balance:", result);
            balanceTd.textContent = user.balance + " sek"; // Update balance display
        });

        balanceForm.appendChild(balanceInput);
        balanceForm.appendChild(balanceButton);
        balanceFormTd.appendChild(balanceForm);
        balanceFormRow.appendChild(balanceFormTd);

        // Logout button
        let logoutButton = document.createElement("button");
        logoutButton.textContent = "Logout";
        logoutButton.classList.add("blue-button", "full-width-button");
        logoutButton.addEventListener("click", () => {
            accountModel.logout();
        });

        // Append rows to table
        tbody.appendChild(emailRow);
        tbody.appendChild(emailRow);
        tbody.appendChild(roleRow);
        tbody.appendChild(document.createElement("br"));
        tbody.appendChild(balanceRow);
        tbody.appendChild(balanceFormRow);
        table.appendChild(tbody);
        this.appendChild(table);
        this.appendChild(logoutButton);
    }
}
