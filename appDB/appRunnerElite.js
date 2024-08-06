const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');



// ----------------------------------------------------------


// ----------------------------------------------------------
// Core functions for database operations

async function fetchRunnerElite() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RunnerElite');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRunnerElite() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE RunnerElite`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create Runner Elite Table...');
        }

            const result = await connection.execute(`
                CREATE TABLE RunnerElite (
                    runnerID INTEGER PRIMARY KEY,
                    fastestKM NUMBER,
                    FOREIGN KEY (runnerID) REFERENCES Runner(runnerID)
                )
                 `
            );

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRunnerElite(id,fkm) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the charityName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM RunnerElite WHERE runnerId = :id',
                [id]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Runner already exists' };
            }
            // Insert the data
            
            const result = await connection.execute(
                `INSERT INTO RunnerElite (runnerId, fastestKM)
                VALUES (:id, :fkm)
                `,
                [id, fkm],
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


async function updateRunnerElite(id, fkm) {

    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;

        if (fkm) {
            const updateParams = [];
            if (fkm) updateParams.push(`fastestKM = :fkm`);
    
            updateStatement = `UPDATE RunnerElite SET ${updateParams.join(', ')} WHERE runnerId = :id`;
            updateValues = [fkm, parseInt(id)].filter(Boolean);
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


async function countRunnerElite() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM RunnerElite');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchRunnerElite,
    initiateRunnerElite, 
    insertRunnerElite, 
    updateRunnerElite, 
    countRunnerElite
};