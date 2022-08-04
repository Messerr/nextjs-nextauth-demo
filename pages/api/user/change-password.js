import { getSession } from "next-auth/react";
import { connectToDatabase } from "../../../lib/db";
import { hashPassword, verifyPassword } from "../../../lib/auth";

async function handler(req, res) {
  if (req.method !== "PATCH") {
    return;
  }

  const session = await getSession({ req: req });

  if (!session) {
    res.status(401).json({ message: "Not Authorized!" });
    return;
  }

  const userEmail = session.user.email;
  const oldPassword = req.body.oldPassword;
  const newPassword = req.body.newPassword;

  const client = await connectToDatabase();

  const usersColletion = client.db().collection("users");
  const user = await usersColletion.findOne({ email: userEmail });

  if (!user) {
    res.status(404).json({ message: "User not found!" });
    client.close();
    return;
  }

  const currentPassword = user.password;

  const passwordsAreEqual = await verifyPassword(oldPassword, currentPassword);

  if (!passwordsAreEqual) {
    res.status(403).json({ message: "Wrong password entered!" });
    client.close();
    return;
  }

  const hashedPassword = await hashPassword(newPassword);

  const result = await usersColletion.updateOne(
    { email: userEmail },
    { $set: { password: hashedPassword } }
  );

  client.close();
  res.status(200).json({ message: "Password Updated!" });
}

export default handler;
