const { Helpers } = require('../helpers/Helpers')
const { logger } = require('../utils/logger')
const { genericError, genericMessage } = require('../utils/Message')

const User = require('../model/User')
const bcrypt = require("bcrypt");

class UserController {

    user (body) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const user = new User(body);

                const { error } = user.validate();
                if (error) return reject( genericMessage(400, false,error.details[0].message ) )


                const salt = await bcrypt.genSalt(Number(process.env.SALT));
                user.password = await bcrypt.hash(user.password, salt);
                // await user.save();

                // res.send(user);

                resolve(user || [])
            } catch (err) {
                 logger.error(genericError('user', err))
                 reject(err)
            }
        })
    }
}

module.exports = new UserController()