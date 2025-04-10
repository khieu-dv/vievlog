import fs from 'fs';
import path from 'path';

export const loadLocales = (locale: string) => {
  try {
    const filePath = path.join(process.cwd(), 'public/locales', locale, 'translation.json');
    const fileContents = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    console.error(`Error loading translation for locale ${locale}:`, error);
    return {};
  }
};
