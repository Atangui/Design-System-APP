import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { generateDesignTokens, exportToCSSVariables, exportToTailwindConfig } from '@design-system/tokens';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import WebFont from 'webfontloader';

// Google Fonts populaires
const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Nunito',
  'Playfair Display', 'Merriweather', 'Libre Baskerville', 'Source Serif Pro',
  'Work Sans', 'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Space Grotesk',
  'Crimson Text', 'Lora', 'PT Serif', 'Spectral', 'Outfit', 'Sora'
];

interface DesignConfig {
  primaryColor: string;
  secondaryColor: string;
  successColor: string;
  warningColor: string;
  errorColor: string;
  baseSpacing: number;
  fontFamily: string;
  headingFont: string;
}

function App() {
  const [config, setConfig] = useState<DesignConfig>({
    primaryColor: '#6366f1',
    secondaryColor: '#8b5cf6',
    successColor: '#22c55e',
    warningColor: '#f59e0b',
    errorColor: '#ef4444',
    baseSpacing: 4,
    fontFamily: 'Inter',
    headingFont: 'Inter',
  });

  const [showPrimaryPicker, setShowPrimaryPicker] = useState(false);
  const [showSecondaryPicker, setShowSecondaryPicker] = useState(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'components' | 'css' | 'tailwind'>('preview');
  const [darkMode, setDarkMode] = useState(false);
  const [fontSearch, setFontSearch] = useState('');
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set(['Inter']));

  // Charger polices Google Fonts
  useEffect(() => {
    const fontsToLoad = [config.fontFamily, config.headingFont].filter(
      font => !loadedFonts.has(font)
    );

    if (fontsToLoad.length > 0) {
      WebFont.load({
        google: { families: fontsToLoad },
        active: () => {
          setLoadedFonts(prev => new Set([...prev, ...fontsToLoad]));
        },
      });
    }
  }, [config.fontFamily, config.headingFont]);

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const tokens = generateDesignTokens({
    primaryColor: config.primaryColor,
    secondaryColor: config.secondaryColor,
    baseSpacing: config.baseSpacing,
    fontFamily: `${config.fontFamily}, system-ui, sans-serif`,
  });

  const cssVariables = exportToCSSVariables(tokens);
  const tailwindConfig = exportToTailwindConfig(tokens);

  const handleExport = (type: 'css' | 'tailwind' | 'json' | 'pdf') => {
    if (type === 'pdf') {
      generatePDF();
      return;
    }

    let content = '';
    let filename = '';

    switch (type) {
      case 'css':
        content = cssVariables;
        filename = 'design-tokens.css';
        break;
      case 'tailwind':
        content = tailwindConfig;
        filename = 'tailwind.config.js';
        break;
      case 'json':
        content = JSON.stringify({ config, tokens }, null, 2);
        filename = 'design-system.json';
        break;
    }

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    saveAs(blob, filename);
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    let yPos = 20;

    // Titre
    doc.setFontSize(24);
    doc.setTextColor(99, 102, 241);
    doc.text('Design System Generator', 20, yPos);
    yPos += 10;

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')}`, 20, yPos);
    yPos += 15;

    // Configuration
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
    doc.text('Configuration', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    const configItems = [
      `Couleur Primaire: ${config.primaryColor}`,
      `Couleur Secondaire: ${config.secondaryColor}`,
      `Success: ${config.successColor}`,
      `Warning: ${config.warningColor}`,
      `Error: ${config.errorColor}`,
      `Police Corps: ${config.fontFamily}`,
      `Police Titres: ${config.headingFont}`,
      `Espacement de Base: ${config.baseSpacing}px`,
    ];

    configItems.forEach(item => {
      doc.text(item, 25, yPos);
      yPos += 6;
    });

    yPos += 10;

    // Palettes de couleurs
    const colorPalettes = [
      { name: 'Primary', colors: tokens.colors.primary },
      { name: 'Secondary', colors: tokens.colors.secondary },
      { name: 'Neutral', colors: tokens.colors.neutral },
      { name: 'Success', colors: tokens.colors.success },
      { name: 'Warning', colors: tokens.colors.warning },
      { name: 'Error', colors: tokens.colors.error },
    ];

    colorPalettes.forEach(palette => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text(`Palette ${palette.name}`, 20, yPos);
      yPos += 8;

      let xPos = 25;
      Object.entries(palette.colors).forEach(([shade, color]) => {
        const r = parseInt(color.slice(1, 3), 16);
        const g = parseInt(color.slice(3, 5), 16);
        const b = parseInt(color.slice(5, 7), 16);

        doc.setFillColor(r, g, b);
        doc.rect(xPos, yPos, 15, 10, 'F');
        
        doc.setFontSize(7);
        doc.setTextColor(0, 0, 0);
        doc.text(shade, xPos + 1, yPos + 14);
        doc.text(color, xPos - 2, yPos + 17);

        xPos += 17;
        if (xPos > 180) {
          xPos = 25;
          yPos += 20;
        }
      });

      yPos += 25;
    });

    // Typographie
    if (yPos > 230) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text('Échelle Typographique', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    Object.entries(tokens.typography.fontSize).forEach(([size, value]) => {
      doc.text(`${size}: ${value}`, 25, yPos);
      yPos += 6;
    });

    doc.text(`Corps: ${config.fontFamily}`, 25, yPos);
    yPos += 6;
    doc.text(`Titres: ${config.headingFont}`, 25, yPos);
    yPos += 12;

    // Espacement
    doc.setFontSize(14);
    doc.text('Échelle d\'Espacement', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    Object.entries(tokens.spacing).forEach(([size, value]) => {
      doc.text(`${size}: ${value}`, 25, yPos);
      yPos += 6;
    });

    yPos += 10;

    // Ombres
    if (yPos > 240) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('Ombres', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    Object.entries(tokens.shadows).forEach(([size, value]) => {
      doc.text(`${size}: ${value}`, 25, yPos);
      yPos += 6;
    });

    // Border Radius
    yPos += 10;
    doc.setFontSize(14);
    doc.text('Border Radius', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    Object.entries(tokens.borderRadius).forEach(([size, value]) => {
      doc.text(`${size}: ${value}`, 25, yPos);
      yPos += 6;
    });

    doc.save('design-system.pdf');
  };

  const filteredFonts = fontSearch
    ? GOOGLE_FONTS.filter(font => font.toLowerCase().includes(fontSearch.toLowerCase()))
    : GOOGLE_FONTS;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white/20'} backdrop-blur-md shadow-lg border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                Design System Generator
              </h1>
              <p className={`mt-1 text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                Créez votre design system en quelques clics
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2 rounded-lg transition-all shadow-md hover:shadow-lg ${darkMode ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {darkMode ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  )}
                </svg>
              </button>
              <button
                onClick={() => handleExport('css')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                CSS
              </button>
              <button
                onClick={() => handleExport('tailwind')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                Tailwind
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                JSON
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 sm:px-4 py-2 text-xs sm:text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-semibold shadow-md hover:shadow-lg"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[30%_70%] gap-6">
          {/* Configuration Panel */}
          <div className={`${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/20'} backdrop-blur-sm rounded-2xl shadow-xl border p-4 sm:p-6 h-[calc(100vh-180px)] lg:h-[calc(100vh-180px)] overflow-y-auto`}>
            <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-2`}>
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              Configuration
            </h2>

            <div className="space-y-6">
              {/* Couleurs */}
              <div>
                <h3 className={`text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>🎨 Couleurs</h3>
                <div className="space-y-4">
                  {/* Primary */}
                  <div>
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                      Primaire
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                        className={`w-full h-12 rounded-lg border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex items-center px-3 gap-3 hover:border-indigo-400 transition-all`}
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <div className="w-6 h-6 rounded border-2 border-white shadow-sm" style={{ backgroundColor: config.primaryColor }} />
                        <span className="flex-1 text-left font-mono text-sm font-semibold text-white drop-shadow-md">
                          {config.primaryColor}
                        </span>
                      </button>
                      {showPrimaryPicker && (
                        <div className="absolute top-14 left-0 z-50 p-3 bg-white rounded-xl shadow-2xl">
                          <HexColorPicker color={config.primaryColor} onChange={(color) => setConfig({ ...config, primaryColor: color })} />
                          <button
                            onClick={() => setShowPrimaryPicker(false)}
                            className="mt-3 w-full px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-semibold"
                          >
                            Fermer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Secondary */}
                  <div>
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                      Secondaire
                    </label>
                    <div className="relative">
                      <button
                        onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                        className={`w-full h-12 rounded-lg border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex items-center px-3 gap-3 hover:border-purple-400 transition-all`}
                        style={{ backgroundColor: config.secondaryColor }}
                      >
                        <div className="w-6 h-6 rounded border-2 border-white shadow-sm" style={{ backgroundColor: config.secondaryColor }} />
                        <span className="flex-1 text-left font-mono text-sm font-semibold text-white drop-shadow-md">
                          {config.secondaryColor}
                        </span>
                      </button>
                      {showSecondaryPicker && (
                        <div className="absolute top-14 left-0 z-50 p-3 bg-white rounded-xl shadow-2xl">
                          <HexColorPicker color={config.secondaryColor} onChange={(color) => setConfig({ ...config, secondaryColor: color })} />
                          <button
                            onClick={() => setShowSecondaryPicker(false)}
                            className="mt-3 w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-semibold"
                          >
                            Fermer
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Semantic colors */}
                  <div className="grid grid-cols-3 gap-2 sm:gap-3">
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Success</label>
                      <input
                        type="color"
                        value={config.successColor}
                        onChange={(e) => setConfig({ ...config, successColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Warning</label>
                      <input
                        type="color"
                        value={config.warningColor}
                        onChange={(e) => setConfig({ ...config, warningColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Error</label>
                      <input
                        type="color"
                        value={config.errorColor}
                        onChange={(e) => setConfig({ ...config, errorColor: e.target.value })}
                        className="w-full h-10 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography */}
              <div>
                <h3 className={`text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>✍️ Typographie</h3>
                <div className="space-y-4">
                  <div>
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                      Police Corps (Google Fonts)
                    </label>
                    <input
                      type="text"
                      value={fontSearch}
                      onChange={(e) => setFontSearch(e.target.value)}
                      placeholder="Rechercher..."
                      className={`w-full px-3 py-2 border-2 ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-900'} rounded-lg text-sm mb-2`}
                    />
                    <select
                      value={config.fontFamily}
                      onChange={(e) => {
                        setConfig({ ...config, fontFamily: e.target.value });
                        setFontSearch('');
                      }}
                      className={`w-full px-3 py-2.5 border-2 ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-900'} rounded-lg text-sm`}
                      style={{ fontFamily: config.fontFamily }}
                    >
                      {filteredFonts.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                      Police Titres
                    </label>
                    <select
                      value={config.headingFont}
                      onChange={(e) => setConfig({ ...config, headingFont: e.target.value })}
                      className={`w-full px-3 py-2.5 border-2 ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-900'} rounded-lg text-sm`}
                      style={{ fontFamily: config.headingFont }}
                    >
                      {GOOGLE_FONTS.map((font) => (
                        <option key={font} value={font} style={{ fontFamily: font }}>
                          {font}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <h3 className={`text-base font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} mb-4`}>📏 Espacement</h3>
                <div>
                  <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                    Unité de Base: {config.baseSpacing}px
                  </label>
                  <input
                    type="range"
                    min="2"
                    max="16"
                    value={config.baseSpacing}
                    onChange={(e) => setConfig({ ...config, baseSpacing: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-slate-500 mt-1">
                    <span>2px</span>
                    <span>16px</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className={`${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/20'} backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden`}>
            {/* Tabs */}
            <div className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'} sticky top-0 z-10 bg-inherit`}>
              <nav className="flex overflow-x-auto">
                {[
                  { id: 'preview', label: 'Aperçu' },
                  { id: 'components', label: 'Composants' },
                  { id: 'css', label: 'CSS' },
                  { id: 'tailwind', label: 'Tailwind' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 font-semibold transition-all relative whitespace-nowrap text-sm ${
                      activeTab === tab.id
                        ? 'text-indigo-600'
                        : `${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'}`
                    }`}
                  >
                    {activeTab === tab.id && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600" />
                    )}
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Content */}
            <div className="p-6 h-[calc(100vh-260px)] overflow-y-auto">
              {activeTab === 'preview' && (
                <div className="space-y-8">
                  {/* Colors */}
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                      Palette de Couleurs
                    </h3>
                    <div className="space-y-6">
                      {[
                        { name: 'Primary', scale: tokens.colors.primary },
                        { name: 'Secondary', scale: tokens.colors.secondary },
                        { name: 'Neutral', scale: tokens.colors.neutral },
                        { name: 'Success', scale: tokens.colors.success },
                        { name: 'Warning', scale: tokens.colors.warning },
                        { name: 'Error', scale: tokens.colors.error },
                      ].map(({ name, scale }) => (
                        <div key={name}>
                          <p className={`text-xs font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2 uppercase tracking-wide`}>{name}</p>
                          <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-11 gap-1 sm:gap-2">
                            {Object.entries(scale).map(([shade, color]) => (
                              <div key={shade} className="flex flex-col items-center">
                                <div
                                  className="w-full h-14 rounded-lg shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105"
                                  style={{ backgroundColor: color }}
                                  title={color}
                                />
                                <span className={`text-[10px] font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>{shade}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Typography */}
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                      Typographie
                    </h3>
                    <div className={`space-y-3 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} p-4 rounded-xl`}>
                      {Object.entries(tokens.typography.fontSize).map(([size, value]) => (
                        <div key={size} className="flex items-center gap-4">
                          <span className="text-xs font-bold text-indigo-600 w-12 uppercase">{size}</span>
                          <span 
                            className={`${darkMode ? 'text-slate-200' : 'text-slate-800'}`}
                            style={{ fontSize: value }}
                          >
                            The quick brown fox jumps
                          </span>
                        </div>
                      ))}
                      
                      <div className={`mt-4 pt-4 border-t ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                          <span className="font-bold">Corps:</span> {config.fontFamily}
                        </p>
                        <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                          <span className="font-bold">Titres:</span> {config.headingFont}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Spacing */}
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>
                      Espacement
                    </h3>
                    <div className={`space-y-3 ${darkMode ? 'bg-slate-900/50' : 'bg-slate-50'} p-4 rounded-xl`}>
                      {Object.entries(tokens.spacing).map(([size, value]) => (
                        <div key={size} className="flex items-center gap-4">
                          <span className="text-xs font-bold text-indigo-600 w-12 uppercase">{size}</span>
                          <div
                            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-8 rounded-lg"
                            style={{ width: value }}
                          />
                          <span className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'components' && (
                <div className="space-y-8">
                  <div>
                    <h3 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>
                      Composants
                    </h3>

                    {/* Buttons */}
                    <div className="mb-8">
                      <h4 className={`text-base font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Boutons</h4>
                      <div className="flex flex-wrap gap-3">
                        <button
                          className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 shadow-md"
                          style={{ backgroundColor: config.primaryColor, fontFamily: config.fontFamily }}
                        >
                          Primary
                        </button>
                        <button
                          className="px-6 py-3 text-white font-semibold rounded-lg transition-all hover:opacity-90 shadow-md"
                          style={{ backgroundColor: config.secondaryColor, fontFamily: config.fontFamily }}
                        >
                          Secondary
                        </button>
                        <button
                          className={`px-6 py-3 font-semibold rounded-lg transition-all ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-slate-900 hover:bg-slate-50'} shadow-md`}
                          style={{ border: `2px solid ${config.primaryColor}`, fontFamily: config.fontFamily }}
                        >
                          Outline
                        </button>
                      </div>
                    </div>

                    {/* Cards */}
                    <div className="mb-8">
                      <h4 className={`text-base font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Cards</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {['Primary', 'Secondary'].map((type, idx) => (
                          <div
                            key={type}
                            className={`p-6 ${darkMode ? 'bg-slate-900/50' : 'bg-white'} rounded-lg shadow-lg transition-all hover:shadow-xl`}
                            style={{ borderTop: `4px solid ${idx === 0 ? config.primaryColor : config.secondaryColor}` }}
                          >
                            <h5 
                              className={`text-lg font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                              style={{ fontFamily: config.headingFont }}
                            >
                              {type} Card
                            </h5>
                            <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} text-sm`} style={{ fontFamily: config.fontFamily }}>
                              Exemple de carte avec votre design system.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Alerts */}
                    <div>
                      <h4 className={`text-base font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Alertes</h4>
                      <div className="space-y-3">
                        {[
                          { type: 'Success', color: config.successColor },
                          { type: 'Warning', color: config.warningColor },
                          { type: 'Error', color: config.errorColor },
                        ].map(({ type, color }) => (
                          <div
                            key={type}
                            className="p-4 rounded-lg"
                            style={{ backgroundColor: `${color}20`, borderLeft: `4px solid ${color}` }}
                          >
                            <p className="font-semibold text-sm" style={{ color, fontFamily: config.fontFamily }}>
                              {type}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`} style={{ fontFamily: config.fontFamily }}>
                              Message d'alerte de type {type.toLowerCase()}.
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'css' && (
                <pre className={`${darkMode ? 'bg-slate-950' : 'bg-slate-900'} text-slate-100 p-4 rounded-xl overflow-x-auto text-xs`}>
                  <code>{cssVariables}</code>
                </pre>
              )}

              {activeTab === 'tailwind' && (
                <pre className={`${darkMode ? 'bg-slate-950' : 'bg-slate-900'} text-slate-100 p-4 rounded-xl overflow-x-auto text-xs`}>
                  <code>{tailwindConfig}</code>
                </pre>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`mt-8 py-6 text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          <p className="text-sm">
            Développé par{' '}
            <a 
              href="https://www.linkedin.com/in/charlesatangui/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              Charles A.
            </a>
            {' '}|{' '}
            <a 
              href="https://github.com/Atangui" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-semibold text-purple-600 hover:text-purple-700 transition-colors inline-flex items-center gap-1"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              GitHub
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
