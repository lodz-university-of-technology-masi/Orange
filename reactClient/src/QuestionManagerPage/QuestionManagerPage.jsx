import React from 'react';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import TextField from '@material-ui/core/TextField';
import DeleteIcon from '@material-ui/icons/Delete';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import { questionService } from '@/_services';


class QuestionManagerPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            questions:null,
            contentText:"",
            contentTextError:false,
            selectedQuestionType:"",
            qstTypes:[{name: "OPEN"},{name: "NUMERICAL"},{name: "SCALE"},{name: "CHOICE"}],
            choices: [],
            qstTypeChoiceSelected: false,
            choiceTextError: false,
            choiceText: '',
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

    handleChoiceTextChange = (event) => {
        this.setState({
            choiceText: event.target.value,
        });
    };

    handleSelectChange = (event) => {
        const value = event.target.value;
        this.setState({
            selectedQuestionType: value,
            qstTypeChoiceSelected: value === "CHOICE",
        });
     };

    handleRemove = (name) => {
        var newData = this.state.questions;
        var index = newData.findIndex(x=>x.name == name)
        delete newData.splice(index,1)
        this.setState({questions: newData})
        questionService.remove(name)
    };

    handleEdit(question){
        this.props.history.push({pathname: `/questionEditor/${question.name}`})
    }

    handleAdd = () => {
        if(this.state.contentText.length < 5){
            this.setState({contentTextError: true})
            return
        }
        if(this.state.selectedQuestionType.length<1){
            return
        }
        if (this.state.selectedQuestionType === "CHOICE" && this.state.choices.length < 1) {
            return
        }
        this.setState({contentTextError: false})
        var qstBean = {name: this.state.contentText, content: this.state.contentText, questionType: this.state.selectedQuestionType}
        questionService.add(qstBean)
        var newData = this.state.questions
        newData.push(qstBean)
        this.setState({questions: newData, choices: []})
    };

    handleAddChoice = () => {
        if(this.state.choiceText.length < 3){
            this.setState({choiceTextError: true})
            return
        }
        const { choiceText, choices } = this.state;
        choices.push({content: choiceText});
        this.setState({ choiceText: '', choices })
    };

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
                            <IconButton onClick={() =>this.handleEdit(qst)}>
                                <EditIcon />
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

                {this.state.qstTypeChoiceSelected &&
                    <div>
                        <h5>Choices</h5>
                        {this.state.choices && this.state.choices.map(choice =>
                            <ListItem key={'choice-' + choice.content}>
                                <ListItemText primary={choice.content} />
                            </ListItem>
                        )}
                        <ListItem>
                            <TextField
                                id="choice-content"
                                label="Choice Content"
                                value={this.state.choiceText}
                                onChange={this.handleChoiceTextChange}
                                error={this.state.choiceTextError}
                                style={{marginRight: 18}}
                                variant="outlined"
                            />
                            <IconButton onClick={() =>this.handleAddChoice()}>
                                <AddIcon />
                            </IconButton>
                        </ListItem>
                    </div>
                }
            </List>
                }
    </div>
        );
    }
}

export { QuestionManagerPage };
