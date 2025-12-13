import React from 'react';
import { X } from 'lucide-react';
import { ProjectForm } from './ProjectForm';

export const ProjectModal = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b">
                    <h2 className="text-2xl font-bold text-gray-900">
                        {initialData ? 'Modifier le projet' : 'Nouveau projet'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>
                <div className="p-6">
                    <ProjectForm
                        onSubmit={onSubmit}
                        onCancel={onClose}
                        initialData={initialData}
                    />
                </div>
            </div>
        </div>
    );
};