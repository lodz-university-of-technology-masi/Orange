import React from 'react';

import { userService, authenticationService, editorService } from '@/_services';
import ListItemText from "@material-ui/core/es/ListItemText/ListItemText";
import ListItem from "@material-ui/core/es/ListItem/ListItem";
import List from "@material-ui/core/es/List/List";
import IconButton from "@material-ui/core/es/IconButton/IconButton";
import ListItemSecondaryAction from "@material-ui/core/es/ListItemSecondaryAction/ListItemSecondaryAction";
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ListSubheader from "@material-ui/core/es/ListSubheader/ListSubheader";

class EditorManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            editorsFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        this.refresh()
    }

    refresh() {
        editorService.getAll().then( editorsFromApi => this.setState({ editorsFromApi }));
    }

    handleEdit = (username) => {
        this.props.history.push(`/editorForm/${username}`);
    };

    handleRemove = (username) => {
        editorService.remove(username).then(() => { this.refresh() })
    };

    render() {
        const { editorsFromApi } = this.state;

            if (editorsFromApi !== null) {
                return (
                    <div>
                        <List subheader={<ListSubheader disableSticky><h3>Editors</h3></ListSubheader>}>
                            {editorsFromApi.map((editor) => (
                                <ListItem key={`Editor${editor.username}`}>
                                    <ListItemText primary={editor.username}
                                                  secondary={`${editor.firstName} ${editor.lastName}`} />
                                    <ListItemSecondaryAction>
                                        <IconButton onClick={() =>this.handleEdit(editor.username)}>
                                            <EditIcon />
                                        </IconButton>
                                        <IconButton onClick={() =>this.handleRemove(editor.username)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                )
            } else {
               return null
            }
    }
}

export { EditorManagerPage };
