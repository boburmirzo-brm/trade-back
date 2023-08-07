const { BuyOrSells, validateBuyOrSell  } = require("../model/buyOrSellSchema");
const bcrypt = require("bcrypt");

exports.getBuyOrSells = async (req, res) => {
  try {
    const buyOrSells = await BuyOrSells.find();
    res
      .status(200)
      .json({ variant: "success", msg: "Barcha kirim-chiqimlar", innerData: buyOrSells });
  } catch {
    res
      .status(500)
      .json({ variant: "error", msg: "Server Error", innerData: null });
  }
};