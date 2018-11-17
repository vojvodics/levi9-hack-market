import React, { Component } from 'react';
import { View, Picker, Button, Switch, Text } from 'react-native';
import { getTranslatedText, getFilteredResult } from './AxiosServiceHelper';
import { getPrices } from './AxiosServiceHelperPrice';
import Camera from './Camera';
import Response from './Response';

export const languages = [
  { label: 'English', value: 'en' },
  { label: 'Serbian', value: 'rs' },
  { label: 'German', value: 'de' },
];

export const ingredients = [
  { name: 'Corn' },
  { name: 'Eggs' },
  { name: 'Hazelnut' },
  { name: 'Meat' },
  { name: 'Milk' },
  { name: 'Penaut' },
  { name: 'Soya' },
  { name: 'Water' },
];

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'en',
      ingredients,
      languages,
      renderScreen: 'main',
      stopCamera: false,
    };
  }
  lookByPrice = () => {
    this.setState({ renderScreen: 'camera', captureText: '' });
    this.intervalId = setInterval(() => this.takePicture(true), 1000);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  lookForIngredients = () => {
    this.setState({ renderScreen: 'camera', captureText: '' });
    this.intervalId = setInterval(() => this.takePicture(), 1000);
  };

  changeIngredient = ({ name, checked }) => {
    this.setState(prevState => {
      const ing = prevState.ingredients;
      const x = ing.find(({ name: n }) => n === name);
      x.checked = !x.checked;
      const newList = [
        x,
        ...prevState.ingredients.filter(({ name: n }) => n !== name),
      ];
      newList.sort((a, b) => a.name.localeCompare(b.name));
      return {
        ingredients: newList,
      };
    });
  };

  takePicture = async (isX = false) => {
    if (this.camera && !this.state.stopCamera) {
      const image64 = await this.camera.capture();
      let captureText;
      if (isX) {
        captureText = await getPrices(this.state.language, image64);
      } else {
        captureText = await getFilteredResult(
          this.state.language,
          image64,
          this.state.ingredients
            .filter(x => x.checked)
            .map(({ name }) => name.toLowerCase()),
        );
      }

      if (captureText && !this.state.stopCamera) {
        this.setState({ captureText });
      }
    }
  };

  render() {
    if (this.state.renderScreen === 'camera') {
      return (
        <Camera
          setCam={cam => {
            this.camera = cam;
          }}
        >
          <Button
            onPress={() => {
              this.setState(prevState => ({
                stopCamera: !prevState.stopCamera,
              }));
            }}
            title={this.state.stopCamera ? 'Search again' : 'Capture'}
            color="#841584"
          />

          <Button
            onPress={() => {
              this.setState({ renderScreen: 'main' });
              clearInterval(this.intervalId);
            }}
            title="back"
            color="#841584"
          />
          <Response>
            {!this.state.done && (
              <Text
                style={{
                  elevation: 1,
                  fontSize: 24,
                  fontWeight: 'bold',
                  textAlign: 'center',
                  color: 'yellow',
                }}
              >
                {this.state.captureText || ''}
              </Text>
            )}
          </Response>
        </Camera>
      );
    }
    return (
      this.state.renderScreen === 'main' && (
        <View style={{ flex: 1, justifyContent: 'space-between' }}>
          <Picker
            selectedValue={this.state.language}
            style={{ height: 50, width: 300 }}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ language: itemValue })
            }
          >
            {this.state.languages.map(({ label, value }) => (
              <Picker.Item key={label} label={label} value={value} />
            ))}
          </Picker>
          <Button
            onPress={this.lookByPrice}
            title="Loook by price"
            color="#841584"
          />
          <Button
            onPress={this.lookForIngredients}
            title="Loook for ingredients"
            color="#841584"
          />
          <View>
            {this.state.ingredients.map(cb => (
              <View key={cb.name}>
                <Text>{cb.name}</Text>
                <Switch
                  value={cb.checked || false}
                  onValueChange={() => this.changeIngredient(cb)}
                />
              </View>
            ))}
          </View>
        </View>
      )
    );
  }
}

export default MainScreen;
