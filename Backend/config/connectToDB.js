const mongoose = require('mongoose');
const dotEnv = require('dotenv')
dotEnv.config('../confige.env');
const databaseConnection = () => {
    mongoose
        .connect(process.env.db_url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            dbName: "amazon_project",
        })
        .then(() => {
            console.log("database is runnig");
        })
        .catch((err) => {
            console.log(err);
        });
}

module.exports=databaseConnection;