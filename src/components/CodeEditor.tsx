
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
    
    let highlighted = code;
    
    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      const color = theme === 'cyberpunk' ? 'text-neon-blue' :
                   theme === 'matrix' ? 'text-neon-green' :
                   theme === 'basic' ? 'text-basic-blue' :
                   theme === 'girly' ? 'text-girly-pink' :
                   'text-blue-400';
      highlighted = highlighted.replace(regex, `<span class="${color} font-semibold">${keyword}</span>`);
    });
    
    // Highlight strings
    const stringColor = theme === 'cyberpunk' ? 'text-neon-violet' :
                       theme === 'matrix' ? 'text-green-400' :
                       theme === 'basic' ? 'text-green-600' :
                       theme === 'girly' ? 'text-girly-rose' :
                       'text-green-400';
    highlighted = highlighted.replace(/"([^"]*)"/g, `<span class="${stringColor}">"$1"</span>`);
    
    // Highlight numbers
    const numberColor = theme === 'cyberpunk' ? 'text-neon-orange' :
                       theme === 'matrix' ? 'text-yellow-400' :
                       theme === 'basic' ? 'text-purple-600' :
                       theme === 'girly' ? 'text-girly-lavender' :
                       'text-yellow-400';
    highlighted = highlighted.replace(/\b\d+\b/g, `<span class="${numberColor}">$&</span>`);
    
    // Highlight comments
    const commentColor = theme === 'cyberpunk' ? 'text-gray-400' :
                        theme === 'matrix' ? 'text-green-600' :
                        theme === 'basic' ? 'text-gray-500' :
                        theme === 'girly' ? 'text-pink-300' :
                        'text-gray-400';
    highlighted = highlighted.replace(/\/\/.*$/gm, `<span class="${commentColor} italic">$&</span>`);
    highlighted = highlighted.replace(/\/\*[\s\S]*?\*\//g, `<span class="${commentColor} italic">$&</span>`);
    
    return highlighted;
  };

  const getEditorBackgroundClass = () => {
    return theme === 'cyberpunk' ? 'bg-cyber-darker' :
           theme === 'matrix' ? 'bg-black' :
           theme === 'basic' ? 'bg-white' :
           theme === 'girly' ? 'bg-pink-50' :
           'bg-gray-900';
  };

  const getLineNumbersClass = () => {
    return theme === 'cyberpunk' ? 'bg-cyber-dark text-gray-400 border-neon-blue/20' :
           theme === 'matrix' ? 'bg-black text-green-500 border-neon-green/20' :
           theme === 'basic' ? 'bg-gray-100 text-gray-600 border-basic-blue/20' :
           theme === 'girly' ? 'bg-pink-100 text-girly-pink border-girly-pink/20' :
           'bg-gray-800 text-gray-400 border-gray-600';
  };

  const getTextColor = () => {
    return theme === 'cyberpunk' ? 'text-white' :
           theme === 'matrix' ? 'text-neon-green' :
           theme === 'basic' ? 'text-gray-900' :
           theme === 'girly' ? 'text-gray-800' :
           'text-white';
  };

  const getCaretColor = () => {
    return theme === 'cyberpunk' ? 'caret-neon-blue' :
           theme === 'matrix' ? 'caret-neon-green' :
           theme === 'basic' ? 'caret-basic-blue' :
           theme === 'girly' ? 'caret-girly-pink' :
           'caret-white';
  };

  return (
    <div className={`flex-1 relative overflow-hidden ${getEditorBackgroundClass()}`}>
      <div className="absolute inset-0 flex">
        {/* Line Numbers */}
        <div className={`
          line-numbers flex-shrink-0 w-12 p-2 text-right text-sm font-code overflow-hidden border-r
          ${getLineNumbersClass()}
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
              ${getTextColor()}
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
              text-transparent cyberpunk-scrollbar ${getCaretColor()}
              ${theme === 'cyberpunk' ? 'selection:bg-neon-blue/30' :
                theme === 'matrix' ? 'selection:bg-neon-green/30' :
                theme === 'basic' ? 'selection:bg-basic-blue/30' :
                theme === 'girly' ? 'selection:bg-girly-pink/30' :
                'selection:bg-blue-500/30'
              }
            `}
            placeholder="Enter your C code here..."
            spellCheck={false}
          />
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
