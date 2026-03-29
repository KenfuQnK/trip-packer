import React, { useState, useEffect } from 'react';
import { Settings, Plus, ChevronLeft, Trash2, Edit2, Check, Map, ChevronDown, ChevronUp, Cloud, CloudOff, Loader2 } from 'lucide-react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { getFirestore, collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, writeBatch } from 'firebase/firestore';

import "./App.css";

//import { xxx } from  "./utils/constants.js";
//import { xxx } from "./utils/index.js";
//import { xxx } from "./utils/storage.js";

const userFirebaseConfig = {
  apiKey: "AIzaSyA1LMybD8t0IksQAowFw7RV-ESothB8PLk",
  authDomain: "trip-packer-7a218.firebaseapp.com",
  projectId: "trip-packer-7a218",
  storageBucket: "trip-packer-7a218.firebasestorage.app",
  messagingSenderId: "1064779330725",
  appId: "1:1064779330725:web:39db98a2e17639e935894c"
};

const IN_CANVAS = typeof __firebase_config !== 'undefined';
const firebaseConfig = IN_CANVAS ? JSON.parse(__firebase_config) : userFirebaseConfig;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const APP_ID = typeof __app_id !== 'undefined' ? __app_id : 'trip-packer-7a218';

const CATEGORY_COLORS = [
  'bg-red-100 text-red-800', 'bg-orange-100 text-orange-800', 'bg-amber-100 text-amber-800',
  'bg-green-100 text-green-800', 'bg-emerald-100 text-emerald-800', 'bg-teal-100 text-teal-800',
  'bg-cyan-100 text-cyan-800', 'bg-blue-100 text-blue-800', 'bg-indigo-100 text-indigo-800',
  'bg-violet-100 text-violet-800', 'bg-purple-100 text-purple-800', 'bg-fuchsia-100 text-fuchsia-800',
  'bg-pink-100 text-pink-800', 'bg-rose-100 text-rose-800'
];

const generateId = () => Math.random().toString(36).substr(2, 9);
const getRandomColor = () => CATEGORY_COLORS[Math.floor(Math.random() * CATEGORY_COLORS.length)];

const DEFAULT_CATEGORIES = [
  { id: 'c1', name: 'Ropa 👕', color: 'bg-blue-100 text-blue-800' },
  { id: 'c2', name: 'Aseo 🪥', color: 'bg-teal-100 text-teal-800' },
  { id: 'c3', name: 'Electrónica 📱', color: 'bg-purple-100 text-purple-800' },
  { id: 'c4', name: 'Documentos 🛂', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'c5', name: 'Botiquín 💊', color: 'bg-red-100 text-red-800' }
];

const DEFAULT_ITEMS = [
  { id: 'i1', categoryId: 'c1', name: 'Camisetas', order: 1 }, { id: 'i2', categoryId: 'c1', name: 'Pantalones', order: 2 },
  { id: 'i3', categoryId: 'c1', name: 'Ropa interior', order: 3 }, { id: 'i4', categoryId: 'c1', name: 'Calcetines', order: 4 },
  { id: 'i6', categoryId: 'c1', name: 'Chaqueta', order: 5 }, { id: 'i7', categoryId: 'c2', name: 'Cepillo de dientes', order: 1 },
  { id: 'i8', categoryId: 'c2', name: 'Pasta de dientes', order: 2 }, { id: 'i9', categoryId: 'c2', name: 'Desodorante', order: 3 },
  { id: 'i11', categoryId: 'c3', name: 'Móvil', order: 1 }, { id: 'i12', categoryId: 'c3', name: 'Cargador móvil', order: 2 },
  { id: 'i13', categoryId: 'c3', name: 'Auriculares', order: 3 }, { id: 'i15', categoryId: 'c4', name: 'DNI / Pasaporte', order: 1 },
  { id: 'i16', categoryId: 'c4', name: 'Billetes / Reservas', order: 2 }, { id: 'i18', categoryId: 'c5', name: 'Tiritas', order: 1 },
  { id: 'i19', categoryId: 'c5', name: 'Paracetamol', order: 2 }
];

