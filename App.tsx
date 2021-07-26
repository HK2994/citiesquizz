import React, { FC, useEffect, useState } from 'react';
import { StyleSheet, Text, View, Dimensions, Button } from 'react-native';
import MapView, { LatLng, Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const mapStyle = require('./json/mapStyle.json');
const capitalCities = require('./json/capitalCities.json');

const App: FC = () => {

  const [coordinates, onChangeCoordinates] = useState<LatLng>();
  const [score, onChangeScore] = useState(1500);
  const [foundCities, onChangeFoundCities] = useState(0);
  const [finished, onChangeFinished] = useState<boolean>(false);

  const calcDist = (first: {"latitude":number, "longitude":number}, second: {"latitude":number, "longitude":number}) => {

	const latitude = (first.latitude - second.latitude)
	const longitude = (first.longitude - second.longitude)

	const euclidDist = Math.sqrt(Math.pow(latitude, 2) + Math.pow(longitude, 2))

	console.log(euclidDist*111)

	// multiply by 111 in order to transform distance into the approximate kilometers
	return euclidDist * 111;
  }

  const getRandomCity = (capitols: any) => {
	
	const rndIndex = Math.floor(Math.random() * capitols["capitalCities"].length)

	return capitols["capitalCities"][rndIndex]
  }

  const reset = () => {
	onChangeScore(1500);
	onChangeFoundCities(0);
	onChangeCoordinates({"latitude": 0, "longitude": 0});
	onChangeFinished(false);
  }

  const [currentCity, onChangeCity] = useState<{"capitalCity":String, "lat":number, "long":number}>(getRandomCity(capitalCities));

  useEffect(() => {
	if (score <= 0) {
		onChangeFinished(true);
	}
  }, [score])

  return (
    <View style={styles.container}>
		{!finished ?
			<View>
				<View style={styles.info_container}>
					<Text>Select the city of: {currentCity['capitalCity']}</Text>
					<Text>Found Cities: {foundCities}</Text>
					<Text>{score}km left</Text>
				</View>
				<View>
					<MapView
						style={styles.map}
						provider={PROVIDER_GOOGLE}
						region={{
							latitude: 45.150002,
							longitude: 12,
							latitudeDelta: 50,
							longitudeDelta: 50,
						}}
						customMapStyle={mapStyle}
						onPress={(e) => {
							const coords = e.nativeEvent.coordinate;
							const capitol_coords = {"latitude": currentCity['lat'], "longitude": currentCity['long']};
							const distance = calcDist(coords, capitol_coords);

							if (distance <= 50) {
								onChangeFoundCities(foundCities + 1);
							}
							onChangeCoordinates(coords);
							onChangeCity(getRandomCity(capitalCities));
							onChangeScore(score - distance);
						}}
					>
						{coordinates &&
							<Marker coordinate={coordinates}/>
						}
					</MapView>
				</View>
			</View>
			:
			<View>
				<Text>Highscore: {foundCities} found cities</Text>
				<Button title={'Reset'} onPress={reset} />
			</View>
		}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
	flexDirection: 'column'
  },
  info_container: {
	flex: 1,
	flexDirection: 'column',
	margin: 50
  },
  map: {
	margin: 20,
	width: Dimensions.get('window').width-50,
	height: Dimensions.get('window').height-100,
  },
  marker: {
	  width: 1,
	  height: 1,
  }
});

export default App;
