const Products = require('../../mongo/models/products');

const createProdut = async (req, res) => {
    try {
        const { title, desc, price, images, userId } = req.body;
        const product = await Products.create({
            title,
            desc,
            price,
            images,
            user: userId
        });
        res.send({ status: 'Ok', data: product });
    } catch (e) {
        console.log('createProduct error', e);
        res.status(500).send({ status: 'ERROR', data: e.message });
    }
};

const deleteProduct = (req, res) => {};

const getProduct = async (req, res) => {
    try {
        const products = await Products.find({}).populate('user', 'username email').select('title desc price');
        res.send({ status: 'Ok', data: products });
    } catch (e) {
        console.log('getProduct error', e);
        res.status(500).send({ status: 'ERROR', data: e.message });
    }
};

const getProductByUser = async (req, res) => {
    try {
        const products = await Products.find({
            user: req.params.userId
        });
        res.send({ status: 'Ok', data: products });
    } catch (e) {
        console.log('getProdutcByUser', e);
        res.status(500).send({ status: 'Ok', data: e.message });
    }
};

const getProductByPrice = async (req, res) => {
    try {
        const products = await Products.find({
            price: { $gt: 20 }
        }).populate('user', 'username').select('title desc price');
        res.send({ status: 'Ok', data: products });
    } catch (e) {
        console.log('getProductByPrice error', e);
        res.status(500).send({ status: 'ERROR', data: e.message });
    }
}

module.exports = {
    createProdut,
    deleteProduct,
    getProduct,
    getProductByUser,
    getProductByPrice
}