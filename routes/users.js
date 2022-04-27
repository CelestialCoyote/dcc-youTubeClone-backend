const { User, validateUser } = require('../models/user');
const { Product, validateProduct } = require('../models/product');
const express = require('express');


const router = express.Router();

// ENDPOINTS.

// GET all users.
// http://localhost:3007/api/users
router.get('/', async (req, res) => {
    try {
        let users = await User.find();
        if (!users)
            return res
                .status(400)
                .send('No users in this collection.');

        return res
            .status(200)
            .send(users);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a user by id.
// http://localhost:3007/api/users/:userId
router.get('/:productId', async (req, res) => {
    try {
        let product = await Product.findById(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`Product with ObjectId ${req.params.productId} does not exist.`);

        return res
            .status(200)
            .send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST a new user.
// http://localhost:3007/api/users
router.post('/', async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) return res.status(400).send(`Body for user not valid! ${error}`);

        let newUser = await new User(req.body);
        await newUser.save();

        return res
            .status(201)
            .send(newUser);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST a product to a shopping cart.
// http://localhost:3007/api/users/:userId/shoppingCart/:productId
router.post('/:userId/shoppingCart/:productId', async (req, res) => {
    try {
        let user = await User.findById(req.params.userId);
        if (!user)
            return res
                .status(400)
                .send(`No user with Id ${req.params.userId}!.`);

        let product = await Product.findById(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`Product with Id ${req.params.productId} does not exist!.`);
        
        user.shoppingCart.push(product);
        await user.save();

        return res
            .send(user.shoppingCart);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// PUT an existing product in a shopping cart.
// http://localhost:3007/api/users/:userId/shoppingcart/:productId
router.put('/:userId/shoppingCart/:productId', async (req, res) => {
    try {
        const { error } = validateProduct(req.body);
        if (error)
            return res
                .status(400)
                .send(`Body for product not valid! ${error}`);

        let user = await User.findById(req.params.userId);
        if (!user)
            return res
                .status(400)
                .send(`No user with Id ${req.params.userId}!.`);
        
        const product = user.shoppingCart.id(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`The product does not exist in the shopping cart!`);

        product.name = req.body.name;
        product.description = req.body.description;
        product.category = req.body.category;
        product.price = req.body.price;

        await user.save();
        return res
            .send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// DELETE an existing product in a shopping cart.
// http://localhost:3007/api/users/:userId/shoppingcart/:productId
router.delete('/:userId/shoppingCart/:productId', async (req, res) => {
    try {
        let user = await User.findById(req.params.userId);
        if (!user)
            return res
                .status(400)
                .send(`No user with Id ${req.params.userId}!.`);
        
        let product = user.shoppingCart.id(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`The product does not exist in the shopping cart!`);
        
        product = await product.remove();
        await user.save();
        return res
            .send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


module.exports = router;
