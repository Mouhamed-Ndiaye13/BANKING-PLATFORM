// import express from "express";
// import { list, get, update, remove, create } from "../controllers/userController.js";
// import auth from "../middleware/auth.js";
// import isAdmin from "../middleware/isAdmin.js";

// const router = express.Router();


// router.get("/", auth, isAdmin, list);
// router.get("/:id", auth, isAdmin, get);
// router.put("/:id", auth, isAdmin, update);
// router.delete("/:id", auth, isAdmin, remove);
// router.post("/", auth, isAdmin, create);

// export default router;
// const userController = require("../controllers/userController");
// const auth = require("../middleware/auth");
// const upload = require("../middleware/uploadMiddleware");

// //  Créer un utilisateur (POST /api/users)
// router.post("/", userController.createUser);

// // Modifier profil (PUT /api/users/update-profile)
// router.put("/update-profile", auth, userController.updateProfile);

// // Modifier mot de passe (PUT /api/users/update-password)
// router.put("/update-password", auth, userController.updatePassword);

// // Ajouter image (POST /api/users/upload-photo)
// router.post("/upload-photo", auth, upload.single("photo"), userController.updateAvatar);

// module.exports = router;
import express from "express";
import auth from "../middleware/auth.js";
import isAdmin from "../middleware/isAdmin.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  list,
  get,
  update,
  remove,
  create,
  updateProfile,
  updatePassword,
  updateAvatar,
} from "../controllers/userController.js";

const router = express.Router();

// Admin gestion
router.get("/", auth, isAdmin, list);
router.get("/:id", auth, isAdmin, get);
router.post("/", auth, isAdmin, create);
router.put("/:id", auth, isAdmin, update);
router.delete("/:id", auth, isAdmin, remove);

// User gestion
router.put("/profile", auth, updateProfile);
router.put("/password", auth, updatePassword);
router.post("/avatar", auth, upload.single("photo"), updateAvatar);

export default router;
