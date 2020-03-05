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

const collection = 'report-tasks';
const totalNumberOfDocumentsPerReport = 500000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Tasks - Pending and My Queue',
            taskStatus: 'Todo',
            userId: ObjectId()
        },
        {
            name: 'Tasks - Closed',
            taskStatus: 'Closed'
        }
    ];

    await PMap(reports, async (report) => {

        console.log(`Inserting ${report.name} data...`);
        await internals.insertData({
            db,
            taskStatus: report.approvalStatus,
            userId: report.userId
        });
        console.log(`Inserted ${report.name} data!`);
    }, { concurrency: 1 });
};


internals.insertData = async (params) => {

    const {
        db, taskStatus, userId
    } = params;

    var bulk = db.collection(collection).initializeUnorderedBulkOp();


    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {

        const assignedTo = [
            {
                id: userId || ObjectId(), // here would be the user who is requesting report
                name: Faker.name.findName(),
                email: Faker.internet.email()
            },
            {
                id: ObjectId(),
                name: Faker.name.findName(),
                email: Faker.internet.email()
            },
            {
                id: ObjectId(),
                name: Faker.name.findName(),
                email: Faker.internet.email()
            },
            {
                id: ObjectId(),
                name: Faker.name.findName(),
                email: Faker.internet.email()
            },
            {
                id: ObjectId(),
                name: Faker.name.findName(),
                email: Faker.internet.email()
            }
        ];
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.random.word(),
            path: Faker.random.word(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            type: 'document',
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            taskId: ObjectId(),
            taskName: Faker.random.word(),
            taskStatus,
            assignorId: ObjectId(),
            assignorName: Faker.name.findName(),
            assignorEmail: Faker.internet.email(),
            assignedTo: _.sample(assignedTo, Math.floor(Math.random() * assignedTo.length)),
            closedById: ObjectId(),
            closedByName: Faker.name.findName(),
            closedByEmail: Faker.internet.email(),
            modifiedAt: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
