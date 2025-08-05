import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle, 
  Circle, 
  AlertTriangle, 
  Rocket, 
  Shield, 
  Database, 
  Globe, 
  Settings,
  Users,
  FileText,
  Zap,
  Clock
} from 'lucide-react';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'infrastructure' | 'security' | 'content' | 'testing' | 'launch';
  status: 'completed' | 'in-progress' | 'pending' | 'blocked';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  dependencies?: string[];
}

const checklistItems: ChecklistItem[] = [
  // Infrastructure
  {
    id: 'domain-setup',
    title: 'Custom Domain Configuration',
    description: 'Set up medflow.ai domain with SSL certificates',
    category: 'infrastructure',
    status: 'completed',
    priority: 'high',
    estimatedTime: '30 minutes'
  },
  {
    id: 'prod-build',
    title: 'Production Build Optimization',
    description: 'Optimize bundle size and performance for production',
    category: 'infrastructure',
    status: 'completed',
    priority: 'high',
    estimatedTime: '1 hour'
  },
  {
    id: 'cdn-setup',
    title: 'CDN & Asset Optimization',
    description: 'Configure CDN for global performance',
    category: 'infrastructure',
    status: 'completed',
    priority: 'medium',
    estimatedTime: '45 minutes'
  },
  {
    id: 'monitoring',
    title: 'Monitoring & Analytics',
    description: 'Set up error tracking and performance monitoring',
    category: 'infrastructure',
    status: 'in-progress',
    priority: 'high',
    estimatedTime: '2 hours'
  },

  // Security
  {
    id: 'security-headers',
    title: 'Security Headers',
    description: 'Configure CSP, HSTS, and other security headers',
    category: 'security',
    status: 'completed',
    priority: 'high',
    estimatedTime: '1 hour'
  },
  {
    id: 'audit-logging',
    title: 'Audit Logging',
    description: 'Implement comprehensive audit trails',
    category: 'security',
    status: 'completed',
    priority: 'high',
    estimatedTime: '3 hours'
  },
  {
    id: 'penetration-test',
    title: 'Security Penetration Testing',
    description: 'Third-party security assessment',
    category: 'security',
    status: 'pending',
    priority: 'high',
    estimatedTime: '1 week'
  },

  // Content
  {
    id: 'demo-data',
    title: 'Production Demo Data',
    description: 'Sanitized, realistic demo data for trials',
    category: 'content',
    status: 'completed',
    priority: 'medium',
    estimatedTime: '4 hours'
  },
  {
    id: 'documentation',
    title: 'User Documentation',
    description: 'Complete user guides and API documentation',
    category: 'content',
    status: 'in-progress',
    priority: 'medium',
    estimatedTime: '1 week'
  },
  {
    id: 'sales-materials',
    title: 'Sales & Marketing Materials',
    description: 'Pricing pages, case studies, demos',
    category: 'content',
    status: 'completed',
    priority: 'high',
    estimatedTime: '2 days'
  },

  // Testing
  {
    id: 'load-testing',
    title: 'Load Testing',
    description: 'Test with 100+ concurrent users',
    category: 'testing',
    status: 'in-progress',
    priority: 'high',
    estimatedTime: '1 day'
  },
  {
    id: 'browser-testing',
    title: 'Cross-Browser Testing',
    description: 'Test on Chrome, Safari, Firefox, Edge',
    category: 'testing',
    status: 'completed',
    priority: 'medium',
    estimatedTime: '4 hours'
  },
  {
    id: 'mobile-testing',
    title: 'Mobile Device Testing',
    description: 'Test on iOS and Android devices',
    category: 'testing',
    status: 'completed',
    priority: 'medium',
    estimatedTime: '3 hours'
  },

  // Launch
  {
    id: 'beta-program',
    title: 'Beta User Program',
    description: 'Recruit and onboard 10 beta hospitals',
    category: 'launch',
    status: 'in-progress',
    priority: 'high',
    estimatedTime: '2 weeks'
  },
  {
    id: 'support-system',
    title: '24/7 Support System',
    description: 'Set up support ticketing and escalation',
    category: 'launch',
    status: 'pending',
    priority: 'high',
    estimatedTime: '1 week',
    dependencies: ['beta-program']
  },
  {
    id: 'go-live',
    title: 'Public Launch',
    description: 'Announce public availability',
    category: 'launch',
    status: 'pending',
    priority: 'high',
    estimatedTime: '1 day',
    dependencies: ['beta-program', 'support-system', 'penetration-test']
  }
];

const categoryIcons = {
  infrastructure: Database,
  security: Shield,
  content: FileText,
  testing: Settings,
  launch: Rocket
};

const categoryColors = {
  infrastructure: 'bg-blue-100 text-blue-800',
  security: 'bg-red-100 text-red-800',
  content: 'bg-green-100 text-green-800',
  testing: 'bg-yellow-100 text-yellow-800',
  launch: 'bg-purple-100 text-purple-800'
};

