/**
 * Created by youssef on 1/18/17.
 */
'use strict';

/**
 * Interactive list of previous/upcoming games
 * @param type
 * @param argv
 */
var nextOrLastGames = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(type, argv) {
        var _this = this;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.prev = 0;
                        return _context2.delegateYield(regeneratorRuntime.mark(function _callee() {
                            var team, _team, teamId, fixtures, head, cliTable;

                            return regeneratorRuntime.wrap(function _callee$(_context) {
                                while (1) {
                                    switch (_context.prev = _context.next) {
                                        case 0:
                                            team = void 0;

                                            if (!argv.custom) {
                                                _context.next = 7;
                                                break;
                                            }

                                            _context.next = 4;
                                            return selectTeam();

                                        case 4:
                                            team = _context.sent;
                                            _context.next = 10;
                                            break;

                                        case 7:
                                            _context.next = 9;
                                            return getConfig().then(function (_ref2) {
                                                var favouriteTeam = _ref2.favouriteTeam;

                                                return favouriteTeam;
                                            });

                                        case 9:
                                            team = _context.sent;

                                        case 10:
                                            _team = team, teamId = _team.teamId;
                                            _context.next = 13;
                                            return Api.getTeamPreviousOrNextGames({ teamId: teamId, type: type, n: argv.n });

                                        case 13:
                                            fixtures = _context.sent;


                                            //table header
                                            head = [colors.bgWhite.black.bold(' Competition '), colors.bgWhite.black.bold(' Home '), colors.bgWhite.black.bold(' Away '), colors.bgWhite.black.bold(' Date ')];

                                            if (type === TYPES.last) {
                                                head.push(colors.bgBlack.white(' Result '));
                                            }
                                            cliTable = new Table({
                                                head: head,
                                                style: {
                                                    border: ['cyan', 'bgWhite'],
                                                    'padding-left': 1,
                                                    'padding-right': 1,
                                                    empty: ['bgWhite']
                                                }
                                            });

                                            fixtures.forEach(function (fixture) {
                                                var homeTeamId = getTeamIdFromURL(fixture._links.homeTeam.href);
                                                var awayTeamId = getTeamIdFromURL(fixture._links.awayTeam.href);
                                                var row = [colors.bgWhite.black(fixture.competition.caption), homeTeamId == teamId ? colors.bgCyan.black(' ' + fixture.homeTeamName + ' ') : colors.bgWhite.black(fixture.homeTeamName), awayTeamId == teamId ? colors.bgCyan.black(' ' + fixture.awayTeamName + ' ') : colors.bgWhite.black(fixture.awayTeamName), colors.bgWhite.black(fixture.date)];
                                                if (type === TYPES.last) {
                                                    row.push(colors.bgGreen.white.underline(' ' + fixture.result.goalsHomeTeam + '-' + fixture.result.goalsAwayTeam + ' '));
                                                }
                                                cliTable.push(row);
                                            });

                                            console.log(cliTable.toString());

                                        case 19:
                                        case 'end':
                                            return _context.stop();
                                    }
                                }
                            }, _callee, _this);
                        })(), 't0', 2);

                    case 2:
                        _context2.next = 8;
                        break;

                    case 4:
                        _context2.prev = 4;
                        _context2.t1 = _context2['catch'](0);

                        console.log('Something went wrong');
                        console.log(_context2.t1);

                    case 8:
                        ;

                    case 9:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[0, 4]]);
    }));

    return function nextOrLastGames(_x, _x2) {
        return _ref.apply(this, arguments);
    };
}();

/**
 * Interactive League table
 */


