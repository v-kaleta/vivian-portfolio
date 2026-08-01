export default function Controls({ theme, onToggleTheme, sfxOn, onToggleSfx }) {
  return (
    <div className="controls">
      <button className="icon-btn" onClick={onToggleTheme} aria-label="toggle dark mode">
        <img
          src={theme === 'dark' ? '/icons/theme-light.png' : '/icons/theme-dark.png'}
          alt="toggle theme"
          className="control-icon-img"
        />
      </button>
      <button className="icon-btn" onClick={onToggleSfx} aria-label="toggle sound">
        <img
          src={sfxOn ? '/icons/sound-on.png' : '/icons/sound-off.png'}
          alt="toggle sound"
          className="control-icon-img"
        />
      </button>
    </div>
  );
}