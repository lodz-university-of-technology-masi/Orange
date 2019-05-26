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
import { Redirect,hashHistory, Link } from 'react-router-dom';
import { positionService, testService } from '@/_services';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';

class TestManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            tests: [],
            positions: null,
            testNameText:"",
            testNameTextError:false,
            selectedPosition:""

        };
    }

    componentDidMount() {
        testService.getAll().then(tests => this.setState({ tests }));
        positionService.getAll().then(positions => this.setState({ positions }));
    }

    handleSelectChange = (event) => {
        this.setState({
            selectedPosition: event.target.value,
           });
     }

    handleTextChange = (event) => {
        this.setState({
            testNameText: event.target.value,
        });
      };

     handleRemove(testName){
        var newTests = this.state.tests;
        var index = newTests.findIndex(x=>x.name == testName)
        newTests.splice(index,1)
        this.setState({tests: newTests})
        testService.remove(testName)
     }

     handleEdit(test){
        this.props.history.push({pathname: `/testEditor/${test.name}`, query: {test}})
     } 

     handleAdd = () => {
        if(this.state.testNameText.length < 5){
            this.setState({testNameTextError: true})
            return
        }
        if(this.state.selectedPosition.length<1){
            return
        }
        this.setState({testNameTextError: false})
        var test = {testName: this.state.testNameText, positionName: this.state.selectedPosition, creatorUsername: JSON.parse(localStorage.getItem("currentUser")).username}

        testService.add(test)


        var newTests = this.state.tests
        var testToAdd = {name: this.state.testNameText, position:{name:this.state.selectedPosition}}
        console.log(testToAdd)
        newTests.push(testToAdd)
        this.setState({tests: newTests})
    }

    render() {
        return (
            <div>
                    <List subheader={<ListSubheader  disableSticky><h3>Tests</h3></ListSubheader>}>
                             {this.state.tests && this.state.tests.map(test =>
                                <ListItem key={test.name}>
                                    <ListItemText primary={test.name} secondary={test.position && test.position.name} /> 
                                    <ListItemSecondaryAction>
                                    <IconButton onClick={() =>this.handleRemove(test.name)} aria-label="Delete">
                                        <DeleteIcon />
                                    </IconButton>
                                    <IconButton onClick={() =>this.handleEdit(test)}>
                                        <EditIcon />
                                    </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                            <Divider component="li" />
                            <li>
                             </li>
                            <ListItem>
                            <div style={{display: 'flex',justifyContent: 'space-between', flexWrap: 'wrap'}}>
                                <TextField
                                    id="standard-dense"
                                    label="Test Name"
                                    value={this.state.testNameText}
                                    onChange={this.handleTextChange}
                                    error={this.state.testNameTextError}
                                    style={{marginRight: 18}}
                                    variant="outlined"
                                />
                                {this.state.positions && 
                                <Select
                                        value={this.state.selectedPosition}
                                        onChange={this.handleSelectChange}
                                        input={<OutlinedInput labelWidth={0}/>}
                                        displayEmpty
                                     >
                                    <MenuItem value="" disabled>
                                     Select Position
                                    </MenuItem>
                                     {this.state.positions.map(position =>
                                        <MenuItem key={position.id} value={position.name}>{position.name}</MenuItem>
                                     )
                                     }
                                </Select>
                                }
                            </div>    
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
