import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';
import { Moon, Sun, Trash2, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SleepSession {
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes: string;
  date: string;
}

interface SleepHistoryProps {
  sleepData: SleepSession[];
  onDeleteSession: (index: number) => void;
}

export function SleepHistory({ sleepData, onDeleteSession }: SleepHistoryProps) {
  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01 ${bedtime}`);
    let wake = new Date(`2000-01-01 ${wakeTime}`);
    
    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const diff = wake.getTime() - bed.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 8) return { label: 'Excellent', variant: 'default' as const, color: 'bg-green-500' };
    if (quality >= 6) return { label: 'Good', variant: 'secondary' as const, color: 'bg-blue-500' };
    if (quality >= 4) return { label: 'Fair', variant: 'secondary' as const, color: 'bg-yellow-500' };
    return { label: 'Poor', variant: 'destructive' as const, color: 'bg-red-500' };
  };

  const handleDelete = (index: number) => {
    onDeleteSession(index);
    toast.success('Sleep session deleted');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Sleep History
        </CardTitle>
        <CardDescription>Your recent sleep sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {sleepData.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Moon className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No sleep sessions logged yet.</p>
            <p className="text-sm mt-2">Start tracking your sleep to see your history!</p>
          </div>
        ) : (
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {sleepData.map((session, index) => {
                const date = new Date(session.date);
                const qualityBadge = getQualityBadge(session.quality);
                
                return (
                  <div
                    key={index}
                    className="border rounded-lg p-4 space-y-3 hover:border-blue-300 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium">
                          {date.toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(index)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Moon className="w-4 h-4 text-indigo-500" />
                        <span className="text-gray-500">Bedtime:</span>
                        <span>{session.bedtime}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Sun className="w-4 h-4 text-yellow-500" />
                        <span className="text-gray-500">Wake:</span>
                        <span>{session.wakeTime}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{calculateDuration(session.bedtime, session.wakeTime)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={qualityBadge.variant} className={qualityBadge.color}>
                          {qualityBadge.label} ({session.quality}/10)
                        </Badge>
                      </div>
                    </div>

                    {session.notes && (
                      <div className="bg-gray-50 rounded p-3">
                        <p className="text-sm text-gray-700">{session.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );
}
