async function fetchData(){

    const path = `/charity/charity-amount`;
    const response = await fetch(path, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('Charity');
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


window.onload = function () {
    fetchData(21.1,"BMO Marathon");
   // loadTable('/comprises/comprises-by-year?year=2023', '2023');
    
    
};
