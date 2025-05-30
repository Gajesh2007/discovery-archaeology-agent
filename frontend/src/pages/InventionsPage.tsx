import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, Calendar, Lightbulb, Clock, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface InventionSummary {
  id: number;
  name: string;
  year?: number;
  summary: string;
  created_at: string;
}

const InventionsPage = () => {
  const navigate = useNavigate();
  const [inventions, setInventions] = useState<InventionSummary[]>([]);
  const [filteredInventions, setFilteredInventions] = useState<InventionSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchInventions();
  }, []);

  useEffect(() => {
    // Filter inventions based on search term
    if (searchTerm.trim() === '') {
      setFilteredInventions(inventions);
    } else {
      const filtered = inventions.filter(invention =>
        invention.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invention.summary.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInventions(filtered);
    }
  }, [searchTerm, inventions]);

  const fetchInventions = async () => {
    try {
      const response = await fetch('http://localhost:8000/inventions');
      if (response.ok) {
        const data = await response.json();
        setInventions(data);
        setFilteredInventions(data);
      }
    } catch (error) {
      console.error('Error fetching inventions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAnalysis = (inventionId: number) => {
    navigate(`/analysis/${inventionId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="text-slate-600 hover:text-slate-800"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-slate-800">All Inventions</h1>
                <p className="text-slate-600">Browse all analyzed inventions</p>
              </div>
            </div>
          </div>
        </header>

        {/* Loading State */}
        <main className="max-w-6xl mx-auto px-6 py-12">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white/70 rounded-2xl p-6 border border-blue-200 animate-pulse">
                <div className="h-6 bg-slate-200 rounded mb-3"></div>
                <div className="h-4 bg-slate-200 rounded mb-2 w-2/3"></div>
                <div className="space-y-2 mb-4">
                  <div className="h-3 bg-slate-200 rounded"></div>
                  <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                </div>
                <div className="h-9 bg-slate-200 rounded"></div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-800"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-slate-800">All Inventions</h1>
              <p className="text-slate-600">
                {inventions.length} invention{inventions.length !== 1 ? 's' : ''} analyzed
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search inventions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-white/80 backdrop-blur-sm border-blue-200 focus:border-blue-400"
          />
        </div>

        {/* Results Count */}
        {searchTerm && (
          <div className="text-sm text-slate-600">
            {filteredInventions.length} result{filteredInventions.length !== 1 ? 's' : ''} found for "{searchTerm}"
          </div>
        )}

        {/* Inventions Grid */}
        {filteredInventions.length === 0 ? (
          <div className="text-center py-16">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white w-fit mx-auto mb-4">
              <Lightbulb className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">
              {searchTerm ? 'No inventions found' : 'No inventions yet'}
            </h2>
            <p className="text-slate-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search terms' 
                : 'Be the first to analyze an invention!'
              }
            </p>
            {!searchTerm && (
              <Button onClick={() => navigate('/')}>
                Start Analyzing
              </Button>
            )}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredInventions.map((invention) => (
              <Card key={invention.id} className="bg-white/80 backdrop-blur-sm border-blue-200 hover:shadow-xl hover:border-blue-300 transition-all duration-300 group">
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg text-slate-800 group-hover:text-blue-600 transition-colors">
                    {invention.name}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-slate-500">
                    {invention.year && (
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{invention.year}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>Added {formatDate(invention.created_at)}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
                    {invention.summary}
                  </p>
                  <Button 
                    onClick={() => handleViewAnalysis(invention.id)}
                    className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white border-0"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Analysis
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default InventionsPage; 