const statusIcons = {
  completed: CheckCircle,
  'in-progress': Clock,
  pending: Circle,
  blocked: AlertTriangle
};

const statusColors = {
  completed: 'text-green-600',
  'in-progress': 'text-blue-600',
  pending: 'text-gray-400',
  blocked: 'text-red-600'
};

export const DeploymentChecklist: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const categories = ['all', ...Array.from(new Set(checklistItems.map(item => item.category)))];
  
  const filteredItems = selectedCategory === 'all' 
    ? checklistItems 
    : checklistItems.filter(item => item.category === selectedCategory);

  const getStatusCounts = () => {
    const total = checklistItems.length;
    const completed = checklistItems.filter(item => item.status === 'completed').length;
    const inProgress = checklistItems.filter(item => item.status === 'in-progress').length;
    const pending = checklistItems.filter(item => item.status === 'pending').length;
    const blocked = checklistItems.filter(item => item.status === 'blocked').length;
    
    return { total, completed, inProgress, pending, blocked };
  };

  const { total, completed, inProgress, pending, blocked } = getStatusCounts();
  const completionPercentage = (completed / total) * 100;

  const getCategoryProgress = (category: string) => {
    const categoryItems = checklistItems.filter(item => item.category === category);
    const categoryCompleted = categoryItems.filter(item => item.status === 'completed').length;
    return (categoryCompleted / categoryItems.length) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Overall Progress */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Rocket className="h-5 w-5" />
              MedFlow AI Production Deployment
            </CardTitle>
            <Badge 
              variant={completionPercentage >= 100 ? "default" : "secondary"}
              className={completionPercentage >= 100 ? "bg-green-600" : ""}
            >
              {completionPercentage >= 100 ? 'Ready for Launch' : 'In Progress'}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Track deployment progress and readiness for production launch
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Progress</span>
              <span className="text-sm text-muted-foreground">
                {completed} of {total} tasks completed
              </span>
            </div>
            <Progress value={completionPercentage} className="h-3" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{completed}</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{inProgress}</div>
                <div className="text-sm text-muted-foreground">In Progress</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-400">{pending}</div>
                <div className="text-sm text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{blocked}</div>
                <div className="text-sm text-muted-foreground">Blocked</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Progress by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {categories.filter(cat => cat !== 'all').map((category) => {
              const Icon = categoryIcons[category as keyof typeof categoryIcons];
              const progress = getCategoryProgress(category);
              
              return (
                <div key={category} className="text-center space-y-2">
                  <Icon className="h-8 w-8 mx-auto text-muted-foreground" />
                  <div className="text-sm font-medium capitalize">{category}</div>
                  <Progress value={progress} className="h-2" />
                  <div className="text-xs text-muted-foreground">{progress.toFixed(0)}%</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            onClick={() => setSelectedCategory(category)}
            className="capitalize"
          >
            {category === 'all' ? 'All Tasks' : category}
          </Button>
        ))}
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const StatusIcon = statusIcons[item.status];
          const Icon = categoryIcons[item.category];
          
          return (
            <Card key={item.id} className={item.priority === 'high' ? 'border-l-4 border-l-orange-500' : ''}>
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <StatusIcon className={`h-5 w-5 mt-0.5 ${statusColors[item.status]}`} />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">{item.title}</h3>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className={categoryColors[item.category]}>
                          <Icon className="h-3 w-3 mr-1" />
                          {item.category}
                        </Badge>
                        {item.priority === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            High Priority
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Est. {item.estimatedTime}</span>
                      </div>
                      
                      {item.dependencies && (
                        <div className="flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          <span>Depends on: {item.dependencies.join(', ')}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Launch Readiness */}
      {completionPercentage >= 80 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <Zap className="h-5 w-5" />
              Launch Readiness Assessment
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {completionPercentage >= 100 ? '🚀' : '⚡'}
                  </div>
                  <div className="font-medium">
                    {completionPercentage >= 100 ? 'Ready to Launch' : 'Almost Ready'}
                  </div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{total - pending - blocked}</div>
                  <div className="font-medium">Critical Tasks Done</div>
                </div>
                <div className="text-center p-4 bg-white rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">0</div>
                  <div className="font-medium">Blockers Remaining</div>
                </div>
              </div>
              
              {completionPercentage >= 100 ? (
                <div className="text-center space-y-4">
                  <h3 className="text-lg font-bold text-green-800">🎉 Ready for Production Launch!</h3>
                  <p className="text-green-700">
                    All critical deployment tasks are complete. MedFlow AI is ready to go live.
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    Initiate Public Launch
                  </Button>
                </div>
              ) : (
                <div className="text-center">
                  <p className="text-green-700">
                    Almost there! Complete the remaining {total - completed} tasks to go live.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};