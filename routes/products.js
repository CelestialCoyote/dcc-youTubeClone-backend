const { Product, validateProduct } = require('../models/product');
const express = require('express');


const router = express.Router();

// ENDPOINTS.

// GET all products.
// http://localhost:3007/api/products
router.get('/', async (req, res) => {
    try {
        let products = await Product.find();
        if (!products)
            return res
                .status(400)
                .send('No products in this collection.');

        return res.status(200).send(products);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// GET a product by id.
// http://localhost:3007/api/products/:productId
router.get('/:productId', async (req, res) => {
    try {
        let product = await Product.findById(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`Product with ObjectId ${req.params.productId} does not exist.`);

        return res.status(200).send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// POST a new product.
// http://localhost:3007/api/products
router.post('/', async (req, res) => {
    try {
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).send(`Body for product not valid! ${error}`);

        let newProduct = await new Product(req.body);
        await newProduct.save();

        return res
            .status(201)
            .send(newProduct);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// PUT an existing product.
// http://localhost:3007/api/products/:productId
router.put('/:productId', async (req, res) => {
    try {
        const { error } = validateProduct(req.body);
        if (error) return res.status(400).send(error);

        let product = await Product.findByIdAndUpdate(req.params.productId, req.body, { new: true });
        if (!product)
            return res
                .status(400)
                .send(`Product with ObjectId ${req.params.productId} does not exist.`);

        return res.status(200).send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


// DELETE an existing product.
// http://localhost:3007/api/products/:productId
router.delete('/:productId', async (req, res) => {
    try {
        let product = await Product.findByIdAndDelete(req.params.productId);
        if (!product)
            return res
                .status(400)
                .send(`Product with ObjectId ${req.params.productId} does not exist.`);

        return res.status(200).send(product);
    } catch (error) {
        return res
            .status(500)
            .send(`Internal Server Error: ${error}`);
    }
});


module.exports = router;
