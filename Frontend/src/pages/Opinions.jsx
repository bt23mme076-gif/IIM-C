import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { FiExternalLink, FiEdit2, FiCheck, FiX, FiPlus, FiTrash2 } from 'react-icons/fi';
import { useAuth } from '../context/useAuth';

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
  const { isAdmin } = useAuth() || {};
  const [data, setData] = useState(null);
  const [saving, setSaving] = useState(false);
  const [editingField, setEditingField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [newArticle, setNewArticle] = useState('');
  const [editingArticle, setEditingArticle] = useState(null);
  const [editArticleVal, setEditArticleVal] = useState('');

  useEffect(() => {
    getDoc(doc(db, 'opinions', 'main')).then(snap => {
      if (snap.exists()) setData(snap.data());
    });
  }, []);

  const save = async (updates) => {
    setSaving(true);
    try {
      await setDoc(doc(db, 'opinions', 'main'), updates, { merge: true });
      setData(prev => ({ ...prev, ...updates }));
    } catch {
      alert('Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const commitField = async () => {
    if (!editingField || !editValue.trim()) { setEditingField(null); return; }
    await save({ [editingField]: editValue.trim() });
    setEditingField(null);
  };

  const addArticle = async () => {
    if (!newArticle.trim()) return;
    await save({ articles: [...(data.articles || []), newArticle.trim()] });
    setNewArticle('');
  };

  const removeArticle = async (i) => {
    await save({ articles: data.articles.filter((_, idx) => idx !== i) });
  };

  const saveArticle = async (i) => {
    if (!editArticleVal.trim()) { setEditingArticle(null); return; }
    await save({ articles: data.articles.map((v, idx) => idx === i ? editArticleVal.trim() : v) });
    setEditingArticle(null);
  };

  if (!data) return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F4EE]">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#1E2A38] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="bg-[#F7F4EE] min-h-screen">

      {/* Admin Banner */}
      {isAdmin && (
        <div className="bg-amber-400 text-amber-900 text-xs font-semibold text-center py-2 px-4">
          ADMIN MODE — click ✏ to edit fields · click + to add items
          {saving && <span className="ml-2 opacity-70">· saving…</span>}
        </div>
      )}

      {/* Hero */}
      <section className="py-20 px-4 sm:px-6 lg:px-16 bg-[#1E2A38]">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" animate="visible" variants={fadeInUp}>
            <p className="text-xs font-['Inter'] font-semibold tracking-[0.25em] uppercase text-gray-400 mb-4">
              Prof. Bodhibrata Nag
            </p>

            {/* Page Title */}
            {isAdmin && editingField === 'pageTitle' ? (
              <div className="flex items-center gap-2 mb-6">
                <input
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') commitField(); if (e.key === 'Escape') setEditingField(null); }}
                  className="text-4xl sm:text-5xl font-['Playfair_Display'] font-bold bg-transparent border-b-2 border-white text-white outline-none w-full"
                />
                <button onClick={commitField} className="p-2 bg-amber-400 rounded-full flex-shrink-0"><FiCheck size={16} /></button>
                <button onClick={() => setEditingField(null)} className="p-2 bg-white/20 rounded-full flex-shrink-0"><FiX size={16} className="text-white" /></button>
              </div>
            ) : (
              <div className="flex items-start gap-3 mb-6">
                <h1 className="text-4xl sm:text-6xl font-['Playfair_Display'] font-bold" style={{ color: 'white' }}>
                  {data.pageTitle}
                </h1>
                {isAdmin && (
                  <button onClick={() => { setEditingField('pageTitle'); setEditValue(data.pageTitle); }} className="mt-2 p-1.5 text-white/50 hover:text-white flex-shrink-0">
                    <FiEdit2 size={16} />
                  </button>
                )}
              </div>
            )}

            <div className="w-20 h-1 bg-white rounded-full mb-6" />

            {/* Intro */}
            {isAdmin && editingField === 'intro' ? (
              <div className="flex items-start gap-2">
                <textarea
                  autoFocus
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Escape') setEditingField(null); }}
                  rows={4}
                  className="text-base sm:text-lg font-['Inter'] bg-transparent border border-white/40 text-gray-200 outline-none w-full p-2 rounded"
                />
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button onClick={commitField} className="p-2 bg-amber-400 rounded-full"><FiCheck size={14} /></button>
                  <button onClick={() => setEditingField(null)} className="p-2 bg-white/20 rounded-full"><FiX size={14} className="text-white" /></button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-2">
                <p className="text-base sm:text-lg font-['Inter'] text-gray-300 max-w-3xl leading-relaxed">
                  {data.intro}
                </p>
                {isAdmin && (
                  <button onClick={() => { setEditingField('intro'); setEditValue(data.intro); }} className="mt-1 p-1.5 text-white/50 hover:text-white flex-shrink-0">
                    <FiEdit2 size={14} />
                  </button>
                )}
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Articles */}
      {(data.articles?.length > 0 || isAdmin) && (
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
              {(data.articles || []).map((article, i) => {
                const { title, source } = parseArticle(article);
                return (
                  <motion.div key={i} variants={fadeInUp}>
                    {isAdmin && editingArticle === i ? (
                      <div className="flex gap-2 p-4 bg-white rounded-xl border-l-4 border-[#B9975B] border border-[#D9D6CF]">
                        <div className="flex-1">
                          <input
                            autoFocus
                            value={editArticleVal}
                            onChange={e => setEditArticleVal(e.target.value)}
                            placeholder='Title (Source, Year)'
                            className="w-full text-sm font-['Inter'] border border-gray-300 rounded p-2 outline-none focus:border-[#B9975B] mb-1"
                          />
                          <p className="text-xs text-gray-400">Format: Article Title (Source, Year)</p>
                        </div>
                        <div className="flex flex-col gap-1 flex-shrink-0">
                          <button onClick={() => saveArticle(i)} className="p-2 bg-[#B9975B] text-white rounded-lg"><FiCheck size={14} /></button>
                          <button onClick={() => setEditingArticle(null)} className="p-2 bg-gray-200 rounded-lg"><FiX size={14} /></button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-4 p-5 bg-white rounded-xl border-l-4 border-[#B9975B] border border-[#D9D6CF] hover:bg-[#F7F4EE] transition-colors group relative">
                        <div className="flex-1">
                          <p className="font-['Cormorant_Garamond','Playfair_Display'] font-bold text-[#1E2A38] text-base sm:text-lg leading-snug mb-1">
                            {title}
                          </p>
                          {source && (
                            <p className="font-['Inter'] text-gray-500 text-sm">{source}</p>
                          )}
                        </div>
                        <FiExternalLink className="text-gray-400 flex-shrink-0 mt-1" size={16} />
                        {isAdmin && (
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity absolute top-3 right-8">
                            <button onClick={() => { setEditingArticle(i); setEditArticleVal(article); }} className="p-1.5 bg-[#1E2A38] text-white rounded"><FiEdit2 size={12} /></button>
                            <button onClick={() => removeArticle(i)} className="p-1.5 bg-red-500 text-white rounded"><FiTrash2 size={12} /></button>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
              {isAdmin && (
                <div className="flex gap-2 mt-4">
                  <div className="flex-1">
                    <input
                      value={newArticle}
                      onChange={e => setNewArticle(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addArticle()}
                      placeholder="Add article — format: Title (Source, Year)"
                      className="w-full text-sm font-['Inter'] border border-dashed border-[#B9975B] rounded-lg px-4 py-3 outline-none bg-transparent placeholder-[#B9975B]/50 focus:border-[#B9975B]"
                    />
                  </div>
                  <button onClick={addArticle} className="px-4 py-2 bg-[#B9975B] text-white rounded-lg font-semibold flex items-center gap-1 self-stretch">
                    <FiPlus size={14} /> Add
                  </button>
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  );
}
