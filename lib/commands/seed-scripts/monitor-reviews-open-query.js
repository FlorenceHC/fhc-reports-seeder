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

const collection = 'report-monitor-reviews-open-query';
const totalNumberOfDocumentsPerReport = 300000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Monitor Reviews - Open Query'
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

    const paywalls = [ObjectId(), ObjectId()];

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            ext: 'pdf',
            type: 'document',
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            monitorReviewId: ObjectId(),
            monitorReviewName: Faker.random.word(),
            labelValueId: ObjectId(),
            paywallId: _.sample(paywalls),
            openedByUserId: ObjectId(),
            openedByUserName: Faker.name.findName(),
            openedByUserEmail: Faker.internet.email(),
            openedAt: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
