import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    prenom: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    telephone: { type: String, required: true },
    dateDeNaissance: { type: Date, required: true },
    password: { type: String, required: true },

    avatar: {
      type: String,
      default: null,
    },

    resetToken: { type: String },
    resetTokenExpire: { type: Date },
  },
  { timestamps: true }
);

UserSchema.methods.comparePassword = async function (enteredPassword) {
  if (!enteredPassword || !this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

// NOUVELLE MÉTHODE : Vérifier si c'est un utilisateur Google
UserSchema.methods.isGoogleAccount = function() {
  return !!this.googleId || this.isGoogleUser;
};

// NOUVELLE MÉTHODE : Lier un compte Google
UserSchema.methods.linkGoogleAccount = async function(googleData) {
  this.googleId = googleData.googleId;
  this.googleAccessToken = googleData.accessToken;
  this.isGoogleUser = true;
  this.authMethod = this.password ? 'both' : 'google';
  
  if (googleData.avatar && !this.avatar.startsWith('/uploads/')) {
    this.avatar = googleData.avatar;
    this.googleAvatar = googleData.avatar;
  }
  
  return this.save();
};

// NOUVELLE MÉTHODE : Créer un utilisateur Google
UserSchema.statics.createGoogleUser = function(profile) {
  return this.create({
    googleId: profile.id || profile.sub,
    email: profile.email,
    name: profile.family_name || profile.name?.split(' ')[0] || 'Utilisateur',
    prenom: profile.given_name || profile.name?.split(' ')[1] || '',
    telephone: 'Non fourni',
    dateDeNaissance: new Date('1990-01-01'),
    password: undefined,
    isGoogleUser: true,
    authMethod: 'google',
    avatar: profile.picture || null,
    googleAvatar: profile.picture
  });
};

// NOUVELLE MÉTHODE : Trouver ou créer un utilisateur Google
UserSchema.statics.findOrCreateGoogleUser = async function(profile) {
  // Chercher par googleId
  let user = await this.findOne({ googleId: profile.sub || profile.id });
  
  if (user) {
    console.log(' Utilisateur Google existant trouvé');
    return user;
  }
  
  // Chercher par email
  const email = profile.email;
  user = await this.findOne({ email: email });
  
  if (user) {
    // Lier Google au compte existant
    console.log(' Liaison du compte Google à l\'utilisateur existant');
    return user.linkGoogleAccount({
      googleId: profile.sub || profile.id,
      accessToken: profile.accessToken,
      avatar: profile.picture
    });
  }
  
  // Créer un nouvel utilisateur
  console.log(' Création d\'un nouvel utilisateur Google');
  return this.createGoogleUser(profile);
};

export default mongoose.model("User", UserSchema);