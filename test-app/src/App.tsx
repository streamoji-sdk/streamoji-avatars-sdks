import { AvatarCreator, type AvatarExportedEvent } from '@streamoji/react-avatar-creator';

function App() {
  const handleAvatarExported = (event: AvatarExportedEvent) => {
    alert(`Avatar Exported! URL: ${event.data.url}`);
    console.log("Full Event Payload:", event);
  };

  return (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <h1 style={{ textAlign: 'center', margin: '20px' }}>Streamoji SDK Sandbox</h1>
      <AvatarCreator 
        subdomain="demo"
        config={{
          bodyType: 'Full',
          whiteLabelTitle: 'Sandbox Test',
          whiteLabelColor: '#BB86FC'
        }}
        onAvatarExported={handleAvatarExported}
        style={{ width: '100%', flex: 1, border: '1px solid #ccc', borderRadius: '8px' }}
      />
    </div>
  );
}

export default App;
