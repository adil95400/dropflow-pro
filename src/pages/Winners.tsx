
import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, TrendingUp, Globe, BarChart3 } from 'lucide-react';
import { getWinnersAI, getTrendsFromTikTok, compareWinners } from '@/lib/openai';
import { ProductCard } from '@/components/ProductCard';

export default function Winners() {
  const [keyword, setKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trends, setTrends] = useState([]);
  const [compareData, setCompareData] = useState([]);

  const handleSearch = async () => {
    setLoading(true);
    const aiWinners = await getWinnersAI(keyword);
    const trendingData = await getTrendsFromTikTok(keyword);
    const comparison = await compareWinners(aiWinners);
    setProducts(aiWinners);
    setTrends(trendingData);
    setCompareData(comparison);
    setLoading(false);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex gap-4 items-center">
        <Input
          placeholder="🔍 Rechercher une niche ou un produit..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Chargement...' : 'Trouver des Winners'}
        </Button>
      </div>

      {trends.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <TrendingUp size={18} /> Tendances TikTok / Google Trends
            </h2>
            <ul className="list-disc pl-6 text-sm">
              {trends.map((trend, index) => (
                <li key={index}>{trend}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {compareData.length > 0 && (
        <Card>
          <CardContent>
            <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
              <BarChart3 size={18} /> Comparaison des produits (marge, prix, origine)
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {compareData.map((item, index) => (
                <div key={index} className="border rounded-xl p-3 bg-muted text-sm">
                  <strong>{item.name}</strong>
                  <p>Prix : {item.price} €</p>
                  <p>Marge estimée : {item.margin} €</p>
                  <p>Fournisseur : {item.supplier}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} showAI />
        ))}
      </div>
    </div>
  );
}
