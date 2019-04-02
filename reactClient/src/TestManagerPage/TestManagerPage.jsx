import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';
import IconButton from '@material-ui/core/IconButton';
import Select from '@material-ui/core/Select';
import { Redirect } from 'react-router-dom';
import { positionService, testService } from '@/_services';

class TestManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: [],
            positions: []
        };
    }

    componentDidMount() {
        testService.getAll().then(tests => this.setState({ tests }));
        positionService.getAll().then(positions => this.setState({ positions }));
    }

    handleChange(positionName){
        // positionService.togglePosition(positionName).then(positionService.getAll().then(positions => this.setState({ positions })))
        // modife tests position
     }

     handleRemove(id){
        // positionService.togglePosition(positionName).then(positionService.getAll().then(positions => this.setState({ positions })))
        // modife tests position
        return;
     }

     handleEdit(id){
        // positionService.togglePosition(positionName).then(positionService.getAll().then(positions => this.setState({ positions })))
        // modife tests position
        return <Redirect to={{ pathname: '/testEditor{id}'}} />
     }

    render() {
        const { tests, positions } = this.state;
        return (
            <div>
                    <List subheader={<ListSubheader>Tests</ListSubheader>}>
                             {tests.map(test =>
                                <ListItem key={test.id}>
                                    <ListItemText primary={test.name} /> 
                                    <ListItemSecondaryAction>
                                    <Select
                                        native
                                        value={test.position}
                                        onChange={() => this.handleChange('position')}
                                        inputProps={{
                                        name: 'name',
                                        id: 'age-native-simple',
                                        }}
                                     >
                                     {positions.map(position =>
                                        <option key={position.id} value={position.name}>{position.name}</option>
                                     )
                                     }
                                    </Select>
                                    <IconButton onClick={() =>this.handleRemove('position')} aria-label="Delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() =>this.handleEdit('position')}>
                                        <EditIcon />
                                    </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                                
                            )}
                    </List>
            </div>
        );
    }
}

export { TestManagerPage };