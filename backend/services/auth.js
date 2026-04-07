import bcrypt from "bcrypt";

export const hashedPassword = (password) => bcrypt.hash(password, 10);

export const isValid = (password, hash) => bcrypt.compare(password, hash);
