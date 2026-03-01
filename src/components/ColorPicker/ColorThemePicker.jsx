import React from 'react';
import { useCV } from '../../context/CVContext';
import { COLOR_THEMES } from '../../utils/constants';

const ColorThemePicker = () => {
  const { colorTheme, setColorTheme } = useCV();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <h3 className="text-sm font-semibold text-gray-700 mb-3">Color Theme</h3>
      <div className="flex flex-wrap gap-2 mb-3">
        {COLOR_THEMES.map((theme) => (
          <button
            key={theme.primary}
            onClick={() => setColorTheme(theme.primary)}
            title={theme.label}
            className={`w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
              colorTheme === theme.primary ? 'border-gray-800 scale-110' : 'border-transparent'
            }`}
            style={{ backgroundColor: theme.primary }}
          />
        ))}
      </div>
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Custom:</label>
        <input
          type="color"
          value={colorTheme}
          onChange={(e) => setColorTheme(e.target.value)}
          className="w-8 h-8 rounded cursor-pointer border border-gray-200"
        />
        <input
          type="text"
          value={colorTheme}
          onChange={(e) => {
            if (/^#[0-9A-Fa-f]{0,6}$/.test(e.target.value)) {
              setColorTheme(e.target.value);
            }
          }}
          className="text-xs border border-gray-200 rounded px-2 py-1 w-20 font-mono"
          placeholder="#1e3a5f"
        />
      </div>
    </div>
  );
};

export default ColorThemePicker;
