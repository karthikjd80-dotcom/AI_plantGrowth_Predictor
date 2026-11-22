import React, { useState } from 'react';
import { 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Plus, 
  Search, 
  Download, 
  ExternalLink, 
  Activity, 
  Droplets, 
  Scissors, 
  Sprout, 
  Layers, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Filter,
  Check,
  ChevronDown,
  X
} from 'lucide-react';
import { HistoryItem } from '../types';

export interface BotanicalTransaction {
  id: string;
  txHash: string;
  timestamp: number;
  plantName: string;
  type: 'Pathology Scan' | 'Hydration Log' | 'Growth Simulation' | 'Canopy Prune' | 'Nutrient Feed' | 'Bio-Remedy';
  status: 'Confirmed' | 'Verified' | 'Audited';
  metricsDelta?: string;
  operator: string;
  notes: string;
  verificationScore: number;
}

const INITIAL_TRANSACTIONS: BotanicalTransaction[] = [
  {
    id: 'tx-001',
    txHash: '0x9E4F...A120',
    timestamp: Date.now() - 1000 * 60 * 18, // 18m ago
    plantName: 'Tomato Plant (Solanum lycopersicum)',
    type: 'Pathology Scan',
    status: 'Verified',
    metricsDelta: 'Early Blight Detected (98% Conf)',
    operator: 'FloraAI Multi-Modal Engine v4.2',
    notes: 'Identified concentric Alternaria solani fungal rings on lower petiole.',
    verificationScore: 98.4
  },
  {
    id: 'tx-002',
    txHash: '0x88BC...3492',
    timestamp: Date.now() - 1000 * 60 * 65, // 1h ago
    plantName: 'Tomato Plant (Solanum lycopersicum)',
    type: 'Canopy Prune',
    status: 'Confirmed',
    metricsDelta: '-4 Infected Leaf Blades',
    operator: 'Cultivator Manual Audit',
    notes: 'Sterilized shears with 70% alcohol and excised lowest diseased leaf tiers.',
    verificationScore: 100
  },
  {
    id: 'tx-003',
    txHash: '0x712D...9981',
    timestamp: Date.now() - 1000 * 60 * 120, // 2h ago
    plantName: 'Tomato Plant (Solanum lycopersicum)',
    type: 'Bio-Remedy',
    status: 'Confirmed',
    metricsDelta: '5ml Cold-Pressed Neem / 1L H2O',
    operator: 'Organic Care Protocol',
    notes: 'Applied broad-spectrum organic azadirachtin misting over adaxial leaf surface.',
    verificationScore: 99.1
  },
  {
    id: 'tx-004',
    txHash: '0x55FA...4102',
    timestamp: Date.now() - 1000 * 60 * 60 * 6, // 6h ago
    plantName: 'Snake Plant (Sansevieria Trifasciata)',
    type: 'Growth Simulation',
    status: 'Verified',
    metricsDelta: '+1.8 cm 14-Day Trajectory',
    operator: '3D WebGL Procedural Solver',
    notes: 'Calculated vegetative shoot extension under 850 lux ambient illumination.',
    verificationScore: 97.8
  },
  {
    id: 'tx-005',
    txHash: '0x33A1...8812',
    timestamp: Date.now() - 1000 * 60 * 60 * 24, // 1d ago
    plantName: 'Fiddle Leaf Fig (Ficus Lyrata)',
    type: 'Hydration Log',
    status: 'Confirmed',
    metricsDelta: '450ml Filtered Water (pH 6.4)',
    operator: 'Irrigation Controller',
    notes: 'Moisture sensor read 18% dry-down; saturated root ball with room-temp water.',
    verificationScore: 100
  },
  {
    id: 'tx-006',
    txHash: '0x221B...7701',
    timestamp: Date.now() - 1000 * 60 * 60 * 36, // 1.5d ago
    plantName: 'Fiddle Leaf Fig (Ficus Lyrata)',
    type: 'Pathology Scan',
    status: 'Audited',
    metricsDelta: '100% Healthy Specimen',
    operator: 'FloraAI Multi-Modal Engine v4.2',
    notes: 'Glossy chlorophyll reflectance confirmed. Zero necrotic lesions detected.',
    verificationScore: 99.6
  },
  {
    id: 'tx-007',
    txHash: '0x199C...3321',
    timestamp: Date.now() - 1000 * 60 * 60 * 48, // 2d ago
    plantName: 'Rose Plant (Rosa indica)',
    type: 'Nutrient Feed',
    status: 'Confirmed',
    metricsDelta: '10-10-10 Balanced NPK (half-strength)',
    operator: 'Cultivator Manual Audit',
    notes: 'Inoculated topsoil with mycorrhizal fungi and slow-release nitrogen pellet.',
    verificationScore: 98.9
  },
  {
    id: 'tx-008',
    txHash: '0x0DF4...7192',
    timestamp: Date.now() - 1000 * 60 * 60 * 56, // 2.3d ago
    plantName: 'Monstera Deliciosa',
    type: 'Hydration Log',
    status: 'Verified',
    metricsDelta: '600ml De-chlorinated H2O + Sphagnum Wrap',
    operator: 'Automated Sub-Irrigation Hub',
    notes: 'Aerial root nodes wrapped with moist sphagnum; root-zone moisture stabilized at 42%.',
    verificationScore: 99.4
  },
  {
    id: 'tx-009',
    txHash: '0x4BC2...1098',
    timestamp: Date.now() - 1000 * 60 * 60 * 72, // 3d ago
    plantName: 'Basil (Ocimum basilicum)',
    type: 'Canopy Prune',
    status: 'Confirmed',
    metricsDelta: '-6 Apical Shoots (Node Pinching)',
    operator: 'Cultivator Manual Audit',
    notes: 'Pinched apical flower spikes to promote lateral vegetative branching and essential oil density.',
    verificationScore: 100
  },
  {
    id: 'tx-010',
    txHash: '0x7E3A...9941',
    timestamp: Date.now() - 1000 * 60 * 60 * 96, // 4d ago
    plantName: 'Chili Pepper (Capsicum annuum)',
    type: 'Bio-Remedy',
    status: 'Audited',
    metricsDelta: 'Foliar Calcium Chelate 2% spray',
    operator: 'Organic Care Protocol',
    notes: 'Preventative foliar application to mitigate blossom-end rot under high transpiration load.',
    verificationScore: 99.7
  },
  {
    id: 'tx-011',
    txHash: '0x81FA...2840',
    timestamp: Date.now() - 1000 * 60 * 60 * 110, // 4.5d ago
    plantName: 'Spinach (Spinacia oleracea)',
    type: 'Nutrient Feed',
    status: 'Confirmed',
    metricsDelta: 'Chelated Iron (Fe-EDDHA 0.5g/L)',
    operator: 'Hydroponic Dosing System',
    notes: 'Corrected interveinal chlorosis on young leaf blades; chlorophyll index boosted.',
    verificationScore: 99.1
  },
  {
    id: 'tx-012',
    txHash: '0x66B0...3518',
    timestamp: Date.now() - 1000 * 60 * 60 * 128, // 5.3d ago
    plantName: 'Mint (Mentha spicata)',
    type: 'Growth Simulation',
    status: 'Verified',
    metricsDelta: '+3.2 cm Stolon Extension Vector',
    operator: '3D WebGL Procedural Solver',
    notes: 'Computed runner rhizome spread and phototropic bending angle under 14h photoperiod.',
    verificationScore: 98.6
  },
  {
    id: 'tx-013',
    txHash: '0x55E9...4421',
    timestamp: Date.now() - 1000 * 60 * 60 * 144, // 6d ago
    plantName: 'Brinjal / Eggplant (Solanum melongena)',
    type: 'Pathology Scan',
    status: 'Audited',
    metricsDelta: 'Phomopsis Blight Negative',
    operator: 'FloraAI Multi-Modal Engine v4.2',
    notes: 'Leaf surface reflectance analysis confirms zero pycnidia spot formation.',
    verificationScore: 99.9
  },
  {
    id: 'tx-014',
    txHash: '0x32A8...9014',
    timestamp: Date.now() - 1000 * 60 * 60 * 168, // 7d ago
    plantName: 'Rose Plant (Rosa indica)',
    type: 'Bio-Remedy',
    status: 'Confirmed',
    metricsDelta: 'Potassium Bicarbonate 3g/L Mist',
    operator: 'Organic Care Protocol',
    notes: 'Neutralized powdery mildew spores on adaxial epidermal layer; pH raised to 8.2.',
    verificationScore: 99.3
  },
  {
    id: 'tx-015',
    txHash: '0x11D7...6632',
    timestamp: Date.now() - 1000 * 60 * 60 * 192, // 8d ago
    plantName: 'Tomato Plant (Solanum lycopersicum)',
    type: 'Growth Simulation',
    status: 'Verified',
    metricsDelta: '+12.5 cm Full 14-Day Cycle Completed',
    operator: '3D WebGL Procedural Solver',
    notes: 'Verified vegetative stem thickness increase from 4.2mm to 8.9mm with fruit cluster formation.',
    verificationScore: 99.5
  },
  {
    id: 'tx-016',
    txHash: '0x09C3...5529',
    timestamp: Date.now() - 1000 * 60 * 60 * 216, // 9d ago
    plantName: 'Fiddle Leaf Fig (Ficus Lyrata)',
    type: 'Canopy Prune',
    status: 'Audited',
    metricsDelta: 'Micro-Fiber Foliar Dusting & Aeration',
    operator: 'Botanical Conservator',
    notes: 'Polished 18 broad leaves with damp microfiber cloth to restore optimal stomatal conductance.',
    verificationScore: 100
  }
];

