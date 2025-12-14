const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Callback après authentification Google
exports.googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.FRONTEND_URL}/login?error=google_auth_failed`);
    }
    
    // Générer JWT
    const token = jwt.sign(
      {
        id: req.user._id,
        email: req.user.email,
        name: req.user.name,
        provider: 'google'
      },
      process.env.JWT_SECRET || 'your-jwt-secret',
      { expiresIn: '24h' }
    );
    
    // Redirection vers le frontend avec le token
    const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/callback?token=${token}&user=${encodeURIComponent(JSON.stringify({
      id: req.user._id,
      email: req.user.email,
      name: req.user.name,
      avatar: req.user.avatar
    }))}`;
    
    res.redirect(redirectUrl);
    
  } catch (error) {
    console.error('❌ Erreur Google Callback:', error);
    res.redirect(`${process.env.FRONTEND_URL}/login?error=server_error`);
  }
};

// Obtenir l'URL d'authentification Google
exports.getGoogleAuthUrl = (req, res) => {
  res.json({
    success: true,
    url: `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/auth/google`
  });
};

// Vérifier la configuration Google
exports.getGoogleConfig = (req, res) => {
  res.json({
    success: true,
    googleEnabled: !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
    clientId: process.env.GOOGLE_CLIENT_ID ? 'configured' : 'not_configured',
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
  });
};