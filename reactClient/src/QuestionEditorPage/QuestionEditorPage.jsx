import React from 'react';
import {questionService} from "@/_services";
import Typography from '@material-ui/core/Typography';
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";

class QuestionEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            question: null,
            isChanged: false,
            isSubmitting: false,
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

    onSubmit() {
    }

    render() {
        const {question, isSubmitting, isChanged} = this.state;
        return (
            <div>
                {(question) &&
                    <div>
                        <Grid container>
                            <Grid item xs>
                                <Typography component="h2" variant="display3" gutterBottom
                                            style={{fontSize: '1.75rem', marginBottom: '30px'}}>
                                    {question.name}
                                </Typography>
                            </Grid>
                            {(isChanged) &&
                                <Grid item xs style={{textAlign: 'right'}}>
                                    <button type="submit" className="btn btn-primary"
                                            disabled={isSubmitting}>
                                        Submit changes
                                    </button>
                                    {/*{isSubmitting &&*/}
                                    {/*<img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />*/}
                                    {/*}*/}
                                </Grid>
                            }
                        </Grid>
                        <TextField
                            label="Question in english"
                            value={question.content}
                            disabled
                            multiline
                            style={{width: '100%'}}
                            variant="outlined"
                        />
                        <Typography component="h2" variant="display3" gutterBottom
                                    style={{fontSize: '1rem', marginTop: '20px', marginBottom: '20px'}}>
                            Translations
                        </Typography>
                    </div>

                }
            </div>
        );
    }
}

export { QuestionEditorPage };
