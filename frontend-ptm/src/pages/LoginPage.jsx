import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle } from 'lucide-react';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';

export const LoginPage = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await login(formData.email, formData.password);
            navigate('/dashboard');
            // eslint-disable-next-line no-unused-vars
        } catch (err) {
            setError('Email ou mot de passe incorrect');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <CheckCircle className="w-12 h-12 text-blue-600" />
                        <span className="text-3xl font-bold text-gray-900">TaskManager</span>
                    </div>
                    <p className="text-gray-600">Connectez-vous pour gérer vos projets</p>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Connexion</h2>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Input
                            label="Adresse e-mail"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="exemple@email.com"
                            required
                        />

                        <Input
                            label="Mot de passe"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            required
                        />

                        <Button type="submit" fullWidth disabled={loading}>
                            {loading ? 'Connexion...' : 'Se connecter'}
                        </Button>
                    </form>

                    <p className="text-center text-gray-600 mt-6">
                        Vous n'avez pas de compte ?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="text-blue-600 font-medium hover:underline"
                        >
                            Créer un compte
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