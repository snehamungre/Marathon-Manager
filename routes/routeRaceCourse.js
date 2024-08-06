const express = require('express');
const appRaceCourse = require('../appDB/appRaceCourse');

const routerRaceCourse = express.Router();

// ----------------------------------------------------------
// API endpoints

routerRaceCourse.get('/racecourse', async (req, res) => {
    const tableContent = await appRaceCourse.fetchRaceCourseTableFromDb();
    res.json({ data: tableContent });
});

routerRaceCourse.post("/initiate-racecourse", async (req, res) => {
    const initiateRaceCourseTable = await appRaceCourse.initiateRaceCourseTable();
    if (initiateRaceCourseTable) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRaceCourse.post("/insert-racecourse", async (req, res) => {
    const { distance, name, tarrain, stp, endp } = req.body;

    const insertRaceCourseTable = await appRaceCourse.insertRaceCourseTable(distance, name, tarrain, stp, endp);

    if (insertRaceCourseTable.success) {
        res.json({ success: true, message: insertRaceCourseTable.message });
    } else {
        res.status(500).json({ success: false, message: insertRaceCourseTable.message });
    }
});


routerRaceCourse.post("/update-racecourse", async (req, res) => {
    const { distance, name, tarrain, stp, endp } = req.body;
    const updateRaceCourseTable = await appRaceCourse.updateRaceCourseTable(distance, name, tarrain, stp, endp);
    if (updateRaceCourseTable) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRaceCourse.get('/count-racecourse', async (req, res) => {
    
    const tableCount = await appRaceCourse.countRaceCourseTable();
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

module.exports = routerRaceCourse;
