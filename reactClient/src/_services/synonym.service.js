import config from 'config';
import { handleResponse } from '@/_helpers';

export const synonymService = {
    findSynonyms
};

function findSynonyms(word) {
    const requestOptions = { method: 'GET' };
    const key="YSNZffDizsYTvi2okUaO";
    return fetch(`${config.synonymDictUrl}?key=${key}&word=${word}&language=en_US&output=json`, requestOptions).then(handleResponse);
}