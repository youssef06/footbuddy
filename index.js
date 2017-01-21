/**
 * Created by youssef on 1/18/17.
 */
'use strict';

const TYPES = {
    next: 'next',
    last: 'previous'
};
const Table = require('cli-table2');
const colors = require('colors');
const getConfig = require('./config');
const getTeamPreviousOrNextGames = require('./api').getTeamPreviousOrNextGames;
const getLeagueTable = require('./api').getLeagueTable;
const selectTeam = require('./selectTeam');
const argv = require('yargs')
    .usage('Usage: $0 <command> [options]')
    .command('next [n]', 'Check upcoming n games',
        (yargs) => {/*yargs.default('games', 1)*/},
        (argv) => {
            nextOrLastGames(TYPES.next, argv);
        }
    )
    .example('$0 next 5', 'View next 5 games of your favourite team')
    .command('last [n]', 'Check last n games',
        (yargs) => {/*yargs.default('games', 1)*/},
        (argv) => {
            nextOrLastGames(TYPES.last, argv);
        }
    )
    .example('$0 last 5', 'View last 5 games of your favourite team')
    .command('table', 'View league table', {}, leagueTable)
    .example('$0 table', 'View league table of your favourite team')
    .option('custom', {
        alias: 'c',
        describe: 'Choose a custom team instead of your favourite team.'
    })
    .example('$0 next 5 --custom', 'Choose a different team then view their next 5 games')
    .example('$0 table --custom', 'Choose a different team then view their position in their league table')
    .help('h')
    .epilog('Made by Youssef 2017.')
    .argv;

/**
 * Interactive list of previous/upcoming games
 * @param type
 * @param argv
 */
function nextOrLastGames(type, argv) {

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
            return getTeamPreviousOrNextGames({teamId: teamId, type: type, n: argv.n})
                .then((fixtures) => {
                    let head = [
                        colors.bgWhite.black.bold(` Home `),
                        colors.bgWhite.black.bold(` Away `),
                        colors.bgWhite.black.bold(` Date `)
                    ];
                    if(type === TYPES.last) {
                        head.push(colors.bgBlack.white(` Result `));
                    }
                    let cliTable = new Table({
                        head: head,
                        style: {
                            border: ['cyan', 'bgWhite'],
                            'padding-left': 1,
                            'padding-right': 1,
                            empty: ['bgWhite']
                        }
                    });
                    fixtures.forEach((fixture) => {
                        let row = [
                            colors.bgWhite.black(fixture.homeTeamName),
                            colors.bgWhite.black(fixture.awayTeamName),
                            colors.bgWhite.black(fixture.date)
                        ];
                        if(type === TYPES.last) {
                            row.push(colors.bgCyan.white.underline(` ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam} `));
                        }
                        cliTable.push(row);
                    });

                    console.log(cliTable.toString());
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
                    console.log(colors.bgYellow.white(`${table.leagueCaption}`));

                    let cliTable = new Table({
                        head: [
                            colors.bgWhite.black.bold(` Pos `),
                            colors.bgWhite.black.bold(` Team `),
                            colors.bgWhite.black.bold(` Pts `),
                            colors.bgWhite.black.bold(` Played `)
                        ],
                        style: {
                            border: ['cyan', 'bgWhite'],
                            'padding-left': 0,
                            'padding-right': 0,
                            empty: ['bgWhite']
                        }
                    });
                    table.standing.forEach((team) => {
                        var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
                        let matches = team._links.team.href.match(re);
                        let currentId =  matches[1];

                        if(currentId === teamId) {
                            cliTable.push([
                                colors.bgGreen.white(` ${("0" + team.position).slice(-2)} `),
                                colors.bgGreen.white(` ${team.teamName} `),
                                colors.bgYellow.white(`(${("0" + team.points).slice(-2)})`),
                                colors.bgGreen.white(` ${team.playedGames} `)
                            ]);
                        } else {
                            cliTable.push([
                                colors.bgWhite.grey(` ${("0" + team.position).slice(-2)} `),
                                colors.bgWhite.black(` ${team.teamName} `),
                                colors.bgWhite.green(`(${("0" + team.points).slice(-2)})`),
                                colors.bgWhite.black(` ${team.playedGames} `)
                            ]);
                        }
                    });
                    console.log(cliTable.toString());
                });
        }).catch((err) => {
        console.log('Something went wrong');
        console.log(err);
    });
}