
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Network, TrendingUp, Sparkles, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface Pattern {
  pattern_type: string;
  description: string;
  inventions: string[];
  insights: string;
}

const PatternsPage = () => {
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchPatterns();
  }, []);

  const fetchPatterns = async () => {
    try {
      const response = await fetch('http://localhost:8000/patterns');
      if (response.ok) {
        const data = await response.json();
        setPatterns(data);
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

  const filteredPatterns = patterns.filter(pattern =>
    pattern.pattern_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pattern.inventions.some(invention => 
      invention.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-800 hover:bg-blue-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800">Discovery Patterns</h1>
              <p className="text-slate-600 mt-1">Common themes that emerge across breakthrough inventions</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search patterns..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Patterns Grid */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="bg-white/70 border-blue-200 animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-slate-200 rounded mb-2"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPatterns.map((pattern, index) => (
              <Card
                key={index}
                className="bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 group"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-3 bg-gradient-to-br ${getPatternColor(pattern.pattern_type)} rounded-xl text-white shadow-lg`}>
                      <Network className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg text-slate-800 group-hover:text-blue-700 transition-colors">
                        {formatPatternType(pattern.pattern_type)}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {pattern.description}
                  </p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <TrendingUp className="w-4 h-4" />
                      <span>{pattern.inventions.length} inventions follow this pattern</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {pattern.inventions.slice(0, 4).map((invention, i) => (
                        <Badge
                          key={i}
                          variant="secondary"
                          className="bg-blue-100 text-blue-800 hover:bg-blue-200 text-xs"
                        >
                          {invention}
                        </Badge>
                      ))}
                      {pattern.inventions.length > 4 && (
                        <Badge variant="outline" className="text-slate-600 text-xs">
                          +{pattern.inventions.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>

                  {pattern.insights && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <div className="flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                        <p className="text-blue-800 text-sm leading-relaxed">{pattern.insights}</p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {!isLoading && filteredPatterns.length === 0 && (
          <div className="text-center py-12">
            <Network className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No patterns found</h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default PatternsPage;
