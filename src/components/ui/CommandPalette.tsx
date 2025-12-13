import { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { 
  Search, Users, FileText, TestTube, Radio, DollarSign, 
  Settings, Home, ArrowRight, Activity, Stethoscope, 
  ClipboardList, BarChart3, Brain, Mic, Shield
} from 'lucide-react';

interface Command {
  id: string;
  title: string;
  description?: string;
  icon: any;
  shortcut?: string;
  action: () => void;
  category: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  // Open with Cmd+K or Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(o => !o);
      }
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (open) {
      setQuery('');
      setSelected(0);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [open]);

  const commands: Command[] = useMemo(() => [
    // Navigation
    { id: 'dashboard', title: 'Dashboard', description: 'Main overview', icon: Home, shortcut: 'G D', action: () => navigate('/dashboard'), category: 'Navigation' },
    { id: 'my-patients', title: 'My Patients', description: 'Patient list', icon: Users, shortcut: 'G P', action: () => navigate('/my-patients'), category: 'Navigation' },
    { id: 'clinical', title: 'Clinical', description: 'Clinical workflows', icon: Stethoscope, shortcut: 'G C', action: () => navigate('/clinical'), category: 'Navigation' },
    
    // Orders & Documentation
    { id: 'cpoe', title: 'Orders (CPOE)', description: 'Computerized orders', icon: FileText, shortcut: 'G O', action: () => navigate('/cpoe'), category: 'Orders' },
    { id: 'labs', title: 'Laboratory', description: 'Lab orders & results', icon: TestTube, shortcut: 'G L', action: () => navigate('/laboratory'), category: 'Orders' },
    { id: 'radiology', title: 'Radiology', description: 'Imaging orders', icon: Radio, shortcut: 'G R', action: () => navigate('/radiology'), category: 'Orders' },
    
    // Finance & Compliance
    { id: 'billing', title: 'Billing', description: 'Revenue cycle', icon: DollarSign, shortcut: 'G B', action: () => navigate('/billing'), category: 'Finance' },
    { id: 'coding', title: 'Coding', description: 'Medical coding', icon: ClipboardList, action: () => navigate('/coding'), category: 'Finance' },
    { id: 'quality', title: 'Quality Metrics', description: 'CMS quality', icon: BarChart3, action: () => navigate('/quality'), category: 'Finance' },
    
    // AI & Tools
    { id: 'ai-dashboard', title: 'AI Dashboard', description: 'AI insights', icon: Brain, action: () => navigate('/ai-dashboard'), category: 'AI & Tools' },
    { id: 'ambient', title: 'Ambient AI', description: 'Voice documentation', icon: Mic, action: () => navigate('/ambient'), category: 'AI & Tools' },
    { id: 'virtualis-chat', title: 'Virtualis Chat', description: 'AI assistant', icon: Activity, action: () => navigate('/virtualis-chat'), category: 'AI & Tools' },
    
    // Admin
    { id: 'settings', title: 'Settings', description: 'System settings', icon: Settings, shortcut: 'G S', action: () => navigate('/settings'), category: 'Admin' },
    { id: 'audit-log', title: 'Audit Log', description: 'HIPAA audit trail', icon: Shield, action: () => navigate('/audit-log'), category: 'Admin' },
    { id: 'certification', title: 'Certification', description: 'EMR certification', icon: FileText, action: () => navigate('/certification'), category: 'Admin' },
  ], [navigate]);

  const filtered = useMemo(() => {
    if (!query) return commands;
    const lowerQuery = query.toLowerCase();
    return commands.filter(c => 
      c.title.toLowerCase().includes(lowerQuery) ||
      c.description?.toLowerCase().includes(lowerQuery) ||
      c.category.toLowerCase().includes(lowerQuery)
    );
  }, [commands, query]);

  // Group by category
  const grouped = useMemo(() => {
    const groups: Record<string, Command[]> = {};
    filtered.forEach(cmd => {
      if (!groups[cmd.category]) groups[cmd.category] = [];
      groups[cmd.category].push(cmd);
    });
    return groups;
  }, [filtered]);

  const flatFiltered = useMemo(() => filtered, [filtered]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { 
      e.preventDefault(); 
      setSelected(s => Math.min(s + 1, flatFiltered.length - 1)); 
    }
    if (e.key === 'ArrowUp') { 
      e.preventDefault(); 
      setSelected(s => Math.max(s - 1, 0)); 
    }
    if (e.key === 'Enter' && flatFiltered[selected]) { 
      flatFiltered[selected].action(); 
      setOpen(false); 
    }
    if (e.key === 'Escape') setOpen(false);
  }, [flatFiltered, selected]);

  let itemIndex = -1;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-lg p-0 gap-0 bg-background border-border">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setSelected(0); }}
            onKeyDown={handleKeyDown}
            placeholder="Search commands... (try 'patient', 'lab', 'billing')"
            className="border-0 focus-visible:ring-0 bg-transparent"
          />
          <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
            ESC
          </kbd>
        </div>
        <div className="max-h-[350px] overflow-y-auto p-2">
          {Object.entries(grouped).map(([category, cmds]) => (
            <div key={category} className="mb-2">
              <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
                {category}
              </div>
              {cmds.map((cmd) => {
                itemIndex++;
                const currentIndex = itemIndex;
                const Icon = cmd.icon;
                return (
                  <button
                    key={cmd.id}
                    onClick={() => { cmd.action(); setOpen(false); }}
                    onMouseEnter={() => setSelected(currentIndex)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-colors',
                      currentIndex === selected 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm">{cmd.title}</div>
                      {cmd.description && (
                        <div className={cn(
                          "text-xs truncate",
                          currentIndex === selected ? 'text-primary-foreground/70' : 'text-muted-foreground'
                        )}>
                          {cmd.description}
                        </div>
                      )}
                    </div>
                    {cmd.shortcut && (
                      <kbd className={cn(
                        "hidden sm:inline-flex h-5 items-center gap-1 rounded border px-1.5 font-mono text-[10px]",
                        currentIndex === selected 
                          ? 'border-primary-foreground/30 text-primary-foreground/70' 
                          : 'border-border text-muted-foreground'
                      )}>
                        {cmd.shortcut}
                      </kbd>
                    )}
                    <ArrowRight className={cn(
                      'h-4 w-4 shrink-0 transition-opacity', 
                      currentIndex === selected ? 'opacity-100' : 'opacity-0'
                    )} />
                  </button>
                );
              })}
            </div>
          ))}
          {flatFiltered.length === 0 && (
            <div className="py-6 text-center text-sm text-muted-foreground">
              No commands found for "{query}"
            </div>
          )}
        </div>
        <div className="border-t border-border px-4 py-2 text-xs text-muted-foreground flex items-center gap-4">
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↑</kbd>
            <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↓</kbd>
            Navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">↵</kbd>
            Select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="px-1.5 py-0.5 bg-muted rounded text-[10px]">esc</kbd>
            Close
          </span>
          <span className="ml-auto text-muted-foreground/60">
            Press <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">⌘K</kbd> anytime
          </span>
        </div>
      </DialogContent>
    </Dialog>
  );
}
