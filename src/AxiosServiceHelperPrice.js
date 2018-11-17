import axios from 'axios';

export const getPrices = async (
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

  const cursListResponse = await axios.get("https://api.kursna-lista.info/23c231ab48514336ad5128b5b7b3dbe6/kursna_lista/xml?fbclid=IwAR3N6BifT5aa0d-XRJ-G_8iQ95E_F1gsVXxhc5zckaM8e5KE8-N_rhJtbWo")
  const cursList = cursListResponse.data.result;
  // move to the @google-cloud-platform API!
  if (
    response.data.responses[0] &&
    response.data.responses[0].textAnnotations
  ) {
    const textAnnotations = response.data.responses[0].textAnnotations[0];

    const { description: captureText } = textAnnotations;

    try {
      const priceResponse = captureText.split(' ').map(price => Number(price.replace( /^\D+/g, '') * Number(cursList.eur.sre))).join('\n');

    } catch (ex) {
      // show the text without translation
      return captureText;
      // self.setState({

      //   captureText
      // });
    }
  }
};
