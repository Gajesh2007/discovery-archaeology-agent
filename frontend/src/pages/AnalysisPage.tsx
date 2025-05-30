import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, Network, Sparkles, Target, Link2, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Discovery {
  id: string;
  year?: number;
  title: string;
  description: string;
  discoverers: string[];
  discovery_type: string;
  original_goal?: string;
  actual_outcome: string;
  significance: string;
  location?: string;
}

interface Connection {
  from_discovery_id: string;
  to_discovery_id: string;
  relationship_type: string;
  description: string;
}

interface Analysis {
  invention_name: string;
  invention_year: number;
  summary: string;
  discoveries: Discovery[];
  connections: Connection[];
  patterns_identified: string[];
  serendipity_moments: string[];
  critical_prerequisites: string[];
  narrative: string;
  key_lesson: string;
}

const AnalysisPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [analysis, setAnalysis] = useState<Analysis | null>(location.state?.analysis || null);
  const [isLoading, setIsLoading] = useState(!analysis);

  useEffect(() => {
    if (!analysis && id) {
      fetchAnalysis();
    }
  }, [id, analysis]);

  const fetchAnalysis = async () => {
    try {
      const response = await fetch(`http://localhost:8000/inventions/${id}`);
      if (response.ok) {
        const data = await response.json();
        setAnalysis(data.analysis);
      }
    } catch (error) {
      console.error('Error fetching analysis:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getPatternColor = (pattern: string) => {
    const colors = {
      'ACCIDENTAL': 'bg-purple-100 text-purple-800',
      'CROSS_DOMAIN': 'bg-blue-100 text-blue-800',
      'FAILURE_TO_SUCCESS': 'bg-emerald-100 text-emerald-800',
      'PREREQUISITE_CHAIN': 'bg-orange-100 text-orange-800',
    };
    return colors[pattern as keyof typeof colors] || 'bg-slate-100 text-slate-800';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-slate-600">Loading analysis...</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold text-slate-800">Analysis not found</h1>
          <Button onClick={() => navigate('/')}>Return Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-orange-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-amber-200 sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
              <h1 className="text-xl font-bold text-slate-800">{analysis.invention_name}</h1>
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <Clock className="w-4 h-4" />
                <span>Invented in {analysis.invention_year}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
        {/* Summary Section */}
        <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              The Wandering Path
            </CardTitle>
            <p className="text-sm text-slate-600 mt-1">Follow the accidents and detours that led to this breakthrough</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-700 leading-relaxed">{analysis.summary}</p>
            {analysis.narrative && (
              <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                <h4 className="font-semibold text-amber-800 mb-2">Full Narrative</h4>
                <p className="text-amber-700 leading-relaxed">{analysis.narrative}</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Patterns */}
        {analysis.patterns_identified && analysis.patterns_identified.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-600" />
                Innovation Patterns
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">How this story fits the universal patterns of accidental discovery</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {analysis.patterns_identified.map((pattern, index) => (
                  <Badge key={index} className={getPatternColor(pattern)}>
                    {pattern.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Serendipity Moments */}
        {analysis.serendipity_moments && analysis.serendipity_moments.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                Beautiful Accidents
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">The happy mistakes that changed everything</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.serendipity_moments.map((moment, index) => (
                  <li key={index} className="flex gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-purple-800">{moment}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Prerequisites */}
        {analysis.critical_prerequisites && analysis.critical_prerequisites.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-emerald-600" />
                Had to Happen First
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">Essential technologies and knowledge that had to exist first</p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.critical_prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex gap-3 p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-emerald-800">{prerequisite}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Discoveries */}
        {analysis.discoveries && analysis.discoveries.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-600" />
                The Chain of Accidents
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">Each misstep that mysteriously led to the next breakthrough</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analysis.discoveries.map((discovery, index) => (
                  <div key={discovery.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-amber-800">{discovery.title}</h4>
                      {discovery.year && (
                        <span className="text-sm text-amber-600 bg-amber-200 px-2 py-1 rounded">
                          {discovery.year}
                        </span>
                      )}
                    </div>
                    <p className="text-amber-700 mb-3">{discovery.description}</p>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-amber-800">Type:</span>
                        <span className="ml-1 text-amber-700">{discovery.discovery_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                      </div>
                      {discovery.location && (
                        <div>
                          <span className="font-medium text-amber-800">Location:</span>
                          <span className="ml-1 text-amber-700">{discovery.location}</span>
                        </div>
                      )}
                      {discovery.discoverers && discovery.discoverers.length > 0 && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-amber-800">Discoverers:</span>
                          <span className="ml-1 text-amber-700">{discovery.discoverers.join(', ')}</span>
                        </div>
                      )}
                      {discovery.original_goal && (
                        <div className="md:col-span-2">
                          <span className="font-medium text-amber-800">Original Goal:</span>
                          <span className="ml-1 text-amber-700">{discovery.original_goal}</span>
                        </div>
                      )}
                      <div className="md:col-span-2">
                        <span className="font-medium text-amber-800">Actual Outcome:</span>
                        <span className="ml-1 text-amber-700">{discovery.actual_outcome}</span>
                      </div>
                      <div className="md:col-span-2">
                        <span className="font-medium text-amber-800">Significance:</span>
                        <span className="ml-1 text-amber-700">{discovery.significance}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Connections */}
        {analysis.connections && analysis.connections.length > 0 && (
          <Card className="bg-white/70 backdrop-blur-sm border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="w-5 h-5 text-blue-600" />
                The Hidden Web
              </CardTitle>
              <p className="text-sm text-slate-600 mt-1">See how accidents connected in ways no one could have planned</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {analysis.connections.map((connection, index) => (
                  <div key={index} className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                      <span className="font-medium text-blue-800">{connection.relationship_type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}</span>
                    </div>
                    <p className="text-blue-700">{connection.description}</p>
                    <div className="mt-2 text-xs text-blue-600">
                      <span>From: {connection.from_discovery_id} → To: {connection.to_discovery_id}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Key Lesson */}
        {analysis.key_lesson && (
          <Card className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                The Real Lesson
              </CardTitle>
              <p className="text-sm text-amber-100 mt-1">Why planning couldn't have created this breakthrough</p>
            </CardHeader>
            <CardContent>
              <p className="text-amber-50 leading-relaxed text-lg">{analysis.key_lesson}</p>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default AnalysisPage;
