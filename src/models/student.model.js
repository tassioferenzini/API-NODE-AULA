import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema(
  {
    nome: { type: String, required: true, trim: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },
    matricula: { type: String, required: true, unique: true, trim: true },
    curso: { type: String, required: true, trim: true },
    dataNascimento: { type: Date, required: true },
    ativo: { type: Boolean, default: true }
  },
  { timestamps: true }
);

StudentSchema.index({ nome: "text", email: "text" });

export const Student = mongoose.model("Student", StudentSchema);
