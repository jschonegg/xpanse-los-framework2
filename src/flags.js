// Feature flags. Defaults OFF — master/prod is unchanged until a flag is flipped on.
//
// Toggle in DevTools:
//   localStorage.setItem('xlos-flags', JSON.stringify({ heroFlowing: true }))
// Or via URL: ?flags=heroFlowing
// Clear: localStorage.removeItem('xlos-flags')

const defaults = {
  heroFlowing: true,
  logoToLogin: true,
  alwaysStartOnLogin: true,
  loginGoesHome: true,
  leaderboardBranchStats: true,
  leftNavPolish: true,
  imsBrand: true,
  yourDayCustomizable: true,
  lessEmoji: true,
  mergedActionCard: true,
  aiCoachBrand: true,
  hideTodaysPrioritiesHeader: true,
  hidePerformanceHeader: true,
  lakesideFeedCard: true,
  consistentCardHeaders: true,
  homeReorderV1: true,
  aiInsightsUnderScorecard: true,
  homePolishV2: true,
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
