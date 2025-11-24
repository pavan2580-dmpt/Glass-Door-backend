const mongoose = require("mongoose");
const productModel = require("../models/product.model");

exports.createUpdate = async (req, res) => {
  try {
    let msg = req.body.productId
      ? "Updated Product Successfully."
      : "Created Product Successfully.";
    const prodata = req.body;
    const productId =
      req.body.productId && mongoose.isValidObjectId(req.body.productId)
        ? req.body.productId
        : new mongoose.Types.ObjectId();
    const product = await productModel.findOneAndUpdate(
      { _id: productId },
      prodata,
      { new: true, upsert: true }
    );
    res.status(201).send({
      data: { product },
      error: null,
      status: 1,
      message: msg,
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Editing Product.",
    });
  }
};

exports.getById = async (req, res) => {
  try {
    const product = await productModel.findOne({ _id: req.params.productId });
    res.status(200).send({
      data: { product },
      error: null,
      status: 1,
      message: "Retrieved Product Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Retrieving Product.",
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete({
      _id: req.params.productId,
    });
    res.status(200).send({
      data: { product },
      error: null,
      status: 1,
      message: "Deleted Product Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Deleting Product.",
    });
  }
};

exports.list = async (req, res) => {
  try {
    const count = await productModel.countDocuments();
    const pageSize = req.query.pageSize
      ? parseInt(req.query.pageSize)
      : count > 0
      ? count
      : 5;
    const pageNumber = req.query.pageNumber
      ? parseInt(req.query.pageNumber)
      : 1;
    let search = req.query.search ? req.query.search : "";
    const data = [
      {
        $match: {
          $or: [
            { name: { $regex: `${search}.*`, $options: "i" } },
            { price: { $regex: `${search}.*`, $options: "i" } },
          ],
        },
      },
      {
        $sort: { createdAt: -1 },
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
    const products = await productModel.aggregate(data);
    res.status(200).send({
      data: {
        products: products[0].data,
        pagination: products[0].pagination[0],
      },
      error: null,
      status: 1,
      message: "Retrieved Products Successfully.",
    });
  } catch (error) {
    res.status(400).send({
      data: null,
      error: error,
      status: 0,
      message: "Error in Retrieving Products.",
    });
  }
};
