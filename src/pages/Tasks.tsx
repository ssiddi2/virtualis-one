
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, ClipboardCheck, Clock, AlertTriangle, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Tasks = () => {
  const navigate = useNavigate();

  // Mock task data
  const tasks = [
    {
      id: '1',
      title: 'Complete discharge summary for John Smith',
      priority: 'high',
      dueDate: '2025-06-30T14:00:00Z',
      patient: 'John Smith (MRN-001234)',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Review lab results for Mary Johnson',
      priority: 'medium',
      dueDate: '2025-06-30T16:00:00Z',
      patient: 'Mary Johnson (MRN-005678)',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Medication reconciliation for Robert Wilson',
      priority: 'low',
      dueDate: '2025-07-01T09:00:00Z',
      patient: 'Robert Wilson (MRN-009876)',
      status: 'completed'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-600 text-white';
      case 'medium': return 'bg-yellow-600 text-white';
      case 'low': return 'bg-green-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-600 text-white';
      case 'pending': return 'bg-blue-600 text-white';
      case 'overdue': return 'bg-red-600 text-white';
      default: return 'bg-gray-600 text-white';
    }
  };

  return (
    <div className="min-h-screen p-6" style={{
      background: 'linear-gradient(135deg, hsl(225, 70%, 25%) 0%, hsl(220, 65%, 35%) 25%, hsl(215, 60%, 45%) 50%, hsl(210, 55%, 55%) 75%, hsl(205, 50%, 65%) 100%)'
    }}>
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')}
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white">Task Management</h1>
            <p className="text-white/70">Track and manage your clinical tasks</p>
          </div>
        </div>

        {/* Task Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="backdrop-blur-xl bg-blue-500/20 border border-blue-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <ClipboardCheck className="h-5 w-5" />
                Total Tasks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{tasks.length}</div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-yellow-500/20 border border-yellow-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <Clock className="h-5 w-5" />
                Pending
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {tasks.filter(t => t.status === 'pending').length}
              </div>
            </CardContent>
          </Card>

          <Card className="backdrop-blur-xl bg-red-500/20 border border-red-300/30">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-white">
                <AlertTriangle className="h-5 w-5" />
                High Priority
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {tasks.filter(t => t.priority === 'high').length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Task List */}
        <Card className="backdrop-blur-xl bg-blue-500/10 border border-blue-300/30">
          <CardHeader>
            <CardTitle className="text-white">My Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-blue-400/30">
                  <TableHead className="text-white">Task</TableHead>
                  <TableHead className="text-white">Patient</TableHead>
                  <TableHead className="text-white">Priority</TableHead>
                  <TableHead className="text-white">Due Date</TableHead>
                  <TableHead className="text-white">Status</TableHead>
                  <TableHead className="text-white">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="border-blue-400/20 hover:bg-blue-500/10">
                    <TableCell className="text-white font-medium">{task.title}</TableCell>
                    <TableCell className="text-white">{task.patient}</TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-white">
                      {new Date(task.dueDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <User className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Tasks;
