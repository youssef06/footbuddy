/**
 * Created by youssef on 1/19/17.
 */
const Api = require('./api');
const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');

/**
 * Interactively select a team from the API
 */
async function selectTeamFromAPI() {
    let competitionId;

    let competitions = await Api.getCompetitions();
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

    let teams = await Api.getTeamsInCompetition(ids[compIndex]);

    captions = teams.map((team) => {
        return team.name;
    });

    ids = teams.map((team) => {
        //get id from url
        var re = /http:\/\/api.football-data.org\/v1\/teams\/(\d+)/;
        let matches = team._links.self.href.match(re);

        return matches[1];
    });

    let teamIndex = readlineSync.keyInSelect(captions, "");
    console.log(`You selected ${captions[teamIndex]} : ${ids[teamIndex]}`);

    return {teamId: parseInt(ids[teamIndex]), name: captions[teamIndex], competitionId: competitionId};
}

/**
 *
 * @returns {*}
 */
async function selectTeam() {
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
            return {
                    teamId: parseInt(teams[index].teamId),
                    name: teams[index].name,
                    competitionId: teams[index].competitionId
            };
        }
    }

    let {teamId, name, competitionId} = await selectTeamFromAPI();
    //add team to .teams.json
    let team = {teamId: teamId, name: name, competitionId: competitionId};
    teams.push(team);
    try {
        fs.writeFileSync(teamsFile, JSON.stringify(teams, null, 2), 'utf8')
    } catch(e) {
        throw 'could not write to .teams.json' + e;
    };

    return team;
}

module.exports = selectTeam;