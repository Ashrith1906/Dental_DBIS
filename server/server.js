const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoute");
const profileRoutes = require("./routes/profileRoute"); 
const patientRoutes = require("./routes/patientRoute");
const appointmentRoutes = require("./routes/appointmentRoute");
const reportRoutes = require("./routes/reportRoute");
const invoiceRoutes = require("./routes/invoiceRoute");
const razorpayRoutes = require("./routes/razorpayRoute");
const app = express();
env.config();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/users", userRoutes);
app.use('/api/profiles', profileRoutes);
app.use('/api/patient',patientRoutes);
app.use('/api/appointments',appointmentRoutes);
app.use('/api/report',reportRoutes);
app.use('/api/invoice',invoiceRoutes);
app.use("/api/razorpay",razorpayRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Atlas Database connected");
  })
  .catch((err) => {
    console.log(err);
  });
