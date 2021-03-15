'use strict';

const _ = require('lodash');
const PMap = require('p-map');
const { ObjectId } = require('mongodb');
const Faker = require('faker');
const {
    teamIds,
    binderIds,
    folderIds
} = require('./internals');

const collection = 'report-signed';
const totalNumberOfDocumentsPerReport = 300000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Signatures - Completed',
            status: 'Signed'
        },
        {
            name: 'Signatures - Declined',
            status: 'Declined'
        }
    ];

    await PMap(reports, async (report) => {

        console.log(`Inserting ${report.name} data...`);
        await internals.insertData({ db, status: report.status });
        console.log(`Inserted ${report.name} data!`);
    }, { concurrency: 1 });
};


internals.insertData = async (params) => {

    const { db, status } = params;

    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            version: _.random(1, 5),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            type: 'document',
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            status,
            reason: Faker.random.word(),
            signerId: ObjectId(),
            signerEmail: Faker.name.findName(),
            signerName: Faker.internet.email(),
            timestamp: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
