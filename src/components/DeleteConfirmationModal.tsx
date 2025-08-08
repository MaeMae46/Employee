// src/components/DeleteConfirmationModal.tsx

import React from "react";
import { Trash2, X } from "lucide-react";
import "./DeleteConfirmationModal.css";

interface DeleteConfirmationModalProps {
  employeeName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
  employeeName,
  onConfirm,
  onCancel,
}) => {
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="modal-header">
          <h3 className="modal-title">ยืนยันการลบพนักงาน</h3>
          <button onClick={onCancel} className="close-btn">
            <X size={20} />
          </button>
        </div>
        <div className="modal-body">
          <p>
            คุณต้องการลบพนักงานชื่อ <strong>{employeeName}</strong> ใช่หรือไม่?
            การกระทำนี้ไม่สามารถย้อนกลับได้
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={onCancel} className="btn btn-cancel">
            ยกเลิก
          </button>
          <button onClick={onConfirm} className="btn btn-delete">
            <Trash2 size={16} /> ลบ
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;
