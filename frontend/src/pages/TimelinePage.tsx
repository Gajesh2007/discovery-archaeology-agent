
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, Lightbulb, Search, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';

interface TimelineItem {
  year: number;
  invention: string;
  key_discovery: string;
  pattern_count: number;
  prerequisite_count: number;
}

const TimelinePage = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://localhost:8000/patterns/timeline');
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data);
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredAndSortedItems = timelineItems
    .filter(item =>
      item.invention.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.key_discovery.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.year.toString().includes(searchTerm)
    )
    .sort((a, b) => sortOrder === 'desc' ? b.year - a.year : a.year - b.year);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="text-slate-600 hover:text-slate-800 hover:bg-purple-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-slate-800">Innovation Timeline</h1>
              <p className="text-slate-600 mt-1">Chronological journey through breakthrough discoveries</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-8">
        {/* Controls Section */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search inventions or discoveries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-purple-200 focus:border-purple-400"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
            className="border-purple-200 hover:bg-purple-50"
          >
            <Filter className="w-4 h-4 mr-2" />
            {sortOrder === 'desc' ? 'Newest First' : 'Oldest First'}
          </Button>
        </div>

        {/* Timeline */}
        {isLoading ? (
          <div className="space-y-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex gap-6 items-center animate-pulse">
                <div className="w-24 h-10 bg-slate-200 rounded-lg"></div>
                <div className="w-6 h-6 bg-slate-200 rounded-full"></div>
                <div className="flex-1 bg-white/70 rounded-2xl p-6 border border-purple-200">
                  <div className="h-5 bg-slate-200 rounded mb-3"></div>
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-[7.5rem] top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 via-pink-300 to-purple-300"></div>
            
            <div className="space-y-8">
              {filteredAndSortedItems.map((item, index) => (
                <div key={index} className="flex gap-6 items-center group">
                  {/* Year Badge */}
                  <div className="flex-shrink-0 w-24">
                    <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white px-4 py-3 rounded-xl text-center font-bold shadow-lg">
                      {item.year}
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="flex-shrink-0 relative">
                    <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full border-4 border-white shadow-lg z-10 relative"></div>
                    <div className="absolute inset-0 w-6 h-6 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full animate-ping opacity-75"></div>
                  </div>

                  {/* Content Card */}
                  <div className="flex-1">
                    <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:shadow-2xl hover:border-purple-300 transition-all duration-300 group-hover:scale-[1.02]">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <h3 className="text-xl font-bold text-slate-800 group-hover:text-purple-700 transition-colors">
                                {item.invention}
                              </h3>
                              <div className="flex items-center gap-2 text-slate-600">
                                <Lightbulb className="w-4 h-4 text-amber-500" />
                                <span className="text-sm font-medium">Key Discovery:</span>
                                <span className="text-sm">{item.key_discovery}</span>
                              </div>
                            </div>
                            <div className="p-3 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
                              <Calendar className="w-5 h-5 text-purple-600" />
                            </div>
                          </div>

                          <div className="flex gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full"></div>
                              <span className="text-slate-600">
                                <span className="font-medium">{item.pattern_count}</span> patterns identified
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full"></div>
                              <span className="text-slate-600">
                                <span className="font-medium">{item.prerequisite_count}</span> prerequisites
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                              {item.year}s Era
                            </Badge>
                            {item.pattern_count > 3 && (
                              <Badge variant="outline" className="border-amber-200 text-amber-700">
                                High Complexity
                              </Badge>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {!isLoading && filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <Clock className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 mb-2">No timeline items found</h3>
            <p className="text-slate-500">Try adjusting your search terms</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default TimelinePage;
