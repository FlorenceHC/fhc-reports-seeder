
var res = db.getCollection('report-labels').aggregate([
    {
        $project: {
            _id: 0,
            labelId: 1
        }
    },
    {
        $group: {
            _id: null,
            labelIds: { $addToSet: '$labelId' }
        }
    }
]).toArray();

printjson({ labelIds: res[0].labelIds });
