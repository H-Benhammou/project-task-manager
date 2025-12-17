import { useNavigate } from 'react-router-dom';
import { FolderKanban, ListTodo } from 'lucide-react';
import { type Project } from '../services/projectService';

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const navigate = useNavigate();

    const getStatusInfo = () => {
        if (project.totalTasks === 0) {
            return { label: 'No Tasks', color: 'bg-gray-100 text-gray-800' };
        }
        if (project.completedTasks === project.totalTasks) {
            return { label: 'Completed', color: 'bg-green-100 text-green-800' };
        }
        return { label: 'In Progress', color: 'bg-blue-100 text-blue-800' };
    };

    const status = getStatusInfo();

    return (
        <div
            onClick={() => navigate(`/projects/${project.id}`)}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md hover:border-blue-300 transition-all cursor-pointer group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                        <FolderKanban className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                            {project.title}
                        </h3>
                        <span className={`inline-block mt-1 px-2 py-1 rounded-full text-xs font-medium ${status.color}`}>
                            {status.label}
                        </span>
                    </div>
                </div>
            </div>

            {project.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {project.description}
                </p>
            )}

            <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                        <ListTodo className="w-4 h-4" />
                        <span>Tasks</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                        {project.completedTasks} / {project.totalTasks}
                    </span>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Progress</span>
                        <span className="font-semibold text-gray-800">
                            {project.progressPercentage}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                                project.progressPercentage === 100
                                    ? 'bg-green-600'
                                    : 'bg-blue-600'
                            }`}
                            style={{ width: `${project.progressPercentage}%` }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}