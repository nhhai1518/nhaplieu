
import React from 'react';

const GoogleSheetsInstructions: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white z-10">
          <h3 className="text-xl font-bold text-slate-800">Hướng dẫn xuất dữ liệu ra Google Sheets</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-6 space-y-4 text-slate-600">
          <p>Để tự động hóa việc xuất dữ liệu này vào Google Sheets trong Drive của bạn, hãy thực hiện các bước sau:</p>
          <ol className="list-decimal list-inside space-y-3">
            <li>Tạo một Google Sheet mới.</li>
            <li>Vào menu <span className="font-semibold">Extensions (Tiện ích mở rộng)</span> &gt; <span className="font-semibold">Apps Script</span>.</li>
            <li>Dán mã sau vào trình biên tập Apps Script:
              <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg mt-2 text-xs overflow-x-auto">
{`function doPost(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var data = JSON.parse(e.postData.contents);
  sheet.appendRow([
    data.order, 
    data.fullName, 
    data.unit, 
    data.note, 
    new Date()
  ]);
  return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
}`}
              </pre>
            </li>
            <li>Nhấn <span className="font-semibold">Deploy</span> &gt; <span className="font-semibold">New Deployment</span>. Chọn loại "Web App", cấu hình quyền truy cập cho "Anyone".</li>
            <li>Sao chép URL Web App được cấp.</li>
            <li>Trong ứng dụng này, khi người dùng nhấn "Xác nhận", hệ thống sẽ gửi một yêu cầu POST đến URL đó.</li>
          </ol>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-6">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Phiên bản demo này hiện đang lưu dữ liệu tạm thời vào bộ nhớ trình duyệt để bạn trải nghiệm UI/UX.
            </p>
          </div>
        </div>
        <div className="p-6 border-t border-slate-100 text-right">
          <button 
            onClick={onClose}
            className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleSheetsInstructions;
