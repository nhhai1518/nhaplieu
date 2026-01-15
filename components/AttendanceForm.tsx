
import React, { useState } from 'react';
import { AttendanceRecord } from '../types';

interface AttendanceFormProps {
  onAdd: (record: Omit<AttendanceRecord, 'id' | 'order' | 'timestamp'>) => void;
  nextOrder: number;
}

const AttendanceForm: React.FC<AttendanceFormProps> = ({ onAdd, nextOrder }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    unit: '',
    note: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.unit) {
      alert("Vui lòng điền đầy đủ Họ tên và Đơn vị.");
      return;
    }
    onAdd(formData);
    setFormData({ fullName: '', unit: '', note: '' });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h2 className="text-xl font-semibold text-slate-800 mb-6 flex items-center gap-2">
        <span className="w-2 h-6 bg-blue-600 rounded-full"></span>
        Thông Tin Điểm Danh
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Thứ tự hiện tại</label>
          <input 
            type="text" 
            value={nextOrder} 
            disabled 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 cursor-not-allowed"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Họ và Tên <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Nhập họ và tên đầy đủ"
            value={formData.fullName}
            onChange={(e) => setFormData({...formData, fullName: e.target.value})}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Đơn vị <span className="text-red-500">*</span></label>
          <input 
            type="text" 
            placeholder="Nhập tên đơn vị/phòng ban"
            value={formData.unit}
            onChange={(e) => setFormData({...formData, unit: e.target.value})}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Ghi chú</label>
          <textarea 
            placeholder="Nhập ghi chú (nếu có)"
            value={formData.note}
            onChange={(e) => setFormData({...formData, note: e.target.value})}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none h-24 resize-none"
          />
        </div>

        <button 
          type="submit"
          className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all active:scale-[0.98]"
        >
          Xác Nhận Điểm Danh
        </button>
      </form>
    </div>
  );
};

export default AttendanceForm;
