'use strict';

const Assert = require('assert');
const { MongoClient } = require('mongodb');
const SeedScripts = require('./seed-scripts');
require('dotenv').config();

Assert(process.env.MONGO_URL, 'MONGO_URL must be specified in .env file');

const mongoUrl = process.env.MONGO_URL;
const user = process.env.DB_USER;
const password = process.env.DB_PASSWORD;

const seed = async (reportType) => {

    try {

        console.log('Script started!');
        console.time('ExecutionTime');

        console.log(`Getting seed script config for ${reportType}`);
        const seedScriptConfig = SeedScripts[reportType];
        if (!seedScriptConfig) {
            const availableScripts = Object.keys(SeedScripts);
            console.log(`Unsupported reportType "${reportType}", following reportTypes are supported: [${availableScripts}]`);
            return;
        }
        console.log('Got seed script config.')

        console.log('Connecting to database...');
        const dbOptions = {
            useNewUrlParser: true
        };
        const connection = await MongoClient.connect(mongoUrl, dbOptions);
        const db = await connection.db('reports-service-migration');
        console.log('Connected.');

        try {
            console.log(`Trying to empty collection "${seedScriptConfig.collection}"`);
            await db.collection(seedScriptConfig.collection).deleteMany();
            console.log('Emptied collection.');
        }
        catch (err) {
            console.warn(err);
        }

        console.log('Calling seed script...');
        await seedScriptConfig.script(db);
        console.log('Seed script completed.');

        console.log('Script completed!');
        console.timeEnd('ExecutionTime');
        process.exit(0);
    }
    catch (error) {
        console.error(error);
        process.exit(1);
    }
};

module.exports = seed;
