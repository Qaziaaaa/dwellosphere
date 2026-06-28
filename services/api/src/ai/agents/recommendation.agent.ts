import { Annotation, StateGraph } from '@langchain/langgraph';
import { PrismaService } from '../../prisma/prisma.service';

const RecState = Annotation.Root({
  userId: Annotation<string>({ reducer: (_, v) => v }),
  limit: Annotation<number>({ reducer: (_, v) => v }),
  likedIds: Annotation<string[]>({ reducer: (a, b) => b }),
  scoredIds: Annotation<string[]>({ reducer: (a, b) => b }),
  done: Annotation<boolean>({ reducer: (a, b) => b }),
});

export function createRecommendationGraph(prisma: PrismaService) {
  const collectHistory = async (state: typeof RecState.State) => {
    const recent = await prisma.userInteraction.findMany({
      where: { userId: state.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
    });
    return { likedIds: recent.map((i) => i.propertyId) };
  };

  const scoreCandidates = async (state: typeof RecState.State) => {
    const interactions = await prisma.userInteraction.findMany({
      where: { userId: state.userId },
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: { property: true },
    });

    const likedFeatures = interactions.map((i) => extractSet(i.property));
    const excluded = new Set(interactions.map((i) => i.propertyId));

    const all = await prisma.property.findMany({
      where: { deletedAt: null, id: { notIn: Array.from(excluded) } },
    });

    const scored = all
      .map((p) => ({
        id: p.id,
        score:
          likedFeatures.length > 0
            ? likedFeatures.reduce(
                (sum, lf) => sum + jaccard(lf, extractSet(p)),
                0,
              ) / likedFeatures.length
            : 0,
      }))
      .sort((a, b) => b.score - a.score);

    return { scoredIds: scored.slice(0, state.limit).map((s) => s.id) };
  };

  const fetchResults = (state: typeof RecState.State) => {
    return { done: true, scoredIds: state.scoredIds };
  };

  return new StateGraph(RecState)
    .addNode('collect', collectHistory)
    .addNode('score', scoreCandidates)
    .addNode('fetch', fetchResults)
    .addEdge('__start__', 'collect')
    .addEdge('collect', 'score')
    .addEdge('score', 'fetch')
    .addEdge('fetch', '__end__')
    .compile();
}

function extractSet(property: any): Set<string> {
  const f = new Set<string>();
  f.add(property.listingType);
  f.add(property.city);
  f.add(property.state);
  f.add(`beds:${property.beds}`);
  f.add(`baths:${property.baths}`);
  f.add(
    property.sqft < 1000
      ? 'small'
      : property.sqft < 2000
        ? 'medium'
        : property.sqft < 3000
          ? 'large'
          : 'estate',
  );
  const amenities: string[] = JSON.parse(property.amenities || '[]');
  for (const a of amenities) f.add(a);
  return f;
}

function jaccard(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const item of a) if (b.has(item)) intersection++;
  const union = new Set([...a, ...b]).size;
  return union === 0 ? 0 : intersection / union;
}
