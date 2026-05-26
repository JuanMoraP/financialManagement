import { NextFunction, Request, Response } from 'express';

const colors = {
  GET: '\x1b[32m', // verde
  POST: '\x1b[34m', // azul
  PUT: '\x1b[33m', // amarillo
  DELETE: '\x1b[31m', // rojo
  PATCH: '\x1b[35m', // magenta
  reset: '\x1b[0m',
};

export function LoggerGlobal(req: Request, res: Response, next: NextFunction) {
  const color = colors[req.method as keyof typeof colors] ?? '\x1b[37m';
  const timestamp = new Date().toLocaleTimeString();
  console.log(
    `\x1b[90m${timestamp}\x1b[0m ${color}[${req.method}]\x1b[0m ${req.url}`,
  );
  next();
}
