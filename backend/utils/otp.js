import bcrypt from "bcryptjs";

export const generateEmailOTP = async () => {
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const hash = await bcrypt.hash(code, 10);
  return { code, hash };
};
