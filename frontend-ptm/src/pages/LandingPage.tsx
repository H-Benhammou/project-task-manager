import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function ProjectManagementLanding() {

    const navigate = useNavigate();
    
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span 
            onClick={() => navigate('/')}
            className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <nav className="flex items-center gap-8">
            <a href="#" className="text-gray-600 hover:text-gray-900">Projects</a>
            <a href="#" className="text-gray-600 hover:text-gray-900">Services</a>
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Sign In
            </button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block mb-4">
              <span className="text-blue-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Your new project companion
              </span>
            </div>
            
            <h1 className="text-5xl font-bold text-gray-900 mb-6">
              Work faster, go further,{' '}
              <span className="text-blue-600">without stress.</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8">
              Plan your projects in just a few clicks, track your team's progress, and benefit from a modern and intuitive platform.
            </p>
          </div>

          {/* Right Content - Sign Up Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Get Started Today
            </h2>
            
            <p className="text-gray-600 mb-6">
              To manage your projects and collaborate with your team, please sign in. If you don't have an account yet, create one in just a few moments.
            </p>

            <div className="flex gap-4 mb-6">
              <button 
                onClick={() => navigate('/login')}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
               className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-medium">
                Create Account
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Once connected, you'll be able to create projects, track tasks, and collaborate with your team in real-time.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}