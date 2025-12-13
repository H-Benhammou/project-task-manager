import React, { useState } from 'react';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

export const ProjectForm = ({ onSubmit, onCancel, initialData = null }) => {
    const [formData, setFormData] = useState({
        title: initialData?.title || '',
        description: initialData?.description || '',
    });

    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };


    const validate = () => {
        const newErrors = {};
        if (!formData.title.trim()) {
            newErrors.title = 'Le titre est requis';
        }
        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Titre du projet"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex: Développement site web"
                required
                error={errors.title}
            />

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Description du projet (optionnel)"
                    rows="4"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div className="flex space-x-3 pt-4">
                <Button type="submit" variant="primary" fullWidth>
                    {initialData ? 'Mettre à jour' : 'Créer le projet'}
                </Button>
                {onCancel && (
                    <Button type="button" variant="secondary" onClick={onCancel} fullWidth>
                        Annuler
                    </Button>
                )}
            </div>
        </form>
    );
};