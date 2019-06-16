import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const choiceService = {
    update,
    remove,
};

function update(choice) {
    const requestOptions = { method: 'PUT',
        headers: {...authHeader(), ...{'Content-Type': 'application/json'}},
        body: JSON.stringify(choice)
    };
    return fetch(`${config.apiUrl}/choice/update`, requestOptions).then(handleResponse);
}

function remove(id) {
    const requestOptions = { method: 'DELETE', headers: authHeader() };
    return fetch(`${config.apiUrl}/choice/delete/${id}`, requestOptions).then(handleResponse);
}
