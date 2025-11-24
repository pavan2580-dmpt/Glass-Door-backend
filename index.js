const express = require('express');
require('dotenv').config();
const mongooseConfig = require('./config/mongoose');
const adminRoute = require('./routes/admin.route');
const productRoute = require('./routes/product.route');
const billRoute = require('./routes/bill.route');
const purchasedBillRoute = require('./routes/purchasedBill.route');

const cors = require('cors');
const app = express();
const port = process.env.APP_PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use((req, res, next) => {
    const allowedOrgins = ["http://localhost:4200","*"];
    const orgin = req.headers.orgin;
    if (allowedOrgins.includes(orgin)) {
        res.setHeader("Access-Control-Allow-Orgin", orgin);
    }
    res.header("Access-Control-Allow-Methods", "GET, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-type, Authorization");
    res.header("Access-Control-Allow-Credentials", true);
    return next();
})

app.get('/', (req, res) => res.send('WELCOME TO API HOME.'));
app.use('/api/v1/admin', adminRoute);
app.use('/api/v1/product', productRoute);
app.use("/api/v1/bill", billRoute);
app.use("/api/v1/purchased", purchasedBillRoute);
app.use('/uploads', express.static("uploads"));

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.message = 'Invalid Route';
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    return res.json({
        error: {
            message: error.message
        }
    })
});

async function dbConnect() {
    try {
        await mongooseConfig.connectToServer();
        console.log('Connected now to mongo db');
    } catch (error) {
        console.log('Error in mongo connection:', error);
    }
}

dbConnect();
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});