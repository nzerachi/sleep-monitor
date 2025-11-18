import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Moon, TrendingUp, Clock, Award } from 'lucide-react';

interface SleepSession {
  bedtime: string;
  wakeTime: string;
  quality: number;
  notes: string;
  date: string;
}

interface SleepAnalyticsProps {
  sleepData: SleepSession[];
}

export function SleepAnalytics({ sleepData }: SleepAnalyticsProps) {
  const calculateDuration = (bedtime: string, wakeTime: string) => {
    const bed = new Date(`2000-01-01 ${bedtime}`);
    let wake = new Date(`2000-01-01 ${wakeTime}`);
    
    if (wake < bed) {
      wake = new Date(`2000-01-02 ${wakeTime}`);
    }
    
    const diff = wake.getTime() - bed.getTime();
    return diff / (1000 * 60 * 60); // hours
  };

  const chartData = sleepData
    .slice(-7)
    .reverse()
    .map((session, index) => {
      const date = new Date(session.date);
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        duration: parseFloat(calculateDuration(session.bedtime, session.wakeTime).toFixed(1)),
        quality: session.quality,
      };
    });

  const avgDuration = sleepData.length > 0
    ? sleepData.reduce((acc, s) => acc + calculateDuration(s.bedtime, s.wakeTime), 0) / sleepData.length
    : 0;

  const avgQuality = sleepData.length > 0
    ? sleepData.reduce((acc, s) => acc + s.quality, 0) / sleepData.length
    : 0;

  const totalNights = sleepData.length;

  const getQualityColor = (quality: number) => {
    if (quality >= 8) return '#10b981';
    if (quality >= 6) return '#3b82f6';
    if (quality >= 4) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-500" />
              Avg Sleep Duration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{avgDuration.toFixed(1)}h</p>
            <p className="text-xs text-gray-500 mt-1">per night</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-green-500" />
              Avg Sleep Quality
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{avgQuality.toFixed(1)}/10</p>
            <p className="text-xs text-gray-500 mt-1">quality score</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-500" />
              Total Nights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl">{totalNights}</p>
            <p className="text-xs text-gray-500 mt-1">tracked</p>
          </CardContent>
        </Card>
      </div>

      {/* Sleep Duration Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5" />
            Sleep Duration (Last 7 Days)
          </CardTitle>
          <CardDescription>Track your sleep hours over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis label={{ value: 'Hours', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Bar dataKey="duration" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No sleep data yet. Start tracking to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sleep Quality Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Sleep Quality Trends
          </CardTitle>
          <CardDescription>Monitor your sleep quality over time</CardDescription>
        </CardHeader>
        <CardContent>
          {chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} label={{ value: 'Quality', angle: -90, position: 'insideLeft' }} />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="quality" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  dot={{ fill: '#10b981', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-gray-500">
              <p>No sleep data yet. Start tracking to see your progress!</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quality Distribution */}
      {sleepData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Quality Distribution</CardTitle>
            <CardDescription>Your sleep quality ratings</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {sleepData.slice(-7).reverse().map((session, index) => {
                const date = new Date(session.date);
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-sm text-gray-500 w-20">
                      {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <div className="flex-1 bg-gray-100 rounded-full h-6 relative overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${session.quality * 10}%`,
                          backgroundColor: getQualityColor(session.quality),
                        }}
                      />
                    </div>
                    <span className="text-sm w-8">{session.quality}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
