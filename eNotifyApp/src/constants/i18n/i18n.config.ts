import i18next from 'i18next';
import {initReactI18next} from 'react-i18next';
import { en, hu, sr } from './translations';

const resources = {
    en:{
        translation:en,
    },
    sr:{
        translation:sr,
    },
    hu:{
        translation:hu,
    }
}

i18next.use(initReactI18next).init({
    debug: false,
    lng:'sr',
    //default language
    fallbackLng: 'sr',
    resources
})

export default i18next;