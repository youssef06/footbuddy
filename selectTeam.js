/**
 * Created by youssef on 1/19/17.
 */
const getCompetitions = require('./api').getCompetitions;
const getTeamsInCompetition = require('./api').getTeamsInCompetition;
const readlineSync = require('readline-sync');

/**
 * Interactively select a team from the API
 * @returns {Promise.<TResult>}
 */
function selectTeam() {
    let competitionId;

    return getCompetitions()
        .then(function (competitions) {
            let captions = competitions.map((competition) => {
                return competition.caption;
            });
            let ids = competitions.map((competition) => {
                return competition.id;
            });
            let compIndex = readlineSync.keyInSelect(captions, "");
            console.log(`You selected ${captions[compIndex]} : ${ids[compIndex]}`);
            competitionId = ids[compIndex];

            return getTeamsInCompetition(ids[compIndex]);
        })
        .then((teams) => {
            let captions = teams.map((team) => {
                return team.name;
            });

            let ids = teams.map((team) => {
                //get id from url
                var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
                let matches = team._links.self.href.match(re);

                return matches[1];
            });

            let teamIndex = readlineSync.keyInSelect(captions, "");
            console.log(`You selected ${captions[teamIndex]} : ${ids[teamIndex]}`);

            return {teamId: ids[teamIndex], name: captions[teamIndex], competitionId: competitionId};
        });
}

module.exports = selectTeam;