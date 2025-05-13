import express, { Express, Request, Response } from 'express';

const app: Express = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Asosiy yo'l (route)
app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript serveri muvaffaqiyatli ishga tushdi!');
});

// API namuna yo'li
app.get('/api/hello', (req: Request, res: Response) => {
  res.json({ message: 'Salom, dunyoi TypeScript!' });
});

// Serverni ishga tushirish
app.listen(port, () => {
  console.log(`⚡️[server]: Server http://localhost:${port} portida ishga tushirildi`);
});