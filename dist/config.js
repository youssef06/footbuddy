'use strict';

/**
 * Get favourite team from config file, if file missing we promp the user to select
 * a team
 * @returns {Promise}
 */
var getConfig = function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee() {
        var HOME, configFile, config, _ref2, teamId, name, competitionId;

        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        HOME = process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
                        configFile = path.join(HOME, '.footbuddy.json');
                        config = void 0;


                        try {
                            //try to get config from file
                            config = require(configFile);
                        } catch (e) {}

                        config = config || {};

                        if (!config.favouriteTeam) {
                            _context.next = 8;
                            break;
                        }

                        config.favouriteTeam.teamId = parseInt(config.favouriteTeam.teamId);

                        return _context.abrupt('return', config);

                    case 8:
                        _context.next = 10;
                        return selectTeam();

                    case 10:
                        _ref2 = _context.sent;
                        teamId = _ref2.teamId;
                        name = _ref2.name;
                        competitionId = _ref2.competitionId;

                        config.favouriteTeam = { teamId: teamId, name: name, competitionId: competitionId };
                        //save config
                        _context.prev = 15;

                        fs.writeFileSync(configFile, JSON.stringify(config, null, 2), 'utf8');

                        return _context.abrupt('return', config);

                    case 20:
                        _context.prev = 20;
                        _context.t0 = _context['catch'](15);
                        throw _context.t0;

                    case 23:
                        ;

                    case 24:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this, [[15, 20]]);
    }));

    return function getConfig() {
        return _ref.apply(this, arguments);
    };
}();

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

/**
 * Created by youssef on 1/18/17.
 */
var path = require('path');
var fs = require('fs');
var selectTeam = require('./selectTeam');

module.exports = getConfig;