interface CareTransactionsViewProps {
  onNavigateToScan?: () => void;
  onNavigateToGrowth?: () => void;
  history?: HistoryItem[];
}

export function CareTransactionsView({
  onNavigateToScan,
  onNavigateToGrowth,
  history = []
}: CareTransactionsViewProps) {
  const [transactions, setTransactions] = useState<BotanicalTransaction[]>(INITIAL_TRANSACTIONS);
  const [filterType, setFilterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTx, setSelectedTx] = useState<BotanicalTransaction | null>(null);
  const [quickToast, setQuickToast] = useState<string | null>(null);

  const handleQuickLog = (type: BotanicalTransaction['type'], delta: string, note: string) => {
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const randomEnd = Math.random().toString(16).substring(2, 6).toUpperCase();
    const quickTx: BotanicalTransaction = {
      id: 'tx-' + Date.now(),
      txHash: `0x${randomHex}...${randomEnd}`,
      timestamp: Date.now(),
      plantName: 'Tomato Plant (Solanum lycopersicum)',
      type,
      status: 'Confirmed',
      metricsDelta: delta,
      operator: 'Quick Operator Session',
      notes: note,
      verificationScore: 99.8
    };
    setTransactions((prev) => [quickTx, ...prev]);
    setQuickToast(`Transaction ${quickTx.txHash} verified & committed!`);
    setTimeout(() => setQuickToast(null), 3000);
  };

  // New Transaction Form State
  const [newPlantName, setNewPlantName] = useState('Tomato Plant (Solanum lycopersicum)');
  const [newType, setNewType] = useState<BotanicalTransaction['type']>('Hydration Log');
  const [newMetric, setNewMetric] = useState('350ml Filtered Water');
  const [newNotes, setNewNotes] = useState('Standard watering cycle completed with bottom saucer drained.');

  const handleCreateTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const randomHex = Math.random().toString(16).substring(2, 6).toUpperCase();
    const randomEnd = Math.random().toString(16).substring(2, 6).toUpperCase();
    
    const newTx: BotanicalTransaction = {
      id: 'tx-' + Date.now(),
      txHash: `0x${randomHex}...${randomEnd}`,
      timestamp: Date.now(),
      plantName: newPlantName,
      type: newType,
      status: 'Confirmed',
      metricsDelta: newMetric,
      operator: 'Authorized User Session',
      notes: newNotes,
      verificationScore: 99.2
    };

    setTransactions([newTx, ...transactions]);
    setIsModalOpen(false);
    setNewNotes('');
  };

  const handleExportCSV = () => {
    const headers = ['Transaction Hash', 'Timestamp', 'Plant Species', 'Type', 'Status', 'Metrics Delta', 'Operator', 'Notes'];
    const rows = transactions.map(t => [
      t.txHash,
      new Date(t.timestamp).toISOString(),
      `"${t.plantName}"`,
      t.type,
      t.status,
      `"${t.metricsDelta || ''}"`,
      `"${t.operator}"`,
      `"${t.notes}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Botanical_Transactions_Audit_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredTransactions = transactions.filter((t) => {
    const matchesFilter = filterType === 'All' || t.type === filterType;
    const matchesSearch = 
      t.plantName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.txHash.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.notes.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 sm:py-12 animate-page-enter">
      
      {/* Top Professional Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-black/10 dark:border-white/10 mb-8">
        <div>
          {/* Monochromatic Technical Kicker */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/15 text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-600 dark:text-zinc-300 mb-3">
            <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white animate-pulse" />
            <span>BOTANICAL INTELLIGENCE // TRANSACTION &amp; AUDIT LEDGER</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight">
            Activity &amp; Care Transactions
          </h1>
          <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mt-2 leading-relaxed font-medium">
            Verifiable records of optical plant diagnostics, computer vision pathology scans, 3D growth model runs, and registered cultivator care interventions.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-100 font-extrabold text-xs tracking-wide shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3)] dark:shadow-[0_10px_25px_-5px_rgba(255,255,255,0.25)] flex items-center space-x-2 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Record Care Transaction</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="p-2.5 rounded-full liquid-glass-card hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-zinc-700 dark:text-zinc-300 transition-all cursor-pointer"
            title="Export CSV Audit Ledger"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Toast Confirmation */}
      {quickToast && (
        <div className="mb-6 p-3.5 rounded-2xl liquid-glass-panel border border-black/15 dark:border-white/20 flex items-center justify-between text-xs font-mono font-bold text-black dark:text-white shadow-lg animate-page-enter">
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-black dark:bg-white animate-ping" />
            <span>{quickToast}</span>
          </div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest font-mono">CONFIRMED ON LEDGER</span>
        </div>
      )}

      {/* Quick-Log Presets Bar */}
      <div className="mb-8 p-3.5 sm:p-4 rounded-2xl liquid-glass-panel border border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <Activity className="w-4 h-4 text-black dark:text-white" />
          <span>Quick Commit Actions:</span>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => handleQuickLog('Hydration Log', '350ml Filtered Water', 'Auto-dosed 350ml filtered room-temp water.')}
            className="px-3 py-1.5 rounded-xl liquid-glass-card hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-black dark:text-white flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Droplets className="w-3.5 h-3.5" />
            <span>+ 350ml Hydration</span>
          </button>
          <button
            onClick={() => handleQuickLog('Canopy Prune', '-2 Diseased Petioles', 'Excised 2 lower yellowing petioles with sterilized shears.')}
            className="px-3 py-1.5 rounded-xl liquid-glass-card hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-black dark:text-white flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>+ Foliar Prune</span>
          </button>
          <button
            onClick={() => handleQuickLog('Bio-Remedy', 'Organic Cold-Pressed Neem Spray', 'Applied broad-spectrum foliar neem extract emulsion.')}
            className="px-3 py-1.5 rounded-xl liquid-glass-card hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-black dark:text-white flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>+ Neem Shield</span>
          </button>
          <button
            onClick={() => handleQuickLog('Nutrient Feed', 'NPK 10-10-10 Micro-Dose', 'Supplemented root system with balanced bio-available nutrition.')}
            className="px-3 py-1.5 rounded-xl liquid-glass-card hover:bg-black/5 dark:hover:bg-white/10 border border-black/10 dark:border-white/15 text-xs font-bold text-black dark:text-white flex items-center space-x-1.5 cursor-pointer active:scale-95 transition-all"
          >
            <Sprout className="w-3.5 h-3.5" />
            <span>+ Nutrients</span>
          </button>
        </div>
      </div>

      {/* Metrics Strip (Luxury Monochromatic Glass Pods) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
        <div className="liquid-glass-card p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              TOTAL TRANSACTIONS
            </span>
            <Activity className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums tracking-tight">
            {transactions.length}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mt-1">
            +3 recorded today
          </span>
        </div>

        <div className="liquid-glass-card p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              VERIFIED SCANS
            </span>
            <ShieldCheck className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums tracking-tight">
            {transactions.filter(t => t.type === 'Pathology Scan').length + history.length}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mt-1">
            100% confidence audited
          </span>
        </div>

        <div className="liquid-glass-card p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              CARE PROTOCOLS
            </span>
            <Droplets className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums tracking-tight">
            {transactions.filter(t => t.type !== 'Pathology Scan').length}
          </span>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mt-1">
            Interventions logged
          </span>
        </div>

        <div className="liquid-glass-card p-4 sm:p-5 rounded-2xl border border-black/10 dark:border-white/10">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              AUDIT INTEGRITY
            </span>
            <CheckCircle2 className="w-4 h-4 text-zinc-600 dark:text-zinc-300" />
          </div>
          <span className="text-2xl sm:text-3xl font-black text-black dark:text-white tabular-nums tracking-tight">
            99.2%
          </span>
          <span className="text-[10px] font-medium text-zinc-500 dark:text-zinc-400 block mt-1">
            Zero protocol anomalies
          </span>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
        {/* Monochromatic Filter Pills */}
        <div className="flex items-center overflow-x-auto gap-1.5 p-1 rounded-2xl liquid-glass-card border border-black/10 dark:border-white/10 no-scrollbar">
          {['All', 'Pathology Scan', 'Hydration Log', 'Growth Simulation', 'Canopy Prune', 'Nutrient Feed', 'Bio-Remedy'].map((type) => {
            const isActive = filterType === type;
            return (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by hash, plant, notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 liquid-glass-input rounded-xl text-xs text-black dark:text-white placeholder:text-zinc-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Transactions Table / Cards */}
      <div className="liquid-glass-panel rounded-3xl border border-black/10 dark:border-white/10 overflow-hidden shadow-sm">
        
        {/* Table Header (Desktop) */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3.5 border-b border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02] text-[10px] font-mono tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
          <div className="col-span-3">SPECIMEN &amp; TRANSACTION HASH</div>
          <div className="col-span-2">TRANSACTION TYPE</div>
          <div className="col-span-3">OBSERVATION / PARAMETER DELTA</div>
          <div className="col-span-2">OPERATOR</div>
          <div className="col-span-2 text-right">TIMESTAMP &amp; AUDIT</div>
        </div>

        {/* Transactions List */}
        <div className="divide-y divide-black/5 dark:divide-white/5">
          {filteredTransactions.map((tx) => {
            const dateStr = new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' • ' + new Date(tx.timestamp).toLocaleDateString([], { month: 'short', day: 'numeric' });
            
            return (
              <div 
                key={tx.id}
                onClick={() => setSelectedTx(tx)}
                className="grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 p-4 sm:px-6 sm:py-4 items-start md:items-center hover:bg-black/[0.02] dark:hover:bg-white/[0.03] transition-colors cursor-pointer group"
              >
                {/* Specimen & Hash */}
                <div className="md:col-span-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-[11px] font-bold text-zinc-500 dark:text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                      {tx.txHash}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-black/5 dark:bg-white/10 text-zinc-700 dark:text-zinc-300 border border-black/10 dark:border-white/10">
                      {tx.status}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-black dark:text-white line-clamp-1 mt-0.5">
                    {tx.plantName}
                  </h4>
                </div>

                {/* Type Badge */}
                <div className="md:col-span-2 flex items-center">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold border border-black/15 dark:border-white/20 bg-black/5 dark:bg-white/5 text-black dark:text-white">
                    {tx.type}
                  </span>
                </div>

                {/* Parameter Delta & Notes */}
                <div className="md:col-span-3">
                  <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 block">
                    {tx.metricsDelta || 'Standard Observation'}
                  </span>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                    {tx.notes}
                  </p>
                </div>

                {/* Operator */}
                <div className="md:col-span-2">
                  <span className="text-[11px] font-medium text-zinc-600 dark:text-zinc-300 block line-clamp-1">
                    {tx.operator}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">
                    Accuracy: {tx.verificationScore}%
                  </span>
                </div>

                {/* Timestamp & Action */}
                <div className="md:col-span-2 flex items-center justify-between md:justify-end gap-3 text-right">
                  <div>
                    <span className="text-[11px] font-mono text-zinc-500 dark:text-zinc-400 block">
                      {dateStr}
                    </span>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-zinc-400 group-hover:text-black dark:group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                </div>
              </div>
            );
          })}

          {filteredTransactions.length === 0 && (
            <div className="p-12 text-center text-zinc-500 dark:text-zinc-400 space-y-2">
              <FileText className="w-8 h-8 mx-auto text-zinc-400" />
              <p className="text-sm font-bold">No transactions found matching criteria.</p>
              <button
                onClick={() => { setFilterType('All'); setSearchQuery(''); }}
                className="text-xs text-black dark:text-white font-bold underline cursor-pointer"
              >
                Reset filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Record New Care Transaction */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xl animate-page-enter">
          <div className="relative w-full max-w-lg liquid-glass-panel p-6 sm:p-8 rounded-3xl border border-black/15 dark:border-white/20 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-black dark:text-white">
                    Execute Care Transaction
                  </h3>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400">
                    CRYPTOGRAPHIC BOTANICAL LEDGER
                  </span>
                </div>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateTransaction} className="space-y-4">
              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                  Target Specimen
                </label>
                <select
                  value={newPlantName}
                  onChange={(e) => setNewPlantName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs font-bold text-black dark:text-white focus:outline-none"
                >
                  <option value="Tomato Plant (Solanum lycopersicum)">Tomato Plant (Solanum lycopersicum)</option>
                  <option value="Snake Plant (Sansevieria Trifasciata)">Snake Plant (Sansevieria Trifasciata)</option>
                  <option value="Fiddle Leaf Fig (Ficus Lyrata)">Fiddle Leaf Fig (Ficus Lyrata)</option>
                  <option value="Rose Plant (Rosa indica)">Rose Plant (Rosa indica)</option>
                  <option value="Holy Basil / Tulsi (Ocimum tenuiflorum)">Holy Basil / Tulsi (Ocimum tenuiflorum)</option>
                  <option value="Spinach / Palak (Spinacia oleracea)">Spinach / Palak (Spinacia oleracea)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                    Protocol Type
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs font-bold text-black dark:text-white focus:outline-none"
                  >
                    <option value="Hydration Log">Hydration Log</option>
                    <option value="Canopy Prune">Canopy Prune</option>
                    <option value="Nutrient Feed">Nutrient Feed</option>
                    <option value="Bio-Remedy">Bio-Remedy</option>
                    <option value="Growth Simulation">Growth Simulation</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                    Dosage / Metric Delta
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 350ml Water or 2 leaves pruned"
                    value={newMetric}
                    onChange={(e) => setNewMetric(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-black dark:text-white placeholder:text-zinc-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 dark:text-zinc-400 block mb-1.5">
                  Intervention Notes &amp; Observations
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Record intervention notes, water temperature, fertilizer dilution..."
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl liquid-glass-input text-xs text-black dark:text-white placeholder:text-zinc-400 focus:outline-none resize-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-zinc-500 hover:text-black dark:hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-full bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 text-xs font-extrabold tracking-wide transition-all cursor-pointer shadow-md"
                >
                  Sign &amp; Append Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View Transaction Receipt */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xl animate-page-enter">
          <div className="relative w-full max-w-md liquid-glass-panel p-6 sm:p-7 rounded-3xl border border-black/15 dark:border-white/20 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-black/10 dark:border-white/10">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-black dark:text-white" />
                <span className="font-mono text-xs font-bold tracking-widest uppercase">
                  TRANSACTION RECEIPT
                </span>
              </div>
              <button
                onClick={() => setSelectedTx(null)}
                className="p-1 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-zinc-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5 font-mono">
                <span className="text-zinc-500">TX Hash</span>
                <span className="font-bold text-black dark:text-white">{selectedTx.txHash}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500">Specimen</span>
                <span className="font-bold text-black dark:text-white text-right">{selectedTx.plantName}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500">Protocol</span>
                <span className="font-bold text-black dark:text-white">{selectedTx.type}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500">Parameter Delta</span>
                <span className="font-bold text-black dark:text-white">{selectedTx.metricsDelta || '--'}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5 font-mono">
                <span className="text-zinc-500">Timestamp</span>
                <span className="text-zinc-700 dark:text-zinc-300">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-black/5 dark:border-white/5">
                <span className="text-zinc-500">Audit Status</span>
                <span className="font-bold text-black dark:text-white">● {selectedTx.status} (Verified)</span>
              </div>
              <div className="pt-2">
                <span className="text-zinc-500 block mb-1">Observation Log:</span>
                <p className="p-3 rounded-xl bg-black/5 dark:bg-white/5 text-zinc-700 dark:text-zinc-300 leading-relaxed text-[11px]">
                  {selectedTx.notes}
                </p>
              </div>
            </div>

            <button
              onClick={() => setSelectedTx(null)}
              className="w-full py-2.5 rounded-full bg-black text-white dark:bg-white dark:text-black font-extrabold text-xs transition-all cursor-pointer"
            >
              Close Receipt
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default CareTransactionsView;
