/**
 * Avisio - Local deployment configuration
 * Developer: Sean Chen
 */
window.DRAWIO_PUBLIC_BUILD = true;
window.DRAWIO_BASE_URL = '/drawio/';

// Client-side export only (no image server needed)
window.EXPORT_URL = '';
window.PLANT_URL = null;
window.DRAWIO_VIEWER_URL = null;
window.DRAWIO_LIGHTBOX_URL = null;
window.DRAW_MATH_URL = '/drawio/math4/es5';
window.DRAWIO_MATH_CONFIG = { svg: { font: 'tex', fontCache: 'local' } };
window.ICONSEARCH_PATH = null;

// Enable all local features, disable cloud integrations only
window.DRAWIO_CONFIG = {
  appBar: false,
  google: false,
  googleDrive: false,
  onedrive: false,
  dropbox: false,
  github: false,
  gitlab: false,
  trello: false,
  noExitBtn: true,
};

urlParams['sync'] = 'manual';
