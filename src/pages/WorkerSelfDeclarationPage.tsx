import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { db } from '../db/db';
import { calculateSelfDeclarationScore } from '../utils/mappingEngine';
import type { SkillAnswerOption, SelfDeclaration } from '../types';
import { 
  CheckCircle2, 
  Mic, 
  MicOff, 
  Save, 
  ArrowRight, 
  HelpCircle, 
  Wrench, 
  ShieldAlert, 
  Zap,
  Volume2
} from 'lucide-react';

interface QuestionItem {
  id: string;
  title: string;
  teluguTitle: string;
  category: 'tools' | 'safety' | 'wiring' | 'testing';
  icon: any;
}

const QUESTIONS: QuestionItem[] = [
  {
    id: 'exp',
    title: 'How many years of practical electrical work have you done?',
    teluguTitle: 'మీరు ఎన్ని సంవత్సరాలుగా ప్రాక్టికల్ విద్యుత్ పనులు చేస్తున్నారు?',
    category: 'tools',
    icon: Zap
  },
  {
    id: 'tools',
    title: 'Can you identify tester, screwdriver, pliers, wire stripper, and insulation tape?',
    teluguTitle: 'మీరు టెస్టిన్గ్ టెస్టర్, స్క్రూడ్రైవర్, ప్లైయర్స్, వైర్ స్ట్రిప్పర్ మరియు ఇన్సులేషన్ టేప్‌లను సరిగ్గా గుర్తించగలరా?',
    category: 'tools',
    icon: Wrench
  },
  {
    id: 'switchInstall',
    title: 'Can you install and wire a single-pole wall switch correctly?',
    teluguTitle: 'మీరు సింగిల్-పోల్ వాల్ స్విచ్‌ను సరిగ్గా ఇన్‌స్టాల్ చేసి వైరింగ్ చేయగలరా?',
    category: 'wiring',
    icon: Zap
  },
  {
    id: 'bulbHolder',
    title: 'Can you connect wires safely to a pendant or batten bulb holder?',
    teluguTitle: 'మీరు బల్బ్ హోల్డర్‌కు వైర్లను సురక్షితంగా కనెక్ట్ చేయగలరా?',
    category: 'wiring',
    icon: Zap
  },
  {
    id: 'socketInstall',
    title: 'Can you install a 3-pin 6A/16A socket with proper earthing connection?',
    teluguTitle: 'మీరు సరైన ఎర్తింగ్ కనెక్షన్‌తో 3-పిన్ సాకెట్‌ను ఇన్‌స్టాల్ చేయగలరా?',
    category: 'wiring',
    icon: Zap
  },
  {
    id: 'houseWiring',
    title: 'Can you perform basic single-phase house conduit wiring?',
    teluguTitle: 'మీరు సాధారణ సింగిల్-ఫేజ్ ఇంటి వైరింగ్ పనులు చేయగలరా?',
    category: 'wiring',
    icon: Zap
  },
  {
    id: 'circuitTest',
    title: 'Can you test electrical circuit safety and line voltage before handing over?',
    teluguTitle: 'మీరు పని పూర్తి చేసిన తర్వాత సర్క్యూట్ భద్రతను మరియు వోల్టేజ్‌ను పరీక్షించగలరా?',
    category: 'testing',
    icon: HelpCircle
  },
  {
    id: 'powerCutOff',
    title: 'Do you know how to switch off main power / MCB before starting any work?',
    teluguTitle: 'పని ప్రారంభించే ముందు మెయిన్ పవర్ / MCB ని ఆపివేయడం మీకు తెలుసా?',
    category: 'safety',
    icon: ShieldAlert
  },
  {
    id: 'ppeSafety',
    title: 'Do you wear insulated safety gloves and rubber shoes while working?',
    teluguTitle: 'పని చేస్తున్నప్పుడు మీరు రక్షణ చేతితొడుగులు మరియు రబ్బరు బూట్లు ఉపయోగిస్తారా?',
    category: 'safety',
    icon: ShieldAlert
  },
  {
    id: 'independentWork',
    title: 'Can you work independently on job sites without constant supervision?',
    teluguTitle: 'మీరు సూచనలు లేకుండా సొంతంగా పని చేయగలరా?',
    category: 'tools',
    icon: CheckCircle2
  }
];

