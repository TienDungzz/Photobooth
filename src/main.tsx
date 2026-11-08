import './shared/styles/fonts.css';
import { createRoot } from 'react-dom/client';
import './shared/i18n';
import { App } from './app/App';
import './shared/styles/tokens.css';
import './shared/styles/global.css';
import './features/editor/Editor.css';
import './features/editor/EditorMobile.css';
import './features/camera/CameraDialog.css';
import './features/export-photo/Finish.css';

createRoot(document.getElementById('root')!).render(<App />);

import './app/App.css';
