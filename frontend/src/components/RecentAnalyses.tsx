import React, { useState, useEffect } from 'react';
import { Clock, ArrowRight, Sparkles, Library } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface InventionSummary {
  id: number;
  name: string;
  year: number;
  summary: string;
  created_at: string;
}

const RecentAnalyses = () => {
  const [recentInventions, setRecentInventions] = useState<InventionSummary[]>([]);
  const [totalInventions, setTotalInventions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentAnalyses();
  }, []);

  const fetchRecentAnalyses = async () => {
    try {
      const response = await fetch('http://localhost:8000/inventions');
      if (response.ok) {
        const data = await response.json();
        setTotalInventions(data.length);
        setRecentInventions(data.slice(0, 3)); // Show only the 3 most recent
      }
    } catch (error) {
      console.error('Error fetching recent analyses:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = (inventionId: number) => {
    navigate(`/analysis/${inventionId}`);
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Recent Discoveries</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/70 rounded-2xl p-6 border border-amber-200 animate-pulse">
              <div className="h-4 bg-slate-200 rounded mb-2"></div>
              <div className="h-3 bg-slate-200 rounded mb-4 w-2/3"></div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (recentInventions.length === 0) {
    return (
      <section className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-slate-800">No Discoveries Yet</h2>
        <p className="text-slate-600">Be the first to uncover the hidden story behind an invention!</p>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">Recently Uncovered Stories</h2>
        <p className="text-slate-600">Fresh proof that the best things weren't meant to be</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {recentInventions.map((invention) => (
          <div
            key={invention.id}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 group"
          >
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                    {invention.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-4 h-4" />
                    <span>{invention.year}</span>
                  </div>
                </div>
                <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed line-clamp-3">
                {invention.summary}
              </p>

              <Button
                onClick={() => handleViewAnalysis(invention.id)}
                variant="ghost"
                className="w-full justify-between text-amber-700 hover:text-amber-800 hover:bg-amber-50 group/btn"
              >
                View Full Discovery
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      {totalInventions > 3 && (
        <div className="text-center pt-4">
          <Button
            onClick={() => navigate('/inventions')}
            variant="outline"
            className="border-blue-200 text-blue-700 hover:bg-blue-50"
          >
            <Library className="w-4 h-4 mr-2" />
            View All {totalInventions} Inventions
          </Button>
        </div>
      )}
    </section>
  );
};

export default RecentAnalyses;
