import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { SleepTracker } from './components/SleepTracker';
import { BedtimeRoutines, RoutineItem } from './components/BedtimeRoutines';
import { SleepAnalytics } from './components/SleepAnalytics';
import { SleepHistory } from './components/SleepHistory';
import { Toaster } from './components/ui/sonner';
import { Moon, BarChart3, History, Sparkles } from 'lucide-react';

interface SleepSession {
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes: string;
  date: string;
}

export default function App() {
  const [sleepData, setSleepData] = useState<SleepSession[]>(() => {
    const saved = localStorage.getItem('sleepData');
    if (saved) {
      return JSON.parse(saved);
    }
    // Mock data for demo
    return [
      {
        bedtime: '22:30',
        wakeTime: '06:45',
        quality: 8,
        notes: 'Felt refreshed and energetic',
        date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '23:15',
        wakeTime: '07:00',
        quality: 6,
        notes: 'Woke up a few times during the night',
        date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '22:00',
        wakeTime: '06:30',
        quality: 9,
        notes: 'Best sleep in weeks!',
        date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '23:45',
        wakeTime: '07:15',
        quality: 5,
        notes: 'Had trouble falling asleep',
        date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '22:30',
        wakeTime: '06:45',
        quality: 7,
        notes: 'Good sleep overall',
        date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '22:15',
        wakeTime: '06:30',
        quality: 8,
        notes: 'Followed my routine perfectly',
        date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        bedtime: '23:00',
        wakeTime: '07:00',
        quality: 7,
        notes: 'Feeling rested',
        date: new Date().toISOString(),
      },
    ];
  });

  const [routines, setRoutines] = useState<RoutineItem[]>(() => {
    const saved = localStorage.getItem('bedtimeRoutines');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default routines
    return [
      { id: '1', name: 'Read a book', duration: 20, completed: false },
      { id: '2', name: 'Meditation', duration: 10, completed: false },
      { id: '3', name: 'Prepare tomorrow\'s clothes', duration: 5, completed: false },
      { id: '4', name: 'Light stretching', duration: 10, completed: false },
    ];
  });

  // Save to localStorage whenever data changes
  useEffect(() => {
    localStorage.setItem('sleepData', JSON.stringify(sleepData));
  }, [sleepData]);

  useEffect(() => {
    localStorage.setItem('bedtimeRoutines', JSON.stringify(routines));
  }, [routines]);

  const handleAddSleep = (newSleep: SleepSession) => {
    setSleepData([...sleepData, newSleep]);
  };

  const handleDeleteSession = (index: number) => {
    setSleepData(sleepData.filter((_, i) => i !== index));
  };

  const handleUpdateRoutines = (updatedRoutines: RoutineItem[]) => {
    setRoutines(updatedRoutines);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Moon className="w-10 h-10 text-indigo-600" />
            <h1 className="text-4xl text-indigo-900">Sleep Monitor</h1>
          </div>
          <p className="text-gray-600">Track your sleep, build better habits, rest better</p>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="tracker" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tracker" className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              <span className="hidden sm:inline">Tracker</span>
            </TabsTrigger>
            <TabsTrigger value="routines" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              <span className="hidden sm:inline">Routines</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tracker" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <SleepTracker onAddSleep={handleAddSleep} />
              <BedtimeRoutines routines={routines} onUpdateRoutines={handleUpdateRoutines} />
            </div>
          </TabsContent>

          <TabsContent value="routines">
            <div className="max-w-2xl mx-auto">
              <BedtimeRoutines routines={routines} onUpdateRoutines={handleUpdateRoutines} />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <SleepAnalytics sleepData={sleepData} />
          </TabsContent>

          <TabsContent value="history">
            <div className="max-w-4xl mx-auto">
              <SleepHistory sleepData={sleepData} onDeleteSession={handleDeleteSession} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      <Toaster />
    </div>
  );
}
