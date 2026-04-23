import { useEffect, useState } from 'react';
import { AvatarCreator, type AvatarExportedData } from '@streamoji/react-avatar-creator';

// Extend JSX namespace for model-viewer
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'model-viewer': any;
    }
  }
  namespace React {
    namespace JSX {
      interface IntrinsicElements {
        'model-viewer': any;
      }
    }
  }
}


function App() {
  const [token, setToken] = useState('');
  const [exportedData, setExportedData] = useState<AvatarExportedData | null>(null);

  useEffect(() => {
    const demoToken = import.meta.env.VITE_STREAMOJI_AUTH_TOKEN ?? '';
    setToken(demoToken);
  }, []);

  const handleAvatarExported = (data: AvatarExportedData) => {
    console.log('Exported Avatar Data:', data);
    setExportedData(data);
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
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {exportedData ? (
            <div style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '40px',
              gap: '30px',
              overflowY: 'auto',
              background: 'linear-gradient(135deg, #fcfaff 0%, #f0e6ff 100%)'
            }}>
              <div style={{ 
                display: 'flex', 
                gap: '40px', 
                width: '100%', 
                maxWidth: '1000px',
                justifyContent: 'center',
                flexWrap: 'wrap'
              }}>
                {/* 3D Viewer Card */}
                <div style={{ 
                  flex: '1 1 400px',
                  background: 'white',
                  borderRadius: '24px',
                  padding: '20px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '15px'
                }}>
                  <h3 style={{ margin: 0, color: '#4a3a63', fontSize: '18px' }}>3D Avatar Model</h3>
                  <div style={{ 
                    width: '100%', 
                    height: '400px', 
                    background: '#f8f9fa', 
                    borderRadius: '16px',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <model-viewer
                      src={exportedData.url}
                      camera-controls
                      auto-rotate
                      shadow-intensity="1"
                      environment-image="neutral"
                      style={{ width: '100%', height: '100%' }}
                    />
                  </div>
                  <div style={{ fontSize: '12px', color: '#888', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                    <strong>Model URL:</strong>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <a href={exportedData.url} target="_blank" rel="noreferrer" style={{ color: '#BB86FC', flex: 1, textDecoration: 'none', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                        {exportedData.url.substring(0, 50)}...
                      </a>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(exportedData.url);
                          alert('Copied to clipboard!');
                        }}
                        style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '10px' }}
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Card */}
                {exportedData.thumbnailUrl && (
                  <div style={{ 
                    flex: '0 0 300px',
                    background: 'white',
                    borderRadius: '24px',
                    padding: '20px',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '15px'
                  }}>
                    <h3 style={{ margin: 0, color: '#4a3a63', fontSize: '18px' }}>Avatar Thumbnail</h3>
                    <div style={{ 
                      width: '100%', 
                      aspectRatio: '1', 
                      background: '#f8f9fa', 
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      overflow: 'hidden'
                    }}>
                      <img 
                        src={exportedData.thumbnailUrl} 
                        alt="Avatar Thumbnail" 
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </div>
                    <div style={{ fontSize: '12px', color: '#888', wordBreak: 'break-all', display: 'flex', flexDirection: 'column', gap: '5px' }}>
                      <strong>Thumbnail URL:</strong>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        <a href={exportedData.thumbnailUrl} target="_blank" rel="noreferrer" style={{ color: '#BB86FC', flex: 1, textDecoration: 'none', background: '#f0f0f0', padding: '4px 8px', borderRadius: '4px' }}>
                          {exportedData.thumbnailUrl.substring(0, 40)}...
                        </a>
                        <button 
                          onClick={() => {
                            if (exportedData.thumbnailUrl) {
                              navigator.clipboard.writeText(exportedData.thumbnailUrl);
                              alert('Copied to clipboard!');
                            }
                          }}
                          style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ddd', cursor: 'pointer', background: 'white', fontSize: '10px' }}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ display: 'flex', gap: '15px' }}>
                <button 
                  onClick={() => setExportedData(null)}
                  style={{ 
                    padding: '12px 30px', 
                    borderRadius: '12px', 
                    background: '#BB86FC', 
                    color: '#4a3a63', 
                    border: 'none', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '16px',
                    boxShadow: '0 8px 20px rgba(187, 134, 252, 0.3)'
                  }}
                >
                  Edit Again
                </button>
                <button 
                  onClick={() => window.location.reload()}
                  style={{ 
                    padding: '12px 30px', 
                    borderRadius: '12px', 
                    background: 'white', 
                    color: '#4a3a63', 
                    border: '1px solid #ddd', 
                    cursor: 'pointer', 
                    fontWeight: 'bold',
                    fontSize: '16px'
                  }}
                >
                  New Session
                </button>
              </div>
            </div>
          ) : (
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
          )}
        </div>
      )}
    </div>
  );
}

export default App;
