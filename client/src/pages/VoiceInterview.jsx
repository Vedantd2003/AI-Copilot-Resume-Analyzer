import { useState, useEffect } from 'react';
import { Mic, Clock, TrendingUp, Award, Lightbulb, RotateCcw, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { gsap } from 'gsap';
import api from '../services/api';
import AudioRecorder from '../components/AudioRecorder';
import RobotInterviewer from '../components/3DRobotInterviewer';
import VoiceSynthesis from '../components/VoiceSynthesis';

const VoiceInterview = () => {
  const [currentStep, setCurrentStep] = useState('welcome'); // welcome, tips, recording, evaluation
  const [question, setQuestion] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [tips, setTips] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recordingData, setRecordingData] = useState(null);
  const [error, setError] = useState('');
  const [isWaving, setIsWaving] = useState(false);
  const [isRobotSpeaking, setIsRobotSpeaking] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Voice synthesis hook
  const voiceSynthesis = VoiceSynthesis({
    text: question?.fullText || '',
    onSpeakingChange: setIsRobotSpeaking,
    voiceType: question?.recruiterPersona || 'professional'
  });

  // GSAP Animations
  useEffect(() => {
    gsap.from('.fade-in', {
      opacity: 0,
      y: 20,
      duration: 0.6,
      stagger: 0.1
    });
  }, [currentStep]);

  // Generate interview question
  const generateQuestion = async (difficulty = 'medium', category = 'behavioral') => {
    try {
      setLoading(true);
      const { data } = await api.post('/voice-interview/generate-question', {
        difficulty,
        category
      });
      setQuestion(data.question);
      setCurrentStep('recording');
      
      // Trigger wave animation
      setIsWaving(true);
      setTimeout(() => setIsWaving(false), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to generate question');
    } finally {
      setLoading(false);
    }
  };

  // Evaluate voice response
  const evaluateResponse = async (audioData) => {
    try {
      setLoading(true);
      setRecordingData(audioData);
      
      const { data } = await api.post('/voice-interview/evaluate-response', {
        audioData: audioData.base64data,
        question: question.question,
        transcript: null // Let backend handle transcription
      });
      
      setEvaluation(data.evaluation);
      setCurrentStep('evaluation');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to evaluate response');
    } finally {
      setLoading(false);
    }
  };

  // Get interview tips
  const getInterviewTips = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/voice-interview/tips');
      setTips(data.tips);
      setCurrentStep('tips');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load tips');
    } finally {
      setLoading(false);
    }
  };

  // Reset interview
  const resetInterview = () => {
    setQuestion(null);
    setEvaluation(null);
    setRecordingData(null);
    setError('');
    setCurrentStep('welcome');
  };

  // Welcome Screen
  const WelcomeScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="grid lg:grid-cols-2 gap-8 h-screen">
        {/* 3D Robot Section */}
        <div className="relative">
          <RobotInterviewer isSpeaking={false} isWaving={true} />
          
          {/* Welcome Message Overlay */}
          <div className="absolute bottom-8 left-8 right-8 text-center">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
              <h2 className="text-2xl font-bold text-white mb-2">
                Hello! I'm your AI Interview Coach
              </h2>
              <p className="text-blue-200">
                I'll help you practice and perfect your interview skills with real-time feedback
              </p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="flex items-center justify-center p-8">
          <div className="max-w-lg w-full fade-in">
            <div className="text-center mb-8">
              <h1 className="font-display font-bold text-4xl text-white mb-4">
                AI Voice Interview
              </h1>
              
              <p className="text-blue-200 text-lg mb-8">
                Experience a virtual interview with our AI recruiter. 
                Get instant feedback on your speaking skills and confidence.
              </p>
            </div>

            <div className="space-y-6 mb-8">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Mic className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white">Voice Recording</h3>
                </div>
                <p className="text-blue-200 text-sm">
                  Record your answers using your device microphone
                </p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <TrendingUp className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white">AI Analysis</h3>
                </div>
                <p className="text-blue-200 text-sm">
                  Get detailed feedback on your speaking skills
                </p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
                <div className="flex items-center gap-4 mb-3">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <Award className="text-blue-400" size={24} />
                  </div>
                  <h3 className="font-semibold text-white">Improve Skills</h3>
                </div>
                <p className="text-blue-200 text-sm">
                  Track your progress and become interview-ready
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => generateQuestion('medium', 'behavioral')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all transform hover:scale-105"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Mic size={20} />
                    Start Interview
                  </>
                )}
              </button>
              
              <button
                onClick={getInterviewTips}
                disabled={loading}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl flex items-center gap-2 transition-all border border-white/20"
              >
                <Lightbulb size={20} />
                View Tips
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Tips Screen
  const TipsScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="grid lg:grid-cols-2 gap-8 h-screen">
        {/* 3D Robot */}
        <div className="relative">
          <RobotInterviewer isSpeaking={false} isWaving={false} />
          
          {/* Tips Title */}
          <div className="absolute top-8 left-8 right-8">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center">
              <h2 className="text-2xl font-bold text-white mb-2">
                Interview Preparation Tips
              </h2>
              <p className="text-blue-200">
                Master your interview skills with these expert tips
              </p>
            </div>
          </div>
        </div>

        {/* Tips Content */}
        <div className="flex items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-lg w-full fade-in">
            {tips && (
              <div className="space-y-6">
                {tips.preparationTips?.map((section, idx) => (
                  <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
                    <h3 className="font-semibold text-xl text-white mb-4">
                      {section.category}
                    </h3>
                    <ul className="space-y-3">
                      {section.tips?.map((tip, tipIdx) => (
                        <li key={tipIdx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-blue-200 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-red-500/10 backdrop-blur-sm rounded-xl p-6 border border-red-500/20">
                    <h4 className="font-semibold text-red-400 mb-4">Common Mistakes</h4>
                    <ul className="space-y-2">
                      {tips.commonMistakes?.map((mistake, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-red-300 text-sm">{mistake}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-emerald-500/10 backdrop-blur-sm rounded-xl p-6 border border-emerald-500/20">
                    <h4 className="font-semibold text-emerald-400 mb-4">Best Practices</h4>
                    <ul className="space-y-2">
                      {tips.bestPractices?.map((practice, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-emerald-300 text-sm">{practice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-center mt-8">
              <button
                onClick={() => setCurrentStep('welcome')}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition-all border border-white/20"
              >
                <ArrowRight className="rotate-180" size={20} />
                Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Recording Screen
  const RecordingScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="grid lg:grid-cols-2 gap-8 h-screen">
        {/* 3D Robot Interviewer */}
        <div className="relative">
          <RobotInterviewer isSpeaking={isRobotSpeaking} isWaving={isWaving} />
          
          {/* Question Display */}
          {question && (
            <div className="absolute top-8 left-8 right-8">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
                      {question.category}
                    </span>
                    <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 rounded-full text-sm">
                      {question.difficulty}
                    </span>
                  </div>
                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    {soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
                  </button>
                </div>
                <p className="text-white text-lg font-medium">
                  {question.question}
                </p>
                <div className="mt-3 flex items-center gap-4 text-sm text-blue-200">
                  <div className="flex items-center gap-2">
                    <Clock size={16} />
                    <span>~{question.expectedDuration}s</span>
                  </div>
                  {isRobotSpeaking && (
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span>Interviewer speaking...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recording Controls */}
        <div className="flex items-center justify-center p-8">
          <div className="max-w-lg w-full fade-in">
            <div className="text-center mb-8">
              <h2 className="font-display font-bold text-3xl text-white mb-4">
                Your Response
              </h2>
              <p className="text-blue-200">
                Click the microphone to record your answer. Speak clearly and confidently.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/20">
              <div className="text-center mb-6">
                <h3 className="font-semibold text-white mb-2">
                  Record Your Answer
                </h3>
                <p className="text-blue-200 text-sm">
                  Take a moment to think, then record your response
                </p>
              </div>

              <AudioRecorder 
                onRecordingComplete={evaluateResponse}
                maxDuration={question?.expectedDuration || 60}
              />
            </div>

            <div className="flex justify-center mt-6">
              <button
                onClick={resetInterview}
                className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-xl transition-all border border-white/20"
              >
                <RotateCcw size={20} />
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Evaluation Screen
  const EvaluationScreen = () => (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      <div className="grid lg:grid-cols-2 gap-8 h-screen">
        {/* 3D Robot */}
        <div className="relative">
          <RobotInterviewer isSpeaking={false} isWaving={false} />
          
          {/* Score Display */}
          {evaluation && (
            <div className="absolute top-8 left-8 right-8">
              <div className="bg-black/50 backdrop-blur-sm rounded-xl p-6 border border-blue-500/20 text-center">
                <div className="text-5xl font-bold text-white mb-2">
                  {evaluation.overallScore}%
                </div>
                <p className="text-blue-200">Overall Score</p>
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="flex items-center justify-center p-8 overflow-y-auto">
          <div className="max-w-lg w-full fade-in">
            <h2 className="font-display font-bold text-3xl text-white mb-8 text-center">
              Interview Evaluation
            </h2>

            {evaluation && (
              <div className="space-y-6">
                {/* Score Breakdown */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200 text-sm">Confidence</span>
                      <span className="font-semibold text-white">{evaluation.confidence}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.confidence}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200 text-sm">Tone</span>
                      <span className="font-semibold text-white">{evaluation.tone}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.tone}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200 text-sm">Fluency</span>
                      <span className="font-semibold text-white">{evaluation.fluency}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-purple-400 to-purple-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.fluency}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-blue-200 text-sm">Clarity</span>
                      <span className="font-semibold text-white">{evaluation.clarity}%</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${evaluation.clarity}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Feedback */}
                {evaluation.feedback && (
                  <div className="space-y-4">
                    <div className="bg-green-500/10 backdrop-blur-sm rounded-xl p-6 border border-green-500/20">
                      <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
                        <Award size={20} />
                        Strengths
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.feedback.strengths?.map((strength, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-green-300 text-sm">{strength}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-yellow-500/10 backdrop-blur-sm rounded-xl p-6 border border-yellow-500/20">
                      <h4 className="font-semibold text-yellow-400 mb-4 flex items-center gap-2">
                        <Lightbulb size={20} />
                        Areas for Improvement
                      </h4>
                      <ul className="space-y-2">
                        {evaluation.feedback.improvements?.map((improvement, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                            <span className="text-yellow-300 text-sm">{improvement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4 justify-center mt-8">
              <button
                onClick={() => generateQuestion('medium', 'behavioral')}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition-all"
              >
                <Mic size={20} />
                Next Question
              </button>
              
              <button
                onClick={resetInterview}
                className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl transition-all border border-white/20"
              >
                <RotateCcw size={20} />
                Start Over
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-6">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {currentStep === 'welcome' && <WelcomeScreen />}
        {currentStep === 'tips' && <TipsScreen />}
        {currentStep === 'recording' && <RecordingScreen />}
        {currentStep === 'evaluation' && <EvaluationScreen />}
      </div>
    </div>
  );
};

export default VoiceInterview;
