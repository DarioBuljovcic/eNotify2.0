import React from 'react';

import NotificationLoader from '../../components/NotificationLoader';
import {SafeAreaView} from 'react-native';

const HomeStudent = ({navigation}: any) => {
  return (
    <SafeAreaView>
      <NotificationLoader navigation={navigation} />
    </SafeAreaView>
  );
};

export default HomeStudent;
