import React, { useState } from 'react';
import { Search, Lightbulb, Clock, Network, Sparkles, Zap, Library } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SearchSection from '../components/SearchSection';
import RecentAnalyses from '../components/RecentAnalyses';
import PatternsPreview from '../components/PatternsPreview';
import TimelinePreview from '../components/TimelinePreview';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-md border-b border-blue-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl text-white shadow-lg">
                <Lightbulb className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-slate-800">Innovation Origins</h1>
                <p className="text-slate-600 text-lg">Every breakthrough has a secret origin story</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate('/inventions')}
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
              >
                <Library className="w-4 h-4 mr-2" />
                All Inventions
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12 space-y-20">
        {/* Hero Section with Search */}
        <section className="text-center space-y-8">
          <div className="space-y-6">
            <h2 className="text-5xl md:text-6xl font-bold text-slate-800 leading-tight">
              What if the greatest inventions were 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"> never meant to be invented?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
              Discover why the best innovations come from wandering, not planning. Every breakthrough has a hidden story of accidents, failures, and beautiful detours.
            </p>
          </div>
          
          <SearchSection />
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 group">
            <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Network className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Embrace the Wandering</h3>
            <p className="text-slate-600 leading-relaxed">
              See why the microwave exists because Percy Spencer wasn't trying to invent it. Sometimes the best discoveries happen when we're looking elsewhere.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 group">
            <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl text-white w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Zap className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Failure is the Path</h3>
            <p className="text-slate-600 leading-relaxed">
              Discover how 3M's worst glue became their best product. Learn why most breakthroughs are just failed experiments that refused to quit.
            </p>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 border border-blue-200 hover:shadow-2xl hover:border-blue-300 transition-all duration-500 group">
            <div className="p-4 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl text-white w-fit mb-6 group-hover:scale-110 transition-transform duration-300">
              <Sparkles className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">Wrong Goals, Right Results</h3>
            <p className="text-slate-600 leading-relaxed">
              Learn why Columbus failed to find India but succeeded at changing the world. The best outcomes often come from missing our original target.
            </p>
          </div>
        </section>

        {/* Recent Analyses */}
        <RecentAnalyses />

        {/* Patterns Preview */}
        <PatternsPreview />

        {/* Timeline Preview */}
        <TimelinePreview />
      </main>
    </div>
  );
};

export default Index;
