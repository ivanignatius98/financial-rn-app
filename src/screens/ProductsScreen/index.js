import React from 'react';
import { Keyboard, StyleSheet, Text, View, FlatList, ActivityIndicator, Animated, Dimensions, Image, TouchableOpacity } from 'react-native';
import ProductItem from '../../components/ProductItem';
import { BASE_URL } from '../../config';
import AwesomeDebouncePromise from 'awesome-debounce-promise';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder'
import { LinearGradient } from 'expo-linear-gradient';
const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const LoadingShimmer = () => {
  return (
    <ShimmerPlaceholder
      width={Dimensions.get('window').width}
      height={6}
      shimmerColors={['orange', 'orangered', 'orangered']}
    />
  )
}
const ShimmerContent = () => {
  // Handle animation
  const avatarRef = React.createRef()
  const lines = 5
  //loop createRef
  let lineRefs = []
  const lineWidths = [160, 120, 150, 80, 130]
  for (let i = 0; i < lines; i++) {
    lineRefs.push({
      key: i,
      width: lineWidths[i],
      ref: React.createRef()
    })
  }

  React.useEffect(() => {
    let animateRefs = []
    for (let row of lineRefs) {
      animateRefs.push(row.ref.current.getAnimated())
    }
    const shimmerAnimated = Animated.stagger(
      400,
      [
        avatarRef.current.getAnimated(),
        Animated.parallel(animateRefs)
      ]
    );
    Animated.loop(shimmerAnimated).start();
  }, [])

  return (
    <View style={{ marginTop: 5 }}>

      <View style={{
        flexDirection: 'row',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginVertical: 5,
      }}>
        <ShimmerPlaceholder
          style={{ height: 150, width: 150, marginRight: 10, borderTopLeftRadius: 5, borderBottomLeftRadius: 5, }}
          stopAutoRun
          ref={avatarRef}
        />
        <View style={{ justifyContent: "flex-start", paddingVertical: 10 }}>
          {lineRefs.map(({ key, width, ref }) => (
            <ShimmerPlaceholder
              key={key}
              ref={ref}
              style={{ width, marginVertical: 5 }}
              stopAutoRun
            />
          ))}
        </View>
      </View>
    </View>
  )
}
export default class HomeScreen extends React.Component {
  constructor() {
    super();
    this.onEndReachedCalledDuringMomentum = false;
    this.state = {
      products: [],
      suggestions: [],
      page: 1,
      limit: 10,
      hasMoreProducts: true,
      moreLoading: false,
      searchLoading: false,
      initialLoading: true,
      isRefreshing: false,
      showProducts: false,
      keyboardStatus: undefined
    },
      this.fetchDataDebounced = AwesomeDebouncePromise(this.fetchItems, 500);
  }
  componentDidMount() {
    this.fetchSuggestions()
    this.keyboardDidShowSubscription = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        console.log('keyboardDidShow')
        this.setState({ keyboardStatus: 'Keyboard Shown', showProducts: false });
      },
    );
    this.keyboardDidHideSubscription = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        console.log('keyboardDidHide')
        this.setState({ keyboardStatus: 'Keyboard Hidden', showProducts: true });
      },
    );
  }
  componentWillUnmount() {
    this.keyboardDidShowSubscription.remove();
    this.keyboardDidHideSubscription.remove();
  }
  onSearchSubmit = () => {
    // console.log('search')
    // this.setState({ searchLoading: true, }, async () => { await this.fetchDataDebounced() });
  }
  ListFooter = () => {
    return (
      <View style={{ alignItems: 'center', marginVertical: 15 }}>
        {(this.state.moreLoading || this.state.hasMoreProducts) && (
          <ActivityIndicator style={styles.indicator} size="large" color="white" />
        )}
      </View>
    )
  }
  ListHeader = () => {
    return (
      <View style={styles.headerFooterStyle}>
        {!this.state.initialLoading && (
          <Text style={styles.textStyle}>RESULTS</Text>
        )}
      </View>
    );
  }
  fetchSuggestions = async () => {
    const { searchValue } = this.props.searchValue
    // get suggestions
    this.setState({
      suggestions: [
        { _id: '123', title: 'gateron' },
        { _id: '222', title: 'keychron' }
      ]
    })
  }
  fetchItems = async (page = 1, concat = false) => {
    let { products, limit } = this.state
    const { searchValue } = this.props
    try {
      let hasMoreProducts = false
      this.setState({
        moreLoading: true,
      })
      let results = await fetch(`${BASE_URL}/v1/product/all?page=${page}&limit=${limit}&search=${searchValue}`)
      console.log(`${BASE_URL}/v1/product/all?page=${page}&limit=${limit}&search=${searchValue}`)
      const json = await results.json();
      this.setState({
        moreLoading: false,
        initialLoading: false,
        isRefreshing: false,
        searchLoading: false
      })

      if (json.data.records.length > 0) {
        if (json.data.records.length == limit) {
          hasMoreProducts = true
        }
        if (concat) {
          products = products.concat(json.data.records)
        } else {
          products = json.data.records
        }
      } else {
        if (page == 1) {
          products = []
        }
      }

      this.setState({
        products,
        hasMoreProducts,
        page,
      })
    } catch (error) {
      console.error(error);
    }
  }
  onRefresh() {
    this.setState({ isRefreshing: true, }, () => { this.fetchItems() })
  }
  onEndReached = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      let { page } = this.state
      const { hasMoreProducts } = this.state
      if (hasMoreProducts) {
        page++
        this.fetchItems(page, true);
      }
      this.onEndReachedCalledDuringMomentum = true;
    }
  }
  detail = (item) => {
    this.props.navigation.push('ProductDetails', { item })
  }
  onSearchItemPress = async (itemSearch) => {
    await this.props.setSearchValue(itemSearch)
    this.setState({ searchLoading: true, showProducts: true }, async () => {
      await this.fetchDataDebounced()
    });
  }
  deleteSearchItemHistory = () => {
    // delete history api hit
  }
  render() {
    return (
      <React.Fragment>
        {this.state.showProducts && this.state.searchLoading && <LoadingShimmer />}
        {this.state.showProducts &&
          <View style={styles.container}>
            {this.state.initialLoading && (
              [0, 0, 0, 0, 0].map((el, i) => (
                <ShimmerContent key={i} />
              ))
            )}
            <FlatList
              style={styles.shadowProp}
              data={this.state.products}
              ListHeaderComponent={this.ListHeader}
              ListFooterComponent={this.ListFooter}
              renderItem={({ item }) => <ProductItem item={item} onPress={this.detail} />}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              onEndReached={this.onEndReached.bind(this)}
              onEndReachedThreshold={0}
              onMomentumScrollBegin={() => { this.onEndReachedCalledDuringMomentum = false }}
              onRefresh={() => this.onRefresh()}
              refreshing={this.state.isRefreshing}
            />
          </View>}
        {!this.state.showProducts &&
          this.state.suggestions.map((row) => (<TouchableOpacity
            onPress={() => {
              this.onSearchItemPress(row.title)
            }}
            style={{
              flexDirection: 'row',
              height: 48,
              justifyContent: "center",
              borderBottomWidth: 0.5,
              borderColor: '#dfdfdf'
            }}>
            <TouchableOpacity
              onPress={() => {
                this.deleteSearchItemHistory()
              }}
              style={{ flex: 2, justifyContent: 'center', alignItems: "center" }}>
              <Image
                style={styles.icons}
                source={require('../../assets/icons/close.png')}
              />
            </TouchableOpacity>
            <View style={{ flex: 9, justifyContent: 'center' }}>
              <Text style={{ color: '#0e0d78' }}>{row.title}</Text>
            </View>
            <TouchableOpacity
              onPress={() => {
                this.props.setSearchValue(row.title)
              }}
              style={{ flex: 1, justifyContent: 'center', alignItems: "center", marginRight: 14 }}>
              <Image
                style={styles.icons}
                source={require('../../assets/icons/top-left.png')}
              />
            </TouchableOpacity>
          </TouchableOpacity>
          ))}

      </React.Fragment>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    flex: 1,
    backgroundColor: '#ffcfcf'
  },
  headerFooterStyle: {
    fontSize: 20,
    fontWeight: '900',
    paddingTop: 10
  },
  linearGradient: {
    flex: 1,
    paddingHorizontal: 15,
    borderRadius: 5
  },
  indicator: {
    borderColor: 'rgba(0, 0, 0, 0)',
    borderWidth: 4.7,
    backgroundColor: '#d5dbdb',
    height: 34,
    width: 34,
    borderRadius: 17
  },
  shadowProp: {
    shadowColor: '#171717',
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  icons: {
    height: 14,
    width: 14,
  },
})