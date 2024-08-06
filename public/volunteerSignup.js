// This function checks the database connection and updates its status on the frontend.
async function checkDbConnection() {
    const statusElem = document.getElementById('dbStatus');
    const loadingGifElem = document.getElementById('loadingGif');

    const response = await fetch('/check-db-connection', {
        method: "GET"
    });

    // Hide the loading GIF once the response is received.
    loadingGifElem.style.display = 'none';
    // Display the statusElem's text in the placeholder.
    statusElem.style.display = 'inline';

    response.text()
        .then((text) => {
            statusElem.textContent = text;
        })
        .catch((error) => {
            statusElem.textContent = 'connection timed out';  // Adjust error handling if required.
        });
}

function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the default form submission

    // Get form values
    const fname = document.getElementById('fname').value;
    const lname = document.getElementById('lname').value;
    const email = document.getElementById('email').value;
    const id = Math.floor(Math.random() * 300);

    // Create a data object to send
    const data = {
        id: id,
        firstName: fname,
        lastName: lname,
        contact: email
    };

    // Send a POST request
    fetch('/volunteer/insert-volunteertable', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                alert("Volunteer added Successfully");
            } else {
                // Handle errors if any
                alert("Volunteer not Added");


            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert("Volunteer not Added");
        });
};

window.onload = function () {
    checkDbConnection();
    const form = document.getElementById('signup-form');
    form.addEventListener('submit', handleFormSubmit);
};