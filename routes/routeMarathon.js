const express = require('express');
const appMarathon = require('../appDB/appMarathon.js');

const routerMarathon = express.Router();

routerMarathon.get('/marathon-table', async (req, res) => {
    const tableContent = await appMarathon.fetchMarathonTableFromDb();
    res.json({data: tableContent});
});

routerMarathon.post("/initiate-marathon-table", async (req, res) => {
    const initiateResult = await appMarathon.initiateMarathonTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerMarathon.post("/insert-marathon-table", async (req, res) => {
    const { name, city, eventDate, weatherCond } = req.body;
    const insertResult = await appMarathon.insertMarathonTable(name, city, eventDate, weatherCond);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerMarathon.post("/update-marathon-table", async (req, res) => {
    const { name, city, eventDate, weatherCond } = req.body;
    const updateResult = await appMarathon.updateMarathonTable(name, city, eventDate, weatherCond );
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});


routerMarathon.post("/delete-marathon", async (req, res) => {
    const { name, eventDate } = req.body;
    const deleteResult = await appMarathon.deleteMarathon(name, eventDate);

    if (deleteResult.success) {
        res.json({ success: true, message: deleteResult.message });
    } else {
        res.status(500).json({ success: false, message: deleteResult.message });
    }
});


routerMarathon.get('/count-marathon-table', async (req, res) => {
    const tableCount = await appMarathon.countMarathonTable();
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

routerMarathon.get('/marathon-table-filter', async (req, res) => {
    try {
        const { name, city, date } = req.query;
        const filteredData = await appMarathon.filterMarathonTable(name, city, date);
        res.json({ data: filteredData });
    } catch (error) {
        console.error('Error filtering marathon table data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

routerMarathon.get('/past-marathon-table', async (req, res) => {
    const tableContent = await appMarathon.pastMarathons();
    res.json({data: tableContent});
});


module.exports = routerMarathon;