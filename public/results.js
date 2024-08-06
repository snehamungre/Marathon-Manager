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

function loadTable(path, tableID, runnerIDs, finishTimes) {
    fetchAndDisplayTable(path, tableID, runnerIDs, finishTimes);
}

async function fetchAndDisplayTable(path, tableID, runnerIDs, finishTimes) {
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
            if(runnerIDs.includes(rowData[0])){
            const runnerIDArrayIndex = runnerIDs.indexOf(rowData[0]);
            const row = tableBody.insertRow();
            Object.values(rowData).forEach((field, index) => {
                const cell = row.insertCell(index);
                cell.textContent = field;
            });
            const finishTimeCell = row.insertCell();
            finishTimeCell.textContent = secondsToHHMMSS(finishTimes[runnerIDArrayIndex]);
            }
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

function secondsToHHMMSS(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}


async function populateDropdownOptions() {
  const dropdownContent = document.getElementById('categoryDropdown');
  dropdownContent.innerHTML = ''; // Clear existing options
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

      try {
        const raceCategories = await fetchRaceCategories(params);
        if (raceCategories) {
            const defaultCategory = raceCategories[0];
            selectCategory(params, defaultCategory);
            document.getElementById('dropdowTitle').textContent = defaultCategory+"K";

            raceCategories.forEach(category => {
                const link = document.createElement('a');
                link.href = '#';
                link.textContent = category;
                link.onclick = () => selectCategory(params, category);

                dropdownContent.appendChild(link);
            });
        }
    } catch (error) {
        console.error('Error creating category dropdown:', error);
    }
}

async function selectCategory(params, selectedCategory) {
    document.getElementById('dropdowTitle').textContent = selectedCategory+"K";
    const eventName= params.name;
    const date = new Date(params.date).toISOString().split('T')[0];
    const path = `/registration/runner-ids-by-filter?eventName=${eventName}&eventDate=${date}&categoryDistance=${selectedCategory}`;
    try {
        const response = await fetch(path, {
            method: 'GET'
        });
            if(!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const responseData = await response.json();
    const runnerIDs = responseData.data.map(item => item.runnerID);
    const finishTimes = responseData.data.map(item => item.finishTime);
    loadTable('/runner/runner-table', 'runnerTable', runnerIDs, finishTimes);
    }catch (error) {
        console.error('Fetch error:', error);
    }
}


async function fetchRaceCategories(param){
    const formattedDate = new Date(param.date).toISOString().split('T')[0]; 
    const path = `/comprises/category-distances-by-name-and-date?name=${param.name}&eventDate=${formattedDate}`;
        try {
        const response = await fetch(path, {
            method: 'GET'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();
        return responseData.data;
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

let isAscending = true; 

function sortTable(columnIndex) {
  const table = document.getElementById("runnerTable");
  const rows = Array.from(table.rows).slice(1); 

  rows.sort((a, b) => {
    const cellA = a.cells[columnIndex].textContent.trim();
    const cellB = b.cells[columnIndex].textContent.trim();

    // Check if both cells are non-numeric strings
    const isString = isNaN(cellA) && isNaN(cellB);

    if (isString) {
      return isAscending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
    }

    const numericA = parseFloat(cellA);
    const numericB = parseFloat(cellB);

    if (isNaN(numericA)) return 1;
    if (isNaN(numericB)) return -1;

    return isAscending ? numericA - numericB : numericB - numericA;
  });

  const tbody = table.querySelector("tbody");
  tbody.innerHTML = "";

  rows.forEach(row => {
    tbody.appendChild(row);
  });

  isAscending = !isAscending;
}




window.onload = async function () {
    checkDbConnection();
    loadTable('/runner/runner-table', 'runnerTable')
    await populateDropdownOptions();

};