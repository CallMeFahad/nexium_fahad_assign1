'use client'

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Quote, Sparkles, Search } from 'lucide-react';

const QuoteGenerator = () => {
  const [topic, setTopic] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [quotesDatabase, setQuotesDatabase] = useState({});
  const [loadingDatabase, setLoadingDatabase] = useState(true);
  const [error, setError] = useState(null);

  // Load quotes from JSON file when component starts
  useEffect(() => {
    const loadQuotes = async () => {
      try {
        setLoadingDatabase(true);
        const response = await fetch('/quotes.json');
        
        if (!response.ok) {
          throw new Error('Failed to load quotes');
        }
        
        const data = await response.json();
        setQuotesDatabase(data);
        setError(null);
      } catch (err) {
        console.error('Error loading quotes:', err);
        console.log('Using fallback quotes due to error:', err.message);
        setError('Using offline quotes (JSON file not found)');
        // Fallback to a comprehensive set of quotes if file fails to load
        setQuotesDatabase({
          success: [
            "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
            "The way to get started is to quit talking and begin doing. - Walt Disney",
            "Don't be afraid to give up the good to go for the great. - John D. Rockefeller"
          ],
          motivation: [
            "The only way to do great work is to love what you do. - Steve Jobs",
            "Innovation distinguishes between a leader and a follower. - Steve Jobs",
            "Your limitation—it's only your imagination. - Unknown"
          ],
          happiness: [
            "Happiness is not something ready made. It comes from your own actions. - Dalai Lama",
            "The purpose of our lives is to be happy. - Dalai Lama",
            "Life is what happens to you while you're busy making other plans. - John Lennon"
          ],
          leadership: [
            "A leader is one who knows the way, goes the way, and shows the way. - John C. Maxwell",
            "Leadership is not about being in charge. It's about taking care of those in your charge. - Simon Sinek",
            "The greatest leader is not necessarily the one who does the greatest things. - Ronald Reagan"
          ]
        });
      } finally {
        setLoadingDatabase(false);
      }
    };

    loadQuotes();
  }, []); // Empty dependency array means this runs once when component mounts

  const generateQuotes = () => {
    if (!topic.trim()) {
      alert('Please enter a topic!');
      return;
    }

    if (Object.keys(quotesDatabase).length === 0) {
      alert('Quotes are still loading. Please wait a moment.');
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const searchTopic = topic.toLowerCase().trim();
      let foundQuotes = [];

      // Search for exact match first
      if (quotesDatabase[searchTopic]) {
        foundQuotes = quotesDatabase[searchTopic];
      } else {
        // Search for partial matches
        const matchingKeys = Object.keys(quotesDatabase).filter(key => 
          key.includes(searchTopic) || searchTopic.includes(key)
        );
        
        if (matchingKeys.length > 0) {
          foundQuotes = quotesDatabase[matchingKeys[0]];
        } else {
          // Default to motivation quotes if no match found
          foundQuotes = quotesDatabase.motivation || [];
        }
      }

      if (foundQuotes.length === 0) {
        alert('No quotes found for this topic. Try another topic!');
        setLoading(false);
        return;
      }

      // Shuffle and get 3 random quotes
      const shuffled = [...foundQuotes].sort(() => 0.5 - Math.random());
      setQuotes(shuffled.slice(0, 3));
      setLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      generateQuotes();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <div className="flex justify-center items-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-purple-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Quote Generator
            </h1>
            <Sparkles className="w-8 h-8 text-blue-600" />
          </div>
          <p className="text-gray-600 text-lg">
            Enter a topic and discover inspiring quotes to motivate your day
          </p>
        </div>

        {/* Loading State */}
        {loadingDatabase && (
          <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <div className="flex items-center justify-center gap-3">
                <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-lg text-gray-600">Loading quotes database...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-8 shadow-lg border-0 bg-red-50 backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Search Section */}
        {!loadingDatabase && (
          <Card className="mb-8 shadow-lg border-0 bg-white/70 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800">
                What inspires you today?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Enter a topic (e.g., success, motivation, dreams)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="pl-10 h-12 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-lg"
                  />
                </div>
                <Button 
                  onClick={generateQuotes}
                  disabled={loading}
                  className="h-12 px-6 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-semibold rounded-lg shadow-lg transform transition hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Finding...
                    </div>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Available Topics */}
        {!loadingDatabase && Object.keys(quotesDatabase).length > 0 && (
          <div className="text-center mb-8">
            <p className="text-gray-600 mb-3">Popular topics:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {Object.keys(quotesDatabase).map((topicName) => (
                <button
                  key={topicName}
                  onClick={() => setTopic(topicName)}
                  className="px-3 py-1 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-full text-sm text-gray-700 hover:bg-purple-100 hover:border-purple-300 transition-all duration-200 hover:scale-105"
                >
                  {topicName}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quotes Display */}
        {quotes.length > 0 && (
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
            {quotes.map((quote, index) => (
              <Card key={index} className="shadow-xl border-0 bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Quote className="w-8 h-8 text-purple-500 flex-shrink-0 mt-1" />
                    <div className="flex-1">
                      <blockquote className="text-lg md:text-xl text-gray-800 leading-relaxed font-medium italic">
                        &ldquo;{quote.split(' - ')[0]}&rdquo;
                      </blockquote>
                      {quote.includes(' - ') && (
                        <cite className="block mt-4 text-right text-purple-600 font-semibold">
                          — {quote.split(' - ')[1]}
                        </cite>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 pb-8">
          <p className="text-gray-500 text-sm">
            Built with Next.js, ShadCN UI, and DaisyUI
          </p>
        </div>
      </div>
    </div>
  );
};

export default QuoteGenerator;