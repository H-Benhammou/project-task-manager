import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input';
import PasswordInput from '../components/PasswordInput';
import { signupService } from '../services/signupService';

export default function SignUpPage() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        const response = await signupService.register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        });
        
        // Store token
        localStorage.setItem('token', response.token);
        
        // Success!
        alert('Account created successfully!');
        
        // Redirect to dashboard or home
        // window.location.href = '/dashboard';
        
      } catch (error: any) {
        // Handle errors
        if (error.response?.data?.message) {
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
          <div className="flex items-center gap-2 cursor-pointer">
            <CheckCircle className="w-8 h-8 text-blue-600" />
            <span onClick={() => navigate('/')} className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Already have an account?</span>
            <button onClick={() => navigate('/login')} className="px-6 py-2 text-blue-600 border-2 border-blue-600 rounded-lg hover:bg-blue-50 transition-colors font-medium">
              Sign In
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
              Create Your Account
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of teams already using TaskFlow to manage their projects efficiently.
            </p>

            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Collaborate Seamlessly</h3>
                  <p className="text-gray-600 text-sm">Work together with your team in real-time on projects and tasks.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Track Progress</h3>
                  <p className="text-gray-600 text-sm">Monitor your team's progress with powerful analytics and reporting.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="shrink-0 w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Stay Organized</h3>
                  <p className="text-gray-600 text-sm">Keep all your projects, tasks, and files in one organized place.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Sign Up</h2>

            <div>
              <Input
                label="Name"
                type="text"
                id="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="John Doe"
                required
              />

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
                placeholder="At least 8 characters"
                required
              />

              <PasswordInput
                label="Confirm Password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                placeholder="Re-enter your password"
                required
              />

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-blue-400 disabled:cursor-not-allowed mt-2"
              >
                {isSubmitting ? 'Creating Account...' : 'Create Account'}
              </button>

              <p className="text-center text-sm text-gray-600 mt-4">
                Already have an account?{' '}
                <span className="text-blue-600 hover:underline font-medium cursor-pointer">
                  Sign In
                </span>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}