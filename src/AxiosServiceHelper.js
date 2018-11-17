import axios from 'axios';

export const getTranslatedText = async (
  cloudVision,
  targetLanguage,
  image64,
) => {
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
        target: self.state.targetLanguage,
      });
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
