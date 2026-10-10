import { CINEMATIC_THEMES, getThemeById } from './themes';

describe('Project Themes Configuration', () => {
  it('should define a comprehensive list of cinematic and minimal themes', () => {
    expect(CINEMATIC_THEMES.length).toBeGreaterThan(5);
  });

  it('should ensure all themes have required properties for UI rendering', () => {
    CINEMATIC_THEMES.forEach((theme) => {
      expect(theme.id).toBeTruthy();
      expect(theme.name).toBeTruthy();
      expect(theme.category).toBeTruthy();
      expect(theme.backgroundClass).toBeTruthy();
      expect(theme.accentColor).toMatch(/^#[0-9a-fA-F]{6}$/);
      expect(theme.previewBg).toBeTruthy();
      expect(theme.description).toBeTruthy();
    });
  });

  describe('getThemeById', () => {
    it('should retrieve a theme by exact id', () => {
      const theme = getThemeById('pure-white');
      expect(theme.id).toBe('pure-white');
      expect(theme.category).toBe('minimal');
    });

    it('should handle legacy or typo alias kabanex-horizon gracefully', () => {
      const theme = getThemeById('kabanex-horizon');
      expect(theme.id).toBe('kanbanex-horizon');
    });

    it('should fallback to the default theme (first theme) if not found or empty', () => {
      const defaultTheme = CINEMATIC_THEMES[0];

      expect(getThemeById(null)).toEqual(defaultTheme);
      expect(getThemeById(undefined)).toEqual(defaultTheme);
      expect(getThemeById('non-existent-theme-xyz')).toEqual(defaultTheme);
    });
  });
});
