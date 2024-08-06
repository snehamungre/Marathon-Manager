const express = require('express');
const appVendor = require('../appDB/appVendor');
const appBooths = require('../appDB/appBooths');

const routerVendor = express.Router();

routerVendor.get('/check-db-connection', async (req, res) => {
    const isConnect = await appVendor.testOracleConnection();
    if (isConnect) {
        res.send('Connected');
    } else {
        res.send('unable to connect');
    }
});


routerVendor.get('/vendortable', async (req, res) => {
    const tableContent = await appVendor.fetchVendorTableFromDb();
    res.json({data: tableContent});
});

routerVendor.post("/initiate-vendortable", async (req, res) => {
    const initiateResult = await appVendor.initiateVendorTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerVendor.post("/insert-vendortable", async (req, res) => {
    const { name, contact, stallNo, type } = req.body;

    const insertResult = await appVendor.insertVendorTable(name, contact, stallNo, type);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerVendor.post("/update-vendortable", async (req, res) => {
    const { name, contact, stallNo, type} = req.body;
    const updateResult = await appVendor.updateVendorTable(name, contact, stallNo, type);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerVendor.post("/delete-vendor", async (req, res) => {
    const { name } = req.body;
    const deleteResult = await appVendor.deleteVendor(name);

    if (deleteResult.success) {
        res.json({ success: true, message: deleteResult.message });
    } else {
        res.status(500).json({ success: false, message: deleteResult.message });
    }
});


routerVendor.get('/count-vendortable', async (req, res) => {
    const tableCount = await appVendor.countVendorTable();
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

// todo this change the functions so that it is fetching from the correct ones 
routerVendor.get('/boothstable', async (req, res) => {
    const tableContent = await appBooths.fetchBoothsTableFromDb();
    res.json({ data: tableContent });
});

routerVendor.post("/initiate-boothstable", async (req, res) => {
    const initiateResult = await appBooths.initiateBoothsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerVendor.post("/insert-boothstable", async (req, res) => {
    const { marathonName, marathonDate, vendorName } = req.body;

    const insertResult = await appBooths.insertBoothsTable(marathonName, marathonDate, vendorName);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerVendor.get('/count-boothstable', async (req, res) => {
    const tableCount = await appBooths.countBoothsTable();
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


module.exports = routerVendor;