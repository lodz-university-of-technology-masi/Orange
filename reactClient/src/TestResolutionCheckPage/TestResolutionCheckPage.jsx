import React from 'react';
import { testResolutionService, questionAnswerService } from '@/_services';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';
import CheckBox from '@material-ui/core/Checkbox';
import Button from '@material-ui/core/Button';
import FormControlLabel from '@material-ui/core/FormControlLabel'

class TestResolutionCheckPage extends React.Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            testResolution: null,
            testResolutionId: null,
            questionAnswers:null
        };
    }

    componentDidMount() {
        //if page is reloaded we lose passed object so we have to call api again.
        if (!this.props.location.query) {
            testResolutionService.getTestResolutionById(this.props.match.params.testResolutionId).then(resolution => this.setState({testResolution: resolution}));
        } else {
            this.setState({testResolution: this.props.location.query.testResolution})
        }
        questionAnswerService.getAllAnswersByTestResolutionId(this.props.match.params.testResolutionId).then(answers => this.setState({questionAnswers: answers}))
    }

    findQuestionAnswer(id) {
        let answer="";
        for(let i=0; i<this.state.questionAnswers.length; i++) {
            if(this.state.questionAnswers[i].question.id === id) {
                answer = this.state.questionAnswers[i].content;
            }
        }
        return answer;
    }

    render() {
        const {testResolution, questionAnswers} = this.state;
        console.log(testResolution);
        console.log(questionAnswers);
        if (testResolution !== null && questionAnswers !== null) {
            return (
                <div>
                    <List
                        subheader={<ListSubheader disableSticky><h3>Test resolution for {testResolution.test.name} </h3>
                        </ListSubheader>}>
                        <ListItem key={`Test resolution from ${testResolution.date}`}>
                            <ListItemText primary={testResolution.account.username}
                                          secondary={`Test made at ${testResolution.date}`}/>
                        </ListItem>
                        {testResolution.test.questions.map(q =>
                            <div key={`Test question ${q.name}`}>

                                <ListItem key={`Test question ${q.name}`}>
                                    <ListItemText primary={"Question: " + q.content}/>
                                </ListItem>

                                <ListItem key={`Test question name ${q.name}`}>
                                    <ListItemText primary={"Answer: " + this.findQuestionAnswer(q.id)}/>
                                </ListItem>

                                <ListItem key={`Test question ${q.content}`}>
                                    <FormControlLabel
                                        control={<CheckBox value="checkedA"/>}
                                        label="Correct"/>
                                    <ListItemSecondaryAction>
                                        <FormControlLabel
                                            control={<CheckBox value="checkedA"/>}
                                            label="Not correct"/>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            </div>
                        )}
                        <ListItem style={{'justifyContent':'center'}}>
                        <Button
                            onClick={() => {console.log("submitted")}}
                            size="medium"
                            variant="contained"
                            color="default">
                            Submit
                        </Button>
                        </ListItem>
                    </List>
                </div>
            )
        } else {
            return null
        }
    }
}

export {TestResolutionCheckPage};