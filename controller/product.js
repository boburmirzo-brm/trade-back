const { Products, validationProduct } = require("../model/productSchema");
const { dateQuery } = require("../utils/dateQuery");

exports.getProducts = async (req, res) => {
    try {
        const products = await Products.find(dateQuery(req.query)).sort({_id: -1});
        res.status(200).json({ variant: "success", msg: "Barcha Mahsulotlar", innerData: products });
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}

exports.createProduct = async (req, res) => {
    try {
        const { error } = validationProduct(req.body);
        if (error) {
            return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null });
        }
        const newProduct = await Products.create(req.body);
        res.status(201).json({ variant: "success", msg: "Mahsulot Yaratildi", innerData: newProduct });
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}