import authModel from "../models/auth.js";
import { toast } from "../utils.js";

export default class LoginForm extends HTMLElement {
    constructor() {
        super();
        this.credentials = {};
    }

    async login() {
        const result = await authModel.login(
            this.credentials.username,
            this.credentials.password
        );

        if (result === "ok") {
            console.log("Logged in");
            localStorage.setItem("setItem", true);
            document.body.classList.add("slide-out");
            setTimeout(() => {
                document.body.classList.remove("slide-out");
                location.hash = "map";
            }, 250);
        } else {
            toast(result);
            console.log("Issue logging in");
        }
    }

    connectedCallback() {
        const user = JSON.parse(localStorage.getItem("user"));
        if (user) {
            location.hash = "account";
            return;
        }

        let form = document.createElement("form");

        form.classList.add("login-form");
        form.addEventListener("submit", (event) => {
            event.preventDefault();
            this.login();
        });

        let usernameLabel = document.createElement("label");
        let passwordLabel = document.createElement("label");
        let username = document.createElement("input");
        let password = document.createElement("input");
        let submitButton = document.createElement("input");
        let registerButton = document.createElement("input");

        usernameLabel.classList.add("input-label");
        usernameLabel.textContent = "Email";
        username.setAttribute("type", "email");
        username.setAttribute("required", "required");
        username.classList.add("input");
        username.addEventListener("input", (event) =>{
            this.credentials = {
                ...this.credentials,
                username: event.target.value,
            };
        });

        passwordLabel.classList.add("input-label");
        passwordLabel.textContent = "Password";
        password.setAttribute("type", "password");
        password.setAttribute("required", "required");
        password.classList.add("input");
        password.addEventListener("input", (event) => {
            this.credentials = {
                ...this.credentials,
                password: event.target.value,
            };
        });

        submitButton.setAttribute("type", "submit");
        submitButton.setAttribute("value", "Login");
        submitButton.classList.add("button", "green-button");

        registerButton.setAttribute("value", "Register");
        registerButton.classList.add("button", "blue-button");
        registerButton.style.marginTop = "10px";
        registerButton.addEventListener("click", (event) =>{
            event.preventDefault();
            location.hash = "register";
        });

        form.appendChild(usernameLabel);
        form.appendChild(username);
        form.appendChild(passwordLabel);
        form.appendChild(password);
        form.appendChild(submitButton);
        form.appendChild(registerButton);

        this.appendChild(form);
    }
}
