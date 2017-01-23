/**
 * Created by youssef on 1/18/17.
 */
'use strict';

const TYPES = {
    next: 'next',
    last: 'previous'
};
const readlineSync = require('readline-sync');
const Table = require('cli-table2');
const colors = require('colors');
const getConfig = require('./config');
const Api = require('./api');
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
    .command('competition', 'View competition', {}, function() {
        showCompetition();
        console.log('After competition');
    })
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
            return Api.getTeamPreviousOrNextGames({teamId: teamId, type: type, n: argv.n})
                .then((fixtures) => {
                    let head = [
                        colors.bgWhite.black.bold(` Competition `),
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
                        let homeTeamId = getTeamIdFromURL(fixture._links.homeTeam.href);
                        let awayTeamId = getTeamIdFromURL(fixture._links.awayTeam.href);
                        let row = [
                            colors.bgWhite.black(fixture.competition.caption),
                            homeTeamId == teamId?colors.bgCyan.black(` ${fixture.homeTeamName} `):
                                colors.bgWhite.black(fixture.homeTeamName),
                            awayTeamId == teamId?colors.bgCyan.black(` ${fixture.awayTeamName} `):
                                colors.bgWhite.black(fixture.awayTeamName),
                            colors.bgWhite.black(fixture.date)
                        ];
                        if(type === TYPES.last) {
                            row.push(colors.bgGreen.white.underline(` ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam} `));
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
            return Api.getLeagueTable(competitionId)
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

/**
 * Interactively select competition and show/navigate its fixtures
 */
async function showCompetition() {
    const navigationOptions = {previous: 'Previous', next: 'Next'};
    try {
        //get competitions from API
        let competitions = await Api.getCompetitions();
        let captions = competitions.map((competition) => {
            return competition.caption;
        });
        let ids = competitions.map((competition) => {
            return competition.id;
        });
        //prompt the user to select a competition
        let compIndex = readlineSync.keyInSelect(captions, "");

        if(compIndex === -1) {
            //if user chooses "cancel"
            console.log('Bye!');
            process.exit();
        }
        console.log(`You selected ${captions[compIndex]} : ${ids[compIndex]}`);
        let competitionId = ids[compIndex];
        let matchDay = competitions[compIndex].currentMatchday;

        //we show currentMatchday fixtures and prompt the user to navigate
        //to previous or upcoming fixtures
        let actionIndex;
        do {
            console.log(colors.bgYellow.white(` Day : ${matchDay} `));
            let fixtures = await Api.getCompetitionFixtures(competitionId, matchDay);

            let head = [
                colors.bgWhite.black.bold(` Home `),
                colors.bgWhite.black.bold(` Away `),
                colors.bgWhite.black.bold(` Date `)
            ];
            if(matchDay <= competitions[compIndex].currentMatchday) {
                //if match day <= currentMatchday then the game has a result
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
                if (fixture.status === Api.fixtureStatus.FINISHED || fixture.status === Api.fixtureStatus.IN_PLAY) {
                    //if fixture finished or in_play it has a result
                    row.push(colors.bgGreen.white.underline(` ${fixture.result.goalsHomeTeam}-${fixture.result.goalsAwayTeam} `));
                } else if(matchDay <= competitions[compIndex].currentMatchday) {
                    //fixture doesn't have a result even though the matchday is passed or current
                    //(case of a game that will be played in a few hours..., or a postponed game)
                    row.push('');
                }
                cliTable.push(row);
            });

            console.log(cliTable.toString());

            //prompt the user to view previous/next matchDay fixtures
            let choices;
            //check edge cases
            if(competitions[compIndex].numberOfMatchdays == matchDay) {
                choices = [navigationOptions.previous];
            } else if(matchDay === 1){
                choices = [navigationOptions.next];
            } else {
                choices = [
                    navigationOptions.previous,
                    navigationOptions.next
                ];
            }
            actionIndex = readlineSync.keyInSelect(choices, "");
            switch (choices[actionIndex]) {
                case navigationOptions.previous:
                    matchDay--;
                    break;
                case navigationOptions.next:
                    matchDay++;
                    break;
            }
        } while (actionIndex !== -1);
    } catch(e) {
        console.log(e);
    };
}

/**
 * Get teamId from TeamURL
 * @param url
 * @returns {Number}
 */
function getTeamIdFromURL(url) {
    //get id from url
    var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
    let matches = url.match(re);

    return parseInt(matches[1]);
}