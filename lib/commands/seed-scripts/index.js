'use strict';

const Approvals = require('./approvals');
const Tags = require('./tags');
const Tasks = require('./tasks');
const DueExpiryDates = require('./due-expiry-dates');
const PendingSignatures = require('./pending-signatures');
const SignaturesCompleted = require('./signatures-completed');
const MonitorReviewsApproved = require('./monitor-reviews-approved');
const MonitorReviewsOpenQuery = require('./monitor-reviews-open-query');
const Labels = require('./labels');
const SipDocumentsSent = require('./sip-documents-sent');
const SipDocumentStatuses = require('./sip-document-statuses');

module.exports = {
    approvals: Approvals,
    tags: Tags,
    tasks: Tasks,
    dueExpiryDates: DueExpiryDates,
    pendingSignatures: PendingSignatures,
    signaturesCompleted: SignaturesCompleted,
    monitorReviewsApproved: MonitorReviewsApproved,
    monitorReviewsOpenQuery: MonitorReviewsOpenQuery,
    labels: Labels,
    sipDocumentsSent: SipDocumentsSent,
    sipDocumentStatuses: SipDocumentStatuses
};
