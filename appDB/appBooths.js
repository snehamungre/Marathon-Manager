const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');


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

async function fetchBoothsTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Booths');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateBoothsTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Booths`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Booths (
                vendorName VARCHAR(50),
                marathonDate DATE,
                marathonName VARCHAR(50),
                PRIMARY KEY (vendorName, marathonDate, marathonName),
                FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate),
                FOREIGN KEY (vendorName) REFERENCES Vendor(name)
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertBoothsTable(marathonName, marathonDate, vendorName) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the vendorName, marathonDate and marathonName  already exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM Booths WHERE vendorName = :vendorName AND marathonDate = TO_DATE(:marathonDate,'YYYY-MM-DD') AND marathonName=:marathonName`,
                [vendorName, marathonDate, marathonName]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Vendor already has a booth in the event' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Booths (marathonName, marathonDate, vendorName) VALUES (:marathonName, TO_DATE(:marathonDate,'YYYY-MM-DD'), :vendorName)`,
                [marathonName, marathonDate, vendorName],
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


async function countBoothsTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Booths');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchBoothsTableFromDb,
    initiateBoothsTable,
    insertBoothsTable,
    countBoothsTable
};