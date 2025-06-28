
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Scan, 
  Zap, 
  Brain, 
  Eye, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut,
  Maximize2,
  Download,
  AlertTriangle
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useRadiologyOrders } from '@/hooks/useRadiologyOrders';

interface XRayViewerProps {
  orderId?: string;
}

const XRayViewer = ({ orderId }: XRayViewerProps) => {
  const { toast } = useToast();
  const { data: radiologyOrders } = useRadiologyOrders();
  const [selectedOrder, setSelectedOrder] = useState<string | null>(orderId || null);
  const [zoom, setZoom] = useState(100);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Mock X-ray images for demonstration
  const mockXRayImages = [
    {
      id: '1',
      type: 'Chest X-ray',
      url: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=800&h=600&fit=crop',
      findings: 'Right lower lobe opacity consistent with pneumonia',
      aiAnalysis: {
        confidence: 0.87,
        abnormalities: ['pneumonia', 'consolidation'],
        recommendations: ['Antibiotic therapy', 'Follow-up in 48-72 hours']
      }
    },
    {
      id: '2', 
      type: 'Chest X-ray',
      url: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=600&fit=crop',
      findings: 'Hyperinflated lungs with flattened diaphragms, consistent with COPD',
      aiAnalysis: {
        confidence: 0.91,
        abnormalities: ['hyperinflation', 'copd_changes'],
        recommendations: ['Continue bronchodilator therapy', 'Pulmonary rehabilitation']
      }
    }
  ];

  const currentOrder = radiologyOrders?.find(order => order.id === selectedOrder);
  const currentImage = mockXRayImages[0]; // Default to first image

  const handleAIAnalysis = () => {
    setIsAnalyzing(true);
    
    setTimeout(() => {
      toast({
        title: "AI Analysis Complete",
        description: `Analysis confidence: ${(currentImage.aiAnalysis.confidence * 100).toFixed(0)}% - ${currentImage.aiAnalysis.abnormalities.length} findings detected`,
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleDownloadImage = () => {
    toast({
      title: "Image Downloaded",
      description: "X-ray image has been downloaded to your device",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* X-ray Viewer */}
      <div className="lg:col-span-2">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2 text-white">
                <Scan className="h-5 w-5 text-blue-400" />
                X-Ray Viewer - {currentImage.type}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ZoomOut className="h-4 w-4" />
                </Button>
                <span className="text-white text-sm">{zoom}%</span>
                <Button
                  size="sm"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <ZoomIn className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={() => setZoom(100)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  onClick={handleDownloadImage}
                  className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ minHeight: '400px' }}>
              <img 
                src={currentImage.url}
                alt="X-ray Image"
                className="transition-transform duration-200"
                style={{ 
                  transform: `scale(${zoom / 100})`,
                  width: '100%',
                  height: 'auto',
                  filter: 'invert(1) contrast(1.2)'
                }}
              />
              {currentOrder?.critical_results && (
                <div className="absolute top-4 right-4">
                  <Badge className="bg-red-600 text-white animate-pulse">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Critical
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analysis Panel */}
      <div className="space-y-6">
        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Brain className="h-5 w-5 text-purple-400" />
              AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleAIAnalysis}
              disabled={isAnalyzing}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              {isAnalyzing ? (
                <>
                  <Zap className="h-4 w-4 mr-2 animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Run AI Analysis
                </>
              )}
            </Button>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-white/70">Confidence</span>
                  <span className="text-sm text-white">{(currentImage.aiAnalysis.confidence * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-blue-600/30 rounded-full h-2">
                  <div 
                    className="bg-purple-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${currentImage.aiAnalysis.confidence * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">Detected Abnormalities</h4>
                <div className="space-y-1">
                  {currentImage.aiAnalysis.abnormalities.map((abnormality, index) => (
                    <Badge key={index} className="bg-orange-600/20 text-orange-300 border border-orange-400/30 mr-1">
                      {abnormality.replace('_', ' ')}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-white font-medium mb-2">AI Recommendations</h4>
                <ul className="space-y-1">
                  {currentImage.aiAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="text-sm text-white/70 flex items-start gap-2">
                      <span className="text-blue-400 mt-1">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Eye className="h-5 w-5 text-green-400" />
              Radiologist Findings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium mb-1">Findings</h4>
                <p className="text-white/70 text-sm">{currentImage.findings}</p>
              </div>
              
              {currentOrder && (
                <>
                  <div>
                    <h4 className="text-white font-medium mb-1">Impression</h4>
                    <p className="text-white/70 text-sm">{currentOrder.impression || 'Pending radiologist review'}</p>
                  </div>
                  
                  <div>
                    <h4 className="text-white font-medium mb-1">Recommendations</h4>
                    <p className="text-white/70 text-sm">{currentOrder.recommendations || 'To be determined'}</p>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30 rounded-xl shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Maximize2 className="h-5 w-5 text-blue-400" />
              Study Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-white/70">Study Type:</span>
                <span className="text-white">{currentImage.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Modality:</span>
                <span className="text-white">X-Ray</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Date:</span>
                <span className="text-white">{new Date().toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Status:</span>
                <Badge className="bg-green-600/20 text-green-300 border border-green-400/30">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default XRayViewer;
