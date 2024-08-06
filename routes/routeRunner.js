const express = require('express');
const appRunner = require('../appDB/appRunner');

const routerRunner = express.Router();

routerRunner.get('/runner-table', async (req, res) => {
    const tableContent = await appRunner.fetchRunner();
    res.json({data: tableContent});
});

routerRunner.post("/initiate-runner", async (req, res) => {
    const initiateResult = await appRunner.initiateRunner();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRunner.post("/insert-runner", async (req, res) => {
    const { id, contact, fname, lname, gender, age, fkm} = req.body;
    console.log("ID in insert route", id);

    const insertResult = await appRunner.insertRunner(id, contact, fname, lname, gender, age);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerRunner.post("/update-runner", async (req, res) => {
    const { id, contact, fname, lname, gender, age } = req.body;
    const updateResult = await appRunner.updateRunner(id, contact, fname, lname, gender, age);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerRunner.get('/count-volunteertable', async (req, res) => {
    const tableCount = await appRunner.countRunner();
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

routerRunner.post("/delete-runner", async (req, res) => {
    const { runnerId } = req.body;
    const deleteResult = await appRunner.deleteRunner(runnerId);

    if (deleteResult.success) {
        res.json({ success: true, message: deleteResult.message });
    } else {
        res.status(500).json({ success: false, message: deleteResult.message });
    }
});


module.exports = routerRunner;