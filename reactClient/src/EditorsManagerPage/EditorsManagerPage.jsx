import React from 'react';

import { userService, authenticationService, editorService } from '@/_services';

class EditorsManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            editorsFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
        editorService.getAll().then( editorsFromApi => this.setState({ editorsFromApi }));
    }

    render() {
        const { editorsFromApi } = this.state;

            if (editorsFromApi !== null) {
                return (
                    <ul>
                        {editorsFromApi.map(function(object, i){
                            return <li key={ "editorRow" + i }>{object.username}</li>
                        })}
                    </ul>
                )
            } else {
               return null
            }
    }
}

export { EditorsManagerPage };