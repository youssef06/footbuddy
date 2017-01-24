/**
 * Created by youssef on 1/18/17.
 */
const path = require('path');
const fs = require('fs');
const selectTeam = require('./selectTeam');

/**
 * Get favourite team from config file, if file missing we promp the user to select
 * a team
 * @returns {Promise}
 */
async function getConfig() {
    const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
    const configFile = path.join(HOME, '.footbuddy.json');
    let config;

    try {
        //try to get config from file
        config = require(configFile);
    } catch (e) {
    }

    config = config || {};

    if(config.favouriteTeam) {
        config.favouriteTeam.teamId = parseInt(config.favouriteTeam.teamId);

        return config;
    }
    //config file is either missing or is corrupted
    let {teamId, name, competitionId} = await selectTeam();
    config.favouriteTeam = {teamId, name, competitionId};
    //save config
    try {
        fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');

        return config;
    } catch(e) {
        throw e;
    };
}

module.exports = getConfig;