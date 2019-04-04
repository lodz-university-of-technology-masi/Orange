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
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
class TestManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: [],
            positions: null,
            testNameText:"",
            testNameTextError:false,

        };
    }

    componentDidMount() {
        testService.getAll().then(tests => this.setState({ tests }));
        positionService.getAll().then(positions => this.setState({ positions }));
    }

    handleChange(positionName){

     }

     handleRemove(id){

        return;
     }

     handleEdit(id){
        // positionService.togglePosition(positionName).then(positionService.getAll().then(positions => this.setState({ positions })))
        // modife tests position
        return <Redirect to={{ pathname: '/testEditor{id}'}} />
     }

     handleAdd = (positionName) => {
        if(this.state.testNameText.length < 5){
            this.setState({testNameTextError: false})
            return
        } 
        this.setState({testNameTextError: true})
        var test = {testName: this.state.testNameText, positionName}
        testService.add(test)
        var newTests = this.state.tests
        newTests.push({name: this.state.testNameText, positon:{name:positionName}})
        this.setState({tests: newTests})
    }

    render() {
        const { tests, positions } = this.state;
        return (
            <div>
                    <List subheader={<ListSubheader><h3>Tests</h3></ListSubheader>}>
                             {tests.map(test =>
                                <ListItem key={test.id}>
                                    <ListItemText primary={test.name} secondary={test.position.name} /> 
                                    <ListItemSecondaryAction>
                                    <IconButton onClick={() =>this.handleRemove(test.name)} aria-label="Delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() =>this.handleEdit(test.name)}>
                                        <EditIcon />
                                    </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                                                        <Divider component="li" />
                            <li>
                            <Typography color="textSecondary" variant="caption">
                            Type name with at least 5 characters.
                            </Typography>
                             </li>
                            <ListItem>
                                <TextField
                                    id="standard-dense"
                                    label="Test Name"
                                    value={this.state.testNameText}
                                    onChange={this.handleTextChange}
                                    error={this.state.testNameTextError}
                                />
                                {this.state.positions && 
                                <Select
                                        defaultValue="Select Position"
                                        onChange={() => this.handleChange()}
                                        variant='outlined'
                                     >
                                     {this.state.positions.map(position =>
                                        <option key={position.id} value={position.name}>{position.name}</option>
                                     )
                                     }
                                </Select>
                                }
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() =>this.handleAdd()}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                    </List>
            </div>
        );
    }
}

export { TestManagerPage };