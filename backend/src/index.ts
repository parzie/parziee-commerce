import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { productsRouter } from './routes/products';
import { healthRouter } from './routes/health';

const app = express();
const PORT = process.env['PORT'] ?? 3000;

app.use(cors({ origin: 'http://localhost:4200' }));
app.use(express.json());

app.use('/api/health', healthRouter);
app.use('/api/products', productsRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

export default app;
