import { useEffect, useState } from 'react';
import { AvatarCreator, type AvatarExportedData } from '@streamoji/react-avatar-creator';

function App() {
  const [token, setToken] = useState('');

  useEffect(() => {
    const demoToken = import.meta.env.VITE_STREAMOJI_AUTH_TOKEN ?? '';
    setToken(demoToken);
  }, []);

  const handleAvatarExported = (data: AvatarExportedData) => {
    alert(`Avatar Exported! URL: ${data.url}`);
    console.log('Exported Avatar Data:', data);
  };

  return (
    <div style={{ width: '100%', height: '100vh', display: 'flex', flexDirection: 'column', background: '#fcfaff', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center', 
        padding: '10px 20px',
        borderBottom: '1px solid #eee',
        background: 'white'
      }}>
        <div /> {/* Spacer */}
        <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#4a3a63', textAlign: 'center' }}>Streamoji SDK Sandbox</h1>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          {token && (
            <button 
              onClick={() => setToken('')}
              style={{ 
                padding: '6px 12px', 
                fontSize: '12px', 
                cursor: 'pointer',
                borderRadius: '6px',
                border: '1px solid #ddd',
                background: '#f5f5f5'
              }}
            >
              Reset Token
            </button>
          )}
        </div>
      </header>
      
      {!token ? (
        <div style={{ flex: 1, padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
          <div style={{ maxWidth: '400px', width: '100%', background: '#fff', padding: '24px', borderRadius: '16px', border: '1px solid #eee', boxShadow: '0 8px 24px rgba(0,0,0,0.08)' }}>
            <h3 style={{ marginTop: 0, textAlign: 'center', color: '#4a3a63' }}>Generate Sandbox Token</h3>
            <p style={{ fontSize: '13px', color: '#666', textAlign: 'center', marginBottom: '20px' }}>
              Enter your credentials to get a temporary token for this session.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Client ID</label>
                <input id="clientId" type="text" placeholder="Enter Client ID" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#666' }}>Client Secret</label>
                <input id="clientSecret" type="password" placeholder="Enter Client Secret" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} />
              </div>
              <button 
                onClick={async () => {
                  const clientId = (document.getElementById('clientId') as HTMLInputElement).value;
                  const clientSecret = (document.getElementById('clientSecret') as HTMLInputElement).value;
                  
                  if (!clientId || !clientSecret) return alert('Please enter both ID and Secret');

                  try {
                    const response = await fetch('https://us-central1-streamoji-265f4.cloudfunctions.net/getAuthToken', {
                      method: 'POST',
                      headers: { 
                        'Content-Type': 'application/json',
                        'Client-Id': clientId,
                        'Client-Secret': clientSecret
                      },
                      body: JSON.stringify({ 
                        userId: 'sandbox-user-' + Math.random().toString(36).substring(7),
                        userName: 'Sandbox User'
                      }),
                    });
                    const data = await response.json();
                    if (data.authToken) {
                      setToken(data.authToken);
                    } else {
                      alert('Failed to generate token: ' + (data.error || 'Unknown error'));
                    }
                  } catch (err) {
                    alert('Network error. Check console.');
                  }
                }}
                style={{ 
                  marginTop: '10px',
                  padding: '12px', 
                  borderRadius: '8px', 
                  background: '#BB86FC', 
                  color: '#4a3a63', 
                  border: 'none', 
                  cursor: 'pointer', 
                  fontWeight: 'bold',
                  boxShadow: '0 4px 12px rgba(187, 134, 252, 0.3)'
                }}
              >
                Generate & Launch Creator
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <AvatarCreator
            token={token}
            config={{
              bodyType: 'Full',
              whiteLabelTitle: 'Sandbox Test',
              whiteLabelColor: 'BB86FC',
              thumbnail: true,
            }}
            onReady={() => console.log('Streamoji iframe ready')}
            onAvatarExported={handleAvatarExported}
            style={{ width: '100%', flex: 1, border: 'none' }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
