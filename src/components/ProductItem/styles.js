import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginHorizontal: 2,
    marginVertical: 8,

    // shadows - ios
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // android
    elevation: 5,
  },
  image: {
    flex: 3,
    height: 150,
    resizeMode: 'cover',
    borderTopLeftRadius: 5,
    borderBottomLeftRadius: 5,
  },
  content: {
    flex: 4,
    padding: 10,
  },
  title: {
    fontSize: 14,
  },
  ratingsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginVertical: 5,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  oldPrice: {
    fontSize: 11,
    fontWeight: 'normal',
    textDecorationLine: 'line-through',
  },
  star: {
    width: 18,
    height: 18,
  },
})

export default styles