'use strict';

const { ObjectId } = require('mongodb');

const teamIds = Array.from({ length: 3 }, () => ObjectId());
const binderIds = Array.from({ length: 700 }, () => ObjectId());
const folderIds = Array.from({ length: 7000 }, () => ObjectId());
const tagIds = Array.from({ length: 10 }, () => ObjectId());

module.exports = {
    teamIds,
    binderIds,
    folderIds,
    tagIds
};
