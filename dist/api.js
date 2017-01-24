'use strict';

/**
 * Created by youssef on 1/18/17.
 */

var request = require('request');
var moment = require('moment');

var TOKEN = 'c395383d75bc451894042f78c2fd318d';
/**
 * Get previous or next fixture data for teamId
 * fixture date is converted to local timezone
 * @param teamId
 * @param type
 * @returns {Promise}
 */
function getTeamPreviousOrNextGames(_ref) {
    var teamId = _ref.teamId,
        type = _ref.type,
        n = _ref.n;

    var URL = 'http://api.football-data.org/v1/teams/' + teamId + '/fixtures';
    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: { timeFrame: type === 'previous' ? 'p60' : 'n60' },
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                (function () {
                    var fixtures = body.fixtures;
                    if (type === 'previous') {
                        fixtures = fixtures.reverse();
                    }
                    fixtures = fixtures.slice(0, n);

                    var p = {}; //distinct competitions promises
                    fixtures.forEach(function (fixture) {
                        //convert date to local
                        fixture.date = moment(new Date(fixture.date)).local().calendar(null, { sameElse: 'DD/MM/YYYY hh:mm A' });
                        //get competitionId from url
                        var re = /http:\/\/api.football-data.org\/v1\/competitions\/(\d+)/;
                        var matches = fixture._links.competition.href.match(re);
                        var competitionId = fixture.competitionId = parseInt(matches[1]);

                        if (!p[competitionId]) {
                            //if new competitionId request it
                            p[competitionId] = getCompetitionById(competitionId);
                        }
                    });

                    Promise.all(Object.values(p)).then(function (competitions) {
                        fixtures.forEach(function (fixture) {
                            //get competition for fixture.competitionId from results
                            var comp = competitions.filter(function (competition) {
                                return competition.id === fixture.competitionId;
                            });
                            fixture.competition = comp.length ? comp[0] : null;
                        });
                        resolve(fixtures);
                    });
                })();
            }
        });
    });
}

/**
 * Get Fxitures for a competition on a specific matchDay
 * @param competitionId
 * @param matchday
 * @returns {Promise}
 */
function getCompetitionFixtures(competitionId, matchday) {
    var URL = 'http://api.football-data.org/v1/competitions/' + competitionId + '/fixtures';

    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: { matchday: matchday },
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body.fixtures);
            }
        });
    });
}

/**
 * Get competition detail by ID
 * @param competitionId
 * @returns {Promise}
 */
function getCompetitionById(competitionId) {
    var URL = 'http://api.football-data.org/v1/competitions/' + competitionId;

    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

/**
 * Get All competitions
 * @returns {Promise}
 */
function getCompetitions() {
    var URL = 'http://api.football-data.org/v1/competitions';

    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

/**
 * Get all teams in competition competitionId
 * @param competitionId
 * @returns {Promise}
 */
function getTeamsInCompetition(competitionId) {
    var URL = 'http://api.football-data.org/v1/competitions/' + competitionId + '/teams';

    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body.teams);
            }
        });
    });
}

/**
 * Get league table for competitionId
 * @param competitionId
 * @returns {Promise}
 */
function getLeagueTable(competitionId) {
    var URL = 'http://api.football-data.org/v1/competitions/' + competitionId + '/leagueTable';

    return new Promise(function (resolve, reject) {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function (error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    getTeamPreviousOrNextGames: getTeamPreviousOrNextGames,
    getCompetitions: getCompetitions,
    getTeamsInCompetition: getTeamsInCompetition,
    getLeagueTable: getLeagueTable,
    getCompetitionFixtures: getCompetitionFixtures,
    fixtureStatus: {
        FINISHED: 'FINISHED',
        TIMED: 'TIMED',
        SCHEDULED: 'SCHEDULED',
        IN_PLAY: 'IN_PLAY',
        POSTPONED: 'POSTPONED'
    }
};