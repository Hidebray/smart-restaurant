
import React from 'react';
import Card from '../../../components/ui/Card';

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: 'green' | 'blue' | 'amber' | 'purple';
}

const colorClasses = {
    green: { bg: 'bg-green-100', text: 'text-green-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-600' },
    amber: { bg: 'bg-amber-100', text: 'text-amber-600' },
    purple: { bg: 'bg-purple-100', text: 'text-purple-600' },
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, color }) => {
    const { bg, text } = colorClasses[color];

    return (
        <Card className="p-5 flex items-center">
            <div className={`p-3 rounded-full ${bg} ${text}`}>
                {icon}
            </div>
            <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-800 truncate">{value}</p>
            </div>
        </Card>
    );
};

export default StatCard;
