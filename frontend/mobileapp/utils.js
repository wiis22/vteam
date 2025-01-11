const baseURL = "http://localhost:1337";


function toast(message) {
    const toast = document.getElementsByClassName("toast")[0];

    toast.querySelector(".toast-body").innerHTML = message;

    toast.classList.add("visible");
    setTimeout(function () {
        toast.className = toast.className.replace("visible", "");
    },
    3000
    );
}

export { baseURL, toast };
