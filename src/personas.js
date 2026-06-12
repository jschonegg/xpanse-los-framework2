// Demo personas — credentials matched on the LoginScreen when
// flags.personaLogin is ON. Same password for all four to keep the
// demo simple; the email picks the experience.
export const PERSONAS = [
  {
    id: 'LO',
    email: 'lo@xpanse.com',
    password: 'xpanse',
    name: 'Alex Torres',
    role: 'Loan Officer',
    badgeColor: '#7E68FA',
    homeRoute: 'home',
  },
  {
    id: 'Processor',
    email: 'processor@xpanse.com',
    password: 'xpanse',
    name: 'Priya Nair',
    role: 'Processor',
    badgeColor: '#0EA5E9',
    homeRoute: 'home',
  },
  {
    id: 'Underwriter',
    email: 'underwriter@xpanse.com',
    password: 'xpanse',
    name: 'David Kim',
    role: 'Underwriter',
    badgeColor: '#059669',
    homeRoute: 'home',
  },
  {
    id: 'Consumer',
    email: 'consumer@xpanse.com',
    password: 'xpanse',
    name: 'Sarah Anderson',
    role: 'Borrower',
    badgeColor: '#D97706',
    homeRoute: 'home',
  },
];

export function findPersonaByCredentials(email, password) {
  const e = (email || '').trim().toLowerCase();
  const p = (password || '').trim();
  return PERSONAS.find(x => x.email === e && x.password === p) || null;
}

export function findPersonaById(id) {
  return PERSONAS.find(x => x.id === id) || null;
}
