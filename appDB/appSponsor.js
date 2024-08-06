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

async function fetchSponsorTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Sponsor');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateSponsorTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Sponsor`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Sponsor (
                sponsorName VARCHAR(20) PRIMARY KEY,
                contribution INTEGER
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertSponsorTable(name, contribution) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the SponsorName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Sponsor WHERE sponsorName = :name',
                [name]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Sponsor already exists' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Sponsor (sponsorName, contribution) VALUES (:name, :contribution)`,
                [name, contribution],
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

async function updateSponsorTable(name, contribution) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Sponsor 
            SET contribution= :contribution
            where sponsorName= :name`,
            [contribution, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function countSponsorTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Sponsor');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function deleteSponsor(sponsorName) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the sponsorName exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM Sponsor WHERE sponsorName = :sponsorName`,
                [sponsorName]
            );

            if (idCheckResult.rows.length === 0) {
                return { success: false, message: 'Sponsor not found' };
            }

            // Delete the sponsor
            const result = await connection.execute(
                `DELETE FROM Sponsor WHERE sponsorName = :sponsorName`,
                [sponsorName],
                { autoCommit: true }
            ).catch(error => {
                console.error('Error executing SQL query:', error);
                throw error;
            })

            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true, message: 'Delete successful' };
            } else {
                return { success: false, message: 'Delete failed: Rows not affected' };
            }
        } catch (error) {
            return { success: false, message: `Delete failed: ${error.message}` };
        }
    });
}


module.exports = {
    testOracleConnection,
    fetchSponsorTableFromDb,
    initiateSponsorTable,
    insertSponsorTable,
    updateSponsorTable,
    countSponsorTable,
    deleteSponsor
};