const express = require('express');
const appSponsor = require('../appDB/appSponsor');
const appSponsors = require('../appDB/appSponsors');

const routerSponsor = express.Router();

routerSponsor.get('/check-db-connection', async (req, res) => {
    const isConnect = await appSponsor.testOracleConnection();
    if (isConnect) {
        res.send('Connected');
    } else {
        res.send('unable to connect');
    }
});


routerSponsor.get('/sponsortable', async (req, res) => {
    const tableContent = await appSponsor.fetchSponsorTableFromDb();
    res.json({data: tableContent});
});

routerSponsor.post("/initiate-sponsortable", async (req, res) => {
    const initiateResult = await appSponsor.initiateSponsorTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerSponsor.post("/insert-sponsortable", async (req, res) => {
    const { name, contribution } = req.body;

    const insertResult = await appSponsor.insertSponsorTable(name, contribution);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerSponsor.post("/update-sponsortable", async (req, res) => {
    const { name, contribution} = req.body;
    const updateResult = await appSponsor.updateSponsorTable(name, contribution);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});



routerSponsor.get('/count-sponsortable', async (req, res) => {
    const tableCount = await appSponsor.countSponsorTable();
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

routerSponsor.post("/delete-sponsor", async (req, res) => {
    const { name } = req.body;
    const deleteResult = await appSponsor.deleteSponsor(name);

    if (deleteResult.success) {
        res.json({ success: true, message: deleteResult.message });
    } else {
        res.status(500).json({ success: false, message: deleteResult.message });
    }
});


// routes for the Sponsors table
routerSponsor.get('/sponsorstable', async (req, res) => {
    const tableContent = await appSponsors.fetchSponsorsTableFromDb();
    res.json({ data: tableContent });
});

routerSponsor.post("/initiate-sponsorstable", async (req, res) => {
    const initiateResult = await appSponsors.initiateSponsorsTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerSponsor.post("/insert-sponsorstable", async (req, res) => {
    const { marathonName, marathonDate, sponsorName } = req.body;

    const insertResult = await appSponsors.insertSponsorsTable(marathonName, marathonDate, sponsorName);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerSponsor.get('/count-sponsorstable', async (req, res) => {
    const tableCount = await appSponsors.countSponsorsTable();
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


module.exports = routerSponsor;