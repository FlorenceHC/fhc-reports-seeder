'use strict';

const _ = require('lodash');
const PMap = require('p-map');
const { ObjectId } = require('mongodb');
const Faker = require('faker');
const {
    teamIds,
    binderIds,
    folderIds,
} = require('./internals');

const collection = 'report-document-status';
const versions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const sipStatuses = ['Approved', 'Rejected', 'Request for Revision'];
const totalNumberOfDocumentsPerReport = 300000;
const reportName = 'SIP - Document Statuses';

const script = async (db) => {
    console.log(`Inserting ${reportName} data...`);
    await insertData({ db });
    console.log(`Inserted ${reportName} data!`);
};

const insertData = async (params) => {

    const { db } = params;
    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {

        bulk.insert({
            teamId: _.sample(teamIds),
            documentId: ObjectId(),
            version: _.sample(versions),
            sipVersion: Faker.random.word(),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sampleSize(folderIds, Math.floor(Math.random() * 15)),
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            type: 'document',
            status: _.sample(sipStatuses),
            createdBy: ObjectId(),
            timestamp: new Date()
        });
    }
    console.log('Executing bulk operation');
    await bulk.execute();
};

module.exports = { collection, script };
