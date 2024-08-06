function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}
function hideAllTables() {
    document.getElementById("5ktable").classList.add("hidden");
    document.getElementById("10ktable").classList.add("hidden");
    document.getElementById("halfmarathonTable").classList.add("hidden");
    document.getElementById("marathonTable").classList.add("hidden");
}

function loadTable(path, tableID) {
    hideAllTables();
    fetchAndDisplayTable(path, tableID);
    document.getElementById(tableID).classList.remove("hidden");

    // Set the text of the dropdown button based on the table being loaded
    const editPagesSpan = document.getElementById('dropdowTitle');
    switch (tableID) {
        case '5ktable':
            editPagesSpan.textContent = '5km';
            break;
        case '10ktable':
            editPagesSpan.textContent = '10km';
            break;
        case 'halfmarathonTable':
            editPagesSpan.textContent = 'Half Marathon 21.1km';
            break;
        case 'marathonTable':
            editPagesSpan.textContent = 'Marathon 42.2km';
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
                } else if (index==3){
                    const time = new Date(field).toISOString().split('T')[1].split('.')[0];
                    cell.textContent = time;
                } else {
                cell.textContent = field;
                }
            });
        // tableContent.forEach(rowData => {
        //     const row = tableBody.insertRow();
        //     Object.values(rowData).forEach((field, index) => {
        //         const cell = row.insertCell(index);
        //         cell.textContent = field;
        //     });
        // });
    }); 
    }   catch (error) {
            console.error('Fetch error:', error);
    }
}

window.onload = function () {
    hideAllTables();
    loadTable('/comprises/comprises-by-category?categoryDistance=5', '5ktable')
    
};
