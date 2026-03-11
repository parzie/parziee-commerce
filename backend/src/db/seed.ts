import 'dotenv/config';
import { db } from './client';
import { users, products } from './schema';

async function seed() {
  console.log('Seeding database...');

  const [seller] = await db
    .insert(users)
    .values({
      email: 'seller@parzie.com',
      passwordHash: 'mock-hash',
      name: 'Parzie Seller',
      role: 'seller',
    })
    .returning();

  await db.insert(products).values([
    {
      title: "Vintage Levi's 501 Jeans",
      description:
        'Classic raw denim, barely worn. Size 32×32. No fading, original button fly.',
      price: 4500, // $45.00
      images: ['https://placehold.co/600x800/c0622b/faf9f7?text=Jeans'],
      category: 'clothing',
      condition: 'like-new',
      sold: false,
      sellerId: seller.id,
    },
    {
      title: 'Sony WH-1000XM4 Headphones',
      description:
        'Industry-leading noise cancellation. Original box, all accessories included. Excellent condition.',
      price: 18000, // $180.00
      images: ['https://placehold.co/600x800/1a1714/faf9f7?text=Headphones'],
      category: 'electronics',
      condition: 'good',
      sold: false,
      sellerId: seller.id,
    },
    {
      title: 'The Timeless Way of Building',
      description:
        'Christopher Alexander. Hardcover first edition. Minor shelf wear on spine, pages clean.',
      price: 1200, // $12.00
      images: ['https://placehold.co/600x800/4a7c59/faf9f7?text=Book'],
      category: 'books',
      condition: 'good',
      sold: false,
      sellerId: seller.id,
    },
    {
      title: 'Herman Miller Aeron Chair (Size B)',
      description:
        'PostureFit SL, fully adjustable arms, graphite. Bought 2021, lightly used in home office.',
      price: 65000, // $650.00
      images: ['https://placehold.co/600x800/2d4a8a/faf9f7?text=Chair'],
      category: 'furniture',
      condition: 'like-new',
      sold: false,
      sellerId: seller.id,
    },
    {
      title: 'Patagonia Nano Puff Jacket — Medium',
      description:
        'PrimaLoft Gold insulation. Forge Grey, size M. No tears, zippers smooth.',
      price: 8000, // $80.00
      images: ['https://placehold.co/600x800/7a6e5e/faf9f7?text=Jacket'],
      category: 'clothing',
      condition: 'good',
      sold: false,
      sellerId: seller.id,
    },
    {
      title: 'Kindle Paperwhite (11th Gen)',
      description:
        '8GB, waterproof, adjustable warm light. Includes original USB-C cable.',
      price: 9000, // $90.00
      images: ['https://placehold.co/600x800/c0622b/faf9f7?text=Kindle'],
      category: 'electronics',
      condition: 'like-new',
      sold: false,
      sellerId: seller.id,
    },
  ]);

  console.log('Seed complete — 6 products inserted.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});
