const mongoose = require("mongoose");
require("dotenv").config({ path: `./.env.${process.env.NODE_ENV}` });

exports.DBconnection=()=>{mongoose
  .connect(process.env.MONGOOSE_CONNECTION_URI)
  .then((res) => {
    console.log("database connected successfully.");
  })
  .catch((err) => {
    console.log("error occurred in connecting the database.");
  });
}