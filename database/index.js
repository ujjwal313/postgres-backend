//importing modules
const { Sequelize, DataTypes } = require("sequelize");

//Sample URI- "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";

const sequelize = new Sequelize(
  `<Enter your DB URI here (check the format above)>`,
  { dialect: "postgres", define: { freezeTableName: true } }
);

//checking if connection is done
sequelize
  .authenticate()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((err) => {
    console.log(err);
  });

const db = {};
db.sequelize = sequelize;

//connecting to model
db.user = require("./user.model")(sequelize, DataTypes);

//exporting the module
module.exports = db;
