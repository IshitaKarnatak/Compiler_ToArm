
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Upload, File, Code } from 'lucide-react';
import { useRef } from 'react';

interface SidebarProps {
  onFileUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onLoadSample: () => void;
  onReset: () => void;
  theme: string;
}

const Sidebar = ({ onFileUpload, onLoadSample, onReset, theme }: SidebarProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getIconColor = () => {
    return theme === 'cyberpunk' ? 'text-neon-blue hover:text-neon-violet' :
           theme === 'matrix' ? 'text-neon-green hover:text-green-400' :
           'text-white hover:text-blue-300';
  };

  const getButtonClass = () => {
    return `
      glass-panel border-2 hover:scale-105 transition-all duration-300 w-12 h-12 p-0
      ${theme === 'cyberpunk' ? 'border-neon-blue/30 hover:border-neon-violet hover:neon-glow' :
        theme === 'matrix' ? 'border-neon-green/30 hover:border-neon-green' :
        'border-white/30 hover:border-blue-400'
      }
    `;
  };

  return (
    <TooltipProvider>
      <div className={`
        w-16 glass-panel border-r flex flex-col items-center py-4 space-y-4
        ${theme === 'cyberpunk' ? 'border-neon-blue/20' :
          theme === 'matrix' ? 'border-neon-green/20' :
          'border-white/20'
        }
      `}>
        {/* Upload File */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className={getButtonClass()}
            >
              <Upload className={`w-5 h-5 ${getIconColor()}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Upload C File</p>
          </TooltipContent>
        </Tooltip>

        {/* Sample Code */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onLoadSample}
              className={getButtonClass()}
            >
              <File className={`w-5 h-5 ${getIconColor()}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Load Sample Code</p>
          </TooltipContent>
        </Tooltip>

        {/* Reset Editor */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onReset}
              className={getButtonClass()}
            >
              <Code className={`w-5 h-5 ${getIconColor()}`} />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Reset Editor</p>
          </TooltipContent>
        </Tooltip>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".c"
          onChange={onFileUpload}
          className="hidden"
        />

        {/* Theme indicator */}
        <div className="mt-auto">
          <div className={`
            w-8 h-8 rounded-full border-2 flex items-center justify-center text-xs font-bold
            ${theme === 'cyberpunk' ? 'border-neon-blue text-neon-blue bg-neon-blue/10' :
              theme === 'matrix' ? 'border-neon-green text-neon-green bg-neon-green/10' :
              'border-white text-white bg-white/10'
            }
          `}>
            {theme === 'cyberpunk' ? '🌆' :
             theme === 'matrix' ? '🔢' :
             '✨'}
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Sidebar;
