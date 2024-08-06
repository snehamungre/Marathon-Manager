const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');


async function fetchRunner() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Runner');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRunner() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Runner`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create Runner Table...');
        }

            const result = await connection.execute(`
                CREATE TABLE Runner (
                    runnerID INTEGER PRIMARY KEY,
                    contact VARCHAR2(40),
                    firstName VARCHAR2(40),
                    lastName VARCHAR2(40),
                    gender VARCHAR2(20) NOT NULL,
                    age INTEGER NOT NULL
                )
                 `
            );

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRunner(id, contact, fname, lname, gender, age) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the charityName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Runner WHERE runnerId = :id',
                [id]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Runner already exists' };
            }
            // Insert the data
            
            const result = await connection.execute(
                `INSERT INTO Runner (runnerId, contact, firstName, lastName, gender, age)
                VALUES (:id, :contact, :fname, :lname, :gender, :age)
                `,
                [id, contact, fname, lname, gender, age],
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


async function updateRunner(id, contact, fname, lname, gender, age) {

    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;

        if (contact || fname || lname || gender || age) {
            const updateParams = [];
            if (contact) updateParams.push(`contact = :contact`);
            if (fname) updateParams.push(`firstName = :fname`);
            if (lname) updateParams.push(`lastName = :lname`);
            if (gender) updateParams.push(`gender = :gender`);
            if (age) updateParams.push(`age = :age`);
    
            updateStatement = `UPDATE Runner SET ${updateParams.join(', ')} WHERE runnerId = :id`;
            updateValues = [contact, fname, lname, gender, age, parseInt(id)].filter(Boolean);
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

async function deleteRunner(runnerId) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the runnerId exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Runner WHERE runnerId = :runnerId',
                [runnerId]
            );

            if (idCheckResult.rows.length === 0) {
                return { success: false, message: 'Runner not found' };
            }

            // Delete the runner
            const result = await connection.execute(
                'DELETE FROM Runner WHERE runnerId = :runnerId',
                [runnerId],
                { autoCommit: true }
            );

            if (result.rowsAffected && result.rowsAffected > 0) {
                return { success: true, message: 'Delete successful' };
            } else {
                return { success: false, message: 'Delete failed: Rows not affected' };
            }
        } catch (error) {
            return { success: false, message: `Delete failed: ${error.message}` };
        }
    }).catch(() => {
        return { success: false, message: 'Delete failed: Database error' };
    });
}



async function countRunner() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Runner');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    fetchRunner,
    initiateRunner, 
    insertRunner, 
    updateRunner, 
    countRunner,
    deleteRunner
};