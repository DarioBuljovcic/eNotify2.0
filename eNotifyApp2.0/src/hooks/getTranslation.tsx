import {t} from 'i18next';
import {useTranslation} from 'react-i18next';
import {Text} from 'react-native';

export const translateText = (value: string) => {
  const {t} = useTranslation();

  return t(value);
};

export const translateTextOutOfComponent = (value: string) => {
  return t(value);
};

export const TranslatedText = ({value, style}: {value: string; style: any}) => {
  const {t} = useTranslation();

  return <Text style={style}>{t(value)}</Text>;
};
