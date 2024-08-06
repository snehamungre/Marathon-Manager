const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');



// ----------------------------------------------------------

// ----------------------------------------------------------
// Core functions for database operations

async function fetchRunnerRookie() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RunnerRookie');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRunnerRookie() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE RunnerRookie`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create Runner Rookie Table...');
        }

        const result = await connection.execute(`
                CREATE TABLE RunnerRookie (
                    runnerID INTEGER PRIMARY KEY,
                    estimatedTime NUMBER,
                    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID)
                )
                 `
        );

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRunnerRookie(id, et) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the runnerID already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM RunnerRookie WHERE runnerId = :id',
                [id]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Runner already exists' };
            }
            // Insert the data

            const result = await connection.execute(
                `INSERT INTO RunnerRookie (runnerId, estimatedTime)
                VALUES (:id, :et)
                `,
                [id, et],
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


async function updateRunnerRookie(id, et) {

    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;

        if (et) {
            const updateParams = [];
            if (et) updateParams.push(`estimatedTime = :et`);

            updateStatement = `UPDATE RunnerRookie SET ${updateParams.join(', ')} WHERE runnerId = :id`;
            updateValues = [et, parseInt(id)].filter(Boolean);
            console.log("Generated SQL statement:", updateStatement);
            console.log("Bind values:", updateValues);
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


async function countRunnerRookie() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM RunnerRookie');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchRunnerRookie: fetchRunnerRookie,
    initiateRunnerRookie,
    insertRunnerRookie,
    updateRunnerRookie,
    countRunnerRookie
};