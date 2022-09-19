import React, { useState, useEffect } from 'react';
import { Text, ScrollView, ActivityIndicator } from 'react-native';

export default class DetailsScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      searchValue: '',
      currentPage: 'Home',
    }
    this.homescreenRef = React.createRef()
  }
  componentDidMount() {

  }

  render() {
    // const { item } = this.props
    return (
      <ScrollView >
        <Text>asd</Text>
      </ScrollView>
    )
  }
}