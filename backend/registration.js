const express = require("express");
const router = express.Router();
const { setupDatabase } = require("./database"); // Import the setupDatabase function
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "saduvishesha123@gmail.com", // Replace with your email
    pass: "oaqd javu lnna brhz", // Replace with your email password or app password
  },
});

// Registration API
router.post("/register", async (req, res) => {
  const formData = req.body;
  const cropType = formData.cropType;

  setupDatabase()
    .then((db) => {
      // Define the SQL statements and values based on the crop type
      let registrationSql, teamMembersSql;
      let registrationValues, teamMembersValues;

      if (cropType === "corn") {
        // If cropType is 'corn', insert into 'corn_registration_data' and 'corn_team_members' tables
        registrationSql = `
            INSERT INTO corn_registration_data (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
        teamMembersSql = `
            INSERT INTO corn_team_members (teamId, name, email)
            VALUES (?, ?, ?)
          `;
      } else if (cropType === "cotton") {
        // If cropType is 'cotton', insert into 'cotton_registration_data' and 'cotton_team_members' tables
        registrationSql = `
            INSERT INTO cotton_registration_data (teamName, cropType, password, captainFirstName, captainLastName, address1, address2, city, state, zipCode, country, email, phone)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          `;
        teamMembersSql = `
            INSERT INTO cotton_team_members (teamId, name, email)
            VALUES (?, ?, ?)
          `;
      } else {
        // Handle unsupported crop types here, if necessary
        res.status(400).json({ message: "Unsupported crop type" });
        return;
      }

      // Values for the registration data insertion
      registrationValues = [
        formData.teamName,
        formData.cropType,
        formData.password,
        formData.captainFirstName,
        formData.captainLastName,
        formData.address1,
        formData.address2,
        formData.city,
        formData.state,
        formData.zipCode,
        formData.country,
        formData.email,
        formData.phone,
      ];

      // Insert registration data into the respective registration table
      db.query(registrationSql, registrationValues, (err, result) => {
        if (err) {
          console.error("Error inserting registration data: " + err.message);
          res.status(500).json({ message: "Registration failed" });
        } else {
          const teamId = result.insertId;

          // Insert team members into the respective team members table
          formData.teamMembers.forEach((member) => {
            teamMembersValues = [teamId, member.name, member.email];

            db.query(teamMembersSql, teamMembersValues, (err) => {
              if (err) {
                console.error("Error inserting team member: " + err.message);
              }
            });
          });
          let emailContent = `You have been successfully registered .\nUsername && Team name: ${formData.teamName}\n`;
          emailContent += `Crop: ${formData.cropType}\n`; // Do not send the actual password
          emailContent += `Email: ${formData.email}\n`;
          emailContent += `Password: ${formData.password}\n`;

          const mailOptions = {
            from: "saduvishesha123@gmail.com",
            to: formData.email,
            subject: "Admin Registration Successful",
            text: emailContent,
          };

          try {
            const info = transporter.sendMail(mailOptions);
            console.log("Email sent: " + info.response);
          } catch (error) {
            console.error("Email sending error: ", error);
          }

          res.status(201).json({ message: "Registration successful" });
        }
      });
    })
    .catch((err) => {
      console.error("Database setup error: " + err.message);
      res.status(500).json({ message: "Database setup error" });
    });
});

module.exports = router;
