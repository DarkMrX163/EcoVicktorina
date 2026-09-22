import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  BookOpen, 
  Recycle, 
  Droplets, 
  AlertTriangle, 
  Flame, 
  Trees, 
  Lightbulb, 
  Search, 
  CheckCircle2, 
  PhoneCall, 
  ShieldAlert,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { ECO_TIPS } from '../data/ecoTips';
import { DISTRICT_ECO_CONTACTS } from '../data/districtInfo';

export const EcoTipsGuide: React.FC = () => {
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const allTags = ['all', 'ТКО', 'Сортировка', 'Водный кодекс РФ', 'Водоохранная зона', 'Прибрежная полоса', 'Чапаевка', 'Пожарная безопасность', 'Бариновка', 'Экопривычки'];

  const filteredTips = ECO_TIPS.filter((tip) => {
    const matchesTag = selectedTag === 'all' || tip.tags.includes(selectedTag);
    const matchesSearch = 
      tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tip.details.some((d) => d.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTag && matchesSearch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'tko':
        return <Recycle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'water':
        return <Droplets className="w-5 h-5 text-sky-600 dark:text-sky-400" />;
      case 'safety':
        return <Flame className="w-5 h-5 text-red-600 dark:text-red-400" />;
      case 'nature_neftegorsk':
        return <Trees className="w-5 h-5 text-teal-600 dark:text-teal-400" />;
      default:
        return <Lightbulb className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      
      {/* Top Hero Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold uppercase tracking-wider mb-3 border border-emerald-400/30">
            <BookOpen className="w-3.5 h-3.5" />
            Экологический справочник жителя
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold font-['Unbounded',sans-serif] tracking-tight">
            Полезные советы и памятки Нефтегорского района
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-2 leading-relaxed">
            Официальные рекомендации отдела экологии Администрации м.р. Нефтегорский по раздельному сбору ТКО, водоохранным зонам рек (ВК РФ) и противопожарной безопасности.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-stone-200 dark:border-zinc-800 shadow-sm space-y-4">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder="Поиск по эко-советам, законам и правилам..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-stone-50 dark:bg-zinc-800 border border-stone-200 dark:border-zinc-700 text-xs text-stone-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Tags Scroll */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedTag === tag
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-stone-100 dark:bg-zinc-800 text-stone-600 dark:text-zinc-300 hover:bg-stone-200 dark:hover:bg-zinc-700'
              }`}
            >
              {tag === 'all' ? 'Все разделы' : `#${tag}`}
            </button>
          ))}
        </div>
      </div>

      {/* Tips Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredTips.map((tip, idx) => (
          <motion.div
            key={tip.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-6 border border-stone-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition space-y-4 flex flex-col justify-between"
          >
            <div>
              {/* Category Icon & Title */}
              <div className="flex items-start gap-3 mb-2">
                <div className="p-2.5 rounded-2xl bg-stone-100 dark:bg-zinc-800 shrink-0 mt-0.5">
                  {getCategoryIcon(tip.category)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 dark:text-white leading-snug">
                    {tip.title}
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-zinc-400 mt-1 leading-relaxed">
                    {tip.summary}
                  </p>
                </div>
              </div>

              {/* Bullet Points */}
              <ul className="space-y-2 mt-4 pt-3 border-t border-stone-100 dark:border-zinc-800">
                {tip.details.map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-stone-700 dark:text-zinc-300 leading-relaxed">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              {/* Warning box if any */}
              {tip.warning && (
                <div className="mt-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-[11px] text-amber-900 dark:text-amber-200 flex items-start gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Внимание:</strong> {tip.warning}
                  </div>
                </div>
              )}
            </div>

            {/* Action Call footer */}
            <div className="pt-3 border-t border-stone-100 dark:border-zinc-800 flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{tip.actionCall}</span>
              </div>
              <div className="flex items-center gap-1">
                {tip.tags.slice(0, 2).map((t) => (
                  <span key={t} className="text-[10px] text-stone-400 dark:text-zinc-500">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* District Official Contacts Card */}
      <div className="bg-white dark:bg-zinc-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-zinc-800 shadow-md">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-stone-900 dark:text-white">
              Контакты отдела экологии Администрации района
            </h3>
            <p className="text-xs text-stone-500 dark:text-zinc-400">
              Куда обращаться при обнаружении несанкционированных свалок или сброса отходов
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">Организация:</span>
            <span className="text-stone-900 dark:text-white font-semibold">{DISTRICT_ECO_CONTACTS.organization}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">Адрес:</span>
            <span className="text-stone-900 dark:text-white font-semibold">{DISTRICT_ECO_CONTACTS.address}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">Телефон приемной:</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">{DISTRICT_ECO_CONTACTS.phone}</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-zinc-800/60 border border-stone-200/60 dark:border-zinc-700/60">
            <span className="font-bold text-stone-500 dark:text-zinc-400 block mb-1">Экстренная линия:</span>
            <span className="text-red-600 dark:text-red-400 font-bold">{DISTRICT_ECO_CONTACTS.hotline}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
