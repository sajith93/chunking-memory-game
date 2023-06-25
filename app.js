const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];


app.listen(3000, function() {
  console.log("Server started on port 3000");
});

app.get("/", function (req, res) {
    res.sendFile('index.html');
});
