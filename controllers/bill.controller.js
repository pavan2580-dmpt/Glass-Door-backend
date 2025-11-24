const billModel = require("../models/bill.model");
const productModel = require("../models/product.model");
const purchasedBillModel = require("../models/purchasedBill.model");

exports.create = async (req, res) => {
  try {
    let date = new Date().toISOString();
    let billNo = `${date.slice(8, 10)}${date.slice(5, 7)}${date.slice(2, 4)}`;
    const count = await billModel.countDocuments({
      billNo: { $regex: `^${billNo}` },
    });
    let cnt = count + 1;
    const schema = req.body;
    schema.billNo = `${billNo}${cnt.toString().padStart(2, "0")}`;
    const bill = await billModel.create(schema);
    if (bill) {
      for (let i = 0; i < bill.products.length; i++) {
        const product = await productModel.findOne({
          _id: bill.products[i].productId,
        });
        const purchased = await purchasedBillModel.findOneAndUpdate(
          { productName: product.name },
          { $inc: { quantity: -bill.products[i].quantity } },
          { new: true }
        );
      }
    }
    const getBill = await billModel
      .findOne({ _id: bill._id })
      .populate("products.productId");
    res.status(201).send({
      data: { bill: getBill },
      error: null,
      status: 1,
      message: "Adding Bill Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Adding Bill.",
    });
  }
};

exports.update = async (req, res) => {
  try {
    const schema = req.body;
    const bill = await billModel.findOneAndUpdate(
      { _id: req.body.billId },
      schema,
      { new: true }
    );
    res.status(200).send({
      data: { bill },
      error: null,
      status: 1,
      message: "Updated Bill Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Updating Bill.",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const bill = await billModel
      .findOne({ _id: req.params.billId })
      .populate("products.productId");
    res.status(200).send({
      data: { bill },
      error: null,
      status: 1,
      message: "Retrieved Bill Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Retrieving Bill.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const bill = await billModel.findOneAndDelete({ _id: req.params.billId });
    res.status(200).send({
      data: { bill },
      error: null,
      status: 1,
      message: "Deleted Bill Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Deleting Bill.",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber)
      : 1;
    let search = req.query.search ? req.query.search : "";
    const data = [
      {
        $unwind: "$products",
      },
      {
        $lookup: {
          from: "products",
          localField: "products.productId",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      {
        $unwind: "$productDetails",
      },
      {
        $group: {
          _id: "$_id",
          products: {
            $push: {
              productId: "$products.productId",
              quantity: "$products.quantity",
              productDetails: "$productDetails",
              createdAt: "$products.createdAt",
              updatedAt: "$products.updatedAt",
            },
          },
          total: { $first: "$total" },
          billNo: { $first: "$billNo" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
        },
      },
      {
        $match: {
          $or: [
            { billNo: { $regex: `${search}.*`, $options: "i" } },
            { total: { $regex: `${search}.*`, $options: "i" } },
            {
              "products.productDetails.name": {
                $regex: `${search}.*`,
                $options: "i",
              },
            },
            {
              "products.productDetails.price": {
                $regex: `${search}.*`,
                $options: "i",
              },
            },
          ],
        },
      },
      {
        $facet: {
          pagination: [
            { $count: "total" },
            { $addFields: { page: pageNumber } },
          ],
          data: [{ $skip: (pageNumber - 1) * pageSize }, { $limit: pageSize }],
        },
      },
    ];
    const bills = await billModel.aggregate(data);
    res.status(200).send({
      data: { bills: bills[0].data, pagination: bills[0].pagination[0] },
      error: null,
      status: 1,
      message: "Retrieved Bills Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Retrieving Bills.",
    });
  }
};
