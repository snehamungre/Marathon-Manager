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


async function fetchComprisesTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM ComprisesTable');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateComprisesTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE ComprisesTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

            const result = await connection.execute(`
                CREATE TABLE ComprisesTable (
                    name VARCHAR2(40) NOT NULL,
                    eventDate DATE NOT NULL,
                    categoryDistance INTEGER,
                    startTime TIMESTAMP NOT NULL,
                    PRIMARY KEY (name,eventDate,categoryDistance),
                    FOREIGN KEY (name, eventDate) REFERENCES MarathonTable(name,eventDate)
                    ON DELETE CASCADE,
                    FOREIGN KEY (categoryDistance) REFERENCES RaceCategory(categoryDistance)
                    ON DELETE CASCADE
                )
            `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertComprisesTable(name, eventDate, categoryDistance, startTime) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the volunteerID already exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM ComprisesTable WHERE name = :name AND eventDate = TO_DATE(:eventDate,'YYYY-MM-DD') AND categoryDistance=:categoryDistance AND startTime = TO_TIMESTAMP(:startTime,'YYYY-MM-DD HH24:MI:SS') `,
                [name, eventDate,categoryDistance, startTime]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'MarathonEvent+Category+Date+Time already exists' };
            }

            // Insert the data
            const result = await connection.execute(
                `INSERT INTO ComprisesTable (name, eventDate, categoryDistance, startTime)
                 VALUES (:name, TO_DATE(:eventDate,'YYYY-MM-DD'), :categoryDistance, TO_TIMESTAMP(:startTime,'YYYY-MM-DD HH24:MI:SS'))`,
                [name, eventDate, categoryDistance, startTime],
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

async function countComprisesTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM ComprisesTable');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}
async function filterTableByCategoryDistance(categoryDistance) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
            SELECT * FROM ComprisesTable
            WHERE categoryDistance = :categoryDistance
            AND eventDate > SYSDATE
            ORDER BY categoryDistance
        `;

        const result = await connection.execute(query, [categoryDistance], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering ComprisesTable by categoryDistance');
        return null;
    });
}

async function filterTableByYear(year) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
            SELECT name, eventDate, categoryDistance FROM ComprisesTable
            WHERE EXTRACT(YEAR FROM eventDate) = :year
            ORDER BY categoryDistance
        `;

        const result = await connection.execute(query, [year], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering ComprisesTable by categoryDistance');
        return null;
    });
}

async function groupTableByYear(year) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
        SELECT categoryDistance, count(*) as Count FROM ComprisesTable
        WHERE EXTRACT(YEAR FROM eventDate) = :year
        GROUP BY categoryDistance
        ORDER BY categoryDistance
        `;

        const result = await connection.execute(query, [year], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering ComprisesTable by categoryDistance');
        return null;
    });
}

async function categoryDistancesByNameAndDate(name, eventDate) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
            SELECT categoryDistance FROM ComprisesTable
            WHERE name = :name AND TRUNC(eventDate) = TRUNC(TO_DATE(:eventDate,'YYYY-MM-DD'))
        `;
        const result = await connection.execute(query, [name, eventDate], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows.map(row => row.CATEGORYDISTANCE);
    }).catch(() => {
        console.error('Error fetching categoryDistances from ComprisesTable');
        return null;
    });
}


module.exports = {
    testOracleConnection,
    fetchComprisesTableFromDb, 
    initiateComprisesTable,
    insertComprisesTable,  
    countComprisesTable,
    filterTableByCategoryDistance,
    filterTableByYear,
    groupTableByYear,
    categoryDistancesByNameAndDate
};