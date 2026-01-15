
import { GoogleGenAI, Type } from "@google/genai";
import { AttendanceRecord } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const getAttendanceSummary = async (records: AttendanceRecord[]): Promise<string> => {
  if (records.length === 0) return "Chưa có dữ liệu để phân tích.";

  try {
    const dataString = records.map(r => `${r.order}. ${r.fullName} (${r.unit}) - ${r.note}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Phân tích danh sách điểm danh sau và đưa ra một bản tóm tắt ngắn gọn bằng tiếng Việt:
      Số lượng người tham gia, cơ cấu theo đơn vị, và các ghi chú quan trọng nếu có.
      
      Danh sách:
      ${dataString}`,
      config: {
        temperature: 0.7,
      }
    });

    return response.text || "Không thể tạo bản tóm tắt.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi phân tích dữ liệu bằng AI.";
  }
};
