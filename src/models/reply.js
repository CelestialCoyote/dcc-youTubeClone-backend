const mongoose = require("mongoose");
const Joi = require("joi");


const replySchema = new mongoose.Schema({
    text: { type: String, required: true, minlength: 2, maxlength: 50 },
    date: { type: Date, default: Date.now() }, // Optional Relative Date (countdown from today)
});

const Reply = mongoose.model("Reply", replySchema);

const validateReply = (reply) => {
    const schema = Joi.object({
        text: Joi.string().min(2).max(50).required(),
    });

    return schema.validate(reply);
}


exports.replySchema = replySchema;
exports.Reply = Reply;
exports.validateReply = validateReply;
