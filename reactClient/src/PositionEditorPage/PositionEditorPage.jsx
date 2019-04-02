import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import { positionService } from '@/_services';


class PositionEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: [],
            positionNameText:"",
            positionNameTextError:false,
        };
    }

    componentDidMount() {
        positionService.getAll().then(positions => this.setState({ positions }));
    }

    handleTextChange = (event) => {
        this.setState({
         positionNameText: event.target.value,
        });
      };

    handleToggle = (positionName, isActive) => {
        var newPositions = this.state.positions;
        newPositions.find(x=>x.name == positionName).active = !isActive
        this.setState({positions: newPositions})
        positionService.toggle(positionName, isActive)
    }

    
    handleRemove = (positionName) => {
        var newPositions = this.state.positions;
        var index = newPositions.findIndex(x=>x.name == positionName)
        delete newPositions[index]
        this.setState({positions: newPositions})
        positionService.remove(positionName)
    }

    handleAdd = () => {
        if(this.state.positionNameText.length < 5){
            this.setState({positionNameTextError: false})
            return
        } 
        this.setState({positionNameTextError: true})
        var position = {name: this.state.positionNameText, active:true}
        positionService.add(position)
        var newPositions = this.state.positions
        newPositions.push(position)
        this.setState({positions: newPositions})
    }

    render() {
        return (
            <div>
                    <List subheader={<ListSubheader><h3>Positions</h3></ListSubheader>}>
                             {this.state.positions.map(position =>
                                <ListItem key={position.name}>
                                    <ListItemText primary={position.name} /> 
                                    <ListItemSecondaryAction>
                                        <Switch
                                        onChange={() => this.handleToggle(position.name, position.active)}
                                        checked={position.active}
                                        />
                                    <IconButton onClick={() =>this.handleRemove(position.name)} aria-label="Delete">
                                        <DeleteIcon />
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
                                    label="Position Name"
                                    value={this.state.positionNameText}
                                    onChange={this.handleTextChange}
                                    error={this.state.positionNameTextError}
                                />
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

export { PositionEditorPage };