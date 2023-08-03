const express = require("express"),
    cors = require("cors"),
    dotenv = require("dotenv"),
    { config } = dotenv,
    mongoose = require("mongoose"),
    app = express()


app.use(express.json())
app.use(cors())
config()



mongoose.connect(process.env.MONGODB_URL)
    .then((res => console.log("MONGO is connected")))
    .catch((err) => console.log(err))


app.get("/", async (req, res) => {
    res.status(200).json("Mern is working")
})

const Routers = require("./router")
app.use("/", Routers)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
    console.log(`${PORT} is listening`);
})