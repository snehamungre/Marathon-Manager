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


async function pastMarathons() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute(`
        SELECT * FROM MarathonTable
        WHERE
        eventDate < SYSDATE`);
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function fetchMarathonTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM MarathonTable');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateMarathonTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE MarathonTable`);
        } catch(err) {
            console.log('Table might not exist, proceeding to create...');
        }

            const result = await connection.execute(`
                CREATE TABLE MarathonTable (
                    name VARCHAR2(40) NOT NULL,
                    city VARCHAR2(40) NOT NULL,
                    eventDate DATE NOT NULL,
                    weatherCond VARCHAR2(40),
                    PRIMARY KEY (name,eventDate)
                )
            `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertMarathonTable(name, city, eventDate, weatherCond) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the volunteerID already exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM MarathonTable WHERE name = :name AND eventDate = TO_DATE(:eventDate,'YYYY-MM-DD')`,
                [name, eventDate]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Marathon Event already exists' };
            }

            // Insert the data
            const result = await connection.execute(
                `INSERT INTO MarathonTable (name, city, eventDate, weatherCond)
                 VALUES (:name,:city, TO_DATE(:eventDate,'YYYY-MM-DD'), :weatherCond)`,
                [name, city, eventDate, weatherCond],
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


async function updateMarathonTable(name, city, eventDate, weatherCond) {
    return await appService.withOracleDB(async (connection) => {
        const upeventDateParams = [];
        const upeventDateValues = { name, eventDate };

        if (weatherCond !== "") {
            upeventDateParams.push(`weatherCond = :weatherCond`);
            upeventDateValues.weatherCond = weatherCond;
        } else {
            upeventDateParams.push(`weatherCond = NULL`);
            // Use NULL when weatherCond is an empty string
        }
        const upeventDateStatement = `
            UPDATE MarathonTable
            SET ${upeventDateParams.join(', ')}
            WHERE name = :name AND TRUNC(eventDate) = TRUNC(TO_DATE(:eventDate,'YYYY-MM-DD'))`;

        const result = await connection.execute(
            upeventDateStatement,
            upeventDateValues,
            { autoCommit: true }
        );

        return result.rowsAffected && result.rowsAffected > 0;
    }).catch((error) => {
        console.error('Error updating marathon table:', error);
        return false;
    });
}






async function countMarathonTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM MarathonTable');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function deleteMarathon(name, eventDate) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the marathon exists
            const idCheckResult = await connection.execute(
                `SELECT 1 FROM MarathonTable WHERE name = :name AND TRUNC(eventDate) = TRUNC(TO_DATE(:eventDate, 'YYYY-MM-DD'))`,
                [name, eventDate]
            );
            if (idCheckResult.rows.length === 0) {
                return { success: false, message: 'Marathon not found' };
            }

            // Delete the marathon
            const result = await connection.execute(
                `DELETE FROM MarathonTable WHERE name = :name AND TRUNC(eventDate) = TRUNC(TO_DATE(:eventDate, 'YYYY-MM-DD'))`,
                [name, eventDate],
                { autoCommit: true }
            ).catch(error => {
                console.error('Error executing SQL query:', error);
                throw error;
            });

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

async function filterMarathonTable(name, city, eventDate) {
    return await appService.withOracleDB(async (connection) => {
        const baseQuery = 'SELECT * FROM MarathonTable WHERE 1=1';
        const queryParams = {};
        
        if(!name&&!city&&!eventDate){
            return fetchMarathonTableFromDb();
        }

        if (name) {
            queryParams.name = name.toLowerCase();
        }

        if (city) {
            queryParams.city = city.toLowerCase();
        }

        if (eventDate) {
            console.log(eventDate);
            queryParams.eventDate = eventDate;
        }
        const whereClauses = Object.keys(queryParams).map((key) => {
            if (key === 'name' || key === 'city') {
                return `LOWER(${key}) LIKE :${key}`;
            } else if (key === 'eventDate'){
                return `TRUNC(eventDate) = TRUNC(TO_DATE(:${key}, 'YYYY-MM-DD'))`
            } else {
                return `${key} = :${key}`;

            }
        });

        const filterQuery = `${baseQuery} AND ${whereClauses.join(' AND ')}`;

        const result = await connection.execute(filterQuery, queryParams);
        return result.rows;
    }).catch((e) => {
        console.log(e);
        return [];
    });
}



module.exports = {
    testOracleConnection,
    fetchMarathonTableFromDb, 
    initiateMarathonTable,
    insertMarathonTable, 
    updateMarathonTable, 
    countMarathonTable,
    deleteMarathon,
    filterMarathonTable,
    pastMarathons
};