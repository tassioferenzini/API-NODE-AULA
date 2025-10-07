import createError from "http-errors";

export function notFound(_req, _res, next) {
  next(createError(404, "Rota não encontrada"));
}

export function errorHandler(err, _req, res, _next) {
  const status = err.status || 500;
  const payload = {
    status,
    message: err.message || "Erro interno",
  };
  if (process.env.NODE_ENV !== "production" && err.stack) {
    payload.stack = err.stack;
  }
  res.status(status).json(payload);
}
