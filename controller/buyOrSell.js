const { BuyOrSells, validateBuyOrSell } = require('../model/buyOrSellSchema'),
  { Sellers } = require('../model/sellerSchema'),
  { Order } = require('../model/orderSchema'),
  { Customers } = require('../model/customerSchema'),
  { Products } = require('../model/productSchema'),
  { Admins } = require('../model/adminSchema');
const { dateQuery } = require('../utils/dateQuery');

exports.getBuyOrSells = async (req, res) => {
  try {
    const buyOrSells = await BuyOrSells.find(dateQuery(req.query)).sort({
      _id: -1,
    });
    res.status(200).json({
      variant: 'success',
      msg: 'Barcha kirim-chiqimlar',
      innerData: buyOrSells,
    });
  } catch {
    res.status(500).json({
      variant: 'error',
      msg: 'Serverda hatolik yuz berdi.',
      innerData: null,
    });
  }
};

// status - input
// sellerId
// productId

// update --> Seller budget + price * quantity
// update --> Product price - quantity
// create --> buyOrSell

exports.createBuyOrSellInput = async (req, res) => {
  try {
    const { error } = validateBuyOrSell(req.body);
    if (error) {
      return res.status(400).json({
        variant: 'warning',
        msg: error.details[0].message,
        innerData: null,
      });
    }

    const { status, sellerId, orderId, price, quantity, productId } = req.body;

    if (status !== 'input' || sellerId === '' || orderId !== '')
      return res.status(400).json({
        variant: 'warning',
        msg: "Status yoki Sotuvchi Idsi notog'ri kiritilgan.",
        innerData: null,
      });

    await Sellers.findByIdAndUpdate(sellerId, {
      $inc: { budget: price * quantity },
    });

    const product = await Products.findById(productId);
    if (!product)
      return res.status(400).json({
        variant: 'warning',
        msg: "Mahsulot topilmadi. Noto'gri Id kiritilgan.",
      });

    let totalPriceInStore = product.quantity * product.price;
    let newProductPrice = price * quantity;
    let total = totalPriceInStore + newProductPrice;
    let totalQuantity = product.quantity + quantity;
    let singlePrice = total / totalQuantity;

    await Products.findByIdAndUpdate(productId, {
      price: singlePrice,
      $inc: { quantity: quantity },
    });

    const BuyOrSell = await BuyOrSells.create(req.body);

    res.status(201).json({
      variant: 'success',
      msg: 'Kirim-chiqim muvaffaqiyatli yaratildi. Sotuvchining budgeti va mahsulot narxi yangilandi.',
      innerData: BuyOrSell,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      variant: 'error',
      msg: 'Serverda hatolik yuz berdi.',
      innerData: null,
    });
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

    const { status, orderId, sellerId, price, quantity, productId, adminId } =
      req.body;

    if (status === 'input' && orderId !== '') {
      return res.status(400).json({
        variant: 'warning',
        msg: "Zakaz Idsi status inputga teng bo'lganida bo'sh string bo'lishi shart!",
        innerData: null,
      });
    } else if (status === 'output' && sellerId !== '') {
      return res.status(400).json({
        variant: 'warning',
        msg: "Sotuvchi Idsi status outputga teng bo'lganida bo'sh string bo'lishi shart!",
        innerData: null,
      });
    }
    switch (status) {
      case 'input':
        // find seller
        const seller = await Sellers.findById(sellerId);

        // check if seller exists
        if (!seller)
          return res.status(400).json({
            variant: 'warning',
            msg: "Sotuvchi topilmadi. Noto'gri Id kiritilgan.",
          });

        // seller -> budget + (price * quantity)
        let sellerBudget = seller.budget - price * quantity;
        await Sellers.findByIdAndUpdate(sellerId, {
          budget: sellerBudget,
        });

        break;
      case 'output':
        // customer -> budget - (price * quantity)
        const order = await Order.findById(orderId);

        if (!order)
          return res.status(400).json({
            variant: 'warning',
            msg: "Zakaz topilmadi. Noto'gri Id kiritilgan.",
          });

        const customerId = order.customerId;
        const customer = await Customers.findById(customerId);
        if (!customer)
          return res.status(400).json({
            variant: 'warning',
            msg: "Haridor topilmadi. Noto'gri Id kiritilgan.",
          });
        await Customers.findByIdAndUpdate(customerId, {
          budget: customer.budget - price * quantity,
        });
        break;
    }

    // Products -> productId ->
    const product = await Products.findById(productId);

    if (!product)
      return res.status(400).json({
        variant: 'warning',
        msg: "Mahsulot topilmadi. Noto'gri Id kiritilgan.",
      });
    let totalPriceInStore = product.quantity * product.price;
    // 13 000 * 10 = 130 000
    let newProductPrice = price * quantity;
    // 15 000 * 100 = 1 500 000
    let total = totalPriceInStore + newProductPrice;
    // 130 000 + 1 500 000 = 1 630 000
    let totalQuantity = product.quantity + quantity;
    let singlePrice = total / totalQuantity;
    // 1 630 000 / 110 = 14 818

    await Products.findByIdAndUpdate(productId, {
      price: singlePrice,
      quontity: totalQuantity,
    });

    const admin = await Admins.findById(adminId);

    if (!admin) {
      return res.status(400).json({
        variant: 'warning',
        msg: "Admin topilmadi. Noto'gri Id kiritilgan.",
      });
    }

    const BuyOrSell = await BuyOrSells.create({
      status,
      orderId,
      sellerId,
      price,
      quantity,
      productId,
      adminId,
      ...req.body,
    });
    res.status(201).json({
      variant: 'success',
      msg: `Kirim-chiqim muvaffaqiyatli yaratildi. ${
        status === 'output' ? 'Haridor' : 'Sotuvchi'
      }ning budgeti va mahsulot narxi yangilandi.`,
      innerData: BuyOrSell,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      variant: 'error',
      msg: 'Serverda hatolik yuz berdi.',
      innerData: null,
    });
  }
};

// update

exports.deleteBuyOrSell = async (req, res) => {
  try {
    const { id } = req.params;
    await BuyOrSells.findByIdAndDelete(id, req.body);
    res.status(200).json({
      variant: 'success',
      msg: "Kirim-chiqim muvaffaqiyatli o'chirildi",
      innerData: null,
    });
  } catch {
    res.status(500).json({
      variant: 'error',
      msg: 'Serverda hatolik yuz berdi.',
      innerData: null,
    });
  }
};

// exports.deleteAllBuyOrSells = async (req, res) => {
//   try {
//     await BuyOrSells.deleteMany({});

//     res.status(204).json({
//       variant: 'success',
//       msg: "Barcha Kirim-chiqimlar o'chirildi",
//     });
//   } catch {
//     res.status(500).json({
//       variant: 'error',
//       msg: 'Serverda hatolik yuz berdi.',
//       innerData: null,
//     });
//   }
// };
