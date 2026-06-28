import { Annotation, StateGraph } from '@langchain/langgraph';
import { PrismaService } from '../../prisma/prisma.service';
import { EmbeddingsProvider } from '../providers/embeddings.provider';

const SearchState = Annotation.Root({
  query: Annotation<string>({ reducer: (_, v) => v }),
  listingType: Annotation<string | undefined>({ reducer: (_, v) => v }),
  limit: Annotation<number>({ reducer: (_, v) => v }),
  scoredIds: Annotation<string[]>({ reducer: (a, b) => b }),
  done: Annotation<boolean>({ reducer: (a, b) => b }),
});

export function createSearchGraph(
  prisma: PrismaService,
  embeddings: EmbeddingsProvider,
) {
  const embedAndSearch = async (state: typeof SearchState.State) => {
    const queryEmbedding = await embeddings.embedQuery(state.query);
    const where: any = { deletedAt: null };
    if (state.listingType) where.listingType = state.listingType;

    const all = await prisma.property.findMany({ where });
    const candidates = all
      .filter((p) => p.embedding)
      .map((p) => {
        try {
          return { id: p.id, embedding: JSON.parse(p.embedding!) as number[] };
        } catch {
          return { id: p.id, embedding: [] as number[] };
        }
      });

    const scored = embeddings.findSimilar(
      queryEmbedding,
      candidates,
      state.limit,
    );
    return { scoredIds: scored.map((s) => s.id) };
  };

  const markDone = () => ({ done: true });

  return new StateGraph(SearchState)
    .addNode('search', embedAndSearch)
    .addNode('finish', markDone)
    .addEdge('__start__', 'search')
    .addEdge('search', 'finish')
    .addEdge('finish', '__end__')
    .compile();
}
