/**
 * TO BE RAN IN MONGO SHELL
 * collectionName should be only report-labels
 *
 * null value from the end result in folders array should be removed
 */

var collectionName = 'report-labels';

var res = db.getCollection(collectionName).aggregate([
    {
        $sample: { size: 2000 }
    },
    {
        $project: {
            _id: 0,
            teamId: 1,
            binderId: 1,
            folderId: {
                $cond: {
                    if: { $eq: ['$objectType', 'folder'] },
                    then: '$objectId',
                    else: null
                }
            }
        }
    },
    {
        $group: {
            _id: null,
            teams: { $addToSet: '$teamId' },
            binders: { $addToSet: '$binderId' },
            folders:  { $addToSet: '$folderId' },
        }
    }
]).toArray();

var viewableEntities = {
    teams: [res[0].teams[0]],
    binders: res[0].binders,
    folders: res[0].folders,
}

printjson(viewableEntities);
