import React from 'react';
import { FolderKanban, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Card } from '../common/Card';

export const Sidebar = ({ stats }) => {
    const statCards = [
        {
            icon: FolderKanban,
            label: 'Projets',
            value: stats.totalProjects,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            icon: CheckCircle,
            label: 'Tâches',
            value: stats.totalTasks,
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            icon: Clock,
            label: 'Complétées',
            value: stats.completedTasks,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            icon: TrendingUp,
            label: 'Progression',
            value: `${Math.round(stats.overallProgress)}%`,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50',
        },
    ];

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Statistiques</h2>

            {statCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                    <Card key={index} className="p-4">
                        <div className="flex items-center space-x-3">
                            <div className={`${stat.bgColor} p-3 rounded-lg`}>
                                <Icon className={`w-6 h-6 ${stat.color}`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-600">{stat.label}</p>
                                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                            </div>
                        </div>
                    </Card>
                );
            })}

            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-900 mb-2">💡 Astuce</h3>
                <p className="text-sm text-blue-700">
                    Organisez vos tâches par priorité pour une meilleure productivité !
                </p>
            </div>
        </div>
    );
};