import { authenticationService } from '@/_services';

export function authHeader() {
    // return authorization header with jwt token
    const token = localStorage.getItem('Token');
    const role = localStorage.getItem('currentUser');
    if (token && role) {
        return { Authorization: `${token}`, Role: `${role}`};
    } else {
        return {};
    }
}