import config from 'config';
import { handleResponse, authHeader } from '@/_helpers';

export const questionAnswerService = {
    getAllAnswersByTestResolutionId
};

function getAllAnswersByTestResolutionId(id){
    const requestOptions = { method: 'GET', headers: authHeader() };
    return fetch(`${config.apiUrl}/questionAnswer/list/${id}`, requestOptions).then(handleResponse);
}

