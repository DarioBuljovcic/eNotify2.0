import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {useGlobalContext} from '../context/GlobalProvider';
import translations from '../constants/i18n/translations/translation';
import {translateTextOutOfComponent} from '../hooks/getTranslation.tsx';
import i18next from 'i18next';

const DropdownLang = () => {
  const {storage, isDarkMode} = useGlobalContext();

  const [lang, setLang] = useState('');
  const changeLanguage = async (prop: string) => {
    i18next.changeLanguage(prop);
    storage.set('Language', prop);
  };

  const dropdownData = [
    {label: translateTextOutOfComponent(translations.serbian), value: 'sr'},
    {label: translateTextOutOfComponent(translations.hungarian), value: 'hu'},
    {label: translateTextOutOfComponent(translations.english), value: 'en'},
  ];

  return (
    <Dropdown
      style={[
        styles.dropdown,
        {
          backgroundColor: isDarkMode.appBackground,
        },
      ]}
      itemTextStyle={{
        textTransform: 'capitalize',
        color: isDarkMode.textPrimary,
        fontFamily: 'Mulish',
      }}
      placeholder={translateTextOutOfComponent(translations.language)}
      placeholderStyle={{
        textTransform: 'capitalize',
        color: isDarkMode.textPrimary,
        fontFamily: 'Mulish',
      }}
      onChange={item => {
        changeLanguage(item.value);
        setLang(item.value);
      }}
      itemContainerStyle={{
        backgroundColor: isDarkMode.textInputBackground,
      }}
      labelField={'label'}
      valueField={'value'}
      value={lang}
      data={dropdownData}
      selectedTextStyle={{
        fontFamily: 'Mulish',
        textTransform: 'capitalize',
        marginLeft: 10,
        color: isDarkMode.textPrimary,
      }}
    />
  );
};

export default DropdownLang;

const styles = StyleSheet.create({
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: 'gray',
    borderBottomWidth: 0.5,
    width: 220,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
  },
});
