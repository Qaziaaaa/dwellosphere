import { Annotation, StateGraph } from '@langchain/langgraph';
import { PrismaService } from '../../prisma/prisma.service';

const PricingState = Annotation.Root({
  price: Annotation<number | undefined>({ reducer: (a, b) => b }),
  listingType: Annotation<string | undefined>({ reducer: (a, b) => b }),
  beds: Annotation<number | undefined>({ reducer: (a, b) => b }),
  baths: Annotation<number | undefined>({ reducer: (a, b) => b }),
  sqft: Annotation<number | undefined>({ reducer: (a, b) => b }),
  city: Annotation<string | undefined>({ reducer: (a, b) => b }),
  state: Annotation<string | undefined>({ reducer: (a, b) => b }),
  result: Annotation<any>({ reducer: (a, b) => b }),
  done: Annotation<boolean>({ reducer: (a, b) => b }),
});

export function createPricingGraph(prisma: PrismaService) {
  const findComparables = async (state: typeof PricingState.State) => {
    const where: any = { deletedAt: null };
    if (state.listingType) where.listingType = state.listingType;
    if (state.city) where.city = { contains: state.city };
    if (state.state) where.state = { contains: state.state };
    if (state.beds) where.beds = state.beds;
    if (state.baths) where.baths = state.baths;

    const comparable = await prisma.property.findMany({
      where,
      orderBy: { price: 'asc' },
    });
    return { result: comparable };
  };

  const computeAnalysis = (state: typeof PricingState.State) => {
    const comparable = state.result as any[];
    if (!comparable || comparable.length === 0) {
      return {
        result: {
          advice: 'Not enough comparable properties in this area.',
          comparableCount: 0,
        },
      };
    }

    const prices = comparable.map((p: any) => p.price);
    const avgPrice =
      prices.reduce((a: number, b: number) => a + b, 0) / prices.length;
    const pricePerSqft = comparable
      .filter((p: any) => p.sqft > 0)
      .map((p: any) => p.price / p.sqft);
    const avgPps =
      pricePerSqft.length > 0
        ? pricePerSqft.reduce((a: number, b: number) => a + b, 0) /
          pricePerSqft.length
        : 0;

    let advice: string;
    if (state.price) {
      const ratio = state.price / avgPrice;
      if (ratio < 0.8)
        advice = 'This property is priced below the market average.';
      else if (ratio > 1.2)
        advice = 'This property is priced above the market average.';
      else
        advice =
          'This property is priced competitively within the market range.';
    } else {
      advice = `Based on ${comparable.length} comparable properties, the estimated market price is $${Math.round(avgPrice).toLocaleString()}.`;
    }

    return {
      result: {
        advice,
        comparableCount: comparable.length,
        avgPrice,
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
        avgPricePerSqft: Math.round(avgPps),
        estimatedPrice: state.price ? undefined : Math.round(avgPrice),
      },
    };
  };

  return new StateGraph(PricingState)
    .addNode('find', findComparables)
    .addNode('analyze', computeAnalysis)
    .addNode('finish', () => ({ done: true }))
    .addEdge('__start__', 'find')
    .addEdge('find', 'analyze')
    .addEdge('analyze', 'finish')
    .addEdge('finish', '__end__')
    .compile();
}
