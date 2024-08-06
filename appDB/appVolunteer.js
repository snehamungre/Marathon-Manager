const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');

// var sql = fs.readFileSync('./sql/volunteer.sql');
// const dataArr = sql.toString().split(';');


// ----------------------------------------------------------


// ----------------------------------------------------------
// Core functions for database operations
// Modify these functions, especially the SQL queries, based on your project's requirements and design.
async function testOracleConnection() {
    return await appService.withOracleDB(async (connection) => {
        return true;
    }).catch(() => {
        return false;
    });
}


async function fetchVolunteerTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Volunteer');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateVolunteerTable() {
    return await appService.withOracleDB(async (connection) => {
        console.log("Entering Function");
        for (let i = 0; i < dataArr.length; i++) {
            const query = dataArr[i].trim();
            const tableNameMatch = /CREATE TABLE (\w+)/.exec(query);
            if (!tableNameMatch) {
                console.error('Error: Unable to extract table name from the CREATE TABLE query.');
                return false;
            }
            const tableName = tableNameMatch[1];
            console.log(tableName);
            try {
                // Check if the table exists
                await connection.execute(`DROP TABLE ${tableName}`);
                console.log(`Table ${tableName} dropped successfully.`);
            } catch(err) {
                console.log('Table might not exist, proceeding to create...');
            }    
            if (query) {
                await connection.execute(query);
                //console.log(query);
                await connection.commit();
                console.log(`Query ${i + 1} executed successfully`);
            }
        }
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertVolunteerTable(id, firstName, lastName, contact) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the volunteerID already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Volunteer WHERE volunteerID = :id',
                [id]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'volunteerID already exists' };
            }

            // Check if the volunteerContact already exists
            const contactCheckResult = await connection.execute(
                'SELECT 1 FROM Volunteer WHERE volunteerContact = :contact',
                [contact]
            );

            if (contactCheckResult.rows.length > 0) {
                return { success: false, message: 'volunteerContact already exists' };
            }

            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Volunteer (volunteerID, volunteerFirstName, volunteerLastName, volunteerContact) VALUES (:id,:firstName,:lastName, :contact)`,
                [id, firstName, lastName, contact],
                { autoCommit: true }
            );

            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true, message: 'Insert successful' };
            } else {
                return { success: false, message: 'Insert failed: Rows not affected' };
            }
        } catch (error) {
            return { success: false, message: `Insert failed: ${error.message}` };
        }
    });
}


async function updateVolunteerTable(id, newContact, newFName, newLName) {
    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;


        if (newContact || newFName || newLName) {
            const updateParams = [];
            if (newFName) updateParams.push(`volunteerFirstName = :newFName`);
            if (newLName) updateParams.push(`volunteerLastName = :newLName`);
            if (newContact) updateParams.push(`volunteerContact = :newContact`);
    
            updateStatement = `UPDATE Volunteer SET ${updateParams.join(', ')} WHERE volunteerID = :id`;
            updateValues = [newFName, newLName, newContact, id].filter(Boolean);
        }

        const result = await connection.execute(
            updateStatement,
            updateValues,
            { autoCommit: true }
        );
        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}

async function deleteVolunteer(volunteerID) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the volunteerID exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Volunteer WHERE volunteerID = :id',
                [volunteerID]
            );

            if (idCheckResult.rows.length === 0) {
                return { success: false, message: 'volunteerID not found' };
            }

            // Delete the entry
            const deleteResult = await connection.execute(
                'DELETE FROM Volunteer WHERE volunteerID = :id',
                [volunteerID],
                { autoCommit: true }
            );

            if (deleteResult.rowsAffected && deleteResult.rowsAffected > 0) {
                return { success: true, message: 'Deletion successful' };
            } else {
                return { success: false, message: 'Deletion failed: Rows not affected' };
            }
        } catch (error) {
            return { success: false, message: `Deletion failed: ${error.message}` };
        }
    });
}


async function countVolunteerTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Volunteer');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchVolunteerTableFromDb, 
    initiateVolunteerTable,
    insertVolunteerTable, 
    updateVolunteerTable, 
    countVolunteerTable,
    deleteVolunteer
};