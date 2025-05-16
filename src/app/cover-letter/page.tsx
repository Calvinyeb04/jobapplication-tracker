'use client';

import { useState, useRef } from 'react';
import { useAuth } from '@/context/AuthContext';
import { generateCoverLetter, continueConversation, Message } from '@/lib/ai';
import { motion } from 'framer-motion';
import { FaFileAlt, FaSync, FaCheck, FaCopy, FaSave, FaComments, FaPaperPlane, FaArrowLeft } from 'react-icons/fa';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { GradientButton } from '@/components/ui/GradientButton';
import { FloatingIcons } from '@/components/ui/FloatingIcons';
import dynamic from 'next/dynamic';

// Dynamically import Lottie with SSR disabled
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

// Dynamically import the typing animation
const typingAnimation = {
  v: "5.7.1",
  fr: 30,
  ip: 0,
  op: 60,
  w: 200,
  h: 200,
  nm: "Typing Animation",
  ddd: 0,
  assets: [],
  layers: [
    {
      ddd: 0,
      ind: 1,
      ty: 4,
      nm: "Dot 1",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [80, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 0,
              s: [100, 100, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 15,
              s: [150, 150, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 30,
              s: [100, 100, 100]
            }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [20, 20] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.133, 0.447, 0.965, 1] }
            }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 2,
      ty: 4,
      nm: "Dot 2",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [100, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 10,
              s: [100, 100, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 25,
              s: [150, 150, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 40,
              s: [100, 100, 100]
            }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [20, 20] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.133, 0.447, 0.965, 1] }
            }
          ]
        }
      ]
    },
    {
      ddd: 0,
      ind: 3,
      ty: 4,
      nm: "Dot 3",
      sr: 1,
      ks: {
        o: { a: 0, k: 100 },
        p: { a: 0, k: [120, 100, 0] },
        a: { a: 0, k: [0, 0, 0] },
        s: {
          a: 1,
          k: [
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 20,
              s: [100, 100, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 35,
              s: [150, 150, 100]
            },
            {
              i: { x: [0.667], y: [1] },
              o: { x: [0.333], y: [0] },
              t: 50,
              s: [100, 100, 100]
            }
          ]
        }
      },
      shapes: [
        {
          ty: "gr",
          it: [
            {
              d: 1,
              ty: "el",
              s: { a: 0, k: [20, 20] },
              p: { a: 0, k: [0, 0] }
            },
            {
              ty: "fl",
              c: { a: 0, k: [0.133, 0.447, 0.965, 1] }
            }
          ]
        }
      ]
    }
  ]
};

