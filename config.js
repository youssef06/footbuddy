/**
 * Created by youssef on 1/18/17.
 */
const readlineSync = require('readline-sync');
const path = require('path');
const fs = require('fs');
const selectTeam = require('./selectTeam');

/**
 *
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
            //we prompt the user to choose a favourite team
            const teams = require('./teams.json');
            let choices = Object.keys(teams);
            choices.push("My team is not on the list");

            console.log("Okay so first tell me what's your favourite team?");
            let index = readlineSync.keyInSelect(choices, "");

            if(index == choices.length - 1) {
                //team is not on the list
                selectTeam()
                    .then(({teamId, name}) => {
                        //save config
                        config.favouriteTeam = {teamId: teamId, name: name};
                        fs.writeFile(configFile, JSON.stringify(config, null, 2), function (err) {
                            if(err) reject(err);

                            resolve(config);
                        });
                    });
            } else {
                //save config
                config.favouriteTeam = {teamId: teams[choices[index]], name: choices[index]};
                console.log(`You selected : ${choices[index]}`);
                fs.writeFile(configFile, JSON.stringify(config, null, 2), function (err) {
                    if(err) reject(err);

                    resolve(config);
                });
            }
        } else {
            resolve(config);
        }
    });
}

module.exports = getConfig;