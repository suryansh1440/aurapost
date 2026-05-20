import * as gptImage2 from './textToImageGPT-image-2.js';
import * as nanoBannana2 from './nano-bannana-2.js';

export const AI_MODELS = {
    GPT_IMAGE_2: 'textToImageGPT-image-2',
    NANO_BANNANA_2: 'nano-bannana-2'
};

const models = {
    [AI_MODELS.GPT_IMAGE_2]: gptImage2,
    [AI_MODELS.NANO_BANNANA_2]: nanoBannana2
};

export const getModel = (modelName) => {
    return models[modelName];
};

export default models;
