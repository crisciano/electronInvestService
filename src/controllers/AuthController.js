const { Helpers } = require('../helpers/Helpers')
const { logger } = require('../utils/logger')
const { genericError, genericMessage } = require('../utils/Message')
const User = require('../model/User')
const users = require('../utils/users')
const bcrypt = require("bcrypt");

class AuthController {

    auth (body) {
        // eslint-disable-next-line no-async-promise-executor
        return new Promise(async (resolve, reject) => {
            try {
                const { email, password } = body
                const userModel = new User(body)

                const { error } = userModel.validate();
                
                if (error) return reject( genericMessage( 400, false, error.details[0].message ))
                
                const user = users.filter(user=> user.email === email )[0]

                if (!user) return reject(genericMessage( 400, false , "Invalid email or password" ))
                
                const validPassword = await bcrypt.compare(
                                                password,
                                                user.password
                                            );
                if (!validPassword)
                    return  reject(genericMessage( 400, false,"Invalid email or password" ))

                const token = userModel.generateAuthToken(user);
                resolve(token || [])
            } catch (err) {
                 logger.error(genericError('auth', err))
                 reject(err)
            }
        })
    }
}

module.exports = new AuthController()