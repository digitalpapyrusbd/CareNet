# Frontend 14: AI Features & Recommendations

**Version**: 1.0  
**Last Updated**: December 11, 2025  
**Related Files**: [TOC](01%20Frontend%20TOC.md) | [02: Auth](01%20Frontend%2002.md) | [11: UI Components](01%20Frontend%2011.md)

---

## 📋 Table of Contents

1. [AI System Overview](#ai-system-overview)
2. [AI Assistant](#ai-assistant)
3. [Smart Search](#smart-search)
4. [Caregiver Recommendations](#caregiver-recommendations)
5. [Health Insights](#health-insights)
6. [Predictive Analytics](#predictive-analytics)
7. [Natural Language Processing](#natural-language-processing)
8. [Voice Commands](#voice-commands)
9. [AI Agent Architecture](#ai-agent-architecture)
10. [Debugging Guide](#debugging-guide)
11. [Testing Guide](#testing-guide)
12. [Testing Progress Log](#testing-progress-log)

---

## 🤖 AI System Overview

### **Purpose**
The AI system provides intelligent assistance across the platform:
- **AI Assistant**: Context-aware chatbot for navigation and queries
- **Smart Search**: Natural language search with suggestions
- **Recommendations**: ML-powered caregiver matching
- **Health Insights**: Predictive health analytics
- **Voice Commands**: Bengali and English voice navigation
- **Automated Tasks**: Intelligent scheduling and reminders

### **AI Architecture**

```typescript
// Core AI Components
interface AISystem {
  assistant: AIAssistant;           // Chatbot interface
  nlp: NLPEngine;                   // Language understanding
  recommendations: RecommendationEngine;  // ML matching
  analytics: PredictiveAnalytics;   // Health predictions
  voiceRecognition: VoiceEngine;    // Speech-to-text
}

// AI Agent State
interface AgentState {
  isActive: boolean;
  isListening: boolean;
  isProcessing: boolean;
  isSpeaking: boolean;
  language: 'bn' | 'en';
}

// Agent Context
interface AgentContext {
  currentRoute: string;
  userRole: UserRole;
  conversationHistory: Message[];
  pendingAction?: PendingAction;
  language: Language;
  lastActivity: Date;
  sessionId: string;
}
```

### **Key Features**

- ✅ Bilingual support (Bengali, English)
- ✅ Voice-enabled navigation
- ✅ Context-aware responses
- ✅ Natural language search
- ✅ Caregiver matching algorithm
- ✅ Health trend analysis
- ✅ Medication reminders
- ✅ Predictive scheduling

---

## 💬 AI Assistant

**Component**: `/src/components/ai-assistant/AIAssistant.tsx`  
**Hook**: `/src/hooks/use-ai-agent.ts`

### **AI Assistant Component**

```tsx
export function AIAssistant({ userRole, language = 'bn' }: AIAssistantProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputText, setInputText] = useState('');
  const [currentLanguage, setCurrentLanguage] = useState<Language>(language);

  const pathname = usePathname();
  const router = useRouter();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    sendMessage,
    toggleListening,
    setLanguage,
    isListening,
    isProcessing,
    error
  } = useAIAgent({
    userRole,
    currentRoute: pathname,
    language: currentLanguage
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle navigation actions
  const handleResponse = async (response: any) => {
    if (response?.action) {
      if (response.action.type === 'navigate') {
        router.push(response.action.route);
      }
    }
  };

  const handleSendMessage = async () => {
    if (!inputText.trim() || isProcessing) return;

    const response = await sendMessage(inputText);
    setInputText('');

    if (response) {
      await handleResponse(response);
    }
  };

  if (!isExpanded) {
    // Minimized floating button
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
        aria-label="Open AI Assistant"
      >
        <Bot className="w-8 h-8" />
        {isListening && (
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
          </span>
        )}
      </button>
    );
  }

  // Expanded chat interface
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white">
        <div className="flex items-center gap-2">
          <Bot className="w-6 h-6" />
          <div>
            <h3 className="font-semibold">AI Assistant</h3>
            <p className="text-xs opacity-90">
              {currentLanguage === 'bn' ? 'সাহায্যকারী' : 'Helper'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const newLang: Language = currentLanguage === 'bn' ? 'en' : 'bn';
              setCurrentLanguage(newLang);
              setLanguage(newLang);
            }}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Toggle Language"
          >
            <Globe className="w-5 h-5" />
            <span className="text-xs ml-1">{currentLanguage === 'bn' ? '🇧🇩' : '🇬🇧'}</span>
          </button>

          <button
            onClick={() => setIsExpanded(false)}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">
              {currentLanguage === 'bn'
                ? 'আমাকে জিজ্ঞাসা করুন বা একটি কমান্ড বলুন'
                : 'Ask me anything or say a command'}
            </p>
            <p className="text-xs mt-2 opacity-75">
              {currentLanguage === 'bn'
                ? 'উদাহরণ: "রোগী দেখাও" বা "পেমেন্ট পাতায় যান"'
                : 'Example: "show patients" or "go to payments"'}
            </p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              <p className="text-xs opacity-75 mt-1">
                {new Date(message.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-gray-800 rounded-lg px-4 py-2 border border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                  <span className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
                </div>
                <span className="text-xs text-gray-500">
                  {currentLanguage === 'bn' ? 'চিন্তা করছি...' : 'Thinking...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <textarea
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={currentLanguage === 'bn' ? 'একটি বার্তা লিখুন...' : 'Type a message...'}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white resize-none"
              rows={2}
              disabled={isProcessing}
            />
          </div>

          <button
            onClick={toggleListening}
            className={`p-3 rounded-lg transition-all ${
              isListening
                ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                : 'bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300'
            }`}
            title={isListening ? 'Stop listening' : 'Start listening'}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>

          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isProcessing}
            className="p-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>

        {isListening && (
          <div className="mt-2 flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <div className="flex gap-1">
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse"></span>
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></span>
              <span className="w-1 h-4 bg-red-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></span>
            </div>
            <span>{currentLanguage === 'bn' ? 'শুনছি...' : 'Listening...'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
```

### **AI Agent Hook**

```typescript
export function useAIAgent(options: UseAIAgentOptions): UseAIAgentReturn {
  const { userRole, currentRoute, language = 'bn', autoStart = false } = options;

  const [agentState, setAgentState] = useState<AgentState>({
    isActive: false,
    isListening: false,
    isProcessing: false,
    isSpeaking: false,
    language
  });

  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState<string | null>(null);

  const agentServiceRef = useRef<AIAgentService | null>(null);

  // Initialize agent service
  useEffect(() => {
    if (!agentServiceRef.current) {
      agentServiceRef.current = new AIAgentService(userRole, currentRoute, language);
      setAgentState(prev => ({ ...prev, isActive: true }));

      if (autoStart) {
        agentServiceRef.current.startListening();
        setAgentState(prev => ({ ...prev, isListening: true }));
      }
    }

    return () => {
      if (agentServiceRef.current) {
        agentServiceRef.current.stopListening();
      }
    };
  }, [userRole, currentRoute, language, autoStart]);

  /**
   * Send text message
   */
  const sendMessage = useCallback(async (message: string): Promise<AgentResponse | null> => {
    if (!agentServiceRef.current || !message.trim()) {
      return null;
    }

    setAgentState(prev => ({ ...prev, isProcessing: true }));
    setError(null);

    try {
      const response = await agentServiceRef.current.processCommand(message);

      // Update messages
      const context = agentServiceRef.current.getContext();
      setMessages(context.conversationHistory);

      return response;
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to process message';
      setError(errorMessage);
      return null;
    } finally {
      setAgentState(prev => ({ ...prev, isProcessing: false }));
    }
  }, []);

  return {
    agentState,
    messages,
    sendMessage,
    startListening,
    stopListening,
    toggleListening,
    setLanguage,
    resetAgent,
    isListening: agentState.isListening,
    isProcessing: agentState.isProcessing,
    isSpeaking: agentState.isSpeaking,
    error
  };
}
```

---

## 🔍 Smart Search

**Component**: `/src/components/global/AISearch.tsx`

### **AI Search Interface**

```tsx
export function AISearch({ onClose, userRole }: AISearchProps) {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

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

  const handleSearch = async () => {
    if (!query.trim()) return;
    setIsSearching(true);
    
    try {
      // Call AI search API
      const response = await fetch('/api/ai/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, userRole })
      });
      
      const results = await response.json();
      // Process and display results
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
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
              <h2>AI Assistant</h2>
              <p className="text-sm text-muted-foreground">Ask me anything or navigate</p>
            </div>
          </div>
          <button className="btn-icon-neumorphic" onClick={onClose}>
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
            <h3 className="text-sm mb-3">Suggested Actions</h3>
          </div>
          <div className="grid gap-3">
            {currentSuggestions.map((suggestion, index) => {
              const Icon = suggestion.icon;
              return (
                <button
                  key={index}
                  className="btn-neumorphic p-4 cursor-pointer group w-full"
                  onClick={() => setQuery(suggestion.text)}
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
            <h3 className="text-sm mb-3">Popular Searches</h3>
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
```

---

## 👤 Caregiver Recommendations

### **ML Matching Algorithm**

```typescript
interface CaregiverMatchCriteria {
  patientCondition: string[];
  location: { lat: number; lng: number };
  availability: string;
  budget: { min: number; max: number };
  specializations: string[];
  experience: number;
  rating: number;
}

interface CaregiverScore {
  caregiverId: string;
  totalScore: number;
  scores: {
    specialization: number;
    location: number;
    availability: number;
    rating: number;
    experience: number;
    budget: number;
  };
  matchPercentage: number;
}

async function recommendCaregivers(
  criteria: CaregiverMatchCriteria
): Promise<CaregiverScore[]> {
  const caregivers = await fetchAvailableCaregivers();
  
  const scoredCaregivers = caregivers.map(caregiver => {
    const scores = {
      // Specialization match (40%)
      specialization: calculateSpecializationScore(
        caregiver.specializations,
        criteria.patientCondition
      ) * 0.4,
      
      // Location proximity (20%)
      location: calculateLocationScore(
        caregiver.location,
        criteria.location
      ) * 0.2,
      
      // Availability (15%)
      availability: calculateAvailabilityScore(
        caregiver.availability,
        criteria.availability
      ) * 0.15,
      
      // Rating (15%)
      rating: (caregiver.rating / 5) * 0.15,
      
      // Experience (5%)
      experience: calculateExperienceScore(
        caregiver.yearsOfExperience,
        criteria.experience
      ) * 0.05,
      
      // Budget fit (5%)
      budget: calculateBudgetScore(
        caregiver.hourlyRate,
        criteria.budget
      ) * 0.05
    };

    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);
    const matchPercentage = Math.round(totalScore * 100);

    return {
      caregiverId: caregiver.id,
      totalScore,
      scores,
      matchPercentage
    };
  });

  // Sort by total score descending
  return scoredCaregivers.sort((a, b) => b.totalScore - a.totalScore);
}

// Specialization scoring
function calculateSpecializationScore(
  caregiverSpecs: string[],
  requiredSpecs: string[]
): number {
  const matches = requiredSpecs.filter(spec => 
    caregiverSpecs.includes(spec)
  ).length;
  
  return requiredSpecs.length > 0 ? matches / requiredSpecs.length : 0;
}

// Location scoring (within 10km = 1.0, decreases with distance)
function calculateLocationScore(
  caregiverLocation: { lat: number; lng: number },
  targetLocation: { lat: number; lng: number }
): number {
  const distance = calculateDistance(caregiverLocation, targetLocation);
  
  if (distance <= 10) return 1.0;
  if (distance <= 20) return 0.7;
  if (distance <= 30) return 0.4;
  return 0.1;
}
```

### **Recommendation Display**

```tsx
export function CaregiverRecommendations({ recommendations }: { recommendations: CaregiverScore[] }) {
  return (
    <div className="space-y-4">
      <h2 style={{ color: '#535353' }}>Recommended Caregivers</h2>
      
      {recommendations.map((rec, idx) => (
        <div key={rec.caregiverId} className="finance-card p-5">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {idx === 0 && (
                <div 
                  className="px-3 py-1 rounded-full text-xs text-white"
                  style={{ background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #FFB3C1 0%, #FF8FA3 100%)' }}
                >
                  Best Match
                </div>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <div 
                  className="text-2xl font-bold"
                  style={{ color: rec.matchPercentage >= 80 ? '#7CE577' : rec.matchPercentage >= 60 ? '#FFD180' : '#848484' }}
                >
                  {rec.matchPercentage}%
                </div>
                <span className="text-sm" style={{ color: '#848484' }}>Match</span>
              </div>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="space-y-2">
            {Object.entries(rec.scores).map(([key, value]) => (
              <div key={key} className="flex items-center gap-2">
                <span className="text-sm capitalize" style={{ color: '#848484', width: '120px' }}>
                  {key}
                </span>
                <div className="flex-1 h-2 rounded-full" style={{ background: 'rgba(132, 132, 132, 0.2)' }}>
                  <div 
                    className="h-full rounded-full"
                    style={{ 
                      width: `${value * 100}%`,
                      background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)'
                    }}
                  />
                </div>
                <span className="text-sm" style={{ color: '#535353', width: '40px', textAlign: 'right' }}>
                  {Math.round(value * 100)}%
                </span>
              </div>
            ))}
          </div>

          <Button
            className="w-full mt-4"
            style={{
              background: 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #A8E063 0%, #7CE577 100%)',
              color: 'white'
            }}
          >
            View Profile
          </Button>
        </div>
      ))}
    </div>
  );
}
```

---

## 💊 Health Insights

### **Medication Compliance Analysis**

```typescript
interface MedicationRecord {
  medicationName: string;
  scheduledTime: Date;
  takenAt?: Date;
  status: 'taken' | 'missed' | 'delayed';
}

interface ComplianceInsight {
  overallCompliance: number; // 0-100%
  trends: {
    week: number;
    month: number;
    threeMonths: number;
  };
  missedDoses: MedicationRecord[];
  recommendations: string[];
}

async function analyzeCompli ance(
  patientId: string,
  period: number // days
): Promise<ComplianceInsight> {
  const records = await fetchMedicationRecords(patientId, period);
  
  const taken = records.filter(r => r.status === 'taken').length;
  const total = records.length;
  const overallCompliance = Math.round((taken / total) * 100);

  // Identify patterns
  const missedDoses = records.filter(r => r.status === 'missed');
  const delayedDoses = records.filter(r => r.status === 'delayed');

  // Generate recommendations
  const recommendations = [];
  
  if (overallCompliance < 80) {
    recommendations.push('Consider setting up automated reminders');
  }
  
  if (missedDoses.length > 3) {
    recommendations.push('Speak with your doctor about simplifying medication schedule');
  }
  
  if (delayedDoses.length > 5) {
    recommendations.push('Try aligning medication times with daily routines');
  }

  return {
    overallCompliance,
    trends: {
      week: calculateWeeklyTrend(records),
      month: calculateMonthlyTrend(records),
      threeMonths: calculateQuarterlyTrend(records)
    },
    missedDoses,
    recommendations
  };
}
```

### **Vital Signs Trends**

```typescript
interface VitalTrend {
  type: 'blood_pressure' | 'heart_rate' | 'temperature' | 'oxygen_saturation';
  readings: Array<{ date: Date; value: number | { systolic: number; diastolic: number } }>;
  average: number;
  trend: 'improving' | 'stable' | 'concerning';
  alerts: string[];
}

async function analyzeVitalTrends(patientId: string): Promise<VitalTrend[]> {
  const vitals = await fetchVitalRecords(patientId, 30); // Last 30 days
  
  const bloodPressureTrend = analyzeBloodPressure(vitals);
  const heartRateTrend = analyzeHeartRate(vitals);
  const temperatureTrend = analyzeTemperature(vitals);
  const oxygenTrend = analyzeOxygenSaturation(vitals);

  return [bloodPressureTrend, heartRateTrend, temperatureTrend, oxygenTrend];
}

function analyzeBloodPressure(vitals: any[]): VitalTrend {
  const bpReadings = vitals.filter(v => v.type === 'blood_pressure');
  
  const avgSystolic = average(bpReadings.map(r => r.systolic));
  const avgDiastolic = average(bpReadings.map(r => r.diastolic));

  const alerts = [];
  
  if (avgSystolic > 140 || avgDiastolic > 90) {
    alerts.push('Blood pressure consistently high. Consult physician.');
  } else if (avgSystolic < 90 || avgDiastolic < 60) {
    alerts.push('Blood pressure consistently low. Monitor closely.');
  }

  return {
    type: 'blood_pressure',
    readings: bpReadings,
    average: avgSystolic, // Using systolic as primary
    trend: determineTrend(bpReadings),
    alerts
  };
}
```

---

## 📊 Predictive Analytics

### **Care Needs Forecasting**

```typescript
interface CareNeedsPrediction {
  nextMonth: {
    hoursNeeded: number;
    confidence: number;
  };
  peakDemandDays: Date[];
  recommendedCaregiverCount: number;
  estimatedCost: number;
}

async function predictCareNeeds(
  patientId: string,
  historicalData: CareSession[]
): Promise<CareNeedsPrediction> {
  // Analyze historical patterns
  const weeklyHours = calculateWeeklyAverages(historicalData);
  const seasonalFactors = detectSeasonalPatterns(historicalData);
  const healthTrends = await analyzeHealthTrends(patientId);

  // ML prediction (simplified)
  const baseHours = average(weeklyHours) * 4.33; // Weekly to monthly
  const seasonalAdjustment = getCurrentSeasonalFactor(seasonalFactors);
  const healthAdjustment = calculateHealthFactorAdjustment(healthTrends);

  const predictedHours = baseHours * seasonalAdjustment * healthAdjustment;
  const confidence = calculateConfidence(historicalData.length, variance(weeklyHours));

  // Peak demand detection
  const peakDays = identifyPeakDays(historicalData);

  return {
    nextMonth: {
      hoursNeeded: Math.round(predictedHours),
      confidence: Math.round(confidence * 100)
    },
    peakDemandDays: peakDays,
    recommendedCaregiverCount: Math.ceil(predictedHours / 160), // 160 hours/month per caregiver
    estimatedCost: calculateEstimatedCost(predictedHours)
  };
}
```

---

## 🗣️ Voice Commands

### **Speech Recognition Setup**

```typescript
class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening = false;

  constructor(language: 'bn-BD' | 'en-US') {
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new webkitSpeechRecognition();
      this.recognition.lang = language;
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
    }
  }

  startListening(onResult: (text: string) => void, onError: (error: string) => void) {
    if (!this.recognition) {
      onError('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        onResult(result[0].transcript);
      }
    };

    this.recognition.onerror = (event) => {
      onError(event.error);
    };

    this.recognition.start();
    this.isListening = true;
  }

  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }
}
```

### **Voice Command Processing**

```typescript
const voiceCommands = {
  bn: {
    navigate: ['যান', 'খুলুন', 'দেখান'],
    search: ['খুঁজুন', 'সার্চ'],
    action: ['বন্ধ', 'মুছুন', 'যোগ করুন']
  },
  en: {
    navigate: ['go to', 'open', 'show'],
    search: ['find', 'search for'],
    action: ['close', 'delete', 'add']
  }
};

function processVoiceCommand(transcript: string, language: 'bn' | 'en'): Command {
  const commands = voiceCommands[language];
  
  // Check for navigation commands
  for (const nav of commands.navigate) {
    if (transcript.toLowerCase().includes(nav)) {
      const target = extractTarget(transcript, nav);
      return { type: 'navigate', target };
    }
  }
  
  // Check for search commands
  for (const search of commands.search) {
    if (transcript.toLowerCase().includes(search)) {
      const query = extractQuery(transcript, search);
      return { type: 'search', query };
    }
  }
  
  return { type: 'unknown', transcript };
}
```

---

## 🐛 Debugging Guide

### **Issue: AI Assistant Not Responding**

**Problem**: Assistant doesn't respond to messages.

**Debug Steps**:
```typescript
// Check AI service initialization
console.log('AI Service:', agentServiceRef.current);
console.log('Agent State:', agentState);

// Check API connectivity
const testResponse = await fetch('/api/ai/health');
console.log('AI API Health:', await testResponse.json());

// Verify message processing
console.log('Sending message:', inputText);
const response = await sendMessage(inputText);
console.log('AI Response:', response);
```

### **Issue: Voice Recognition Not Working**

**Solution**:
```typescript
// Check browser support
if (!('webkitSpeechRecognition' in window)) {
  console.error('Speech recognition not supported in this browser');
}

// Check microphone permissions
navigator.mediaDevices.getUserMedia({ audio: true })
  .then(() => console.log('Microphone access granted'))
  .catch(error => console.error('Microphone access denied:', error));

// Test recognition
recognition.onerror = (event) => {
  console.error('Recognition error:', event.error);
  if (event.error === 'not-allowed') {
    alert('Please allow microphone access');
  }
};
```

---

## 🧪 Testing Guide

```typescript
describe('AI Features', () => {
  describe('AI Assistant', () => {
    it('opens and closes assistant', () => {
      render(<AIAssistant userRole="guardian" />);
      
      const button = screen.getByLabelText('Open AI Assistant');
      fireEvent.click(button);
      
      expect(screen.getByText('AI Assistant')).toBeInTheDocument();
    });
    
    it('sends message and receives response', async () => {
      const { user } = render(<AIAssistant userRole="guardian" />);
      
      await user.click(screen.getByLabelText('Open AI Assistant'));
      
      const input = screen.getByPlaceholderText(/Type a message/i);
      await user.type(input, 'Show patients');
      await user.click(screen.getByTitle('Send message'));
      
      await waitFor(() => {
        expect(screen.getByText(/Show patients/i)).toBeInTheDocument();
      });
    });
  });
  
  describe('Caregiver Recommendations', () => {
    it('scores caregivers correctly', () => {
      const score = calculateSpecializationScore(
        ['dementia', 'diabetes'],
        ['dementia', 'diabetes', 'mobility']
      );
      
      expect(score).toBeCloseTo(0.67, 2);
    });
    
    it('sorts by best match', async () => {
      const recommendations = await recommendCaregivers(criteria);
      
      expect(recommendations[0].matchPercentage).toBeGreaterThanOrEqual(
        recommendations[1].matchPercentage
      );
    });
  });
  
  describe('Health Insights', () => {
    it('calculates compliance correctly', async () => {
      const insight = await analyzeCompliance('patient-123', 30);
      
      expect(insight.overallCompliance).toBeGreaterThanOrEqual(0);
      expect(insight.overallCompliance).toBeLessThanOrEqual(100);
    });
  });
});
```

---

## 📊 Testing Progress Log

### **✅ Completed**
- **AI Assistant**: 75% (UI rendering, message display)
- **Smart Search**: 70% (Search interface, suggestions)
- **Voice Commands**: 60% (Basic speech recognition)
- **Recommendations**: 65% (Algorithm implemented, needs tuning)

### **❌ TODO**
- [ ] Complete NLP intent classification
- [ ] Integrate ML recommendation model
- [ ] Real-time health insights dashboard
- [ ] Voice command Bengali language support
- [ ] Predictive analytics visualization
- [ ] E2E AI workflow tests

---

**Last Updated**: December 11, 2025  
**Maintained By**: Development Team
