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

const collection = 'report-due-expiry-dates';
const totalNumberOfDocumentsPerReport = 300000;
const oneDayMs = 1000 * 60 * 60 * 24;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Expiring Documents',
            dueDate: null,
            expirationDate: [
                new Date(Date.now() - oneDayMs),
                new Date(Date.now()),
                new Date(Date.now() + oneDayMs),
                new Date(Date.now() + oneDayMs * 10),
                new Date(Date.now() + oneDayMs * 30),
                new Date(Date.now() + oneDayMs * 50),
            ]
        },
        {
            name: 'Due Documents',
            expirationDate: null,
            dueDate: [
                new Date(Date.now() - oneDayMs),
                new Date(Date.now()),
                new Date(Date.now() + oneDayMs),
                new Date(Date.now() + oneDayMs * 10),
                new Date(Date.now() + oneDayMs * 30),
                new Date(Date.now() + oneDayMs * 50),
            ]
        }
    ];

    await PMap(reports, async (report) => {

        console.log(`Inserting ${report.name} data...`);
        await internals.insertData({
            db,
            expirationDate: report.expirationDate,
            dueDate: report.dueDate
        });
        console.log(`Inserted ${report.name} data!`);
    }, { concurrency: 1 });
};


internals.insertData = async (params) => {

    const {
        db, expirationDate, dueDate
    } = params;

    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            ext: dueDate ? '' : 'pdf',
            subType: dueDate ? 'placeholder' : 'content',
            type: 'document',
            formStatus: dueDate ? '' : 'completed',
            isBrokenShortcut: false,
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            expirationDate: _.sample(expirationDate),
            dueDate: _.sample(dueDate),
            updatedAt: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
