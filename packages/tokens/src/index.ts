import chroma from 'chroma-js';

export interface ColorScale {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
  950: string;
}

export interface SpacingScale {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
  '4xl': string;
}

export interface TypographyScale {
  fontFamily: {
    sans: string;
    serif: string;
    mono: string;
  };
  fontSize: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
    '5xl': string;
  };
  fontWeight: {
    light: number;
    normal: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  lineHeight: {
    tight: number;
    normal: number;
    relaxed: number;
  };
}

export interface DesignTokens {
  colors: {
    primary: ColorScale;
    secondary: ColorScale;
    neutral: ColorScale;
    success: ColorScale;
    warning: ColorScale;
    error: ColorScale;
  };
  spacing: SpacingScale;
  typography: TypographyScale;
  borderRadius: {
    none: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
}

/**
 * Generate a color scale from a base color
 */
export function generateColorScale(baseColor: string): ColorScale {
  const color = chroma(baseColor);
  
  return {
    50: color.brighten(2.5).hex(),
    100: color.brighten(2).hex(),
    200: color.brighten(1.5).hex(),
    300: color.brighten(1).hex(),
    400: color.brighten(0.5).hex(),
    500: color.hex(),
    600: color.darken(0.5).hex(),
    700: color.darken(1).hex(),
    800: color.darken(1.5).hex(),
    900: color.darken(2).hex(),
    950: color.darken(2.5).hex(),
  };
}

/**
 * Generate spacing scale based on base unit
 */
export function generateSpacingScale(baseUnit: number = 4): SpacingScale {
  return {
    xs: `${baseUnit}px`,
    sm: `${baseUnit * 2}px`,
    md: `${baseUnit * 4}px`,
    lg: `${baseUnit * 6}px`,
    xl: `${baseUnit * 8}px`,
    '2xl': `${baseUnit * 12}px`,
    '3xl': `${baseUnit * 16}px`,
    '4xl': `${baseUnit * 24}px`,
  };
}

/**
 * Generate typography scale
 */
export function generateTypographyScale(
  fontFamily: string = 'Inter, system-ui, sans-serif'
): TypographyScale {
  return {
    fontFamily: {
      sans: fontFamily,
      serif: 'Georgia, serif',
      mono: 'Menlo, monospace',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  };
}

/**
 * Generate complete design system tokens
 */
export function generateDesignTokens(config: {
  primaryColor: string;
  secondaryColor?: string;
  baseSpacing?: number;
  fontFamily?: string;
}): DesignTokens {
  const { primaryColor, secondaryColor, baseSpacing = 4, fontFamily } = config;

  return {
    colors: {
      primary: generateColorScale(primaryColor),
      secondary: generateColorScale(secondaryColor || '#64748b'),
      neutral: generateColorScale('#71717a'),
      success: generateColorScale('#22c55e'),
      warning: generateColorScale('#f59e0b'),
      error: generateColorScale('#ef4444'),
    },
    spacing: generateSpacingScale(baseSpacing),
    typography: generateTypographyScale(fontFamily),
    borderRadius: {
      none: '0',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
      xl: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
    },
  };
}

/**
 * Export design tokens as CSS variables
 */
export function exportToCSSVariables(tokens: DesignTokens): string {
  let css = ':root {\n';

  // Colors
  Object.entries(tokens.colors).forEach(([colorName, scale]) => {
    Object.entries(scale).forEach(([shade, value]) => {
      css += `  --color-${colorName}-${shade}: ${value};\n`;
    });
  });

  // Spacing
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    css += `  --spacing-${key}: ${value};\n`;
  });

  // Typography
  css += `  --font-sans: ${tokens.typography.fontFamily.sans};\n`;
  css += `  --font-serif: ${tokens.typography.fontFamily.serif};\n`;
  css += `  --font-mono: ${tokens.typography.fontFamily.mono};\n`;

  Object.entries(tokens.typography.fontSize).forEach(([key, value]) => {
    css += `  --text-${key}: ${value};\n`;
  });

  // Border Radius
  Object.entries(tokens.borderRadius).forEach(([key, value]) => {
    css += `  --radius-${key}: ${value};\n`;
  });

  // Shadows
  Object.entries(tokens.shadows).forEach(([key, value]) => {
    css += `  --shadow-${key}: ${value};\n`;
  });

  css += '}\n';
  return css;
}

/**
 * Export design tokens as Tailwind config
 */
export function exportToTailwindConfig(tokens: DesignTokens): string {
  return `/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(tokens.colors, null, 2)},
      spacing: ${JSON.stringify(tokens.spacing, null, 2)},
      fontFamily: ${JSON.stringify(tokens.typography.fontFamily, null, 2)},
      fontSize: ${JSON.stringify(tokens.typography.fontSize, null, 2)},
      borderRadius: ${JSON.stringify(tokens.borderRadius, null, 2)},
      boxShadow: ${JSON.stringify(tokens.shadows, null, 2)},
    },
  },
};`;
}
