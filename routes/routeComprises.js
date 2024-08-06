const express = require('express');
const appComprises = require('../appDB/appComprises.js');

const routerComprises = express.Router();

routerComprises.get('/comprises-table', async (req, res) => {
    const tableContent = await appComprises.fetchComprisesTableFromDb();
    res.json({data: tableContent});
});

routerComprises.post("/initiate-comprises-table", async (req, res) => {
    const initiateResult = await appComprises.initiateComprisesTable();
    if (initiateResult) {
        res.json({ success: true });
    } else {
        res.status(500).json({ success: false });
    }
});

routerComprises.post("/insert-comprises-table", async (req, res) => {
    const { name, eventDate, categoryDistance, startTime } = req.body;
    const insertResult = await appComprises.insertComprisesTable(name, eventDate, categoryDistance, startTime);

    if (insertResult.success) {
        res.json({ success: true, message: insertResult.message });
    } else {
        res.status(500).json({ success: false, message: insertResult.message });
    }
});



routerComprises.get('/count-comprises-table', async (req, res) => {
    const tableCount = await appComprises.countComprisesTable();
    if (tableCount >= 0) {
        res.json({ 
            success: true,  
            count: tableCounts
        });
    } else {
        res.status(500).json({ 
            success: false, 
            count: tableCount
        });
    }
});

routerComprises.get('/comprises-by-category', async (req, res) => {
    const { categoryDistance } = req.query;
    console.log("categoryDistance=", categoryDistance);
    // Validate categoryDistance parameter
    if (!categoryDistance || isNaN(categoryDistance)) {
        return res.status(400).json({ success: false, message: 'Invalid categoryDistance parameter' });
    }

    const filteredResults = await appComprises.filterTableByCategoryDistance(parseFloat(categoryDistance));

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});

routerComprises.get('/comprises-by-year', async (req, res) => {
    const { year } = req.query;
    console.log("year=", year);
    // Validate categoryDistance parameter
    if (!year || isNaN(year)) {
        return res.status(400).json({ success: false, message: 'Invalid year parameter' });
    }

    const filteredResults = await appComprises.filterTableByYear(parseInt(year));

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});

routerComprises.get('/group-by-year', async (req, res) => {
    const { year } = req.query;
    console.log("group by year=", year);
    // Validate categoryDistance parameter
    if (!year || isNaN(year)) {
        return res.status(400).json({ success: false, message: 'Invalid year parameter' });
    }

    const filteredResults = await appComprises.groupTableByYear(parseInt(year));

    if (filteredResults !== null) {
        res.json({ success: true, data: filteredResults });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching results based on categoryDistance' });
    }
});

routerComprises.get('/category-distances-by-name-and-date', async (req, res) => {
    const { name, eventDate } = req.query;

    // Validate name and eventDate parameters
    if (!name || !eventDate) {
        return res.status(400).json({ success: false, message: 'Invalid name or eventDate parameter' });
    }

    const categoryDistances = await appComprises.categoryDistancesByNameAndDate(name, eventDate);
    if (categoryDistances !== null) {
        res.json({ success: true, data: categoryDistances });
    } else {
        res.status(500).json({ success: false, message: 'Error fetching categoryDistances based on name and eventDate' });
    }
});

module.exports = routerComprises;