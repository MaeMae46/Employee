// src/App.tsx

import React, { useState, useEffect } from "react";
import EmployeeList from "./components/EmployeeList";
import EmployeeForm from "./components/EmployeeForm";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import { Employee } from "./interface/Employee";
import "./components/App.css";
import { Users, ClipboardList, Search, ChevronDown } from "lucide-react";

// Main App component
const App = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [showAddForm, setShowAddForm] = useState<boolean>(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "error" | "success";
  } | null>(null);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(
    null
  );

  const [nameQuery, setNameQuery] = useState<string>("");
  const [departmentQuery, setDepartmentQuery] = useState<string>("");
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);

  const [totalEmployees, setTotalEmployees] = useState<number>(0);
  const [totalDepartments, setTotalDepartments] = useState<number>(0);
  const [searchResults, setSearchResults] = useState<number>(0);
  const [uniqueDepartments, setUniqueDepartments] = useState<string[]>([]);

  const API_URL = "https://65e80a8f53d564627a8fb34b.mockapi.io/employee";

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    const lowercasedNameQuery = nameQuery.toLowerCase();
    const lowercasedDepartmentQuery = departmentQuery.toLowerCase();

    const filtered = employees.filter(
      (employee) =>
        (employee.firstName.toLowerCase().includes(lowercasedNameQuery) ||
          employee.lastName.toLowerCase().includes(lowercasedNameQuery)) &&
        (lowercasedDepartmentQuery === "" ||
          employee.department.toLowerCase() === lowercasedDepartmentQuery)
    );
    setFilteredEmployees(filtered);
    setSearchResults(filtered.length);
  }, [employees, nameQuery, departmentQuery]);

  useEffect(() => {
    setTotalEmployees(employees.length);
    const departments = new Set(employees.map((e) => e.department));
    setUniqueDepartments(Array.from(departments));
    setTotalDepartments(departments.size);
  }, [employees]);

  const showMessage = (text: string, type: "error" | "success") => {
    setMessage({ text, type });
    const timer = setTimeout(() => setMessage(null), 3000);
    return () => clearTimeout(timer);
  };

  const fetchEmployees = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      const mappedEmployees: Employee[] = data.map((employee: any) => ({
        id: employee.ID.toString(),
        firstName: employee.FIRST_NAME,
        lastName: employee.LAST_NAME,
        department: employee.DEPARTMENT,
        birthdate: employee.DATE_OF_BIRTH
          ? employee.DATE_OF_BIRTH.slice(0, 10)
          : "",
      }));
      setEmployees(mappedEmployees);
    } catch (err: any) {
      setError("Failed to fetch data. Please check the network connection.");
      console.error("Error fetching employees:", err);
    } finally {
      setLoading(false);
    }
  };

  const addEmployee = async (newEmployeeData: Omit<Employee, "id">) => {
    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FIRST_NAME: newEmployeeData.firstName,
          LAST_NAME: newEmployeeData.lastName,
          DEPARTMENT: newEmployeeData.department,
          DATE_OF_BIRTH: newEmployeeData.birthdate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to add employee");
      }
      showMessage("เพิ่มพนักงานสำเร็จ!", "success");
      fetchEmployees();
      setShowAddForm(false);
      return true;
    } catch (err: any) {
      setError("เพิ่มพนักงานไม่สำเร็จ. กรุณาลองใหม่อีกครั้ง.");
      console.error("Error adding employee:", err);
      return false;
    }
  };

  const updateEmployee = async (updatedEmployee: Employee) => {
    try {
      const response = await fetch(`${API_URL}/${updatedEmployee.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          FIRST_NAME: updatedEmployee.firstName,
          LAST_NAME: updatedEmployee.lastName,
          DEPARTMENT: updatedEmployee.department,
          DATE_OF_BIRTH: updatedEmployee.birthdate,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to update employee");
      }
      showMessage("อัปเดตข้อมูลพนักงานสำเร็จ!", "success");
      setEditingEmployee(null);
      fetchEmployees();
    } catch (err: any) {
      setError("อัปเดตข้อมูลพนักงานไม่สำเร็จ. กรุณาลองใหม่อีกครั้ง.");
      console.error("Error updating employee:", err);
    }
  };

  const deleteEmployee = async (id: string) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete employee");
      }
      showMessage("ลบพนักงานสำเร็จ!", "success");
      setEmployees(employees.filter((employee) => employee.id !== id));
      setEmployeeToDelete(null); // ปิด modal เมื่อลบสำเร็จ
    } catch (err: any) {
      setError("ลบพนักงานไม่สำเร็จ. กรุณาลองใหม่อีกครั้ง.");
      console.error("Error deleting employee:", err);
      setEmployeeToDelete(null);
    }
  };

  const handleClearFilters = () => {
    setNameQuery("");
    setDepartmentQuery("");
  };

  return (
    <div className="app-container">
      <div className="background-gradient"></div>

      <div className="main-content">
        <div className="header-section">
          <h1 className="main-title">Employee Management</h1>
        </div>

        {message && (
          <div className={`message-alert ${message.type}`}>
            <p>{message.text}</p>
          </div>
        )}

        <div className="summary-grid">
          <div className="summary-card blue">
            <div className="card-icon blue-icon">
              <Users size={24} />
            </div>
            <div className="card-content">
              <h3>พนักงานทั้งหมด</h3>
              <p className="card-number blue-text">{totalEmployees}</p>
              <span className="card-subtitle">พนักงานใหม่</span>
            </div>
          </div>

          <div className="summary-card green">
            <div className="card-icon green-icon">
              <ClipboardList size={24} />
            </div>
            <div className="card-content">
              <h3>แผนกทั้งหมด</h3>
              <p className="card-number green-text">{totalDepartments}</p>
              <span className="card-subtitle">ตำแหน่ง</span>
            </div>
          </div>

          <div className="summary-card orange">
            <div className="card-icon orange-icon">
              <Search size={24} />
            </div>
            <div className="card-content">
              <h3>ผลการค้นหา</h3>
              <p className="card-number orange-text">{searchResults}</p>
              <span className="card-subtitle">ผลลัพธ์</span>
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-header">
            <h2>ค้นหาและกรองข้อมูล</h2>
            <button
              onClick={() => {
                setShowAddForm(!showAddForm);
                setEditingEmployee(null);
              }}
              className="add-employee-btn"
            >
              {showAddForm ? "ปิดฟอร์มเพิ่มพนักงาน" : "เพิ่มพนักงานใหม่"}
            </button>
          </div>

          <div className="search-controls">
            <div className="search-inputs">
              <div className="search-input-wrapper">
                <input
                  type="text"
                  placeholder="ค้นหาด้วยชื่อหรือนามสกุล..."
                  value={nameQuery}
                  onChange={(e) => setNameQuery(e.target.value)}
                  className="search-input"
                />
              </div>

              <div className="select-wrapper">
                <select
                  value={departmentQuery}
                  onChange={(e) => setDepartmentQuery(e.target.value)}
                  className="department-select"
                >
                  <option value="">-- กรองตามแผนก --</option>
                  {uniqueDepartments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                <div className="select-arrow">
                  <ChevronDown size={20} />
                </div>
              </div>
            </div>

            <button onClick={handleClearFilters} className="clear-btn">
              ล้างตัวกรอง
            </button>
          </div>

          {showAddForm && (
            <div className="add-form-container">
              <EmployeeForm
                onSubmit={addEmployee}
                onCancel={() => setShowAddForm(false)}
                initialData={{
                  firstName: "",
                  lastName: "",
                  department: "",
                  birthdate: "",
                }}
                departments={uniqueDepartments}
                employees={employees}
              />
            </div>
          )}
        </div>

        {loading && (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>กำลังโหลดข้อมูลพนักงาน...</p>
          </div>
        )}

        {error && (
          <div className="error-container">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <EmployeeList
            employees={filteredEmployees}
            onEdit={setEditingEmployee}
            onDelete={(employee) => setEmployeeToDelete(employee)}
          />
        )}

        {employeeToDelete && (
          <DeleteConfirmationModal
            employeeName={`${employeeToDelete.firstName} ${employeeToDelete.lastName}`}
            onConfirm={() => deleteEmployee(employeeToDelete.id)}
            onCancel={() => setEmployeeToDelete(null)}
          />
        )}

        {editingEmployee && (
          <div className="modal-overlay">
            <div className="modal-content">
              <EmployeeForm
                onSubmit={updateEmployee}
                onCancel={() => setEditingEmployee(null)}
                initialData={editingEmployee}
                departments={uniqueDepartments}
                employees={employees}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
