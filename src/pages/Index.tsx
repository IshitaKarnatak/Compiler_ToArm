
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Upload, File, Code } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import ConsoleOutput from '@/components/ConsoleOutput';
import Sidebar from '@/components/Sidebar';
import ThemeProvider from '@/components/ThemeProvider';

type Theme = 'cyberpunk' | 'matrix' | 'minimal';

const Index = () => {
  const [theme, setTheme] = useState<Theme>('cyberpunk');
  const [code, setCode] = useState(`#include <stdio.h>

int main() {
    int a = 10;
    int b = 20;
    int sum = a + b;
    
    printf("Sum: %d\\n", sum);
    return 0;
}`);
  const [output, setOutput] = useState('');
  const [isCompiling, setIsCompiling] = useState(false);
  const [compilationSuccess, setCompilationSuccess] = useState<boolean | null>(null);
  const { toast } = useToast();
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    // Initialize audio context for sound effects
    audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
  }, []);

  const playSound = (frequency: number, duration: number, type: 'success' | 'error') => {
    if (!audioContextRef.current) return;
    
    const oscillator = audioContextRef.current.createOscillator();
    const gainNode = audioContextRef.current.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContextRef.current.destination);
    
    oscillator.frequency.setValueAtTime(frequency, audioContextRef.current.currentTime);
    oscillator.type = type === 'success' ? 'sine' : 'sawtooth';
    
    gainNode.gain.setValueAtTime(0.1, audioContextRef.current.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContextRef.current.currentTime + duration);
    
    oscillator.start(audioContextRef.current.currentTime);
    oscillator.stop(audioContextRef.current.currentTime + duration);
  };

  const simulateCompilation = async () => {
    setIsCompiling(true);
    setOutput('');
    setCompilationSuccess(null);

    // Simulate compilation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate compilation result (90% success rate)
    const success = Math.random() > 0.1;
    
    if (success) {
      const armCode = `
.section .data
    msg: .ascii "Sum: %d\\n\\0"

.section .text
.global _start

_start:
    // Load values
    mov x0, #10        // a = 10
    mov x1, #20        // b = 20
    add x2, x0, x1     // sum = a + b
    
    // Prepare for printf
    adr x0, msg
    mov x1, x2
    bl printf
    
    // Exit
    mov x0, #0
    mov x8, #93        // exit syscall
    svc #0

.section .bss
`;
      setOutput(armCode);
      setCompilationSuccess(true);
      playSound(800, 0.3, 'success');
      toast({
        title: "Compilation Successful! ⚡",
        description: "Your C code has been compiled to ARMv8 assembly.",
      });
    } else {
      const errorOutput = `
error: undefined reference to 'undeclared_function'
   --> main.c:7:5
    |
7   |     undeclared_function();
    |     ^^^^^^^^^^^^^^^^^^
    |
error: compilation failed
make: *** [main] Error 1
`;
      setOutput(errorOutput);
      setCompilationSuccess(false);
      playSound(200, 0.5, 'error');
      toast({
        title: "Compilation Failed ❌",
        description: "There are errors in your code. Check the console output.",
        variant: "destructive",
      });
    }

    setIsCompiling(false);
  };

  const loadSampleCode = () => {
    const samples = [
      `#include <stdio.h>

int factorial(int n) {
    if (n <= 1) return 1;
    return n * factorial(n - 1);
}

int main() {
    int num = 5;
    printf("Factorial of %d is %d\\n", num, factorial(num));
    return 0;
}`,
      `#include <stdio.h>

int main() {
    int arr[5] = {1, 2, 3, 4, 5};
    int sum = 0;
    
    for (int i = 0; i < 5; i++) {
        sum += arr[i];
    }
    
    printf("Array sum: %d\\n", sum);
    return 0;
}`,
      `#include <stdio.h>
#include <string.h>

int main() {
    char str[] = "Hello, ToARM!";
    int len = strlen(str);
    
    printf("String: %s\\n", str);
    printf("Length: %d\\n", len);
    return 0;
}`
    ];
    
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setCode(randomSample);
    
    toast({
      title: "Sample Code Loaded! 📝",
      description: "A new code sample has been loaded into the editor.",
    });
  };

  const resetEditor = () => {
    setCode('');
    setOutput('');
    setCompilationSuccess(null);
    
    toast({
      title: "Editor Reset! 🔄",
      description: "The editor has been cleared.",
    });
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.name.endsWith('.c')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setCode(content);
        toast({
          title: "File Uploaded! 📁",
          description: `${file.name} has been loaded into the editor.`,
        });
      };
      reader.readAsText(file);
    } else {
      toast({
        title: "Invalid File Type ❌",
        description: "Please upload a .c file.",
        variant: "destructive",
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <div className={`min-h-screen font-cyber transition-all duration-500 ${
        theme === 'cyberpunk' ? 'bg-gradient-to-br from-cyber-dark via-cyber-darker to-cyber-gray' :
        theme === 'matrix' ? 'bg-black matrix-bg' :
        'minimal-bg'
      }`}>
        {/* Header */}
        <header className="glass-panel border-b border-neon-blue/20 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className={`text-3xl font-black tracking-wider ${
                theme === 'cyberpunk' ? 'text-neon-blue animate-neon-flicker' :
                theme === 'matrix' ? 'text-neon-green' :
                'text-white'
              }`}>
                ⚡ ToARM
              </h1>
              <span className="text-sm text-gray-400">
                Cyberpunk C to ARM Compiler
              </span>
            </div>
            
            <div className="flex items-center space-x-4">
              <Select value={theme} onValueChange={(value: Theme) => setTheme(value)}>
                <SelectTrigger className="w-40 glass-panel border-neon-violet/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-panel border-neon-violet/50">
                  <SelectItem value="cyberpunk">🌆 Cyberpunk</SelectItem>
                  <SelectItem value="matrix">🔢 Matrix</SelectItem>
                  <SelectItem value="minimal">✨ Minimal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </header>

        <div className="flex h-[calc(100vh-80px)]">
          {/* Sidebar */}
          <Sidebar
            onFileUpload={handleFileUpload}
            onLoadSample={loadSampleCode}
            onReset={resetEditor}
            theme={theme}
          />

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Code Editor Panel */}
            <div className="flex-1 p-4">
              <Card className="h-full glass-panel border-neon-blue/30 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className={`p-3 border-b border-neon-blue/20 flex items-center justify-between ${
                    theme === 'cyberpunk' ? 'bg-cyber-gray/50' :
                    theme === 'matrix' ? 'bg-black/50' :
                    'bg-white/10'
                  }`}>
                    <h2 className={`font-semibold ${
                      theme === 'cyberpunk' ? 'text-neon-blue' :
                      theme === 'matrix' ? 'text-neon-green' :
                      'text-white'
                    }`}>
                      C Source Code
                    </h2>
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                  
                  <CodeEditor
                    value={code}
                    onChange={setCode}
                    theme={theme}
                  />
                </div>
              </Card>
            </div>

            {/* Output Panel */}
            <div className="flex-1 p-4">
              <Card className="h-full glass-panel border-neon-violet/30 overflow-hidden">
                <div className="h-full flex flex-col">
                  <div className={`p-3 border-b border-neon-violet/20 flex items-center justify-between ${
                    theme === 'cyberpunk' ? 'bg-cyber-gray/50' :
                    theme === 'matrix' ? 'bg-black/50' :
                    'bg-white/10'
                  }`}>
                    <h2 className={`font-semibold ${
                      theme === 'cyberpunk' ? 'text-neon-violet' :
                      theme === 'matrix' ? 'text-neon-green' :
                      'text-white'
                    }`}>
                      ARM Assembly Output
                    </h2>
                    {compilationSuccess !== null && (
                      <div className={`px-2 py-1 rounded text-xs ${
                        compilationSuccess 
                          ? 'bg-green-500/20 text-green-400' 
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {compilationSuccess ? '✅ SUCCESS' : '❌ ERROR'}
                      </div>
                    )}
                  </div>
                  
                  <ConsoleOutput
                    output={output}
                    isCompiling={isCompiling}
                    success={compilationSuccess}
                    theme={theme}
                  />
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Floating Compile Button */}
        <div className="fixed bottom-8 right-8">
          <Button
            onClick={simulateCompilation}
            disabled={isCompiling}
            className={`
              px-8 py-4 text-lg font-bold rounded-lg transition-all duration-300
              ${isCompiling ? 'animate-compile-pulse' : 'hover:scale-105'}
              ${theme === 'cyberpunk' 
                ? 'bg-gradient-to-r from-neon-blue to-neon-violet hover:from-neon-violet hover:to-neon-blue border-2 border-neon-blue neon-glow' 
                : theme === 'matrix'
                ? 'bg-gradient-to-r from-neon-green to-green-600 hover:from-green-600 hover:to-neon-green border-2 border-neon-green'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600'
              }
            `}
          >
            {isCompiling ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Compiling...
              </>
            ) : (
              <>⚡ Compile</>
            )}
          </Button>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
