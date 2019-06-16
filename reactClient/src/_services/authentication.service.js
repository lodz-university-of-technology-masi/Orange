import config from 'config';
import { BehaviorSubject } from 'rxjs';
import {authHeader} from '@/_helpers';


const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

function login(username, password) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    };

    return fetch(`${config.apiUrl}/login`, requestOptions)
        .then(response => {
            if(!response.ok){
                throw Error("Wrong username or password");
            }
            localStorage.setItem('Token', response.headers.get('Authorization'));
            return response.json();
        })
        .then(data => {
            localStorage.setItem('currentUser', JSON.stringify(data));
            currentUserSubject.next(data);
            return localStorage.getItem('currentUser');
        })
        .catch(error => {
            alert("Wrong username or password");
        });

    // store user details and jwt token in local storage to keep user logged in between page refreshes
}

function logout() {
    const requestOptions = {
        method: 'POST',
        headers: authHeader(),
    };
    return fetch(`${config.apiUrl}/logout`, requestOptions)
        .then(response => {
            localStorage.setItem('Token', response.headers.get('Authorization'));
            localStorage.removeItem('Token');
            localStorage.removeItem('currentUser');
            currentUserSubject.next(null);
        })
}