function App() {
  const [user, setUser] = useState(null);
  const [authError, setAuthError] = useState(null);
  const [syncState, setSyncState] = useState('synced'); 
  const [syncErrorMsg, setSyncErrorMsg] = useState('');
  const [categories, setCategories] = useState([]);
  const [items, setItems] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [view, setView] = useState('home'); 
  const [activeTripId, setActiveTripId] = useState(null);
  const [modal, setModal] = useState({ isOpen: false, title: '', placeholder: '', value: '', onConfirm: null, isDelete: false, deleteText: '' });

  useEffect(() => {
    const initAuth = async () => {
      try {
        if (IN_CANVAS && typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
          await signInWithCustomToken(auth, __initial_auth_token);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
        setAuthError(error);
      }
    };
    initAuth();
    return onAuthStateChanged(auth, setUser);
  }, []);

  const getCollRef = (coll) => {
    return IN_CANVAS 
      ? collection(db, 'artifacts', APP_ID, 'users', user.uid, coll)
      : collection(db, 'users', user.uid, coll);
  };

  const getDocRef = (coll, id) => {
    return IN_CANVAS 
      ? doc(db, 'artifacts', APP_ID, 'users', user.uid, coll, id)
      : doc(db, 'users', user.uid, coll, id);
  };

  useEffect(() => {
    if (!user) return;
    
    let isFirstLoad = true;

    const unsubCat = onSnapshot(getCollRef('categories'), (snap) => {
      if (snap.empty && isFirstLoad) {
        const batch = writeBatch(db);
        DEFAULT_CATEGORIES.forEach(c => batch.set(getDocRef('categories', c.id), c));
        DEFAULT_ITEMS.forEach(i => batch.set(getDocRef('items', i.id), i));
        batch.commit();
      }
      isFirstLoad = false;
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => {
      console.error(err);
      setSyncState('error');
      setSyncErrorMsg('Error de lectura en Firestore (Revisa tus reglas de seguridad)');
    });

    const unsubItems = onSnapshot(getCollRef('items'), (snap) => {
      const sorted = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order || 0) - (b.order || 0));
      setItems(sorted);
    }, console.error);

    const unsubTrips = onSnapshot(getCollRef('trips'), (snap) => {
      setTrips(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      setLoading(false);
    }, console.error);

    return () => { unsubCat(); unsubItems(); unsubTrips(); };
  }, [user]);

  const openInputModal = (title, placeholder, initialValue, onConfirm) => setModal({ isOpen: true, title, placeholder, value: initialValue, onConfirm, isDelete: false });
  const openConfirmModal = (title, text, onConfirm) => setModal({ isOpen: true, title, deleteText: text, onConfirm, isDelete: true, value: '' });

  const runWithSync = async (operation) => {
    setSyncState('syncing');
    setSyncErrorMsg('');
    try {
      await operation();
      setSyncState('synced');
    } catch (error) {
      console.error("Firebase Sync Error:", error);
      setSyncState('error');
      setSyncErrorMsg(error.message);
    }
  };

  const actions = {
    addCategory: () => {
      openInputModal('Nueva Categoría', 'Ej: Playa 🏖️', '', (name) => {
        runWithSync(() => setDoc(getDocRef('categories', generateId()), { name, color: getRandomColor() }));
      });
    },
    editCategory: (cat) => {
      openInputModal('Editar Categoría', 'Nombre', cat.name, (name) => {
        runWithSync(() => updateDoc(getDocRef('categories', cat.id), { name }));
      });
    },
    deleteCategory: (cat) => {
      openConfirmModal('Eliminar Categoría', `¿Borrar "${cat.name}" y todos los items que contiene?`, () => {
        runWithSync(async () => {
          const batch = writeBatch(db);
          batch.delete(getDocRef('categories', cat.id));
          const itemsToDelete = items.filter(i => i.categoryId === cat.id).map(i => i.id);
          itemsToDelete.forEach(id => batch.delete(getDocRef('items', id)));
          trips.forEach(t => {
            const newSelected = t.selectedItems.filter(id => !itemsToDelete.includes(id));
            const newPacked = t.packedItems.filter(id => !itemsToDelete.includes(id));
            if (newSelected.length !== t.selectedItems.length) {
              batch.update(getDocRef('trips', t.id), { selectedItems: newSelected, packedItems: newPacked });
            }
          });
          await batch.commit();
        });
      });
    },
    addItem: (categoryId) => {
      openInputModal('Nuevo Item', 'Ej: Gafas de sol', '', (name) => {
        runWithSync(async () => {
          const catItems = items.filter(i => i.categoryId === categoryId);
          const order = catItems.length > 0 ? Math.max(...catItems.map(i => i.order || 0)) + 1 : 1;
          await setDoc(getDocRef('items', generateId()), { categoryId, name, order });
        });
      });
    },
    editItem: (item) => {
      openInputModal('Editar Item', 'Nombre', item.name, (name) => {
        runWithSync(() => updateDoc(getDocRef('items', item.id), { name }));
      });
    },
    deleteItem: (item) => {
      openConfirmModal('Eliminar Item', `¿Borrar "${item.name}" definitivamente?`, () => {
        runWithSync(async () => {
          const batch = writeBatch(db);
          batch.delete(getDocRef('items', item.id));
          trips.forEach(t => {
            if (t.selectedItems.includes(item.id)) {
              const newSelected = t.selectedItems.filter(id => id !== item.id);
              const newPacked = t.packedItems.filter(id => id !== item.id);
              batch.update(getDocRef('trips', t.id), { selectedItems: newSelected, packedItems: newPacked });
            }
          });
          await batch.commit();
        });
      });
    },
    moveItem: (item, direction) => {
      runWithSync(async () => {
        const catItems = items.filter(i => i.categoryId === item.categoryId);
        const index = catItems.findIndex(i => i.id === item.id);
        if (direction === 'up' && index > 0) {
          const prev = catItems[index - 1];
          const batch = writeBatch(db);
          batch.update(getDocRef('items', item.id), { order: prev.order });
          batch.update(getDocRef('items', prev.id), { order: item.order });
          await batch.commit();
        } else if (direction === 'down' && index < catItems.length - 1) {
          const next = catItems[index + 1];
          const batch = writeBatch(db);
          batch.update(getDocRef('items', item.id), { order: next.order });
          batch.update(getDocRef('items', next.id), { order: item.order });
          await batch.commit();
        }
      });
    },
    saveTrip: (draft) => {
      runWithSync(async () => {
        await setDoc(getDocRef('trips', draft.id), { name: draft.name, selectedItems: draft.selectedItems, packedItems: draft.packedItems });
        setView('home');
      });
    },
    deleteTrip: (tripId) => {
      openConfirmModal('Eliminar Viaje', '¿Seguro que quieres borrar este viaje? Se perderá todo.', () => {
        runWithSync(async () => {
          await deleteDoc(getDocRef('trips', tripId));
          setView('home');
        });
      });
    },
    togglePacked: (tripId, itemId, currentPacked) => {
      runWithSync(async () => {
        const isPacked = currentPacked.includes(itemId);
        const newPacked = isPacked ? currentPacked.filter(id => id !== itemId) : [...currentPacked, itemId];
        await updateDoc(getDocRef('trips', tripId), { packedItems: newPacked });
      });
    }
  };

  if (authError) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-6 text-center font-sans">
        <div className="bg-red-50 p-6 rounded-3xl max-w-md border border-red-200 shadow-sm">
          <h2 className="text-red-600 font-bold text-xl mb-2">Error de Autenticación</h2>
          <p className="text-slate-700 mb-4 text-sm font-medium">
            {(authError.code === 'auth/configuration-not-found' || authError.code === 'auth/operation-not-allowed')
              ? "Debes habilitar el proveedor de 'Autenticación Anónima' (Anonymous) en tu Consola de Firebase > Authentication > Sign-in method."
              : `Ha ocurrido un error al conectar con Firebase: ${authError.message}`
            }
          </p>
          <p className="text-xs text-slate-500 font-mono bg-white p-2 rounded-xl">
            {authError.code}
          </p>
        </div>
      </div>
    );
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xl">
        Cargando equipaje...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex justify-center text-slate-800 font-sans selection:bg-indigo-100">
      <div className="w-full max-w-7xl bg-white min-h-screen shadow-2xl overflow-hidden flex flex-col relative transition-all duration-300">
        
        {/* Global Sync Indicator */}
        <div className="absolute top-4 right-4 z-50">
          {syncState === 'syncing' && (
            <div className="flex items-center gap-2 bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm">
              <Loader2 size={14} className="animate-spin" /> Guardando...
            </div>
          )}
          {syncState === 'synced' && (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm opacity-70 hover:opacity-100 transition-opacity cursor-help" title={`Ruta DB: ${IN_CANVAS ? `/artifacts/${APP_ID}/users/${user.uid}/` : `/users/${user.uid}/`}`}>
              <Cloud size={14} /> Sincronizado
            </div>
          )}
          {syncState === 'error' && (
            <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm cursor-help" title={syncErrorMsg}>
              <CloudOff size={14} /> Error al guardar
            </div>
          )}
        </div>

        {view === 'home' && <HomeView trips={trips} setView={setView} setActiveTripId={setActiveTripId} />}
        {view === 'config' && <ConfigView categories={categories} items={items} setView={setView} actions={actions} />}
        {view === 'trip-edit' && <TripEditView trips={trips} activeTripId={activeTripId} categories={categories} items={items} setView={setView} actions={actions} />}
        {view === 'packer' && <PackerView trips={trips} activeTripId={activeTripId} categories={categories} items={items} setView={setView} actions={actions} />}

        {/* Global Modal */}
        {modal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-200">
              <h3 className="text-xl font-bold mb-4 text-slate-800">{modal.title}</h3>
              {!modal.isDelete ? (
                <input type="text" value={modal.value} onChange={e => setModal({...modal, value: e.target.value})} placeholder={modal.placeholder} className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-lg outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all mb-6" autoFocus />
              ) : (
                <p className="text-slate-600 mb-6 font-medium">{modal.deleteText}</p>
              )}
              <div className="flex gap-3">
                <button className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-2xl active:bg-slate-200 transition-colors" onClick={() => setModal({isOpen: false})}>Cancelar</button>
                <button className={`flex-1 py-3 px-4 text-white font-bold rounded-2xl transition-colors ${modal.isDelete ? 'bg-red-500 active:bg-red-600' : 'bg-indigo-600 active:bg-indigo-700 disabled:opacity-50'}`} onClick={() => { modal.onConfirm(modal.value); setModal({isOpen: false}); }} disabled={!modal.isDelete && !modal.value.trim()}>{modal.isDelete ? 'Eliminar' : 'Guardar'}</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

function HomeView({ trips, setView, setActiveTripId }) {
  const createTrip = () => { setActiveTripId(null); setView('trip-edit'); };
  const openTrip = (id) => { setActiveTripId(id); setView('packer'); };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="px-6 pt-12 pb-6 bg-white rounded-b-3xl shadow-sm relative z-10 border-b border-slate-100">
        <div className="flex justify-between items-center max-w-7xl mx-auto w-full">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">Mis Viajes</h1>
          <button onClick={() => setView('config')} className="p-3 bg-slate-50 text-slate-600 rounded-full hover:bg-slate-100 hover:text-indigo-600 transition-colors"><Settings size={24} /></button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {trips.length === 0 ? (
            <div className="text-center mt-16 text-slate-400">
              <Map size={64} className="mx-auto mb-4 opacity-30" />
              <p className="text-xl font-bold text-slate-500 mb-1">Aún no hay viajes</p>
              <p className="text-sm">Crea uno para empezar a preparar tu maleta.</p>
            </div>
        ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {trips.map(trip => {
                const progress = trip.selectedItems.length ? Math.round((trip.packedItems.length / trip.selectedItems.length) * 100) : 0;
                return (
                  <div key={trip.id} onClick={() => openTrip(trip.id)} className="bg-white p-5 rounded-3xl shadow-sm border border-slate-100 cursor-pointer active:scale-[0.98] transition-all hover:border-indigo-200">
                    <h3 className="font-bold text-xl mb-3 text-slate-800 truncate">{trip.name}</h3>
                    <div className="flex justify-between text-sm text-slate-500 mb-2 font-semibold">
                      <span>{trip.packedItems.length} / {trip.selectedItems.length} listos</span>
                      <span className="text-indigo-600">{progress}%</span>
                    </div>
                    <div className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{width: `${progress}%`}} />
                    </div>
                  </div>
                )
              })}
            </div>
        )}
      </div>
      <div className="p-6 pt-0 flex justify-center">
        <button onClick={createTrip} className="w-full max-w-sm bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center gap-2 active:scale-95 transition-all"><Plus size={24} /> Nuevo Viaje</button>
      </div>
    </div>
  );
}

