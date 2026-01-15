
import React, { useState, useEffect, useCallback } from 'react';
import AttendanceForm from './components/AttendanceForm';
import AttendanceTable from './components/AttendanceTable';
import GoogleSheetsInstructions from './components/GoogleSheetsInstructions';
import { AttendanceRecord } from './types';
import { getAttendanceSummary } from './services/geminiService';

const App: React.FC = () => {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [isInstructionsOpen, setIsInstructionsOpen] = useState(false);
  const [aiSummary, setAiSummary] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Load records from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('attendance_records');
    if (saved) {
      try {
        setRecords(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved records");
      }
    }
  }, []);

  // Save records to local storage on change
  useEffect(() => {
    localStorage.setItem('attendance_records', JSON.stringify(records));
  }, [records]);

  const handleAddRecord = (data: Omit<AttendanceRecord, 'id' | 'order' | 'timestamp'>) => {
    const newRecord: AttendanceRecord = {
      ...data,
      id: crypto.randomUUID(),
      order: records.length + 1,
      timestamp: new Date().toISOString()
    };
    setRecords(prev => [...prev, newRecord]);
    
    // Simulate API call to Google Sheets if user had set a URL
    console.log("Mock sending data to Google Sheets:", newRecord);
  };

  const handleRemoveRecord = (id: string) => {
    setRecords(prev => {
      const filtered = prev.filter(r => r.id !== id);
      // Re-order remaining records
      return filtered.map((r, index) => ({ ...r, order: index + 1 }));
    });
  };

  const handleAnalyze = async () => {
    if (records.length === 0) return;
    setIsAnalyzing(true);
    const summary = await getAttendanceSummary(records);
    setAiSummary(summary);
    setIsAnalyzing(false);
  };

  const exportToCsv = () => {
    if (records.length === 0) return;
    const headers = ["STT", "Ho va Ten", "Don vi", "Ghi chu", "Thoi gian"];
    const rows = records.map(r => [
      r.order, 
      r.fullName, 
      r.unit, 
      r.note, 
      new Date(r.timestamp).toLocaleString('vi-VN')
    ]);
    
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `diem_danh_tap_huan_${new Date().toLocaleDateString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-200">
              A
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800 leading-none">AttendancePro</h1>
              <p className="text-xs text-slate-500 mt-1">Hệ thống điểm danh tập huấn</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsInstructionsOpen(true)}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Kết nối Drive
            </button>
            <button 
              onClick={exportToCsv}
              disabled={records.length === 0}
              className="px-4 py-2 text-sm font-medium bg-slate-800 text-white hover:bg-slate-900 rounded-lg transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Xuất Excel (CSV)
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Form & Insights */}
          <div className="lg:col-span-4 space-y-6">
            <AttendanceForm onAdd={handleAddRecord} nextOrder={records.length + 1} />
            
            {/* AI Insight Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.3 1.047a1 1 0 01.897.95V4.31a8.001 8.001 0 017.75 7.64 8 8 0 11-15.897-1.123 1 1 0 111.95.452 6 6 0 1011.893.841 6 6 0 00-5.743-5.522v3.2a1 1 0 01-1.707.707l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.103-.231z" clipRule="evenodd" />
                  </svg>
                  Tóm tắt bằng AI
                </h3>
                <button 
                  onClick={handleAnalyze}
                  disabled={records.length === 0 || isAnalyzing}
                  className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-slate-400"
                >
                  {isAnalyzing ? 'Đang phân tích...' : 'Cập nhật'}
                </button>
              </div>
              
              {aiSummary ? (
                <div className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-lg border border-slate-100">
                  {aiSummary}
                </div>
              ) : (
                <p className="text-sm text-slate-400 italic">
                  Nhấn "Cập nhật" để AI tóm tắt tình hình tập huấn.
                </p>
              )}
            </div>
          </div>

          {/* Right Column: Attendance List */}
          <div className="lg:col-span-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-800">
                Danh Sách Tham Dự 
                <span className="ml-3 text-sm font-normal text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                  {records.length} người
                </span>
              </h2>
            </div>
            
            <AttendanceTable records={records} onRemove={handleRemoveRecord} />
          </div>
        </div>
      </main>

      {/* Instructions Modal */}
      {isInstructionsOpen && (
        <GoogleSheetsInstructions onClose={() => setIsInstructionsOpen(false)} />
      )}

      {/* Footer */}
      <footer className="mt-12 py-8 border-t border-slate-200 text-center text-slate-400 text-sm">
        &copy; {new Date().getFullYear()} AttendancePro - Giải pháp quản lý tập huấn hiện đại
      </footer>
    </div>
  );
};

export default App;
