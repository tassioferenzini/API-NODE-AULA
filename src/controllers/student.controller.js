import createError from "http-errors";
import { Student } from "../models/student.model.js";
import { createStudentSchema, updateStudentSchema } from "../validators/student.schema.js";

export async function createStudent(req, res, next) {
  try {
    const data = await createStudentSchema.validateAsync(req.body, { abortEarly: false });
    const exists = await Student.exists({
      $or: [{ email: data.email }, { matricula: data.matricula }]
    });
    if (exists) throw createError(409, "Email ou matrícula já cadastrados");

    const student = await Student.create(data);
    res.status(201).json(student);
  } catch (err) { next(convertJoi(err)); }
}

export async function listStudents(req, res, next) {
  try {
    const {
      page = 1,
      limit = 10,
      sort = "createdAt:desc",
      search = "",
      ativo
    } = req.query;

    const [sortField, sortDir] = String(sort).split(":");
    const filter = {};
    if (search) {
      filter.$or = [
        { nome: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { matricula: { $regex: search, $options: "i" } },
        { curso: { $regex: search, $options: "i" } }
      ];
    }
    if (ativo !== undefined) {
      filter.ativo = ["true", "1", "yes"].includes(String(ativo).toLowerCase());
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [items, total] = await Promise.all([
      Student.find(filter)
        .sort({ [sortField]: sortDir === "asc" ? 1 : -1 })
        .skip(skip)
        .limit(Number(limit)),
      Student.countDocuments(filter)
    ]);

    res.json({
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
      items
    });
  } catch (err) { next(err); }
}

export async function getStudent(req, res, next) {
  try {
    const { id } = req.params;
    const student = await Student.findById(id);
    if (!student) throw createError(404, "Aluno não encontrado");
    res.json(student);
  } catch (err) { next(err); }
}

export async function updateStudent(req, res, next) {
  try {
    const { id } = req.params;
    const data = await updateStudentSchema.validateAsync(req.body, { abortEarly: false });

    if (data.email || data.matricula) {
      const conflict = await Student.exists({
        _id: { $ne: id },
        $or: [
          data.email ? { email: data.email } : null,
          data.matricula ? { matricula: data.matricula } : null
        ].filter(Boolean)
      });
      if (conflict) throw createError(409, "Email ou matrícula já em uso");
    }

    const updated = await Student.findByIdAndUpdate(id, data, { new: true, runValidators: true });
    if (!updated) throw createError(404, "Aluno não encontrado");
    res.json(updated);
  } catch (err) { next(convertJoi(err)); }
}

export async function deleteStudent(req, res, next) {
  try {
    const { id } = req.params;
    const removed = await Student.findByIdAndDelete(id);
    if (!removed) throw createError(404, "Aluno não encontrado");
    res.status(204).send();
  } catch (err) { next(err); }
}

function convertJoi(err) {
  if (err?.isJoi) {
    return createError(400, {
      message: "Erro de validação",
      details: err.details.map(d => d.message)
    });
  }
  return err;
}