function ConfigView({ categories, items, setView, actions }) {
  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center">
          <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full mr-3 transition-colors"><ChevronLeft size={24} /></button>
          <h2 className="font-extrabold text-xl text-slate-800">Configuración</h2>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-24">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {categories.map(category => {
            const catItems = items.filter(i => i.categoryId === category.id);
            return (
              <div key={category.id} className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 break-inside-avoid mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`font-bold text-sm px-3 py-1.5 rounded-xl ${category.color}`}>{category.name}</h3>
                  <div className="flex gap-1">
                    <button onClick={() => actions.editCategory(category)} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-full transition-colors"><Edit2 size={16}/></button>
                    <button onClick={() => actions.deleteCategory(category)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full transition-colors"><Trash2 size={16}/></button>
                  </div>
                </div>
                <div className="space-y-2">
                  {catItems.map((item, idx) => (
                      <div key={item.id} className="flex justify-between items-center bg-slate-50 p-2 pl-4 rounded-2xl border border-slate-100/50">
                        <span className="font-medium text-slate-700 truncate mr-2">{item.name}</span>
                        <div className="flex gap-1 shrink-0">
                          <div className="flex flex-col justify-center mr-1">
                            <button onClick={() => actions.moveItem(item, 'up')} disabled={idx === 0} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"><ChevronUp size={16}/></button>
                            <button onClick={() => actions.moveItem(item, 'down')} disabled={idx === catItems.length - 1} className="text-slate-300 hover:text-slate-600 disabled:opacity-30 disabled:hover:text-slate-300"><ChevronDown size={16}/></button>
                          </div>
                          <button onClick={() => actions.editItem(item)} className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><Edit2 size={16}/></button>
                          <button onClick={() => actions.deleteItem(item)} className="p-2 text-slate-400 hover:text-red-500 transition-colors"><Trash2 size={16}/></button>
                        </div>
                      </div>
                  ))}
                  <button className="w-full mt-3 py-3 rounded-2xl text-slate-500 font-bold text-sm flex items-center justify-center gap-2 hover:bg-slate-50 hover:text-indigo-600 transition-colors border-2 border-dashed border-slate-200" onClick={() => actions.addItem(category.id)}><Plus size={18}/> Añadir item</button>
                </div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center mt-6">
          <button className="w-full max-w-sm py-4 border-2 border-dashed border-indigo-200 bg-indigo-50/50 rounded-3xl text-indigo-600 font-bold flex items-center justify-center gap-2 active:scale-95 transition-all" onClick={actions.addCategory}><Plus size={20}/> Nueva Categoría</button>
        </div>
      </div>
    </div>
  );
}

