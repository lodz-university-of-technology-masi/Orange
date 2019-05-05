import React from 'react';
import { positionService, testService, questionService} from '@/_services';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import TextField from '@material-ui/core/TextField';
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

class TestEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: null,
            test: null,
            question: null,
            selectedQuestion:"",
            testNameText: "",
            selectedPosition:false,
        };
    }

    componentDidMount() {
        positionService.getAll().then(positions => this.setState({ positions }));
        questionService.getAll().then(questions => this.setState({ questions }));
        //if page is reloaded we lose passed object so we have to call api again.
        if(!this.props.location.query){
            testService.get(this.props.match.params.testName).then(test => this.setState({ test }));
        }else{
            this.setState({test: this.props.location.query.test})
        }
    }

    handleTextChange = (event) => {
        this.setState({
            testNameText: event.target.value,
        });
      };

    handleRemove(name){
        var newTest = this.state.test;
        var index = newTest.questions.findIndex(x=>x.name === name);
        newTest.questions.splice(index,1);
        this.setState({test: newTest})
        testService.deleteQuestion(newTest.name, name)
    }  
    handleSaveName(){
        if(this.state.testNameText.length < 5){
            this.setState({testNameTextError: true})
            return
        } 
        this.setState({testNameTextError: false})
        var oldName = this.state.test.name;
        var newTest = this.state.test;
        newTest.name = this.state.testNameText;
        this.setState({test: newTest})

        testService.updateName(oldName,newTest)
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

    render() {
        const {positions, test} = this.state;
        return (
            <div>
                {(positions && test) && 
                    <div>
                    <Typography component="h3" variant="display3" gutterBottom>
                        {test.name}
                    </Typography>
                    <div style={{display: 'flex',justifyContent: 'space-between', flexWrap: 'wrap'}}>
                        <TextField
                                        id="standard-dense"
                                        label="New Test Name"
                                        value={this.state.testNameText}
                                        onChange={this.handleTextChange}
                                        error={this.state.testNameTextError}
                                        variant="outlined"
                                        style={{marginRight: 5}}
                        />
                        <Button onClick={() =>this.handleSaveName()} variant="contained" size="small" style={{marginRight:50}}>
                            <SaveIcon/>
                            Save Name
                        </Button>
                        <Select
                                value={this.state.selectedPosition || test.position.name}
                                name="New Test Name"
                                onChange={this.handleSelectChange}
                                input={<OutlinedInput labelWidth={0}/>}
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
            </div>
        );
    }
}

export { TestEditorPage };