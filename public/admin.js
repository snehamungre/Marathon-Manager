/*
 * These functions below are for various webpage functionalities. 
 * Each function serves to process data on the frontend:
 *      - Before sending requests to the backend.
 *      - After receiving responses from the backend.
 * 
 * To tailor them to your specific needs,
 * adjust or expand these functions to match both your 
 *   backend endpoints 
 * and 
 *   HTML structure.
 * 
 */


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


function toggleDropdown() {
    var dropdownContent = document.getElementById("dropdownContent");
    dropdownContent.classList.toggle("show");
}
function hideAllTables() {
    // Hide all tables when a new option is clicked
    document.getElementById("volunteerTable").classList.add("hidden");
    document.getElementById("marathonTable").classList.add("hidden");
    document.getElementById("sponsorTable").classList.add("hidden");
    document.getElementById("vendorTable").classList.add("hidden");
    document.getElementById("runnerTable").classList.add("hidden");
    document.getElementById("totalRunnersTable").classList.add("hidden");
    document.getElementById("greaterThan").classList.add("hidden");
    // Hide other tables similarly if needed
}

function loadTable(path, tableID) {
    hideAllTables();
    removeEditForms();
    fetchAndDisplayTable(path, tableID);
    document.getElementById(tableID).classList.remove("hidden");
    if (tableID == 'totalRunnersTable') {
        document.getElementById("greaterThan").classList.remove("hidden");
    }


    // Set the text of the dropdown button based on the table being loaded
    const editPagesSpan = document.getElementById('dropdowTitle');
    switch (tableID) {
        case 'volunteerTable':
            editPagesSpan.textContent = 'Volunteers';
            break;
        case 'sponsorTable':
            editPagesSpan.textContent = 'Sponsors';
            break;
        case 'marathonTable':
            editPagesSpan.textContent = 'Marathons';
            break;
        case 'vendorTable':
            editPagesSpan.textContent = 'Vendors';
            break;
        case 'runnerTable':
            editPagesSpan.textContent = 'Runners';
            break;
        case 'totalRunnersTable':
            editPagesSpan.textContent = 'Total Registrations';
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
                if (tableID == "marathonTable" && index == 2) {
                    const date = new Date(field).toISOString().split('T')[0];
                    cell.textContent = date;
                } else if (tableID == "totalRunnersTable" && index == 1) {
                    const date = new Date(field).toISOString().split('T')[0];
                    cell.textContent = date;
                } else {
                    cell.textContent = field;
                }
            });

            if (tableID != "totalRunnersTable") {
            const editDeleteCell = row.insertCell();
            const editButton = document.createElement('button');
            const deleteButton = document.createElement('button');
            editButton.textContent = "Edit";
            deleteButton.textContent = "Delete";

            editButton.style.marginRight = '10px';
            editButton.style.width = '60px';
            deleteButton.style.width = '60px';
            editDeleteCell.style.textAlign = 'center';

            editButton.addEventListener('click', () => handleEditButtonClick(rowData, tableID, path));
            deleteButton.addEventListener('click', () => handleDeleteButtonClick(rowData, tableID, path));

            editDeleteCell.appendChild(editButton);
            editDeleteCell.appendChild(deleteButton);
            }
        });
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

async function handleDeleteButtonClick(rowData, tableID, path) {
    // Show a confirmation dialog
    const isConfirmed = window.confirm("Are you sure you want to delete?");
    const key = getKey(rowData, tableID);
    if (isConfirmed) {
        switch (tableID) {
            case 'volunteerTable':
                await deleteDataOnServer(tableID, key, "/volunteer/delete-volunteertable", path);
                break;
            case 'sponsorTable':
                await deleteDataOnServer(tableID, key, "/sponsor/delete-sponsor", path);
                break;
            case 'marathonTable':
                await deleteDataOnServer(tableID, key, "/marathon/delete-marathon", path);
                break;
            case 'vendorTable':
                await deleteDataOnServer(tableID, key, "/vendor/delete-vendor", path);
                break;
            case 'runnerTable':
                await deleteDataOnServer(tableID, key, "/runner/delete-runner", path);
                break;
            default:
                console.error('NO table found to update', error);
        }
    }
}

