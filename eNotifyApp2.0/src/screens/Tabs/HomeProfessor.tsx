import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import NotificationLoader from '../../components/NotificationLoader';
import ClassSelection from '../../components/ClassSelection';
import getProfessorClasses from '../../hooks/getProfessorClasses';
import {useGlobalContext} from '../../context/GlobalProvider';
import {Class} from '../../constants/Types/indexTypes';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  PermissionsAndroid,
  SafeAreaView,
} from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetScrollView,
} from '@gorhom/bottom-sheet';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {Dropdown} from 'react-native-element-dropdown';
import Colors from '../../constants/Color';
import {useTranslation} from 'react-i18next';
import DocumentPicker, {
  DocumentPickerResponse,
} from 'react-native-document-picker';
import sendNotification from '../../hooks/sendNotification';

const HomeProfessor = ({navigation}: any) => {
  const {t} = useTranslation();
  const {user, isDarkMode} = useGlobalContext();
  const [profClass, setProfClass] = useState<string>(user?.Class);
  const [classes, setClasses] = useState<Class[]>([]);
  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ['90%'], []);

  const [TitleValue, setTitleValue] = useState('');
  const [textValue, setTextValue] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [isFocus, setIsFocus] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<DocumentPickerResponse[]>(
    [],
  );

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const data = await getProfessorClasses(user?.UserID as string);
        setClasses(data as Class[]);
      } catch (error) {
        console.error('Error fetching classes:', error);
      } finally {
      }
    };

    fetchClasses();
  }, [user?.UserID]);

  const handleOpenPress = () => {
    bottomSheetRef.current?.expand();
  };
  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
      />
    ),
    [],
  );
  const AddNotifaciton = () => {
    sendNotification({
      TextValue: textValue,
      TitleValue: TitleValue,
      selectedFiles: selectedFiles,
      selectedClass: selectedClass,
      Name: user?.Name as string,
    });
    setTextValue('');
    setTitleValue('');
    setSelectedClass('');
    setSelectedFiles([]);

    bottomSheetRef.current?.close();
  };

  const AddFile = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
        {
          title: 'External Storage Permission',
          message:
            'This app needs access to your external storage to read files.',
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );

      const files = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        copyTo: 'documentDirectory',
        allowMultiSelection: true,
      });

      setSelectedFiles(files); // Clear previous files and set new files
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled file selection');
      } else {
        console.log('Error selecting files:', error);
      }
    }
    console.log(selectedFiles);
  };

  return (
    <SafeAreaView>
      <ClassSelection
        razredi={classes}
        setProfClass={(o: any) => setProfClass(o)}
        profClass={profClass}
      />
      <NotificationLoader navigation={navigation} userClass={profClass} />
      <TouchableOpacity
        style={[
          styles.add,
          {
            backgroundColor: isDarkMode.accent,
          },
        ]}
        activeOpacity={0.7}
        onPress={handleOpenPress}>
        <Ionicons name={'add-outline'} size={35} color={Colors.Light.white} />
      </TouchableOpacity>
      <BottomSheet
        ref={bottomSheetRef}
        snapPoints={snapPoints}
        index={-1}
        backdropComponent={renderBackdrop}
        enablePanDownToClose={true}
        handleStyle={{
          backgroundColor: isDarkMode.appBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: isDarkMode.lightText,
        }}>
        <BottomSheetScrollView
          showsVerticalScrollIndicator={false}
          style={[
            {
              backgroundColor: isDarkMode.appBackground,
            },
            {paddingBottom: 30},
          ]}>
          <Text
            style={[
              styles.title,
              {
                color: isDarkMode.textPrimary,
              },
            ]}>
            {t('add notification')}
          </Text>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder={t('Notification title')}
              placeholderTextColor={isDarkMode.lightText}
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode.componentBG,
                  color: isDarkMode.textPrimary,
                  borderColor: isDarkMode.lightText,
                },
              ]}
              value={TitleValue}
              onChangeText={e => setTitleValue(e)}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDarkMode.componentBG,
                  color: isDarkMode.textPrimary,
                  borderColor: isDarkMode.lightText,
                },
                {textAlignVertical: 'top'},
              ]}
              placeholder={t('notification text')}
              placeholderTextColor={isDarkMode.lightText}
              numberOfLines={4}
              value={textValue}
              onChangeText={e => setTextValue(e)}
              multiline={true}
            />
            <Dropdown
              style={[
                styles.dropdown,
                {
                  backgroundColor: isDarkMode.componentBG,
                },
              ]}
              placeholderStyle={[
                styles.placeholderStyle,
                {
                  color: isDarkMode.lightText,
                },
              ]}
              itemContainerStyle={{
                backgroundColor: isDarkMode.componentBG,
              }}
              selectedTextStyle={[
                styles.selectedTextStyle,
                {
                  color: isDarkMode.textPrimary,
                },
              ]}
              containerStyle={{
                backgroundColor: isDarkMode.componentBG,
              }}
              inputSearchStyle={[
                styles.inputSearchStyle,
                {
                  color: isDarkMode.lightText,
                },
              ]}
              itemTextStyle={{
                color: isDarkMode.textPrimary,
              }}
              data={classes}
              search
              placeholder={!isFocus ? t('choose grade') : '...'}
              value={selectedClass}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              onChange={item => {
                setSelectedClass(item.Class);
                setIsFocus(false);
              }}
              labelField={'Class'}
              valueField={'Class'}
              keyboardAvoiding={true}
            />

            <TouchableOpacity
              style={[
                styles.addFile,
                {
                  borderColor: isDarkMode.lightText,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => AddFile()}>
              <Ionicons
                name={
                  selectedFiles.length === 0
                    ? 'cloud-outline'
                    : 'document-text-outline'
                }
                size={50}
                color={isDarkMode.lightText}
              />
              <Text
                style={{
                  color: isDarkMode.lightText,
                }}>
                {selectedFiles.length === 0
                  ? t('add file')
                  : selectedFiles.map(file => file.name).join(', ')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.send,
                {
                  backgroundColor: isDarkMode.accent,
                },
              ]}
              onPress={AddNotifaciton}>
              <Text style={[styles.sendText]}>{t('send')}</Text>
            </TouchableOpacity>
          </View>
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaView>
  );
};

export default HomeProfessor;
const styles = StyleSheet.create({
  add: {
    width: 70,
    height: 70,
    position: 'absolute',
    bottom: 180,
    right: 10,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontFamily: 'Mulish',
    fontSize: 22,
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    flex: 1,
    gap: 10,
  },
  dropdown: {
    fontSize: 17,
    fontFamily: 'Mulish',
    padding: 15,
    margin: 16,
    height: 50,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Colors.Light.lightText,
    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
  },

  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 17,
    fontFamily: 'Mulish',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },

  send: {
    marginTop: 20,
    padding: 20,
    width: '80%',
    alignSelf: 'center',
    alignItems: 'center',
    marginBottom: 130,
    borderRadius: 30,
  },
  sendText: {
    color: Colors.Light.white,
    fontSize: 18,
    textAlign: 'center',
    fontFamily: 'Mulish',
  },
  input: {
    fontSize: 17,
    fontFamily: 'Mulish',
    padding: 15,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 10,
    borderWidth: 1,
    elevation: 13,
    shadowColor: Colors.Light.black,
    shadowOffset: {width: 2, height: 5},
    shadowRadius: 1,
    overflow: 'scroll',
  },
  addFile: {
    height: 150,
    paddingHorizontal: 20,
    width: '85%',
    alignSelf: 'center',
    borderRadius: 15,
    borderWidth: 2,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
