import React, { useState, useMemo } from 'react';
import { useGameState } from '../contexts/GameStateContext';
import { Task, TaskCategory } from '../types';
import Modal from '../components/Modal';
import { generateQuestion, verifyAnswer } from '../services/geminiService';
import { CheckCircleIcon } from '../components/icons';

const taskCategories: TaskCategory[] = ['Science', 'Maths', 'English', 'Global Perspective', 'Russian Language', 'Russian Literature', 'German Language', 'Geography', 'Kyrgyz Language', 'Kyrgyz History'];

const TasksPage: React.FC = () => {
    const { gameState, completeTask } = useGameState();
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [triviaQuestion, setTriviaQuestion] = useState('');
    const [userAnswer, setUserAnswer] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [feedback, setFeedback] = useState('');
    const [activeCategory, setActiveCategory] = useState<TaskCategory>('Science');

    const filteredTasks = useMemo(() => {
        return gameState?.tasks.filter(task => task.category === activeCategory) || [];
    }, [gameState, activeCategory]);

    if (!gameState) return <div>Loading tasks...</div>;

    const handleTaskClick = async (task: Task) => {
        if (task.isCompleted) return;

        if (task.type === 'simple') {
            completeTask(task);
        } else if (task.type === 'trivia') {
            setSelectedTask(task);
            setIsModalOpen(true);
            setFeedback('');
            setUserAnswer('');
            setTriviaQuestion('Generating question...');
            const question = await generateQuestion(task.topic || task.category);
            setTriviaQuestion(question);
        }
    };

    const handleTriviaSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTask || !userAnswer) return;

        setIsVerifying(true);
        setFeedback('Verifying answer...');
        const isCorrect = await verifyAnswer(triviaQuestion, userAnswer);
        setIsVerifying(false);

        if (isCorrect) {
            setFeedback('Correct! Task complete.');
            completeTask(selectedTask);
             setTimeout(() => {
                setIsModalOpen(false);
                setSelectedTask(null);
            }, 2000);
        } else {
            setFeedback('Incorrect. Try a different task for now.');
            setTimeout(() => {
                setIsModalOpen(false);
                setSelectedTask(null);
            }, 2000);
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="text-center mb-8">
                <h2 className="text-4xl font-orbitron text-white">Tasks</h2>
                <p className="text-cyan-400">Complete objectives to earn Creds and XP.</p>
            </div>
            
            <div className="mb-6 overflow-x-auto">
                <div className="flex space-x-2 p-2 glassmorphism rounded-lg">
                    {taskCategories.map(category => (
                        <button key={category} 
                                onClick={() => setActiveCategory(category)}
                                className={`px-4 py-2 rounded-md text-sm font-bold transition-colors whitespace-nowrap ${activeCategory === category ? 'bg-cyan-600 text-white' : 'text-gray-300 hover:bg-cyan-500/20'}`}>
                            {category}
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTasks.map(task => (
                    <div key={task.id} 
                         className={`glassmorphism p-6 rounded-lg border transition-all duration-300 relative flex flex-col ${task.isCompleted ? 'border-green-500/30 opacity-60' : 'border-cyan-500/20 hover:border-cyan-400 cursor-pointer'}`}
                         onClick={() => handleTaskClick(task)}>
                        <h3 className="text-xl font-orbitron text-white mb-2">{task.title}</h3>
                        <p className="text-gray-400 mb-4 flex-grow">{task.description}</p>
                        <div className="flex justify-between items-center text-sm mt-auto">
                            <span className="text-yellow-400 font-bold">+{task.reward.creds} Creds</span>
                            <span className="text-purple-400 font-bold">+{task.reward.xp} XP</span>
                        </div>
                        {task.isCompleted && (
                            <div className="absolute top-4 right-4 text-green-400">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {selectedTask && (
                <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedTask.title}>
                    <p className="mb-4 text-gray-300">{triviaQuestion}</p>
                    {triviaQuestion !== 'Generating question...' && (
                        <form onSubmit={handleTriviaSubmit}>
                            <input
                                type="text"
                                value={userAnswer}
                                onChange={(e) => setUserAnswer(e.target.value)}
                                placeholder="Your answer..."
                                className="w-full bg-gray-800 border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                                disabled={isVerifying || feedback.includes('Correct')}
                            />
                            <button
                                type="submit"
                                className="mt-4 w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-md transition-colors font-bold disabled:bg-gray-600"
                                disabled={isVerifying || !userAnswer || feedback.includes('Correct')}
                            >
                                {isVerifying ? 'Verifying...' : 'Submit Answer'}
                            </button>
                        </form>
                    )}
                     <p className="mt-4 text-center text-yellow-400 h-5">{feedback}</p>
                </Modal>
            )}
        </div>
    );
};

export default TasksPage;