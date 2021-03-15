/**
 * TO BE RAN IN MONGO SHELL
 * collectionName should be one of:
 *  report-monitor-reviews-open-query
 *  report-monitor-reviews-approved
 */
var res = db.getCollection('report-monitor-reviews-approved').aggregate([
    {
        $project: {
            _id: 0,
            paywallId: 1
        }
    },
    {
        $group: {
            _id: null,
            paywallIds: { $addToSet: '$paywallId' }
        }
    }
]).toArray();

printjson({ paywallIds: res[0].paywallIds });
