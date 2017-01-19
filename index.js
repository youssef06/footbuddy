/**
 * Created by youssef on 1/18/17.
 */
'use strict';
const colors = require('colors');
const argv = require('yargs')
    .demandOption(['game'])
    .default('game', 'next')
    .choices('game', ['next', 'previous'])
    .option('custom', {
        alias: 'c',
        describe: 'custom team'
    })
    .argv;
const getConfig = require('./config');
const getTeamPreviousOrNextGame = require('./api').getTeamPreviousOrNextGame;
const selectTeam = require('./selectTeam');

new Promise((res, rej) => res())
.then(() => {
    if (argv.custom) {
        return selectTeam();
    } else {
        return getConfig().then(({favouriteTeam}) => {
            return favouriteTeam;
        });
    }
})
.then(({teamId}) => {
    return getTeamPreviousOrNextGame({teamId: teamId, type: argv.game})
    .then((fixture) => {
        process.stdout.write(colors.bgGreen(`The game between ${fixture.homeTeamName} and ${fixture.awayTeamName} `));
        if(argv.game === "previous") {
            process.stdout.write(colors.bgGreen(` was played on ${fixture.date} and ended `)
                + colors.bgBlue.underline(` ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam} `));
        } else {
            process.stdout.write(colors.bgGreen(` will be played on `) + colors.bgBlue.underline(` ${fixture.date} `));
        }
        console.log();
    });
}).catch((err) => {
    console.log('Something went wrong');
    console.log(err);
});;