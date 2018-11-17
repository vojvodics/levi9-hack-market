import axios from 'axios';
import packageJSON from '../package.json';

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
      });
      // console.warn(targetLanguage, translationResponse);
      return translationResponse.data.data.translations[0].translatedText;
    } catch (ex) {
      // show the text without translation
      return captureText;
      // self.setState({

      //   captureText
      // });
    }
  }
};

export const getFilteredResult = async (
  cloudVision,
  targetLanguage,
  image64,
  ingredients,
) => {
  const res = await getTranslatedText(cloudVision, targetLanguage, image64);
  return;
};
