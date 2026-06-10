// Feature flags. Defaults OFF — master/prod is unchanged until a flag is flipped on.
//
// Toggle in DevTools:
//   localStorage.setItem('xlos-flags', JSON.stringify({ heroFlowing: true }))
// Or via URL: ?flags=heroFlowing
// Clear: localStorage.removeItem('xlos-flags')

const defaults = {
  heroFlowing: false,
  logoToLogin: false,
};

function readOverrides() {
  try {
    const fromStorage = JSON.parse(localStorage.getItem('xlos-flags') || '{}');
    const fromUrl = {};
    const param = new URLSearchParams(window.location.search).get('flags');
    if (param) {
      for (const name of param.split(',').map(s => s.trim()).filter(Boolean)) {
        fromUrl[name] = true;
      }
    }
    return { ...fromStorage, ...fromUrl };
  } catch {
    return {};
  }
}

export const flags = { ...defaults, ...readOverrides() };
