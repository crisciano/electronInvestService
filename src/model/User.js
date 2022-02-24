const jwt = require("jsonwebtoken");
const Joi = require("joi");


class User {
    constructor({email, password}) {
        this.email = email
        this.password = password
    }

    validate = () => {
        const schema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        });
        return schema.validate({
            email: this.email,
            password: this.password
        });
    };
    
    generateAuthToken = (user) => {
        // { access_token: token, token_type: "bearer", expires_in: 7200  }
        return  {
            expires_in: Math.floor(Date.now() / 1000) + (60 * 60),
            access_token:  jwt.sign(user, process.env.JWTPRIVATEKEY)
        }
    }
}

module.exports = User;