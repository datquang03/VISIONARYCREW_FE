import { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';

export const ConfirmModal = ({ onConfirm, onCancel, time, date, defaultValues, onDelete, onRegister, currentUser }) => {
  const [appointmentType, setAppointmentType] = useState(defaultValues?.appointmentType || 'online');
  const [notes, setNotes] = useState(defaultValues?.notes || '');
  const [meetingLink, setMeetingLink] = useState(defaultValues?.meetingLink || '');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const canRegister = currentUser?.role === 'user' && defaultValues && !defaultValues.patient;

  useEffect(() => {
    setAppointmentType(defaultValues?.appointmentType || 'online');
    setNotes(defaultValues?.notes || '');
    setMeetingLink(defaultValues?.meetingLink || '');
  }, [defaultValues]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({
      date: date.toISOString().split('T')[0],
      timeSlot: {
        startTime: time.split(' - ')[0].replace('AM', '').replace('PM', '').trim() + ':00',
        endTime: time.split(' - ')[1].replace('AM', '').replace('PM', '').trim() + ':00',
      },
      appointmentType,
      notes,
      meetingLink: appointmentType === 'online' ? meetingLink : undefined,
    });
  };

  // Hiển thị thông tin chi tiết lịch đã đặt
  const renderDetails = () => {
    if (!defaultValues) return null;
    return (
      <div className="mb-3 text-sm text-gray-600 bg-gray-50 rounded-lg p-3">
        <div><span className="font-semibold">Trạng thái:</span> <span className="text-green-600 font-bold uppercase">{defaultValues.status || 'available'}</span></div>
        {defaultValues.createdAt && (
          <div><span className="font-semibold">Tạo lúc:</span> {new Date(defaultValues.createdAt).toLocaleString('vi-VN')}</div>
        )}
        {defaultValues.updatedAt && (
          <div><span className="font-semibold">Cập nhật lúc:</span> {new Date(defaultValues.updatedAt).toLocaleString('vi-VN')}</div>
        )}
      </div>
    );
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <form
          onSubmit={handleSubmit}
          className="bg-white p-7 rounded-2xl shadow-2xl max-w-md w-full border border-green-200"
        >
          <h2 className="text-2xl font-bold mb-3 text-green-700 text-center">{defaultValues ? 'Chi tiết lịch rảnh' : 'Xác nhận tạo lịch'}</h2>
          <div className="mb-3 text-gray-700 text-center">
            {(() => {
              let showDate = null;
              if (defaultValues && defaultValues.date) {
                const d = new Date(defaultValues.date);
                if (!isNaN(d)) showDate = d.toLocaleDateString('vi-VN');
              } else if (date && typeof date?.toLocaleDateString === 'function') {
                showDate = date.toLocaleDateString('vi-VN');
              }
              return defaultValues
                ? <>Bạn đã tạo lịch rảnh vào <b>{time}</b> ngày <b>{showDate || '...'}</b></>
                : <>Bạn muốn tạo lịch rảnh vào <b>{time}</b> ngày <b>{showDate || '...'}</b>?</>;
            })()}
          </div>
          {renderDetails()}
          <div className="mb-3">
            <label className="block font-semibold mb-1">Loại lịch hẹn</label>
            <select
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
              value={appointmentType}
              onChange={e => setAppointmentType(e.target.value)}
            >
              <option value="online">Online</option>
              <option value="offline">Offline</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="block font-semibold mb-1">Ghi chú</label>
            <textarea
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400 resize-none"
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Nhập ghi chú cho lịch hẹn (tuỳ chọn)"
            />
          </div>
          {appointmentType === 'online' && (
            <div className="mb-3">
              <label className="block font-semibold mb-1">Link cuộc họp (Zoom, Google Meet...)</label>
              <input
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                type="url"
                value={meetingLink}
                onChange={e => setMeetingLink(e.target.value)}
                placeholder="https://..."
                required
              />
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            {canRegister && (
              <button
                type="button"
                onClick={() => onRegister && onRegister(defaultValues._id)}
                className="px-6 py-2 bg-yellow-400 text-white rounded-lg font-bold shadow hover:bg-yellow-500 transition"
              >
                Đăng ký lịch
              </button>
            )}
            {onDelete && (
              <>
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-5 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition"
                >
                  Xóa lịch
                </button>
                {/* Dialog xác nhận xóa */}
                {showDeleteConfirm && (
                  <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 shadow-xl max-w-xs w-full text-center">
                      <div className="text-lg font-bold mb-2 text-red-600">Xác nhận xóa lịch?</div>
                      <div className="mb-4 text-gray-700">Bạn có chắc chắn muốn xóa lịch này không?</div>
                      <div className="flex justify-center gap-4">
                        <button
                          type="button"
                          onClick={() => setShowDeleteConfirm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 font-semibold"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => { setShowDeleteConfirm(false); onDelete(); }}
                          className="px-4 py-2 bg-red-500 text-white rounded font-semibold hover:bg-red-600"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
            <button
              type="button"
              onClick={onCancel}
              className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg font-bold shadow hover:from-green-500 hover:to-green-700 transition"
            >
              {defaultValues ? 'Cập nhật' : 'Xác nhận'}
            </button>
          </div>
        </form>
      </div>
    </AnimatePresence>
  );
};
