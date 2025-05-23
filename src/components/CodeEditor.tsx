
import { useEffect, useRef, useState } from 'react';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  theme: string;
}

const CodeEditor = ({ value, onChange, theme }: CodeEditorProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [lineNumbers, setLineNumbers] = useState<number[]>([]);

  useEffect(() => {
    const lines = value.split('\n').length;
    setLineNumbers(Array.from({ length: lines }, (_, i) => i + 1));
  }, [value]);

  const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
    const lineNumbersEl = document.querySelector('.line-numbers');
    if (lineNumbersEl) {
      lineNumbersEl.scrollTop = e.currentTarget.scrollTop;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = e.currentTarget.selectionStart;
      const end = e.currentTarget.selectionEnd;
      const newValue = value.substring(0, start) + '    ' + value.substring(end);
      onChange(newValue);
      
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      }, 0);
    }
  };

  const syntaxHighlight = (code: string) => {
    const keywords = ['#include', 'int', 'char', 'float', 'double', 'void', 'if', 'else', 'while', 'for', 'return', 'printf', 'scanf', 'main'];
    const types = ['stdio.h', 'stdlib.h', 'string.h'];
    
    let highlighted = code;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="text-neon-blue font-semibold">${keyword}</span>`);
    });
    
    // Highlight strings
    highlighted = highlighted.replace(/"([^"]*)"/g, '<span class="text-neon-green">"$1"</span>');
    
    // Highlight numbers
    highlighted = highlighted.replace(/\b\d+\b/g, '<span class="text-neon-violet">$&</span>');
    
    // Highlight comments
    highlighted = highlighted.replace(/\/\/.*$/gm, '<span class="text-gray-500 italic">$&</span>');
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, '<span class="text-gray-500 italic">$&</span>');
    
    return highlighted;
  };

  return (
    <div className="flex-1 relative overflow-hidden">
      <div className="absolute inset-0 flex">
        {/* Line Numbers */}
        <div className={`
          line-numbers flex-shrink-0 w-12 p-2 text-right text-sm font-code overflow-hidden
          ${theme === 'cyberpunk' ? 'bg-cyber-darker text-gray-500 border-r border-neon-blue/20' :
            theme === 'matrix' ? 'bg-black text-green-500 border-r border-neon-green/20' :
            'bg-gray-800 text-gray-400 border-r border-gray-600'
          }
        `}>
          {lineNumbers.map(num => (
            <div key={num} className="leading-6">
              {num}
            </div>
          ))}
        </div>
        
        {/* Editor Container */}
        <div className="flex-1 relative">
          {/* Syntax Highlighted Background */}
          <div 
            className={`
              absolute inset-0 p-4 font-code text-sm leading-6 pointer-events-none whitespace-pre-wrap break-words overflow-hidden
              ${theme === 'cyberpunk' ? 'text-transparent' :
                theme === 'matrix' ? 'text-transparent' :
                'text-transparent'
              }
            `}
            dangerouslySetInnerHTML={{ __html: syntaxHighlight(value) }}
          />
          
          {/* Actual Textarea */}
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className={`
              absolute inset-0 w-full h-full p-4 bg-transparent resize-none outline-none font-code text-sm leading-6
              text-transparent caret-white cyberpunk-scrollbar
              ${theme === 'cyberpunk' ? 'selection:bg-neon-blue/30' :
                theme === 'matrix' ? 'selection:bg-neon-green/30' :
                'selection:bg-blue-500/30'
              }
            `}
            placeholder="Enter your C code here..."
            spellCheck={false}
          />
          
          {/* Cursor Animation */}
          <div className={`
            absolute top-4 left-4 w-0.5 h-6 animate-cursor-blink pointer-events-none
            ${theme === 'cyberpunk' ? 'bg-neon-blue' :
              theme === 'matrix' ? 'bg-neon-green' :
              'bg-white'
            }
          `} />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
