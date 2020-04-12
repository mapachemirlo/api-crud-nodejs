const express = require('express');

const productsController = require('../../controllers/v1/products-controller');

const router = express.Router();

router.post('/create', productsController.createProdut);
router.get('/get-all', productsController.getProduct);
router.get('/get-by-user/:userId', productsController.getProductByUser);
router.get('/get-all-price', productsController.getProductByPrice);


module.exports = router;