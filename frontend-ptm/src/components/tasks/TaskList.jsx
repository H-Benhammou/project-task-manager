import React, { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { Button } from '../common/Button';

export const TaskList = ({ tasks, onCreateTask, onToggleComplete, onDeleteTask }) => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleSubmit = (formData) => {
        onCreateTask(formData);
        setIsFormOpen(false);
    };

    const completedTasks = tasks.filter(task => task.completed);
    const incompleteTasks = tasks.filter(task => !task.completed);

    return (
        <div className="space-y-6">
            {/* Add Task Button */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">
                    Tâches ({incompleteTasks.length} en cours, {completedTasks.length} terminées)
                </h2>
                <Button onClick={() => setIsFormOpen(!isFormOpen)}>
                    <div className="flex items-center space-x-2">
                        {isFormOpen ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
                        <span>{isFormOpen ? 'Annuler' : 'Nouvelle tâche'}</span>
                    </div>
                </Button>
            </div>

            {/* Task Form */}
            {isFormOpen && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Créer une nouvelle tâche</h3>
                    <TaskForm
                        onSubmit={handleSubmit}
                        onCancel={() => setIsFormOpen(false)}
                    />
                </div>
            )}

            {/* Incomplete Tasks */}
            {incompleteTasks.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">En cours</h3>
                    {incompleteTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </div>
            )}

            {/* Completed Tasks */}
            {completedTasks.length > 0 && (
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-700">Terminées</h3>
                    {completedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onToggleComplete={onToggleComplete}
                            onDelete={onDeleteTask}
                        />
                    ))}
                </div>
            )}

            {/* Empty State */}
            {tasks.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <p className="text-gray-600 mb-4">Aucune tâche pour ce projet</p>
                    <Button onClick={() => setIsFormOpen(true)}>
                        <div className="flex items-center space-x-2">
                            <Plus className="w-5 h-5" />
                            <span>Créer votre première tâche</span>
                        </div>
                    </Button>
                </div>
            )}
        </div>
    );
};