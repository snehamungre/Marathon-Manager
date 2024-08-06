document.addEventListener("DOMContentLoaded", function () {
    // Load the header
    fetch("header.html")
        .then(response => response.text())
        .then(html => {
            document.querySelector("body").insertAdjacentHTML("afterbegin", html);
        })
        .catch(error => console.error('Error fetching header:', error));
});
