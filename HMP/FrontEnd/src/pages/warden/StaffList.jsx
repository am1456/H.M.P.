import React from 'react'

function StaffList() {
  const loading = false;

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center text-purple-600">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-600 mr-3"></div>
        Loading Staff List...
      </div>
    );
  }

  return (
    <div>StaffList</div>
  )
}

export default StaffList