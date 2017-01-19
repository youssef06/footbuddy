/**
 * Created by youssef on 1/18/17.
 */
'use strict';
const argv = require('yargs')
    .demandOption(['game'])
    .default('game', 'next')
    .choices('game', ['next', 'previous'])
    .argv;
const getConfig = require('./config');
const getTeamPreviousOrNextGame = require('./api');

getConfig()
    .then(({favouriteTeam}) => {
        return getTeamPreviousOrNextGame({teamId: favouriteTeam.id, type: argv.game})
            .then((fixture) => {
                process.stdout.write(`The game between ${fixture.homeTeamName} and ${fixture.awayTeamName} `);
                if(argv.game === "previous") {
                    process.stdout.write(` was played on ${fixture.date} and ended ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam}`);
                } else {
                    process.stdout.write(` will be played on ${fixture.date}`);
                }
            });
    })
    .catch((err) => {
        console.log('Something went wrong');
        console.log(err);
    });