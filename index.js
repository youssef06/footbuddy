/**
 * Created by youssef on 1/18/17.
 */
'use strict';

const TYPES = {
    next: 'next',
    last: 'previous'
};

const colors = require('colors');
const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('next [games]', 'Check next game',
        (yargs) => {/*yargs.default('games', 1)*/},
        (argv) => {
            nextOrLastGames(TYPES.next, argv);
        }
    )
    .example('$0 next 5', 'view next 5 games')
    .command('last [games]', 'Check last game',
        (yargs) => {/*yargs.default('games', 1)*/},
        (argv) => {
            nextOrLastGames(TYPES.last, argv);
        }
    )
    .command('table', 'League table', {}, leagueTable)
    .option('custom', {
        alias: 'c',
        describe: 'custom team'
    })
    .help('h')
    .argv;

const getConfig = require('./config');
const getTeamPreviousOrNextGames = require('./api').getTeamPreviousOrNextGames;
const getLeagueTable = require('./api').getLeagueTable;
const selectTeam = require('./selectTeam');

/**
 * Interactive list of previous/upcoming games
 * @param type
 * @param argv
 */
function nextOrLastGames(type, argv) {

    console.log(argv.games);

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
            return getTeamPreviousOrNextGames({teamId: teamId, type: type, n: argv.games})
                .then((fixtures) => {
                    fixtures.forEach((fixture) => {
                        process.stdout.write(colors.bgGreen(`The game between ${fixture.homeTeamName} and ${fixture.awayTeamName} `));
                        if(type === TYPES.last) {
                            process.stdout.write(colors.bgGreen(` was played on `)+colors.bgBlue.underline(fixture.date) +
                                colors.bgGreen(` and ended `)
                                + colors.bgBlue.underline(` ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam} `));
                        } else {
                            process.stdout.write(colors.bgGreen(` will be played on `) + colors.bgBlue.underline(` ${fixture.date} `));
                        }
                        console.log();
                    });
                });
        }).catch((err) => {
        console.log('Something went wrong');
        console.log(err);
    });
}

/**
 * Interactive League table
 */
function leagueTable() {

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
        .then(({teamId, name, competitionId}) => {
            return getLeagueTable(competitionId)
                .then((table) => {
                    console.log(colors.bgYellow(`${table.leagueCaption}`));
                    table.standing.forEach((team) => {
                        var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
                        let matches = team._links.team.href.match(re);
                        let currentId =  matches[1];

                        let line;
                        if(currentId === teamId) {
                            line = colors.bgCyan.white(` ${("0" + team.position).slice(-2)} `) +
                                colors.bgYellow.white(`(${("0" + team.points).slice(-2)})`);
                            line += colors.bgCyan(` ${team.teamName} `);
                        } else {
                            line = colors.bgWhite.grey(` ${("0" + team.position).slice(-2)} `) +
                                colors.bgWhite.green(`(${("0" + team.points).slice(-2)})`);
                            line += colors.bgWhite.black(` ${team.teamName} `);
                        }
                        console.log(line);
                    });
                });
        }).catch((err) => {
        console.log('Something went wrong');
        console.log(err);
    });
}