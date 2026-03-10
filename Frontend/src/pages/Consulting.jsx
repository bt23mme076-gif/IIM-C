import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FiBriefcase, FiCheckCircle } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } };

export default function Consulting() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'consulting', 'main')).then(snap => {
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
            <h1 className="text-4xl sm:text-6xl font-['Playfair_Display'] font-bold text-white mb-6">
              {data.pageTitle}
            </h1>
            <div className="w-20 h-1 bg-white rounded-full mb-6" />
            <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
              {data.intro}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Interests */}
      {data.consultingInterests?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-16 bg-[#F7F4EE]">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-2">
                Areas of Interest
              </h2>
              <div className="w-16 h-1 bg-[#B9975B] rounded-full mb-8" />
              <div className="flex flex-wrap gap-3">
                {data.consultingInterests.map((area, i) => (
                  <span key={i} className="px-5 py-2 bg-[#1E2A38] text-white font-['Inter'] text-sm font-semibold rounded-full">
                    {area}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Projects */}
      {data.consultingProjects?.length > 0 && (
        <section className="py-14 px-4 sm:px-6 lg:px-16 bg-white">
          <div className="max-w-5xl mx-auto">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeInUp}>
              <h2 className="text-2xl sm:text-3xl font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] mb-2">
                Consulting Projects
              </h2>
              <div className="w-16 h-1 bg-[#B9975B] rounded-full mb-8" />
            </motion.div>
            <motion.div
              className="space-y-4"
              initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}
            >
              {data.consultingProjects.map((project, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  className="flex gap-4 p-5 bg-white rounded-xl border-l-4 border-[#B9975B] border border-[#D9D6CF]"
                >
                  <FiBriefcase className="text-[#B9975B] mt-0.5 flex-shrink-0" size={18} />
                  <p className="font-['Inter'] text-gray-800 text-sm sm:text-base leading-relaxed">{project}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
