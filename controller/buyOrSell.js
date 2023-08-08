const { BuyOrSells, validateBuyOrSell } = require('../model/buyOrSellSchema');

exports.getBuyOrSells = async (req, res) => {
  try {
    const buyOrSells = await BuyOrSells.find();
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
