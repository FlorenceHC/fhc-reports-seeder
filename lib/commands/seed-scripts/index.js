'use strict';

const Approvals = require('./approvals');
const Tags = require('./tags');
const Tasks = require('./tasks');
const DueExpiryDates = require('./due-expiry-dates');

module.exports = {
    approvals: Approvals,
    tags: Tags,
    tasks: Tasks,
    dueExpiryDates: DueExpiryDates
};
