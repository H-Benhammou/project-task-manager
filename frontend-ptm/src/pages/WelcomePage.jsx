import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Button } from '../components/common/Button';

export const WelcomePage = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-2">
                            <CheckCircle className="w-8 h-8 text-blue-600" />
                            <span className="text-2xl font-bold text-gray-900">TaskManager</span>
                        </div>
                        <Button onClick={() => navigate('/login')}>
                            Se connecter
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <div className="inline-block mb-4">
              <span className="bg-blue-100 text-blue-600 px-4 py-2 rounded-full text-sm font-medium">
                🚀 Votre compagnon de productivité
              </span>
                        </div>

                        <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Gérez vos projets,{' '}
                            <span className="text-blue-600">sans stress.</span>
                        </h1>

                        <p className="text-xl text-gray-600 mb-8">
                            Organisez vos projets, suivez vos tâches et visualisez votre progression en temps réel.
                        </p>

                        <div className="grid grid-cols-3 gap-6">
                            <div>
                                <div className="text-3xl font-bold text-gray-900">100+</div>
                                <div className="text-sm text-gray-600">Projets</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">24/7</div>
                                <div className="text-sm text-gray-600">Disponible</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold text-gray-900">Eco</div>
                                <div className="text-sm text-gray-600">Zéro papier</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">
                            Commencez maintenant
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Créez votre compte et commencez à organiser vos projets en quelques clics.
                        </p>
                        <Button fullWidth onClick={() => navigate('/register')} className="mb-3">
                            Créer un compte
                        </Button>
                        <Button fullWidth variant="outline" onClick={() => navigate('/login')}>
                            J'ai déjà un compte
                        </Button>
                    </div>
                </div>
            </div>

            {/* Features */}
            <div className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Fonctionnalités principales
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                            <CheckCircle className="w-12 h-12 text-blue-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Gestion de projets</h3>
                            <p className="text-gray-600">
                                Créez et organisez vos projets facilement avec un titre et une description.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                            <Clock className="w-12 h-12 text-green-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Suivi des tâches</h3>
                            <p className="text-gray-600">
                                Ajoutez des tâches avec dates d'échéance et marquez-les comme terminées.
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                            <TrendingUp className="w-12 h-12 text-purple-600 mb-4" />
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Progression</h3>
                            <p className="text-gray-600">
                                Visualisez le pourcentage d'avancement de chaque projet en temps réel.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};