function TripEditView({ trips, activeTripId, categories, items, setView, actions }) {
  const isNew = !activeTripId;
  const [draft, setDraft] = useState(() => {
    if (!isNew) return trips.find(t => t.id === activeTripId);
    return { id: generateId(), name: '', selectedItems: [], packedItems: [] };
  });
  const [collapsed, setCollapsed] = useState({});

  const toggleCategory = (categoryId) => setCollapsed(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  const toggleItem = (itemId) => {
    setDraft(prev => {
      const isSelected = prev.selectedItems.includes(itemId);
      const newSelected = isSelected ? prev.selectedItems.filter(id => id !== itemId) : [...prev.selectedItems, itemId];
      const newPacked = isSelected ? prev.packedItems.filter(id => id !== itemId) : prev.packedItems;
      return { ...prev, selectedItems: newSelected, packedItems: newPacked };
    });
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <h2 className="font-extrabold text-xl text-slate-800">{isNew ? 'Nuevo Viaje' : 'Editar Viaje'}</h2>
          <div className="w-10" />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-5 pb-24">
        <div className="mb-8 max-w-xl">
          <label className="block text-sm font-bold text-slate-500 mb-2 ml-1">Nombre del viaje</label>
          <input type="text" value={draft.name} onChange={e => setDraft({...draft, name: e.target.value})} placeholder="Ej: Fin de semana en Roma 🍕" className="w-full p-4 bg-white border border-slate-200 rounded-2xl text-lg font-semibold outline-none focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all shadow-sm" />
        </div>
        <div>
          <label className="block text-sm font-bold text-slate-500 mb-4 ml-1">¿Qué te llevas?</label>
          <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
            {categories.map(category => {
              const catItems = items.filter(i => i.categoryId === category.id);
              if (catItems.length === 0) return null;
              return (
                <div key={category.id} className="break-inside-avoid mb-6">
                  <div className={`font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg inline-flex items-center gap-2 mb-3 cursor-pointer select-none transition-opacity hover:opacity-80 ${category.color}`} onClick={() => toggleCategory(category.id)}>
                    {category.name} {collapsed[category.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                  </div>
                  {!collapsed[category.id] && (
                    <div className="grid gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
                      {catItems.map(item => {
                        const isSelected = draft.selectedItems.includes(item.id);
                        return (
                          <label key={item.id} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all border shadow-sm ${isSelected ? 'bg-indigo-50/50 border-indigo-200' : 'bg-white border-slate-100 hover:border-indigo-100'}`}>
                            <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleItem(item.id)} />
                            <div className={`shrink-0 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'}`}>
                              {isSelected && <Check size={14} strokeWidth={4} />}
                            </div>
                            <span className={isSelected ? 'font-bold text-indigo-900' : 'font-medium text-slate-700'}>{item.name}</span>
                          </label>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
      <div className="p-4 bg-white border-t border-slate-100 fixed bottom-0 left-0 right-0 z-10 flex justify-center">
        <button onClick={() => actions.saveTrip(draft)} disabled={!draft.name.trim()} className="w-full max-w-sm bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl disabled:opacity-50 active:scale-95 transition-transform shadow-lg shadow-indigo-200">Guardar Viaje</button>
      </div>
    </div>
  );
}

function PackerView({ trips, activeTripId, categories, items, setView, actions }) {
  const trip = trips.find(t => t.id === activeTripId);
  const [collapsed, setCollapsed] = useState({});

  if (!trip) return null;

  const toggleCategory = (categoryId) => setCollapsed(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  const progress = trip.selectedItems.length ? Math.round((trip.packedItems.length / trip.selectedItems.length) * 100) : 0;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <div className="bg-white px-4 pt-6 pb-4 border-b border-slate-100 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <button onClick={() => setView('home')} className="p-2 -ml-2 text-slate-400 hover:text-slate-600 bg-slate-50 rounded-full transition-colors"><ChevronLeft size={24} /></button>
          <h2 className="font-extrabold text-xl text-slate-800 truncate px-2">{trip.name}</h2>
          <div className="flex gap-1">
            <button onClick={() => setView('trip-edit')} className="p-2 text-slate-400 hover:text-indigo-600 bg-slate-50 rounded-full transition-colors"><Edit2 size={18} /></button>
            <button onClick={() => actions.deleteTrip(trip.id)} className="p-2 text-slate-400 hover:text-red-500 bg-slate-50 rounded-full transition-colors"><Trash2 size={18} /></button>
          </div>
        </div>
      </div>
      <div className="bg-white px-6 pb-4 pt-3 sticky top-[73px] z-10 border-b border-slate-100 shadow-sm">
          <div className="max-w-7xl mx-auto w-full">
            <div className="flex justify-between text-sm text-slate-500 mb-2 font-bold">
              <span>{trip.packedItems.length} de {trip.selectedItems.length} en la maleta</span>
              <span className="text-indigo-600">{progress}%</span>
            </div>
            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all duration-500 ease-out" style={{width: `${progress}%`}} />
            </div>
          </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4 pb-12">
        {trip.selectedItems.length === 0 && (
            <div className="text-center mt-12 text-slate-400">
              <p className="text-lg font-medium">No has seleccionado ningún item.</p>
              <button onClick={() => setView('trip-edit')} className="mt-4 text-indigo-600 font-bold hover:underline">Añadir items al viaje</button>
            </div>
        )}
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6">
          {categories.map(category => {
            const catItems = items.filter(i => trip.selectedItems.includes(i.id) && i.categoryId === category.id);
            if (catItems.length === 0) return null;
            return (
              <div key={category.id} className="animate-in fade-in slide-in-from-bottom-2 duration-300 break-inside-avoid mb-6">
                <div className={`font-bold text-xs uppercase tracking-wider px-3 py-2 rounded-lg inline-flex items-center gap-2 mb-3 cursor-pointer select-none transition-opacity hover:opacity-80 ${category.color}`} onClick={() => toggleCategory(category.id)}>
                  {category.name} {collapsed[category.id] ? <ChevronDown size={14} /> : <ChevronUp size={14} />}
                </div>
                {!collapsed[category.id] && (
                  <div className="space-y-2">
                    {catItems.map(item => {
                      const isPacked = trip.packedItems.includes(item.id);
                      return (
                        <div key={item.id} onClick={() => actions.togglePacked(trip.id, item.id, trip.packedItems)} className={`flex items-center gap-4 p-4 rounded-2xl cursor-pointer transition-all duration-300 ${isPacked ? 'bg-slate-50 opacity-60 scale-[0.98]' : 'bg-white shadow-sm border border-slate-100 hover:border-indigo-200'}`}>
                            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${isPacked ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-200' : 'border-slate-300 bg-white text-transparent'}`}>
                              <Check size={18} strokeWidth={3} className={isPacked ? 'opacity-100' : 'opacity-0'} />
                            </div>
                            <span className={`text-lg transition-all duration-300 ${isPacked ? 'line-through text-slate-500' : 'font-semibold text-slate-800'}`}>{item.name}</span>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}

export default App;
