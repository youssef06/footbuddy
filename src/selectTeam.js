/**
 * Created by youssef on 1/19/17.
 */
const getCompetitions = require('./api').getCompetitions;
const getTeamsInCompetition = require('./api').getTeamsInCompetition;
const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');

/**
 * Interactively select a team from the API
 * @returns {Promise.<TResult>}
 */
function selectTeamFromAPI() {
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

            if(compIndex === -1) {
                console.log('Bye!');
                process.exit();
            }

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

/**
 *
 * @returns {*}
 */
function selectTeam() {
    //check teams the user checked before
    const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    const teamsFile = path.join(HOME, '.teams.json');
    let teams;
    try {
        teams = require(teamsFile);
    } catch(e) {}
    teams = teams || [];
    if(teams.length) {
        //1st: we prompt the user to choose from teams he checked before
        let choices = teams.map((team) => team.name);
        choices.push("My team is not on the list");

        console.log("Okay so first tell me what's your favourite team?");
        let index = readlineSync.keyInSelect(choices, "");

        if(index === -1) {
            console.log('Bye!');
            process.exit();
        }
        if(index !== choices.length - 1) {
            //user selected a team and not the option "My team is not on the list"
            return new Promise((res, rej) => {
                res({
                    teamId: teams[index].teamId,
                    name: teams[index].name,
                    competitionId: teams[index].competitionId
                });
            });
        }
    }

    return selectTeamFromAPI()
        .then(({teamId, name, competitionId}) => {
            //add team to .teams.json
            let team = {teamId: teamId, name: name, competitionId: competitionId};
            teams.push(team);
            try {
                fs.writeFileSync(teamsFile, JSON.stringify(teams, null, 2), 'utf8')
            } catch(e) {
                console.log('could not write to .teams.json', e);
            };

            return team;
        });
}

module.exports = selectTeam;