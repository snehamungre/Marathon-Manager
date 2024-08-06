const express = require('express');
const appRunnerElite = require('../appDB/appRunnerElite');

const routerRunnerElite = express.Router();

routerRunnerElite.get('/runner-elite-table', async (req, res) => {
    const tableContent = await appRunnerElite.fetchRunnerElite();
    res.json({data: tableContent});
});

routerRunnerElite.post("/initiate-runner-elite", async (req, res) => {
    const initiateResult = await appRunnerElite.initiateRunnerElite();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRunnerElite.post("/insert-runner-elite", async (req, res) => {
    const { id, fkm} = req.body;
    console.log("ID in insert route", id);

    const insertResult = await appRunnerElite.insertRunnerElite(id, fkm);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerRunnerElite.post("/update-runner-elite", async (req, res) => {
    const { id, fkm } = req.body;
    const updateResult = await appRunnerElite.updateRunnerElite(id, fkm);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerRunnerElite.get('/count-volunteertable', async (req, res) => {
    const tableCount = await appRunnerElite.countRunnerElite();
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

module.exports = routerRunnerElite;