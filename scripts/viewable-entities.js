/**
 * TO BE RAN IN MONGO SHELL
 * collectionName should be one of:
 *  report-approvals
 *  report-tags
 *  report-tasks ...
 */

var collectionName = 'report-approvals';

var res = db.getCollection(collectionName).aggregate([
    {
        $unwind: { path: '$lineage' }
    },
    {
        $sample: { size: 2000 }
    },
    {
        $project: {
            _id: 0,
            teamId: 1,
            binderId: 1,
            documentId: 1,
            lineage: 1
        }
    },
    {
        $group: {
            _id: null,
            teams: { $addToSet: '$teamId' },
            binders: { $addToSet: '$binderId' },
            folders: { $addToSet: '$lineage' },
            documents: { $addToSet: '$documentId' },
        }
    }
]).toArray();

var viewableEntities = {
    teams: [res[0].teams[0]],
    binders: res[0].binders,
    folders: res[0].folders,
    documents: res[0].documents
}

printjson(viewableEntities);
