const express = require('express');
const appController = require('./appController');
const appSetUp = require('./appDB/appSetUp');

const routerCharity = require('./routes/routeCharity');
const routerRaceCategory = require('./routes/routeRaceCategory');
const routerRaceCourse = require('./routes/routeRaceCourse');
const routeVolunteer = require('./routes/routeVolunteer');
const routeVendor = require('./routes/routeVendor');
const routerRunnerElite = require('./routes/routeRunnerElite');
const routerRunnerRookie = require('./routes/routeRunnerRookie')
const routerRunner = require('./routes/routeRunner');
const routeSponsor = require('./routes/routeSponsor');
const routeMarathon = require('./routes/routeMarathon');
const routeComprises = require('./routes/routeComprises');
const routeDonates = require('./routes/routeDonates');
const routerRegistration = require('./routes/routeRegistration');
const routerVolunteers = require('./routes/routeVolunteers');



// Load environment variables from .env file
// Ensure your .env file has the required database credentials.
const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT || 65534;  // Adjust the PORT if needed (e.g., if you encounter a "port already occupied" error)

// Middleware setup
app.use(express.static('public'));  // Serve static files from the 'public' directory
app.use(express.json());             // Parse incoming JSON payloads


async function clearApp() {
    console.log("Clearing Database");
    await appSetUp.dropTables();
    console.log("Clearing Completed")
}
async function initializeApp() {
    console.log("Intitalizing Database");
    await appSetUp.initiateTables();
    console.log("Intitalizing Completed")
}
async function populateData() {
    console.log("Populating Tables");
    await appSetUp.insertTables();
    console.log("Populating Tables Completed");
}


async function run() {
    await clearApp();
    await initializeApp();
    await populateData();
}
run()
// mount the router
app.use('/volunteers', routerVolunteers);
app.use('/registration',routerRegistration);
app.use('/donates', routeDonates);
app.use('/comprises',routeComprises);
app.use('/runner', routerRunner);
app.use('/charity', routerCharity);
app.use('/racecategory', routerRaceCategory);
app.use('/racecourse', routerRaceCourse);
app.use('/runnerelite', routerRunnerElite);
app.use('/runnerrookie', routerRunnerRookie);
app.use('/vendor', routeVendor);
app.use('/volunteer', routeVolunteer);
app.use('/sponsor', routeSponsor);
app.use('/marathon', routeMarathon);
// app.use('/', appController);


app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/home.html');
  });

// ---------------------------------------------------------
// Starting the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});

