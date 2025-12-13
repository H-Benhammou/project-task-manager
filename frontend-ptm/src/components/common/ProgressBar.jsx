import React from 'react';
import { getProgressColor } from '../../utils/helpers';

export const ProgressBar = ({ percentage = 0, showLabel = true }) => {
    const roundedPercentage = Math.round(percentage);
    const colorClass = getProgressColor(roundedPercentage);

    return (
        <div className="w-full">
            <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                    className={`h-full ${colorClass} transition-all duration-300 ease-in-out`}
                    style={{ width: `${roundedPercentage}%` }}
                ></div>
            </div>
            {showLabel && (
                <p className="text-sm text-gray-600 mt-1">{roundedPercentage}% complété</p>
            )}
        </div>
    );
};