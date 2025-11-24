const mongoose = require("mongoose");
const purchasedBillModel = require("../models/purchasedBill.model");

exports.createUpdate = async (req, res) => {
    try {
        let msg = req.body.purchasedId ? 'Updated Purchased Bill Successfully.' : 'Created Purchased Bill Successfully.';
        const schema = req.body;
        const purchasedId = req.body.purchasedId && mongoose.isValidObjectId(req.body.purchasedId) ?
            req.body.purchasedId : new mongoose.Types.ObjectId();
        const purchasedBill = await purchasedBillModel.findOneAndUpdate({ _id: purchasedId }, schema, { new: true, upsert: true });
        res.status(201).send({
            data: { purchasedBill },
            error: null,
            status: 1,
            message: msg
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Editing Purchased Bill."
        })
    }
}

exports.getById = async (req, res) => {
    try {
        const purchasedBill = await purchasedBillModel.findOne({ _id: req.params.purchasedId });
        res.status(200).send({
            data: { purchasedBill },
            error: null,
            status: 1,
            message: "Retrieved Purchased Bill Successfully."
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Retrieving Purchased Bill."
        })
    }
}

exports.delete = async (req, res) => {
    try {
        const purchasedBill = await purchasedBillModel.findOneAndDelete({ _id: req.params.purchasedId });
        res.status(200).send({
            data: { purchasedBill },
            error: null,
            status: 1,
            message: "Deleted Purchased Bill Successfully."
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Deleting Purchased Bill."
        })
    }
}

exports.list = async (req, res) => {
    try {
        let search = req.query.search ? req.query.search : "";
        const pageSize = req.query.pageSize ? parseInt(req.query.pageSize) : 10;
        const pageNumber = req.query.pageNumber ? parseInt(req.query.pageNumber) : 1;
        const data = [
            {
                $match: {
                    $or: [
                        { productName: { $regex: `${search}.*`, $options: "i" } },
                        { quantity: { $regex: `${search}.*`, $options: "i" } },
                    ]
                }
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
        ]
        const purchasedBill = await purchasedBillModel.aggregate(data);
        res.status(200).send({
            data: { purchasedBill: purchasedBill[0].data, pagination: purchasedBill[0].pagination[0] },
            error: null,
            status: 1,
            message: "Retrieved purchasedBill Successfully."
        })
    } catch (error) {
        res.status(400).send({
            data: null,
            error: error,
            status: 0,
            message: "Error in Retrieving Purchased Bill."
        })
    }
}