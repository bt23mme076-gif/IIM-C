import { useState, useEffect } from 'react';
import { db } from '../../firebase/config';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { FiEdit2, FiTrash2, FiPlus, FiSave, FiX, FiCheck } from 'react-icons/fi';

export default function ResearchEditor() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('publications');
  const [editingItem, setEditingItem] = useState(null);
  const [newItem, setNewItem] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const snap = await getDoc(doc(db, 'content', 'research'));
      if (snap.exists()) {
        setData(snap.data());
      } else {
        setData({});
      }
    } catch (err) {
      console.error("Error fetching research data:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveData = async (updates) => {
    try {
      await updateDoc(doc(db, 'content', 'research'), updates);
      setData(prev => ({ ...prev, ...updates }));
      setEditingItem(null);
      setNewItem(null);
      alert('Saved successfully!');
    } catch (err) {
      console.error("Error saving data:", err);
      alert('Failed to save.');
    }
  };

  const handleUpdateItem = async (listName, item) => {
    const list = data[listName] || [];
    const updatedList = list.map(i => i.id === item.id ? item : i);
    await saveData({ [listName]: updatedList });
  };

  const handleAddItem = async (listName, item) => {
    const list = data[listName] || [];
    const itemWithId = { ...item, id: Date.now() };
    await saveData({ [listName]: [...list, itemWithId] });
  };

  const handleDeleteItem = async (listName, id) => {
    if (!window.confirm('Delete this item?')) return;
    const list = data[listName] || [];
    const updatedList = list.filter(i => i.id !== id);
    await saveData({ [listName]: updatedList });
  };

  if (loading) return <div>Loading...</div>;

  const tabs = [
    { id: 'publications', label: 'Publications', field: 'featured_publications' },
    { id: 'chapters', label: 'Book Chapters', field: 'book_chapters' },
    { id: 'cases', label: 'Cases', field: 'cases' },
    { id: 'projects', label: 'Projects', field: 'research_projects' }
  ];

  const renderForm = (item, onSave, onCancel) => {
    const handleChange = (e) => {
      const { name, value } = e.target;
      onSave({ ...item, [name]: value }, false); 
    };
    
    // Helper to commit changes
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(item, true); // true indicates "commit"
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-gray-50 p-4 rounded-lg border">
            {activeTab !== 'projects' ? (
                <>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Title</label>
                        <input name="title" value={item.title || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Authors</label>
                        <input name="authors" value={item.authors || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Year</label>
                            <input name="year" value={item.year || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Journal/Source</label>
                            <input name="journal" value={item.journal || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">DOI/Link</label>
                            <input name="doi" value={item.doi || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Type (e.g. Article, Chapter)</label>
                            <input name="type" value={item.type || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                </>
            ) : (
                <>
                     <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Project Title</label>
                        <input name="title" value={item.title || ''} onChange={handleChange} className="w-full p-2 border rounded" required />
                    </div>
                     <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Funding Agency</label>
                        <input name="fundingAgency" value={item.fundingAgency || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Role</label>
                            <input name="role" value={item.role || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Amount</label>
                            <input name="amount" value={item.amount || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                        </div>
                    </div>
                     <div>
                        <label className="block text-xs font-semibold uppercase text-gray-500 mb-1">Period</label>
                        <input name="period" value={item.period || ''} onChange={handleChange} className="w-full p-2 border rounded" />
                    </div>
                </>
            )}
            
            <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={onCancel} className="px-3 py-1 text-gray-600 hover:bg-gray-200 rounded">Cancel</button>
                <button type="submit" className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700">Save Item</button>
            </div>
        </form>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">Manage Research</h2>
      
      {/* Page Heading & Description Edit */}
      <div className="mb-8 p-4 bg-gray-50 rounded border">
        <h3 className="font-semibold text-lg mb-4">Page Header</h3>
        <div className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Heading</label>
                <div className="flex gap-2">
                    <input 
                        value={data.page_heading || ''} 
                        onChange={(e) => setData({...data, page_heading: e.target.value})}
                        className="flex-1 p-2 border rounded"
                    />
                    <button onClick={() => saveData({page_heading: data.page_heading})} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Description</label>
                <div className="flex gap-2">
                    <textarea 
                        value={data.page_description || ''} 
                        onChange={(e) => setData({...data, page_description: e.target.value})}
                        className="flex-1 p-2 border rounded"
                        rows={3}
                    />
                    <button onClick={() => saveData({page_description: data.page_description})} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 h-fit">Save</button>
                </div>
            </div>
        </div>
      </div>

      <div className="flex gap-2 mb-6 border-b overflow-x-auto pb-1">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setEditingItem(null); setNewItem(null); }}
            className={`px-4 py-2 rounded-t-lg font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mb-4 flex justify-between items-center">
          <h3 className="text-lg font-semibold">{tabs.find(t => t.id === activeTab)?.label} List</h3>
          <button 
            onClick={() => setNewItem({})}
            className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
              <FiPlus /> Add New
          </button>
      </div>

      {newItem && (
          <div className="mb-6">
              {renderForm(newItem, (item, commit) => {
                  if (commit) handleAddItem(tabs.find(t => t.id === activeTab).field, item);
                  else setNewItem(item);
              }, () => setNewItem(null))}
          </div>
      )}

      <div className="space-y-4">
        {(!data[tabs.find(t => t.id === activeTab).field] || data[tabs.find(t => t.id === activeTab).field].length === 0) && (
            <p className="text-gray-400 italic">No items found.</p>
        )}
        
        {(data[tabs.find(t => t.id === activeTab).field] || []).map((item) => (
          <div key={item.id} className="border rounded-lg p-4 bg-white hover:bg-gray-50 transition-colors">
            {editingItem?.id === item.id ? (
                renderForm(editingItem, (update, commit) => {
                    if (commit) handleUpdateItem(tabs.find(t => t.id === activeTab).field, update);
                    else setEditingItem(update);
                }, () => setEditingItem(null))
            ) : (
                <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{item.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">
                            {item.authors && <span className="mr-2 text-gray-800">{item.authors}</span>}
                            {item.year && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">{item.year}</span>}
                        </p>
                        {item.journal && <p className="text-sm text-gray-500 italic mt-1">{item.journal}</p>}
                        {item.fundingAgency && <p className="text-sm text-gray-500 mt-1">Funded by: {item.fundingAgency}</p>}
                    </div>
                    <div className="flex gap-2">
                        <button 
                            onClick={() => setEditingItem(item)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                            title="Edit"
                        >
                            <FiEdit2 />
                        </button>
                        <button 
                            onClick={() => handleDeleteItem(tabs.find(t => t.id === activeTab).field, item.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded"
                             title="Delete"
                        >
                            <FiTrash2 />
                        </button>
                    </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}