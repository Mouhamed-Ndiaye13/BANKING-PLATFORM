// import User from "../models/User.js";
// import bcrypt from "bcrypt";

// // ================================
// //      GET ALL USERS
// // ================================
// export const list = async (req, res) => {
//   try {
//     const users = await User.find().select("-password");
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================================
// //      GET USER BY ID
// // ================================
// export const get = async (req, res) => {
//   try {
//     const user = await User.findById(req.params.id).select("-password");
//     if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    
//     res.json(user);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================================
// //      CREATE USER
// // ================================
// export const create = async (req, res) => {
//   try {
//     const { name, prenom, email, password, telephone, dateDeNaissance } = req.body;

//     // Vérifier si l'utilisateur existe déjà
//     const exists = await User.findOne({ email });
//     if (exists) return res.status(400).json({ message: "Email déjà utilisé" });

//     const hashedPassword = await bcrypt.hash(password, 10);

//     const user = await User.create({
//       name,
//       prenom,
//       email,
//       telephone,
//       dateDeNaissance,
//       password: hashedPassword
//     });

//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // ================================
// //      UPDATE USER (admin)
// // ================================
// export const update = async (req, res) => {
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

// // ================================
// //      DELETE USER
// // ================================
// export const remove = async (req, res) => {
//   try {
//     await User.findByIdAndDelete(req.params.id);
//     res.json({ message: "Utilisateur supprimé" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================================
// //      UPDATE PROFILE (user)
// // ================================
// export const updateProfile = async (req, res) => {
//   try {
//     const userId = req.user.id; // Depuis middleware JWT
    
//     const updatedUser = await User
//       .findByIdAndUpdate(userId, req.body, { new: true })
//       .select("-password");

//     res.json(updatedUser);
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// // ================================
// //      UPDATE PASSWORD
// // ================================
// export const updatePassword = async (req, res) => {
//   try {
//     const { oldPassword, newPassword } = req.body;

//     const user = await User.findById(req.user.id);
//     if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

//     const isMatch = await bcrypt.compare(oldPassword, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

//     user.password = await bcrypt.hash(newPassword, 10);
//     await user.save();

//     res.json({ message: "Mot de passe mis à jour avec succès" });

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// // ================================
// //      UPDATE AVATAR (upload)
// // ================================
// export const updateAvatar = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     if (!req.file) return res.status(400).json({ message: "Aucune image téléchargée" });

//     const imagePath = `/uploads/${req.file.filename}`;

//     const updatedUser = await User
//       .findByIdAndUpdate(userId, { avatar: imagePath }, { new: true })
//       .select("-password");

//     res.json(updatedUser);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
import User from "../models/User.js";
import bcrypt from "bcryptjs";

// GET all users (admin)
export const list = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET by id (admin)
export const get = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// CREATE user (admin)
export const create = async (req, res) => {
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

// UPDATE user (admin)
export const update = async (req, res) => {
  try {
    const updatedUser = await User
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .select("-password");

    if (!updatedUser) return res.status(404).json({ message: "Utilisateur non trouvé" });

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE (admin)
export const remove = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Utilisateur supprimé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update own profile (user)
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await User
      .findByIdAndUpdate(req.user.id, req.body, { new: true })
      .select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update own password (user)
export const updatePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) return res.status(400).json({ message: "Ancien mot de passe incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ message: "Mot de passe changé" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Upload avatar (user)
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Image obligatoire" });

    const updatedUser = await User
      .findByIdAndUpdate(req.user.id, { avatar: `/uploads/${req.file.filename}` }, { new: true })
      .select("-password");

    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
