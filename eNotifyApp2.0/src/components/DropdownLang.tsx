import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Dropdown} from 'react-native-element-dropdown';
import {useTranslation} from 'react-i18next';
import {useGlobalContext} from '../context/GlobalProvider';

const DropdownLang = () => {
  const {storage, isDarkMode} = useGlobalContext();
  const {t, i18n} = useTranslation();
  const [lang, setLang] = useState('');
  const changeLanguage = async (prop: string) => {
    if (prop === 'sr') {
      i18n.changeLanguage('sr');
      storage.set('Language', 'sr');
    } else if (prop === 'hu') {
      i18n.changeLanguage('hu');
      storage.set('Language', 'hu');
    } else if (prop === 'en') {
      i18n.changeLanguage('en');
      storage.set('Language', 'en');
    }
  };
  const dropdownData = [
    {label: t('serbian'), value: 'sr'},
    {label: t('hungarian'), value: 'hu'},
    {label: t('english'), value: 'en'},
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
      }}
      placeholder={t('choose language')}
      placeholderStyle={{
        textTransform: 'capitalize',
        color: isDarkMode.textPrimary,
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
    width: 180,
    alignSelf: 'center',
    padding: 20,
    borderRadius: 10,
  },
});
