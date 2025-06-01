import { db } from "../config/firebaseConfig.js";
import sendSMS from "../utils/sendSMS.js";
import admin from "firebase-admin";

const generateCode = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

export const createUser = async (req, res) => {
  try {
    const { name, email, phoneNumber } = req.body;

    const docRef = await db.collection("users").add({
      name,
      email,
      phoneNumber,
      createdAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, message: "User created!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createNewAccessCode = async (req, res) => {
  const { phoneNumber } = req.body;
  const code = generateCode();

  try {
    await db
      .collection("users")
      .doc(phoneNumber)
      .set({ accessCode: code }, { merge: true });
    await sendSMS(phoneNumber, `Your access code is ${code}`);
    res.json({ success: true, message: "Access code sent" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const validateAccessCode = async (req, res) => {
  const { phoneNumber, accessCode } = req.body;
  try {
    const doc = await db.collection("users").doc(phoneNumber).get();
    if (!doc.exists || doc.data().accessCode !== accessCode) {
      return res.status(401).json({ success: false, message: "Invalid code" });
    }
    await db.collection("users").doc(phoneNumber).update({ accessCode: "" });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const likeGithubUser = async (req, res) => {
  const { phone_number, github_user_id } = req.body;
  try {
    const userRef = db.collection("users").doc(phone_number);
    await userRef.set(
      {
        favorite_github_users:
          admin.firestore.FieldValue.arrayUnion(github_user_id),
      },
      { merge: true }
    );

    res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getUserProfile = async (req, res) => {
  const { phoneNumber } = req.query;
  try {
    const doc = await db.collection("users").doc(phoneNumber).get();
    const ids = doc.data()?.favorite_github_users || [];

    const axios = require("axios");
    const userPromises = ids.map((id) =>
      axios.get(`https://api.github.com/user/${id}`, {
        headers: { "User-Agent": "SkipliApp" },
      })
    );

    const profiles = await Promise.all(userPromises);
    res.json({
      phone: phoneNumber,
      favorite_github_users: profiles.map((p) => p.data),
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
