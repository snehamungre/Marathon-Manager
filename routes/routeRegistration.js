const express = require('express');
const appRegistration = require('../appDB/appRegistration');

const routerRegistration = express.Router();

routerRegistration.get('/registrationTable', async (req, res) => {
    const tableContent = await appRegistration.fetchRegistrationTableFromDb();
    res.json({data: tableContent});
});

routerRegistration.post("/initiate-registrationTable", async (req, res) => {
    const initiateResult = await appRegistration.initiateRegistrationTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRegistration.post("/insert-registration", async (req, res) => {
    const { confirmationID,registrationDate,finishTime,runnerID,eventName,eventDate,categoryDistance} = req.body;
    const insertResult = await appRegistration.insertRegistrationTable(confirmationID,registrationDate,finishTime,runnerID,eventName,eventDate,categoryDistance);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});


routerRegistration.post("/update-finishTime", async (req, res) => {
    const { confirmationID, newFinishTime } = req.body;
    const updateResult = await appRegistration.updateFinishTime(confirmationID, newFinishTime);
    if (updateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerRegistration.get('/registration-by-filter', async (req, res) => {
    const { categoryDistance, eventName } = req.query;
    console.log("distance = " ,categoryDistance);
    console.log("event = " ,eventName);

    if (!categoryDistance || isNaN(categoryDistance) || !eventName) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }
    console.log("Getting Results:");
    const filteredResults = await appRegistration.filterChampions(parseFloat(categoryDistance), eventName);
    console.log("Results:", filteredResults);

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});

routerRegistration.get('/registration-by-all', async (req, res) => {


    const filteredResults = await appRegistration.filterAllTimers();

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});

routerRegistration.get('/registration-by-avg-age', async (req, res) => {

    console.log("Getting Results:");
    const filteredResults = await appRegistration.filterAgeAvg();
    console.log("Results:", filteredResults);

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});


routerRegistration.get('/count-registrationTable', async (req, res) => {
    const tableCount = await appRegistration.countRegistrationTable();
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

routerRegistration.get('/runner-ids-by-filter', async (req, res) => {
    const { eventName, eventDate, categoryDistance } = req.query;

    if (!eventName || !eventDate || isNaN(categoryDistance)) {
        return res.status(400).json({ success: false, message: 'Invalid parameters' });
    }

    const runnerIDsAndFinTime = await appRegistration.getRunnerIDsAndFinishTime(eventName, eventDate, parseFloat(categoryDistance));
    if (runnerIDsAndFinTime !== null) {
        res.json({ success: true, data: runnerIDsAndFinTime });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching runner IDs' });
    }
});

routerRegistration.get('/totalRunners-by-event', async (req, res) => {
    const { greater } = req.query;
    const totalRunnersAtEvent = await appRegistration.getTotalRegistrationsForEvent(greater);
    if (totalRunnersAtEvent !== null) {
        res.json({ success: true, data: totalRunnersAtEvent });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching events' });
    }
});

module.exports = routerRegistration;