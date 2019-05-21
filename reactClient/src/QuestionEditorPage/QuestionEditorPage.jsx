import React from 'react';
import {questionService} from "@/_services";
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";

class QuestionEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: null,
            newContentText: null,
            newContentTextError: null,
            newSelectedLanguage: null,
            newAccessibleLanguages: [],
        };
    }

    componentDidMount() {
        if(!this.props.location.query){
            questionService.get(this.props.match.params.questionName).then(
                question => this.setState({ question })
            );
        } else{
            this.setState({question: this.props.location.query.question});
        }
    }


    handleNewTextChange = (event) => {
        this.setState({
            newContentText: event.target.value,
        });
    };

    handleNewSelectChange = (event) => {
        this.setState({
            newSelectedLanguage: event.target.value,
        });
    };

    handleAdd = () => {
        console.log('handle add')
    };

    render() {
        const {question,
            newContentText, newContentTextError, newSelectedLanguage, newAccessibleLanguages} = this.state;
        return (
            <div>
                {(question) &&
                    <div><List subheader={<ListSubheader disableSticky><h3>{question.name}</h3></ListSubheader>}>
                        <ListItem>
                            <TextField
                                label="Question in english"
                                value={question.content}
                                disabled
                                multiline
                                style={{width: '100%'}}
                                variant="outlined"
                            />
                        </ListItem>
                        <ListItem>
                            <Typography component="h2" variant="display3" gutterBottom
                                        style={{fontSize: '1rem'}}>
                                Translations
                            </Typography>
                        </ListItem>

                        {newAccessibleLanguages.length > 0 &&
                            <ListItem>
                                <Typography component="h2" variant="display3" gutterBottom
                                            style={{fontSize: '1rem'}}>
                                    Add Translation
                                </Typography>
                            </ListItem>
                        }
                        { newAccessibleLanguages.length > 0 &&
                            <ListItem>
                                <TextField
                                    id="standard-dense"
                                    label="Question Content"
                                    value={newContentText}
                                    onChange={this.handleTextChange}
                                    error={newContentTextError}
                                    style={{marginRight: 18}}
                                    variant="outlined"
                                />
                                <Select
                                    value={newSelectedLanguage}
                                    onChange={this.handleNewSelectChange}
                                    input={<OutlinedInput labelWidth={0}/>}
                                    style={{width: '30%'}}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        Select Question Type
                                    </MenuItem>
                                    {newAccessibleLanguages.map(l =>
                                        <MenuItem key={l.name} value={l.name}>{l.name}</MenuItem>
                                    )}
                                </Select>
                                <ListItemSecondaryAction>
                                    <IconButton onClick={() =>this.handleAdd()}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        }
                    </List></div>

                }
            </div>
        );
    }
}

export { QuestionEditorPage };
