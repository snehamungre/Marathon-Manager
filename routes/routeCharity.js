const express = require('express');
const appCharity = require('../appDB/appCharity');

const routerCharity = express.Router();

// ----------------------------------------------------------
// API endpoints

routerCharity.get('/charitytable', async (req, res) => {
    const tableContent = await appCharity.fetchCharityTableFromDb();
    res.json({data: tableContent});
});

routerCharity.get('/charity-amount', async (req, res) => {
    const tableContent = await appCharity.fetchCharityAmountFromDb();
    res.json({data: tableContent});
});

routerCharity.post("/initiate-charitytable", async (req, res) => {
    const initiateResult = await appCharity.initiateCharityTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerCharity.post("/insert-charitytable", async (req, res) => {
    const { name, country} = req.body;

    const insertResult = await appCharity.insertCharityTable(name, country);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerCharity.post("/update-charitytable", async (req, res) => {
    const { name, country} = req.body;
    const updateResult = await appCharity.updateCharityTable(name, country);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerCharity.get('/count-charitytable', async (req, res) => {
    const tableCount = await appCharity.countCharityTable();
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

routerCharity.get('/causecharitytable', async (req, res) => {
    const tableContent = await appCharity.fetchCauseCharityTableFromDb();
    res.json({data: tableContent});
});

routerCharity.post("/initiate-causecharitytable", async (req, res) => {
    const initiateResult = await appCharity.initiateCauseCharityTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerCharity.post("/insert-causecharitytable", async (req, res) => {
    const { name, cause} = req.body;

    const insertResult = await appCharity.insertCauseCharityTable(name, cause);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});

routerCharity.get('/count-causecharitytable', async (req, res) => {
    const tableCount = await appCharity.countCauseCharityTable();
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

module.exports = routerCharity;
