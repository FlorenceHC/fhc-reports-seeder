# fhc-reports-seeder

This repository is used for seeding report data into migration database used in performance testing

### .env

```
MONGO_URL=mongodb://host_xxx:27017/database_xxx #(required) connection to database that report data will be inserted in
```

### Running the script

```
npm install # install dependencies
node index seed <reportType> # creates report data (reportType: [approvals, tags, tasks, dueExpiryDates])
```

### Getting request data

To get request params, script(s) from scripts/ will need to be executed in mongo shell

```
scripts/viewable-entities # used to get viewable entities for request payload
scripts/tags # used to get tagIds for request query
```
