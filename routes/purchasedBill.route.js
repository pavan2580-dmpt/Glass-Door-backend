const router = require("express").Router();
const purchasedBillController = require("../controllers/purchasedBill.controller");
const verify = require("../middlewares/authentication");

router.post("/createUpdate", verify, purchasedBillController.createUpdate);
router.get("/id/:purchasedId", verify, purchasedBillController.getById);
router.delete("/:purchasedId", verify, purchasedBillController.delete);
router.get("/list", verify, purchasedBillController.list);

module.exports = router;