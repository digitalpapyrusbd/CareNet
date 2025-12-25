import { BookOpen, Video, FileText, Download, Play } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'document' | 'article';
  duration?: string;
  category: string;
  completed: boolean;
}

interface TrainingResourcesProps {
  resources: Resource[];
  onView: (resourceId: string) => void;
  onDownload: (resourceId: string) => void;
}

export function TrainingResources({ resources, onView, onDownload }: TrainingResourcesProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | 'medication' | 'mobility' | 'emergency'>('all');

  const categories = ['all', 'medication', 'mobility', 'emergency'];
  const filteredResources = resources.filter(r => activeCategory === 'all' || r.category === activeCategory);

  const getIcon = (type: string) => {
    switch(type) {
      case 'video': return Video;
      case 'document': return FileText;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'video': return '#FF8FA3';
      case 'document': return '#5B9FFF';
      default: return '#8B7AE8';
    }
  };

  return (
    <div className="min-h-screen pb-6">
      <div className="p-6">
        <h1 className="mb-6" style={{ color: '#535353' }}>Training Resources</h1>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat as any)}
              className="px-4 py-2 rounded-lg capitalize text-sm whitespace-nowrap" style={{
                background: activeCategory === cat ? 'radial-gradient(143.86% 887.35% at -10.97% -22.81%, #8EC5FC 0%, #5B9FFF 100%)' : 'rgba(255, 255, 255, 0.5)',
                color: activeCategory === cat ? 'white' : '#535353'
              }}>
              {cat}
            </button>
          ))}
        </div>

        {filteredResources.length === 0 ? (
          <div className="finance-card p-8 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4" style={{ color: '#848484' }} />
            <p style={{ color: '#848484' }}>No resources available</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredResources.map((resource) => {
              const Icon = getIcon(resource.type);
              return (
                <div key={resource.id} className="finance-card p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ background: `${getTypeColor(resource.type)}33` }}>
                      <Icon className="w-6 h-6" style={{ color: getTypeColor(resource.type) }} />
                    </div>
                    <div className="flex-1">
                      <h3 className="mb-1" style={{ color: '#535353' }}>{resource.title}</h3>
                      <div className="flex items-center gap-3 text-xs">
                        <span className="px-2 py-1 rounded-full capitalize"
                          style={{ background: 'rgba(142, 197, 252, 0.2)', color: '#5B9FFF' }}>
                          {resource.type}
                        </span>
                        {resource.duration && (
                          <span style={{ color: '#848484' }}>{resource.duration}</span>
                        )}
                        {resource.completed && (
                          <span className="px-2 py-1 rounded-full"
                            style={{ background: 'rgba(124, 229, 119, 0.2)', color: '#7CE577' }}>
                            ✓ Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Button onClick={() => onView(resource.id)} size="sm" variant="outline"
                      className="bg-white/50 border-white/50">
                      <Play className="w-4 h-4 mr-2" />
                      {resource.type === 'video' ? 'Watch' : 'Read'}
                    </Button>
                    {resource.type === 'document' && (
                      <Button onClick={() => onDownload(resource.id)} size="sm" variant="outline"
                        className="bg-white/50 border-white/50">
                        <Download className="w-4 h-4 mr-2" />Download
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

