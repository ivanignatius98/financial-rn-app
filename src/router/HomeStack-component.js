import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductScreen from '../screens/ProductsScreen';
import { Text, SafeAreaView, StyleSheet, View, TextInput, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const Stack = createStackNavigator();

export default class HomeStack extends React.Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      currentPage: 'Home',
    }
    this.homescreenRef = React.createRef()

  }
  setSearchValue = (value) => {
    this.setState({
      searchValue: value
    })
  }
  setCurrentPage = (value) => {
    this.setState({
      currentPage: value
    })
  }
  onPressBack = () => {
    this.props.navigation.goBack()
  }
  HeaderComponent = ({ showBack }) => {
    return (
      <LinearGradient start={[0, 1]} end={[1, 0]} colors={['#82d9e2', '#a6e7cc']} style={styles.header}>
        {showBack && (
          <TouchableOpacity
            onPress={() => this.onPressBack()}
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image
              style={styles.searchIcon}
              source={require('../assets/icons/left-arrow.png')}
            />
          </TouchableOpacity>
        )}
        <View style={[{
          marginVertical: 10,
          marginHorizontal: 15,
          padding: 5,
          flex: 8,
          backgroundColor: 'white',
          flexDirection: 'row',
          alignItems: 'center',
          borderRadius: 5,
        }, styles.shadowProp]}>
          <Image
            style={styles.searchIcon}
            source={require('../assets/icons/search.png')}
          />
          <TextInput
            style={{
              height: 32,
              marginLeft: 10,
            }}
            placeholder="Search Ecommerce Store"
            value={this.state.searchValue}
            onChangeText={text => this.setSearchValue(text)}
            onSubmitEditing={() => this.homescreenRef.current.onSearchSubmit()}
          />
        </View>
      </LinearGradient>
    );
  };

  render() {
    return (
      <Stack.Navigator
        screenOptions={{
          // header: () => (
          // this.HeaderComponent()
          // ),
        }}>
        <Stack.Screen
          name="HomeScreen"
          options={{
            header: () => (
              this.HeaderComponent({ showBack: false })
            )
          }}>
          {() => <HomeScreen ref={this.homescreenRef} searchValue={this.state.searchValue} navigation={this.props.navigation} />}
        </Stack.Screen>
        <Stack.Screen
          component={ProductScreen}
          name="ProductDetails"
          options={{
            header: () => (
              this.HeaderComponent({ showBack: true })
            )
          }} />
      </Stack.Navigator>
    )
  }
}

const styles = StyleSheet.create({
  header: {
    // backgroundColor: '#82d9e2',
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  shadowProp: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 20,
  },
  backIcon: {
    height: 20,
    width: 20
  },
  searchIcon: {
    height: 18,
    width: 18,
    marginLeft: 6
  },
})
