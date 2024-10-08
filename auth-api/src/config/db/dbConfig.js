import { Sequelize } from "sequelize";

const sequelize = new Sequelize("auth-db", "postgres", "123456",{
  host: "localhost",
  dialect: "postgres",
  quoteIdentifiers: false,
  define:{
    syncOnAssociation: true,
    timestamps: false,
    underscored: true,
    underscoredAll: true,
    freezeTableName: true,
  }
})
sequelize.authenticate().then(() => {
  console.log("Connection has been established successfully.");
}).catch((error) => {
  console.error("Unable to connect to the database:", error.message);
})

export default sequelize;