import { Router } from 'express';
import type { Request, Response } from 'express';
import { eq, ilike, gte, lte, and, sql } from 'drizzle-orm';
import type { SQL } from 'drizzle-orm';
import { db } from '../db/client';
import { products } from '../db/schema';
import type { CreateProductDto, UpdateProductDto } from '../../../shared/src/index';

export const productsRouter = Router();

productsRouter.get('/', async (req: Request, res: Response) => {
  const {
    category,
    condition,
    minPrice,
    maxPrice,
    search,
    sold,
    page = '1',
    limit = '20',
  } = req.query as Record<string, string>;

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10)));
  const offset = (pageNum - 1) * limitNum;

  const conditions: SQL[] = [];
  if (category) conditions.push(eq(products.category, category as any));
  if (condition) conditions.push(eq(products.condition, condition as any));
  if (minPrice) conditions.push(gte(products.price, parseInt(minPrice, 10)));
  if (maxPrice) conditions.push(lte(products.price, parseInt(maxPrice, 10)));
  if (search) conditions.push(ilike(products.title, `%${search}%`));
  if (sold !== undefined) conditions.push(eq(products.sold, sold === 'true'));

  const where = conditions.length > 0 ? and(...conditions) : undefined;

  const [rows, countRows] = await Promise.all([
    db.select().from(products).where(where).limit(limitNum).offset(offset),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(products)
      .where(where),
  ]);

  const total = countRows[0]?.count ?? 0;

  res.json({
    data: rows,
    total,
    page: pageNum,
    limit: limitNum,
    totalPages: Math.ceil(total / limitNum),
  });
});

productsRouter.get('/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, id));

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({ data: product });
});

productsRouter.post('/', async (req: Request, res: Response) => {
  const dto = req.body as CreateProductDto;
  const [product] = await db
    .insert(products)
    .values({ ...dto, sellerId: 'owner', sold: false })
    .returning();
  res.status(201).json({ data: product });
});

productsRouter.patch('/:id', async (req: Request, res: Response) => {
  const dto = req.body as UpdateProductDto;
  const id = req.params['id'] as string;
  const [product] = await db
    .update(products)
    .set({ ...dto, updatedAt: new Date() })
    .where(eq(products.id, id))
    .returning();

  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.json({ data: product });
});

productsRouter.delete('/:id', async (req: Request, res: Response) => {
  const id = req.params['id'] as string;
  const result = await db
    .delete(products)
    .where(eq(products.id, id))
    .returning();

  if (result.length === 0) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }

  res.status(204).send();
});
