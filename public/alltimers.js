async function loadTable() {

    const path = `/registration/registration-by-all`;
    const response = await fetch(path, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('Alltimer');
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

async function loadotherTable() {

    const path = `/registration/registration-by-avg-age`;
    const response = await fetch(path, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('cateage');
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

window.onload = function(){
    loadTable();
    loadotherTable();
}