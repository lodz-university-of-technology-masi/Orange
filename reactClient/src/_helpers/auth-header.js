import { authenticationService } from '@/_services';

export function authHeader() {
    // return authorization header with jwt token
    const token = localStorage.getItem('Token');
    if (token) {
        return { Authorization: `${token}` };
    } else {
        return {};
    }
}