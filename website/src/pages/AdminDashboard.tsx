import { useEffect, useState, useRef } from 'react';
import { ArrowLeft, Shield, Key, Loader2, Upload, Trash2, RefreshCw, FileText, Music, Tv, Archive, DollarSign, User, Calendar, AlertCircle, CheckCircle } from 'lucide-react';
import { songs, Song } from '../data/songs';

interface AdminDashboardProps {
  onBack: () => void;
  language: string;
  showToast: (message: string) => void;
}

interface R2File {
  key: string;
  size: number;
  last_modified: string;
}

interface OrderInfo {
  transaction_id: string;
  email: string;
  song_name: string;
  amount: number;
  currency: string;
  status: string;
  download_hash: string;
  locale: string;
  buyer_name: string;
  download_count: number;
  created_at: string;
}

export default function AdminDashboard({ onBack, language, showToast }: AdminDashboardProps) {
  const [passcode, setPasscode] = useState(() => localStorage.getItem('admin_passcode') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'packages' | 'orders'>('packages');
  const [loading, setLoading] = useState(false);
  const [r2Files, setR2Files] = useState<R2File[]>([]);
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [uploadingType, setUploadingType] = useState<{ songId: string; type: string } | null>(null);

  // Dynamic Songs Catalog State
  const [allSongs, setAllSongs] = useState<Song[]>(songs);

  // Form states for creating a new song
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newSongTitle, setNewSongTitle] = useState('');
  const [newSongArtist, setNewSongArtist] = useState('');
  const [newSongDifficulty, setNewSongDifficulty] = useState<'Easy' | 'Original'>('Easy');
  const [newSongPrice, setNewSongPrice] = useState('6 €');
  const [newSongPriceId, setNewSongPriceId] = useState('');

  const isDe = language === 'de';

  const API_BASE = import.meta.env.VITE_API_URL || 
    (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'http://localhost:8787'
      : 'https://api.meloscribe.dev');

  const fetchR2Data = async (code: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/packages`, {
        headers: { 'x-admin-passcode': code }
      });
      const songsRes = await fetch(`${API_BASE}/api/public/songs`);
      
      if (res.ok) {
        const data = await res.json();
        setR2Files(data.files || []);
        setIsAuthenticated(true);
        localStorage.setItem('admin_passcode', code);

        if (songsRes.ok) {
          const songsData = await songsRes.json();
          if (Array.isArray(songsData) && songsData.length > 0) {
            setAllSongs(songsData);
          }
        }
      } else {
        setIsAuthenticated(false);
        showToast(isDe ? 'Falscher Passcode oder Serverfehler' : 'Invalid passcode or server error');
      }
    } catch (err) {
      console.error('Admin API error:', err);
      showToast(isDe ? 'Verbindungsfehler zum Backend' : 'Backend connection error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSongTitle || !newSongArtist) {
      showToast(isDe ? 'Titel und Künstler sind erforderlich' : 'Title and artist are required');
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/songs/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({
          song: {
            title: newSongTitle,
            artist: newSongArtist,
            difficulty: newSongDifficulty,
            price: newSongPrice,
            kofiId: newSongPriceId,
            coverImage: `/covers/${newSongTitle}.jpg`
          }
        })
      });
      
      if (res.ok) {
        showToast(isDe ? 'Song erfolgreich erstellt!' : 'Song created successfully!');
        setShowCreateForm(false);
        setNewSongTitle('');
        setNewSongArtist('');
        setNewSongDifficulty('Easy');
        setNewSongPrice('6 €');
        setNewSongPriceId('');
        fetchR2Data(passcode);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.detail || (isDe ? 'Fehler beim Erstellen' : 'Error creating song'));
      }
    } catch (err) {
      console.error('Create song error:', err);
      showToast(isDe ? 'Netzwerkfehler' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSong = async (songId: string, title: string) => {
    if (!window.confirm(isDe ? `Song "${title}" wirklich aus der Datenbank löschen? (Hochgeladene R2-Dateien bleiben bestehen)` : `Really delete song "${title}" from the database? (Uploaded R2 files will remain)`)) return;
    
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/songs/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ id: songId })
      });
      
      if (res.ok) {
        showToast(isDe ? 'Song gelöscht!' : 'Song deleted successfully!');
        fetchR2Data(passcode);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.detail || (isDe ? 'Löschen fehlgeschlagen' : 'Delete failed'));
      }
    } catch (err) {
      console.error('Delete song error:', err);
      showToast(isDe ? 'Netzwerkfehler' : 'Network error');
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders`, {
        headers: { 'x-admin-passcode': passcode }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (passcode) {
      fetchR2Data(passcode);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && activeTab === 'orders') {
      fetchOrders();
    }
  }, [isAuthenticated, activeTab]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcode) return;
    fetchR2Data(passcode);
  };

  const handleLogout = () => {
    setPasscode('');
    setIsAuthenticated(false);
    localStorage.removeItem('admin_passcode');
  };

  const handleResetDownloads = async (txnId: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/orders/reset`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ transaction_id: txnId })
      });
      if (res.ok) {
        showToast(isDe ? 'Download-Zähler zurückgesetzt!' : 'Downloads reset successfully!');
        fetchOrders();
      } else {
        showToast(isDe ? 'Zurücksetzen fehlgeschlagen' : 'Reset failed');
      }
    } catch (err) {
      console.error('Reset error:', err);
      showToast(isDe ? 'Netzwerkfehler' : 'Network error');
    }
  };

  const handleDeleteFile = async (key: string) => {
    if (!window.confirm(isDe ? `Datei "${key}" wirklich aus R2 löschen?` : `Really delete file "${key}" from R2?`)) return;
    try {
      const res = await fetch(`${API_BASE}/api/admin/delete`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-passcode': passcode
        },
        body: JSON.stringify({ key })
      });
      if (res.ok) {
        showToast(isDe ? 'Datei gelöscht!' : 'File deleted successfully!');
        fetchR2Data(passcode);
      } else {
        showToast(isDe ? 'Löschen fehlgeschlagen' : 'Delete failed');
      }
    } catch (err) {
      console.error('Delete error:', err);
      showToast(isDe ? 'Netzwerkfehler' : 'Network error');
    }
  };

  const handleFileUpload = async (songTitle: string, songId: string, type: string, file: File) => {
    setUploadingType({ songId, type });
    showToast(isDe ? 'Lade Datei hoch...' : 'Uploading file...');

    const formData = new FormData();
    formData.append('song_name', songTitle);
    formData.append('type', type);
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE}/api/admin/upload`, {
        method: 'POST',
        headers: {
          'x-admin-passcode': passcode
        },
        body: formData
      });
      if (res.ok) {
        showToast(isDe ? 'Upload erfolgreich abgeschlossen!' : 'Upload completed successfully!');
        fetchR2Data(passcode);
      } else {
        const errData = await res.json().catch(() => ({}));
        showToast(errData.detail || (isDe ? 'Upload fehlgeschlagen' : 'Upload failed'));
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast(isDe ? 'Netzwerkfehler beim Upload' : 'Network error during upload');
    } finally {
      setUploadingType(null);
    }
  };

  // Helper to find file size in MB
  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Check if specific file exists in R2 list
  const getR2File = (songTitle: string, type: string) => {
    const filename = fName(songTitle, type);
    const r2Key = type === 'zip' ? filename : `${songTitle}/${filename}`;
    return r2Files.find(f => f.key === r2Key);
  };

  const fName = (songTitle: string, type: string) => {
    return type === 'pdf' ? `${songTitle}.pdf` :
           type === 'midi' ? `${songTitle}.mid` :
           type === 'midi_slow' ? `${songTitle} slow.mid` :
           type === 'video' ? `${songTitle}.mp4` :
           type === 'video_slow' ? `${songTitle} slow.mp4` :
           `${songTitle} Full Package.zip`;
  };

  if (!isAuthenticated) {
    return (
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[85vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto glass-card p-8 rounded-2xl border border-neon-cyan/20 dark:border-neon-cyan/35 bg-white/70 dark:bg-dark-800/80 backdrop-blur-md text-center shadow-2xl relative overflow-hidden">
          <div className="absolute -top-12 -left-12 w-24 h-24 bg-neon-cyan/10 rounded-full blur-2xl pointer-events-none" />
          
          <div className="inline-flex p-3 rounded-full bg-neon-cyan/10 border border-neon-cyan/20 mb-4">
            <Shield className="w-8 h-8 text-neon-cyan" />
          </div>
          
          <h1 className="font-display text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-2">
            {isDe ? 'Admin-Bereich' : 'Admin Panel'}
          </h1>
          <p className="text-gray-550 dark:text-gray-400 text-sm mb-6">
            {isDe ? 'Bitte gib das Administrator-Passwort ein.' : 'Please enter the administrator passcode.'}
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="relative">
              <Key className="absolute left-3.5 top-3.5 w-5 h-5 text-gray-400" />
              <input 
                type="password"
                placeholder={isDe ? 'Passcode eingeben...' : 'Enter passcode...'}
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-xl focus:border-neon-cyan dark:focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan outline-none text-sm transition-all text-gray-900 dark:text-white"
              />
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-neon-cyan text-dark-950 font-bold hover:shadow-neon-cyan transition-all duration-300 disabled:opacity-50 cursor-pointer"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
              <span>{isDe ? 'Dashboard betreten' : 'Enter Dashboard'}</span>
            </button>
          </form>

          <button 
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs text-gray-550 hover:text-neon-cyan mx-auto mt-6 transition-colors duration-300"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{isDe ? 'Zurück zur Website' : 'Back to Website'}</span>
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 min-h-[90vh]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Block */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20 uppercase">Admin Mode</span>
              <button 
                onClick={handleLogout}
                className="text-xs text-neon-pink hover:underline focus:outline-none"
              >
                ({isDe ? 'Abmelden' : 'Logout'})
              </button>
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white mt-1">
              {isDe ? 'Meloscribe Leitstand' : 'Meloscribe Dashboard'}
            </h1>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => activeTab === 'packages' ? fetchR2Data(passcode) : fetchOrders()}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-dark-800 border border-gray-200 dark:border-dark-600 hover:border-neon-cyan transition-all text-gray-500 dark:text-gray-400 hover:text-neon-cyan cursor-pointer"
              title={isDe ? 'Aktualisieren' : 'Refresh'}
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button 
              onClick={onBack}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neon-cyan/10 hover:bg-neon-cyan/20 border border-neon-cyan/20 hover:border-neon-cyan text-sm text-neon-cyan font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>{isDe ? 'Zurück zur Seite' : 'Back to Website'}</span>
            </button>
          </div>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-gray-200 dark:border-dark-600/50 mb-8">
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 focus:outline-none cursor-pointer flex items-center gap-2 ${
              activeTab === 'packages' 
                ? 'border-neon-cyan text-neon-cyan' 
                : 'border-transparent text-gray-500 hover:text-gray-805 dark:hover:text-white'
            }`}
          >
            <Archive className="w-4 h-4" />
            <span>{isDe ? 'R2 Song-Pakete verwalten' : 'Manage R2 Song Packages'}</span>
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-3 font-semibold text-sm transition-all border-b-2 focus:outline-none cursor-pointer flex items-center gap-2 ${
              activeTab === 'orders' 
                ? 'border-neon-cyan text-neon-cyan' 
                : 'border-transparent text-gray-500 hover:text-gray-850 dark:hover:text-white'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>{isDe ? 'Bestellungen & Klicks' : 'Purchases & Downloads'}</span>
          </button>
        </div>

        {/* LOADING STATE OVERLAY */}
        {loading && activeTab === 'packages' && r2Files.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-neon-cyan mb-2" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{isDe ? 'Daten werden abgefragt...' : 'Loading packages...'}</span>
          </div>
        )}

        {/* TAB 1: MANAGE R2 PACKAGES */}
        {activeTab === 'packages' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-neon-cyan/5 border border-neon-cyan/25 rounded-xl p-4 text-xs text-neon-cyan leading-relaxed flex items-start gap-2.5 max-w-2xl flex-1">
                <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">Cloudflare R2 Synchronisierung</p>
                  <p className="text-gray-650 dark:text-gray-450 mt-0.5">
                    Hier siehst du den Status der R2-Notenpakete in Echtzeit. Lade korrigierte PDFs, MIDIs oder Übungsvideos direkt hoch, um fehlerhafte Medien nahtlos und live zu ersetzen.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowCreateForm(!showCreateForm)}
                className="px-4 py-3 rounded-xl bg-neon-cyan text-dark-950 font-bold hover:shadow-neon-cyan transition-all text-xs shrink-0 h-fit cursor-pointer"
              >
                {showCreateForm ? (isDe ? 'Abbrechen' : 'Cancel') : (isDe ? 'Neuen Song anlegen' : 'Create New Song')}
              </button>
            </div>

            {/* CREATE SONG FORM */}
            {showCreateForm && (
              <form onSubmit={handleCreateSong} className="glass-card border border-neon-cyan/30 bg-white/70 dark:bg-dark-800/80 p-6 rounded-2xl space-y-4 max-w-2xl animate-in slide-in-from-top duration-300">
                <h3 className="text-base font-bold text-gray-900 dark:text-white">{isDe ? 'Neuen Song anlegen' : 'Create New Song'}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-550 mb-1">{isDe ? 'Songtitel *' : 'Song Title *'}</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Sweetest Rain"
                      value={newSongTitle}
                      onChange={e => setNewSongTitle(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-xs outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-550 mb-1">{isDe ? 'Künstler *' : 'Artist *'}</label>
                    <input 
                      type="text"
                      required
                      placeholder="e.g. Meloscribe"
                      value={newSongArtist}
                      onChange={e => setNewSongArtist(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-xs outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-550 mb-1">{isDe ? 'Schwierigkeitsgrad' : 'Difficulty'}</label>
                    <select
                      value={newSongDifficulty}
                      onChange={e => setNewSongDifficulty(e.target.value as any)}
                      className="w-full px-3 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-xs outline-none focus:border-neon-cyan"
                    >
                      <option value="Easy">Easy</option>
                      <option value="Original">Original</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-550 mb-1">{isDe ? 'Preis (Anzeige)' : 'Price (Display)'}</label>
                    <input 
                      type="text"
                      placeholder="e.g. 6 €"
                      value={newSongPrice}
                      onChange={e => setNewSongPrice(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-xs outline-none focus:border-neon-cyan"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-550 mb-1">Paddle Price ID</label>
                    <input 
                      type="text"
                      placeholder="pri_01kwap..."
                      value={newSongPriceId}
                      onChange={e => setNewSongPriceId(e.target.value)}
                      className="w-full px-3.5 py-2 bg-gray-50 dark:bg-dark-900 border border-gray-200 dark:border-dark-600 rounded-lg text-xs outline-none focus:border-neon-cyan"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button 
                    type="button" 
                    onClick={() => setShowCreateForm(false)}
                    className="px-4 py-2 rounded-lg border border-gray-200 dark:border-dark-600 text-xs font-semibold text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-dark-900 cursor-pointer"
                  >
                    {isDe ? 'Abbrechen' : 'Cancel'}
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 rounded-lg bg-neon-cyan text-dark-950 font-bold text-xs hover:shadow-neon-cyan cursor-pointer"
                  >
                    {isDe ? 'Erstellen' : 'Create'}
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 gap-6">
              {allSongs.map((song) => {
                const types = [
                  { id: 'pdf', name: 'Piano PDF', icon: FileText },
                  { id: 'video', name: 'Performance Video (2K)', icon: Tv },
                  { id: 'video_slow', name: 'Slow Practice Video (2K)', icon: Tv },
                  { id: 'midi', name: 'MIDI (Normal)', icon: Music },
                  { id: 'midi_slow', name: 'MIDI (Slow)', icon: Music },
                  { id: 'zip', name: 'Complete ZIP Package', icon: Archive }
                ];

                return (
                  <div key={song.id} className="glass-card border border-gray-200/80 bg-white/70 dark:border-dark-600/50 dark:bg-dark-800/80 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute -top-12 -left-12 w-24 h-24 bg-neon-cyan/5 rounded-full blur-2xl pointer-events-none" />
                    
                    {/* Song Card Header */}
                    <div className="flex items-center gap-4 pb-4 border-b border-gray-200/50 dark:border-dark-600/50 mb-6 justify-between flex-wrap">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-150 dark:bg-dark-900 border border-gray-200 dark:border-dark-650 overflow-hidden flex items-center justify-center flex-shrink-0">
                          <img 
                            src={`/covers/${song.title.replace(" (All Parts)", "").replace(" (Part 1)", "").replace(" (Part 2)", "")}.jpg`}
                            alt={song.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-lg">{song.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{song.artist}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] bg-dark-900/40 dark:bg-dark-950/60 px-2.5 py-1 rounded-full border border-gray-200/40 dark:border-dark-650 text-gray-400 dark:text-gray-400">
                          Paddle ID: {song.kofiId || 'None'}
                        </span>
                        <button
                          onClick={() => handleDeleteSong(song.id, song.title)}
                          className="p-1.5 border border-transparent rounded-lg text-gray-500 hover:text-neon-pink hover:border-neon-pink/20 hover:bg-neon-pink/5 transition-all duration-300 cursor-pointer"
                          title={isDe ? 'Song aus Katalog löschen' : 'Delete song from catalog'}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Files Checklist Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {types.map((t) => {
                        const file = getR2File(song.title, t.id);
                        const isUploading = uploadingType?.songId === song.id && uploadingType?.type === t.id;
                        const Icon = t.icon;

                        return (
                          <div key={t.id} className="p-3.5 rounded-xl border border-gray-200/60 dark:border-dark-700/50 bg-gray-50/50 dark:bg-dark-900/30 flex flex-col justify-between min-h-[120px] relative">
                            {/* File Info */}
                            <div className="flex items-start gap-2.5">
                              <div className={`p-1.5 rounded-lg border mt-0.5 ${file ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan' : 'bg-neon-pink/10 border-neon-pink/20 text-neon-pink'}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">{t.name}</h4>
                                <span className="block text-[10px] text-gray-500 dark:text-gray-500 mt-0.5 truncate">
                                  {fName(song.title, t.id)}
                                </span>
                                {file ? (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neon-cyan mt-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                                    {formatBytes(file.size)}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-neon-pink mt-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-neon-pink" />
                                    {isDe ? 'Nicht hochgeladen' : 'Missing'}
                                  </span>
                                )}
                              </div>
                            </div>

                            {/* Actions Buttons for File */}
                            <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-200/40 dark:border-dark-700/30">
                              {/* Upload Input */}
                              <label className="flex-1">
                                <input 
                                  type="file"
                                  className="hidden"
                                  disabled={isUploading}
                                  onChange={(e) => {
                                    const fileObj = e.target.files?.[0];
                                    if (fileObj) {
                                      handleFileUpload(song.title, song.id, t.id, fileObj);
                                    }
                                  }}
                                />
                                <div className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 border border-dashed border-gray-300 dark:border-dark-600 hover:border-neon-cyan dark:hover:border-neon-cyan rounded-lg text-[11px] font-semibold text-gray-600 dark:text-gray-400 hover:text-neon-cyan dark:hover:text-neon-cyan cursor-pointer transition-all duration-300">
                                  {isUploading ? (
                                    <Loader2 className="w-3 h-3 animate-spin" />
                                  ) : (
                                    <Upload className="w-3 h-3" />
                                  )}
                                  <span>{isDe ? 'Hochladen' : 'Upload'}</span>
                                </div>
                              </label>

                              {/* Delete button if exists */}
                              {file && (
                                <button
                                  onClick={() => handleDeleteFile(file.key)}
                                  className="p-1.5 border border-transparent rounded-lg text-gray-500 hover:text-neon-pink hover:border-neon-pink/20 hover:bg-neon-pink/5 transition-all duration-300 cursor-pointer"
                                  title={isDe ? 'Löschen' : 'Delete'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VIEW SQLite PURCHASES & RESET COUNTER */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="bg-neon-pink/5 border border-neon-pink/25 rounded-xl p-4 text-xs text-neon-pink leading-relaxed flex items-start gap-2.5 max-w-2xl">
              <CheckCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 dark:text-white">Kunden-Support & Download-Klicks</p>
                <p className="text-gray-650 dark:text-gray-450 mt-0.5">
                  Hier siehst du alle registrierten Zahlungen. Du kannst für jeden Kunden seinen Download-Klickzähler (Limit: 50) zurücksetzen, falls er das Limit erreicht hat und wieder Zugriff benötigt.
                </p>
              </div>
            </div>

            {loading && orders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Loader2 className="w-8 h-8 animate-spin text-neon-pink mb-2" />
                <span className="text-sm text-gray-500 dark:text-gray-400">{isDe ? 'Transaktionen werden geladen...' : 'Loading purchases...'}</span>
              </div>
            ) : orders.length === 0 ? (
              <div className="glass-card p-10 rounded-2xl border border-gray-200/50 dark:border-dark-600/50 text-center text-gray-500">
                {isDe ? 'Keine Bestellungen in der Datenbank gefunden.' : 'No purchases found in database.'}
              </div>
            ) : (
              <div className="glass-card border border-gray-200/80 bg-white/70 dark:border-dark-600/50 dark:bg-dark-800/80 rounded-2xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-gray-100/50 dark:bg-dark-900/50 border-b border-gray-200/50 dark:border-dark-600/50 text-gray-550 font-semibold uppercase tracking-wider">
                        <th className="px-5 py-4">{isDe ? 'Datum' : 'Date'}</th>
                        <th className="px-5 py-4">{isDe ? 'Bestellung ID' : 'Order ID'}</th>
                        <th className="px-5 py-4">{isDe ? 'Song' : 'Song'}</th>
                        <th className="px-5 py-4">{isDe ? 'Käufer' : 'Buyer'}</th>
                        <th className="px-5 py-4 text-center">{isDe ? 'Klicks' : 'Clicks'}</th>
                        <th className="px-5 py-4 text-right">{isDe ? 'Aktion' : 'Action'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200/30 dark:divide-dark-700/30">
                      {orders.map((order) => (
                        <tr key={order.transaction_id} className="hover:bg-gray-55/30 dark:hover:bg-dark-900/30 transition-colors">
                          <td className="px-5 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400 font-medium">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              {new Date(order.created_at).toLocaleDateString(isDe ? 'de-DE' : 'en-US', {
                                year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
                              })}
                            </span>
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap font-mono text-[10px] text-neon-cyan">
                            {order.transaction_id}
                          </td>
                          <td className="px-5 py-4 font-semibold text-gray-900 dark:text-white max-w-[200px] truncate">
                            {order.song_name}
                          </td>
                          <td className="px-5 py-4 whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                                <User className="w-3 h-3 text-neon-pink" />
                                {order.buyer_name || 'N/A'}
                              </span>
                              <span className="text-[10px] text-gray-500 mt-0.5">{order.email}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-center whitespace-nowrap">
                            <span className={`px-2 py-0.5 rounded-full font-bold font-mono text-[10px] ${
                              order.download_count >= 50 
                                ? 'bg-neon-pink/15 text-neon-pink border border-neon-pink/20' 
                                : 'bg-neon-cyan/15 text-neon-cyan border border-neon-cyan/20'
                            }`}>
                              {order.download_count} / 50
                            </span>
                          </td>
                          <td className="px-5 py-4 text-right whitespace-nowrap">
                            <button
                              onClick={() => handleResetDownloads(order.transaction_id)}
                              className="px-3 py-1.5 border border-neon-pink/30 hover:border-neon-pink bg-neon-pink/5 hover:bg-neon-pink/15 rounded-lg text-[10px] text-neon-pink font-bold transition-all duration-300 cursor-pointer flex items-center gap-1 ml-auto"
                            >
                              <RefreshCw className="w-3 h-3" />
                              <span>{isDe ? 'Klicks zurücksetzen' : 'Reset Clicks'}</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </section>
  );
}
