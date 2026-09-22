import { ArrowLeft, Check, ExternalLink, Sparkles, Headphones, Piano, Sliders, BookOpen, Eye, Award } from 'lucide-react';
import { affiliateLearningTools, affiliateHardwareGear, affiliateTransparencyNotice } from '../data/affiliates';
import { onOutboundClick } from '../lib/outboundTracker';

interface StudioProps {
  onBack: () => void;
  language?: string;
}

export default function Studio({ onBack }: StudioProps) {
  return (
    <div className="relative pt-24 sm:pt-28 pb-20 px-4 sm:px-6 lg:px-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Top Back Navigation */}
        <div className="mb-6 sm:mb-8">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 hover:text-neon-cyan transition-colors duration-200 cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Home</span>
          </button>
        </div>

        {/* Hero Section */}
        <section className="text-center max-w-4xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gray-100 border border-gray-300 dark:bg-dark-800/80 dark:border-dark-600/60 mb-5 backdrop-blur-md animate-float">
            <Sparkles className="w-3.5 h-3.5 text-neon-cyan animate-pulse" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
              Curated Studio &amp; Practice Ecosystem
            </span>
          </div>

          <h1 className="font-display text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 sm:mb-5 leading-tight">
            <span className="text-gray-900 dark:text-white">The Meloscribe</span>{' '}
            <span className="text-gradient neon-text-cyan">Studio &amp; Learning Stack</span>
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 dark:text-gray-400 leading-relaxed max-w-2xl mx-auto">
            The exact tools, methods, and gear I recommend to learn, arrange, and master your favorite soundtrack pieces.
          </p>
        </section>

        {/* Section 1: The Learning Stack */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-neon-cyan font-bold mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Core Methodology</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              The Learning Stack
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
              Three distinct approaches tailored to how you learn best. Choose the path that matches your current goal.
            </p>
          </div>

          {/* 3 Learning Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
            {affiliateLearningTools.map((tool) => {
              const isMagenta = tool.badgeColor === 'magenta';
              const isCyan = tool.badgeColor === 'cyan';

              const badgeStyle = isMagenta
                ? 'bg-neon-pink/10 text-neon-pink border-neon-pink/30'
                : isCyan
                ? 'bg-neon-cyan/10 text-neon-cyan border-neon-cyan/30'
                : 'bg-violet-500/10 text-violet-400 border-violet-500/30';

              const cardHoverClass = isMagenta
                ? 'hover:border-neon-pink/40 hover:shadow-neon-pink-subtle'
                : isCyan
                ? 'hover:border-neon-cyan/40 hover:shadow-neon-cyan-subtle'
                : 'hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(168,85,247,0.25)]';

              return (
                <div
                  key={tool.id}
                  className={`flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-dark-900/60 border border-gray-200 dark:border-dark-700/60 backdrop-blur-xl transition-all duration-300 ${cardHoverClass} group relative overflow-hidden`}
                >
                  <div>
                    {/* Visual Preview Container */}
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-dark-950/80 border border-gray-200/60 dark:border-white/5">
                      <img
                        src={tool.image}
                        alt={tool.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                    </div>

                    {/* Category Tag Badge */}
                    <div className="mb-3">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide border ${badgeStyle}`}>
                        {tool.psychologicalLabel}
                      </span>
                    </div>

                    {/* Tool Name & Header Icon */}
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {tool.name}
                      </h3>
                      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-dark-800/80 text-gray-600 dark:text-gray-300">
                        {isMagenta ? (
                          <Piano className="w-4 h-4 text-neon-pink" />
                        ) : isCyan ? (
                          <Eye className="w-4 h-4 text-neon-cyan" />
                        ) : (
                          <Award className="w-4 h-4 text-violet-400" />
                        )}
                      </div>
                    </div>

                    {/* Short Punchy Sentence */}
                    <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4 line-clamp-2">
                      {tool.oneLiner}
                    </p>

                    {/* Compact Bullet Points (6-8 words each) */}
                    <ul className="space-y-2 mb-6">
                      {tool.bullets.map((bullet, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                          <div className={`p-0.5 rounded-full mt-0.5 flex-shrink-0 ${isMagenta ? 'text-neon-pink' : isCyan ? 'text-neon-cyan' : 'text-violet-400'}`}>
                            <Check className="w-3 h-3 stroke-[2.5]" />
                          </div>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Standardized Low-Friction Dark Glass CTA Button */}
                  <div className="pt-4 border-t border-gray-100 dark:border-dark-700/50 mt-auto">
                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => onOutboundClick(tool.trackingId, 'studio_page')}
                      className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/[0.05] dark:bg-white/[0.04] border border-gray-300/60 dark:border-white/10 text-gray-900 dark:text-white hover:border-neon-cyan/60 hover:bg-neon-cyan/10 hover:shadow-neon-cyan-subtle hover:text-neon-cyan dark:hover:text-neon-cyan transition-all duration-300 cursor-pointer group"
                    >
                      <span className="truncate">{tool.cta}</span>
                      <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 2: Piano & Gear Recommendations (Thomann) */}
        <section className="mb-14 sm:mb-20">
          <div className="text-center mb-8 sm:mb-10">
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-emerald-500 dark:text-emerald-400 font-bold mb-1.5">
              <Sliders className="w-3.5 h-3.5" />
              <span>Hardware Foundation</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              Piano &amp; Gear Recommendations
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1 max-w-xl mx-auto">
              Curated equipment through Europe&apos;s leading music house (Thomann). 3-year warranty, fast dispatch, and rock-solid quality.
            </p>
          </div>

          {/* 3 Hardware Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-7 items-stretch">
            {affiliateHardwareGear.map((gear) => (
              <div
                key={gear.id}
                className="flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-white/70 dark:bg-dark-900/60 border border-gray-200 dark:border-dark-700/60 backdrop-blur-xl hover:border-emerald-500/40 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all duration-300 group"
              >
                <div>
                  {/* Visual Preview Container */}
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-4 bg-gray-100 dark:bg-dark-950/80 border border-gray-200/60 dark:border-white/5">
                    <img
                      src={gear.image}
                      alt={gear.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
                  </div>

                  {/* Category Badge */}
                  <div className="mb-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold tracking-wide border bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30">
                      {gear.badge}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-display text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
                      {gear.title}
                    </h3>
                    <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-dark-800/80 text-emerald-500">
                      {gear.id === 'starter-piano' ? (
                        <Piano className="w-4 h-4" />
                      ) : gear.id === 'studio-headphones' ? (
                        <Headphones className="w-4 h-4" />
                      ) : (
                        <Sliders className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  {/* Recommendation Spec */}
                  <div className="text-xs font-semibold text-neon-cyan mb-2.5">
                    Recommended: {gear.recommendation}
                  </div>

                  {/* Short Punchy Sentence */}
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-4 line-clamp-2">
                    {gear.description}
                  </p>

                  {/* Compact Bullet Points */}
                  <ul className="space-y-2 mb-6">
                    {gear.bullets.map((bullet, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-gray-600 dark:text-gray-400 leading-normal">
                        <div className="p-0.5 rounded-full mt-0.5 flex-shrink-0 text-emerald-500 dark:text-emerald-400">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                        </div>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Standardized Low-Friction Dark Glass CTA Button */}
                <div className="pt-4 border-t border-gray-100 dark:border-dark-700/50 mt-auto">
                  <a
                    href={gear.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => onOutboundClick(gear.trackingId, 'studio_page')}
                    className="w-full py-2.5 sm:py-3 px-4 rounded-xl font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 bg-white/[0.05] dark:bg-white/[0.04] border border-gray-300/60 dark:border-white/10 text-gray-900 dark:text-white hover:border-neon-cyan/60 hover:bg-neon-cyan/10 hover:shadow-neon-cyan-subtle hover:text-neon-cyan dark:hover:text-neon-cyan transition-all duration-300 cursor-pointer group"
                  >
                    <span>{gear.cta}</span>
                    <ExternalLink className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Subtle Legal & Transparency Footer Note */}
        <div className="mt-12 sm:mt-16 pt-8 border-t border-gray-200/40 dark:border-dark-700/40 text-center max-w-3xl mx-auto">
          <p className="text-xs text-gray-400 dark:text-neutral-500 leading-relaxed">
            {affiliateTransparencyNotice.text}
          </p>
        </div>
      </div>
    </div>
  );
}
