import { useState } from 'react';
import { generateListingDescription } from '@/services/ai.service';
import { Sparkles, Copy, Check } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

export default function ListingGenerator() {
  const [form, setForm] = useState({
    title: '',
    propertyType: 'house',
    beds: 3,
    baths: 2,
    sqft: 1500,
    yearBuilt: new Date().getFullYear(),
    city: '',
    state: '',
    amenities: '',
  });
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  async function handleGenerate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await generateListingDescription({
        ...form,
        amenities: form.amenities.split(',').map((s) => s.trim()).filter(Boolean),
      });
      if (result) setDescription(result.description);
    } finally {
      setLoading(false);
    }
  }

  function handleCopy() {
    navigator.clipboard.writeText(description);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          AI Listing Generator
        </h3>
      </div>
      <form onSubmit={handleGenerate} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Modern Downtown Loft" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label>
            <select value={form.propertyType} onChange={(e) => setForm({ ...form, propertyType: e.target.value })} className="h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white">
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="condo">Condo</option>
              <option value="townhouse">Townhouse</option>
              <option value="studio">Studio</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Beds</label>
            <Input type="number" min={1} max={50} value={form.beds} onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Baths</label>
            <Input type="number" min={1} max={50} value={form.baths} onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Sqft</label>
            <Input type="number" min={100} value={form.sqft} onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Year Built</label>
            <Input type="number" min={1800} max={2030} value={form.yearBuilt} onChange={(e) => setForm({ ...form, yearBuilt: Number(e.target.value) })} required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">City</label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} placeholder="e.g. Portland" required />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">State</label>
            <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} placeholder="e.g. OR" required />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">Amenities (comma-separated)</label>
          <Input value={form.amenities} onChange={(e) => setForm({ ...form, amenities: e.target.value })} placeholder="Pool, Gym, Rooftop" />
        </div>
        <Button type="submit" disabled={loading} className="w-full gap-2 bg-blue-600 hover:bg-blue-700">
          <Sparkles className="h-4 w-4" />
          {loading ? 'Generating...' : 'Generate Description'}
        </Button>
      </form>
      {description && (
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Generated Description</span>
            <Button variant="outline" size="sm" onClick={handleCopy} className="gap-1">
              {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
              {copied ? 'Copied' : 'Copy'}
            </Button>
          </div>
          <Textarea readOnly value={description} rows={5} className="text-sm" />
        </div>
      )}
    </div>
  );
}
