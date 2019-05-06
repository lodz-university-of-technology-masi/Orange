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
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { positionService, questionService } from '@/_services';


class QuestionManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions:null,
            contentText:"",
            contentTextError:false,
            selectedQuestionType:"",
            qstTypes:[{name: "OPEN"},{name: "NUMERICAL"},{name: "SCALE"}],
        };
    }

    componentDidMount() {
        questionService.getAll().then(questions => this.setState({ questions }));
        //questionService.getAllTypes().then(qstTypes => this.setState({ qstTypes }));
    }

    handleTextChange = (event) => {
        this.setState({
         contentText: event.target.value,
        });
      };

    handleSelectChange = (event) => {
        this.setState({
            selectedQuestionType: event.target.value,
           });
           console.log(this.state.selectedQuestionType)

     }

    handleRemove = (name) => {
        var newData = this.state.questions;
        var index = newData.findIndex(x=>x.name == name)
        delete newData.splice(index,1)
        this.setState({questions: newData})
        questionService.remove(name)
    }

    handleAdd = () => {
        if(this.state.contentText.length < 5){
            this.setState({contentTextError: true})
            return
        } 
        if(this.state.selectedQuestionType.length<1){
            return
        }
        this.setState({contentTextError: false})
        var qstBean = {name: this.state.contentText, content: this.state.contentText, questionType: this.state.selectedQuestionType}
        questionService.add(qstBean)
        var newData = this.state.questions
        newData.push(qstBean)
        this.setState({questions: newData})
    }
    render() {
        return (
            <div>
                {this.state.questions &&
            <List subheader={<ListSubheader disableSticky><h3>Questions</h3></ListSubheader>}>
                     {this.state.questions.map(qst =>
                        <ListItem key={qst.name}>
                            <ListItemText primary={qst.content} secondary={qst.questionType} /> 
                            <ListItemSecondaryAction>
                            <IconButton onClick={() =>this.handleRemove(qst.name)} aria-label="Delete">
                                <DeleteIcon />
                            </IconButton>
                            </ListItemSecondaryAction>
                        </ListItem>
                    )}
                    <Divider component="li" />
                    <li>
                    <Typography color="textSecondary" variant="caption">
                    Type content with at least 5 characters.
                    </Typography>
                     </li>
                    <ListItem>
                        <TextField
                            id="standard-dense"
                            label="Question Content"
                            value={this.state.contentText}
                            onChange={this.handleTextChange}
                            error={this.state.contentTextError}
                            style={{marginRight: 18}}
                            variant="outlined"
                        />
                         {this.state.qstTypes && 
                                <Select
                                        value={this.state.selectedQuestionType}
                                        onChange={this.handleSelectChange}
                                        input={<OutlinedInput labelWidth={0}/>}
                                        displayEmpty
                                     >
                                    <MenuItem value="" disabled>
                                     Select Question Type
                                    </MenuItem>
                                     {this.state.qstTypes.map(qstType =>
                                        <MenuItem key={qstType.name} value={qstType.name}>{qstType.name}</MenuItem>
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
                }
    </div>
        );
    }
}

export { QuestionManagerPage };