var leagueTable = function () {
    var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(argv) {
        var _this2 = this;

        return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
                switch (_context4.prev = _context4.next) {
                    case 0:
                        _context4.prev = 0;
                        return _context4.delegateYield(regeneratorRuntime.mark(function _callee3() {
                            var team, _team2, teamId, name, competitionId, table, cliTable;

                            return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                while (1) {
                                    switch (_context3.prev = _context3.next) {
                                        case 0:
                                            team = void 0;

                                            if (!argv.custom) {
                                                _context3.next = 7;
                                                break;
                                            }

                                            _context3.next = 4;
                                            return selectTeam();

                                        case 4:
                                            team = _context3.sent;
                                            _context3.next = 10;
                                            break;

                                        case 7:
                                            _context3.next = 9;
                                            return getConfig().then(function (_ref4) {
                                                var favouriteTeam = _ref4.favouriteTeam;

                                                return favouriteTeam;
                                            });

                                        case 9:
                                            team = _context3.sent;

                                        case 10:
                                            _team2 = team, teamId = _team2.teamId, name = _team2.name, competitionId = _team2.competitionId;
                                            _context3.next = 13;
                                            return Api.getLeagueTable(competitionId);

                                        case 13:
                                            table = _context3.sent;

                                            console.log(colors.bgYellow.white('' + table.leagueCaption));

                                            cliTable = new Table({
                                                head: [colors.bgWhite.black.bold(' Pos '), colors.bgWhite.black.bold(' Team '), colors.bgWhite.black.bold(' Pts '), colors.bgWhite.black.bold(' Played ')],
                                                style: {
                                                    border: ['cyan', 'bgWhite'],
                                                    'padding-left': 0,
                                                    'padding-right': 0,
                                                    empty: ['bgWhite']
                                                }
                                            });


                                            table.standing.forEach(function (team) {

                                                /*var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
                                                let matches = team._links.team.href.match(re);*/
                                                var currentId = getTeamIdFromURL(team._links.team.href);

                                                if (currentId === teamId) {
                                                    //highlight user selected team
                                                    cliTable.push([colors.bgGreen.white(' ' + ("0" + team.position).slice(-2) + ' '), colors.bgGreen.white(' ' + team.teamName + ' '), colors.bgYellow.white('(' + ("0" + team.points).slice(-2) + ')'), colors.bgGreen.white(' ' + team.playedGames + ' ')]);
                                                } else {
                                                    cliTable.push([colors.bgWhite.grey(' ' + ("0" + team.position).slice(-2) + ' '), colors.bgWhite.black(' ' + team.teamName + ' '), colors.bgWhite.green('(' + ("0" + team.points).slice(-2) + ')'), colors.bgWhite.black(' ' + team.playedGames + ' ')]);
                                                }
                                            });
                                            console.log(cliTable.toString());

                                        case 18:
                                        case 'end':
                                            return _context3.stop();
                                    }
                                }
                            }, _callee3, _this2);
                        })(), 't0', 2);

                    case 2:
                        _context4.next = 8;
                        break;

                    case 4:
                        _context4.prev = 4;
                        _context4.t1 = _context4['catch'](0);

                        console.log('Something went wrong');
                        console.log(_context4.t1);

                    case 8:
                        ;

                    case 9:
                    case 'end':
                        return _context4.stop();
                }
            }
        }, _callee4, this, [[0, 4]]);
    }));

    return function leagueTable(_x3) {
        return _ref3.apply(this, arguments);
    };
}();

/**
 * Interactively select competition and show/navigate its fixtures
 */