function getKey(rowData, tableID) {
    switch (tableID) {
        case 'volunteerTable':
            return {
                id: rowData['0'],
            };
        case 'sponsorTable':
            return {
                name: rowData['0'],
            };
        case 'marathonTable':
            const eventDate = new Date(rowData['2']).toISOString().split('T')[0];
            return {
                name: rowData['0'],
                eventDate: eventDate,
            };
        case 'vendorTable':
            return {
                name: rowData['0'],
            };
        case 'runnerTable':
            return {
                runnerId: rowData['0'],
            };
        default:
            // Default case: return the updatedData as is
            return rowData;
    }
}



function handleFilterButtonClick() {
    const greater = document.getElementById('greaterVal').value;
    loadTable(`/registration/totalRunners-by-event?greater=${greater}`, 'totalRunnersTable');
}


function handleEditButtonClick(rowData, tableID, path) {
    // Remove existing edit forms
    const existingForms = document.querySelectorAll('.edit-form');
    existingForms.forEach(form => form.remove());
    const form = createEditForm(rowData, tableID, path);
    const tableElement = document.getElementById(tableID);
    tableElement.parentNode.insertBefore(form, tableElement.nextSibling);
}

function createEditForm(rowData, tableID, path) {
    const form = document.createElement('form');
    form.classList.add('edit-form');
    // Loop through rowData and create form fields
    Object.entries(rowData).forEach(([key, value]) => {
        const fieldDiv = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = getCustomLabel(tableID, key);
        const input = document.createElement('input');
        input.type = 'text';
        input.name = key;
        if (tableID == "marathonTable" && key == 2) {
            const date = new Date(value).toISOString().split('T')[0];
            input.value = date;
        } else {
            input.value = value;
        }
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(fieldDiv);
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'button'; // Change to 'submit' if you want to submit the form
    submitButton.textContent = 'Save Changes';
    submitButton.addEventListener('click', () => saveChanges(rowData, form, tableID, path));
    form.appendChild(submitButton);

    return form;
}

async function saveChanges(rowData, form, tableID, path) {
    const updatedData = {};
    form.querySelectorAll('input').forEach(input => {
        updatedData[input.name] = input.value;
    });
    const mappedData = mapFormData(updatedData, tableID);

    switch (tableID) {
        case 'volunteerTable':
            await updateDataOnServer(tableID, "/volunteer/update-volunteertable", mappedData, path);
            break;
        case 'sponsorTable':
            await updateDataOnServer(tableID, "/sponsor/update-sponsortable", mappedData, path);
            break;
        case 'marathonTable':
            await updateDataOnServer(tableID, "/marathon/update-marathon-table", mappedData, path);
            break;
        case 'vendorTable':
            await updateDataOnServer(tableID, "/vendor/update-vendortable", mappedData, path);
            break;
        case 'runnerTable':
            await updateDataOnServer(tableID, "/runner/update-runner", mappedData, path);
            break;
        default:
            console.error('NO table found to update', error);
    }
    Object.entries(updatedData).forEach(([key, value]) => {
        const input = form.querySelector(`[name=${key}]`);
        if (input) {
            input.value = value;
        }
    });
}

async function updateDataOnServer(tableID, endpoint, data, tablePath) {
    try {
        const response = await fetch(`${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (response.ok) {
            console.log(`${tableID} updated successfully!`);
            loadTable(tablePath, tableID);
            displayPopupMessage('Update Successful', true);
        } else {
            console.error(`Error updating ${tableID}. Status: ${response.status}`);
            loadTable(tablePath, tableID);
            displayPopupMessage(`Update Failed - Status: ${response.status}`, false);
        }
    } catch (error) {
        console.error('Error updating data:', error);
        loadTable(tablePath, tableID);
        displayPopupMessage('Update Failed', false);

        

    }
}

async function deleteDataOnServer(tableID, data, deleteEndpoint, tablePath) {
    try {
        const response = await fetch(`${deleteEndpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            console.log(`${data} deleted successfully!`);
            displayPopupMessage('Delete Successful', true);
            loadTable(tablePath, tableID);
        } else {
            console.error(`Error deleting ${data}. Status: ${response.status}`);
            displayPopupMessage(`Delete Failed - Status: ${response.status}`, false);
        }
    } catch (error) {
        console.error('Error deleting data:', error);
        displayPopupMessage('Delete Failed', false);
        // displayErrorMessage(`Error deleting ${tableID}. Status: ${response.status}`);
    }
}

function mapFormData(updatedData, tableID) {
    switch (tableID) {
        case 'volunteerTable':
            return {
                id: updatedData['0'],
                newContact: updatedData['3'],
                newFName: updatedData['1'],
                newLName: updatedData['2'],
            };
        case 'sponsorTable':
            return {
                name: updatedData['0'],
                contribution: updatedData['1'],
            };
        case 'marathonTable':
            return {
                name: updatedData['0'],
                city: updatedData['1'],
                eventDate: updatedData['2'],
                weatherCond: updatedData['3'],
            };
        case 'vendorTable':
            return {
                name: updatedData['0'],
                contact: updatedData['1'],
                stallNo: updatedData['2'],
                type: updatedData['3'],
            };
        case 'runnerTable':
            return {
                id: updatedData['0'],
                contact: updatedData['1'],
                fname: updatedData['2'],
                lname: updatedData['3'],
                gender: updatedData['4'],
                age: updatedData['5'],
            };
        // Add more cases for other tables if needed
        default:
            // Default case: return the updatedData as is
            return updatedData;
    }
}

function getCustomLabel(tableID, key) {
    if (tableID == 'volunteerTable') {
        if (key == 0) {
            return 'ID';
        }
        if (key == 1) {
            return 'First Name';
        }
        if (key == 2) {
            return 'Last Name';
        }
        if (key == 3) {
            return 'Contact';
        }
    } else if (tableID == 'sponsorTable') {
        if (key == 0) {
            return 'Name';
        }
        if (key == 1) {
            return 'Contribution';
        }
    } else if (tableID == "marathonTable") {
        if (key == 0) {
            return 'Name';
        }
        if (key == 1) {
            return 'Location';
        }
        if (key == 2) {
            return 'Date';
        }
        if (key == 3) {
            return 'Conditions';
        }
    } else if (tableID == "vendorTable") {
        if (key == 0) {
            return 'Name';
        }
        if (key == 1) {
            return 'Contact';
        }
        if (key == 2) {
            return 'Stall No.';
        }
        if (key == 3) {
            return 'Type';
        }
    } else if (tableID == "runnerTable") {
        if (key == 0) {
            return 'ID';
        }
        if (key == 1) {
            return 'Contact';
        }
        if (key == 2) {
            return 'First Name';
        }
        if (key == 3) {
            return 'Last Name';
        }
        if (key == 4) {
            return 'Gender';
        }
        if (key == 5) {
            return 'Age';
        }
    }
}

function removeEditForms() {
    const existingForms = document.querySelectorAll('.edit-form');
    existingForms.forEach(form => form.remove());
}

function displayPopupMessage(message, isSuccess) {
    const popup = document.createElement('div');
    popup.className = isSuccess ? 'success-popup' : 'error-popup';
    popup.textContent = message;

    popup.style.position = 'fixed';
    popup.style.top = '37%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '5px';
    popup.style.borderRadius = '0px';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '1001';
    popup.style.background = 'white';

    document.body.appendChild(popup);

    setTimeout(() => {
        document.body.removeChild(popup);
    }, 3000);
}

// Open the form when the button is clicked
document.getElementById('addButton').addEventListener('click', function () {
    document.getElementById('addEntriesForm').style.display = 'block';
});

// Function to close the form
function closeForm(tableID) {
    document.getElementById('addEntriesForm').style.display = 'none';
    clearForm(tableID);
}

function clearForm() {
    var form = document.querySelector('.form-container');
    while (form.firstChild) {
        form.removeChild(form.firstChild);
    }
}


function switchAddForm(path, tableID) {
    clearForm();
    createAddForm(path, tableID);
}

// Function to add values to the table
function createAddForm(path, tableID) {
    var form = document.querySelector('.form-container');

    for (let i = 0; i < getTableFeildsCount(tableID); i++) {
        const fieldDiv = document.createElement('div');
        const label = document.createElement('label');
        label.textContent = getCustomLabel(tableID, i);
        const input = document.createElement('input');
        input.type = 'text';
        input.name = i;
        if (tableID == "marathonTable" && i == 2) {
            input.type = 'date';
        }
        form.appendChild(label);
        form.appendChild(input);
        form.appendChild(fieldDiv);
    };

    const submitButton = document.createElement('button');
    submitButton.type = 'button'; // Change to 'submit' if you want to submit the form
    submitButton.textContent = 'Add';
    submitButton.classList.add('btn');
    submitButton.addEventListener('click', () => handleFormSubmit(tableID, form, path));
    form.appendChild(submitButton);


    const cancelButton = document.createElement('button');
    cancelButton.type = 'button'; // Change to 'submit' if you want to submit the form
    cancelButton.textContent = 'Close';
    cancelButton.classList.add('btn');
    cancelButton.addEventListener('click', () => closeForm(tableID));
    form.appendChild(cancelButton);

    return form;
};

// add data to the table
async function handleFormSubmit(tableID, form, path) {
    // Get the entered value
    const newData = {};
    form.querySelectorAll('input').forEach(input => {
        newData[input.name] = input.value;
    });
    var mappedData = null;

    // vounteer table update and insert have different 
    if (tableID != 'volunteerTable') {
        mappedData = mapFormData(newData, tableID);
    } else {
        mappedData = {
            id: newData['0'],
            contact: newData['3'],
            firstName: newData['1'],
            lastName: newData['2'],
        };
    }

    // Add the value to the table
    switch (tableID) {
        case 'volunteerTable':
            await updateDataOnServer(tableID, "/volunteer/insert-volunteertable", mappedData, path);
            break;
        case 'sponsorTable':
            await updateDataOnServer(tableID, "/sponsor/insert-sponsortable", mappedData, path);
            break;
        case 'marathonTable':
            await updateDataOnServer(tableID, "/marathon/insert-marathon-table", mappedData, path);
            break;
        case 'vendorTable':
            await updateDataOnServer(tableID, "/vendor/insert-vendortable", mappedData, path);
            break;
        case 'runnerTable':
            await updateDataOnServer(tableID, "/runner/insert-runner", mappedData, path);
            break;
        default:
            displayPopupMessage('Insert Failed', false);
            console.error('NO table found to update', error);
    }
    closeForm();
};

function getTableFeildsCount(tableID) {
    switch (tableID) {
        case 'volunteerTable':
            return 4;
        case 'sponsorTable':
            return 2;
        case 'marathonTable':
            return 4;
        case 'vendorTable':
            return 4;
        case 'runnerTable':
            return 6;
        default:
            return 0;
    }
}

// ---------------------------------------------------------------
// Initializes the webpage functionalities.
// Add or remove event listeners based on the desired functionalities.
window.onload = function () {
    checkDbConnection();
    hideAllTables();
    loadTable('/volunteer/volunteertable', 'volunteerTable');
};
