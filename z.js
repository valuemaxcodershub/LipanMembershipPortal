import { Sequelize, DataTypes } from "sequelize";

// Initialize Sequelize with SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./mydatabase.db", // SQLite database file
});

// Define a model
const User = sequelize.define("User", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  age: {
    type: DataTypes.INTEGER,
  },
});

// Synchronize the model with the database
sequelize
  .sync()
  .then(() => {
    console.log("Database & tables created!");

    // Insert a new user
    return User.create({
      name: "John Doe",
      age: 30,
    });
  })
  .then((user) => {
    console.log("User created:", user.toJSON());

    // Fetch all users
    return User.findAll();
  })
  .then((users) => {
    console.log("All users:", JSON.stringify(users, null, 2));
  })
  .catch((err) => {
    console.error("Error:", err);
  })
  .finally(() => {
    // Close the database connection
    sequelize.close();
  });
