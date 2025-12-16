import React from 'react';
import { CheckCircle2, Clock, Trash2, AlertCircle } from 'lucide-react';
import { type Task, TaskStatus, taskService } from '../services/taskService';

interface TaskCardProps {
  task: Task;
  onComplete: (taskId: number) => void;
  onDelete: (taskId: number) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onDelete }) => {
  const isCompleted = task.status === TaskStatus.COMPLETED;
  const isOverdue = taskService.isOverdue(task);

  return (
    <div className={`bg-white rounded-lg border-2 p-4 transition-all hover:shadow-md ${
      isCompleted ? 'border-green-200 bg-green-50' : 'border-gray-200'
    }`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onComplete(task.id)}
            disabled={isCompleted}
            className={`mt-0.5 shrink-0 ${
              isCompleted
                ? 'text-green-600 cursor-default'
                : 'text-gray-400 hover:text-green-600 cursor-pointer'
            }`}
          >
            <CheckCircle2 className={`w-6 h-6 ${isCompleted ? 'fill-green-600' : ''}`} />
          </button>

          <div className="flex-1 min-w-0">
            <h3 className={`font-semibold text-gray-900 mb-1 ${
              isCompleted ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            
            {task.description && (
              <p className={`text-sm text-gray-600 mb-2 ${
                isCompleted ? 'line-through' : ''
              }`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 flex-wrap">
              {task.dueDate && (
                <div className={`flex items-center gap-1 text-sm ${
                  isOverdue 
                    ? 'text-red-600' 
                    : isCompleted 
                    ? 'text-gray-400' 
                    : 'text-gray-500'
                }`}>
                  {isOverdue ? (
                    <AlertCircle className="w-4 h-4" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  <span>{taskService.formatDate(task.dueDate)}</span>
                  {isOverdue && <span className="font-semibold ml-1">Overdue</span>}
                </div>
              )}

              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                isCompleted
                  ? 'bg-green-100 text-green-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {isCompleted ? 'Completed' : 'In Progress'}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => onDelete(task.id)}
          className="text-gray-400 hover:text-red-600 transition-colors p-1"
          title="Delete task"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};