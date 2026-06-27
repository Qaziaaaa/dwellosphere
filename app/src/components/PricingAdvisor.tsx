import { useEffect, useState } from 'react';
import { getPricingAdvice } from '@/services/ai.service';
import { Sparkles } from 'lucide-react';

interface Props {
  price: number;
  listingType: string;
  beds: number;
  baths: number;
  sqft: number;
  city: string;
  state: string;
}

interface Advice {
  advice: string;
  comparableCount: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  avgPricePerSqft: number;
  estimatedPrice?: number;
}

export default function PricingAdvisor({
  price,
  listingType,
  beds,
  baths,
  sqft,
  city,
  state,
}: Props) {
  const [advice, setAdvice] = useState<Advice | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    async function load() {
      try {
        const data = await getPricingAdvice({
          price,
          listingType: listingType === 'for-sale' ? 'for_sale' : 'for_rent',
          beds,
          baths,
          sqft,
          city,
          state,
        });
        if (!cancelled) setAdvice(data);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [price, listingType, beds, baths, sqft, city, state]);

  if (loading) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-5 dark:border-gray-700 dark:bg-gray-800">
        <div className="mb-3 h-5 w-40 animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
        <div className="h-4 w-full animate-pulse rounded bg-gray-200 dark:bg-gray-700" />
      </div>
    );
  }

  if (!advice) return null;

  const formatPrice = (val: number) =>
    val.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <div className="rounded-xl border border-blue-100 bg-blue-50 p-5 dark:border-blue-900 dark:bg-blue-950">
      <div className="mb-3 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="font-semibold text-gray-900 dark:text-white">
          AI Pricing Advisor
        </h3>
      </div>
      <p className="mb-3 text-sm text-gray-700 dark:text-gray-300">{advice.advice}</p>
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Market Avg</span>
          <p className="font-medium text-gray-900 dark:text-white">{formatPrice(advice.avgPrice)}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Price Range</span>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatPrice(advice.minPrice)} — {formatPrice(advice.maxPrice)}
          </p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Avg $/sqft</span>
          <p className="font-medium text-gray-900 dark:text-white">{formatPrice(advice.avgPricePerSqft)}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Comparables</span>
          <p className="font-medium text-gray-900 dark:text-white">{advice.comparableCount} properties</p>
        </div>
      </div>
    </div>
  );
}
