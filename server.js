const express = require("express");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname)); // Serve HTML and JS files

// ✅ Save user info to a fixed file: create_user.json
app.post("/save-user", (req, res) => {
  const user = req.body;
  const dir = path.join(__dirname, "User_accountinfo");

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  const filePath = path.join(dir, "create_user.json"); // <== Fixed name

  fs.writeFile(filePath, JSON.stringify(user, null, 2), (err) => {
    if (err) {
      console.error("Error saving JSON file:", err);
      return res.status(500).send("Failed to save user info.");
    }
    res.send("The account has been created.");
  });
});

// ✅ Multer config for uploading profile images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, "Uploaded_Images");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}${ext}`;
    cb(null, name);
  }
});

const upload = multer({ storage: imageStorage });

// ✅ Endpoint to update profile image in the JSON file
app.post("/update-profile-image", upload.single("profileImage"), (req, res) => {
  const jsonFile = req.body.jsonFile;
  const jsonPath = path.join(__dirname, "User_accountinfo", jsonFile);

  if (!fs.existsSync(jsonPath)) {
    return res.status(404).send("User data not found.");
  }

  const userData = JSON.parse(fs.readFileSync(jsonPath));
  userData.profileImage = path.join("Uploaded_Images", req.file.filename);

  fs.writeFileSync(jsonPath, JSON.stringify(userData, null, 2));
  res.send("Profile image updated successfully.");
});

// ✅ Start the server on your local network IP
app.listen(PORT, '192.168.185.243', () => {
  console.log(`Server running at http://192.168.185.243:${PORT}`);
});
