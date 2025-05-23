
import { useEffect, useState } from 'react';

interface ConsoleOutputProps {
  output: string;
  isCompiling: boolean;
  success: boolean | null;
  theme: string;
}

const ConsoleOutput = ({ output, isCompiling, success, theme }: ConsoleOutputProps) => {
  const [displayedOutput, setDisplayedOutput] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (output) {
      setDisplayedOutput('');
      setCurrentIndex(0);
    }
  }, [output]);

  useEffect(() => {
    if (output && currentIndex < output.length) {
      const timer = setTimeout(() => {
        setDisplayedOutput(output.substring(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, 20);
      return () => clearTimeout(timer);
    }
  }, [output, currentIndex]);

  const getPromptSymbol = () => {
    if (theme === 'matrix') return '$ ';
    if (theme === 'cyberpunk') return '> ';
    return '# ';
  };

  const getTextColor = () => {
    if (success === false) {
      return theme === 'cyberpunk' ? 'text-red-400' :
             theme === 'matrix' ? 'text-red-500' :
             'text-red-300';
    }
    return theme === 'cyberpunk' ? 'text-neon-blue' :
           theme === 'matrix' ? 'text-neon-green' :
           'text-white';
  };

  const renderLoadingDots = () => {
    const [dots, setDots] = useState('');
    
    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      
      return () => clearInterval(interval);
    }, []);
    
    return dots;
  };

  const LoadingDots = renderLoadingDots;

  return (
    <div className={`
      flex-1 p-4 font-code text-sm overflow-auto cyberpunk-scrollbar
      ${theme === 'cyberpunk' ? 'bg-cyber-darker/50' :
        theme === 'matrix' ? 'bg-black/80' :
        'bg-gray-900/50'
      }
    `}>
      {isCompiling ? (
        <div className="space-y-2">
          <div className={`flex items-center ${getTextColor()}`}>
            <span className="mr-2">{getPromptSymbol()}</span>
            <span>Initializing ToARM compiler</span>
            <LoadingDots />
          </div>
          <div className={`flex items-center ${getTextColor()} ml-4`}>
            <span className="mr-2">→</span>
            <span>Parsing C source code</span>
            <LoadingDots />
          </div>
          <div className={`flex items-center ${getTextColor()} ml-4`}>
            <span className="mr-2">→</span>
            <span>Generating ARM assembly</span>
            <LoadingDots />
          </div>
          <div className={`flex items-center ${getTextColor()} ml-4`}>
            <span className="mr-2">→</span>
            <span>Optimizing code</span>
            <LoadingDots />
          </div>
          
          {/* Matrix-style loading animation */}
          {theme === 'matrix' && (
            <div className="mt-4 opacity-30">
              <div className="animate-matrix-rain text-neon-green text-xs">
                010101 010001 010101 010001 010101
              </div>
            </div>
          )}
          
          {/* Cyberpunk loading bars */}
          {theme === 'cyberpunk' && (
            <div className="mt-4 space-y-1">
              <div className="h-1 bg-neon-blue/20 rounded">
                <div className="h-full bg-neon-blue rounded animate-pulse w-3/4"></div>
              </div>
              <div className="h-1 bg-neon-violet/20 rounded">
                <div className="h-full bg-neon-violet rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          )}
        </div>
      ) : output ? (
        <div className="space-y-1">
          <div className={`flex items-center ${getTextColor()}`}>
            <span className="mr-2">{getPromptSymbol()}</span>
            <span>
              {success ? 'Compilation completed successfully!' : 'Compilation failed:'}
            </span>
          </div>
          
          <div className="mt-2">
            <pre className={`whitespace-pre-wrap ${getTextColor()}`}>
              {displayedOutput}
              {currentIndex < output.length && (
                <span className={`
                  animate-cursor-blink
                  ${theme === 'cyberpunk' ? 'text-neon-blue' :
                    theme === 'matrix' ? 'text-neon-green' :
                    'text-white'
                  }
                `}>
                  ▋
                </span>
              )}
            </pre>
          </div>
          
          {success && currentIndex >= output.length && (
            <div className="mt-4 p-3 rounded border-l-4 border-green-500 bg-green-500/10">
              <div className="text-green-400 text-sm">
                ✅ Ready for execution on ARMv8 architecture
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className={`text-gray-500 italic ${theme === 'matrix' ? 'text-green-500/50' : ''}`}>
          <div className="flex items-center">
            <span className="mr-2">{getPromptSymbol()}</span>
            <span>Waiting for compilation...</span>
          </div>
          <div className="mt-2 text-xs opacity-70">
            Click the ⚡ Compile button to transform your C code into ARM assembly
          </div>
        </div>
      )}
    </div>
  );
};

export default ConsoleOutput;
