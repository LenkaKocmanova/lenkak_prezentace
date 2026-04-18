"use server";

import bcrypt from "bcrypt";
import connectDB from "@/config/database";
import User from "../../models/User";

const SALT_ROUNDS = 10;

export async function registerUser(prevState, formData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const passwordConfirm = String(formData.get("passwordConfirm") ?? "");

  if (!email || !username || !password) {
    return { ok: false, message: "Vyplňte prosím všechna povinná pole." };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, message: "Zadejte platnou e-mailovou adresu." };
  }

  if (username.length < 2) {
    return { ok: false, message: "Uživatelské jméno musí mít alespoň 2 znaky." };
  }

  if (password.length < 8) {
    return { ok: false, message: "Heslo musí mít alespoň 8 znaků." };
  }

  if (password !== passwordConfirm) {
    return { ok: false, message: "Hesla se neshodují." };
  }

  try {
    await connectDB();
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    await User.create({
      email,
      username,
      password: hash,
    });
    return { ok: true, message: "" };
  } catch (err) {
    if (err.code === 11000) {
      return {
        ok: false,
        message:
          "Tento e-mail nebo uživatelské jméno je již zaregistrované.",
      };
    }
    console.error("registerUser:", err.message);
    return {
      ok: false,
      message: "Registrace se nepovedla. Zkuste to prosím znovu.",
    };
  }
}
