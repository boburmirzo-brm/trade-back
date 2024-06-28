const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { config } = dotenv;
const mongoose = require("mongoose");
const app = express();
const morgan = require("morgan");
const {corsOptions} = require("./utils/corsOptions")
const swaggerUi = require('swagger-ui-express');
const specs = require("./swagger")

app.use(express.json())
app.use(cors(corsOptions))
app.use(morgan("dev"))
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
config()

mongoose.connect(process.env.MONGODB_URL)
    .then((res => console.log("MongoDB is connected")))
    .catch((err) => console.log(err))


app.get("/", async (req, res) => {
    res.status(200).json("Mern is working")
})

const Routers = require("./routes")
app.use("/", Routers)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`${PORT} is listening`);
})