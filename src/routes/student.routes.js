import { Router } from "express";
import {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudent
} from "../controllers/student.controller.js";

const router = Router();

router.get("/", listStudents);
router.post("/", createStudent);
router.get("/:id", getStudent);
router.patch("/:id", updateStudent);
router.put("/:id", updateStudent);
router.delete("/:id", deleteStudent);

export default router;
