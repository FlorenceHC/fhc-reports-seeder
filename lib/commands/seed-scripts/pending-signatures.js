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

const collection = 'report-signatures';
const totalNumberOfDocumentsPerReport = 300000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Signatures - Pending, My Queue and Sign By Date'
        }
    ];

    await PMap(reports, async (report) => {

        console.log(`Inserting ${report.name} data...`);
        await internals.insertData({ db });
        console.log(`Inserted ${report.name} data!`);
    }, { concurrency: 1 });
};


internals.insertData = async (params) => {

    const { db } = params;

    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    const userId = ObjectId("59de1c0a39ba18001a0d0000");
    const requestees = [userId, ObjectId()];

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            type: 'document',
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            signatureRequestId: ObjectId(),
            signByDate: new Date(),
            isInApprovalWorkflow: Math.random() >= 0.5,
            requesterId: ObjectId(),
            requesterName: Faker.name.findName(),
            requesterEmail: Faker.internet.email(),
            requesteeId: _.sample(requestees),
            requesteeName: Faker.name.findName(),
            requesteeEmail: Faker.internet.email(),
            reason: Faker.random.word(),
            requestedOn: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
