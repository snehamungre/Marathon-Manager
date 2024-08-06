const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const envVariables = loadEnvFile('./.env');



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


async function fetchCharityTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Charity');
        return result.rows;
    }).catch(() => {
        return [];
    });
}
async function fetchCharityAmountFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT C.CHARITYNAME, C.COUNTRY,sum(D.Amount) as AMOUNT
        FROM CHARITY C, DONATES D
        WHERE C.CHARITYNAME = D.CHARITYNAME
        GROUP BY C.CHARITYNAME, C.COUNTRY
        ORDER BY AMOUNT DESC
        `);
        return result.rows;
    }).catch(() => {
        return [];
    });
}


async function initiateCharityTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Charity`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

            const result = await connection.execute(`
                    CREATE TABLE Charity (
                        charityName VARCHAR(20) PRIMARY KEY,
                        country VARCHAR(20)
                    )
                `
            );

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertCharityTable(name, country) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the charityName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Charity WHERE charityName = :name',
                [name]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Charity already exists' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Charity (charityName, country) VALUES (:name, :country)`,
                [name, country],
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


async function updateCharityTable(name, country) {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(
            `UPDATE Charity 
            SET country= :country 
            where charityName= :name`,
            [country, name],
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch(() => {
        return false;
    });
}


async function countCharityTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Charity');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function fetchCauseCharityTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Cause');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateCauseCharityTable() {
    console.log("cause chairty in service working");
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Cause`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

            const result = await connection.execute(`
                    CREATE TABLE Cause (
                        charityName VARCHAR(20),
                        cause VARCHAR(20),
                        PRIMARY KEY (charityName, cause),
                        FOREIGN KEY (charityName) REFERENCES
                                    Charity (charityName)
                                    ON DELETE CASCADE
                    )
                `
            );

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertCauseCharityTable(name, cause) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the charityName+cause already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Cause WHERE charityName = :name AND cause = :cause',
                [name,cause]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Charity and cause already exists' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Cause (charityName, cause) VALUES (:name, :cause)`,
                [name, cause],
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

async function countCauseCharityTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Cause');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchCharityTableFromDb, 
    initiateCharityTable,
    insertCharityTable, 
    updateCharityTable, 
    countCharityTable,
    fetchCauseCharityTableFromDb,
    initiateCauseCharityTable,
    insertCauseCharityTable,
    countCauseCharityTable,
    fetchCharityAmountFromDb
};