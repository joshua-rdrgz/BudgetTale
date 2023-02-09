import express, { Request, Response } from 'express';

const app = express();

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    message: 'hello world, how are you doing?????????',
    status: 'success',
  });
});

export default app;
