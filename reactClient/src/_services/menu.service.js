import config from 'config';
import { handleResponse } from '@/_helpers';
import axios from "axios";

export const menuService = {
    findSynonyms,
    wikiSearch
};

function findSynonyms(word) {
    const requestOptions = { method: 'GET' };
    const key="YSNZffDizsYTvi2okUaO";
    return fetch(`${config.synonymDictUrl}?key=${key}&word=${word}&language=en_US&output=json`, requestOptions).then(handleResponse)
}

function wikiSearch(word) {
    axios.get(`${config.wikiUrl}/w/api.php?origin=*&action=query&format=json&list=search&srsearch=${word}`)
        .then(response => {
            const pageId = response.data.query.search[0].pageid;
            window.open(`${config.wikiUrl}?curid=${pageId}`);
        })
}