const express = require('express');
const appRunnerRookie = require('../appDB/appRunnerRookie');

const routerRunnerRookie = express.Router();

routerRunnerRookie.get('/runnerrookietable', async (req, res) => {
    const tableContent = await appRunnerRookie.fetchRunnerRookie();
    res.json({ data: tableContent });
});

routerRunnerRookie.post("/initiate-runnerrookietable", async (req, res) => {
    const initiateResult = await appRunnerRookie.initiateRunnerRookie();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRunnerRookie.post("/insert-runnerrookietable", async (req, res) => {
    const { id, et } = req.body;
    console.log("ID in insert route", id);

    const insertResult = await appRunnerRookie.insertRunnerRookie(id, et);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerRunnerRookie.post("/update-runnerrookietable", async (req, res) => {
    const { id, et } = req.body;
    const updateResult = await appRunnerRookie.updateRunnerRookie(id, et);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerRunnerRookie.get('/count-runnerrookietable', async (req, res) => {
    const tableCount = await appRunnerRookie.countRunnerRookie();
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

module.exports = routerRunnerRookie;