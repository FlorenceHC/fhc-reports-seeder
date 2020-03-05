'use strict';

require('dotenv').config();
const Program = require('commander');
const version = require('./package.json').version;

const Commands = require('./lib/commands');

Program.setMaxListeners(50);

Program.version(version)
    .command('seed <reportType>')
    .description('Seedss specified report type')
    .action(async (reportType, command) => {

        await Commands.seed(reportType);
    });

Program.parse(process.argv);
