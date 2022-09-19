import React from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, Animated, Dimensions } from 'react-native';
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
      page: 1,
      limit: 10,
      hasMoreProducts: true,
      moreLoading: false,
      searchLoading: false,
      initialLoading: true,
      isRefreshing: false,
    },
      this.fetchDataDebounced = AwesomeDebouncePromise(this.fetchData, 500);
  }
  componentDidMount() {
    this.fetchData()
  }
  onSearchSubmit = () => {
    this.props.navigation.push('ProductsScreen', { searchValue: this.props.searchValue })
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
  fetchData = async (page = 1, concat = false) => {
    let { products, limit } = this.state
    // const { searchValue } = this.props
    // console.log(searchValue)
    const searchValue = ''
    try {
      let hasMoreProducts = false
      this.setState({
        moreLoading: true,
      })
      let results = await fetch(`${BASE_URL}/v1/product/all?page=${page}&limit=${limit}&search=${searchValue}`)
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
    this.setState({ isRefreshing: true, }, () => { this.fetchData() })
  }
  onEndReached = () => {
    if (!this.onEndReachedCalledDuringMomentum) {
      let { page } = this.state
      const { hasMoreProducts } = this.state
      if (hasMoreProducts) {
        page++
        this.fetchData(page, true);
      }
      this.onEndReachedCalledDuringMomentum = true;
    }
  }
  detail = (item) => {
    this.props.navigation.push('DetailsScreen', { item })
  }
  render() {
    return (
      <React.Fragment>
        {this.state.searchLoading && <LoadingShimmer />}
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
        </View>
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
})