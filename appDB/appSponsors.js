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

async function fetchSponsorsTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Sponsors');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateSponsorsTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Sponsors`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Sponsors (
                marathonName VARCHAR(20) NOT NULL,
                marathonDate DATE NOT NULL,
                sponsorName VARCHAR(20) NOT NULL,
                PRIMARY KEY (marathonName, marathonDate, sponsorName),
                FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate),
                FOREIGN KEY (sponsorName) REFERENCES Sponsor(sponsorName)
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertSponsorsTable(marathonName, marathonDate, sponsorName) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the sponsorName, marathonDate and marathonName  already exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM Sponsors WHERE sponsorName = :sponsorName AND marathonDate = TO_DATE(:marathonDate,'YYYY-MM-DD') AND marathonName=:marathonName`,
                [sponsorName, marathonDate, marathonName]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Sponsor already sponsors the event' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Sponsors (marathonName, marathonDate, sponsorName) VALUES (:marathonName, TO_DATE(:marathonDate,'YYYY-MM-DD'), :sponsorName)`,
                [marathonName, marathonDate, sponsorName],
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


async function countSponsorsTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Sponsors');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchSponsorsTableFromDb,
    initiateSponsorsTable,
    insertSponsorsTable,
    countSponsorsTable
};