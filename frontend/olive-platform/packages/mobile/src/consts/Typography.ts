import { TextStyle } from 'react-native';

/**
 * Échelle typographique. Une seule famille de caractères (celle du
 * système par défaut) est utilisée pour tout, différenciée par
 * poids et taille — pas de mélange de polices.
 */
export const typography: Record<string, TextStyle> = {
  display: {
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  h1: {
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: -0.2,
    lineHeight: 30,
  },
  h2: {
    fontSize: 19,
    fontWeight: '700',
    lineHeight: 24,
  },
  h3: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 21,
  },
  body: {
    fontSize: 15,
    fontWeight: '400',
    lineHeight: 21,
  },
  bodyStrong: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 21,
  },
  caption: {
    fontSize: 13,
    fontWeight: '500',
    lineHeight: 18,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
    lineHeight: 16,
  },
};