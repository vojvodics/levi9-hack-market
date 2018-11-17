import React from 'react';

import axios from 'axios';
import packageJSON from '../package.json';
import { Text } from 'react-native';

const cloudVision = `https://vision.googleapis.com/v1/images:annotate?key=${
  packageJSON.cloudAPI
}`;
const translateApi = `https://translation.googleapis.com/language/translate/v2?key=${
  packageJSON.cloudAPI
}`;

export const getTranslatedText = async (targetLanguage, image64) => {
  const response = await axios.post(cloudVision, {
    requests: [
      {
        image: {
          content: image64.data,
        },
        features: [
          {
            type: 'TEXT_DETECTION',
            maxResults: 1,
          },
        ],
      },
    ],
  });

  // move to the @google-cloud-platform API!
  if (
    response.data.responses[0] &&
    response.data.responses[0].textAnnotations
  ) {
    const textAnnotations = response.data.responses[0].textAnnotations[0];

    const { description: captureText } = textAnnotations;

    try {
      const translationResponse = await axios.post(translateApi, {
        q: captureText,
        target: targetLanguage,
        cloudVision,
      });
      // console.warn(targetLanguage, translationResponse);
      return translationResponse.data.data.translations[0].translatedText;
    } catch (ex) {
      // show the text without translation
      return '';
      // self.setState({

      //   captureText
      // });
    }
  }
};

export const getFilteredResult = async (
  targetLanguage,
  image64,
  ingredients,
) => {
  const res = await getTranslatedText(targetLanguage, image64);
  if (res) {
    const result = res.split(' ');
    return result.map((x, i) => (
      <Text
        key={x + i}
        style={{
          color: ingredients.includes(x.toLowerCase()) ? 'red' : 'white',
        }}
      >
        {x}{' '}
      </Text>
    ));
  }
  return '';
};
