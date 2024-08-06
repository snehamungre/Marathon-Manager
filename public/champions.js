
function sendDistance(distance){
    const eventName = document.getElementById('dropdownTitle2').textContent;
    fetchData(distance, eventName);

}

function sendEvent(eventName) {
    const distance = document.getElementById('dropdownTitle').textContent;
    const regex = /[\d.]+/g;
    const matches = distance.match(regex);
    const numbers = matches ? matches.map(match => parseFloat(match)) : [];
    
    fetchData(numbers[0], eventName);
}

function secondsToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}


async function fetchData(distance, eventName){

    const distanceDropdown = document.getElementById('dropdownTitle');
    switch (distance) {
        case 5:
            distanceDropdown.textContent = '5 km';
            break;
        case 10:
            distanceDropdown.textContent = '10 km';
            break;
        case 21.1:
            distanceDropdown.textContent = 'Half Marathon (21.1 km)';
            break;
        case 42.2:
            distanceDropdown.textContent = 'Marathon (42.2 km)';
            break;
        default:
            break;
    };

    const eventDropdown = document.getElementById('dropdownTitle2');
    switch (eventName) {
        case "BMO Marathon":
            eventDropdown.textContent = 'BMO Marathon';
            break;
        case "Mumbai Marathon":
            eventDropdown.textContent = 'Mumbai Marathon';
            break;
        case "Great Trek":
            eventDropdown.textContent = 'Great Trek UBC';
            break;
        case "Chicago Marathon":
            eventDropdown.textContent = 'Chicago Marathon';
            break;
        case "Boston Marathon":
            eventDropdown.textContent = 'Boston Marathon';
        case "Demo Marathon":
                eventDropdown.textContent = 'Demo Marathon';
            break;
        default:
            break;
    };
    const path = `/registration/registration-by-filter?categoryDistance=${distance}&eventName=${eventName}`;
    const response = await fetch(path, {
        method: 'GET'
    });

    const responseData = await response.json();
    const tableContent = responseData.data;

    const tableElement = document.getElementById('Champions');
    const tableBody = tableElement.querySelector('tbody');

    if (tableBody) {
        tableBody.innerHTML = '';
    }
    tableContent.forEach(rowData => {
        const row = tableBody.insertRow();
        Object.values(rowData).forEach((field, index) => {
            const cell = row.insertCell(index);
            if(index==3){
                const time = secondsToHHMMSS(field);
                cell.textContent = time;
            } else{
            cell.textContent = field;
            }
        });
    });  
}


window.onload = function () {
    fetchData(21.1,"BMO Marathon");
   // loadTable('/comprises/comprises-by-year?year=2023', '2023');
    
    
};
