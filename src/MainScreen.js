import React, { Component } from 'react';
import { View, Picker, Button, Switch, Text } from 'react-native';
import { getTranslatedText } from './AxiosServiceHelper';
import Camera from './Camera';
import Response from './Response';

export const languages = [
  { label: 'English', value: 'en' },
  { label: 'Serbian', value: 'rs' },
  { label: 'German', value: 'de' },
];

export const ingredients = [
  { name: 'Eggs' },
  { name: 'Hazelnuts' },
  { name: 'Meat' },
  { name: 'Milk' },
];

class MainScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      language: 'en',
      ingredients,
      languages,
      renderScreen: 'main',
    };
  }
  lookByPrice = () => {
    this.setState({ renderScreen: 'camera' });
    this.intervalId = setInterval(() => this.takePicture(), 1000);
  };

  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  lookForIngredients = () => {
    this.setState({ renderScreen: 'camera' });
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

  takePicture = async () => {
    if (this.camera) {
      const image64 = await this.camera.capture();
      const captureText = await getTranslatedText(this.state.language, image64);

      if (!this.state.done) {
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
