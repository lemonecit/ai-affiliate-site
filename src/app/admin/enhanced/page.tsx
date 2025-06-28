import React from 'react';

export default function AdminPage() {
  React.useEffect(() => {
    // Redirect to the static admin file served by Next.js
    window.location.href = '/admin_enhanced.html';
  }, []);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{ textAlign: 'center' }}>
        <h1>🔄 Redirecting to Enhanced Admin...</h1>
        <p>If you're not redirected automatically, <a href="/admin_enhanced.html">click here</a></p>
      </div>
    </div>
  );
}
