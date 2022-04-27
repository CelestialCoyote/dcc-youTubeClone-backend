const mongoose = require('mongoose');
const Joi = require('joi');
const { prodcutSchema } = require('./product');


const userSchema = new mongoose.Schema({
    name: {type: String, required: true, minlength: 5, maxlength: 50},
    isGoldMember: {type: Boolean, default: false},
    shoppingCart: {type: [prodcutSchema], default: []}
});

function validateUser(user) {
    const schema = Joi.object({
        name: Joi.string().required()
    });

    return schema.validate(user);
};

const User = mongoose.model('User', userSchema);


module.exports = {
    userSchema,
    User,
    validateUser
};
