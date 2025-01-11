import authModel from "../models/auth.js";
import { toast } from "../utils.js";

export default class RegisterForm extends HTMLElement {
    constructor() {
        super();
        this.credentials = {
            firstName: '',
            lastName: '',
            email: '',
            password: '',
        };
    }


    connectedCallback() {
        let form = document.createElement("form");

        form.classList.add("login-form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.register();
        });

        let emailLabel = document.createElement("label");
        let passwordLabel = document.createElement("label");
        let firstNameLabel = document.createElement("label");
        let lastNameLabel = document.createElement("label");

        let email = document.createElement("input");
        let password = document.createElement("input");
        let firstName = document.createElement("input");
        let lastName = document.createElement("input");
        let registerButton = document.createElement("input");

        emailLabel.classList.add("input-label");
        emailLabel.textContent = "Email*";
        emailLabel.setAttribute("for", "email");
        email.setAttribute("id", "email");
        email.setAttribute("type", "email");
        email.setAttribute("required", "required");
        email.classList.add("input");
        email.addEventListener("input", (event) =>{
            this.credentials = {
                ...this.credentials,
                email: event.target.value,
            };
        });

        passwordLabel.classList.add("input-label");
        passwordLabel.textContent = "Password*";
        passwordLabel.setAttribute("for", "password");
        password.setAttribute("id", "password");
        password.setAttribute("type", "password");
        password.setAttribute("required", "required");
        password.classList.add("input");
        password.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                password: event.target.value,
            };
        });

        firstNameLabel.classList.add("input-label");
        firstNameLabel.textContent = "First Name*";
        firstNameLabel.setAttribute("for", "firstName");
        firstName.setAttribute("id", "firstName");
        firstName.setAttribute("type", "text");
        firstName.setAttribute("required", "required");
        firstName.classList.add("input");
        firstName.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                firstName: event.target.value,
            };
        });

        lastNameLabel.classList.add("input-label");
        lastNameLabel.textContent = "Last Name*";
        lastNameLabel.setAttribute("for", "lastName");
        lastName.setAttribute("id", "lastName");
        lastName.setAttribute("type", "text");
        lastName.setAttribute("required", "required");
        lastName.classList.add("input");
        lastName.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                lastName: event.target.value,
            };
        });

        registerButton.setAttribute("value", "Register");
        registerButton.setAttribute("type", "submit");
        registerButton.classList.add("button", "blue-button");
        registerButton.style.marginTop = "10px";

        form.appendChild(emailLabel);
        form.appendChild(email);
        form.appendChild(passwordLabel);
        form.appendChild(password);
        form.appendChild(firstNameLabel);
        form.appendChild(firstName);
        form.appendChild(lastNameLabel);
        form.appendChild(lastName);
        form.appendChild(registerButton);

        this.appendChild(form);
    }

    async register() {
        const result = await authModel.register(
            this.credentials.email,
            this.credentials.password,
            this.credentials.firstName,
            this.credentials.lastName
        );

        if (result === "ok") {
            this.login();
        } else {
            toast(result);
            console.log(result);
        }
    }
}
