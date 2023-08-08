const mongoose = require("mongoose");
const { Schema } = mongoose;
const messageSchema = new Schema(
  {
    sender: { type: Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: Schema.Types.ObjectId, ref: "Chat" },
  },
  {
    timestamps: true,
  }
);
messageSchema.virtual("id").get(function () {
  return this._id;
});

messageSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    delete ret._id;
  },
});
exports.Message = mongoose.model("Message", messageSchema);