export default function CoverLetterPage() {
  const { user } = useAuth();
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [savedCoverLetters, setSavedCoverLetters] = useState([
    {
      id: '1',
      title: 'Software Developer at Tech Co',
      date: 'May 8, 2025',
      content: 'Dear Hiring Manager, I am writing to express my interest in the Software Developer position......'
    },
    {
      id: '2',
      title: 'Frontend Developer at StartUp Inc',
      date: 'Apr 15, 2025',
      content: 'Dear Recruitment Team, I am excited to apply for the Frontend Developer role......'
    }
  ]);
  
  // Chat state
  const [showChat, setShowChat] = useState(false);
  const [chatMessages, setChatMessages] = useState<Message[]>([
    { role: 'system', content: 'I am an AI assistant that helps with cover letter revisions.' },
    { role: 'assistant', content: 'I\'ve generated a cover letter based on your job description and resume. What do you think? Would you like me to make any changes?' }
  ]);
  const [userMessage, setUserMessage] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // UI animation states
  const [isCopied, setIsCopied] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Animation variants for staggered animations
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;
    
    // Add user message to chat
    const newMessages: Message[] = [
      ...chatMessages,
      { role: 'user', content: userMessage }
    ];
    
    setChatMessages(newMessages);
    setUserMessage('');
    setChatLoading(true);
    
    setTimeout(scrollToBottom, 100);
    
    try {
      // Get AI response
      const response = await continueConversation(newMessages);
      
      // Add AI response to chat
      setChatMessages([
        ...newMessages,
        { role: 'assistant', content: response }
      ]);
      
      setTimeout(scrollToBottom, 100);
    } catch (error) {
      console.error('Error in conversation:', error);
      setChatMessages([
        ...newMessages,
        { role: 'assistant', content: 'I apologize, but I encountered an error. Please try again.' }
      ]);
    } finally {
      setChatLoading(false);
      setTimeout(scrollToBottom, 100);
    }
  };
  
  const handleGenerateCoverLetter = async () => {
    if (!jobDescription || !resume) {
      alert('Please provide both a job description and your resume.');
      return;
    }
    
    setLoading(true);
    setCoverLetter('');
    
    try {
      const generatedLetter = await generateCoverLetter(
        jobDescription,
        resume,
        additionalContext || undefined
      );
      
      setCoverLetter(generatedLetter);
      
      // Reset chat with new conversation
      setChatMessages([
        { role: 'system', content: 'I am an AI assistant that helps with cover letter revisions.' },
        { role: 'assistant', content: 'I\'ve generated a cover letter based on your job description and resume. What do you think? Would you like me to make any changes?' }
      ]);
    } catch (error) {
      console.error('Error generating cover letter:', error);
      // Our AI service has fallbacks, so we'll still have a cover letter
      // No need to show an error alert - the template-based letter will be used
      
      // Set a basic fallback if something went catastrophically wrong
      if (!coverLetter) {
        const currentDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
        
        setCoverLetter(`${currentDate}\n\nDear Hiring Manager,\n\nI am writing to express my sincere interest in the position at your company. With my background and relevant experience, I believe I would be a valuable addition to your team.\n\nBased on the job description, I understand you're looking for a candidate with strong skills and experience in this field. My professional background has prepared me well for this role, and I'm excited about the opportunity to contribute to your organization.\n\nI am confident that my experience and skills, makes me an excellent candidate for this position.\n\nI would welcome the opportunity to discuss how my background and experiences would benefit your team. Thank you for considering my application. I look forward to the possibility of working with you.\n\nSincerely,\n${resume.split('\n')[0]?.trim() || 'Your Name'}`);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(coverLetter);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };
  
  const handleSaveCoverLetter = () => {
    // In a real app, this would save to a database
    const title = jobDescription.split('\n')[0].substring(0, 50) || 'New Cover Letter';
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    
    const newCoverLetter = {
      id: Date.now().toString(),
      title,
      date: formattedDate,
      content: coverLetter
    };
    
    setSavedCoverLetters([newCoverLetter, ...savedCoverLetters]);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };
  
  return (
    <div className="relative min-h-screen">
      {/* Floating background icons */}
      <FloatingIcons variant="cover-letter" />
      
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-center mb-2">AI Cover Letter Generator</h1>
        <p className="text-gray-600 text-center">Create customized cover letters with AI assistance</p>
      </motion.div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AnimatedCard>
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <FaFileAlt className="mr-2 text-blue-500" /> Create New Cover Letter
              </h2>
              
              <div className="space-y-6">
                <div>
                  <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <textarea
                    id="jobDescription"
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste the job description here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Resume
                  </label>
                  <textarea
                    id="resume"
                    rows={5}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Paste your resume here..."
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                </div>
                
                <div>
                  <label htmlFor="additionalContext" className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Information (Optional)
                  </label>
                  <textarea
                    id="additionalContext"
                    rows={3}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Any additional details you want to include..."
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                  />
                </div>
                
                <div className="flex justify-center">
                  <GradientButton
                    onClick={handleGenerateCoverLetter}
                    disabled={loading || !jobDescription || !resume}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <FaSync className="animate-spin mr-2" /> Generating...
                      </>
                    ) : (
                      <>
                        Generate Cover Letter
                      </>
                    )}
                  </GradientButton>
                </div>
              </div>
            </div>
          </AnimatedCard>
          
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="mt-8"
          >
            <h2 className="text-xl font-semibold mb-4">Your Cover Letters</h2>
            
            <div className="space-y-4">
              {savedCoverLetters.map((letter, index) => (
                <motion.div key={letter.id} variants={item}>
                  <AnimatedCard delay={index * 0.1} className="cursor-pointer hover:bg-blue-50/50">
                    <div className="p-4">
                      <h3 className="font-medium text-lg text-gray-900">{letter.title}</h3>
                      <p className="text-sm text-gray-500 mb-2">{letter.date}</p>
                      <p className="text-sm text-gray-600 line-clamp-2">{letter.content}</p>
                    </div>
                  </AnimatedCard>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
        
        {/* Output section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <AnimatedCard className="h-full">
            <div className="p-6 h-full flex flex-col">
              {loading ? (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <Lottie 
                    animationData={typingAnimation} 
                    className="w-40 h-40 mb-4" 
                  />
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Generating your cover letter...</h3>
                  <p className="text-gray-600">
                    Our AI is crafting a personalized cover letter based on your job description and resume. This may take a moment.
                  </p>
                </div>
              ) : coverLetter ? (
                <div className="flex-1 flex flex-col">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">Generated Cover Letter</h2>
                    
                    <div className="flex space-x-2">
                      {!showChat ? (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowChat(true)}
                          className="text-sm px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
                        >
                          <FaComments className="mr-1.5" /> Edit
                        </motion.button>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => setShowChat(false)}
                          className="text-sm px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
                        >
                          <FaArrowLeft className="mr-1.5" /> Back
                        </motion.button>
                      )}
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleCopyToClipboard}
                        className="text-sm px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
                      >
                        {isCopied ? (
                          <>
                            <FaCheck className="mr-1.5" /> Copied
                          </>
                        ) : (
                          <>
                            <FaCopy className="mr-1.5" /> Copy
                          </>
                        )}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSaveCoverLetter}
                        className="text-sm px-3 py-1.5 rounded-md border border-blue-200 bg-blue-50 text-blue-600 hover:bg-blue-100 flex items-center"
                      >
                        {isSaved ? (
                          <>
                            <FaCheck className="mr-1.5" /> Saved
                          </>
                        ) : (
                          <>
                            <FaSave className="mr-1.5" /> Save
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                  
                  {!showChat ? (
                    <div className="flex-1 overflow-y-auto bg-gray-50 p-6 rounded-lg whitespace-pre-wrap">
                      {coverLetter}
                    </div>
                  ) : (
                    <div className="flex-1 flex flex-col bg-gray-50 rounded-lg">
                      <div className="flex-1 overflow-y-auto p-4">
                        <h3 className="text-center font-medium text-gray-900 mb-4">AI Assistant Chat</h3>
                        <p className="text-center text-xs text-gray-500 mb-4">
                          Chat with the AI to request edits, improvements, or formatting changes to your cover letter.
                        </p>
                        
                        <div className="space-y-4">
                          {chatMessages.filter(msg => msg.role !== 'system').map((msg, index) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3 }}
                              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                              <div 
                                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                                  msg.role === 'user' 
                                    ? 'bg-blue-500 text-white rounded-br-none' 
                                    : 'bg-white border border-gray-200 rounded-bl-none'
                                }`}
                              >
                                {msg.content}
                              </div>
                            </motion.div>
                          ))}
                          
                          {chatLoading && (
                            <div className="flex justify-start">
                              <div className="max-w-[80%] rounded-lg px-4 py-2 bg-white border border-gray-200 rounded-bl-none">
                                <div className="flex space-x-1">
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                  <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                              </div>
                            </div>
                          )}
                          
                          <div ref={messagesEndRef} />
                        </div>
                      </div>
                      
                      <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                        <div className="flex space-x-2">
                          <input
                            type="text"
                            value={userMessage}
                            onChange={(e) => setUserMessage(e.target.value)}
                            placeholder="Ask for specific changes or improvements..."
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage();
                              }
                            }}
                          />
                          <GradientButton 
                            onClick={handleSendMessage}
                            disabled={chatLoading || !userMessage.trim()}
                            className="px-4"
                          >
                            <FaPaperPlane />
                          </GradientButton>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
                  <motion.div
                    animate={{
                      y: [0, -10, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "loop",
                    }}
                    className="text-6xl text-blue-500 mb-6"
                  >
                    <FaFileAlt />
                  </motion.div>
                  <h3 className="text-xl font-medium text-gray-900 mb-3">Start Creating Your Cover Letter</h3>
                  <p className="text-gray-600 mb-6">
                    Fill out the form with a job description and your resume to generate a personalized cover letter instantly.
                  </p>
                  <GradientButton
                    onClick={() => document.getElementById('jobDescription')?.focus()}
                    variant="secondary"
                  >
                    Get Started
                  </GradientButton>
                </div>
              )}
            </div>
          </AnimatedCard>
        </motion.div>
      </div>
    </div>
  );
} 