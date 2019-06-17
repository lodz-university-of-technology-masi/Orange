import React from 'react';
import { positionService, testService, questionService, languageService} from '@/_services';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import SaveIcon from '@material-ui/icons/Save';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";

const DEFAULT_LANGUGAE_TO_PDF = 'English';
class TestEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: null,
            test: null,
            question: null,
            selectedQuestion:"",
            targetTranslation: "",
            targetExportLanguage: "English",
            targetTranslationError:false,
            accessibleLanguages:[],
            accessibleLanguagesToExport: ['English', 'Polish'],
            selectedPosition:false,
            translatedSuccessfully:false,
            targetCsvLanguage: 'English',
            csvError: '',
        };
    }

    componentDidMount() {
        positionService.getAll().then(positions => this.setState({ positions }));
        questionService.getAll().then(questions => this.setState({ questions }));
        languageService.getAll().then(languages => this.setState({ accessibleLanguages:languages } ));
        //if page is reloaded we lose passed object so we have to call api again.
        if(!this.props.location.query){
            testService.get(this.props.match.params.testName).then(test => this.setState({ test }));
        }else{
            this.setState({test: this.props.location.query.test})
        }
    }

    handleTextChange = (event) => {
        this.setState({
            targetTranslationError:false,
            targetTranslation: event.target.value,
        });
    };

    handleExportLanguageChange = (event) => {
        this.setState({
            targetExportLanguage: event.target.value,
        });
    };

    handleCsvLanguageChange = (event) => {
        this.setState({
            targetCsvLanguage: event.target.value,
            csvError: null,
        })
    };

    handleRemove(name){
        var newTest = this.state.test;
        var index = newTest.questions.findIndex(x=>x.name === name);
        newTest.questions.splice(index,1);
        this.setState({test: newTest})
        testService.deleteQuestion(newTest.name, name)
    }

    handleSelectChange = (event) => {
        this.setState({
            selectedPosition: event.target.value,
           });
           console.log({testName: this.state.test.name, positionName: this.state.selectedPosition})
           testService.updatePosition({testName: this.state.test.name, positionName: this.state.selectedPosition})

     }

     handleSelectQuestionChange = (event) => {
        this.setState({
            selectedQuestion: event.target.value,
           });
     }

     handleAdd = () => {
        if(!this.state.selectedQuestion){
            //handle not selected question
            return
        }
        if(this.state.test.questions.findIndex(x=>x.name === this.state.selectedQuestion.name)!=-1){
            //handle same question added
            return
        }
        var newTest = this.state.test;
        newTest.questions.push(this.state.selectedQuestion)
        this.setState({test: newTest})
        testService.addQuestion(this.state.test.name, this.state.selectedQuestion.name)
    }


    handleTranslateTest = () => {
        const {targetTranslation} = this.state;
        if (targetTranslation !== "") {
            testService.translate(this.state.test.name, targetTranslation);
            this.setState({translatedSuccessfully:true})
        } else {
            this.setState({targetTranslationError:true});
        }
    };

    handleGeneratePdf() {
        const {targetExportLanguage} = this.state;
        testService.generatePdf(this.state.test.name, targetExportLanguage);
    }

    handleGenerateCsv() {
        const {targetCsvLanguage, test} = this.state;
        testService.exportTest(test.name, targetCsvLanguage)
        .then(
            (response) => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', test.name + ".csv");
                document.body.appendChild(link);
                link.click();
                this.setState({csvError: null});
            },
            (csvError) => this.setState({csvError: 'This language might be not supported'})
        );
    }

    handleCloseSuccessModal = () => {
        this.setState({translatedSuccessfully: false})
    };

    render() {
        const {positions, test, accessibleLanguages, targetTranslation, targetExportLanguage, targetCsvLanguage, csvError,
            targetTranslationError, translatedSuccessfully, accessibleLanguagesToExport} = this.state;
        return (
            <div>
                {(positions && test) &&
                    <div>
                    <Typography component="h3" variant="display3" gutterBottom>
                        {test.name}
                    </Typography>


                        <FormControl variant="outlined">
                            <InputLabel  >Position</InputLabel>
                            <Select
                                value={this.state.selectedPosition || test.position.name}
                                name="New Test Name"
                                onChange={this.handleSelectChange}
                                input={<OutlinedInput  labelWidth={60}/>}
                                style={{marginBottom:10}}
                                displayEmpty
                            >
                            <MenuItem value="" disabled>
                            Select Position
                            </MenuItem>
                            {positions.map(position =>
                                <MenuItem key={position.id} value={position.name}>{position.name}</MenuItem>
                            )
                            }
                        </Select>
                        </FormControl>
                        <div style={{display: 'flex', flexWrap: 'wrap'}}>
                        <Select
                            value={targetTranslation}
                            onChange={this.handleTextChange}
                            input={<OutlinedInput labelWidth={0}/>}
                            style={{width: '35%', marginRight:30}}
                            error={targetTranslationError}
                            displayEmpty
                        >
                            <MenuItem value="" disabled>
                                Select target language
                            </MenuItem>
                            {accessibleLanguages.map(l =>
                                <MenuItem key={l.name} value={l.name}>{l.name}</MenuItem>
                            )}
                        </Select>
                        <Button
                            onClick={() =>this.handleTranslateTest()}
                            size="small"
                            variant="contained"
                            color="default">
                            Translate
                        </Button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '10px'}}>
                        <Select
                            value={targetExportLanguage}
                            onChange={this.handleExportLanguageChange}
                            input={<OutlinedInput labelWidth={0}/>}
                            style={{width: '35%', marginRight:30}}
                        >
                            <MenuItem value="English" selected>
                                English
                            </MenuItem>
                            {accessibleLanguages.map(l =>
                                <MenuItem key={l.name} value={l.name}>{l.name}</MenuItem>
                            )}
                        </Select>
                        <Button
                            onClick={() =>this.handleGeneratePdf()}
                            size="small"
                            variant="contained"
                            color="default">
                            Generate PDF
                        </Button>
                    </div>
                    <div style={{display: 'flex', flexWrap: 'wrap', marginTop: '10px'}}>
                        <Select
                            value={targetCsvLanguage}
                            onChange={this.handleCsvLanguageChange}
                            input={<OutlinedInput labelWidth={0}/>}
                            style={{width: '35%', marginRight:30}}
                        >
                            <MenuItem value="English" selected>
                                English
                            </MenuItem>
                            {accessibleLanguages.map(l =>
                                <MenuItem key={l.name} value={l.name}>{l.name}</MenuItem>
                            )}
                        </Select>
                        <Button
                            onClick={() =>this.handleGenerateCsv()}
                            size="small"
                            variant="contained"
                            color="default">
                            Export CSV
                        </Button>
                        { csvError &&
                        <div className={'alert alert-danger'}>{csvError}</div>
                        }
                    </div>
                        <Divider style={{marginBottom:20, marginTop:20}}/>
                        <List subheader={<ListSubheader><h3>Questions</h3></ListSubheader>}>
                            {test.questions.map(qst =>
                            <ListItem key={qst.name}>
                                <ListItemText primary={qst.content} secondary={qst.questionType} />
                                <ListItemSecondaryAction>
                                <IconButton onClick={() =>this.handleRemove(qst.name)} aria-label="Delete">
                                    <DeleteIcon />
                                </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                            )}
                        </List>
                        <Divider style={{marginBottom:20, marginTop:20}}/>
                        {this.state.questions &&
                        <div>
                                <Select
                                        value={this.state.selectedQuestion}
                                        onChange={this.handleSelectQuestionChange}
                                        variant='outlined'
                                        displayEmpty
                                     >
                                    <MenuItem value="" disabled>
                                     Select Question
                                    </MenuItem>
                                     {this.state.questions.map(qst =>
                                        <MenuItem key={qst.id} value={qst}>{qst.content}</MenuItem>
                                     )
                                     }
                                </Select>
                        <IconButton onClick={() =>this.handleAdd()}>
                                        <AddIcon />
                        </IconButton>
                        </div>
                        }
                        {!this.state.questions &&
                            <Typography component="h5" gutterBottom>
                                No available questions to be added. Create new ones.
                            </Typography>
                        }
                    </div>
                }
                <Dialog open={translatedSuccessfully} onClose={this.handleCloseSuccessModal} aria-labelledby="success-dialog">
                    <DialogTitle>Successfully translated!</DialogTitle>
                    <Button onClick={this.handleCloseSuccessModal}>OK!</Button>
                </Dialog>
            </div>
        );
    }
}

export { TestEditorPage };
