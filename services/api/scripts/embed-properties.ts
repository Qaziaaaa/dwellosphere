import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function simpleEmbed(text: string): number[] {
  const words = text.toLowerCase().split(/\s+/);
  const vec = new Array(384).fill(0);
  for (const w of words) {
    let hash = 0;
    for (let i = 0; i < w.length; i++) {
      const char = w.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0;
    }
    vec[Math.abs(hash) % 384] += 1.0 / words.length;
  }
  return vec;
}

async function main() {
  const properties = await prisma.property.findMany();
  for (const p of properties) {
    const text = [p.title, p.description, p.city, p.state].join(' ');
    const embedding = simpleEmbed(text);
    await prisma.property.update({
      where: { id: p.id },
      data: { embedding: JSON.stringify(embedding) },
    });
    console.log(`  ✅ ${p.title} — embedding generated`);
  }
  console.log(`\nDone! ${properties.length} properties updated.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
