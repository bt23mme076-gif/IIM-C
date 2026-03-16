import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { FiPlus, FiTrash2, FiEdit2, FiSave, FiX } from 'react-icons/fi';

export default function ConsultingEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('interests');
  const [newItem, setNewItem] = useState('');
  const [editIndex, setEditIndex] = useState(null);
  const [editValue, setEditValue] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snap = await getDoc(doc(db, 'consulting', 'main'));
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData({});
      }
    } catch (err) {
      console.error("Error fetching consulting data:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (updates) => {
    try {
      await setDoc(doc(db, 'consulting', 'main'), updates, { merge: true });
      setData(prev => ({ ...prev, ...updates }));
      alert('Saved successfully!');
    } catch (err) {
      console.error("Error saving data:", err);
      alert('Failed to save.');
    }
  };

  const handleAddStringItem = async (listName) => {
    if (!newItem.trim()) return;
    const list = data[listName] || [];
    await saveData({ [listName]: [...list, newItem.trim()] });
    setNewItem('');
  };

  const handleUpdateStringItem = async (listName, index) => {
    if (!editValue.trim()) return;
    const list = data[listName] || [];
    const updatedList = list.map((item, i) => i === index ? editValue.trim() : item);
    await saveData({ [listName]: updatedList });
    setEditIndex(null);
    setEditValue('');
  };

  const handleDeleteStringItem = async (listName, index) => {
    if (!window.confirm('Delete this item?')) return;
    const list = data[listName] || [];
    const updatedList = list.filter((_, i) => i !== index);
    await saveData({ [listName]: updatedList });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Manage Consulting</h2>
      
      {/* Page Header */}
      <div className="mb-8 p-4 bg-gray-50 rounded border space-y-4">
        <h3 className="font-semibold text-lg">Page Header</h3>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Page Title</label>
            <div className="flex gap-2">
                <input 
                    value={data.pageTitle || ''} 
                    onChange={(e) => setData({...data, pageTitle: e.target.value})}
                    className="flex-1 p-2 border rounded"
                />
                <button 
                    onClick={() => saveData({pageTitle: data.pageTitle})} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Save
                </button>
            </div>
        </div>
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Intro Text</label>
            <div className="flex gap-2">
                <textarea 
                    value={data.intro || ''} 
                    onChange={(e) => setData({...data, intro: e.target.value})}
                    rows={3}
                    className="flex-1 p-2 border rounded"
                />
                <button 
                    onClick={() => saveData({intro: data.intro})} 
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 h-fit"
                >
                    Save
                </button>
            </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        <button 
            onClick={() => { setActiveTab('interests'); setEditIndex(null); }}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'interests' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Areas of Interest
        </button>
         <button 
            onClick={() => { setActiveTab('projects'); setEditIndex(null); }}
            className={`px-4 py-2 font-medium transition-colors ${activeTab === 'projects' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
            Projects
        </button>
      </div>

      <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">{activeTab === 'interests' ? 'Interests List' : 'Projects List'}</h3>
          <div className="flex gap-2 mb-4">
               <input 
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    placeholder={`Add new ${activeTab === 'interests' ? 'interest' : 'project'}...`}
                    className="flex-1 p-2 border rounded"
                />
                <button 
                    onClick={() => handleAddStringItem(activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects')}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 flex items-center gap-2"
                >
                    <FiPlus /> Add
                </button>
          </div>

          <div className="space-y-2">
            {(!data[activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects'] || 
              data[activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects'].length === 0) && (
                <p className="text-gray-400 italic">No items found.</p>
            )}

            {(data[activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects'] || []).map((item, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded bg-gray-50 hover:bg-white transition-colors group">
                    {editIndex === index ? (
                        <>
                            <input 
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="flex-1 p-1 border rounded"
                                autoFocus
                            />
                            <button 
                                onClick={() => handleUpdateStringItem(activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects', index)} 
                                className="p-2 text-green-600 hover:bg-green-100 rounded"
                            >
                                <FiCheck size={18} />
                            </button>
                             <button 
                                onClick={() => { setEditIndex(null); setEditValue(''); }} 
                                className="p-2 text-red-600 hover:bg-red-100 rounded"
                            >
                                <FiX size={18} />
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="flex-1 block text-gray-800 text-sm whitespace-pre-wrap">{item}</span>
                            <div className="flex opacity-50 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => { setEditIndex(index); setEditValue(item); }} 
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                                >
                                    <FiEdit2 size={16} />
                                </button>
                                <button 
                                    onClick={() => handleDeleteStringItem(activeTab === 'interests' ? 'consultingInterests' : 'consultingProjects', index)} 
                                    className="p-2 text-red-600 hover:bg-red-100 rounded"
                                >
                                    <FiTrash2 size={16} />
                                </button>
                            </div>
                        </>
                    )}
                </div>
            ))}
          </div>
      </div>
    </div>
  );
}