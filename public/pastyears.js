// function toggleDropdown() {
//     var dropdownContent = document.getElementById("dropdownContent");
//     dropdownContent.classList.toggle("show");
// }

function hideAllTables() {
    document.getElementById("2023").classList.add("hidden");
    document.getElementById("2022").classList.add("hidden");
    document.getElementById("2021").classList.add("hidden");
    document.getElementById("2020").classList.add("hidden");
}

async function loadCountTable(path) {
    const response = await fetch(path, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('Count');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    tableContent.forEach(rowData => {
        const row = tableBody.insertRow();
        Object.values(rowData).forEach((field, index) => {
            const cell = row.insertCell(index);
            cell.textContent = field;
        });
    });  
}

function loadTable(path, tableID) {
    hideAllTables();
    fetchAndDisplayTable(path, tableID);
    document.getElementById(tableID).classList.remove("hidden");

    // Set the text of the dropdown button based on the table being loaded
    const editPagesSpan = document.getElementById('dropdowTitle');
    switch (tableID) {
        case '2023':
            editPagesSpan.textContent = '2023';
            break;
        case '2022':
            editPagesSpan.textContent = '2022';
            break;
        case '2021':
            editPagesSpan.textContent = '2021';
            break;
        case '2020':
            editPagesSpan.textContent = '2020';
            break;
        default:
            break;
    }
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
        const tableContent = responseData.data;

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
                if(index==1){
                    const date = new Date(field).toISOString().split('T')[0];
                    cell.textContent = date;
                } else {
                cell.textContent = field;
                }
            });
    }); 
    }   catch (error) {
            console.error('Fetch error:', error);
    }
}

window.onload = function () {
    hideAllTables();
    loadCountTable('/comprises/group-by-year?year=2023','Count');
    loadTable('/comprises/comprises-by-year?year=2023', '2023');
    
    
};
