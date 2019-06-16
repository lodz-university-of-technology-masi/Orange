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
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';

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
            editEnglishBase: false,
            editedTranslationLangName: null,
            editedChoiceId: null,
        };
    }

    componentDidMount() {
        questionService.get(this.props.match.params.questionName).then(
            question => {
                this.setQuestion(question);
                console.log(question)
            }
        );
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

        const newTranslation = {
            content: newContentText,
            languageName: newSelectedLanguage,
            questionName: question.name
        };

        questionTranslationService.add(newTranslation).then(res => {
            if (!question.questionTranslations) {
                question.questionTranslations = [];
            }
            question.questionTranslations.push(newTranslation);
            this.setQuestion(question);
        })
    };

    handleEnglishBaseChange = (event) => {
        const { question } = this.state;
        question.content = event.target.value;
        this.setQuestion(question);
    };

    handleEditEnglishBase = () => {
        this.setState({editEnglishBase: true})
    };

    handleSubmitEditEnglishBase = () => {
        const { question } = this.state;
        questionService.update({name: question.name, content: question.content}).then(res => {
            this.setState({editEnglishBase: false})
        });
    };

    handleTranslationChange = (event, translation) => {
        const { question } = this.state;
        question.questionTranslations.forEach(qt => {
            if(qt.languageName === translation.languageName) {
                qt.content = event.target.value;
            }
        });
        this.setQuestion(question);
    };

    handleEditTranslation = (translation) => {
        this.setState({ editedTranslationLangName: translation.languageName });
    };

    handleSubmitEditTranslation = (translation) => {
        const { question } = this.state;
        translation.questionName = question.name;
         questionTranslationService.update(translation).then(res => {
            this.setState({ editedTranslationLangName: null });
        });
    };

    handleEditChoice = (editedChoiceId) => {
        this.setState({editedChoiceId})
    };

    handleEnglishChoiceChange = (event, choiceId) => {
        const { question } = this.state;
        question.choices.forEach(ch => {
            if (ch.id === choiceId) {
                ch.content = event.target.value;
            }
        });
        this.setQuestion(question);
    };

    handleSubmitEditEnglishChoice = () => {
        this.setState({editedChoiceId: null})
    };

    render() {
        const {question, editEnglishBase, editedTranslationLangName,
            newContentText, newContentTextError, newSelectedLanguage, newAccessibleLanguages,
            editedChoiceId,
             } = this.state;
        const sthEdited = (editEnglishBase || editedTranslationLangName !== null);
        return (
            <div>
                {(question) &&
                    <div><List subheader={<ListSubheader disableSticky><h3>{question.name}</h3></ListSubheader>}>
                        <ListItem>
                            <TextField
                                label="Question in english"
                                value={question.content}
                                disabled={!editEnglishBase}
                                onChange={this.handleEnglishBaseChange}
                                multiline
                                style={{width: '100%'}}
                                variant="outlined"
                            />
                            { !editEnglishBase && !sthEdited &&
                                <IconButton onClick={() =>this.handleEditEnglishBase()}>
                                    <EditIcon />
                                </IconButton>
                            }
                            { editEnglishBase &&
                                <IconButton onClick={() =>this.handleSubmitEditEnglishBase()}>
                                    <DoneIcon />
                                </IconButton>
                            }
                        </ListItem>


                        { question.questionType === 'CHOICE' && question.choices && question.choices.length > 0 &&
                            <div>
                                <ListItem>
                                    <Typography component="h2" variant="display3" gutterBottom
                                                style={{fontSize: '1rem'}}>
                                        Choices in english
                                    </Typography>
                                </ListItem>
                                { question.choices.map((choice, index) =>
                                <ListItem key={'choice' + choice.id}>
                                    <TextField
                                        label={`Choice ${index + 1}`}
                                        value={choice.content}
                                        disabled={choice.id !== editedChoiceId}
                                        onChange={(evt) => this.handleEnglishChoiceChange(evt, choice.id)}
                                        multiline
                                        style={{width: '60%'}}
                                        variant="outlined"
                                    />
                                    { choice.id !== editedChoiceId &&
                                    <IconButton onClick={() =>this.handleEditChoice(choice.id)}>
                                        <EditIcon />
                                    </IconButton>}
                                    { choice.id === editedChoiceId &&
                                    <IconButton onClick={() =>this.handleSubmitEditEnglishChoice()}>
                                        <DoneIcon />
                                    </IconButton>}
                                </ListItem>)}
                            </div>
                        }

                        { question.questionTranslations && question.questionTranslations.length > 0 &&
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
                                      disabled={editedTranslationLangName !== qt.languageName}
                                      multiline
                                      onChange={e => this.handleTranslationChange(e, qt)}
                                      style={{width: '100%'}}
                                      variant="outlined"
                                  />
                                  { editedTranslationLangName !== qt.languageName && !sthEdited &&
                                  <IconButton onClick={() =>this.handleEditTranslation(qt)}>
                                      <EditIcon />
                                  </IconButton>
                                  }
                                  { editedTranslationLangName === qt.languageName &&
                                  <IconButton onClick={() =>this.handleSubmitEditTranslation(qt)}>
                                      <DoneIcon />
                                  </IconButton>
                                  }
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
                                        Select translation language
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
