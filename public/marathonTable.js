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


function loadTable(path, tableID) {
    fetchAndDisplayTable(path, tableID);
}

async function fetchAndDisplayTable(path, tableID) {
    try {
        const response = await fetch(path, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        const originalTableContent = responseData.data;

        const tableContent = originalTableContent.map(rowData => {
            const modifiedRowData = rowData.slice(0, 3);
            return modifiedRowData;
        });

        // Assuming you have a table with ID in your HTML
        const tableElement = document.getElementById(tableID);
        const tableBody = tableElement.querySelector('tbody');

        // Always clear old, already fetched data before new fetching process.
        if (tableBody) {
            tableBody.innerHTML = '';
        }

        tableContent.forEach(rowData => {
            const row = tableBody.insertRow();
            Object.values(rowData).forEach((field, index) => {
                const cell = row.insertCell(index);
                if(tableID=="marathonTable" && index==2){
                    const date = new Date(field).toISOString().split('T')[0];
                    cell.textContent = date;
                } else {
                cell.textContent = field;
                }
            });
            const resultCell = row.insertCell();
            const resultButton = document.createElement('button');
            resultButton.textContent="View"; 
            resultCell.style.textAlign = 'center';
            resultButton.addEventListener('click',()=>handleViewButtonClick(rowData));
            resultCell.appendChild(resultButton);
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function handleViewButtonClick(rowData) {
    const name = encodeURIComponent(rowData[0]);
    const date = encodeURIComponent(rowData[2]);
    window.location.href = `results.html?name=${name}&date=${date}`;
}

function filterTable() {
    const name = document.getElementById('name').value;
    const city = document.getElementById('city').value;
    const date = document.getElementById('date').value;

    // You can modify the fetch URL to include query parameters based on the form values
    const filterPath = `/marathon/marathon-table-filter?name=${name}&city=${city}&date=${date}`;

    // Load the filtered table
    loadTable(filterPath, 'marathonTable');
}

window.onload = function () {
    checkDbConnection();
    loadTable('marathon/past-marathon-table', 'marathonTable');
};