export const WorkerSelfDeclarationPage: React.FC = () => {
  const { activeWorker } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [answers, setAnswers] = useState<Record<string, SkillAnswerOption>>({
    exp: 'can_do_independently',
    tools: 'can_do_independently',
    switchInstall: 'can_do_independently',
    bulbHolder: 'can_do_independently',
    socketInstall: 'can_do_independently',
    houseWiring: 'can_do_with_help',
    circuitTest: 'can_do_with_help',
    powerCutOff: 'can_do_independently',
    ppeSafety: 'can_do_independently',
    independentWork: 'can_do_independently'
  });

  const [recordingActive, setRecordingActive] = useState<boolean>(false);
  const [activeQuestionId, setActiveQuestionId] = useState<string>('tools');
  const [voiceNoteSuccess, setVoiceNoteSuccess] = useState<boolean>(false);

  // Load existing declaration if available
  useEffect(() => {
    const loadDeclaration = async () => {
      if (!activeWorker) return;
      const decl = await db.selfDeclarations.where('workerId').equals(activeWorker.id).first();
      if (decl) {
        setAnswers(decl.answers);
      }
    };
    loadDeclaration();
  }, [activeWorker]);

  const handleSelectAnswer = (qId: string, option: SkillAnswerOption) => {
    setAnswers((prev) => ({ ...prev, [qId]: option }));
  };

  const currentScore = calculateSelfDeclarationScore(answers);
  const answeredCount = Object.keys(answers).length;
  const progressPercent = Math.round((answeredCount / QUESTIONS.length) * 100);

  const simulateVoiceRecording = (qId: string) => {
    setActiveQuestionId(qId);
    setRecordingActive(true);
    setTimeout(() => {
      setRecordingActive(false);
      setVoiceNoteSuccess(true);
      setAnswers((prev) => ({ ...prev, [qId]: 'can_do_independently' }));
      showToast('Voice Recorded', 'Simulated voice response saved: "I can do this independently."', 'success');
      setTimeout(() => setVoiceNoteSuccess(false), 3000);
    }, 2500);
  };

  const handleSaveDraft = async () => {
    if (!activeWorker) return;
    const declId = `sd-${activeWorker.id}`;
    const record: SelfDeclaration = {
      id: declId,
      workerId: activeWorker.id,
      trade: 'Assistant Electrician',
      answers,
      score: currentScore,
      voiceNotesRecorded: true,
      completed: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    await db.selfDeclarations.put(record);
    showToast('Saved Offline', `Self-declaration score (${currentScore}%) stored in IndexedDB.`, 'info');
  };

  const handleSaveAndContinue = async () => {
    await handleSaveDraft();
    navigate('/worker/qualification-mapping');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 text-white p-6 rounded-3xl shadow-lg border border-slate-800">
        <div>
          <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            Assistant Electrician (NSQF Level 3)
          </span>
          <h1 className="text-2xl font-extrabold mt-2 text-white">
            Skill Self-Declaration Questionnaire
          </h1>
          <p className="text-xs text-slate-300 mt-1">
            Worker: <strong>{activeWorker?.fullName || 'Ravi Kumar'}</strong> ({activeWorker?.yearsOfExperience || 6} yrs exp)
          </p>
        </div>

        {/* Self Declaration Score Badge */}
        <div className="bg-slate-800 p-4 rounded-2xl border border-slate-700 text-center min-w-[130px]">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Self-Decl Score</p>
          <p className="text-3xl font-extrabold text-emerald-400">{currentScore}%</p>
          <p className="text-[10px] text-emerald-300 font-semibold mt-0.5">Calculated</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2">
        <div className="flex justify-between items-center text-xs font-bold text-slate-700">
          <span>Questionnaire Progress ({answeredCount} of 10 completed)</span>
          <span className="text-blue-600">{progressPercent}%</span>
        </div>
        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-emerald-500 h-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Questionnaire Cards List */}
      <div className="space-y-6">
        {QUESTIONS.map((q, index) => {
          const IconComp = q.icon;
          const currentAnswer = answers[q.id];

          return (
            <div
              key={q.id}
              className={`p-6 rounded-2xl border transition ${
                currentAnswer
                  ? 'bg-white border-slate-200 shadow-sm'
                  : 'bg-amber-50/50 border-amber-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 font-extrabold flex items-center justify-center text-sm shrink-0">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900 leading-snug">
                      {q.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 font-medium italic">
                      {q.teluguTitle}
                    </p>
                  </div>
                </div>

                {/* Voice Answer Demo Button */}
                <button
                  type="button"
                  onClick={() => simulateVoiceRecording(q.id)}
                  disabled={recordingActive && activeQuestionId === q.id}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition shrink-0 ${
                    recordingActive && activeQuestionId === q.id
                      ? 'bg-rose-600 text-white animate-pulse'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                  }`}
                  title="Answer by speaking in Telugu/English"
                >
                  {recordingActive && activeQuestionId === q.id ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      <span>Recording Audio...</span>
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 text-blue-600" />
                      <span>Voice Answer</span>
                    </>
                  )}
                </button>
              </div>

              {/* 4 Answer Options Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { key: 'can_do_independently', label: 'Can do independently', sub: 'సొంతంగా చేయగలను', color: 'emerald' },
                  { key: 'can_do_with_help', label: 'Can do with help', sub: 'సహాయంతో చేయగలను', color: 'blue' },
                  { key: 'have_seen', label: 'Have seen it done', sub: 'చేయడం చూశాను', color: 'amber' },
                  { key: 'cannot_do', label: 'Cannot do it', sub: 'చేయలేను', color: 'rose' }
                ].map((opt) => {
                  const isSelected = currentAnswer === opt.key;
                  return (
                    <button
                      key={opt.key}
                      type="button"
                      onClick={() => handleSelectAnswer(q.id, opt.key as SkillAnswerOption)}
                      className={`p-3.5 rounded-xl border text-left transition relative ${
                        isSelected
                          ? opt.color === 'emerald'
                            ? 'bg-emerald-50 border-emerald-600 ring-2 ring-emerald-600/30 text-emerald-950 font-bold'
                            : opt.color === 'blue'
                            ? 'bg-blue-50 border-blue-600 ring-2 ring-blue-600/30 text-blue-950 font-bold'
                            : opt.color === 'amber'
                            ? 'bg-amber-50 border-amber-600 ring-2 ring-amber-600/30 text-amber-950 font-bold'
                            : 'bg-rose-50 border-rose-600 ring-2 ring-rose-600/30 text-rose-950 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700'
                      }`}
                    >
                      <p className="text-xs font-bold">{opt.label}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{opt.sub}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating / Bottom Action Controls */}
      <div className="sticky bottom-4 bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-2xl border border-slate-800 shadow-2xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs text-slate-300">Self-Declaration Score calculated:</p>
            <p className="text-lg font-extrabold text-white">{currentScore} Marks (100 Max)</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs transition flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-slate-400" />
            <span>Save Offline</span>
          </button>

          <button
            type="button"
            onClick={handleSaveAndContinue}
            className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-lg transition flex items-center gap-2"
          >
            <span>View Qualification Mapping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
