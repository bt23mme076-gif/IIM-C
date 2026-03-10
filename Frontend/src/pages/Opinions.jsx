import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FiExternalLink } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

// Parse "(Forbes, 2026)" style suffix from article string
const parseArticle = (text) => {
  const match = text.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (match) return { title: match[1].trim(), source: match[2].trim() };
  return { title: text, source: '' };
};

export default function Opinions() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'opinions', 'main')).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E2A38] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F7F4EE] min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-[#1E2A38]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs font-['Inter'] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-4">
              Prof. Bodhibrata Nag
            </p>
            <h1 className="text-4xl sm:text-6xl font-['Playfair_Display'] font-bold mb-6" style={{ color: 'white' }}>
              {data.pageTitle}
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6" />
            <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
              {data.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      {data.articles?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-2">
                Articles & Thought Leadership
              </h2>
              <div className="w-16 h-1 bg-[#B9975B] rounded-full mb-8" />
            </motion.div>
            <motion.div
              className="space-y-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            >
              {data.articles.map((article, i) => {
                const { title, source } = parseArticle(article);
                return (
                  <motion.div
                    key={i}
                    variants={fadeInUp}
                    className="flex items-start gap-4 p-5 bg-white rounded-xl border-l-4 border-[#B9975B] border border-[#D9D6CF] hover:bg-[#F7F4EE] transition-colors"
                  >
                    <div className="flex-1">
                      <p className="font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] text-base sm:text-lg leading-snug mb-1">
                        {title}
                      </p>
                      {source && (
                        <p className="font-['Inter'] text-gray-500 text-sm">{source}</p>
                      )}
                    </div>
                    <FiExternalLink className="text-gray-400 flex-shrink-0 mt-1" size={16} />
                  </motion.div>
                );
              })}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
