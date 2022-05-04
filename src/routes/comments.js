const express = require("express");
const { Comment, validateComment } = require("../models/comment");
const { Reply, validateReply } = require("../models/reply");


const router = express.Router();

// Endpoints

// GET all comments.
// http://localhost:3007/api/comments
router.get('/', async (req, res) => {
    try {
        let comments = await Comment.find();
        if (!comments)
            return res
                .status(400)
                .send('No comments in this collection.');

        return res
            .status(200)
            .send(comments);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a comment by ID.
// http://localhost:3007/api/comments/:commentID
router.get('/:commentID', async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.commentID);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentID} does not exist.`);

        return res
            .status(200)
            .send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET all comments by video ID.
// http://localhost:3007/api/comments/videoID/:videoID
router.get('/videoID/:videoID', async (req, res) => {
    try {
        let comment = await Comment.find( { videoID: req.params.videoID } );
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.videoID} does not exist.`);

        return res
            .status(200)
            .send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST a new comment.
// http://localhost:3007/api/comments/videoID/:videoID/
router.post('/videoID/:videoID', async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error)
            return res
                .status(400)
                .send(`Body for comment not valid! ${error}`);

        let newComment = await new Comment(req.body);
        await newComment.save();

        let comments = await Comment.find( { videoID: req.params.videoID } );

        return res
            .status(201)
            .send(comments);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// PUT update comment, likes, dislikes of an existing comment.
// http://localhost:3007/api/comments/:commentsId
router.put('/:commentID', async (req, res) => {
    try {
        const { error } = validateComment(req.body);
        if (error)
            return res
                .status(400)
                .send(`Body for comment not valid! ${error}`);

        let comment = await Comment.findByIdAndUpdate(req.params.commentID, req.body, { new: true });
        if (!comment)
            return res
                .status(400)
                .send(`comment with ObjectId ${req.params.commentID} does not exist.`);

        return res
            .status(200)
            .send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// DELETE an existing comment.
// http://localhost:3007/api/comments/:commentsId
router.delete('/:commentID', async (req, res) => {
    try {
        let comment = await Comment.findByIdAndDelete(req.params.commentID);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentID} does not exist.`);

        return res
            .status(200)
            .send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST reply to existing comment.
// http://localhost:3007/api/comments/:commentsId/replies
router.post('/:commentID/replies', async (req, res) => {
    try {
        const { error } = validateReply(req.body);
        if (error)
            return res
                .status(400)
                .send(`Body for reply not valid! ${error}`);

        let comment = await Comment.findById(req.params.commentID);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentID} does not exist.`);

        const reply = await new Reply(req.body);
        comment.replies.push(reply);
        await comment.save();

        return res
            .status(200)
            .send(comment);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET all replies to existing comment.
// http://localhost:3007/api/comments/:commentsId/replies
router.get('/:commentID/replies', async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.commentID);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentID} does not exist.`);

        const reply = comment.replies;

        return res
            .status(200)
            .send(reply);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a replies to existing comment by reply ID.
// http://localhost:3007/api/comments/:commentsId/replies/:replyID
router.get('/:commentID/replies/:replyID', async (req, res) => {
    try {
        let comment = await Comment.findById(req.params.commentID);
        if (!comment)
            return res
                .status(400)
                .send(`Comment with ObjectId ${req.params.commentID} does not exist.`);

        let reply = comment.replies.id(req.params.replyID);

        return res
            .status(200)
            .send(reply);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


module.exports = router;
