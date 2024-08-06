const loadEnvFile = require('../utils/envUtil');
const appService = require('../appService');
const fs = require('fs'); // Node.js file system module

const queries = fs.readFileSync('./sql/tables.sql');
const queryArr = queries.toString().split(';');
const createQueries = [];
const insertQueries = [];
const deleteQueries = [];

for (const query of queryArr) {
  const trimmedQuery = query.trim().toLowerCase();

  if (trimmedQuery.startsWith('drop')){
    deleteQueries.push(query);
  }
  if (trimmedQuery.startsWith('create')) {
    createQueries.push(query);
  } else if (trimmedQuery.startsWith('insert')) {
    insertQueries.push(query);
  }
}

async function dropTables(){
    return await appService.withOracleDB(async(connection)=>{
        for (let i = 0; i < deleteQueries.length; i++){
            const query = deleteQueries[i].trim();
            console.log(query);
            if (query) {
                await connection.execute(query);
                // console.log(query);
                await connection.commit();
                console.log(`Query ${i + 1} executed successfully`);
            }
        }
    })
}

async function initiateTables() {
    return await appService.withOracleDB(async (connection) => {
        for (let i = 0; i < createQueries.length; i++) {
            const query = createQueries[i].trim();
            if (query) {
                await connection.execute(query);
                // console.log(query);
                await connection.commit();
                console.log(`Query ${i + 1} executed successfully`);
            }
        }
        return true;
    }).catch(() => {
        return false;
    });
};

async function insertTables() {
    return await appService.withOracleDB(async (connection) => {
        for (let i = 0; i < insertQueries.length; i++) {
            
            const insert = insertQueries[i].trim();
            console.log(insert);
            await connection.execute(insert);
            await connection.commit();
            console.log('Query executed successfully');
        }
        return true;
    }).catch(() => {
        return false;
    });
}



module.exports = {
    insertTables,
    initiateTables,
    dropTables
};