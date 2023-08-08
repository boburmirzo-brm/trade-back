const { BuyOrSells, validateBuyOrSell } = require('../model/buyOrSellSchema');
const {dateQuery} = require("../utils/dateQuery")

exports.getBuyOrSells = async (req, res) => {
  try {
    const buyOrSells = await BuyOrSells.find(dateQuery(req.query)).sort({_id:-1});
    res.status(200).json({
      variant: 'success',
      msg: 'Barcha kirim-chiqimlar',
      innerData: buyOrSells,
    });
  } catch {
    res
      .status(500)
      .json({ variant: 'error', msg: 'Server Error', innerData: null });
  }
};

exports.createBuyOrSell = async (req, res) => {
  try {
    const { error } = validateBuyOrSell(req.body);
    if (error) {
      return res.status(400).json({
        variant: 'warning',
        msg: error.details[0].message,
        innerData: null,
      });
    }

    if (req.body.status === 'input' && req.body.orderId !== '') {
      return res.status(400).json({
        variant: 'warning',
        msg: "OrderId status inputga teng bo'lganida bo'sh string bo'lishi shart!",
        innerData: null,
      });
    } else if (req.body.status === 'output' && req.body.sellerId !== '') {
      return res.status(400).json({
        variant: 'warning',
        msg: "SellerId status outputga teng bo'lganida bo'sh string bo'lishi shart!",
        innerData: null,
      });
    }
    if (req.body.status === 'input'){
      // seller -> budget + (price * quantity)
    }else if(req.body.status === 'output'){
      // customer -> budget - (price * quantity)
    }
    // Products -> productId -> 
    // let totalPriceInStore = (product.quontity * product.price)
    // 13 000 * 10 = 130 000
    // let newProductPrice = (price * quantity)
    // 15 000 * 100 = 1 500 000
    // let total =  totalPriceInStore + newProductPrice
    // 130 000 + 1 500 000 = 1 630 000
    // let singlePrice = total / (product.quontity + quantity)
    // 1 630 000 / 110 = 14 818
    const BuyOrSell = await BuyOrSells.create(req.body);
    res.status(201).json({
      variant: 'success',
      msg: 'BuyOrSell muvaffaqiyatli yaratildi.',
      innerData: BuyOrSell,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      variant: 'error',
      msg: 'Server Error',
      innerData: null,
    });
  }
};

exports.deleteBuyOrSell = async (req, res) => {
  try {
    const { id } = req.params;
    await BuyOrSells.findByIdAndDelete(id, req.body);
    res.status(200).json({
      variant: 'success',
      msg: "BuyOrSell muvaffaqiyatli o'chirildi",
      innerData: null,
    });
  } catch {
    res.status(500).json({
      variant: 'error',
      msg: 'server error',
      innerData: null,
    });
  }
};
