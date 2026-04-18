import { Schema, model, models } from "mongoose";
import dbJson from "@/config/db.json" with { type: "json" };

/** Same matice ids and grid dimensions as db.json, all cells empty (" "). */
function defaultUserDataFromDb() {
  const template = dbJson.matice ?? [];
  return {
    matice: template.map((item) => ({
      id: String(item.id),
      data: (item.data ?? []).map((row) =>
        (row ?? []).map(() => " "),
      ),
    })),
  };
}

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: [true, "Email already exists"],
      required: [true, "Email is required"],
    },
    username: {
      type: String,
      unique: [true, "Username already exists"],
      required: [true, "Username is required"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      select: false,
    },
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comments",
      },
    ],
    data: {
      type: Schema.Types.Mixed,
      default: () => defaultUserDataFromDb(),
    },
  },
  { timestamps: true },
);

const User = models.User || model("User", UserSchema);
export default User;
