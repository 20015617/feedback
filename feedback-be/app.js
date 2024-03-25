var express = require("express");
var properties = require("./config/properties");
var db = require("./config/database");
var app = express();
var router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser")

app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended:true}));

app.use(cors());

db();

app.listen(properties.port, (req, res) => {
    console.log(`Server is running on ${properties.port} port.`);
});

app.use(function (req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Access-Control-Allow-Origin,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers,Authorization"
    );
    next();
});

app.use("/api", router);
require("./controller/user")(router);