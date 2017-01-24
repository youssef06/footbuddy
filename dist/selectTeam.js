'use strict';

/**
 * Interactively select a team from the API
 */
var selectTeamFromAPI = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var competitionId, competitions, captions, ids, compIndex, teams, teamIndex;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        competitionId = void 0;
                        _context.next = 3;
                        return Api.getCompetitions();

                    case 3:
                        competitions = _context.sent;
                        captions = competitions.map(function (competition) {
                            return competition.caption;
                        });
                        ids = competitions.map(function (competition) {
                            return competition.id;
                        });
                        compIndex = readlineSync.keyInSelect(captions, "");


                        if (compIndex === -1) {
                            console.log('Bye!');
                            process.exit();
                        }

                        console.log('You selected ' + captions[compIndex] + ' : ' + ids[compIndex]);
                        competitionId = ids[compIndex];

                        _context.next = 12;
                        return Api.getTeamsInCompetition(ids[compIndex]);

                    case 12:
                        teams = _context.sent;


                        captions = teams.map(function (team) {
                            return team.name;
                        });

                        ids = teams.map(function (team) {
                            //get id from url
                            var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
                            var matches = team._links.self.href.match(re);

                            return matches[1];
                        });

                        teamIndex = readlineSync.keyInSelect(captions, "");

                        console.log('You selected ' + captions[teamIndex] + ' : ' + ids[teamIndex]);

                        return _context.abrupt('return', { teamId: parseInt(ids[teamIndex]), name: captions[teamIndex], competitionId: competitionId });

                    case 18:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));

    return function selectTeamFromAPI() {
        return _ref.apply(this, arguments);
    };
}();

/**
 *
 * @returns {*}
 */


var selectTeam = function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2() {
        var HOME, teamsFile, teams, choices, index, _ref3, teamId, name, competitionId, team;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        //check teams the user checked before
                        HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                        teamsFile = path.join(HOME, '.teams.json');
                        teams = void 0;

                        try {
                            teams = require(teamsFile);
                        } catch (e) {}
                        teams = teams || [];

                        if (!teams.length) {
                            _context2.next = 13;
                            break;
                        }

                        //1st: we prompt the user to choose from teams he checked before
                        choices = teams.map(function (team) {
                            return team.name;
                        });

                        choices.push("My team is not on the list");

                        console.log("Okay so first tell me what's your favourite team?");
                        index = readlineSync.keyInSelect(choices, "");


                        if (index === -1) {
                            console.log('Bye!');
                            process.exit();
                        }

                        if (!(index !== choices.length - 1)) {
                            _context2.next = 13;
                            break;
                        }

                        return _context2.abrupt('return', {
                            teamId: parseInt(teams[index].teamId),
                            name: teams[index].name,
                            competitionId: teams[index].competitionId
                        });

                    case 13:
                        _context2.next = 15;
                        return selectTeamFromAPI();

                    case 15:
                        _ref3 = _context2.sent;
                        teamId = _ref3.teamId;
                        name = _ref3.name;
                        competitionId = _ref3.competitionId;

                        //add team to .teams.json
                        team = { teamId: teamId, name: name, competitionId: competitionId };

                        teams.push(team);
                        _context2.prev = 21;

                        fs.writeFileSync(teamsFile, JSON.stringify(teams, null, 2), 'utf8');
                        _context2.next = 28;
                        break;

                    case 25:
                        _context2.prev = 25;
                        _context2.t0 = _context2['catch'](21);
                        throw 'could not write to .teams.json' + _context2.t0;

                    case 28:
                        ;

                        return _context2.abrupt('return', team);

                    case 30:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this, [[21, 25]]);
    }));

    return function selectTeam() {
        return _ref2.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by youssef on 1/19/17.
 */
var Api = require('./api');
var readlineSync = require('readline-sync');
var path = require('path');
var fs = require('fs');

module.exports = selectTeam;