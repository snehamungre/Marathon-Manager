const express = require('express');
const appVolunteers = require('../appDB/appVolunteers');

const routerVolunteers = express.Router();

routerVolunteers.get('/volunteerstable', async (req, res) => {
    const tableContent = await appVolunteers.fetchVolunteerTableFromDb();
    res.json({data: tableContent});
});

routerVolunteers.post("/initiate-volunteerstable", async (req, res) => {
    const initiateResult = await appVolunteers.initiateVolunteerTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerVolunteers.post("/insert-volunteerstable", async (req, res) => {
    const { id, role, marathonName, marathonDate } = req.body;
    const insertResult = await appVolunteers.insertVolunteerTable(id, role, marathonName, marathonDate);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerVolunteers.post("/update-volunteerstable", async (req, res) => {
    const { id, role, marathonName, marathonDate } = req.body;
    const updateResult = await appVolunteers.updateVolunteerTable(id, role, marathonName, marathonDate);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerVolunteers.get('/count-volunteerstable', async (req, res) => {
    const tableCount = await appVolunteers.countVolunteerTable();
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

module.exports = routerVolunteers;