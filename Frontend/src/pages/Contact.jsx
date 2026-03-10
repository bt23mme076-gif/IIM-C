import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { FiMail, FiPhone, FiMapPin, FiExternalLink } from 'react-icons/fi';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } }
};

export default function Contact() {
  const [data, setData] = useState(null);

  useEffect(() => {
    getDoc(doc(db, 'contact', 'main')).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, []);

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
      <div className="w-12 h-12 border-4 border-[#D9D6CF] border-t-[#1E2A38] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F7F4EE] min-h-screen">
      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-[#1E2A38]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs font-['Inter'] font-semibold tracking-[0.25em] uppercase text-[#B9975B] mb-4">
              Prof. Bodhibrata Nag
            </p>
            <h1 className="text-4xl sm:text-6xl font-['Cormorant_Garamond','Playfair_Display'] font-bold mb-6" style={{ color: 'white' }}>
              {data.pageTitle}
            </h1>
            <div className="w-20 h-1 bg-[#B9975B] rounded-full mb-6" />
            {data.contactText && (
              <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
                {data.contactText}
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Contact Details */}
      <section className="py-16 px-4 sm:px-6 lg:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="space-y-6"
            initial="hidden" whileInView="visible" viewport={{ once: true }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
          >
            {data.institution && (
              <motion.div variants={fadeInUp} className="flex gap-5 p-6 bg-white rounded-xl border border-[#D9D6CF] border-l-4 border-l-[#B9975B]">
                <FiMapPin size={22} className="text-[#B9975B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[#1E2A38] mb-1">Institution</p>
                  <p className="font-['Inter'] text-[#5B6472]">{data.institution}</p>
                  {data.address && <p className="font-['Inter'] text-[#5B6472] text-sm mt-0.5">{data.address}</p>}
                </div>
              </motion.div>
            )}

            {data.email && (
              <motion.div variants={fadeInUp} className="flex gap-5 p-6 bg-white rounded-xl border border-[#D9D6CF] border-l-4 border-l-[#B9975B]">
                <FiMail size={22} className="text-[#B9975B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[#1E2A38] mb-1">Email</p>
                  <a
                    href={`mailto:${data.email}`}
                    className="font-['Inter'] text-[#B9975B] hover:underline flex items-center gap-2"
                  >
                    {data.email} <FiExternalLink size={14} />
                  </a>
                </div>
              </motion.div>
            )}

            {data.phone && (
              <motion.div variants={fadeInUp} className="flex gap-5 p-6 bg-white rounded-xl border border-[#D9D6CF] border-l-4 border-l-[#B9975B]">
                <FiPhone size={22} className="text-[#B9975B] mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-['Inter'] font-semibold text-[#1E2A38] mb-1">Phone</p>
                  <p className="font-['Inter'] text-[#5B6472]">{data.phone}</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
