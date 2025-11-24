const router = require('express').Router();
const productController = require('../controllers/product.controller');
const verify = require('../middlewares/authentication');

router.post('/createUpdate', verify, productController.createUpdate);
router.get('/id/:productId', verify, productController.getById);
router.delete('/:productId', verify, productController.delete);
router.get('/list', verify, productController.list);

module.exports = router;