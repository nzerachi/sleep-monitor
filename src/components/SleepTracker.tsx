import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Slider } from './ui/slider';
import { Textarea } from './ui/textarea';
import { Moon, Sun } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SleepTrackerProps {
  onAddSleep: (sleep: {
    bedtime: string;
    wakeTime: string;
    quality: number;
    notes: string;
    date: string;
  }) => void;
}

export function SleepTracker({ onAddSleep }: SleepTrackerProps) {
  const [bedtime, setBedtime] = useState('');
  const [wakeTime, setWakeTime] = useState('');
  const [quality, setQuality] = useState([7]);
  const [notes, setNotes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bedtime || !wakeTime) {
      toast.error('Please enter both bedtime and wake time');
      return;
    }

    const sleepData = {
      bedtime,
      wakeTime,
      quality: quality[0],
      notes,
      date: new Date().toISOString(),
    };

    onAddSleep(sleepData);
    
    // Reset form
    setBedtime('');
    setWakeTime('');
    setQuality([7]);
    setNotes('');
    
    toast.success('Sleep session logged successfully!');
  };

  const calculateDuration = () => {
    if (!bedtime || !wakeTime) return null;
    
    const bed = new Date(`2000-01-01 ${bedtime}`);
    let wake = new Date(`2000-01-01 ${wakeTime}`);
    
    // If wake time is earlier than bedtime, it's the next day
    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const diff = wake.getTime() - bed.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    return `${hours}h ${minutes}m`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Moon className="w-5 h-5" />
          Log Sleep Session
        </CardTitle>
        <CardDescription>Track your sleep to see patterns and improve your rest</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedtime" className="flex items-center gap-2">
                <Moon className="w-4 h-4" />
                Bedtime
              </Label>
              <Input
                id="bedtime"
                type="time"
                value={bedtime}
                onChange={(e) => setBedtime(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="wakeTime" className="flex items-center gap-2">
                <Sun className="w-4 h-4" />
                Wake Time
              </Label>
              <Input
                id="wakeTime"
                type="time"
                value={wakeTime}
                onChange={(e) => setWakeTime(e.target.value)}
              />
            </div>
          </div>

          {calculateDuration() && (
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600">
                Sleep Duration: <span className="font-semibold">{calculateDuration()}</span>
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label>Sleep Quality: {quality[0]}/10</Label>
            <Slider
              value={quality}
              onValueChange={setQuality}
              min={1}
              max={10}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Poor</span>
              <span>Excellent</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How did you feel? Any dreams or disturbances?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <Button type="submit" className="w-full">
            Log Sleep Session
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
