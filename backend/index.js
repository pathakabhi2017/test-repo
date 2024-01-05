const connectToMongo = require("./db");
const express = require("express");
var cors = require("cors");
const path = require('path');


const bodyParser = require('body-parser');
const app = express();
const port = 4015;

app.use(cors());
app.use(express.json({ limit: '50mb' })); //if we want to use req.body this middleware is required

// Available Routes
app.use("/api/ques", require("./routes/ques"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/exam", require("./routes/exams"));
app.use("/api/user", require("./routes/users"));
app.use("/api/categories", require("./routes/categories"));
app.use("/api/examdetails", require("./routes/studentexamdetails"));
app.use("/api/examwiseresultsdata", require("./routes/examwiseresults"));


// app.use(express.static(path.join(__dirname, "./build")));

// app.use("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "./build/index.html"));
// });


connectToMongo();

app.listen(port, () => {
  console.log(`Online exam node backend listening on port ${port}`);
});

