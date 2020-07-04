import { Request, Response } from 'express';

const notFound = (req: Request, res: Response) => {
  res.status(404).end('ANWeb create by A.N for www.anhn.me');
};

export default notFound;
