'use strict';

const _ = require('lodash');
const { ObjectId } = require('mongodb');
const Faker = require('faker');
const {
    teamIds,
    binderIds,
    folderIds,
    tagIds
} = require('./internals');

const collection = 'report-tags';
const totalNumberOfDocumentsPerReport = 1000000;

const internals = {};

const script = async (db) => {

    console.log(`Inserting Tags data...`);
    await internals.insertData({ db });
    console.log(`Inserted Tags data!`);
};


internals.insertData = async ({ db }) => {

    var bulk = db.collection(collection).initializeUnorderedBulkOp();

    for (let i = 0; i < totalNumberOfDocumentsPerReport; i++) {
        bulk.insert({
            teamId: teamIds[Math.floor(Math.random() * teamIds.length)],
            documentId: ObjectId(),
            name: Faker.random.word(),
            path: Faker.random.word(),
            lineage: _.sample(folderIds, Math.floor(Math.random() * folderIds.length)),
            ext: 'pdf',
            type: 'document',
            subType: 'content',
            formStatus: 'done',
            isBrokenShortcut: false,
            binderId: _.sample(binderIds),
            binderName: Faker.random.word(),
            tagId: tagIds[Math.floor(Math.random() * tagIds.length)],
            tagName: Faker.random.word()
        });
    }

    await bulk.execute();
};

module.exports = { collection, script };
