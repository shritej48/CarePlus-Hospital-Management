import React, { useState, useEffect } from 'react';

const DatabaseViewer = () => {
  const [activeTable, setActiveTable] = useState('users');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const tables = [
    { id: 'users', name: 'Users', api: '/api/users' },
    { id: 'doctors', name: 'Doctors', api: '/api/doctors' },
    { id: 'patients', name: 'Patients', api: '/api/patients' },
    { id: 'appointments', name: 'Appointments', api: '/api/appointments' },
    { id: 'billing', name: 'Billing', api: '/api/billing' }
  ];

  useEffect(() => {
    loadData();
  }, [activeTable]);

  const loadData = async () => {
    setLoading(true);
    const table = tables.find(t => t.id === activeTable);
    try {
      // Try to fetch from backend
      const res = await fetch(`http://localhost:8080${table.api}`);
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      } else {
        // Fallback to localStorage if backend fails
        const localData = JSON.parse(localStorage.getItem(activeTable) || '[]');
        setData(localData);
      }
    } catch (err) {
      console.warn(`Backend not available for ${activeTable}, using localStorage`);
      const localData = JSON.parse(localStorage.getItem(activeTable) || '[]');
      setData(localData);
    } finally {
      setLoading(false);
      setCurrentPage(1);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredData = data.filter(row => {
    if (!searchTerm) return true;
    return Object.values(row).some(val =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalItems = filteredData.length;
  const totalPagesCount = Math.ceil(totalItems / itemsPerPage);

  const exportToCSV = () => {
    if (!filteredData.length) return;
    const headers = Object.keys(filteredData[0]);
    const csvRows = [
      headers.join(','),
      ...filteredData.map(row => headers.map(h => JSON.stringify(row[h] || '')).join(','))
    ];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTable}_export.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const styles = {
    container: { background: 'white', borderRadius: '20px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' },
    tabBar: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap', borderBottom: '1px solid #eee', paddingBottom: '12px' },
    tabButton: { padding: '8px 20px', borderRadius: '40px', border: 'none', cursor: 'pointer', background: '#f0f2f5', transition: 'all 0.2s' },
    activeTab: { background: '#4A90E2', color: 'white' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' },
    searchInput: { padding: '8px 16px', borderRadius: '40px', border: '1px solid #ddd', width: '250px' },
    exportBtn: { padding: '8px 16px', borderRadius: '40px', background: '#28C76F', color: 'white', border: 'none', cursor: 'pointer' },
    table: { width: '100%', borderCollapse: 'collapse', overflowX: 'auto', display: 'block' },
    th: { padding: '12px', textAlign: 'left', background: '#f8f9fa', borderBottom: '1px solid #ddd', fontWeight: '600' },
    td: { padding: '10px 12px', borderBottom: '1px solid #eee' },
    pagination: { display: 'flex', justifyContent: 'center', gap: '10px', marginTop: '24px' },
    pageBtn: { padding: '6px 12px', borderRadius: '8px', border: '1px solid #ddd', background: 'white', cursor: 'pointer' },
    activePage: { background: '#4A90E2', color: 'white', borderColor: '#4A90E2' }
  };

  const renderTableHeaders = () => {
    if (!paginatedData.length) return null;
    const headers = Object.keys(paginatedData[0]);
    return headers.map(header => <th key={header} style={styles.th}>{header}</th>);
  };

  const renderTableRows = () => {
    return paginatedData.map((row, idx) => (
      <tr key={idx}>
        {Object.values(row).map((val, i) => (
          <td key={i} style={styles.td}>{val !== null && val !== undefined ? String(val) : '-'}</td>
        ))}
      </tr>
    ));
  };

  return (
    <div style={styles.container}>
      <h2>📁 Database Viewer</h2>
      <p style={{ color: '#666', marginBottom: '20px' }}>View all records from the system database.</p>

      <div style={styles.tabBar}>
        {tables.map(table => (
          <button
            key={table.id}
            onClick={() => setActiveTable(table.id)}
            style={{ ...styles.tabButton, ...(activeTable === table.id ? styles.activeTab : {}) }}
          >
            {table.name}
          </button>
        ))}
      </div>

      <div style={styles.toolbar}>
        <input
          type="text"
          placeholder="Search in current table..."
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
        <button onClick={exportToCSV} style={styles.exportBtn}>📎 Export to CSV</button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading data...</div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.table}>
              <thead>
                <tr>{renderTableHeaders()}</tr>
              </thead>
              <tbody>
                {renderTableRows()}
                {paginatedData.length === 0 && (
                  <tr><td colSpan="100" style={{ textAlign: 'center', padding: '40px' }}>No records found</td></tr>
                )}
              </tbody>
            </table>
          </div>

          {totalPagesCount > 1 && (
            <div style={styles.pagination}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={styles.pageBtn}
              >
                Previous
              </button>
              <span style={{ padding: '6px 12px' }}>Page {currentPage} of {totalPagesCount}</span>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPagesCount))}
                disabled={currentPage === totalPagesCount}
                style={styles.pageBtn}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default DatabaseViewer;