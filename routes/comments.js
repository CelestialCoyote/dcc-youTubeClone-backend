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
                .send('No commentss in this collection.');

        return res.status(200).send(comments);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a product by id.
// http://localhost:3007/api/products/:productId
//router.get('/:productId', async (req, res) => {
//    try {
//        let product = await Product.findById(req.params.productId);
//        if (!product)
//            return res
//                .status(400)
//                .send(`Product with ObjectId ${req.params.productId} does not exist.`);
//
//        return res.status(200).send(product);
//    } catch (error) {
//        return res
//            .status(500)
//            .send(`Internal Server Error: ${error}`);
//    }
//});


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


//// PUT an existing product.
//// http://localhost:3007/api/products/:productId
//router.put('/:productId', async (req, res) => {
//    try {
//        const { error } = validateProduct(req.body);
//        if (error) return res.status(400).send(error);
//
//        let product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
//        if (!product)
//            return res
//                .status(400)
//                .send(`Product with ObjectId ${req.params.productId} does not exist.`);
//
//        return res.status(200).send(product);
//    } catch (error) {
//        return res
//            .status(500)
//            .send(`Internal Server Error: ${error}`);
//    }
//});
//
//
//// DELETE an existing product.
//// http://localhost:3007/api/products/:productId
//router.delete('/:productId', async (req, res) => {
//    try {
//        let product = await Product.findByIdAndDelete(req.params.productId);
//        if (!product)
//            return res
//                .status(400)
//                .send(`Product with ObjectId ${req.params.productId} does not exist.`);
//
//        return res.status(200).send(product);
//    } catch (error) {
//        return res
//            .status(500)
//            .send(`Internal Server Error: ${error}`);
//    }
//});

module.exports = router;
