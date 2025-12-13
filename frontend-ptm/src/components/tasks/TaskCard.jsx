import React from 'react';
import { Trash2, CheckCircle, Circle, Clock } from 'lucide-react';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { formatDate } from '../../utils/helpers';

export const TaskCard = ({ task, onToggleComplete, onDelete }) => {
    const isCompleted = task.completed;
    const isOverdue = !isCompleted && task.dueDate && new Date(task.dueDate) < new Date();

    return (
        <Card className={`transition-all ${isCompleted ? 'opacity-60' : ''}`}>
            <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                    <button
                        onClick={() => onToggleComplete(task.id)}
                        className="mt-1 focus:outline-none transition-colors"
                    >
                        {isCompleted ? (
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        ) : (
                            <Circle className="w-6 h-6 text-gray-400 hover:text-blue-600" />
                        )}
                    </button>

                    <div className="flex-1">
                        <h4
                            className={`font-semibold ${
                                isCompleted ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}
                        >
                            {task.title}
                        </h4>

                        {task.description && (
                            <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        )}

                        {task.dueDate && (
                            <div className={`flex items-center space-x-1 mt-2 text-sm ${
                                isOverdue ? 'text-red-600' : 'text-gray-500'
                            }`}>
                                <Clock className="w-4 h-4" />
                                <span>{formatDate(task.dueDate)}</span>
                                {isOverdue && <span className="font-semibold">(En retard)</span>}
                            </div>
                        )}
                    </div>
                </div>

                <Button
                    variant="danger"
                    onClick={() => onDelete(task.id)}
                    className="ml-2"
                >
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};