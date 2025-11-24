const router = require('express').Router();
const verify = require('../middlewares/authentication');
const billController = require('../controllers/bill.controller');

router.post("/create", verify, billController.create);
router.post("/update", verify, billController.update);
router.get("/id/:billId", verify, billController.getById);
router.delete("/:billId", verify, billController.delete);
router.get("/list", verify, billController.list);

module.exports = router;