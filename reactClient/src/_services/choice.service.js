import config from 'config';
import { authHeader, handleResponse } from '@/_helpers';

export const choiceService = {
    create,
    update,
    remove,
};

function create(choice) {
    const requestOptions = { method: 'POST',
        headers: {...authHeader(), ...{'Content-Type': 'application/json'}},
        body: JSON.stringify(choice)
    };
    return fetch(`${config.apiUrl}/choice/create`, requestOptions).then(handleResponse);
}

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
