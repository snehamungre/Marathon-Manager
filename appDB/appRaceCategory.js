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


async function fetchRaceCategoryTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RaceCategory');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRaceCategoryTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE RaceCategory`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
                CREATE TABLE RaceCategory (
                    categoryDistance INTEGER PRIMARY KEY,
                    fee INTEGER NOT NULL
                )
            `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRaceCategoryTable(distance, fee) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the categoryDistance already exists
            const distanceCheckResult = await connection.execute(
                'SELECT 1 FROM RaceCategory WHERE categoryDistance = :distance',
                [distance]
            );
            if (distanceCheckResult.rows.length > 0) {
                return { success: false, message: 'categoryDistance already exists' };
            }

            // Insert the data

            const result = await connection.execute(
                `INSERT INTO RaceCategory (categoryDistance, fee) VALUES (:distance, :fee)`,
                [distance, fee],
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


async function updateRaceCategoryTable(distance, fee) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE RaceCategory 
                SET fee = :fee
                WHERE categoryDistance = :distance`,
            [fee, distance],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function countRaceCategoryTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM RaceCategory');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchRaceCategoryTableFromDb,
    initiateRaceCategoryTable,
    insertRaceCategoryTable,
    updateRaceCategoryTable,
    countRaceCategoryTable
};