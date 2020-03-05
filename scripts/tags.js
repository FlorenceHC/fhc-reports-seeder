
var res = db.getCollection('report-tags').aggregate([
    {
        $project: {
            _id: 0,
            tagId: 1
        }
    },
    {
        $group: {
            _id: null,
            tagIds: { $addToSet: '$tagId' }
        }
    }
]).toArray();

printjson({ tagIds: res[0].tagIds });
