// declare baseURL for API requests
// const baseURL = "http://localhost:1337";
const baseURL = "http://server:1337/api/v2";

// declare toast function to display messages to the user
function toast(message) {
    const toast = document.getElementsByClassName("toast")[0];

    toast.style.width = "";
    toast.querySelector(".toast-body").innerHTML = message;
    toast.classList.add("visible");

    setTimeout(function () {
        toast.className = toast.className.replace("visible", "");
    }, 3000);
}

function badToast(message) {
    const toast = document.getElementsByClassName("bad-toast")[0];

    toast.style.width = "";
    toast.querySelector(".bad-toast-body").innerHTML = message;
    toast.classList.add("visible");

    setTimeout(function () {
        toast.className = toast.className.replace("visible", "");
    }, 3000);
}

export { baseURL, toast, badToast };
