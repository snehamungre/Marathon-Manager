const express = require('express');
const appDonates = require('../appDB/appDonates');

const routerDonates = express.Router();

routerDonates.get('/check-db-connection', async (req, res) => {
    const isConnect = await appDonates.testOracleConnection();
    if (isConnect) {
        res.send('Connected');
    } else {
        res.send('unable to connect');
    }
});

routerDonates.get('/donatestable', async (req, res) => {
    const tableContent = await appDonates.fetchDonatesTableFromDb();
    res.json({data: tableContent});
});

routerDonates.post("/initiate-donatestable", async (req, res) => {
    const initiateResult = await appDonates.initiateDonatesTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerDonates.post("/insert-donatestable", async (req, res) => {
    const { runnerID, charityName, amount} = req.body;

    const insertResult = await appDonates.insertDonatesTable(runnerID, charityName, amount);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerDonates.post("/update-donatestable", async (req, res) => {
    const {runnerID, charityName, amount} = req.body;
    const updateResult = await appDonates.updateDonatesTable(runnerID, charityName, amount);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerDonates.get('/count-donatestable', async (req, res) => {
    const tableCount = await appDonates.countDonatesTable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCount
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});


module.exports = routerDonates;