const oracledb = require('oracledb');
const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');

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


async function fetchVolunteerTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Volunteers');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateVolunteerTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Volunteers`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }


        const result = await connection.execute(`
            CREATE TABLE Volunteers (
                id NUMBER NOT NULL,
                role VARCHAR(40) NOT NULL,
                marathonName VARCHAR(40) NOT NULL,
                marathonDate DATE NOT NULL,
                FOREIGN KEY (marathonName, marathonDate) REFERENCES MarathonTable(name,eventDate),
                FOREIGN KEY (id) REFERENCES Volunteer(volunteerID),
                PRIMARY KEY(id,marathonName,marathonDate)
            )
        `);


        return true;
    }).catch(() => {
        return false;
    });
}

async function insertVolunteerTable(id, role, marathonName, marathonDate) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the volunteerID already exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM Volunteers WHERE id = :id AND marathonName = :marathonName AND marathonDate = :marathonDate`,
                [id, marathonName, marathonDate]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'volunteerID already registered' };
            }
            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Volunteers (id, role, marathonName, marathonDate) 
                VALUES (:id,:role,:marathonName, TO_DATE(:marathonDate,'YYYY-MM-DD'))`,
                [id, role, marathonName, marathonDate],
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


async function updateVolunteerTable(id, role, marathonName, marathonDate) {
    return await appService.withOracleDB(async (connection) => {
        let updateStatement;
        let updateValues;

        updateStatement = `UPDATE Volunteers SET role = :role 
            WHERE id = :id AND marathonDate = TO_DATE(:marathonDate, 'YYYY-MM-DD') AND marathonName = :marathonName `;
        updateValues = [role, id, marathonDate, marathonName]

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


async function countVolunteerTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Volunteers');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

module.exports = {
    testOracleConnection,
    fetchVolunteerTableFromDb, 
    initiateVolunteerTable,
    insertVolunteerTable, 
    updateVolunteerTable, 
    countVolunteerTable
};