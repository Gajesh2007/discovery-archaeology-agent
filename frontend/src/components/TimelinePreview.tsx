
import React, { useState, useEffect } from 'react';
import { Calendar, Clock, ArrowRight, Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface TimelineItem {
  year: number;
  invention: string;
  key_discovery: string;
  pattern_count: number;
  prerequisite_count: number;
}

const TimelinePreview = () => {
  const [timelineItems, setTimelineItems] = useState<TimelineItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTimeline();
  }, []);

  const fetchTimeline = async () => {
    try {
      const response = await fetch('http://localhost:8000/patterns/timeline');
      if (response.ok) {
        const data = await response.json();
        setTimelineItems(data.slice(0, 4)); // Show only first 4 items
      }
    } catch (error) {
      console.error('Error fetching timeline:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-800 text-center">Innovation Timeline</h2>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex gap-6 items-center animate-pulse">
              <div className="w-20 h-8 bg-slate-200 rounded"></div>
              <div className="flex-1 bg-white/70 rounded-2xl p-4 border border-amber-200">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (timelineItems.length === 0) {
    return null;
  }

  return (
    <section className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-slate-800">The Accidental Timeline</h2>
        <p className="text-slate-600">When wandering created more value than all the world's plans</p>
      </div>

      <div className="space-y-6">
        {timelineItems.map((item, index) => (
          <div key={index} className="flex gap-6 items-center group">
            {/* Year Badge */}
            <div className="flex-shrink-0 w-20">
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 text-white px-3 py-2 rounded-lg text-center font-bold">
                {item.year}
              </div>
            </div>

            {/* Timeline Line */}
            <div className="flex-shrink-0 flex flex-col items-center">
              <div className="w-4 h-4 bg-gradient-to-br from-amber-500 to-orange-500 rounded-full border-4 border-white shadow-lg"></div>
              {index < timelineItems.length - 1 && (
                <div className="w-0.5 h-16 bg-gradient-to-b from-amber-300 to-orange-300 mt-2"></div>
              )}
            </div>

            {/* Content Card */}
            <div className="flex-1 bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-amber-200 hover:shadow-xl transition-all duration-300 group-hover:border-amber-300">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <h3 className="text-lg font-semibold text-slate-800 group-hover:text-amber-700 transition-colors">
                      {item.invention}
                    </h3>
                    <p className="text-sm text-slate-600">
                      Key Discovery: {item.key_discovery}
                    </p>
                  </div>
                  <div className="p-2 bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                  </div>
                </div>

                <div className="flex gap-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span>{item.pattern_count} patterns identified</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
                    <span>{item.prerequisite_count} prerequisites</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center">
        <Button
          onClick={() => navigate('/timeline')}
          className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-2xl"
        >
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View Full Timeline
            <ArrowRight className="w-4 h-4" />
          </div>
        </Button>
      </div>
    </section>
  );
};

export default TimelinePreview;
