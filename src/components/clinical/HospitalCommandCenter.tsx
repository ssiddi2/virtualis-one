import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Bed,
  AlertTriangle,
  Building2,
  Activity
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useClinicalOrders } from '@/hooks/useClinicalOrders';

const HospitalCommandCenter = () => {
  const { data: patients } = usePatients();
  const { data: clinicalOrders } = useClinicalOrders();

  const metrics = {
    beds: { occupied: 186, total: 250 },
    icu: { occupied: 32, available: 8 },
    er: { occupied: 24, available: 6 },
    alerts: 12
  };

  const departments = [
    { name: 'ER', status: 'critical', icon: AlertTriangle },
    { name: 'ICU', status: 'warning', icon: Bed },
    { name: 'Surgery', status: 'normal', icon: Activity },
    { name: 'Wards', status: 'normal', icon: Building2 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'critical': return 'bg-destructive';
      case 'warning': return 'bg-amber-500';
      default: return 'bg-emerald-500';
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-white">Command Center</h1>
          {metrics.alerts > 0 && (
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <AlertTriangle className="h-5 w-5 mr-2" />
              {metrics.alerts}
            </Badge>
          )}
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-6">
          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Bed className="h-8 w-8 mx-auto mb-2 text-primary" />
              <div className="text-3xl font-bold text-foreground">{metrics.beds.occupied}</div>
              <div className="text-sm text-muted-foreground">Beds</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-amber-500" />
              <div className="text-3xl font-bold text-foreground">{metrics.icu.occupied}</div>
              <div className="text-sm text-muted-foreground">ICU</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Activity className="h-8 w-8 mx-auto mb-2 text-red-500" />
              <div className="text-3xl font-bold text-foreground">{metrics.er.occupied}</div>
              <div className="text-sm text-muted-foreground">ER</div>
            </CardContent>
          </Card>

          <Card className="bg-card/80 border-border backdrop-blur-sm">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 mx-auto mb-2 text-emerald-500" />
              <div className="text-3xl font-bold text-foreground">85%</div>
              <div className="text-sm text-muted-foreground">Staff</div>
            </CardContent>
          </Card>
        </div>

        {/* Department Status */}
        <div className="grid grid-cols-4 gap-4">
          {departments.map((dept) => (
            <Card key={dept.name} className="bg-card/60 border-border backdrop-blur-sm">
              <CardContent className="p-4 text-center">
                <dept.icon className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                <div className="font-medium text-foreground">{dept.name}</div>
                <div className={`w-3 h-3 rounded-full mx-auto mt-2 ${getStatusColor(dept.status)}`}></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HospitalCommandCenter;