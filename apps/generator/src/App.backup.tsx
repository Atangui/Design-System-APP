import { useState, useEffect } from 'react';
import { HexColorPicker } from 'react-colorful';
import { generateDesignTokens, exportToCSSVariables, exportToTailwindConfig } from '@design-system/tokens';
import { saveAs } from 'file-saver';
import jsPDF from 'jspdf';
import WebFont from 'webfontloader';

// Google Fonts populaires pour le design
const GOOGLE_FONTS = [
  'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 'Raleway', 'Nunito',
  'Playfair Display', 'Merriweather', 'Libre Baskerville', 'Source Serif Pro',
  'Source Code Pro', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono',
  'Work Sans', 'DM Sans', 'Plus Jakarta Sans', 'Manrope', 'Space Grotesk',
  'Crimson Text', 'Lora', 'PT Serif', 'Spectral'
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
  const [loadedFonts, setLoadedFonts] = useState<string[]>(['Inter']);

  // Charger les polices Google Fonts
  useEffect(() => {
    const fontsToLoad = [config.fontFamily, config.headingFont].filter(
      (font, index, self) => self.indexOf(font) === index && !loadedFonts.includes(font)
    );

    if (fontsToLoad.length > 0) {
      WebFont.load({
        google: {
          families: fontsToLoad,
        },
        active: () => {
          setLoadedFonts((prev) => [...prev, ...fontsToLoad]);
        },
      });
    }
  }, [config.fontFamily, config.headingFont, loadedFonts]);

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
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
    doc.text(`Couleur Primaire: ${config.primaryColor}`, 25, yPos);
    yPos += 6;
    doc.text(`Couleur Secondaire: ${config.secondaryColor}`, 25, yPos);
    yPos += 6;
    doc.text(`Police Corps: ${config.fontFamily}`, 25, yPos);
    yPos += 6;
    doc.text(`Police Titres: ${config.headingFont}`, 25, yPos);
    yPos += 6;
    doc.text(`Espacement de Base: ${config.baseSpacing}px`, 25, yPos);
    yPos += 6;
    doc.text(`Colonnes: ${config.gridColumns} | Gouttière: ${config.gridGutter}px`, 25, yPos);
    yPos += 12;

    // Palette de Couleurs Primary
    doc.setFontSize(14);
    doc.text('Palette Primary', 20, yPos);
    yPos += 8;

    let xPos = 25;
    Object.entries(tokens.colors.primary).forEach(([shade, color]) => {
      // Convertir hex en RGB
      const r = parseInt(color.slice(1, 3), 16);
      const g = parseInt(color.slice(3, 5), 16);
      const b = parseInt(color.slice(5, 7), 16);
      
      doc.setFillColor(r, g, b);
      doc.rect(xPos, yPos, 15, 10, 'F');
      doc.setFontSize(8);
      doc.setTextColor(0, 0, 0);
      doc.text(shade, xPos, yPos + 14);
      xPos += 17;
      
      if (xPos > 180) {
        xPos = 25;
        yPos += 20;
      }
    });

    yPos += 25;

    // Typographie
    if (yPos > 250) {
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

    yPos += 10;

    // Espacement
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('Échelle d\'Espacement', 20, yPos);
    yPos += 8;

    doc.setFontSize(10);
    Object.entries(tokens.spacing).forEach(([size, value]) => {
      doc.text(`${size}: ${value}`, 25, yPos);
      yPos += 6;
    });

    // Sauvegarder
    doc.save('design-system.pdf');
  };

  const filteredFonts = GOOGLE_FONTS.filter((font) =>
    font.toLowerCase().includes(fontSearch.toLowerCase())
  );

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-slate-900/80 border-slate-700' : 'bg-white/80 border-white/20'} backdrop-blur-md shadow-lg border-b sticky top-0 z-50 transition-colors duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight pb-1">
                Design System Generator Pro
              </h1>
              <p className={`mt-1 sm:mt-2 text-xs sm:text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'} font-medium`}>
                Outil professionnel pour créer des design systems complets
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`p-2.5 rounded-xl transition-all font-semibold shadow-lg hover:shadow-xl hover:-translate-y-0.5 ${darkMode ? 'bg-yellow-500 text-slate-900 hover:bg-yellow-400' : 'bg-slate-800 text-white hover:bg-slate-900'}`}
                title={darkMode ? 'Mode clair' : 'Mode sombre'}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
              <button
                onClick={() => handleExport('css')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all font-semibold shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 hover:-translate-y-0.5"
              >
                CSS
              </button>
              <button
                onClick={() => handleExport('tailwind')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-cyan-600 to-cyan-700 text-white rounded-xl hover:from-cyan-700 hover:to-cyan-800 transition-all font-semibold shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-500/40 hover:-translate-y-0.5"
              >
                Tailwind
              </button>
              <button
                onClick={() => handleExport('json')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-xl hover:from-purple-700 hover:to-purple-800 transition-all font-semibold shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 hover:-translate-y-0.5"
              >
                JSON
              </button>
              <button
                onClick={() => handleExport('pdf')}
                className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:-translate-y-0.5"
              >
                PDF
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <div className={`${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/20'} backdrop-blur-sm rounded-2xl shadow-xl border p-4 sm:p-6 lg:sticky lg:top-24 max-h-[calc(100vh-7rem)] overflow-y-auto`}>
              <h2 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6 flex items-center gap-2`}>
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
                Configuration
              </h2>

              {/* Section Couleurs */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('colors')}
                  className={`w-full flex items-center justify-between text-left font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-base mb-3 hover:text-indigo-600 transition-colors`}
                >
                  <span>🎨 Couleurs</span>
                  <svg className={`w-5 h-5 transition-transform ${expandedSections.colors ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.colors && (
                  <div className="space-y-4 pl-2">
                    {/* Primary Color */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Primaire
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowPrimaryPicker(!showPrimaryPicker)}
                          className={`w-full h-12 rounded-lg border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex items-center px-3 gap-2 hover:border-indigo-400 transition-all shadow-sm`}
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

                    {/* Secondary Color */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Secondaire
                      </label>
                      <div className="relative">
                        <button
                          onClick={() => setShowSecondaryPicker(!showSecondaryPicker)}
                          className={`w-full h-12 rounded-lg border-2 ${darkMode ? 'border-slate-600' : 'border-slate-200'} flex items-center px-3 gap-2 hover:border-purple-400 transition-all shadow-sm`}
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

                    {/* Couleurs sémantiques */}
                    <div className="grid grid-cols-2 gap-3">
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
                      <div>
                        <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>Neutral</label>
                        <input
                          type="color"
                          value={config.neutralColor}
                          onChange={(e) => setConfig({ ...config, neutralColor: e.target.value })}
                          className="w-full h-10 rounded-lg cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Section Typographie */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('typography')}
                  className={`w-full flex items-center justify-between text-left font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-base mb-3 hover:text-indigo-600 transition-colors`}
                >
                  <span>✍️ Typographie</span>
                  <svg className={`w-5 h-5 transition-transform ${expandedSections.typography ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.typography && (
                  <div className="space-y-4 pl-2">
                    {/* Search fonts */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Police Corps (Google Fonts)
                      </label>
                      <input
                        type="text"
                        value={fontSearch}
                        onChange={(e) => setFontSearch(e.target.value)}
                        placeholder="Rechercher une police..."
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
                        {(fontSearch ? filteredFonts : GOOGLE_FONTS).map((font) => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Heading font */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
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

                    {/* Mono font */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Police Monospace
                      </label>
                      <select
                        value={config.monoFont}
                        onChange={(e) => setConfig({ ...config, monoFont: e.target.value })}
                        className={`w-full px-3 py-2.5 border-2 ${darkMode ? 'border-slate-600 bg-slate-700 text-white' : 'border-slate-200 bg-white text-slate-900'} rounded-lg text-sm font-mono`}
                      >
                        {['Source Code Pro', 'Fira Code', 'JetBrains Mono', 'IBM Plex Mono'].map((font) => (
                          <option key={font} value={font} style={{ fontFamily: font }}>
                            {font}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Line Height */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Line Height: {config.lineHeight}
                      </label>
                      <input
                        type="range"
                        min="1"
                        max="2"
                        step="0.1"
                        value={config.lineHeight}
                        onChange={(e) => setConfig({ ...config, lineHeight: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>

                    {/* Letter Spacing */}
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Letter Spacing: {config.letterSpacing}px
                      </label>
                      <input
                        type="range"
                        min="-2"
                        max="4"
                        step="0.5"
                        value={config.letterSpacing}
                        onChange={(e) => setConfig({ ...config, letterSpacing: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section Espacement */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('spacing')}
                  className={`w-full flex items-center justify-between text-left font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-base mb-3 hover:text-indigo-600 transition-colors`}
                >
                  <span>📏 Espacement</span>
                  <svg className={`w-5 h-5 transition-transform ${expandedSections.spacing ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.spacing && (
                  <div className="space-y-4 pl-2">
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Base Unit: {config.baseSpacing}px
                      </label>
                      <input
                        type="range"
                        min="2"
                        max="16"
                        value={config.baseSpacing}
                        onChange={(e) => setConfig({ ...config, baseSpacing: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section Grille */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('grid')}
                  className={`w-full flex items-center justify-between text-left font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-base mb-3 hover:text-indigo-600 transition-colors`}
                >
                  <span>⚡ Grille</span>
                  <svg className={`w-5 h-5 transition-transform ${expandedSections.grid ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.grid && (
                  <div className="space-y-4 pl-2">
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Colonnes: {config.gridColumns}
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="16"
                        value={config.gridColumns}
                        onChange={(e) => setConfig({ ...config, gridColumns: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Gouttière: {config.gridGutter}px
                      </label>
                      <input
                        type="range"
                        min="8"
                        max="48"
                        step="4"
                        value={config.gridGutter}
                        onChange={(e) => setConfig({ ...config, gridGutter: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Section Effets */}
              <div className="mb-6">
                <button
                  onClick={() => toggleSection('effects')}
                  className={`w-full flex items-center justify-between text-left font-bold ${darkMode ? 'text-slate-200' : 'text-slate-800'} text-base mb-3 hover:text-indigo-600 transition-colors`}
                >
                  <span>✨ Effets</span>
                  <svg className={`w-5 h-5 transition-transform ${expandedSections.effects ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedSections.effects && (
                  <div className="space-y-4 pl-2">
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Border Radius: {config.borderRadius}px
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="24"
                        value={config.borderRadius}
                        onChange={(e) => setConfig({ ...config, borderRadius: parseInt(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                    <div>
                      <label className={`block text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mb-2`}>
                        Intensité Ombres: {(config.shadowIntensity * 100).toFixed(0)}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="0.3"
                        step="0.05"
                        value={config.shadowIntensity}
                        onChange={(e) => setConfig({ ...config, shadowIntensity: parseFloat(e.target.value) })}
                        className="w-full"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preview Panel */}
          <div className="lg:col-span-2">
            <div className={`${darkMode ? 'bg-slate-800/90 border-slate-700' : 'bg-white/90 border-white/20'} backdrop-blur-sm rounded-2xl shadow-xl border overflow-hidden`}>
              {/* Tabs */}
              <div className={`border-b ${darkMode ? 'border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700' : 'border-slate-200 bg-gradient-to-r from-slate-50 to-slate-100'}`}>
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
                      className={`px-4 sm:px-8 py-3 sm:py-4 font-semibold transition-all relative whitespace-nowrap text-sm sm:text-base ${
                        activeTab === tab.id
                          ? 'text-indigo-600'
                          : `${darkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'} hover:bg-white/50`
                      }`}
                    >
                      {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-full" />
                      )}
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-4 sm:p-6 md:p-8">
                {activeTab === 'preview' && (
                  <div className="space-y-6 sm:space-y-10">
                    {/* Colors Preview */}
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 flex items-center gap-2`} style={{ fontFamily: config.headingFont }}>
                        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
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
                            <p className={`text-xs sm:text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-3 uppercase tracking-wide`}>{name}</p>
                            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-11 gap-1 sm:gap-2">
                              {Object.entries(scale).map(([shade, color]) => (
                                <div key={shade} className="flex flex-col items-center group">
                                  <div
                                    className="w-full h-12 sm:h-14 md:h-16 rounded-lg sm:rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer hover:scale-105 border-2 border-white"
                                    style={{ backgroundColor: color, borderRadius: `${config.borderRadius}px` }}
                                    title={color}
                                  />
                                  <span className={`text-[10px] sm:text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'} mt-1 sm:mt-2`}>{shade}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Typography Preview */}
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 flex items-center gap-2`} style={{ fontFamily: config.headingFont }}>
                        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                        Typographie
                      </h3>
                      <div className={`space-y-3 sm:space-y-4 ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-slate-50 to-white border-slate-200'} p-4 sm:p-6 rounded-xl border`}>
                        {Object.entries(tokens.typography.fontSize).map(([size, value]) => (
                          <div key={size} className={`flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 p-2 sm:p-3 rounded-lg ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-white'} transition-colors`}>
                            <span className="text-xs sm:text-sm font-bold text-indigo-600 sm:w-16 uppercase">{size}</span>
                            <span 
                              className={`${darkMode ? 'text-slate-200' : 'text-slate-800'} font-medium break-all sm:break-normal`}
                              style={{ 
                                fontSize: value, 
                                fontFamily: config.fontFamily,
                                lineHeight: config.lineHeight,
                                letterSpacing: `${config.letterSpacing}px`
                              }}
                            >
                              The quick brown fox jumps over the lazy dog
                            </span>
                          </div>
                        ))}
                        
                        <div className="mt-6 pt-6 border-t border-slate-300 dark:border-slate-700">
                          <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-3`}>Font Families:</p>
                          <div className="space-y-2">
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: config.fontFamily }}>
                              <span className="font-bold">Corps:</span> {config.fontFamily}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: config.headingFont }}>
                              <span className="font-bold">Titres:</span> {config.headingFont}
                            </p>
                            <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: config.monoFont }}>
                              <span className="font-bold">Mono:</span> {config.monoFont}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Spacing & Grid Preview */}
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 flex items-center gap-2`} style={{ fontFamily: config.headingFont }}>
                        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                        Espacement & Grille
                      </h3>
                      <div className={`space-y-6 ${darkMode ? 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700' : 'bg-gradient-to-br from-slate-50 to-white border-slate-200'} p-4 sm:p-6 rounded-xl border overflow-x-auto`}>
                        <div>
                          <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-3`}>Échelle d'espacement</p>
                          {Object.entries(tokens.spacing).map(([size, value]) => (
                            <div key={size} className={`flex items-center gap-3 sm:gap-6 p-2 sm:p-3 rounded-lg ${darkMode ? 'hover:bg-slate-800/50' : 'hover:bg-white'} transition-colors min-w-max`}>
                              <span className="text-xs sm:text-sm font-bold text-indigo-600 w-12 sm:w-16 uppercase">{size}</span>
                              <div
                                className="bg-gradient-to-r from-indigo-500 to-purple-500 h-8 sm:h-10 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                style={{ width: value, borderRadius: `${config.borderRadius}px` }}
                              />
                              <span className={`text-xs sm:text-sm font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{value}</span>
                            </div>
                          ))}
                        </div>

                        <div className="pt-6 border-t border-slate-300 dark:border-slate-700">
                          <p className={`text-sm font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-3`}>
                            Grille: {config.gridColumns} colonnes, gouttière {config.gridGutter}px
                          </p>
                          <div 
                            className="grid gap-2" 
                            style={{ 
                              gridTemplateColumns: `repeat(${config.gridColumns}, 1fr)`,
                              gap: `${config.gridGutter}px`
                            }}
                          >
                            {Array.from({ length: config.gridColumns }).map((_, i) => (
                              <div
                                key={i}
                                className="h-16 bg-gradient-to-br from-indigo-500 to-purple-500 opacity-50 flex items-center justify-center text-white font-bold text-xs"
                                style={{ borderRadius: `${config.borderRadius}px` }}
                              >
                                {i + 1}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Effects Preview */}
                    <div>
                      <h3 className={`text-xl sm:text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4 sm:mb-6 flex items-center gap-2`} style={{ fontFamily: config.headingFont }}>
                        <div className="w-1 sm:w-1.5 h-6 sm:h-8 bg-gradient-to-b from-indigo-600 to-purple-600 rounded-full" />
                        Effets
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(tokens.shadows).map(([size, shadow]) => (
                          <div key={size} className="text-center">
                            <div
                              className={`w-full h-24 ${darkMode ? 'bg-slate-700' : 'bg-white'} mb-2`}
                              style={{ 
                                boxShadow: shadow,
                                borderRadius: `${config.borderRadius}px`
                              }}
                            />
                            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>{size}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        {Object.entries(tokens.borderRadius).map(([size, radius]) => (
                          <div key={size} className="text-center">
                            <div
                              className={`w-full h-24 ${darkMode ? 'bg-indigo-700' : 'bg-indigo-500'} mb-2`}
                              style={{ borderRadius: radius }}
                            />
                            <p className={`text-xs font-semibold ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                              {size}: {radius}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'components' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`} style={{ fontFamily: config.headingFont }}>
                        Aperçu des Composants
                      </h3>

                      {/* Buttons */}
                      <div className="mb-8">
                        <h4 className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Boutons</h4>
                        <div className="flex flex-wrap gap-3">
                          <button
                            className="px-6 py-3 text-white font-semibold rounded transition-all hover:opacity-90"
                            style={{ 
                              backgroundColor: config.primaryColor,
                              borderRadius: `${config.borderRadius}px`,
                              fontFamily: config.fontFamily,
                              boxShadow: tokens.shadows.md
                            }}
                          >
                            Primary Button
                          </button>
                          <button
                            className="px-6 py-3 text-white font-semibold rounded transition-all hover:opacity-90"
                            style={{ 
                              backgroundColor: config.secondaryColor,
                              borderRadius: `${config.borderRadius}px`,
                              fontFamily: config.fontFamily,
                              boxShadow: tokens.shadows.md
                            }}
                          >
                            Secondary Button
                          </button>
                          <button
                            className={`px-6 py-3 font-semibold rounded transition-all ${darkMode ? 'bg-slate-700 text-white hover:bg-slate-600' : 'bg-white text-slate-900 hover:bg-slate-50'}`}
                            style={{ 
                              borderRadius: `${config.borderRadius}px`,
                              fontFamily: config.fontFamily,
                              boxShadow: tokens.shadows.sm,
                              border: `2px solid ${config.primaryColor}`
                            }}
                          >
                            Outline Button
                          </button>
                        </div>
                      </div>

                      {/* Cards */}
                      <div className="mb-8">
                        <h4 className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Cards</h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          {['Primary', 'Secondary', 'Neutral'].map((type, idx) => (
                            <div
                              key={type}
                              className={`p-6 ${darkMode ? 'bg-slate-800' : 'bg-white'} transition-all hover:translate-y-[-4px]`}
                              style={{ 
                                borderRadius: `${config.borderRadius}px`,
                                boxShadow: tokens.shadows.lg,
                                borderTop: `4px solid ${
                                  idx === 0 ? config.primaryColor : 
                                  idx === 1 ? config.secondaryColor : 
                                  config.neutralColor
                                }`
                              }}
                            >
                              <h5 
                                className={`text-xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}
                                style={{ fontFamily: config.headingFont }}
                              >
                                {type} Card
                              </h5>
                              <p className={`${darkMode ? 'text-slate-400' : 'text-slate-600'}`} style={{ fontFamily: config.fontFamily, lineHeight: config.lineHeight }}>
                                Ceci est un exemple de carte utilisant votre design system personnalisé.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Form Elements */}
                      <div className="mb-8">
                        <h4 className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Formulaires</h4>
                        <div className="space-y-4 max-w-md">
                          <div>
                            <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`} style={{ fontFamily: config.fontFamily }}>
                              Label
                            </label>
                            <input
                              type="text"
                              placeholder="Placeholder text..."
                              className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border-2 focus:outline-none transition-all`}
                              style={{ 
                                borderRadius: `${config.borderRadius}px`,
                                fontFamily: config.fontFamily,
                                borderColor: config.primaryColor,
                                boxShadow: `0 0 0 3px ${config.primaryColor}20`
                              }}
                            />
                          </div>
                          <div>
                            <label className={`block text-sm font-semibold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-2`} style={{ fontFamily: config.fontFamily }}>
                              Textarea
                            </label>
                            <textarea
                              placeholder="Votre message..."
                              rows={4}
                              className={`w-full px-4 py-3 ${darkMode ? 'bg-slate-800 text-white border-slate-600' : 'bg-white text-slate-900 border-slate-300'} border-2 focus:outline-none transition-all`}
                              style={{ 
                                borderRadius: `${config.borderRadius}px`,
                                fontFamily: config.fontFamily,
                                borderColor: config.primaryColor,
                                boxShadow: `0 0 0 3px ${config.primaryColor}20`
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Alerts */}
                      <div>
                        <h4 className={`text-lg font-bold ${darkMode ? 'text-slate-300' : 'text-slate-700'} mb-4`}>Alertes</h4>
                        <div className="space-y-3">
                          {[
                            { type: 'Success', color: config.successColor },
                            { type: 'Warning', color: config.warningColor },
                            { type: 'Error', color: config.errorColor },
                          ].map(({ type, color }) => (
                            <div
                              key={type}
                              className="p-4"
                              style={{
                                backgroundColor: `${color}20`,
                                borderLeft: `4px solid ${color}`,
                                borderRadius: `${config.borderRadius}px`,
                                fontFamily: config.fontFamily,
                              }}
                            >
                              <p className="font-semibold" style={{ color }}>
                                {type}
                              </p>
                              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>
                                Ceci est un message d'alerte de type {type.toLowerCase()}.
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'css' && (
                  <pre className={`${darkMode ? 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'} text-slate-100 p-4 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm shadow-2xl border`}>
                    <code className="font-mono">{cssVariables}</code>
                  </pre>
                )}

                {activeTab === 'tailwind' && (
                  <pre className={`${darkMode ? 'bg-gradient-to-br from-slate-950 to-slate-900 border-slate-800' : 'bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700'} text-slate-100 p-4 sm:p-6 rounded-xl overflow-x-auto text-xs sm:text-sm shadow-2xl border`}>
                    <code className="font-mono">{tailwindConfig}</code>
                  </pre>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
