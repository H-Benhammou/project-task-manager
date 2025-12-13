import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const RegisterPage = () => {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const validate = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email invalide';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setLoading(true);

        try {
            await register(formData.name, formData.email, formData.password);
            navigate('/dashboard');
        } catch (error) {
            setErrors({
                general: error.response?.data?.message || 'Erreur lors de l\'inscription. L\'email existe peut-être déjà.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <CheckCircle className="w-12 h-12 text-blue-600" />
                        <span className="text-3xl font-bold text-gray-900">TaskManager</span>
                    </div>
                    <p className="text-gray-600">Créez votre compte pour commencer</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un compte</h2>

                    {errors.general && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {errors.general}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Nom complet"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="John Doe"
                            required
                            error={errors.name}
                        />

                        <Input
                            label="Adresse e-mail"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            required
                            error={errors.email}
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            error={errors.password}
                        />

                        <Input
                            label="Confirmer le mot de passe"
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                            error={errors.confirmPassword}
                        />

                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Création...' : 'Créer un compte'}
                        </Button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Vous avez déjà un compte ?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Se connecter
                        </button>
                    </p>

                    <button
                        onClick={() => navigate('/')}
                        className="text-center w-full text-blue-600 text-sm mt-4 hover:underline"
                    >
                        ← Retour à l'accueil
                    </button>
                </div>
            </div>
        </div>
    );
};