import React from 'react';
import { Trash2, Eye, CheckCircle } from 'lucide-react';
import { Card } from '../common/Card';
import { ProgressBar } from '../common/ProgressBar';
import { Button } from '../common/Button';

export const ProjectCard = ({ project, onView, onDelete }) => {
    return (
        <Card hover className="transition-all duration-200">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{project.title}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{project.description || 'Aucune description'}</p>
                </div>
            </div>

            <div className="mb-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
          <span className="flex items-center space-x-1">
            <CheckCircle className="w-4 h-4" />
            <span>{project.completedTasks} / {project.totalTasks} tâches</span>
          </span>
                </div>
                <ProgressBar percentage={project.progressPercentage} />
            </div>

            <div className="flex space-x-2 mt-4">
                <Button variant="primary" onClick={() => onView(project.id)} className="flex-1">
                    <div className="flex items-center justify-center space-x-2">
                        <Eye className="w-4 h-4" />
                        <span>Voir détails</span>
                    </div>
                </Button>
                <Button variant="danger" onClick={() => onDelete(project.id)}>
                    <Trash2 className="w-4 h-4" />
                </Button>
            </div>
        </Card>
    );
};