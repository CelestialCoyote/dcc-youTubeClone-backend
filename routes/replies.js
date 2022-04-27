const express = require("express");
const { Reply, validateReply } = require("../models/reply");


const router = express.Router();

// Endpoints

// GET all replies.
// http://localhost:3007/api/replies
router.get('/', async (req, res) => {
    try {
        let replies = await Reply.find();
        if (!replies)
            return res
                .status(400)
                .send('No replies in this collection.');

        return res.status(200).send(replies);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a comment by id.
// http://localhost:3007/api/comments/:commentsId
router.get('/:commentId', async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.commentId);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentId} does not exist.`);

        return res.status(200).send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST a new comment.
// http://localhost:3007/api/comments
router.post('/', async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).send(`Body for comment not valid! ${error}`);

        let newComment = await new Comment(req.body);
        await newComment.save();

        return res
            .status(201)
            .send(newComment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// PUT an existing comment.
// http://localhost:3007/api/comments/:commentsId
router.put('/:commentId', async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error) return res.status(400).send(error);

        let comment = await Comment.findByIdAndUpdate(req.params.commentId, req.body, { new: true });
        if (!comment)
            return res
                .status(400)
                .send(`comment with ObjectId ${req.params.commentId} does not exist.`);

        return res.status(200).send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// DELETE an existing comment.
// http://localhost:3007/api/comments/:commentsId
router.delete('/:commentId', async (req, res) => {
    try {
        let comment = await Comment.findByIdAndDelete(req.params.commentId);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentId} does not exist.`);

        return res.status(200).send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});

module.exports = router;
