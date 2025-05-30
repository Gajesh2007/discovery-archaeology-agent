
import React, { useState } from 'react';
import { Search, Sparkles, ArrowRight, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
  const [inventionName, setInventionName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleAnalyze = async () => {
    if (!inventionName.trim()) {
      toast({
        title: "Choose your curiosity",
        description: "What invention's secret origin intrigues you?",
      });
      return;
    }

    setIsLoading(true);
    console.log('Analyzing invention:', inventionName);

    try {
      const response = await fetch('http://localhost:8000/inventions/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          invention_name: inventionName.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze invention');
      }

      const data = await response.json();
      console.log('Analysis result:', data);

      // Navigate to analysis page with the result
      navigate(`/analysis/${data.id}`, { state: { analysis: data.analysis } });
      
      toast({
        title: "Discovery complete!",
        description: `The secret origin of ${inventionName} has been revealed`,
      });
    } catch (error) {
      console.error('Error analyzing invention:', error);
      toast({
        title: "Oops! Even errors lead somewhere",
        description: "Let's try uncovering that story again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedInventions = [
    "Microwave Oven",
    "Post-it Notes", 
    "Penicillin",
    "X-ray",
    "Velcro",
    "Pacemaker"
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="relative">
        <div className="relative flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-slate-400 w-6 h-6" />
            <Input
              type="text"
              placeholder="What invention's secret story do you want to uncover?"
              value={inventionName}
              onChange={(e) => setInventionName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAnalyze()}
              className="pl-14 pr-6 py-7 text-xl rounded-3xl border-2 border-blue-200 focus:border-blue-400 bg-white/90 backdrop-blur-sm shadow-lg"
            />
          </div>
          <Button
            onClick={handleAnalyze}
            disabled={isLoading}
            className="px-10 py-7 text-xl rounded-3xl bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-bold disabled:opacity-50 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Analyzing...
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6" />
                Explore Story
                <ArrowRight className="w-5 h-5" />
              </div>
            )}
          </Button>
        </div>
      </div>

      {/* Suggested Inventions */}
      <div className="space-y-4">
        <p className="text-lg text-slate-600 text-center font-medium">Start with these fascinating accidents:</p>
        <div className="flex flex-wrap justify-center gap-3">
          {suggestedInventions.map((invention) => (
            <button
              key={invention}
              onClick={() => setInventionName(invention)}
              className="px-6 py-3 text-sm bg-white/90 hover:bg-white border-2 border-blue-200 hover:border-blue-300 rounded-2xl text-slate-700 hover:text-slate-800 transition-all duration-300 hover:shadow-lg hover:scale-105 font-medium"
            >
              {invention}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchSection;
