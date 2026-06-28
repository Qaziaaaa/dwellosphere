import { Annotation, StateGraph } from '@langchain/langgraph';
import { LLMProvider } from '../providers/llm.provider';

const ListingState = Annotation.Root({
  title: Annotation<string>({ reducer: (_, v) => v }),
  propertyType: Annotation<string>({ reducer: (_, v) => v }),
  beds: Annotation<number>({ reducer: (_, v) => v }),
  baths: Annotation<number>({ reducer: (_, v) => v }),
  sqft: Annotation<number>({ reducer: (_, v) => v }),
  yearBuilt: Annotation<number>({ reducer: (_, v) => v }),
  city: Annotation<string>({ reducer: (_, v) => v }),
  state: Annotation<string>({ reducer: (_, v) => v }),
  amenities: Annotation<string[]>({ reducer: (a, b) => b }),
  description: Annotation<string>({ reducer: (a, b) => b }),
  done: Annotation<boolean>({ reducer: (a, b) => b }),
});

export function createListingGraph(llm: LLMProvider) {
  const generateWithAI = async (state: typeof ListingState.State) => {
    const amenitiesList =
      (state.amenities || []).join(', ') || 'various modern features';
    const prompt = `Write a compelling real estate listing for a ${state.propertyType} in ${state.city}, ${state.state}. Title: "${state.title}". Features: ${state.beds} bed, ${state.baths} bath, ${state.sqft} sqft, built ${state.yearBuilt}. Amenities: ${amenitiesList}. Max 3 sentences:`;
    const description = await llm.generateText(prompt);
    return { description };
  };

  const fallbackDescription = (state: typeof ListingState.State) => {
    if (state.description) return { done: true };
    const fallback = `Welcome to ${state.title}, a stunning ${state.propertyType} in the heart of ${state.city}, ${state.state}. This ${state.beds}-bedroom, ${state.baths}-bathroom home offers ${state.sqft} sqft of thoughtfully designed living space, built in ${state.yearBuilt} with premium finishes throughout.`;
    return { description: fallback, done: true };
  };

  const markDone = () => ({ done: true });

  return new StateGraph(ListingState)
    .addNode('generate', generateWithAI)
    .addNode('fallback', fallbackDescription)
    .addNode('finish', markDone)
    .addConditionalEdges('generate', (s: typeof ListingState.State) =>
      s.description ? 'finish' : 'fallback',
    )
    .addEdge('__start__', 'generate')
    .addEdge('fallback', 'finish')
    .addEdge('finish', '__end__')
    .compile();
}
