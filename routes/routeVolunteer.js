const express = require('express');
const appVolunteer = require('../appDB/appVolunteer');

const routerVolunteer = express.Router();

routerVolunteer.get('/volunteertable', async (req, res) => {
    const tableContent = await appVolunteer.fetchVolunteerTableFromDb();
    res.json({data: tableContent});
});

routerVolunteer.post("/initiate-volunteertable", async (req, res) => {
    const initiateResult = await appVolunteer.initiateVolunteerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerVolunteer.post("/insert-volunteertable", async (req, res) => {
    const { id, firstName, lastName, contact } = req.body;
    const insertResult = await appVolunteer.insertVolunteerTable(id, firstName, lastName, contact);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerVolunteer.post("/update-volunteertable", async (req, res) => {
    const { id, newContact, newFName, newLName } = req.body;
    const updateResult = await appVolunteer.updateVolunteerTable(id, newContact, newFName, newLName);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerVolunteer.get('/count-volunteertable', async (req, res) => {
    const tableCount = await appVolunteer.countVolunteerTable();
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

routerVolunteer.post("/delete-volunteertable", async (req, res) => {
    const { id } = req.body;
    const deleteResult = await appVolunteer.deleteVolunteer(id);

    if (deleteResult.success) {
        res.json({ success: true, message: deleteResult.message });
    } else {
        res.status(500).json({ success: false, message: deleteResult.message });
    }
});

module.exports = routerVolunteer;