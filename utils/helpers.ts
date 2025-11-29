export const getLanguageInfo = (language: string): { flag: string, country: string } => {
  const map: Record<string, { flag: string, country: string }> = {
    'Inglés': { flag: '🇬🇧', country: 'Reino Unido' },
    'Alemán': { flag: '🇩🇪', country: 'Alemania' },
    'Francés': { flag: '🇫🇷', country: 'Francia' },
    'Italiano': { flag: '🇮🇹', country: 'Italia' },
    'Español': { flag: '🇪🇸', country: 'España' },
    'Chino': { flag: '🇨🇳', country: 'China' },
    'Japonés': { flag: '🇯🇵', country: 'Japón' },
  };

  return map[language] || { flag: '🌍', country: language };
};