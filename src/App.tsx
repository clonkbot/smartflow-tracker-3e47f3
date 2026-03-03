import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Activity, Zap, Filter, RefreshCw, ExternalLink } from 'lucide-react';

interface TokenData {
  id: string;
  name: string;
  symbol: string;
  marketCap: number;
  price: number;
  priceChange24h: number;
  inflow: number;
  outflow: number;
  netFlow: number;
  smartMoneyTxns: number;
  topHolder: string;
  lastActivity: string;
}

// Simulated smart money data (since we can't actually scrape)
const generateMockData = (): TokenData[] => {
  const tokens = [
    { name: 'PumpDog', symbol: 'PDOG' },
    { name: 'SolCat', symbol: 'SCAT' },
    { name: 'MoonFrog', symbol: 'MFRG' },
    { name: 'DegenApe', symbol: 'DAPE' },
    { name: 'RocketBonk', symbol: 'RBONK' },
    { name: 'GigaChad', symbol: 'GIGA' },
    { name: 'WenLambo', symbol: 'WLBO' },
    { name: 'CopiumMax', symbol: 'COPE' },
    { name: 'DiamondPaws', symbol: 'DPAW' },
    { name: 'NanoWhale', symbol: 'NWHL' },
    { name: 'AlphaGains', symbol: 'AGNS' },
    { name: 'BasedFren', symbol: 'BFREN' },
  ];

  return tokens.map((token, i) => {
    const inflow = Math.random() * 50000 + 5000;
    const outflow = Math.random() * 40000 + 2000;
    const netFlow = inflow - outflow;
    return {
      id: `token-${i}`,
      name: token.name,
      symbol: token.symbol,
      marketCap: Math.random() * 900000 + 50000,
      price: Math.random() * 0.001,
      priceChange24h: (Math.random() - 0.5) * 100,
      inflow,
      outflow,
      netFlow,
      smartMoneyTxns: Math.floor(Math.random() * 50) + 5,
      topHolder: `${Math.floor(Math.random() * 30) + 5}%`,
      lastActivity: `${Math.floor(Math.random() * 60) + 1}m ago`,
    };
  }).sort((a, b) => b.netFlow - a.netFlow);
};

const formatNumber = (num: number): string => {
  if (num >= 1000000) return `$${(num / 1000000).toFixed(2)}M`;
  if (num >= 1000) return `$${(num / 1000).toFixed(1)}K`;
  return `$${num.toFixed(2)}`;
};

const formatPrice = (num: number): string => {
  if (num < 0.0001) return `$${num.toExponential(2)}`;
  return `$${num.toFixed(6)}`;
};

