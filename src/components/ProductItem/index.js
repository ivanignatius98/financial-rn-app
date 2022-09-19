import { Text, View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import styles from './styles';

const ProductItem = ({ item, onPress }) => {
  // parse price to string
  const priceString = String((Math.round(item.price * 100) / 100).toFixed(2))
  const pricePartitions = priceString.split('.')
  const oldPriceString = String((Math.round(item.price * 100) / 100).toFixed(2))

  const star = require('../../assets/icons/star.png')
  const starEmpty = require('../../assets/icons/star-o.png')

  return (
    <TouchableOpacity onPress={() => onPress(item)} style={styles.root}>
      <Image style={styles.image} source={{ uri: item.cover }} />
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={3}>
          {item.title}
        </Text>
        {/* ratings */}
        <View style={styles.ratingsContainer}>
          {[0, 0, 0, 0, 0].map((el, i) =>
            <Image
              key={`${item._id}-${i}`}
              style={styles.star}
              source={i < Math.floor(item.avgRating) ? star : starEmpty}
            />
          )}
          <Text style={{ fontSize: 12, paddingBottom: 2, paddingLeft: 2 }}>{item.ratings}</Text>
        </View>
        {/* price */}
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
            <Text style={{ fontSize: 9, lineHeight: 24, marginLeft: -1 }}>$</Text>
            <Text style={{ fontSize: 18, lineHeight: 30 }}>{pricePartitions[0]}</Text>
            <Text style={{ fontSize: 10, lineHeight: 24, marginLeft: 1 }}>{pricePartitions[1]}</Text>
          </View>
          <View style={{ marginLeft: 4, paddingTop: 4 }}>
            {item.oldPrice && (
              <Text style={styles.oldPrice}> ${oldPriceString}</Text>
            )}
          </View>
        </View>

        {/* stock */}
        {item.stock <= 10 && (
          <Text style={{ fontSize: 10, color: 'red' }}>Only {item.stock} left in stock - order soon.</Text>
        )}
      </View>
    </TouchableOpacity >
  )
}

export default ProductItem;
