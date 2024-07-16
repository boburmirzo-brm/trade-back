const allowedOrigins = ["http://trade.namtech.uz", "http://localhost:3000", ]; // Add your allowed origins
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};