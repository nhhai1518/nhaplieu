
import React from 'react';
import { AttendanceRecord } from '../types';

interface AttendanceTableProps {
  records: AttendanceRecord[];
  onRemove: (id: string) => void;
}

const AttendanceTable: React.FC<AttendanceTableProps> = ({ records, onRemove }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-bottom border-slate-200">
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 w-16">STT</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Họ và Tên</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Đơn vị</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Ghi chú</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600">Thời gian</th>
              <th className="px-6 py-4 text-sm font-semibold text-slate-600 text-center w-20">Thao tác</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-slate-400 italic">
                  Chưa có ai điểm danh.
                </td>
              </tr>
            ) : (
              records.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm text-slate-600">{record.order}</td>
                  <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.fullName}</td>
                  <td className="px-6 py-4 text-sm text-slate-600">{record.unit}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.note || '-'}</td>
                  <td className="px-6 py-4 text-xs text-slate-400">
                    {new Date(record.timestamp).toLocaleTimeString('vi-VN')}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button 
                      onClick={() => onRemove(record.id)}
                      className="text-red-400 hover:text-red-600 transition-colors p-1"
                      title="Xóa"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AttendanceTable;
