
import * as React from 'react';
import { Navbar, Footer } from './components/MainLayout';
import { Home } from './components/Home';
import { InputForm } from './components/InputForm';
import { Dashboard } from './components/Dashboard';
import { ProjectHistory } from './components/ProjectHistory';
import { CompareProjects } from './components/CompareProjects';
import { GlobalStandards } from './components/GlobalStandards';
import { OmanFreeZones } from './components/OmanFreeZones';
import { ResearchInputForm } from './components/ResearchInputForm';
import { ResearchDashboard } from './components/ResearchDashboard';
import { ResearchHistory } from './components/ResearchHistory';
import { ChallengeSolver } from './components/ChallengeSolver';
import { OptimizerTool } from './components/OptimizerTool';
import { UnifiedHistorySidebar } from './components/UnifiedHistorySidebar';
import { analyzeProject, analyzeResearchImplementation } from './geminiService';
import { BioFuelAnalysis, AnalysisStatus, ProjectHistoryEntry, ResearchImplementationAnalysis, ChallengeHistoryEntry, OptimizerHistoryEntry, UnifiedProject, ProjectType } from './types';

const STORAGE_KEY = 'biofuel_insight_history';
const RESEARCH_STORAGE_KEY = 'biofuel_insight_research_history';
const CHALLENGE_STORAGE_KEY = 'biofuel_insight_challenge_history';
const OPTIMIZER_STORAGE_KEY = 'biofuel_insight_optimizer_history';
const UNIFIED_HISTORY_KEY = 'biofuel_insight_unified_history';
const ACTIVE_TAB_KEY = 'biofuel_insight_active_tab';
const CURRENT_ANALYSIS_KEY = 'biofuel_insight_current_analysis';
const CURRENT_RESEARCH_KEY = 'biofuel_insight_current_research';

type MainTab = 'HOME' | 'FEASIBILITY' | 'INVESTOR_FEASIBILITY' | 'RESEARCH' | 'SOLVER' | 'OPTIMIZER' | 'STANDARDS' | 'ZONES';
type FeasibilityView = 'ANALYZE' | 'HISTORY' | 'COMPARE';
type ResearchView = 'ANALYZE' | 'HISTORY';