var showCompetition = function () {
    var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6() {
        var _this3 = this;

        var navigationOptions;
        return regeneratorRuntime.wrap(function _callee6$(_context7) {
            while (1) {
                switch (_context7.prev = _context7.next) {
                    case 0:
                        //options for navigating through fixtures
                        navigationOptions = { previous: 'Previous', next: 'Next' };
                        _context7.prev = 1;
                        return _context7.delegateYield(regeneratorRuntime.mark(function _callee5() {
                            var competitions, captions, ids, compIndex, competitionId, matchDay, actionIndex, _loop;

                            return regeneratorRuntime.wrap(function _callee5$(_context6) {
                                while (1) {
                                    switch (_context6.prev = _context6.next) {
                                        case 0:
                                            _context6.next = 2;
                                            return Api.getCompetitions();

                                        case 2:
                                            competitions = _context6.sent;
                                            captions = competitions.map(function (competition) {
                                                return competition.caption;
                                            });
                                            ids = competitions.map(function (competition) {
                                                return competition.id;
                                            });
                                            //prompt the user to select a competition

                                            compIndex = readlineSync.keyInSelect(captions, "");


                                            if (compIndex === -1) {
                                                //if user chooses "cancel"
                                                console.log('Bye!');
                                                process.exit();
                                            }

                                            console.log('You selected ' + captions[compIndex] + ' : ' + ids[compIndex]);
                                            competitionId = ids[compIndex];
                                            matchDay = competitions[compIndex].currentMatchday;

                                            //we show currentMatchday fixtures and prompt the user to navigate
                                            //to previous or upcoming fixtures

                                            actionIndex = void 0;
                                            _loop = regeneratorRuntime.mark(function _loop() {
                                                var fixtures, head, cliTable, choices;
                                                return regeneratorRuntime.wrap(function _loop$(_context5) {
                                                    while (1) {
                                                        switch (_context5.prev = _context5.next) {
                                                            case 0:
                                                                console.log(colors.bgYellow.white(' Day : ' + matchDay + ' '));
                                                                _context5.next = 3;
                                                                return Api.getCompetitionFixtures(competitionId, matchDay);

                                                            case 3:
                                                                fixtures = _context5.sent;
                                                                head = [colors.bgWhite.black.bold(' Home '), colors.bgWhite.black.bold(' Away '), colors.bgWhite.black.bold(' Date ')];

                                                                if (matchDay <= competitions[compIndex].currentMatchday) {
                                                                    //if match day <= currentMatchday then the game has a result
                                                                    head.push(colors.bgBlack.white(' Result '));
                                                                }

                                                                cliTable = new Table({
                                                                    head: head,
                                                                    style: {
                                                                        border: ['cyan', 'bgWhite'],
                                                                        'padding-left': 1,
                                                                        'padding-right': 1,
                                                                        empty: ['bgWhite']
                                                                    }
                                                                });


                                                                fixtures.forEach(function (fixture) {
                                                                    var row = [colors.bgWhite.black(fixture.homeTeamName), colors.bgWhite.black(fixture.awayTeamName), colors.bgWhite.black(fixture.date)];
                                                                    if (fixture.status === Api.fixtureStatus.FINISHED || fixture.status === Api.fixtureStatus.IN_PLAY) {
                                                                        //if fixture finished or in_play it has a result
                                                                        row.push(colors.bgGreen.white.underline(' ' + fixture.result.goalsHomeTeam + '-' + fixture.result.goalsAwayTeam + ' '));
                                                                    } else if (matchDay <= competitions[compIndex].currentMatchday) {
                                                                        //fixture doesn't have a result even though matchDay has passed or is the current one
                                                                        //(cases of a game that will be played in a few hours..., or a postponed game)
                                                                        row.push('');
                                                                    }
                                                                    cliTable.push(row);
                                                                });

                                                                console.log(cliTable.toString());

                                                                //prompt the user to view previous/next matchDay fixtures
                                                                choices = void 0;
                                                                //check edge cases

                                                                if (competitions[compIndex].numberOfMatchdays == matchDay) {
                                                                    //last matchDay of the season
                                                                    choices = [navigationOptions.previous];
                                                                } else if (matchDay === 1) {
                                                                    //1st matchDay of the season
                                                                    choices = [navigationOptions.next];
                                                                } else {
                                                                    choices = [navigationOptions.previous, navigationOptions.next];
                                                                }
                                                                actionIndex = readlineSync.keyInSelect(choices, "");
                                                                _context5.t0 = choices[actionIndex];
                                                                _context5.next = _context5.t0 === navigationOptions.previous ? 15 : _context5.t0 === navigationOptions.next ? 17 : 19;
                                                                break;

                                                            case 15:
                                                                matchDay--;
                                                                return _context5.abrupt('break', 19);

                                                            case 17:
                                                                matchDay++;
                                                                return _context5.abrupt('break', 19);

                                                            case 19:
                                                            case 'end':
                                                                return _context5.stop();
                                                        }
                                                    }
                                                }, _loop, _this3);
                                            });

                                        case 12:
                                            return _context6.delegateYield(_loop(), 't0', 13);

                                        case 13:
                                            if (actionIndex !== -1) {
                                                _context6.next = 12;
                                                break;
                                            }

                                        case 14:
                                        case 'end':
                                            return _context6.stop();
                                    }
                                }
                            }, _callee5, _this3);
                        })(), 't0', 3);

                    case 3:
                        _context7.next = 8;
                        break;

                    case 5:
                        _context7.prev = 5;
                        _context7.t1 = _context7['catch'](1);

                        console.log(_context7.t1);

                    case 8:
                        ;

                    case 9:
                    case 'end':
                        return _context7.stop();
                }
            }
        }, _callee6, this, [[1, 5]]);
    }));

    return function showCompetition() {
        return _ref5.apply(this, arguments);
    };
}();

/**
 * Get teamId from TeamURL
 * @param url
 * @returns {Number}
 */


function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var TYPES = {
    next: 'next',
    last: 'previous'
};
var readlineSync = require('readline-sync');
var Table = require('cli-table2');
var colors = require('colors');
var getConfig = require('./config');
var Api = require('./api');
var selectTeam = require('./selectTeam');
var argv = require('yargs').usage('Usage: $0 <command> [options]').command('next [n]', 'Check upcoming n games', function (yargs) {/*yargs.default('games', 1)*/}, function (argv) {
    nextOrLastGames(TYPES.next, argv);
}).example('$0 next 5', 'View next 5 games of your favourite team').command('last [n]', 'Check last n games', function (yargs) {/*yargs.default('games', 1)*/}, function (argv) {
    nextOrLastGames(TYPES.last, argv);
}).example('$0 last 5', 'View last 5 games of your favourite team').command('table', 'View league table', {}, leagueTable).example('$0 table', 'View league table of your favourite team').command('competition', 'View competition', {}, function () {
    showCompetition();
}).option('custom', {
    alias: 'c',
    describe: 'Choose a custom team instead of your favourite team.'
}).example('$0 next 5 --custom', 'Choose a different team then view their next 5 games').example('$0 table --custom', 'Choose a different team then view their position in their league table').help('h').epilog('Made by Youssef 2017.').argv;function getTeamIdFromURL(url) {
    //get id from url
    var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
    var matches = url.match(re);

    return parseInt(matches[1]);
}