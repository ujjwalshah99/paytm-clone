const express = require('express');
const app = express();
const mainRouter = require("./routes/index");
const cors = require("cors");
const bodyParser = require("body-parser");
const {connectDB} = require("./db");

app.use(cors());
app.use(bodyParser.json());
app.use("/api/v1" , mainRouter);

app.get('/', (req, res) => {
    res.send('Hello, Express! yo yo yo');
});



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    connectDB();
    console.log(`Server is running on port ${PORT}`);
});
