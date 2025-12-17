// Save this as: frontend-ptm/src/pages/CreateProjectPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FolderKanban, AlertCircle } from 'lucide-react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { projectService } from '../services/projectService';
import { loginService } from '../services/loginService';

export default function CreateProjectPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!loginService.isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Get user info
    const currentUser = loginService.getCurrentUser();
    setUser(currentUser);
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Project title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Project title must be at least 3 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await projectService.createProject({
          title: formData.title.trim(),
          description: formData.description.trim(),
        });

        // Success! Navigate back to dashboard with updated data
        navigate('/dashboard');
      } catch (err: any) {
        console.error('Error creating project:', err);
        setErrors({
          title: err.response?.data?.message || 'Failed to create project. Please try again.',
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto">
        {/* Back Button */}
        <button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back to Dashboard</span>
        </button>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Project</h1>
          <p className="text-gray-600">
            Start a new project to organize your tasks and track progress
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <FolderKanban className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Project Details</h2>
              <p className="text-sm text-gray-500">Fill in the information below</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {/* Project Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Project Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Website Redesign, Mobile App Development"
                className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && (
                <div className="flex items-center gap-1 mt-2 text-red-500 text-sm">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.title}</span>
                </div>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Choose a clear, descriptive name for your project
              </p>
            </div>

            {/* Project Description */}
            <div className="mb-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-gray-400">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe the project goals, scope, or any important details..."
                rows={5}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              />
              <p className="text-sm text-gray-500 mt-2">
                Add context to help your team understand the project
              </p>
            </div>

            {/* Info Box */}
            <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <FolderKanban className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-blue-900 mb-1">
                    What happens next?
                  </h4>
                  <p className="text-sm text-blue-700">
                    After creating your project, you'll be able to add tasks, track progress, and manage everything in one place.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  'Create Project'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Tips Section */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Success</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">1</span>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Keep titles concise:</span> Use clear, specific names that everyone can understand at a glance.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">2</span>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Add details in description:</span> Include goals, deadlines, or key requirements to keep everyone aligned.
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <span className="text-green-600 font-bold text-sm">3</span>
              </div>
              <div>
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Break it down:</span> After creating the project, add tasks to make progress trackable and manageable.
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}