import { NestedLocalizationAdapter } from '@necord/localization';
import enUS from './locales/en-US';
import vi from './locales/vi';

export const fallbackLocale = 'en-US';

export const locales = {
	'en-US': enUS,
	vi
};

export const localizationAdapter = new NestedLocalizationAdapter({
	fallbackLocale,
	locales
});
