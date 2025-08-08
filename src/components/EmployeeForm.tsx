import React, { useState, ChangeEvent, FormEvent } from "react";
import { Employee } from "../interface/Employee";
import "./EmployeeForm.css";
// เพิ่มไอคอน X, Check จาก Lucide React
import { X, Check } from "lucide-react";

interface EmployeeFormProps {
  onSubmit: (employeeData: Omit<Employee, "id"> | Employee) => void;
  onCancel: () => void;
  initialData: Omit<Employee, "id"> | Employee | null;
  // เพิ่ม prop สำหรับรายการแผนกที่มีอยู่
  departments: string[];
  employees: Employee[];
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({
  onSubmit,
  onCancel,
  initialData,
  // กำหนดค่าเริ่มต้นเป็น Array ว่าง เพื่อป้องกัน Error หากไม่ได้ส่งค่า prop มา
  departments = [],
  employees = [],
}) => {
  const [formData, setFormData] = useState<Omit<Employee, "id"> | Employee>(
    initialData || {
      firstName: "",
      lastName: "",
      department: "",
      birthdate: "",
    }
  );
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "กรุณากรอกชื่อ";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "กรุณากรอกนามสกุล";
    }

    if (!formData.department.trim()) {
      newErrors.department = "กรุณาเลือกแผนก";
    }

    if (!formData.birthdate) {
      newErrors.birthdate = "กรุณาเลือกวันเกิด";
    } else {
      // Logic for new birthdate validation
      const today = new Date();
      const birthDate = new Date(formData.birthdate);

      // Check if the birthdate is in the future
      if (birthDate > today) {
        newErrors.birthdate = "วันเกิดไม่สามารถเป็นวันที่ในอนาคตได้";
      } else {
        // Calculate age
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();

        // Adjust age if the birthday hasn't occurred yet this year
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && today.getDate() < birthDate.getDate())
        ) {
          age--;
        }

        // Check if age is less than 18
        if (age < 18) {
          newErrors.birthdate = "พนักงานต้องมีอายุ 18 ปีขึ้นไป";
        }
      }
    }

    // Safely check for the 'id' property
    const isEditing = initialData && "id" in initialData;
    const isDuplicate = employees.some((employee) => {
      if (isEditing && employee.id === (initialData as Employee).id) {
        return false;
      }
      return (
        employee.firstName.toLowerCase() ===
          formData.firstName.trim().toLowerCase() &&
        employee.lastName.toLowerCase() ===
          formData.lastName.trim().toLowerCase()
      );
    });

    if (isDuplicate) {
      newErrors.firstName = "ชื่อและนามสกุลนี้มีอยู่แล้วในระบบ";
      newErrors.lastName = "ชื่อและนามสกุลนี้มีอยู่แล้วในระบบ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const isEditing = initialData && "id" in initialData;

  return (
    <div className="employee-form-modal-overlay">
      <div className="employee-form-modal">
        <div className="form-header">
          <h3 className="form-title">
            {isEditing ? "แก้ไขข้อมูลพนักงาน" : "เพิ่มพนักงานใหม่"}
          </h3>
          <button type="button" onClick={onCancel} className="close-btn">
            {/* ใช้ไอคอน X จาก Lucide React */}
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="form-content">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">
                ชื่อ <span className="required">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                placeholder="กรอกชื่อ"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`form-input ${errors.firstName ? "error" : ""}`}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                นามสกุล <span className="required">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                placeholder="กรอกนามสกุล"
                value={formData.lastName}
                onChange={handleInputChange}
                className={`form-input ${errors.lastName ? "error" : ""}`}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>

            <div className="form-group relative">
              <label className="form-label">
                แผนก <span className="required">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className={`form-input ${errors.department ? "error" : ""}`}
              >
                <option value="">-- เลือกแผนก --</option>
                {departments.map((dept, index) => (
                  <option key={index} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
              {errors.department && (
                <span className="error-message">{errors.department}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                วันเกิด <span className="required">*</span>
              </label>
              <input
                type="date"
                name="birthdate"
                value={formData.birthdate}
                onChange={handleInputChange}
                className={`form-input ${errors.birthdate ? "error" : ""}`}
              />
              {errors.birthdate && (
                <span className="error-message">{errors.birthdate}</span>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn-cancel">
              ยกเลิก
            </button>
            <button type="submit" className="btn-submit">
              {/* ใช้ไอคอน Check จาก Lucide React แทน SVG */}
              <Check size={16} strokeWidth={2} />
              {isEditing ? "บันทึกการแก้ไข" : "เพิ่มพนักงาน"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeForm;
