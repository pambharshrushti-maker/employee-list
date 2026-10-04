import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const rowsPerPage = 5;

  useEffect(() => {
    fetch("http://localhost:3000/employees")
      .then((response) => response.json())
      .then((data) => {
        setEmployees(data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  const filteredEmployees = employees.filter((employee) => {
    const searchText = search.toLowerCase();

    return (
      employee.name.toLowerCase().includes(searchText) ||
      employee.email.toLowerCase().includes(searchText) ||
      employee.department.toLowerCase().includes(searchText) ||
      employee.location.toLowerCase().includes(searchText) ||
      employee.id.toString().includes(searchText)
    );
  });

  const totalPages = Math.ceil(filteredEmployees.length / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;

  const currentEmployees = filteredEmployees.slice(
    startIndex,
    startIndex + rowsPerPage
  );

  const handleSearch = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1);
  };

  const getDepartmentClass = (department) => {
    switch (department) {
      case "IT":
        return "badge it";

      case "HR":
        return "badge hr";

      case "Finance":
        return "badge finance";

      case "Marketing":
        return "badge marketing";

      case "Sales":
        return "badge sales";

      default:
        return "badge";
    }
  };

  return (
    <div className="app">

      <div className="header">
        <h1>Employee List</h1>
      </div>

      <div className="container">

        <div className="search-box">
          <input
            type="text"
            placeholder="Search Here"
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="table-container">
          <table>

            <thead>
              <tr>
                <th>EMPLOYEE ID</th>
                <th>NAME</th>
                <th>EMAIL</th>
                <th>AGE</th>
                <th>DEPARTMENT</th>
                <th>SALARY</th>
                <th>LOCATION</th>
              </tr>
            </thead>

            <tbody>

              {currentEmployees.length > 0 ? (
                currentEmployees.map((employee) => (
                  <tr key={employee.id}>

                    <td>{employee.id}</td>

                    <td className="employee-name">
                      {employee.name}
                    </td>

                    <td className="email">
                      {employee.email}
                    </td>

                    <td>{employee.age}</td>

                    <td>
                      <span
                        className={getDepartmentClass(
                          employee.department
                        )}
                      >
                        {employee.department}
                      </span>
                    </td>

                    <td>
                      ₹{employee.salary.toLocaleString("en-IN")}
                    </td>

                    <td>{employee.location}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="no-data">
                    No Employees Found
                  </td>
                </tr>
              )}

            </tbody>

          </table>
        </div>

        <div className="bottom-section">

          <div className="rows">
            <strong>Rows per Page:</strong>

            <select
              value={rowsPerPage}
              disabled
            >
              <option value="5">5</option>
            </select>
          </div>

          <div className="page-info">
            Page {totalPages === 0 ? 0 : currentPage} of{" "}
            {totalPages}{" "}
            <span>
              (Total {filteredEmployees.length} Entries)
            </span>
          </div>

          <div className="pagination">

            <button
              onClick={() =>
                setCurrentPage((page) => Math.max(page - 1, 1))
              }
              disabled={currentPage === 1}
            >
              Prev
            </button>

            {Array.from(
              { length: totalPages },
              (_, index) => index + 1
            ).map((page) => (
              <button
                key={page}
                className={
                  currentPage === page ? "active" : ""
                }
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() =>
                setCurrentPage((page) =>
                  Math.min(page + 1, totalPages)
                )
              }
              disabled={
                currentPage === totalPages ||
                totalPages === 0
              }
            >
              Next
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default App;