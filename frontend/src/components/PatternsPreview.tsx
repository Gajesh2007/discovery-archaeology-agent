
import React, { useState, useEffect } from 'react';
import { Network, TrendingUp, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface Pattern {
  pattern_type: string;
  description: string;
  inventions: string[];
  insights: string;
}

const PatternsPreview = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const response = await fetch('http://localhost:8000/patterns');
      if (response.ok) {
        const data = await response.json();
        setPatterns(data.slice(0, 3)); // Show only first 3 patterns
      }
    } catch (error) {
      console.error('Error fetching patterns:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatternColor = (type: string) => {
    const colors = {
      'ACCIDENTAL': 'from-purple-500 to-purple-600',
      'CROSS_DOMAIN': 'from-blue-500 to-blue-600', 
      'FAILURE_TO_SUCCESS': 'from-emerald-500 to-emerald-600',
      'PREREQUISITE_CHAIN': 'from-orange-500 to-orange-600',
    };
    return colors[type as keyof typeof colors] || 'from-slate-500 to-slate-600';
  };

  const formatPatternType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Discovery Patterns</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/70 rounded-2xl p-6 border border-amber-200 animate-pulse">
              <div className="h-5 bg-slate-200 rounded mb-3"></div>
              <div className="space-y-2 mb-4">
                <div className="h-3 bg-slate-200 rounded"></div>
                <div className="h-3 bg-slate-200 rounded w-4/5"></div>
              </div>
              <div className="h-8 bg-slate-200 rounded"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">The Patterns of Accident</h2>
        <p className="text-slate-600">Why the same beautiful mistakes keep creating breakthroughs</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {patterns.map((pattern, index) => (
          <div
            key={index}
            className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 bg-gradient-to-br ${getPatternColor(pattern.pattern_type)} rounded-lg text-white`}>
                  <Network className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                    {formatPatternType(pattern.pattern_type)}
                  </h3>
                  <p className="text-sm text-slate-600">
                    {pattern.description}
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <TrendingUp className="w-4 h-4" />
                  <span>{pattern.inventions.length} inventions follow this pattern</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {pattern.inventions.slice(0, 3).map((invention, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs bg-amber-100 text-amber-800 rounded-full"
                    >
                      {invention}
                    </span>
                  ))}
                  {pattern.inventions.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-slate-100 text-slate-600 rounded-full">
                      +{pattern.inventions.length - 3} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => navigate('/patterns')}
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold px-8 py-3 rounded-2xl"
        >
          <div className="flex items-center gap-2">
            Explore All Patterns
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>
    </section>
  );
};

export default PatternsPreview;
