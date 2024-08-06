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

async function fetchVendorTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Vendor');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateVendorTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Vendor`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Vendor (
                name VARCHAR(50) PRIMARY KEY,
                contact VARCHAR(25) NOT NULL,
                stallNo INTEGER,
                type VARCHAR(20) NOT NULL
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertVendorTable(name, contact, stallNo, type) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the VendorName already exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Vendor WHERE name = :name',
                [name]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Vendor already exists' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Vendor (name, contact, stallNo, type) VALUES (:name, :contact, :stallNo, :type)`,
                [name, contact, stallNo, type],
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

async function updateVendorTable(name, newContact, newStallNo, newType) {
    return await appService.withOracleDB(async (connection) => {

        let updateStatement;
        let updateValues;


        if (newContact || newStallNo || newType) {
            const updateParams = [];
            if (newContact) updateParams.push(`contact = :newContact`);
            if (newStallNo) updateParams.push(`stallNo = :newStallNo`);
            if (newType) updateParams.push(`type = :newType`);

            updateStatement = `UPDATE Vendor SET ${updateParams.join(', ')} WHERE name = :name`;
            updateValues = [newContact, newStallNo, newType, name].filter(Boolean);
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

async function deleteVendor(name) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the vendor exists
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Vendor WHERE name = :name',
                [name]
            );

            if (idCheckResult.rows.length === 0) {
                return { success: false, message: 'Vendor not found' };
            }

            // Delete the vendor
            const result = await connection.execute(
                'DELETE FROM Vendor WHERE name = :name',
                [name],
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


async function countVendorTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Vendor');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchVendorTableFromDb,
    initiateVendorTable,
    insertVendorTable,
    updateVendorTable,
    countVendorTable,
    deleteVendor
};