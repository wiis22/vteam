// declare baseURL for API requests
const baseURL = "http://server:1337";

// declare toast function to display messages to the user
function toast(message) {
    const toast = document.getElementsByClassName("toast")[0];

    toast.style.width = "";
    toast.querySelector(".toast-body").innerHTML = message;
    toast.classList.add("visible");

    setTimeout(function () {
        toast.className = toast.className.replace("visible", "");
    }, 3000);
    setTimeout(function () {
        toast.style.width = 0;
    }, 4000);
}

export { baseURL, toast };