function FlowBar({ inflow, outflow }: { inflow: number; outflow: number }) {
  const total = inflow + outflow;
  const inflowPercent = (inflow / total) * 100;

  return (
    <div className="relative h-2 w-full bg-black/50 rounded-full overflow-hidden border border-gray-800">
      <motion.div
        className="absolute left-0 top-0 h-full bg-gradient-to-r from-green-500 to-green-400"
        initial={{ width: 0 }}
        animate={{ width: `${inflowPercent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <motion.div
        className="absolute right-0 top-0 h-full bg-gradient-to-l from-pink-500 to-pink-600"
        initial={{ width: 0 }}
        animate={{ width: `${100 - inflowPercent}%` }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-white/10 to-transparent" />
    </div>
  );
}

function TokenRow({ token, index }: { token: TokenData; index: number }) {
  const isPositive = token.netFlow > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-gradient-to-r from-gray-900/80 to-gray-900/40 border border-gray-800/50 rounded-lg p-3 md:p-4 hover:border-cyan-500/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-r from-cyan-500/5 via-transparent to-green-500/5" />

      <div className="relative flex flex-col gap-3 md:gap-0 md:flex-row md:items-center">
        {/* Rank & Token Info */}
        <div className="flex items-center gap-3 md:w-[200px]">
          <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-500/20 to-green-500/20 border border-cyan-500/30 flex items-center justify-center">
            <span className="text-xs font-bold text-cyan-400">#{index + 1}</span>
          </div>
          <div className="min-w-0">
            <h3 className="font-semibold text-white group-hover:text-cyan-400 transition-colors truncate">{token.name}</h3>
            <p className="text-xs text-gray-500 font-mono">${token.symbol}</p>
          </div>
        </div>

        {/* Price & Change */}
        <div className="flex items-center justify-between md:justify-start gap-4 md:w-[140px]">
          <div>
            <p className="text-sm font-mono text-gray-300">{formatPrice(token.price)}</p>
            <p className={`text-xs font-mono flex items-center gap-1 ${token.priceChange24h >= 0 ? 'text-green-400' : 'text-pink-500'}`}>
              {token.priceChange24h >= 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
              {token.priceChange24h >= 0 ? '+' : ''}{token.priceChange24h.toFixed(1)}%
            </p>
          </div>
          <div className="md:hidden text-right">
            <p className="text-xs text-gray-500">MCap</p>
            <p className="text-sm font-mono text-gray-400">{formatNumber(token.marketCap)}</p>
          </div>
        </div>

        {/* Market Cap - Desktop only */}
        <div className="hidden md:block md:w-[100px]">
          <p className="text-sm font-mono text-gray-400">{formatNumber(token.marketCap)}</p>
        </div>

        {/* Flow Bar & Values */}
        <div className="flex-1 md:px-4">
          <div className="flex justify-between items-center mb-1.5 text-xs font-mono">
            <span className="text-green-400 flex items-center gap-1">
              <TrendingUp size={10} />
              {formatNumber(token.inflow)}
            </span>
            <span className="text-pink-500 flex items-center gap-1">
              {formatNumber(token.outflow)}
              <TrendingDown size={10} />
            </span>
          </div>
          <FlowBar inflow={token.inflow} outflow={token.outflow} />
        </div>

        {/* Net Flow */}
        <div className="flex items-center justify-between md:justify-end md:w-[140px] md:text-right">
          <div className="md:hidden flex items-center gap-2 text-xs text-gray-500">
            <Activity size={12} />
            <span>{token.smartMoneyTxns} txns</span>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-0.5">Net Flow</p>
            <p className={`text-base md:text-lg font-bold font-mono ${isPositive ? 'text-green-400' : 'text-pink-500'}`}>
              {isPositive ? '+' : ''}{formatNumber(token.netFlow)}
            </p>
          </div>
        </div>

        {/* Smart Money Txns - Desktop only */}
        <div className="hidden md:flex md:w-[80px] items-center justify-end gap-2 text-gray-400">
          <Activity size={14} className="text-cyan-500" />
          <span className="font-mono text-sm">{token.smartMoneyTxns}</span>
        </div>

        {/* Last Activity */}
        <div className="hidden md:block md:w-[80px] text-right">
          <p className="text-xs text-gray-500 font-mono">{token.lastActivity}</p>
        </div>
      </div>
    </motion.div>
  );
}

function ScanLine() {
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-50"
      style={{
        background: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.1) 0px, rgba(0,0,0,0.1) 1px, transparent 1px, transparent 2px)',
      }}
    >
      <motion.div
        className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent"
        animate={{
          top: ['0%', '100%'],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    </motion.div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-xl p-4 md:p-5`}
    >
      <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl ${color} opacity-10 blur-2xl`} />
      <Icon className={`w-5 h-5 mb-2 ${color.includes('green') ? 'text-green-400' : color.includes('pink') ? 'text-pink-500' : 'text-cyan-400'}`} />
      <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-xl md:text-2xl font-bold font-mono text-white">{value}</p>
    </motion.div>
  );
}

export default function App() {
  const [tokens, setTokens] = useState<TokenData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'netFlow' | 'inflow' | 'marketCap'>('netFlow');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const loadData = () => {
    setIsLoading(true);
    setTimeout(() => {
      const data = generateMockData();
      setTokens(data);
      setIsLoading(false);
      setLastUpdate(new Date());
    }, 800);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 60000);
    return () => clearInterval(interval);
  }, []);

  const sortedTokens = [...tokens].sort((a, b) => {
    if (sortBy === 'netFlow') return b.netFlow - a.netFlow;
    if (sortBy === 'inflow') return b.inflow - a.inflow;
    return b.marketCap - a.marketCap;
  });

  const totalInflow = tokens.reduce((sum, t) => sum + t.inflow, 0);
  const totalOutflow = tokens.reduce((sum, t) => sum + t.outflow, 0);
  const totalNetFlow = totalInflow - totalOutflow;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-gray-100 relative overflow-x-hidden">
      <ScanLine />

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-500/3 rounded-full blur-[150px]" />
      </div>

      {/* Noise texture overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.015]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-4 md:px-6 lg:px-8 py-6 md:py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 md:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="relative">
                  <Zap className="w-8 h-8 md:w-10 md:h-10 text-green-400" />
                  <motion.div
                    className="absolute inset-0 bg-green-400/50 blur-lg"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </div>
                <h1 className="text-2xl md:text-4xl font-bold tracking-tight">
                  <span className="text-white">SMART</span>
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-cyan-400">FLOW</span>
                </h1>
              </div>
              <p className="text-gray-500 text-sm md:text-base">
                Tracking whale movements on Solana micro-caps {'<'}$1M
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-xs text-gray-500 font-mono">
                Last update: {lastUpdate.toLocaleTimeString()}
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={loadData}
                disabled={isLoading}
                className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-cyan-500/20 to-green-500/20 border border-cyan-500/30 rounded-lg text-cyan-400 hover:border-cyan-400 transition-all text-sm font-medium min-h-[44px]"
              >
                <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Data Sources */}
          <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500 mb-6">
            <span>Data aggregated from:</span>
            <a href="https://assetdash.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors py-1">
              AssetDash <ExternalLink size={10} />
            </a>
            <span>+</span>
            <a href="https://dexscreener.com" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors py-1">
              DexScreener <ExternalLink size={10} />
            </a>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <StatCard label="Total Inflow (24h)" value={formatNumber(totalInflow)} icon={TrendingUp} color="from-green-500" />
            <StatCard label="Total Outflow (24h)" value={formatNumber(totalOutflow)} icon={TrendingDown} color="from-pink-500" />
            <StatCard label="Net Flow" value={`${totalNetFlow >= 0 ? '+' : ''}${formatNumber(totalNetFlow)}`} icon={Activity} color="from-cyan-500" />
            <StatCard label="Tokens Tracked" value={tokens.length.toString()} icon={Zap} color="from-yellow-500" />
          </div>
        </motion.header>

        {/* Sort Controls */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap items-center gap-2 mb-4"
        >
          <Filter size={14} className="text-gray-500" />
          <span className="text-xs text-gray-500 mr-2">Sort by:</span>
          {[
            { key: 'netFlow', label: 'Net Flow' },
            { key: 'inflow', label: 'Inflows' },
            { key: 'marketCap', label: 'Market Cap' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key as typeof sortBy)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all min-h-[36px] ${
                sortBy === option.key
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-gray-800/50 text-gray-400 border border-gray-700 hover:border-gray-600'
              }`}
            >
              {option.label}
            </button>
          ))}
        </motion.div>

        {/* Token List */}
        <div className="space-y-2 md:space-y-3">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-20"
              >
                <div className="flex flex-col items-center gap-4">
                  <motion.div
                    className="w-12 h-12 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  />
                  <p className="text-gray-500 text-sm font-mono">Scanning blockchain...</p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {sortedTokens.map((token, index) => (
                  <TokenRow key={token.id} token={token} index={index} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Disclaimer */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-gray-600 mt-8 md:mt-12 px-4"
        >
          * Demo data shown. Real implementation would aggregate from AssetDash and DexScreener APIs.
          <br />
          Not financial advice. Always DYOR.
        </motion.p>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs text-gray-600 mt-6 pt-6 border-t border-gray-800/50"
        >
          Requested by{' '}
          <a
            href="https://twitter.com/modzzdude"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyan-400 transition-colors"
          >
            @modzzdude
          </a>
          {' '}&middot;{' '}
          Built by{' '}
          <a
            href="https://twitter.com/clonkbot"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-500 hover:text-cyan-400 transition-colors"
          >
            @clonkbot
          </a>
        </motion.footer>
      </div>
    </div>
  );
}
