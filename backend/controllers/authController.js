const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const generateToken = require('../utils/generateToken');

// Register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const existing = await User.findOne({ email });
    if(existing) return res.status(400).json({ message: 'Email déjà utilisé' });

    const user = new User({ name, email, password });

    const confirmToken = crypto.randomBytes(32).toString('hex');
    user.confirmToken = crypto.createHash('sha256').update(confirmToken).digest('hex');
    user.confirmExpires = Date.now() + 24*60*60*1000; // 24h

    await user.save();

    const confirmUrl = `${process.env.CLIENT_URL}/confirm-email/${confirmToken}`;
    const html = `<p>Bonjour ${name || ''}, clique ici pour confirmer ton email :</p>
                  <a href="${confirmUrl}">${confirmUrl}</a>`;

    await sendEmail({ to: email, subject: 'Confirme ton email', html });

    res.status(201).json({ message: 'Inscription réussie, vérifie ton email' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Confirm email
exports.confirmEmail = async (req, res) => {
  try {
    const token = req.params.token;
    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ confirmToken: hashed, confirmExpires: { $gt: Date.now() } });
    if(!user) return res.status(400).json({ message: 'Token invalide ou expiré' });

    user.isVerified = true;
    user.confirmToken = undefined;
    user.confirmExpires = undefined;
    await user.save();

    res.json({ message: 'Email confirmé avec succès' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password) return res.status(400).json({ message: 'Email et mot de passe requis' });

    const user = await User.findOne({ email });
    if(!user) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    const isMatch = await user.matchPassword(password);
    if(!isMatch) return res.status(401).json({ message: 'Email ou mot de passe incorrect' });

    if(!user.isVerified) return res.status(403).json({ message: 'Confirme ton email avant de te connecter' });

    const token = generateToken(user._id);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Forgot password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if(!email) return res.status(400).json({ message: 'Email requis' });

    const user = await User.findOne({ email });
    if(!user) return res.status(200).json({ message: 'Si l\'email existe, un lien a été envoyé' });

    const resetToken = crypto.randomBytes(32).toString('hex');
    user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    user.resetPasswordExpires = Date.now() + 60*60*1000; // 1h
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    const html = `<p>Pour réinitialiser ton mot de passe, clique ici :</p>
                  <a href="${resetUrl}">${resetUrl}</a>`;
    await sendEmail({ to: email, subject: 'Réinitialisation mot de passe', html });

    res.json({ message: 'Si l\'email existe, un lien a été envoyé' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    const token = req.params.token;
    const { password } = req.body;
    if(!password) return res.status(400).json({ message: 'Nouveau mot de passe requis' });

    const hashed = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({ resetPasswordToken: hashed, resetPasswordExpires: { $gt: Date.now() } });
    if(!user) return res.status(400).json({ message: 'Token invalide ou expiré' });

    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: 'Mot de passe réinitialisé avec succès' });
  } catch(err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};
