// backend/routes/nitrogen_management_form.js
const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database");

// Define a route for handling nitrogen management form submissions
router.post("/cottonnitrogenmanagementsubmit", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract data from the request body and session
        const { applicationType, placement, date, amount, teamName, applied } =
          req.body;

        // Insert a new row without checking for duplicates
        const insertQuery =
          "INSERT INTO cotton_nitrogen_management_form (teamName, applicationType, placement, date, amount,applied) VALUES (?, ?, ?, ?, ?,?)";
        db.query(
          insertQuery,
          [teamName, applicationType, placement, date, amount, applied], // Updated parameter list
          (insertError, insertResult) => {
            if (insertError) {
              console.error(
                "Error inserting form data into the database:",
                insertError
              );
              res.status(500).json({ message: "Form submission failed" });
            } else {
              res.status(200).json({
                message: "Form submitted successfully",
              });
            }
          }
        );
      } catch (error) {
        console.error("Error handling form submission:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/cottonfetchNitrogenManagementData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the applicationType from the query parameters
        const { applicationType, teamName } = req.query;

        // Query the database based on the applicationType
        const query =
          "SELECT * FROM cotton_nitrogen_management_form WHERE applicationType = ? and teamName = ?";
        db.query(query, [applicationType, teamName], (error, results) => {
          if (error) {
            console.error("Error fetching data from the database:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
      } catch (error) {
        console.error("Error handling data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.get("/cottonfetchAllNitrogenManagementData", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the applicationType from the query parameters

        // Query the database based on the applicationType
        const query = "SELECT * FROM cotton_nitrogen_management_form";
        db.query(query, (error, results) => {
          if (error) {
            console.error("Error fetching data from the database:", error);
            res.status(500).json({ message: "Error fetching data" });
          } else {
            // Send the fetched data as a JSON response
            res.status(200).json(results);
          }
        });
      } catch (error) {
        console.error("Error handling data fetch:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.delete("/deletecottonnitrogenApplication/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Perform the database delete operation based on the appId
        const deleteQuery =
          "DELETE FROM cotton_nitrogen_management_form WHERE id = ?";
        db.query(deleteQuery, [appId], (deleteError, deleteResult) => {
          if (deleteError) {
            console.error("Error deleting the application:", deleteError);
            res.status(500).json({ message: "Error deleting the application" });
          } else {
            res
              .status(200)
              .json({ message: "Application deleted successfully" });
          }
        });
      } catch (error) {
        console.error("Error handling application deletion:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

router.post("/updateCottonNitrogenApplied/:appId", (req, res) => {
  setupDatabase()
    .then((db) => {
      try {
        // Extract the application ID from the request parameters
        const appId = req.params.appId;

        // Define the new value for the "applied" field (e.g., "yes")
        const newAppliedValue = "yes";

        // Perform the database update operation
        const updateQuery =
          "UPDATE cotton_nitrogen_management_form SET applied = ? WHERE id = ?";
        db.query(
          updateQuery,
          [newAppliedValue, appId],
          (updateError, updateResult) => {
            if (updateError) {
              console.error("Error updating the applied field:", updateError);
              res
                .status(500)
                .json({ message: "Error updating the applied field" });
            } else {
              res
                .status(200)
                .json({ message: "Applied field updated successfully" });
            }
          }
        );
      } catch (error) {
        console.error("Error handling update of the applied field:", error);
        res.status(500).json({ message: "Internal server error" });
      }
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

// Export the router for use in your main Express app
module.exports = router;
