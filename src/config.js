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
function getConfig() {
    return new Promise((resolve, reject) => {
        const HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
        const configFile = path.join(HOME, '.footbuddy.json');
        let config;

        try {
            //try to get config from file
            config = require(configFile);
        } catch (e) {
        }

        config = config || {};

        if(!config.favouriteTeam) {
            //config file is either missing or is corrupted
            selectTeam()
                .then(({teamId, name, competitionId}) => {
                    config.favouriteTeam = {teamId, name, competitionId};
                    //save config
                    try {
                        fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');
                        resolve(config);
                    } catch(e) {
                        reject(e);
                    };
                })
        } else {
            resolve(config);
        }
    });
}

module.exports = getConfig;