// src/pages/LoginPage.tsx
import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { loginService } from '../services/loginService';

export default function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Clear any existing tokens when component mounts
  useEffect(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (errors[id]) {
      setErrors(prev => ({ ...prev, [id]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await loginService.login({
          email: formData.email,
          password: formData.password,
        });
        
        console.log('Login successful:', response);

        // Redirect to dashboard
        navigate('/dashboard');
        
      } catch (error: any) {
        console.error('Login error:', error);
        
        // Handle errors
        if (error.response?.status === 401) {
          setErrors({ email: 'Invalid email or password' });
        } else if (error.response?.data?.message) {
          setErrors({ email: error.response.data.message });
        } else {
          setErrors({ email: 'Something went wrong. Please try again.' });
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div 
            onClick={() => navigate('/')}
            className="flex items-center gap-2 cursor-pointer"
          >
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Don't have an account?</span>
            <button 
              onClick={() => navigate('/signup')}
              className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium"
            >
              Sign Up
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side - Info */}
          <div className="lg:sticky lg:top-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Welcome Back
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Sign in to your account to continue managing your projects and collaborating with your team.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Secure Access</h3>
                  <p className="text-gray-600 text-sm">Your data is protected with industry-standard encryption.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Instant Sync</h3>
                  <p className="text-gray-600 text-sm">Access your projects from anywhere, anytime.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Team Collaboration</h3>
                  <p className="text-gray-600 text-sm">Work seamlessly with your team in real-time.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign In</h2>

            <div>
              <Input
                label="Email Address"
                type="email"
                id="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="john.doe@company.com"
                required
              />

              <PasswordInput
                label="Password"
                id="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
                required
              />

              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Don't have an account?{' '}
                <span 
                  onClick={() => navigate('/signup')}
                  className="text-blue-600 hover:underline font-medium cursor-pointer"
                >
                  Sign Up
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}