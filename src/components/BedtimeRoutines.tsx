import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Sparkles, Plus, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

export interface RoutineItem {
  id: string;
  name: string;
  duration: number;
  completed: boolean;
}

interface BedtimeRoutinesProps {
  routines: RoutineItem[];
  onUpdateRoutines: (routines: RoutineItem[]) => void;
}

export function BedtimeRoutines({ routines, onUpdateRoutines }: BedtimeRoutinesProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newRoutineDuration, setNewRoutineDuration] = useState('');

  const handleAddRoutine = () => {
    if (!newRoutineName.trim() || !newRoutineDuration) {
      toast.error('Please enter routine name and duration');
      return;
    }

    const newRoutine: RoutineItem = {
      id: Date.now().toString(),
      name: newRoutineName,
      duration: parseInt(newRoutineDuration),
      completed: false,
    };

    onUpdateRoutines([...routines, newRoutine]);
    setNewRoutineName('');
    setNewRoutineDuration('');
    setIsDialogOpen(false);
    toast.success('Routine added!');
  };

  const handleToggleComplete = (id: string) => {
    const updated = routines.map(r => 
      r.id === id ? { ...r, completed: !r.completed } : r
    );
    onUpdateRoutines(updated);
  };

  const handleDeleteRoutine = (id: string) => {
    onUpdateRoutines(routines.filter(r => r.id !== id));
    toast.success('Routine removed');
  };

  const handleResetRoutines = () => {
    const reset = routines.map(r => ({ ...r, completed: false }));
    onUpdateRoutines(reset);
    toast.success('Routines reset for tonight');
  };

  const totalDuration = routines.reduce((acc, r) => acc + r.duration, 0);
  const completedCount = routines.filter(r => r.completed).length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Bedtime Routine
            </CardTitle>
            <CardDescription>
              Complete your routine for better sleep quality
            </CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Routine Activity</DialogTitle>
                <DialogDescription>
                  Add a new activity to your bedtime routine
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="routineName">Activity Name</Label>
                  <Input
                    id="routineName"
                    placeholder="e.g., Read a book, Meditation"
                    value={newRoutineName}
                    onChange={(e) => setNewRoutineName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="e.g., 15"
                    value={newRoutineDuration}
                    onChange={(e) => setNewRoutineDuration(e.target.value)}
                  />
                </div>
                <Button onClick={handleAddRoutine} className="w-full">
                  Add Activity
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <span className="text-sm text-purple-900">
                Total Time: {totalDuration} min
              </span>
            </div>
            <span className="text-sm text-purple-600">
              {completedCount}/{routines.length} completed
            </span>
          </div>

          {routines.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No routine activities yet.</p>
              <p className="text-sm">Add your first activity to get started!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {routines.map((routine) => (
                <div
                  key={routine.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <Checkbox
                      checked={routine.completed}
                      onCheckedChange={() => handleToggleComplete(routine.id)}
                    />
                    <div className="flex-1">
                      <p className={routine.completed ? 'line-through text-gray-500' : ''}>
                        {routine.name}
                      </p>
                      <p className="text-sm text-gray-500">{routine.duration} min</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteRoutine(routine.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {routines.length > 0 && (
            <Button onClick={handleResetRoutines} variant="outline" className="w-full">
              Reset for Tonight
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
