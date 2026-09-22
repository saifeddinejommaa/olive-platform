/**
 * Palette de marque — application de gestion d'oliveraie
 * Source de vérité : mêmes valeurs hexadécimales que la charte web.
 */

export const colors = {
  // --- Neutres ---
  ink: '#2c2c2a',
  white: '#FFFFFF',
  background: '#F7F7F5',
  surface: '#FFFFFF',
  border: '#EAEAEA',
  textPrimary: '#171717',
  textSecondary: '#77776F',
  textMuted: '#9A9A91',

  // --- Olive (couleur principale de la marque) ---
  olive: {
    900: '#1f2a18',
    800: '#27500a',
    700: '#3b6d11',
    600: '#4a7d1f',
    500: '#639922',
    100: '#eaf3de',
  },

  // --- Or (accent, mise en valeur) ---
  gold: {
    700: '#9c7a1f',
    600: '#c89b3c',
    500: '#d9ae55',
    100: '#f3e6c4',
  },

  // --- Rouille (alerte, erreur, suppression) ---
  rust: {
    600: '#a23b2e',
    100: '#f3dad6',
  },

  // --- Teal (information, statuts secondaires) ---
  teal: {
    700: '#2e5c55',
    100: '#dceae7',
  },
} as const;

/**
 * Rôles sémantiques — à utiliser dans les composants plutôt que
 * les valeurs brutes de `colors`, pour pouvoir faire évoluer la
 * palette sans toucher aux écrans.
 */
export const semanticColors = {
  primary: colors.olive[700],
  primaryPressed: colors.olive[800],
  primarySoft: colors.olive[100],
  onPrimary: colors.white,

  accent: colors.gold[600],
  accentSoft: colors.gold[100],
  onAccent: colors.ink,

  danger: colors.rust[600],
  dangerSoft: colors.rust[100],

  info: colors.teal[700],
  infoSoft: colors.teal[100],

  success: colors.olive[600],
  successSoft: colors.olive[100],

  background: colors.background,
  surface: colors.surface,
  border: colors.border,

  textPrimary: colors.textPrimary,
  textSecondary: colors.textSecondary,
  textMuted: colors.textMuted,
  textOnPrimary: colors.white,
} as const;

export type ColorScale = keyof typeof colors;