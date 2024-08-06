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

async function fetchDonatesTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Donates');
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateDonatesTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Donates`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

            const result = await connection.execute(`
                CREATE TABLE Donates (
                    runnerID INTEGER NOT NULL,
                    charityName VARCHAR2(40) NOT NULL,
                    amount INTEGER,
                    PRIMARY KEY (runnerID, charityName),
                    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID) ON DELETE CASCADE,
                     FOREIGN KEY (charityName) REFERENCES Charity(charityName) ON DELETE CASCADE
                )
            `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertDonatesTable(runnerID, charityName, amount) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the SponsorName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Donates WHERE runnerID = :runnerID AND charityName = :charityName',
                [runnerID,charityName]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Runner+charity already exists' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Donates (runnerID, charityName, amount) VALUES (:runnerID, :charityName, :amount)`,
                [runnerID, charityName,amount],
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

async function updateDonatesTable(runnerID, charityName, amount) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Donates 
            SET amount= :amount
            where charityName= :charityName AND runnerID= :runnerID `,
            [amount, charityName, runnerID],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function countDonatesTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Donates');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchDonatesTableFromDb,
    initiateDonatesTable,
    insertDonatesTable,
    updateDonatesTable,
    countDonatesTable
};