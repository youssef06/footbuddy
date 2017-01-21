/**
 * Created by youssef on 1/18/17.
 */

const request = require('request');
const moment = require('moment');

const TOKEN = 'c395383d75bc451894042f78c2fd318d';
/**
 * Get previous or next fixture data for teamId
 * fixture date is converted to local timezone
 * @param teamId
 * @param type
 * @returns {Promise}
 */
function getTeamPreviousOrNextGames({teamId, type, n}) {
    const URL = `http://api.football-data.org/v1/teams/${teamId}/fixtures`;
    return new Promise((resolve, reject) => {
        request({
            url: URL,
            qs: {timeFrame: type === 'previous'?'p60':'n60'},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                let fixtures =  body.fixtures;
                if(type === 'previous')
                {
                    fixtures = fixtures.reverse();
                }
                fixtures = fixtures.slice(0, n);

                let p = {}; //distinct competitions promises
                fixtures.forEach((fixture) => {
                    //convert date to local
                    fixture.date = moment(new Date(fixture.date)).local().calendar(null, {sameElse: 'DD/MM/YYYY hh:mm A'});
                    //get competitionId from url
                    var re = /http:\/\/api.football-data.org\/v1\/competitions\/(\d+)/;
                    let matches = fixture._links.competition.href.match(re);
                    let competitionId = fixture.competitionId = parseInt(matches[1]);

                    if(!p[competitionId]) {
                        //if new competitionId request it
                        p[competitionId] = getCompetitionById(competitionId);
                    }
                });

                Promise.all(Object.values(p))
                    .then((competitions) => {
                        fixtures.forEach((fixture) => {
                            //get competition for fixture.competitionId from results
                            let comp = competitions.filter((competition) => competition.id === fixture.competitionId);
                            fixture.competition = comp.length ? comp[0] : null;
                        });
                        resolve(fixtures);
                    });
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
    const URL = `http://api.football-data.org/v1/competitions/${competitionId}`;

    return new Promise((resolve, reject) => {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function(error, response, body) {
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
    const URL = `http://api.football-data.org/v1/competitions`;

    return new Promise((resolve, reject) => {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function(error, response, body) {
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
    const URL = `http://api.football-data.org/v1/competitions/${competitionId}/teams`;

    return new Promise((resolve, reject) => {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function(error, response, body) {
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
    const URL = `http://api.football-data.org/v1/competitions/${competitionId}/leagueTable`;

    return new Promise((resolve, reject) => {
        request({
            url: URL,
            qs: {},
            method: 'GET',
            json: {},
            headers: {
                'X-Auth-Token': TOKEN
            }
        }, function(error, response, body) {
            if (error) {
                reject(error);
            } else {
                resolve(body);
            }
        });
    });
}

module.exports = {
    getTeamPreviousOrNextGames,
    getCompetitions,
    getTeamsInCompetition,
    getLeagueTable
};