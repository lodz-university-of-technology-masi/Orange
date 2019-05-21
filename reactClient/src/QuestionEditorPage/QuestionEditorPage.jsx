import React from 'react';
import {questionService} from "@/_services";
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import ListItem from "@material-ui/core/ListItem";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from '@material-ui/icons/Add';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import {languageService} from "@/_services/language.service";
import {questionTranslationService} from "@/_services/questionTranslation.service";

class QuestionEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: null,
            allLanguages: [],
            newContentText: '',
            newContentTextError: false,
            newSelectedLanguage: null,
            newAccessibleLanguages: [],
        };
    }

    componentDidMount() {
        if(!this.props.location.query){
            questionService.get(this.props.match.params.questionName).then(
                question => {
                    this.setQuestion(question);
                }
            );
        } else{
            const question = this.props.location.query.question;
            this.setQuestion(question);
        }
    }

    setQuestion = (question) => {
        languageService.getAll().then(allLanguages => {
            const newAccessibleLanguages = [];
            var newSelectedLanguage = null;
            allLanguages.forEach(l => {
                var shouldAdd = true;
                if (question.questionTranslations) {
                    question.questionTranslations.forEach(qt => {
                        if (qt.languageName === l.name) {
                            shouldAdd = false;
                        }
                    });
                }
                if (shouldAdd) {
                    newAccessibleLanguages.push(l);
                }
            });
            if (newAccessibleLanguages.length > 0) {
                newSelectedLanguage = newAccessibleLanguages[0].name;
            }
            this.setState({ question, allLanguages, newSelectedLanguage, newAccessibleLanguages })
        }
    )};


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
        const { question, newContentText, newSelectedLanguage } = this.state;

        if (newContentText.length < 5) {
            this.setState({newContentTextError: true});
            return;
        }

        questionTranslationService.add(
            {content: newContentText,
                languageName: newSelectedLanguage,
                questionName: question.name }).then(res => {
            console.log('successfully added')
        })
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

                        { question.questionTranslations && question.questionTranslations.length > 1 &&
                            <ListItem>
                                <Typography component="h2" variant="display3" gutterBottom
                                            style={{fontSize: '1rem'}}>
                                    Translations
                                </Typography>
                            </ListItem>
                        }

                        { question.questionTranslations && question.questionTranslations.map(qt =>
                              <ListItem key={`translation-${qt.languageName}`}>
                                  <TextField
                                      label={`Question in  ${qt.languageName}`}
                                      value={qt.content}
                                      disabled
                                      multiline
                                      style={{width: '100%'}}
                                      variant="outlined"
                                  />
                              </ListItem>
                        )}

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
                                    onChange={this.handleNewTextChange}
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
