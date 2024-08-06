document.getElementById('login-form').addEventListener('submit', function (e) {
    e.preventDefault();

    // replace these values with admin credentials
    const adminUsername = 'admin';
    const adminPassword = 'adminpass';

    const enteredUsername = document.getElementById('username').value;
    const enteredPassword = document.getElementById('password').value;

    if (enteredUsername === adminUsername && enteredPassword === adminPassword) {
        // Redirect to admin dashboard or take to admin dashboard
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});
