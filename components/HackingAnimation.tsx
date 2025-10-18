import React, { useState, useEffect } from 'react';

interface HackingAnimationProps {
  targetName: string;
  result: string | null;
}

const HackingAnimation: React.FC<HackingAnimationProps> = ({ targetName, result }) => {
    const [text, setText] = useState('');
    const [isComplete, setIsComplete] = useState(false);
    
    const lines = [
        '// Initializing neural link...',
        `>> Pinging target mainframe: ${targetName}... ACK`,
        '// Their firewall is... quaint. LOL. 🤣',
        '>> Deploying icebreaker script: `bypass-security.exe`...',
        '// Analyzing encryption... Is that ROT13? Seriously?',
        '>> Gaining root access... You\'re in. Too easy. 🙄',
        '// Locating creds vault: `C:\\Users\\${targetName}\\NotStonks`',
        '>> Siphoning creds... yoink! 💸',
        '// Covering tracks with cat memes... 😼',
        '// Disconnecting... Ghost protocol engaged.'
    ];

    useEffect(() => {
        if (result || isComplete) return;
        
        let lineIndex = 0;
        const intervalId = setInterval(() => {
            if (lineIndex < lines.length) {
                setText(prev => prev + lines[lineIndex] + '\n');
                lineIndex++;
            } else {
                clearInterval(intervalId);
                setIsComplete(true);
            }
        }, 300);

        return () => clearInterval(intervalId);
    }, [result, isComplete]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50 animate-fadeIn">
            <div className="w-full max-w-2xl h-64 bg-black border-2 border-green-500 rounded-lg p-4 font-mono text-green-500 overflow-y-auto shadow-lg shadow-green-500/20">
                <pre>{text}</pre>
                {result && <p className={`mt-4 text-2xl font-bold animate-pulse ${result.startsWith('Success') ? 'text-cyan-400' : 'text-red-500'}`}>{result}</p>}
            </div>
             <p className="mt-4 text-xl text-white font-orbitron">Hacking {targetName}...</p>
        </div>
    );
};

export default HackingAnimation;