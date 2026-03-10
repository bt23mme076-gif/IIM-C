import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FiAward, FiUsers } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Recognitions() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'recognitions', 'main')).then(snap => {
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

      {/* Awards */}
      {data.awards?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-2 flex items-center gap-3">
                <FiAward size={24} /> Awards & Honours
              </h2>
              <div className="w-16 h-1 bg-[#B9975B] rounded-full mb-8" />
            </motion.div>
            <motion.div
              className="grid sm:grid-cols-2 gap-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            >
              {data.awards.map((award, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="p-5 bg-white rounded-xl border-l-4 border-[#B9975B] border border-[#D9D6CF]"
                >
                  <p className="font-['Inter'] text-gray-800 text-sm sm:text-base leading-relaxed">{award}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Affiliations */}
      {data.affiliations?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-2 flex items-center gap-3">
                <FiUsers size={24} /> Professional Affiliations
              </h2>
              <div className="w-16 h-1 bg-[#B9975B] rounded-full mb-8" />
            </motion.div>
            <motion.div
              className="space-y-3"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            >
              {data.affiliations.map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex gap-4 p-4 bg-white rounded-xl border border-gray-200"
                >
                  <div className="w-2 h-2 rounded-full bg-[#B9975B] mt-2 flex-shrink-0" />
                  <p className="font-['Inter'] text-gray-800 text-sm sm:text-base">{item}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
