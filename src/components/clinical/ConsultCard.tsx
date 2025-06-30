
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Phone, Clock, Stethoscope } from "lucide-react";

interface ConsultCardProps {
  onOpenConsultDialog: () => void;
}

const ConsultCard = ({ onOpenConsultDialog }: ConsultCardProps) => {
  return (
    <Card className="backdrop-blur-xl bg-white/10 border border-white/30 shadow-xl rounded-lg hover:bg-white/15 transition-all duration-300">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-purple-300" />
            <h3 className="text-white font-semibold">Request Consult</h3>
          </div>
          <Badge className="bg-purple-500/30 text-purple-300 border-purple-400/40 text-xs">
            Available
          </Badge>
        </div>
        
        <p className="text-white/70 text-sm">
          Connect with specialists and request expert consultations for complex cases
        </p>
        
        <div className="flex items-center gap-4 text-xs text-white/60">
          <div className="flex items-center gap-1">
            <Stethoscope className="h-3 w-3" />
            <span>12 specialists</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>24/7 available</span>
          </div>
        </div>
        
        <Button
          onClick={onOpenConsultDialog}
          className="w-full bg-gradient-to-r from-purple-500/20 to-pink-500/20 hover:from-purple-500/30 hover:to-pink-500/30 border border-purple-400/30 text-white backdrop-blur-sm"
        >
          <Phone className="h-4 w-4 mr-2" />
          Request Consult
        </Button>
      </CardContent>
    </Card>
  );
};

export default ConsultCard;
