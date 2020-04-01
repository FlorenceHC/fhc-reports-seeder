'use strict';

const _ = require('lodash');
const PMap = require('p-map');
const { ObjectId } = require('mongodb');
const Faker = require('faker');
const {
    teamIds,
    binderIds,
    folderIds,
    labelIds
} = require('./internals');

const collection = 'report-labels';
const totalNumberOfDocumentsPerReport = 300000;

const internals = {};

const script = async (db) => {

    const reports = [
        {
            name: 'Labels - Assigned'
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

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {

        const binderId = _.sample(binderIds);
        const folderId = _.sample(folderIds);
        const objects = [
            {
                id: binderId,
                type: 'binder'
            },
            {
                id: folderId,
                type: 'folder'
            }
        ]
        const object = _.sample(objects);

        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            binderId,
            binderName: Faker.random.word(),
            objectId: object.id,
            objectType: object.type,
            location: Faker.lorem.sentence(),
            labelId: labelIds[Math.floor(Math.random() * labelIds.length)],
            labelName: Faker.random.word(),
            valueId: ObjectId(),
            value: Faker.random.word(),
            assignedAt: new Date()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
