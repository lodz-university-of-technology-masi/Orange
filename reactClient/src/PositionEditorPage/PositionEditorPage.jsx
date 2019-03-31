import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';

import { positionService } from '@/_services';


class PositionEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: [
                {name: "Junior React Developer", isActive: true},
                {name: "Mid React Developer", isActive: false},
                {name: "Senior React Developer", isActive: false},
                {name: "Junior Jave Developer", isActive: false},
                {name: "Mid Java Developer", isActive: true},
                {name: "Senior Java Developer", isActive: false},
            ]
        };
    }

    componentDidMount() {
        //positionService.getAll().then(positions => this.setState({ positions }));
    }

    

    handleToggle(positionName) {
       // positionService.togglePosition(positionName).then(positionService.getAll().then(positions => this.setState({ positions })))
    }

    render() {
        const { positions } = this.state;
        return (
            <div>
                    <List subheader={<ListSubheader>Positions</ListSubheader>}>
                             {positions.map(position =>
                                <ListItem key={position.name}>
                                    <ListItemText primary={position.name} /> 
                                    <ListItemSecondaryAction>
                                        <Switch
                                        onChange={this.handleToggle(position.name)}
                                        checked={position.isActive}
                                        />
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                    </List>
            </div>
        );
    }
}

export { PositionEditorPage };