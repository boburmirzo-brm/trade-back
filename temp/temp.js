

// done
const admin = {
  id: "",
  fname: "",
  lname: "",
  phones: [],
  role: "",
  username: "",
  password: "",
  createdAt: "",
  isActive: true,
  // salaries: [],
  // expenses: ["id", "id"],
};
const salary = {
  id: "",
  adminId: "",
  amount: 0,
  createdAt: "",
  comment: "",
};


// done
const seller = {
  id: "",
  fname: "",
  lname: "",
  phones: [],
  address: "",
  budget: -1_000_000,// agar "-" man qarzman, "+" u qarzdor
  createdAt: "",
  adminId: "",
  isActive: true,
};

// done
const expense = {
  id: "",
  adminId: "",
  sellerId: "",
  amount: 0,
  createdAt: "",
  comment: "",
};

// done
const customer = {
  id: "",
  fname: "",
  lname: "",
  phones: [],
  address: "",
  budget: -900_000,// agar "+" man qarzman, "-" u qarzdor
  createdAt: "",
  adminId: "",
  isActive: true,
};

// done
const product = {
  id: "",
  title: "",
  price: 0,
  quantity: 62,
  category: "",
  units: "kg, dona, litr, m2",
  createdAt: "",
  comment: "",
  adminId: "",
};
// done
const buyOrSell = {
  id: "", // qaytarish uchun
  status: "input", // status - input or output
  orderId: "", // output -> orderId value keladi
  sellerId: "id-salim", // input -> sellerId value keladi
  title: "",
  price: 14500,
  quantity: 10,
  units: "kg",
  comment: "",
  createdAt: "",
  adminId: "",
  returnedItem: false // qaytarish uchun
}

// done
const order = {
  id: "",
  customerId: "",
  createdAt: "05.04.2023",
  finalDate: "05.08.2023",
  totalPrice: 0,
};


// done
const payment = {
  id: "",
  customerId: "",
  adminId: "",
  amount: 400_000,
  createdAt: "",
  comment: "",
};


// let DATA = [
//   {
//     id: "pro-1", // o'zgarmas
//     title: "shakar", // o'zgarmas
//     price: 15000,
//     quantity: 10,
//   }
// ]

// // shakar qo'shish

// let updatePro1 =   {
//   id: "pro-1", // o'zgarmas
//   title: "shakar", // o'zgarmas
//   price: 20000,
//   quantity: 30
// }

// // backend dagi jarayon
// (oldPrice * oldQty) + (newPrice * newQty) / (oldQty + newQty)
// (15000 * 10) + (20000 * 30) / (10 + 30) = 18750

// // natija
// let DATA = [
//   {
//     id: "pro-1", // o'zgarmas
//     title: "shakar", // o'zgarmas
//     price: 18750,
//     quantity: 40,
//   }
// ]



const products = [
  {
    id: "shakar-0668",
    title: "shakar",
    quantity: 30,
    totalPrice: 550_000,
    category: "",
    units: "kg"
  }
]


const productItems = [
  {
    id: "asd2as131321s",
    productId: "shakar-0668",
    adminId: "bobur-0668",
    quantity: 10,
    price: 15_000,
    comment: "",
    createdAt: ""
  },
  {
    id: "asd2as13132as",
    productId: "shakar-0668",
    adminId: "zokirkhan-1002",
    quantity: 20,
    price: 20_000,
    comment: "",
    createdAt: ""
  },
]


const sotish = {
  id: "shakar-0668",
  title: "",
  quantity: 30 - 5,
  totalPrice: 550_000 - ((550_000 / 30) * 5),
  category: "",
  units: "kg, dona, litr, m2",
};



let b = -150_000




// order POST (customer)
// customer budgetdan orderni totalPrice ayiramz
// formula
// budget - orderTotalPrice

// order PATCH (customer)
// customer budgetga orderni eski totalPrice qo'shib yangi totalPrice ayiramz
// formula
// budget + oldOrderTotalPrice - newOrderTotalPrice

// order DELETE (customer)
// customer budgetga orderni totalPrice qo'shamiz
// formula
// budget + orderTotalPrice




// order POST (product)
// productni quantitysi va totalPrice kamayadi
// formula
// quantity - orderQuantity
// totalPrice - (totalPrice / quantity * orderQuantity)


// order PATCH (product)
// productni quantitysi va totalPrice o'zgaradi yani qaytarilgan bo'lsa (vozvrat tovar)
// formula
// quantity + orderQuantity
// totalPrice + (totalPrice / quantity * orderQuantity)


// order DELETE (product)
// barcha product eski holatiga qaytariladi
// formula
// quantity + orderQuantity
// totalPrice + (totalPrice / quantity * orderQuantity)