export default function App() {
  const [activeMainTab, setActiveMainTab] = React.useState<MainTab>('HOME');
  const [feasibilityView, setFeasibilityView] = React.useState<FeasibilityView>('ANALYZE');
  const [researchView, setResearchView] = React.useState<ResearchView>('ANALYZE');
  const [status, setStatus] = React.useState<AnalysisStatus>('IDLE');
  const [analysis, setAnalysis] = React.useState<BioFuelAnalysis | null>(null);
  const [researchAnalysis, setResearchAnalysis] = React.useState<ResearchImplementationAnalysis | null>(null);
  const [history, setHistory] = React.useState<ProjectHistoryEntry[]>([]);
  const [researchHistory, setResearchHistory] = React.useState<ResearchImplementationAnalysis[]>([]);
  const [challengeHistory, setChallengeHistory] = React.useState<ChallengeHistoryEntry[]>([]);
  const [optimizerHistory, setOptimizerHistory] = React.useState<OptimizerHistoryEntry[]>([]);
  const [unifiedProjects, setUnifiedProjects] = React.useState<UnifiedProject[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [initialFeasibilityInputs, setInitialFeasibilityInputs] = React.useState<any>(null);
  const [initialResearchInputs, setInitialResearchInputs] = React.useState<any>(null);
  const [initialChallengeInputs, setInitialChallengeInputs] = React.useState<any>(null);
  const [initialOptimizerInputs, setInitialOptimizerInputs] = React.useState<any>(null);
  const [initialChallengeResult, setInitialChallengeResult] = React.useState<any>(null);
  const [initialOptimizerResult, setInitialOptimizerResult] = React.useState<any>(null);
  const [comparisonItems, setComparisonItems] = React.useState<ProjectHistoryEntry[]>([]);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) { console.error(e); }
    }
    const savedResearch = localStorage.getItem(RESEARCH_STORAGE_KEY);
    if (savedResearch) {
      try { 
        const parsed = JSON.parse(savedResearch);
        // Validate that the loaded data matches the current schema (has USD/OMR structure)
        const isValid = Array.isArray(parsed) && parsed.every((item: any) => 
          item.CostEstimation?.EquipmentCosts?.ReactorSystem?.USD !== undefined
        );
        
        if (isValid) {
          setResearchHistory(parsed); 
        } else {
          console.warn("Cleared incompatible research history due to schema update.");
          localStorage.removeItem(RESEARCH_STORAGE_KEY);
          setResearchHistory([]);
        }
      } catch (e) { 
        console.error(e); 
        setResearchHistory([]);
      }
    }
    const savedChallenge = localStorage.getItem(CHALLENGE_STORAGE_KEY);
    if (savedChallenge) {
      try { setChallengeHistory(JSON.parse(savedChallenge)); } catch (e) { console.error(e); }
    }

    const savedOptimizer = localStorage.getItem(OPTIMIZER_STORAGE_KEY);
    if (savedOptimizer) {
      try { setOptimizerHistory(JSON.parse(savedOptimizer)); } catch (e) { console.error(e); }
    }

    const savedUnified = localStorage.getItem(UNIFIED_HISTORY_KEY);
    if (savedUnified) {
      try { setUnifiedProjects(JSON.parse(savedUnified)); } catch (e) { console.error(e); }
    }
    
    const savedTab = localStorage.getItem(ACTIVE_TAB_KEY);
    if (savedTab) setActiveMainTab(savedTab as MainTab);

    const savedAnalysis = localStorage.getItem(CURRENT_ANALYSIS_KEY);
    if (savedAnalysis) {
      try { 
        setAnalysis(JSON.parse(savedAnalysis));
        setStatus('COMPLETED');
      } catch (e) { console.error(e); }
    }

    const savedResearchAnalysis = localStorage.getItem(CURRENT_RESEARCH_KEY);
    if (savedResearchAnalysis) {
      try { 
        setResearchAnalysis(JSON.parse(savedResearchAnalysis));
        setStatus('COMPLETED');
      } catch (e) { console.error(e); }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }, [history]);

  React.useEffect(() => {
    localStorage.setItem(RESEARCH_STORAGE_KEY, JSON.stringify(researchHistory));
  }, [researchHistory]);

  React.useEffect(() => {
    localStorage.setItem(CHALLENGE_STORAGE_KEY, JSON.stringify(challengeHistory));
  }, [challengeHistory]);

  React.useEffect(() => {
    localStorage.setItem(OPTIMIZER_STORAGE_KEY, JSON.stringify(optimizerHistory));
  }, [optimizerHistory]);

  React.useEffect(() => {
    localStorage.setItem(UNIFIED_HISTORY_KEY, JSON.stringify(unifiedProjects));
  }, [unifiedProjects]);

  React.useEffect(() => {
    localStorage.setItem(ACTIVE_TAB_KEY, activeMainTab);
  }, [activeMainTab]);

  React.useEffect(() => {
    if (analysis) localStorage.setItem(CURRENT_ANALYSIS_KEY, JSON.stringify(analysis));
    else localStorage.removeItem(CURRENT_ANALYSIS_KEY);
  }, [analysis]);

  React.useEffect(() => {
    if (researchAnalysis) localStorage.setItem(CURRENT_RESEARCH_KEY, JSON.stringify(researchAnalysis));
    else localStorage.removeItem(CURRENT_RESEARCH_KEY);
  }, [researchAnalysis]);

  const saveToUnifiedHistory = (project: Omit<UnifiedProject, 'id' | 'createdAt'>) => {
    const newProject: UnifiedProject = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleString()
    };
    setUnifiedProjects(prev => [newProject, ...prev]);
  };

  const handleAnalyze = React.useCallback(async (inputs: {
    projectName: string;
    location: string;
    category: 'Biofuel' | 'Renewable Energy';
    feedstock: string;
    production: number;
    budget: number;
    sellingPrice: number;
    electricityCost?: number;
    laborCost?: number;
    co2Source?: string;
  }) => {
    setStatus('ANALYZING');
    setError(null);
    try {
      const result = await analyzeProject(inputs);
      setAnalysis(result);
      setStatus('COMPLETED');
      
      const newEntry: ProjectHistoryEntry = {
        id: Date.now().toString(),
        projectName: result.ProjectAnalyzer.ProjectName,
        location: result.ProjectAnalyzer.Location,
        feedstock: result.ProjectAnalyzer.Feedstock,
        energyDomain: result.EnergyDomain,
        production: (result.ProjectAnalyzer.ExpectedProduction || 0) > 0 
          ? `${result.ProjectAnalyzer.ExpectedProduction!.toLocaleString()} ${result.ProjectAnalyzer.TechnologyCategory === 'Biofuel' ? 'Tons' : 'MWh'}` 
          : "Not Provided",
        budget: (result.ProjectAnalyzer.PreliminaryBudgetUSD || 0) > 0 ? `$${result.ProjectAnalyzer.PreliminaryBudgetUSD!.toLocaleString()}` : "Not Provided",
        score: result.FinalFeasibilityScore,
        level: result.EconomicFeasibility.Assessment,
        timestamp: new Date().toLocaleString(),
        fullData: result
      };
      
      setHistory(prev => [...prev, newEntry]);
      
      saveToUnifiedHistory({
        name: result.ProjectAnalyzer.ProjectName,
        type: 'FEASIBILITY',
        inputs: inputs,
        outputs: result,
        score: result.FinalFeasibilityScore
      });

      setTimeout(() => {
        document.getElementById('dashboard-view')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during analysis. Check your connection or parameters.");
      setStatus('ERROR');
    }
  }, []);

  const handleSelectFromHistory = (entry: ProjectHistoryEntry) => {
    setAnalysis(entry.fullData);
    setStatus('COMPLETED');
    setFeasibilityView('ANALYZE');
    setTimeout(() => { document.getElementById('dashboard-view')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleCompare = (selectedIds: string[]) => {
    const items = history.filter(h => selectedIds.includes(h.id));
    setComparisonItems(items);
    setFeasibilityView('COMPARE');
  };

  const handleResearchAnalyze = React.useCallback(async (inputs: any) => {
    setStatus('ANALYZING');
    setError(null);
    try {
      const result = await analyzeResearchImplementation(inputs);
      setResearchAnalysis(result);
      setResearchHistory(prev => [result, ...prev]);
      
      saveToUnifiedHistory({
        name: inputs.feedstockType || 'Unnamed Research',
        type: 'RESEARCH',
        inputs: inputs,
        outputs: result,
        score: result.ReadinessScore.OverallScore
      });

      setStatus('COMPLETED');
      setResearchView('ANALYZE');
      setTimeout(() => {
        document.getElementById('research-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err: any) {
      setError(err.message || "An error occurred during research analysis.");
      setStatus('ERROR');
    }
  }, []);

  const handleSelectFromResearchHistory = (entry: ResearchImplementationAnalysis) => {
    setResearchAnalysis(entry);
    setStatus('COMPLETED');
    setResearchView('ANALYZE');
    setTimeout(() => { document.getElementById('research-dashboard')?.scrollIntoView({ behavior: 'smooth' }); }, 100);
  };

  const handleSelectProject = (project: UnifiedProject) => {
    setActiveMainTab(project.type === 'FEASIBILITY' ? 'INVESTOR_FEASIBILITY' : project.type as MainTab);
    
    if (project.type === 'FEASIBILITY') {
      setAnalysis(project.outputs);
      setFeasibilityView('ANALYZE');
    } else if (project.type === 'RESEARCH') {
      setResearchAnalysis(project.outputs);
      setResearchView('ANALYZE');
    } else if (project.type === 'CHALLENGE') {
      setInitialChallengeResult(project.outputs);
    } else if (project.type === 'OPTIMIZER') {
      setInitialOptimizerResult(project.outputs);
    }
    
    setStatus('COMPLETED');
    setIsSidebarOpen(false);
    setTimeout(() => {
      const id = project.type === 'FEASIBILITY' ? 'dashboard-view' : 'research-dashboard';
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handleEditProject = (project: UnifiedProject) => {
    setActiveMainTab(project.type === 'FEASIBILITY' ? 'INVESTOR_FEASIBILITY' : project.type as MainTab);
    
    if (project.type === 'FEASIBILITY') {
      setInitialFeasibilityInputs(project.inputs);
      setFeasibilityView('ANALYZE');
    } else if (project.type === 'RESEARCH') {
      setInitialResearchInputs(project.inputs);
      setResearchView('ANALYZE');
    } else if (project.type === 'CHALLENGE') {
      setInitialChallengeInputs(project.inputs);
    } else if (project.type === 'OPTIMIZER') {
      setInitialOptimizerInputs(project.inputs);
    }
    
    setIsSidebarOpen(false);
    setStatus('IDLE'); // Reset status to show the form
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      setUnifiedProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleExportReport = (project: UnifiedProject) => {
    const reportData = JSON.stringify(project, null, 2);
    const blob = new Blob([reportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.name.replace(/\s+/g, '_')}_Report.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderFeasibilityTool = () => (
    <>
      <div className="bg-emerald-900 pt-4 px-4 flex justify-center">
        <div className="flex space-x-1 bg-emerald-950/50 p-1 rounded-xl shadow-inner">
          {[
            { id: 'ANALYZE', icon: 'fa-microchip', label: 'Analyze' },
            { id: 'HISTORY', icon: 'fa-history', label: 'History' }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setFeasibilityView(tab.id as FeasibilityView)}
              className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                feasibilityView === tab.id ? 'bg-emerald-500 text-white shadow-lg translate-y-[-2px]' : 'text-emerald-400 hover:text-white'
              }`}
            >
              <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
              {tab.id === 'HISTORY' && history.length > 0 && (
                <span className="ml-2 bg-emerald-400 text-emerald-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                  {history.length}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {feasibilityView === 'ANALYZE' && (
        <div className="animate-in fade-in duration-500">
          <section className="bg-emerald-900 text-white py-12 px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                Investor <span className="text-emerald-400 underline decoration-emerald-500/30">Feasibility</span> Tool
              </h1>
              <p className="text-md text-emerald-100/80 max-w-2xl mx-auto">
                Evaluate technical and economic viability for Biofuel, Hydrogen, and Carbon pathways across Oman's strategic zones.
              </p>
            </div>
          </section>

          <section className="max-w-5xl mx-auto px-4 -mt-12 mb-16 relative z-10">
            <InputForm 
              onAnalyze={handleAnalyze} 
              isLoading={status === 'ANALYZING'} 
              initialInputs={initialFeasibilityInputs}
            />
            {error && <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">{error}</div>}
          </section>

          {status === 'ANALYZING' && (
            <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
              <div className="flex flex-col items-center space-y-4">
                <div className="flex space-x-2">
                  {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                </div>
                <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI Assessment Engine Computing Regional Benchmarks...</p>
              </div>
            </section>
          )}

          {status === 'COMPLETED' && analysis && (
            <section id="dashboard-view" className="max-w-7xl mx-auto px-4 pb-20">
              <Dashboard data={analysis} />
            </section>
          )}
        </div>
      )}

      {feasibilityView === 'HISTORY' && (
        <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <ProjectHistory 
            history={history} 
            onSelect={handleSelectFromHistory} 
            onCompare={handleCompare}
            onClear={() => { if(window.confirm("Clear all historical records?")) setHistory([]); }}
          />
        </section>
      )}

      {feasibilityView === 'COMPARE' && (
        <section className="max-w-7xl mx-auto px-4 py-12 animate-in fade-in duration-500">
          <CompareProjects entries={comparisonItems} onBack={() => setFeasibilityView('HISTORY')} />
        </section>
      )}
    </>
  );
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans selection:bg-emerald-100 selection:text-emerald-900 transition-colors duration-500">
      <Navbar 
        activeTab={activeMainTab} 
        onTabChange={(tab) => {
          setActiveMainTab(tab);
          if (tab === 'INVESTOR_FEASIBILITY' && feasibilityView === 'COMPARE') setFeasibilityView('ANALYZE');
        }} 
      />

      <main className="flex-grow">
        {activeMainTab === 'HOME' && <Home onStart={(tab) => setActiveMainTab(tab)} />}
        {(activeMainTab === 'INVESTOR_FEASIBILITY' || activeMainTab === 'FEASIBILITY') && renderFeasibilityTool()}
        {activeMainTab === 'RESEARCH' && (
          <div className="animate-in fade-in duration-500">
            <div className="bg-blue-900 pt-4 px-4 flex justify-center">
              <div className="flex space-x-1 bg-blue-950/50 p-1 rounded-xl shadow-inner">
                {[
                  { id: 'ANALYZE', icon: 'fa-microscope', label: 'Analyze' },
                  { id: 'HISTORY', icon: 'fa-history', label: 'History' }
                ].map(tab => (
                  <button 
                    key={tab.id}
                    onClick={() => setResearchView(tab.id as ResearchView)}
                    className={`px-6 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                      researchView === tab.id ? 'bg-blue-500 text-white shadow-lg translate-y-[-2px]' : 'text-blue-400 hover:text-white'
                    }`}
                  >
                    <i className={`fas ${tab.icon} mr-2`}></i> {tab.label}
                    {tab.id === 'HISTORY' && researchHistory.length > 0 && (
                      <span className="ml-2 bg-blue-400 text-blue-900 w-4 h-4 rounded-full inline-flex items-center justify-center text-[8px] font-black">
                        {researchHistory.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {researchView === 'ANALYZE' && (
              <>
                <section className="bg-blue-900 text-white py-12 px-4">
                  <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                      Research Implementation <span className="text-blue-400 underline decoration-blue-500/30">Analyzer</span>
                    </h1>
                    <p className="text-md text-blue-100/80 max-w-2xl mx-auto">
                      Bridge the gap between laboratory yields and pilot-scale production. Purely scientific assessment for researchers.
                    </p>
                  </div>
                </section>

                <section className="max-w-5xl mx-auto px-4 -mt-12 mb-16 relative z-10">
                  <ResearchInputForm 
                    onAnalyze={handleResearchAnalyze} 
                    isLoading={status === 'ANALYZING'} 
                    initialInputs={initialResearchInputs}
                  />
                  {error && <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-xs font-bold text-center">{error}</div>}
                </section>

                {status === 'ANALYZING' && (
                  <section className="max-w-5xl mx-auto px-4 py-20 text-center animate-pulse">
                    <div className="flex flex-col items-center space-y-4">
                      <div className="flex space-x-2">
                        {[0, 1, 2].map(i => <div key={i} className="w-3 h-3 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: `${i*0.2}s` }}></div>)}
                      </div>
                      <p className="text-slate-500 font-black uppercase tracking-widest text-xs">AI Scaling Engine Computing Scientific Benchmarks...</p>
                    </div>
                  </section>
                )}

                {status === 'COMPLETED' && researchAnalysis && (
                  <section id="research-dashboard" className="max-w-7xl mx-auto px-4 pb-20">
                    <ResearchDashboard data={researchAnalysis} />
                  </section>
                )}
              </>
            )}

            {researchView === 'HISTORY' && (
              <section className="max-w-5xl mx-auto px-4 py-12 animate-in fade-in duration-500">
                <ResearchHistory 
                  history={researchHistory} 
                  onSelect={handleSelectFromResearchHistory}
                  onClear={() => { if(window.confirm("Clear all research records?")) setResearchHistory([]); }}
                />
              </section>
            )}
          </div>
        )}
        {activeMainTab === 'SOLVER' && (
          <div className="animate-in fade-in duration-500">
            <section className="bg-slate-900 text-white py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Scientific <span className="text-blue-400 underline decoration-blue-500/30">Challenge</span> Solver
                </h1>
                <p className="text-md text-slate-300 max-w-2xl mx-auto">
                  Solving technical bottlenecks in Oman's biofuel ecosystem through multi-agent scientific reasoning.
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
              <ChallengeSolver 
                history={challengeHistory} 
                initialInputs={initialChallengeInputs}
                initialResult={initialChallengeResult}
                onSave={(entry) => {
                  setChallengeHistory(prev => [entry, ...prev]);
                  saveToUnifiedHistory({
                    name: entry.topic,
                    type: 'CHALLENGE',
                    inputs: { topic: entry.topic },
                    outputs: entry.fullData
                  });
                }}
                onClear={() => { if(window.confirm("Clear all challenge history?")) setChallengeHistory([]); }}
              />
            </section>
          </div>
        )}
        {activeMainTab === 'OPTIMIZER' && (
          <div className="animate-in fade-in duration-500">
            <section className="bg-emerald-900 text-white py-12 px-4">
              <div className="max-w-4xl mx-auto text-center">
                <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
                  Profit & <span className="text-emerald-400 underline decoration-emerald-500/30">Carbon</span> Optimizer
                </h1>
                <p className="text-md text-emerald-100/80 max-w-2xl mx-auto">
                  Strategic multi-agent AI to maximize revenue and minimize emissions for biofuel projects.
                </p>
              </div>
            </section>
            <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-10">
              <OptimizerTool 
                history={optimizerHistory}
                initialInputs={initialOptimizerInputs}
                initialResult={initialOptimizerResult}
                onSave={(entry) => {
                  setOptimizerHistory(prev => [entry, ...prev]);
                  saveToUnifiedHistory({
                    name: entry.projectName,
                    type: 'OPTIMIZER',
                    inputs: { projectName: entry.projectName },
                    outputs: entry.fullData,
                    carbonIntensity: entry.fullData.NetZeroRoadmap.CarbonIntensityEstimate
                  });
                }}
                onClear={() => { if(window.confirm("Clear all optimization history?")) setOptimizerHistory([]); }}
              />
            </section>
          </div>
        )}
        {activeMainTab === 'STANDARDS' && (
          <section className="max-w-5xl mx-auto px-4 py-12">
            <GlobalStandards />
          </section>
        )}
        {activeMainTab === 'ZONES' && (
          <section className="max-w-6xl mx-auto px-4 py-12">
            <OmanFreeZones />
          </section>
        )}
      </main>

      <Footer />
      
      <UnifiedHistorySidebar 
        projects={unifiedProjects}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onSelect={handleSelectProject}
        onEdit={handleEditProject}
        onDelete={handleDeleteProject}
        onExport={handleExportReport}
      />
    </div>
  );
}
