import React, { useState, useRef } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ProductsScreen from '../screens/ProductsScreen';
import DetailsScreen from '../screens/DetailsScreen';
import { Text, SafeAreaView, StyleSheet, View, TextInput, Image, TouchableOpacity, TouchableHighlight } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Stack = createStackNavigator();

const SearchHeaderComponent = ({ searchValue, setSearchValue, onPressBack, onSubmit }) => {
  return (
    <LinearGradient start={[0, 1]} end={[1, 0]} colors={['#82d9e2', '#a6e7cc']} style={styles.header}>
      <TouchableOpacity
        onPress={() => { onPressBack() }}
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
          value={searchValue}
          onChangeText={setSearchValue}
          onSubmitEditing={onSubmit}
        />
      </View>
    </LinearGradient>
  );
}

const HeaderComponent = ({ pushProductsScreen }) => {
  return (
    <LinearGradient start={[0, 1]} end={[1, 0]} colors={['#82d9e2', '#a6e7cc']} style={styles.header}>
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
        <TouchableOpacity
          onPress={pushProductsScreen}
          style={{
            height: 32,
            marginLeft: 10,
            alignItems: 'center',
            justifyContent: 'center'
          }}>
          <Text style={{ color: '#9e9e9e' }}>Search Ecommerce Store</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}
const HomeStack = () => {
  const [searchValue, setSearchValue] = useState('')
  const [productSearchStack, setproductSearchStack] = useState([])
  const homescreenRef = useRef()
  const navigation = useNavigation()

  const onPressBack = () => {
    const temp = productSearchStack
    temp.pop()
    setSearchValue(temp[temp.length - 1])
    setproductSearchStack(temp)
    navigation.goBack()
  }
  const onSubmit = () => {
    const temp = productSearchStack
    temp.push(searchValue)
    setproductSearchStack(temp)
    navigation.push('ProductsScreen', { searchValue })
  }
  const pushProductsScreen = () => {
    setSearchValue('')
    navigation.push('ProductsScreen', { searchValue: '' })
  }

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="HomeScreen"
        options={{
          header: () => (
            <HeaderComponent pushProductsScreen={pushProductsScreen} />
          )
        }}>
        {() => <HomeScreen ref={homescreenRef} navigation={navigation} />}
      </Stack.Screen>
      <Stack.Screen
        name="ProductsScreen"
        options={{
          header: () => (
            <SearchHeaderComponent
              onSubmit={onSubmit} onPressBack={onPressBack} searchValue={searchValue} setSearchValue={setSearchValue}
            />
          )
        }}>
        {() => <ProductsScreen searchValue={searchValue} setSearchValue={setSearchValue} />}
      </Stack.Screen>
      <Stack.Screen
        component={DetailsScreen}
        name="DetailsScreen"
        options={{
          header: () => (
            <SearchHeaderComponent
              onSubmit={onSubmit} onPressBack={onPressBack} searchValue={searchValue} setSearchValue={setSearchValue}
            />
          )
        }} />
    </Stack.Navigator >
  )
}

export default HomeStack

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
