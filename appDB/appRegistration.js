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

async function fetchRegistrationTableFromDb() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT * FROM Registration');
        return result.rows;
    }).catch(() => {
        return [];
    });
}

async function initiateRegistrationTable() {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the table exists
            await connection.execute(`DROP TABLE Registration`);
        } catch (err) {
            console.log('Table might not exist, proceeding to create...');
        }

        const result = await connection.execute(`
            CREATE TABLE Registration (
                confirmationID INTEGER NOT NULL,
                registrationDate DATE NOT NULL,
                finishTime INTEGER,
                runnerID INTEGER NOT NULL,
                eventName VARCHAR2(40) NOT NULL,
                eventDate DATE NOT NULL,
                categoryDistance INTEGER,
                PRIMARY KEY (confirmationID),
                FOREIGN KEY (runnerID) REFERENCES Runner(runnerID)
                ON DELETE CASCADE,
                FOREIGN KEY (eventName,eventDate,categoryDistance) REFERENCES ComprisesTable(name,eventDate,categoryDistance)
                ON DELETE CASCADE
            )
        `);

        return true;
    }).catch(() => {
        return false;
    });
}

async function insertRegistrationTable(confirmationID,registrationDate,finishTime,runnerID,eventName,eventDate,categoryDistance) {
    return await appService.withOracleDB(async (connection) => {
        try {
            // Check if the runner has already regsitered for an event on the same day
            const idCheckResult = await connection.execute(
                'SELECT 1 FROM Registration WHERE runnerID = :runnerID AND eventDate = :eventDate',
                [runnerID,eventDate]
            );

            if (idCheckResult.rows.length > 0) {
                return { success: false, message: 'Runner already registered for a race on this date' };
            }

            // Insert the data
            const result = await connection.execute(
                `INSERT INTO Registration 
                (confirmationID,registrationDate,finishTime,runnerID,eventName,eventDate,categoryDistance) VALUES 
                (:confirmationID,TO_DATE(:registrationDate, 'YYYY-MM-DD'),:finishTime,:runnerID,:eventName,TO_DATE(:eventDate, 'YYYY-MM-DD'),:categoryDistance)`,
                [confirmationID,registrationDate,finishTime,runnerID,eventName,eventDate,categoryDistance],
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

async function updateFinishTime(confirmationID, newFinishTime) {
    return await appService.withOracleDB(async (connection) => {
        const updateStatement = `UPDATE Registration SET finishTime = :finishTime WHERE confirmationID = :confirmationID`;
        const updateValues = [newFinishTime, confirmationID];

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

async function filterChampions(categoryDistance, eventName) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
        SELECT EXTRACT(YEAR FROM T.eventDate) AS Year,
        R2.FIRSTNAME, R2.LASTNAME, T.FINISHTIME
        FROM REGISTRATION T
        INNER JOIN RUNNER R2 ON R2.RUNNERID = T.RUNNERID
        WHERE T.eventDate < SYSDATE
        AND T.EVENTNAME = :eventName
        AND T.CATEGORYDISTANCE = :categoryDistance
        ORDER BY T.FINISHTIME
        FETCH FIRST 1 ROW ONLY
        `;

        const result = await connection.execute(query, [eventName,categoryDistance], { outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering Registration by event and category');
        return null;
    });
}

async function filterAllTimers() {

    return await appService.withOracleDB(async (connection) => {
        const query = `
        SELECT R2.FIRSTNAME, R2.LASTNAME
        FROM RUNNER R2
        WHERE R2.RUNNERID = (SELECT R.RUNNERID
                        FROM REGISTRATION R
                        WHERE EXTRACT(YEAR FROM R.eventDate) = 2023
                        GROUP BY R.RUNNERID
                        HAVING COUNT(DISTINCT R.EVENTNAME) = (
                            SELECT COUNT(DISTINCT EVENTNAME)
                            FROM REGISTRATION
                            WHERE EXTRACT(YEAR FROM eventDate) = 2023
                            ))
         `;
        
        const result = await connection.execute(query,[], {outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering Registration by event and category');
        return null;
    });
}

async function filterAgeAvg() {

    return await appService.withOracleDB(async (connection) => {
        const query = `
        SELECT R.CATEGORYDISTANCE, round(AVG(AGE)) as Average_Age
        FROM REGISTRATION R
        JOIN RUNNER R2 on R.RUNNERID = R2.RUNNERID
        GROUP BY R.CATEGORYDISTANCE
        HAVING round(avg(AGE)) >= ALL (SELECT  round(AVG(AGE))
                               FROM RUNNER
                               GROUP BY GENDER)
         `
         ;
        
        const result = await connection.execute(query,[], {outFormat: oracledb.OUT_FORMAT_OBJECT });

        return result.rows;
    }).catch(() => {
        console.error('Error filtering Registration by event and category');
        return null;
    });
}


async function countRegistrationTable() {
    return await appService.withOracleDB(async (connection) => {
        const result = await connection.execute('SELECT Count(*) FROM Registration');
        return result.rows[0][0];
    }).catch(() => {
        return -1;
    });
}

async function getRunnerIDsAndFinishTime(eventName, eventDate, categoryDistance) {
    return await appService.withOracleDB(async (connection) => {
        const query = `
            SELECT DISTINCT runnerID, finishTime
            FROM Registration
            WHERE eventName = :eventName
              AND eventDate = TO_DATE(:eventDate, 'YYYY-MM-DD')
              AND categoryDistance = :categoryDistance
        `;

        const result = await connection.execute(query, [eventName, eventDate, categoryDistance], { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows.map(row => ({ runnerID: row.RUNNERID, finishTime: row.FINISHTIME }));
    }).catch(() => {
        console.error('Error getting runnerIDs');
        return [];
    });
}

async function getTotalRegistrationsForEvent(greater) {
    if (!greater) {
        greater = 0;
    }
    return await appService.withOracleDB(async (connection) => {
        const query = `
            SELECT eventName, eventDate, Count(runnerID) as Total
            FROM Registration
            GROUP BY eventName , eventDate
            HAVING COUNT(runnerID) > :greater
        `;
        const result = await connection.execute(query, { greater: greater }, { outFormat: oracledb.OUT_FORMAT_OBJECT });
        return result.rows;
    }).catch(() => {
        console.error('Error getting runnerIDs');
        return [];
    });
}




module.exports = {
    testOracleConnection,
    fetchRegistrationTableFromDb,
    initiateRegistrationTable,
    insertRegistrationTable,
    updateFinishTime,
    filterChampions,
    countRegistrationTable,
    filterAllTimers,
    getRunnerIDsAndFinishTime,
    filterAgeAvg,
    getTotalRegistrationsForEvent
};