import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color: 'saffron' | 'green' | 'blue' | 'red';
  trend?: {
    value: string;
    positive: boolean;
  };
}

const colorClasses = {
  saffron: {
    border: 'border-l-maharashtra-saffron',
    icon: 'text-maharashtra-saffron',
    text: 'text-maharashtra-saffron'
  },
  green: {
    border: 'border-l-forest-green',
    icon: 'text-forest-green', 
    text: 'text-forest-green'
  },
  blue: {
    border: 'border-l-gov-blue',
    icon: 'text-gov-blue',
    text: 'text-gov-blue'
  },
  red: {
    border: 'border-l-alert-red',
    icon: 'text-alert-red',
    text: 'text-alert-red'
  }
};

export default function StatsCard({ title, value, subtitle, icon: Icon, color, trend }: StatsCardProps) {
  const colorClass = colorClasses[color];

  return (
    <Card className={`shadow p-6 ${colorClass.border} border-l-4`}>
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Icon className={`${colorClass.icon} text-2xl`} size={24} />
          </div>
          <div className="ml-4 flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            <p className={`text-3xl font-bold ${colorClass.text}`}>{value}</p>
            {subtitle && (
              <p className="text-sm text-gray-600">{subtitle}</p>
            )}
            {trend && (
              <p className={`text-sm ${trend.positive ? 'text-success-green' : 'text-alert-red'}`}>
                {trend.positive ? '↗' : '↘'} {trend.value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
