const express = require('express');
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} = require('../controllers/productController');

const router = express.Router();

router.get('/products', (req, res) => {
    if (req.query.id) {
        return getProductById(req, res);
    }
    return getAllProducts(req, res);
});

router.post('/products', createProduct);
router.put('/products', updateProduct);
router.delete('/products', deleteProduct);

module.exports = router;
