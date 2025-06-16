import React from 'react';
import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { VARIABLE_DESCRIPTIONS } from '@/constants/seriesTypes';

interface InfoTooltipProps {
  variable: keyof typeof VARIABLE_DESCRIPTIONS;
}

const InfoTooltip: React.FC<InfoTooltipProps> = ({ variable }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Info className="w-4 h-4 text-blue-600 cursor-pointer ml-2" />
        </TooltipTrigger>
        <TooltipContent 
          className="max-w-xs bg-white border border-blue-200 shadow-lg z-[99999]" 
          side="top"
          align="start"
          avoidCollisions={true}
        >
          <p className="text-sm text-gray-700">
            {VARIABLE_DESCRIPTIONS[variable] || 'Descripción no disponible'}
          </p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default InfoTooltip;