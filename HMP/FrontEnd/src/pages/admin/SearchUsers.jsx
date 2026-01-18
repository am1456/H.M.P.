import React, { useState, useEffect } from 'react';
import apiClient from '../../api/axios.js';// in place of axios we are using apiClient as we have made a mechanism for the refresh the AccessTokens
import { Search, Filter, Users, ChevronLeft, ChevronRight, UserCog } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchUsers = () => {
  // 1. Initialize Navigate
    const navigate = useNavigate(); 

    // 2. All States
    const [users, setUsers] = useState([]);
    const [filters, setFilters] = useState({ role: '', hostel: '', search: '', page: 1 });// don't fear we hanve mechanisim for increasing and decreasing this page number in the footer part 
    const [pagination, setPagination] = useState({});
    const [hostels, setHostels] = useState([]);
    const [loading, setLoading] = useState(false);

  // 1. Fetch Hostels for the filter dropdown
  useEffect(() => {
    apiClient.get('/api/v1/hostel/get-all-hostels')
    .then(res => setHostels(res.data.data)); // Insert the response inside the setHostel State for futher use
  }, []);

  // 2. Fetch Users whenever filters change
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchUsers();
    }, 300); // Small debounce to prevent hitting API on every keystroke
    return () => clearTimeout(delayDebounce);// clearTimeout() is a JavaScript function used to cancel a timer that was previously set with setTimeout(), preventing the scheduled code from running by using the unique ID returned by setTimeout(). It's essential for controlling asynchronous tasks, like stopping a search from firing on every keystroke until the user pauses typing, by passing the timerId to clearTimeout(timerId) to halt execution.
  }, [filters]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { role, hostel, search, page } = filters;

      const res = await apiClient.get(`/api/v1/admin/users?role=${role}&hostel=${hostel}&search=${search}&page=${page}`);

      setUsers(res.data.data.users);
      setPagination(res.data.data.pagination);
  /*
  Axios response
 └── data   ← entire backend response
      ├── statusCode
      ├── message
      └── data   ← your actual payload
           ├── users
           └── pagination
  */
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-red-600" /> User Directory
          </h2>
          <p className="text-sm text-gray-500">Manage students & wardens</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search name or username..."
              className="pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-900 border-none rounded-xl text-sm focus:ring-2 focus:ring-red-500 outline-none w-64"
              onChange={(e) => setFilters({ ...filters, search: e.target.value, page: 1 })}
            />
          </div>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-wrap gap-4 items-center bg-gray-200 dark:bg-gray-800/50 p-4 rounded-xl">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Filter size={16} /> Filters:
        </div>
        <select
          className="bg-white dark:bg-gray-900 border-none rounded-lg text-sm p-2 outline-none"
          onChange={(e) => setFilters({ ...filters, role: e.target.value, page: 1 })}
        >
          <option value="">All Roles</option>
          <option value="student">Students</option>
          <option value="warden">Wardens</option>
        </select>

        <select
          className="bg-white dark:bg-gray-900 border-none rounded-lg text-sm p-2 outline-none"
          onChange={(e) => setFilters({ ...filters, hostel: e.target.value, page: 1 })}
        >
          <option value="">All Hostels</option>
          {hostels.map(h => <option key={h._id} value={h._id}>{h.code}</option>)}
        </select>
      </div>

      {/* Table Area */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 dark:bg-gray-900/50 text-gray-500 uppercase text-[11px] font-bold tracking-wider">
            <tr>
              <th className="px-6 py-4">User</th>
              <th className="px-6 py-4">Role</th>
              <th className="px-6 py-4">Assignment</th>
              <th className="px-6 py-4">Contact</th>
              <th className="px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
            {users.map((user) => (
              <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors">
                <td className="px-6 py-4">
                  <div className="font-semibold text-gray-900 dark:text-white">{user.fullName}</div>
                  <div className="text-xs text-gray-400">@{user.username}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${user.role === 'warden' ? 'bg-purple-100 text-purple-700' :
                      'bg-emerald-100 text-emerald-700'
                    }`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm dark:text-gray-300">{user.hostel?.name}</div>
                  {user.room && (
                    <div className="text-xs text-gray-500">Room: {user.room.number}</div>
                  )}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 dark:text-gray-400">
                  {user.email} <br /> {user.mobile}
                </td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => navigate(`/admin/dashboard/users/${user._id}`)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    <UserCog size={14} />
                    VIEW DETAILS
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <span className="text-sm text-gray-500">
            Showing {users.length} of {pagination.total} users
          </span>
          <div className="flex gap-2">
            <button
              disabled={filters.page === 1}
              onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
              className="p-2 border rounded-lg disabled:opacity-30"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              disabled={filters.page === pagination.totalPages}
              onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
              className="p-2 border rounded-lg disabled:opacity-30"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchUsers;