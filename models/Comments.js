import { Schema, model, models } from "mongoose";
const CommentsSchema = new Schema(
  {
    property: {
      type: Schema.Types.ObjectId,
      ref: "Property",
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    body: String,
  },
  { timestamps: true },
);

const Comments = models.Comments || model("Comments", CommentsSchema);
export default Comments;
