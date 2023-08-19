const { Products, validationProduct } = require("../model/productSchema");
const { BuyOrSells, validateBuyOrSell } = require("../model/buyOrSellSchema")
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
        
        const { title, price, quantity, units, category, comment, sellerId, adminId } = req.body
        const newProductSchema = { title, price, quantity, category, units, comment, adminId }

        const newProduct = await Products.create(newProductSchema);
        
        if(newProduct){
            const status = 'input'
            const orderId = ""
            const productId = newProduct._id.toString()
            const originalPrice = 0
            const returnedItem = false
            const newBuyOrSell = { status, sellerId, orderId, productId, adminId, title, price, quantity, units, comment, originalPrice, returnedItem }
            const { error } = validateBuyOrSell(newBuyOrSell)
            if(error){
                return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null });
            }
            const buyorsell = await BuyOrSells.create( newBuyOrSell )
            res.status(201).json({ variant: "success", msg: "Mahsulot Yaratildi", innerData: {newProduct, buyorsell} });
        } 
    }
    catch {
        res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
}