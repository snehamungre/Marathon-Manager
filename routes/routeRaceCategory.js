const express = require('express');
const appRaceCategory = require('../appDB/appRaceCategory');

const routerRaceCategory = express.Router();

// ----------------------------------------------------------
// API endpoints

routerRaceCategory.get('/racecategory', async (req, res) => {
    const tableContent = await appRaceCategory.fetchRaceCategoryTableFromDb();
    res.json({ data: tableContent });
});

routerRaceCategory.post("/initiate-racecategory", async (req, res) => {
    const initiateRaceCategoryTable = await appRaceCategory.initiateRaceCategoryTable();
    if (initiateRaceCategoryTable) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRaceCategory.post("/insert-racecategory", async (req, res) => {
    const { distance, fee } = req.body;

    const insertRaceCategoryTable = await appRaceCategory.insertRaceCategoryTable(distance, fee);

    if (insertRaceCategoryTable.success) {
        res.json({ success: true, message: insertRaceCategoryTable.message });
    } else {
        res.status(500).json({ success: false, message: insertRaceCategoryTable.message });
    }
});


routerRaceCategory.post("/update-racecategory", async (req, res) => {
    const { distance, fee } = req.body;
    const updateRaceCategoryTable = await appRaceCategory.updateRaceCategoryTable(distance, fee);
    if (updateRaceCategoryTable) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRaceCategory.get('/count-racecategory', async (req, res) => {
    const tableCount = await appRaceCategory.countRaceCategoryTable();
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

module.exports = routerRaceCategory;
