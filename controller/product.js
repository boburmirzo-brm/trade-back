const { Products, validationProduct } = require("../model/productSchema");
const { BuyOrSells, validateBuyOrSell } = require("../model/buyOrSellSchema");
const { Sellers } = require("../model/sellerSchema")
const { dateQuery } = require("../utils/dateQuery");

exports.getProducts = async (req, res) => {
  try {
    const products = await Products.find(dateQuery(req.query)).sort({
      _id: -1,
    });
    res.status(200).json({
      variant: "success",
      msg: "Barcha Mahsulotlar",
      innerData: products,
    });
  } catch {
    res
      .status(500)
      .json({ variant: "error", msg: "server error", innerData: null });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { error } = validationProduct(req.body);
    if (error) {
      return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null, });
    }

    const { title, price, quantity, units, category, comment, sellerId, adminId, } = req.body;
    const newProductSchema = { title, price, quantity, category, units, comment, adminId };

    const seller = await Sellers.findOne({ _id: sellerId }).exec();

    if (!seller.isActive) {
      return res.status(404).json({ variant: "warning", msg: "Sotuvchi Arxivlangan", innerData: null });
    }

    const newProduct = await Products.create(newProductSchema);

    if (newProduct) {
      const newBuyOrSell = { status: "input", sellerId, orderId: "", productId: newProduct._id.toString(), adminId, title, price, quantity, units, comment, originalPrice: 0, returnedItem: false, };

      const { error } = validateBuyOrSell(newBuyOrSell);
      if (error) {
        return res.status(400).json({ variant: "warning", msg: error.details[0].message, innerData: null, });
      }

      await BuyOrSells.create(newBuyOrSell);
      await Sellers.findByIdAndUpdate(sellerId, { $inc: { budget: price * quantity } })
    }

    res.status(201).json({ variant: "success", msg: "Mahsulot Yaratildi", innerData: { newProduct }, });

  } catch (error) {
    if (error.name === "CastError" && error.kind === "ObjectId") {
      res.status(404).json({ variant: "warning", msg: "Sotuvchi Idsi Xato", innerData: null, });
    } else {
      res.status(500).json({ variant: "error", msg: "server error", innerData: null });
    }
  }
}
