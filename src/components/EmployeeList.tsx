// src/components/EmployeeList.tsx

import React from "react";
import { Employee } from "../interface/Employee";
import "./EmployeeList.css";
import { Pencil, Trash2, CheckCircle } from "lucide-react";

interface EmployeeListProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

const EmployeeList: React.FC<EmployeeListProps> = ({
  employees,
  onEdit,
  onDelete,
}) => {
  if (employees.length === 0) {
    return (
      <div className="no-employees-container">
        <div className="no-employees-content">
          <div className="no-employees-icon">
            <CheckCircle size={64} strokeWidth={2} />
          </div>
          <h3>ไม่พบข้อมูลพนักงาน</h3>
          <p>โปรดเพิ่มพนักงานใหม่หรือปรับเปลี่ยนการค้นหา</p>
        </div>
      </div>
    );
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      "linear-gradient(135deg, #667eea, #764ba2)",
      "linear-gradient(135deg, #f093fb, #f5576c)",
      "linear-gradient(135deg, #4facfe, #00f2fe)",
      "linear-gradient(135deg, #a8edea, #fed6e3)",
      "linear-gradient(135deg, #ffecd2, #fcb69f)",
      "linear-gradient(135deg, #ff9a9e, #fecfef)",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div className="employee-list-container">
      <div className="employee-grid">
        {employees.map((employee) => (
          <div key={employee.id} className="employee-card">
            <div className="employee-card-header">
              <div
                className="employee-avatar"
                style={{ background: getAvatarColor(employee.firstName) }}
              >
                {getInitials(employee.firstName, employee.lastName)}
              </div>
              <div className="employee-info">
                <h3 className="employee-name">
                  {employee.firstName} {employee.lastName}
                </h3>
                <p className="employee-department">{employee.department}</p>
                <p className="employee-id">ID: {employee.id}</p>
              </div>
            </div>

            <div className="employee-card-body">
              <div className="employee-details">
                <div className="detail-item">
                  <span className="detail-label">วันเกิด</span>
                  <span className="detail-value">{employee.birthdate}</span>
                </div>
              </div>
            </div>

            <div className="employee-card-footer">
              <button
                onClick={() => onEdit(employee)}
                className="action-btn edit-btn"
                aria-label="Edit employee"
              >
                <Pencil size={18} strokeWidth={2} />
                <span>แก้ไข</span>
              </button>
              <button
                onClick={() => onDelete(employee)}
                className="action-btn delete-btn"
                aria-label="Delete employee"
              >
                <Trash2 size={18} strokeWidth={2} />
                <span>ลบ</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EmployeeList;
