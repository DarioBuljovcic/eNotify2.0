export default function logOut(navigation){
  
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{name: 'Registration'}, {name: 'Tabs'}],
          }),
        );
        navigation.navigate('Registration');
      
}