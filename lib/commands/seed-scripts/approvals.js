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

const collection = 'report-approvals';
const totalNumberOfDocumentsPerReport = 200000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Approvals - Approved',
            approvalStatus: 'approved',
            formStatus: 'form-finalized',
            requestedSignaturesCount: 0
        },
        {
            name: 'Approvals - Rejected',
            approvalStatus: 'rejected',
            formStatus: 'form-finalized',
            requestedSignaturesCount: 0
        },
        {
            name: 'Approvals - Cancelled',
            approvalStatus: 'cancelled',
            formStatus: 'form-finalized',
            requestedSignaturesCount: 0
        },
        {
            name: 'Approvals - Ready For Approval',
            approvalStatus: 'pending',
            formStatus: 'form-finalized',
            requestedSignaturesCount: 0
        },
        {
            name: 'Approvals - Pending Form Completion',
            approvalStatus: 'pending',
            formStatus: 'form-in-progress',
            requestedSignaturesCount: 1
        }
    ];

    await PMap(reports, async (report) => {

        console.log(`Inserting ${report.name} data...`);
        await internals.insertData({
            db,
            approvalStatus: report.approvalStatus,
            formStatus: report.formStatus,
            requestedSignaturesCount: report.requestedSignaturesCount
        });
        console.log(`Inserted ${report.name} data!`);
    }, { concurrency: 1 });
};


internals.insertData = async (params) => {

    const {
        db, approvalStatus, formStatus, requestedSignaturesCount
    } = params;

    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.system.fileName(),
            path: Faker.lorem.sentence(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            requestedSignaturesCount,
            type: 'document',
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            approvalStatus,
            formStatus,
            updatedAt: new Date(),
            actorId: ObjectId(),
            actorName: Faker.name.findName(),
            actorEmail: Faker.internet.email(),
            actionTimestamp: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
