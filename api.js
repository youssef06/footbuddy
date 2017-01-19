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
function getTeamPreviousOrNextGame({teamId, type}) {
    const URL = `http://api.football-data.org/v1/teams/${teamId}/fixtures`;
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
                let fixtures =  body.fixtures.filter((fixture) => {
                    let r;
                    if(type === "previous") {
                        r = Date.parse(fixture.date) <= Date.now()
                    } else {
                        r = Date.parse(fixture.date) >= Date.now()
                    }
                    return r;
                });
                let fixture;
                if(type === "previous") {
                    fixture = fixtures[fixtures.length - 1];
                } else {
                    fixture = fixtures[0];
                }
                //convert date to local
                fixture.date = moment(new Date(fixture.date)).local();
                resolve(fixture);
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

module.exports = {
    getTeamPreviousOrNextGame,
    getCompetitions,
    getTeamsInCompetition
};