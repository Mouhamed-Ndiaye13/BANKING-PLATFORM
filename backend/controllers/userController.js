// // controllers/userController.js
// import User from "../models/User.js";

// // GET /users/me
// export const me = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id).select("-password");
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: "Erreur serveur" });
//   }
// };

// // GET /users
// export const list = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // GET /users/:id
// export const get = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // PUT /users/:id
// export const update = async (req, res) => {
//   try {
//     const { name, prenom, email, password, telephone, dateDeNaissance } = req.body;

//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       prenom,
//       email,
//       telephone,
//       password: hashedPassword,
//       dateDeNaissance,
//     });

//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // DELETE /users/:id
// export const remove = async (req, res) => {
//   try {
//     const updatedUser = await User
//       .findByIdAndUpdate(req.params.id, req.body, { new: true })
//       .select("-password");

//     if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // DELETE (admin)
// export const removeAdmin = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "Utilisateur supprimé" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


import bcrypt from "bcrypt";
import User from "../models/User.js";

// ----- GET /users/me -----
export const me = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// ----- GET /users ----- 
export const list = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----- GET /users/:id -----
export const get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----- POST /users (admin) -----
export const createUser = async (req, res) => {
  try {
    const { name, prenom, email, password, telephone, dateDeNaissance } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      prenom,
      email,
      telephone,
      password: hashedPassword,
      dateDeNaissance,
    });

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----- PUT /users/:id (admin) -----
export const update = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select("-password");
    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----- DELETE /users/:id (admin) -----
export const removeAdmin = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----- PUT /users/update-profile -----
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.id, req.body, { new: true }).select("-password");
    res.json({
      message: "Profile updated",
      user: updatedUser
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// ----- PUT /users/update-password -----
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword) return res.status(400).json({ message: "Old and new password required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe mis à jour avec succès" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----- POST /users/upload-photo -----
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Aucune image téléchargée" });

    const imagePath = `/uploads/${req.file.filename}`;
    const updatedUser = await User.findByIdAndUpdate(req.user.id, { avatar: imagePath }, { new: true }).select("-password");

    res.json({
      message: "Avatar mis à jour",
      user: updatedUser
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
