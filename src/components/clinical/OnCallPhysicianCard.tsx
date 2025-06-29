
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Phone, 
  Clock, 
  MapPin,
  Stethoscope,
  Calendar
} from 'lucide-react';

interface OnCallPhysicianCardProps {
  physician: {
    id: string;
    name: string;
    specialty: string;
    phone: string;
    location: string;
    shift_end: string;
    availability: 'available' | 'busy' | 'in_surgery';
    response_time: string;
  };
  onContact: (physicianId: string) => void;
}

const OnCallPhysicianCard = ({ physician, onContact }: OnCallPhysicianCardProps) => {
  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500/20 text-green-200 border-green-400/30';
      case 'busy': return 'bg-yellow-500/20 text-yellow-200 border-yellow-400/30';
      case 'in_surgery': return 'bg-red-500/20 text-red-200 border-red-400/30';
      default: return 'bg-gray-500/20 text-gray-200 border-gray-400/30';
    }
  };

  return (
    <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 hover:bg-blue-500/30 transition-all">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-600/30 rounded-full">
              <User className="h-5 w-5 text-blue-300" />
            </div>
            <div>
              <h3 className="text-white font-semibold">{physician.name}</h3>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Stethoscope className="h-3 w-3" />
                {physician.specialty}
              </div>
            </div>
          </div>
          <Badge className={getAvailabilityColor(physician.availability)}>
            {physician.availability.replace('_', ' ').toUpperCase()}
          </Badge>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Phone className="h-3 w-3" />
            <span>{physician.phone}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <MapPin className="h-3 w-3" />
            <span>{physician.location}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Clock className="h-3 w-3" />
            <span>On call until {physician.shift_end}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-white/70">
            <Calendar className="h-3 w-3" />
            <span>Avg response: {physician.response_time}</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            size="sm" 
            onClick={() => onContact(physician.id)}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            Contact Now
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="border-blue-400/30 text-white hover:bg-blue-500/20"
          >
            Schedule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnCallPhysicianCard;
