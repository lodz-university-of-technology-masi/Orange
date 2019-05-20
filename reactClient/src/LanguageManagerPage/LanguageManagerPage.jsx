import React from 'react';

import List from '@material-ui/core/List';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from "@material-ui/core/ListItem";


class LanguageManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            languages: null
        };
    }

    componentDidMount() {
        // questionService.getAll().then(questions => this.setState({ questions }));
    }

    render() {
        return (
            <div>
                <List subheader={<ListSubheader disableSticky><h3>Languages</h3></ListSubheader>}>
                    <ListItem key="default">
                        <ListItemText primary={'English'}
                                      secondary={'This language is always used as default and cannot be removed.'} />
                    </ListItem>
                </List>
            </div>
        );
    }
}

export { LanguageManagerPage };
