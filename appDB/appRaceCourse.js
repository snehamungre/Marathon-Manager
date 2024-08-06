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


async function fetchRaceCourseTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM RaceCourse');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRaceCourseTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE RaceCourse`);
        } catch (err) {
        }
        const result = await connection.execute(`
            CREATE TABLE RaceCourse (
                courseDistance INTEGER,
                courseName VARCHAR(20),
                terrainType VARCHAR(20),
                startPoint VARCHAR(20),
                endPoint VARCHAR(20),
                PRIMARY KEY (courseDistance, courseName),
                FOREIGN KEY (courseDistance) REFERENCES RaceCategory(categoryDistance) ON DELETE CASCADE
            )
        `);
        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRaceCourseTable(distance, name, tarrain, stp, endp) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the courseDistance already exists
            const distanceCheckResult = await connection.execute(
                'SELECT 1 FROM RaceCourse WHERE courseDistance = :distance AND courseName =: name',
                [distance, name]
            );

            if (distanceCheckResult.rows.length > 0) {
                return { success: false, message: 'courseDistance and courseName already exists' };
            }

            // Insert the data
            const result = await connection.execute(
                `INSERT INTO RaceCourse (courseDistance, courseName, terrainType, startPoint, endPoint) VALUES (:distance, :name, :tarrain, :stp, :endp)`,
                [distance, name, tarrain, stp, endp],
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


async function updateRaceCourseTable(distance, name, nTarrain, nStp, nEndp) {
    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;


        if (nTarrain || nStp || nEndp) {
            const updateParams = [];
            if (nTarrain) updateParams.push(`terrainType = :nTarrain`);
            if (nStp) updateParams.push(`startPoint = :nStp`);
            if (nEndp) updateParams.push(`endPoint = :nEndp`);

            updateStatement = `UPDATE RaceCourse SET ${updateParams.join(', ')} WHERE courseDistance = :distance AND courseName =: name`;
            updateValues = [nTarrain, nStp, nEndp, distance, name].filter(Boolean);
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


async function countRaceCourseTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM RaceCourse');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchRaceCourseTableFromDb,
    initiateRaceCourseTable,
    insertRaceCourseTable,
    updateRaceCourseTable,
    countRaceCourseTable
};