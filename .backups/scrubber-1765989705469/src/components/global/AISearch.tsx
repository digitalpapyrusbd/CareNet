import { Search, X, Sparkles, TrendingUp, Heart, Package, Users } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Card } from "../ui/card";
import { Badge } from "../ui/badge";
import { useTranslationContext } from '@/components/providers/TranslationProvider';

interface AISearchProps {
  onClose: () => void;
  userRole: string;
}

const suggestions = {
  guardian: [
    { icon: Package, text: "Find care packages for dementia patients", category: "Packages" },
    { icon: Heart, text: "Book emergency care services", category: "Emergency" },
    { icon: Users, text: "View my patient's recent care logs", category: "Care Logs" },
    { icon: TrendingUp, text: "Track medication compliance", category: "Health" },
  ],
  caregiver: [
    { icon: Package, text: "View today's patient information", category: "Patients" },
    { icon: Heart, text: "Log vitals and medications", category: "Care Logging" },
    { icon: TrendingUp, text: "Check my earnings this month", category: "Earnings" },
    { icon: Users, text: "See upcoming job assignments", category: "Jobs" },
  ],
};

export function AISearch({ onClose, userRole }: AISearchProps) {
  const { t } = useTranslationContext();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    // Simulate AI search
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSearching(false);
    // In real app, this would navigate or show results
  };

  const currentSuggestions = suggestions[userRole as keyof typeof suggestions] || suggestions.guardian;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="container max-w-2xl mx-auto p-6 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 btn-neumorphic-primary rounded-[22px]">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2>{t('aisearch.heading.aiassistant')}</h2>
              <p className="text-sm text-muted-foreground">{t('aisearch.text.askmeanythingornavig')}</p>
            </div>
          </div>
          <button
            className="btn-icon-neumorphic"
            onClick={onClose}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Card className="modern-card p-2 border-0">
            <div className="relative flex items-center gap-3">
              <Search className="w-5 h-5 text-muted-foreground ml-2" />
              <Input
                type="text"
                placeholder="Ask anything... e.g., 'Find care for my mother'"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="border-0 focus-visible:ring-0 text-base h-12 bg-transparent"
                autoFocus
              />
              {query && (
                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="btn-neumorphic-primary mr-1"
                >
                  {isSearching ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Searching
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" />
                      Search
                    </span>
                  )}
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Suggestions */}
        <div className="flex-1 overflow-y-auto">
          <div className="mb-4">
            <h3 className="text-sm mb-3">{t('aisearch.heading.suggestedactions')}</h3>
          </div>
          <div className="grid gap-3">
            {currentSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  className="btn-neumorphic p-4 cursor-pointer group w-full"
                  onClick={() => {
                    setQuery(suggestion.text);
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 btn-icon-neumorphic group-hover:scale-110 transition-transform flex-shrink-0">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0 text-left">
                      <p className="mb-1">{suggestion.text}</p>
                      <Badge variant="secondary" className="text-xs border-0">
                        {suggestion.category}
                      </Badge>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Popular Searches */}
          <div className="mt-6">
            <h3 className="text-sm mb-3">{t('aisearch.heading.popularsearches')}</h3>
            <div className="flex flex-wrap gap-2">
              {["Care packages", "Medication schedule", "Emergency contacts", "Payment history"].map((term) => (
                <Badge
                  key={term}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground hover:border-primary transition-colors px-4 py-2 rounded-full border-2"
                  onClick={() => setQuery(term)}
                >
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
