const { Customers, validateCustomer } = require("../model/customerSchema");
const { dateQuery } = require("../utils/dateQuery")

const handleResponse = (res, status, variant, msg, innerData, totalCount) => {
  res.status(status).json({
    variant,
    msg,
    innerData,
    totalCount
  });
};

exports.getCustomers = async (req, res) => {
    try {
        let {isActive=true} = req.query
        const customers = await Customers.find({ isActive, ...dateQuery(req.query)}).sort({ createdAt: -1 });
        handleResponse(res, 200, "success", "Barcha mijozlar", customers, customers.length)
    } catch {
        handleResponse(res, 500, "error", "server error", null)
    }
};

exports.getOneCustomer = async (req, res) => {
    try {
        const {id} = req.params
        // const oneCustomer = await Customers.findOne({_id:id})
        const customer = await Customers.findById(id)
        if (!customer) {
            return handleResponse(res, 404, "warning", "Mijoz topilmadi", null)
        }
        handleResponse(res, 200, "success", "Mijoz topildi", customer)
    }
    catch {
        handleResponse(res, 500, "error", "server error", null)
    }
}

exports.createCustomer = async (req, res) => {
    try {
        const { error } = validateCustomer(req.body);
        if (error) {
            return handleResponse(res, 400, "warning", error.details[0].message, null)
        }
        const newCustomer = await Customers.create(req.body);
        handleResponse(res, 201, "success","Mijoz muvaffaqiyatli qo'shildi", newCustomer )
    } catch {
        handleResponse(res, 500, "error", "server error", null)
    }
};

exports.updateCustomer = async (req, res) => {
    try {
        const { id } = req.params
        const oneCustomer = await Customers.findById(id)
        if (!oneCustomer) {
            return handleResponse(res, 404, "warning", "Mijoz topilmadi", null)
        }
        const updatedCustomer = await Customers.findByIdAndUpdate(id, {...req.body, budget: oneCustomer.budget}, {new:true})
        handleResponse(res, 200, "success", "Mijoz muvaffaqiyatli tahrirlandi", updatedCustomer)
    }
    catch {
        handleResponse(res, 500, "error", "server error", null)
    }
};

exports.isActiveCustomer = async (req, res, next) => {
    try {
        const { id } = req.params
        const customer = await Customers.findById(id)
        if (!customer) {
            return handleResponse(res, 404, "warning", "Mijoz topilmadi", null)
        }
        let updatedCustomer = await Customers.findByIdAndUpdate(
            id,
            {
                $set: {
                    isActive: !(customer.isActive)
                }
            }
        )
        handleResponse(res, 200, "success", `Arxiv${customer.isActive ? "ga qo'shildi" : "dan chiqarildi"}`,updatedCustomer)
    }
    catch {
        handleResponse(res, 500, "error", "server error", null)
    }
}

// hali to'liq bitmagan delete
exports.deleteCustomer = async (req, res) => {
    try {
        const { id } = req.params;
        await Customers.findByIdAndDelete(id);
        handleResponse(res, 200, "success", "Customer successfully deleted", null);
    } catch  {
      handleResponse(res, 500, "error", "Server error", null);
    } 
};
  