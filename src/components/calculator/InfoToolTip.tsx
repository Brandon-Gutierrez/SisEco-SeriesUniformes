import React, { useState } from 'react';
import { Info } from 'lucide-react';
import { VARIABLE_DESCRIPTIONS } from '@/constants/seriesTypes';

interface InfoTooltipProps {
  variable: keyof typeof VARIABLE_DESCRIPTIONS;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ variable }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <div className="relative inline-block ml-2">
      <button 
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onClick={() => setShowTooltip(!showTooltip)}
        className="focus:outline-none"
      >
        <Info className="w-4 h-4 text-blue-600" />
      </button>
      
      {showTooltip && (
        <div className="absolute z-50 bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-64 p-3 bg-white border border-blue-200 rounded-md shadow-lg">
          <p className="text-sm text-gray-700">
            {VARIABLE_DESCRIPTIONS[variable] || 'Descripción no disponible'}
          </p>
        </div>
      )}
    </div>
  );
};

export default InfoTooltip;