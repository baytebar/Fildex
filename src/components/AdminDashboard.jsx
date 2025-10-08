import React, { useState, useMemo, useCallback } from 'react'

const AdminDashboard = ({ showAdmin, setShowAdmin, cvData, setCvData }) => {
  const [adminAuth, setAdminAuth] = useState({ username: '', password: '', authenticated: false })
  const [adminFilters, setAdminFilters] = useState({ search: '', role: '', status: '', sortBy: 'uploadedDate', sortOrder: 'desc' })

  const handleAdminLogin = useCallback((e) => {
    e.preventDefault()
    // Demo authentication - in production, this would be server-side
    if (adminAuth.username === 'admin' && adminAuth.password === 'fildex2024') {
      setAdminAuth(prev => ({ ...prev, authenticated: true }))
    } else {
      alert('Invalid credentials')
    }
  }, [adminAuth.username, adminAuth.password])

  const filteredCvData = useMemo(() => {
    let filtered = cvData.filter(cv => {
      const matchesSearch = !adminFilters.search || 
        cv.name.toLowerCase().includes(adminFilters.search.toLowerCase()) ||
        cv.email.toLowerCase().includes(adminFilters.search.toLowerCase())
      const matchesRole = !adminFilters.role || cv.role === adminFilters.role
      const matchesStatus = !adminFilters.status || cv.status === adminFilters.status
      return matchesSearch && matchesRole && matchesStatus
    })

    filtered.sort((a, b) => {
      const aVal = a[adminFilters.sortBy]
      const bVal = b[adminFilters.sortBy]
      if (adminFilters.sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1
      } else {
        return aVal < bVal ? 1 : -1
      }
    })

    return filtered
  }, [cvData, adminFilters])

  const exportCvData = useCallback(() => {
    const csvContent = "data:text/csv;charset=utf-8," + 
      "Name,Email,Phone,Role,Upload Date,Status,Retention Date\n" +
      filteredCvData.map(cv => `${cv.name},${cv.email},${cv.phone},${cv.role},${cv.uploadedDate},${cv.status},${cv.retentionDate}`).join("\n")
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `cv_data_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }, [filteredCvData])

  const deleteCv = useCallback((id) => {
    if (confirm('Are you sure you want to delete this CV? This action cannot be undone.')) {
      setCvData(prev => prev.filter(cv => cv.id !== id))
    }
  }, [setCvData])

  if (!showAdmin) return null

  return (
    <section className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-6xl max-h-[90vh] overflow-auto rounded-2xl border border-purple-400/20 bg-purple-950/95 backdrop-blur-lg">
        {!adminAuth.authenticated ? (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">Admin Dashboard</h3>
              <button 
                onClick={() => setShowAdmin(false)}
                className="text-purple-300 hover:text-white transition-colors"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAdminLogin} className="max-w-md mx-auto space-y-4">
              <div>
                <label className="block text-sm text-purple-200 mb-1">Username</label>
                <input
                  type="text"
                  value={adminAuth.username}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, username: e.target.value }))}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm text-purple-200 mb-1">Password</label>
                <input
                  type="password"
                  value={adminAuth.password}
                  onChange={(e) => setAdminAuth(prev => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Enter password"
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium hover:brightness-110 shadow-lg shadow-purple-500/25"
              >
                Login
              </button>
            </form>
            
            <div className="mt-6 text-center text-xs text-purple-300">
              Demo: username: admin, password: fildex2024
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-white">CV Management Dashboard</h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={exportCvData}
                  className="rounded-md bg-gradient-to-tr from-purple-500 to-purple-700 px-4 py-2 text-sm font-medium hover:brightness-110 shadow-lg shadow-purple-500/25"
                >
                  Export CSV
                </button>
                <button
                  onClick={() => {
                    setAdminAuth({ username: '', password: '', authenticated: false })
                    setShowAdmin(false)
                  }}
                  className="rounded-md border border-purple-400/30 px-4 py-2 text-sm hover:bg-purple-500/10 transition-colors"
                >
                  Logout
                </button>
                <button 
                  onClick={() => setShowAdmin(false)}
                  className="text-purple-300 hover:text-white transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <div>
                <label className="block text-xs text-purple-300 mb-1">Search</label>
                <input
                  type="text"
                  value={adminFilters.search}
                  onChange={(e) => setAdminFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                  placeholder="Name or email"
                />
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Role</label>
                <select
                  value={adminFilters.role}
                  onChange={(e) => setAdminFilters(prev => ({ ...prev, role: e.target.value }))}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="">All Roles</option>
                  <option value="cloud-engineer">Cloud Engineer</option>
                  <option value="devops-engineer">DevOps Engineer</option>
                  <option value="ai-ml-developer">AI/ML Developer</option>
                  <option value="network-engineer">Network Engineer</option>
                  <option value="software-developer">Software Developer</option>
                  <option value="internship">Internship</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Status</label>
                <select
                  value={adminFilters.status}
                  onChange={(e) => setAdminFilters(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="">All Status</option>
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-purple-300 mb-1">Sort By</label>
                <select
                  value={`${adminFilters.sortBy}-${adminFilters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-')
                    setAdminFilters(prev => ({ ...prev, sortBy, sortOrder }))
                  }}
                  className="w-full rounded-md bg-purple-500/10 border border-purple-400/20 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500/40"
                >
                  <option value="uploadedDate-desc">Newest First</option>
                  <option value="uploadedDate-asc">Oldest First</option>
                  <option value="name-asc">Name A-Z</option>
                  <option value="name-desc">Name Z-A</option>
                  <option value="retentionDate-asc">Retention Date</option>
                </select>
              </div>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl font-semibold text-white">{cvData.length}</div>
                <div className="text-xs text-purple-300">Total CVs</div>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl font-semibold text-white">{cvData.filter(cv => cv.status === 'active').length}</div>
                <div className="text-xs text-purple-300">Active CVs</div>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl font-semibold text-white">{cvData.filter(cv => cv.status === 'expired').length}</div>
                <div className="text-xs text-purple-300">Expired CVs</div>
              </div>
              <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 p-4">
                <div className="text-2xl font-semibold text-white">{filteredCvData.length}</div>
                <div className="text-xs text-purple-300">Filtered Results</div>
              </div>
            </div>
            
            {/* CV Table */}
            <div className="rounded-xl border border-purple-400/20 bg-purple-500/10 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-purple-600/20">
                    <tr>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Name</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Email</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Phone</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Role</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Uploaded</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Status</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Retention</th>
                      <th className="px-4 py-3 text-left text-purple-200 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCvData.map((cv) => (
                      <tr key={cv.id} className="border-t border-purple-400/10 hover:bg-purple-500/5">
                        <td className="px-4 py-3 text-white">{cv.name}</td>
                        <td className="px-4 py-3 text-purple-200">{cv.email}</td>
                        <td className="px-4 py-3 text-purple-200">{cv.phone}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-600/20 text-purple-200">
                            {cv.role.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-purple-200">{cv.uploadedDate}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                            cv.status === 'active' ? 'bg-green-600/20 text-green-200' : 'bg-red-600/20 text-red-200'
                          }`}>
                            {cv.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-purple-200">{cv.retentionDate}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => window.open(`mailto:${cv.email}`, '_blank')}
                              className="text-purple-300 hover:text-white transition-colors"
                              title="Send Email"
                            >
                              📧
                            </button>
                            <button
                              onClick={() => deleteCv(cv.id)}
                              className="text-red-400 hover:text-red-300 transition-colors"
                              title="Delete CV"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredCvData.length === 0 && (
                <div className="p-8 text-center text-purple-300">
                  No CVs found matching your criteria.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default AdminDashboard
