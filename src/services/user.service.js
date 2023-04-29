const User = require('../models/user.model');
const bcrypt = require('bcrypt');

class UserCreationService {
    async createUser(user) {
        user = user.dataValues
        user.password = await this.#hashPassword(user.password)
        try {
            const createdUser = await User.create(user);
            return createdUser.toJSON();
        } catch (error) {
            return false
        }
    }

    async #hashPassword(password) {
        return await bcrypt.hash(password, 10)
    }
}

class UserAuthenticationService {
    async checkUser(user) {
        user = user.dataValues
        const {email} = user
        try {
            const result = await User.findOne({where: {email}});
            if (result && await this.#checkPassword(user.password, result.dataValues.password)) {
                return result.toJSON();
            }else{
                return "Email Or Password is Incorrect"
            }
        } catch (error) {
            return error
        }
    }

    async #checkPassword(password, hashPassword) {
        return await bcrypt.compare(password, hashPassword)
    }
}

class UserUpdateService {
    async updateUser(user) {
        const {id} = user;
        await User.update(user, {where: {id}});
        return user;
    }
}

class UserDeletionService {
    async deleteCategory(id) {
        await User.destroy({where: {id}});
    }
}

module.exports = {
    UserCreationService,
    UserAuthenticationService,
    UserUpdateService,
    UserDeletionService
};