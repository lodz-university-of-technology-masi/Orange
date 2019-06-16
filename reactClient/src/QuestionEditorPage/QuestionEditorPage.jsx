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
import DeleteIcon from '@material-ui/icons/Delete';

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
            newEnglishChoice: '',
            newChoice: '',
            newChoicesForNewTranslation: [],
            newChoiceForNewTranslation: '',
            newChoiceForNewTranslationError: false,
            editedChoiceForNewTranslationIndex: null,
        };
    }

    componentDidMount() {
        questionService.get(this.props.match.params.questionName).then(
            question => {
                this.setQuestion(question);
            }
        );
    };

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
            newContentTextError: false,
            newContentText: event.target.value,
        });
    };

    handleNewSelectChange = (event) => {
        this.setState({
            newSelectedLanguage: event.target.value,
        });
    };

    handleAdd = () => {
        const { question, newContentText, newSelectedLanguage, newChoicesForNewTranslation } = this.state;

        if (newContentText.length < 5) {
            this.setState({newContentTextError: true});
            return;
        }

        if (question.questionType === 'CHOICE' && newChoicesForNewTranslation.length < 1) {
            this.setState({newChoiceForNewTranslationError: true});
            return;
        }

        const newTranslation = {
            content: newContentText,
            languageName: newSelectedLanguage,
            questionName: question.name,
            choices: newChoicesForNewTranslation,
        };

        questionTranslationService.add(newTranslation).then(res => {
            questionService.get(this.props.match.params.questionName).then(
                question => {
                    this.setQuestion(question);
                }
            );
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

    handleDeleteEnglishChoice = (choiceId) => {
      const { question } = this.state;
      for (let i = 0; i < question.choices.length; i++) {
          if (question.choices[i].id === choiceId) {
              question.choices.splice(i, 1);
              break;
          }
      }
      this.setState({question});
    };

    handleSubmitEditEnglishChoice = (choiceId) => {
        this.setState({editedChoiceId: null})
    };

    handleNewEnglishChoiceChanged = (event) => {
        this.setState({newEnglishChoice: event.target.value});
    };

    handleAddNewEnglishChoice = () => {
        const { newEnglishChoice, question } = this.state;
        question.choices.push({id: 'TODO', content: newEnglishChoice});
        this.setState({ newEnglishChoice: '', question })
    };

    handleChoiceChange = (event, languageName, choiceId) => {
        const { question } = this.state;
        question.questionTranslations.forEach(qt => {
            if (qt.languageName === languageName) {
                qt.choices.forEach( ch => {
                    if (ch.id === choiceId) {
                           ch.content = event.target.value;
                    }
                })
            }
        });
        this.setQuestion(question);
    };

    handleSubmitEditChoice = (choiceId) => {
        this.setState({editedChoiceId: null})
    };

    handleDeleteChoice = (languageName, choiceId) => {
        const { question } = this.state;
        for (let i = 0; i < question.questionTranslations.length; i++) {
            if (question.questionTranslations[i].languageName === languageName) {
                for (let j = 0; j < question.questionTranslations[i].choices.length; j++) {
                    if (question.questionTranslations[i].choices[j].id === choiceId) {
                        question.questionTranslations[i].choices.splice(j, 1);
                        break;
                    }
                }
                break;
            }
        }
        this.setState({question});
    };

    handleNewChoiceChanged = (event) => {
        this.setState({newChoice: event.target.value});
    };

    handleAddNewChoice = (languageName) => {
        const { newChoice, question } = this.state;
        if (newChoice.length < 3) {
            return;
        }
        question.questionTranslations.forEach(qt => {
            if (qt.languageName === languageName) {
                qt.choices.push({id: 'TODO', content: newChoice});
            }
        });
        this.setState({ newChoice: '', question })
    };

    handleNewChoiceForNewTranslationChange = (event) => {
        this.setState({
            newChoiceForNewTranslationError: false,
            newChoiceForNewTranslation: event.target.value,
        });
    };

    handleAddNewChoiceForNewTranslation = () => {
        const { newChoicesForNewTranslation, newChoiceForNewTranslation } = this.state;
        if ( newChoiceForNewTranslation.length < 3 ) {
            return;
        }
        newChoicesForNewTranslation.push({content: newChoiceForNewTranslation});
        this.setState({
            newChoicesForNewTranslation, newChoiceForNewTranslation: '',
        })
    };

    handleChoiceForNewTranslationDelete = (index) => {
        const { newChoicesForNewTranslation } = this.state;
        newChoicesForNewTranslation.splice(index, 1);
        this.setState({newChoicesForNewTranslation});
    };

    render() {
        const {question, editEnglishBase, editedTranslationLangName,
            newContentText, newContentTextError, newSelectedLanguage, newAccessibleLanguages,
            editedChoiceId, newEnglishChoice, newChoice, editedChoiceForNewTranslationIndex,
            newChoicesForNewTranslation, newChoiceForNewTranslation, newChoiceForNewTranslationError,
             } = this.state;
        const sthEdited = (editEnglishBase || editedTranslationLangName !== null || editedChoiceId !== null);
        return (
            <div>
                {(question) &&
                    <div><List subheader={<ListSubheader disableSticky><h3>{question.name}</h3></ListSubheader>}>
                        <ListItem key='question-in-english-key'>
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
                                <ListItem key='choices-english-key'>
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
                                    { question.choices.length > 1 &&
                                    <IconButton onClick={() =>this.handleDeleteEnglishChoice(choice.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                    }
                                    { choice.id !== editedChoiceId && !sthEdited &&
                                    <IconButton onClick={() =>this.handleEditChoice(choice.id)}>
                                        <EditIcon />
                                    </IconButton>}
                                    { choice.id === editedChoiceId &&
                                    <IconButton onClick={() =>this.handleSubmitEditEnglishChoice()}>
                                        <DoneIcon />
                                    </IconButton>}
                                </ListItem>)}
                                <ListItem key={'add-new-english-choice'}>
                                    <TextField
                                        label={`Add new choice in English`}
                                        value={newEnglishChoice}
                                        onChange={this.handleNewEnglishChoiceChanged}
                                        style={{width: '60%'}}
                                        variant="outlined"
                                    />
                                    <IconButton onClick={() =>this.handleAddNewEnglishChoice()}>
                                        <AddIcon />
                                    </IconButton>
                                </ListItem>
                            </div>
                        }

                        { question.questionTranslations && question.questionTranslations.length > 0 &&
                            <ListItem key='translations-key'>
                                <Typography component="h2" variant="display3" gutterBottom
                                            style={{fontSize: '1.5rem'}}>
                                    Translations
                                </Typography>
                            </ListItem>
                        }

                        { question.questionTranslations && question.questionTranslations.map(qt =>
                            <div key={`div-translation-${qt.languageName}`}>
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
                                { question.questionType === 'CHOICE' && qt.choices && qt.choices.length > 0 &&
                                <div>
                                    <ListItem key={`choices-${qt.languageName}-key`}>
                                        <Typography component="h2" variant="display3" gutterBottom
                                                    style={{fontSize: '1rem'}}>
                                            Choices in {qt.languageName}
                                        </Typography>
                                    </ListItem>
                                    { qt.choices.map((choice, index) =>
                                        <ListItem key={'translation-choice' + choice.id}>
                                            <TextField
                                                label={`Choice ${index + 1}`}
                                                value={choice.content}
                                                disabled={choice.id !== editedChoiceId}
                                                onChange={(evt) => this.handleChoiceChange(evt, qt.languageName, choice.id)}
                                                multiline
                                                style={{width: '60%'}}
                                                variant="outlined"
                                            />
                                            { qt.choices.length > 1 &&
                                                <IconButton onClick={() =>this.handleDeleteChoice(qt.languageName, choice.id)}>
                                                    <DeleteIcon />
                                                </IconButton>
                                            }
                                            { choice.id !== editedChoiceId && !sthEdited &&
                                            <IconButton onClick={() =>this.handleEditChoice(choice.id)}>
                                                <EditIcon />
                                            </IconButton>}
                                            { choice.id === editedChoiceId &&
                                            <IconButton onClick={() =>this.handleSubmitEditChoice()}>
                                                <DoneIcon />
                                            </IconButton>}
                                        </ListItem>)}
                                    <ListItem key={'add-new-choice'}>
                                        <TextField
                                            label={`Add new choice in ${qt.languageName}`}
                                            value={newChoice}
                                            onChange={this.handleNewChoiceChanged}
                                            style={{width: '60%'}}
                                            variant="outlined"
                                        />
                                        <IconButton onClick={() =>this.handleAddNewChoice(qt.languageName)}>
                                            <AddIcon />
                                        </IconButton>
                                    </ListItem>
                                </div>
                                }
                            </div>
                        )}

                        {newAccessibleLanguages.length > 0 &&
                            <ListItem key='add-translation-key'>
                                <Typography component="h2" variant="display3" gutterBottom
                                            style={{fontSize: '1.5rem'}}>
                                    Add Translation
                                </Typography>
                            </ListItem>
                        }
                        { newAccessibleLanguages.length > 0 &&
                            <div>
                                <ListItem key='new-languages-add-key'>
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
                                { question.questionType === 'CHOICE' &&
                                <div>
                                    { newChoicesForNewTranslation.map((choice, index) =>
                                        <ListItem key={'choice' + index}>
                                            <TextField
                                                label={`Choice ${index + 1}`}
                                                value={choice.content}
                                                disabled={index !== editedChoiceForNewTranslationIndex}
                                                style={{width: '60%'}}
                                                variant="outlined"
                                            />
                                            <IconButton onClick={() => this.handleChoiceForNewTranslationDelete(index)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </ListItem>)}
                                    <ListItem>
                                        <TextField
                                            id="add-choice-for-new-translation"
                                            label="Add choice"
                                            value={newChoiceForNewTranslation}
                                            onChange={this.handleNewChoiceForNewTranslationChange}
                                            error={newChoiceForNewTranslationError}
                                            style={{width: '60%'}}
                                            variant="outlined"
                                        />
                                        <IconButton onClick={() =>this.handleAddNewChoiceForNewTranslation()}>
                                            <AddIcon />
                                        </IconButton>
                                    </ListItem>
                                </div>
                                }
                            </div>
                        }
                    </List></div>

                }
            </div>
        );
    }
}

export { QuestionEditorPage };
