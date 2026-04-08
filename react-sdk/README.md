# Streamoji - React Avatar Creator

**Streamoji - React Avatar Creator** is a set of components and helper methods to implement the Streamoji Avatar Creator into React projects.

## Installation

Streamoji React Avatar Creator is available as an npm package.

```bash
npm i @streamoji/react-avatar-creator
```

## Usage

```tsx
import { AvatarCreator } from '@streamoji/react-avatar-creator';

export default function App() {
  return <AvatarCreator style={{ width: '100%', height: '100vh', border: 'none' }} />;
}
```

---

# Components

## AvatarCreator

`AvatarCreator` component helps you load the Streamoji Avatars editor in an iframe where users can customize their avatar securely and you receive their exported avatar URL upon completion.

### Parameters

**subdomain** _[optional]_: string
- Tenant subdomain parameter. Not strictly required for standard endpoint.

**className** _[optional]_: string
- The css classes to apply to the iframe.

**style** _[optional]_: CSSProperties
- The css styles to apply to the iframe.

**config** _[optional]_: AvatarCreatorConfig
- Editor Configuration where you can set URL properties of the Streamoji editor. Available settings:
  - `bodyType`: `'Half' | 'Full'` restricts the builder to a specific body type.
  - `language`: string for localization.
  - `token`: string representing the external Auth Token parameter.
  - `avatarId`: string to edit an existing avatar item.
  - `userId`: string useful for managing specific saved avatars.
  - `genderSelection`: boolean forces the gender selection screen to appear on load.
  - `saveConfirm`: boolean shows a confirmation modal before finalizing the export.
  - `whiteLabelTitle`: string customizes the title displayed inside the editor.
  - `whiteLabelColor`: string applies a custom theme color (Hex format, e.g. '#BB86FC').
  - `thumbnail`: boolean if set to true, includes `thumbnailUrl` in the export event payload.
  - `downloadUrl`: boolean if true, provides users a direct download prompt.
  - `hidePremiumAssets`: boolean hides premium paid assets from the picker UI.

**onAvatarExported** _[optional]_: (event: AvatarExportedEvent) => void
- Callback function triggered when avatar is successfully exported.

**onUserSet** _[optional]_: (event: UserSetEvent) => void
- Callback function triggered when the user context initializes.

**onAssetUnlock** _[optional]_: (event: AssetUnlockedEvent) => void
- Callback function when a locked asset is acquired.

### Example

```tsx
import { AvatarCreator, AvatarCreatorConfig, AvatarExportedEvent, UserSetEvent } from '@streamoji/react-avatar-creator';

const config: AvatarCreatorConfig = {
  bodyType: 'Full',
  thumbnail: true,
  saveConfirm: true,
  whiteLabelTitle: 'My Custom App',
  whiteLabelColor: '#BB86FC',
};

const style = { width: '100%', height: '100vh', border: 'none' };

export default function App() {
  const handleOnUserSet = (event: UserSetEvent) => {
    console.log(`User initialized ID is: ${event.data.id}`);
  };

  const handleOnAvatarExported = (event: AvatarExportedEvent) => {
    console.log(`Avatar successfully compiled! URL: ${event.data.url}`);
    if (event.data.thumbnailUrl) {
      console.log(`Thumbnail preview: ${event.data.thumbnailUrl}`);
    }
  };

  return (
    <>
      <AvatarCreator 
        config={config} 
        style={style} 
        onUserSet={handleOnUserSet} 
        onAvatarExported={handleOnAvatarExported} 
      />
    </>
  );
}
```

## AvatarCreatorRaw

`AvatarCreatorRaw` is a lower-level component that establishes the iframe and message-bus connections without abstracting away explicit event callbacks. You receive all broadcast messages emitted by Streamoji via a single hook. 

### Parameters

All parameters from `AvatarCreator` exist here, replacing explicit interaction callbacks with `onEventReceived`:

**onEventReceived** _[required]_: (event: IFrameEvent<any>) => void
- Standard callback that intercepts any `v1.**` namespace events published inside the Avatar Creator.

### Example

```tsx
import { AvatarCreatorConfig, AvatarCreatorEvent, AvatarCreatorRaw } from '@streamoji/react-avatar-creator';

const config: AvatarCreatorConfig = {
  bodyType: 'Half',
  saveConfirm: true,
  whiteLabelTitle: 'Streamoji SDK',
  whiteLabelColor: '#3B82F6'
};

const style = { width: '100%', height: '100vh', border: 'none' };

export default function App() {
  const handleCustomEvent = (event: AvatarCreatorEvent) => {
    console.log(`Received raw Custom Event structure:`, event);
  };

  return (
    <>
      <AvatarCreatorRaw 
         config={config} 
         style={style} 
         onEventReceived={handleCustomEvent} 
      />
    </>
  );
}
```
