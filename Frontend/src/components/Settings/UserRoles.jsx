import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const UserRoles = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([
    { id: 1, name: 'Admin User', role: 'ADMIN' },
    { id: 2, name: 'Regular User', role: 'USER' }
  ]);

  const handleRoleChange = (userId, newRole) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const handleAddUser = (userData) => {
    setUsers([...users, { id: users.length + 1, ...userData }]);
  };

  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">User Management</h2>
        {currentUser?.role === 'ADMIN' && (
          <button
            onClick={() => handleAddUser({ name: 'New User', role: 'USER' })}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add User
          </button>
        )}
      </div>

      <div className="mt-4">
        {users.map(user => (
          <div key={user.id} className="flex items-center justify-between py-2">
            <span>{user.name}</span>
            <select
              value={user.role}
              onChange={(e) => handleRoleChange(user.id, e.target.value)}
              className="border rounded p-1"
            >
              <option value="USER">User</option>
              <option value="ADMIN">Admin</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserRoles;
