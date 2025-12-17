import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  FolderKanban, 
  ListTodo, 
  TrendingUp, 
  Lock, 
  Users, 
  Calendar,
  Target,
  BarChart3,
  Trash2,
  Edit,
  Plus
} from 'lucide-react';

export default function ProjectManagementLanding() {
  const navigate = useNavigate();

  const coreFeatures = [
    {
      icon: Lock,
      title: 'Secure Authentication',
      description: 'JWT-based authentication system ensuring your data is protected. Login with email and password to access your personalized workspace.',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Create and organize unlimited projects with titles and descriptions. View all your projects in one centralized dashboard.',
      color: 'bg-blue-100 text-blue-600'
    },
    {
      icon: ListTodo,
      title: 'Task Organization',
      description: 'Add detailed tasks to each project with titles, descriptions, and due dates. Keep everything organized and on track.',
      color: 'bg-green-100 text-green-600'
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Real-time progress calculation showing total tasks, completed tasks, and completion percentage for each project.',
      color: 'bg-orange-100 text-orange-600'
    }
  ];

  const capabilities = [
    {
      icon: Plus,
      title: 'Create Projects',
      description: 'Launch new projects instantly with custom titles and descriptions'
    },
    {
      icon: Edit,
      title: 'Edit & Update',
      description: 'Modify project details and task information whenever needed'
    },
    {
      icon: CheckCircle,
      title: 'Mark Complete',
      description: 'Track progress by marking tasks as completed with a single click'
    },
    {
      icon: Trash2,
      title: 'Delete Items',
      description: 'Remove tasks or projects that are no longer needed'
    },
    {
      icon: Calendar,
      title: 'Due Dates',
      description: 'Set and manage deadlines to keep your projects on schedule'
    },
    {
      icon: BarChart3,
      title: 'Visual Progress',
      description: 'See progress bars and statistics for all your projects'
    }
  ];
    
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span 
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-gray-900 cursor-pointer hover:text-blue-600 transition-colors"
            >
              TaskFlow
            </span>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-32">
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
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="flex-1 px-6 py-3 bg-white text-gray-700 border-2 border-gray-300 rounded-lg hover:border-gray-400 transition-colors font-medium"
              >
                Create Account
              </button>
            </div>

            <p className="text-sm text-gray-500">
              Once connected, you'll be able to create projects, track tasks, and collaborate with your team in real-time.
            </p>
          </div>
        </div>

        {/* Services Section */}
        <section id="services" className="scroll-mt-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-4">
              <span className="text-blue-600 font-medium flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                Full-Stack Project Management Solution
              </span>
            </div>
            
            <h2 className="text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to{' '}
              <span className="text-blue-600">Manage Projects</span>
            </h2>
            
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              A comprehensive task management platform built with modern technologies. 
              Streamline your workflow, track progress, and achieve your goals efficiently.
            </p>
          </div>

          {/* Core Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
            {coreFeatures.map((feature, index) => (
              <div 
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-14 h-14 ${feature.color} rounded-lg flex items-center justify-center mb-4`}>
                  <feature.icon className="w-7 h-7" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Capabilities Section */}
          <div className="bg-white rounded-2xl shadow-xl p-12 mb-20">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Powerful Capabilities
              </h3>
              <p className="text-lg text-gray-600">
                Complete CRUD operations for projects and tasks with intuitive controls
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {capabilities.map((capability, index) => (
                <div key={index} className="flex gap-4">
                  <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center shrink-0">
                    <capability.icon className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {capability.title}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {capability.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Technical Excellence Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="bg-linear-to-br from-blue-600 to-blue-700 rounded-2xl shadow-xl p-10 text-white">
              <Target className="w-12 h-12 mb-4 opacity-90" />
              <h3 className="text-2xl font-bold mb-4">Built with Best Practices</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Clean, maintainable code structure</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Comprehensive input validation</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Robust error handling</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>RESTful API architecture</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  <span>Real-time progress calculation</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-10 border border-gray-200">
              <Users className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">User-Centric Design</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                  <span>Intuitive, modern user interface</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                  <span>Responsive design for all devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                  <span>Visual progress indicators</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                  <span>Seamless navigation experience</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-5 h-5 mt-0.5 shrink-0 text-blue-600" />
                  <span>Real-time updates and feedback</span>
                </li>
              </ul>
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-linear-to-r from-blue-600 to-blue-700 rounded-2xl shadow-2xl p-12 text-center text-white">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Project Management?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Join TaskFlow to organize and track your projects effectively
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button 
                onClick={() => navigate('/signup')}
                className="px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors font-semibold text-lg"
              >
                Get Started Now
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-8 py-3 bg-blue-800 text-white rounded-lg hover:bg-blue-900 transition-colors font-semibold text-lg"
              >
                Sign In
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}