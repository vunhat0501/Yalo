import { Redirect } from 'expo-router';
import { StyleSheet } from 'react-native';

export default function HomeScreen() {
  return <Redirect href={'/home'} />;

  // return (
  //   <View style={styles.container}>
  //     <Text>Hello World</Text>
  //     <StatusBar style="auto" />
  //   </View>
  // );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
