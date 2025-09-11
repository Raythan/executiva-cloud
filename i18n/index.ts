import { ptBR } from './locales/pt-BR';

// In a real app, you would have logic to select the language.
// For now, we'll hardcode to pt-BR.
const translations = ptBR;

/**
 * Gets a translation string from a nested key.
 * @param key The key in dot notation (e.g., 'sidebar.dashboard').
 * @param params An optional object of parameters to replace in the string (e.g., { name: 'John' }).
 * @returns The translated string.
 */
export const t = (key: string, params?: { [key: string]: string | number }): string => {
    const keys = key.split('.');
    let result: any = translations;

    try {
        for (const k of keys) {
            result = result[k];
            if (result === undefined) {
                throw new Error(`Key part '${k}' not found`);
            }
        }

        if (typeof result === 'string') {
            if (params) {
                return Object.entries(params).reduce((str, [paramKey, paramValue]) => {
                    const regex = new RegExp(`\\{${paramKey}\\}`, 'g');
                    return str.replace(regex, String(paramValue));
                }, result);
            }
            return result;
        }

        // This case should ideally not happen if keys always point to strings.
        console.warn(`Translation key '${key}' resolved to an object/array, not a string.`);
        return key;

    } catch (error) {
        console.warn(`Translation key not found: ${key}`);
        return key;
    }
};
