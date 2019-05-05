import React from 'react';

import { userService, authenticationService } from '@/_services';
import {authHeader} from "../_helpers";

class HomePage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
        };
    }

    render() {
        const { currentUser } = this.state;
        return (
            <div>
                <h1>Home</h1>
                <p>You're logged in with React & JWT!!</p>
                <p>Your role is: <strong>{currentUser.permissionName}</strong>.</p>
                <p>This page can be accessed by all authenticated users.</p>
                <div>
                    Current user from secure api end point:
                    {currentUser &&
                        <ul>
                            <li>{currentUser.firstName} {currentUser.lastName}</li>
                        </ul>
                    }
                </div>
            </div>
        );
    }
}

export { HomePage };