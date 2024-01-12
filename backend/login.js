const express = require("express");
const session = require("express-session"); // Import the express-session middleware
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function

// Login API
router.post("/login", (req, res) => {
  //   const { username, password, cropType } = req.body;
  const username = req.body.username;
  const password = req.body.password;
  const cropType = req.body.cropType;

  // Perform authentication logic here (verify username and password)
  // You can query the appropriate table based on cropType

  setupDatabase()
    .then((db) => {
      // Define the SQL statement based on the crop type
      let loginSql;
      let loginValues;

      if (cropType === "corn") {
        // If cropType is 'corn', query 'corn_registration_data' table
        loginSql = `
          SELECT * FROM corn_registration_data WHERE teamName = ? AND password = ?
        `;
        loginValues = [username, password];
      } else if (cropType === "cotton") {
        // If cropType is 'cotton', query 'cotton_registration_data' table
        loginSql = `
          SELECT * FROM cotton_registration_data WHERE teamName = ? AND password = ?
        `;
        loginValues = [username, password];
      } else {
        // Handle unsupported crop types here, if necessary
        res.status(400).json({ message: "Unsupported crop type" });
        return;
      }

      // Query the database to verify the login credentials
      db.query(loginSql, loginValues, (err, result) => {
        if (err) {
          console.error("Error during login: " + err.message);
          res.status(500).json({ message: "Login failed" });
        } else if (result.length === 1) {
          // Check if the user object exists and has the expected properties
          const user = result[0];
          req.session.username = username;
          req.session.cropType = cropType;
          if (user) {
            res.status(200).json({ message: "Login successful", user });
          } else {
            console.error(
              "User object is missing or doesn't have a 'teamName' property."
            );
            res.status(500).json({ message: "Login failed" });
          }
        } else {
          // Login failed (invalid credentials)
          res
            .status(401)
            .json({ message: "Login failed. Invalid credentials." });
        }
      });
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// ... Other routes ...

module.exports = router;
