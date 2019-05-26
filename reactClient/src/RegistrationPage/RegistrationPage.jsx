import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { userService, authenticationService } from '@/_services';
import * as Yup from "yup";
import {languageService} from "@/_services/language.service";

class RegistrationPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            paramsEditorUsername: props.match.params.username,
            languages: [],
            selectedLanguage: 'English',
        };
    }

    componentDidMount() {
        languageService.getAll().then(res => {
            if (res && res.length > 0) {
                this.setState({ languages: res })
            }
        });
    }

    handleChangeSelectedLanguage = (event) => {
        const selectedLanguage = event.target.value;
        this.setState({selectedLanguage})
    };

    render() {

        const { languages, selectedLanguage } = this.state;

        return (
            <div>
                <h2>{'Registration'}</h2>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        username: '',
                        password: '',
                        firstName: '',
                        lastName:  '',
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required'),
                        passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
                        firstName: Yup.string().required('First Name is required'),
                        lastName: Yup.string().required('Last Name is required'),
                    })}
                    onSubmit={({ username, password, firstName, lastName },
                               { setStatus, setSubmitting }) => {
                        let { selectedLanguage } = this.state;
                        setStatus();
                        if (selectedLanguage === 'English') {
                            selectedLanguage = null;
                        }
                        const onSubmit = userService.createCandidateAccount(username, password, firstName,
                                                                            lastName, selectedLanguage);
                        onSubmit.then(
                            () => {
                                this.props.history.push("/login");
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group" >
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group" >
                                <label htmlFor="passwordConfirmation">Repeat Password</label>
                                <Field name="passwordConfirmation" type="password" className={'form-control' + (errors.passwordConfirmation && touched.passwordConfirmation ? ' is-invalid' : '')} />
                                <ErrorMessage name="passwordConfirmation" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="firstName">First Name</label>
                                <Field name="firstName" className={'form-control' + (errors.firstName && touched.firstName ? ' is-invalid' : '')} />
                                <ErrorMessage name="firstName" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group">
                                <label htmlFor="lastName">Last Name</label>
                                <Field name="lastName" className={'form-control' + (errors.lastName && touched.lastName ? ' is-invalid' : '')} />
                                <ErrorMessage name="lastName" component="div" className="invalid-feedback" />
                            </div>


                            <div className="form-group">
                                <label htmlFor="preferredLanguageName">Preferred Language</label>
                                <select id="preferredLanguageName" name="preferredLanguageName" className='form-control'
                                    style={{width: '100%'}} value={selectedLanguage} onChange={this.handleChangeSelectedLanguage}
                                >
                                    <option value="" disabled>
                                        Select Preferred Language
                                    </option>
                                    <option key='default-language' value="English">
                                        English
                                    </option>
                                    {languages.map(l =>
                                        <option key={`language${l.name}`} value={l.name}>{l.name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{'Register'}</button>
                                {isSubmitting &&
                                <img src="data:image/gif;base64,R0lGODlhEAAQAPIAAP///wAAAMLCwkJCQgAAAGJiYoKCgpKSkiH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAADMwi63P4wyklrE2MIOggZnAdOmGYJRbExwroUmcG2LmDEwnHQLVsYOd2mBzkYDAdKa+dIAAAh+QQJCgAAACwAAAAAEAAQAAADNAi63P5OjCEgG4QMu7DmikRxQlFUYDEZIGBMRVsaqHwctXXf7WEYB4Ag1xjihkMZsiUkKhIAIfkECQoAAAAsAAAAABAAEAAAAzYIujIjK8pByJDMlFYvBoVjHA70GU7xSUJhmKtwHPAKzLO9HMaoKwJZ7Rf8AYPDDzKpZBqfvwQAIfkECQoAAAAsAAAAABAAEAAAAzMIumIlK8oyhpHsnFZfhYumCYUhDAQxRIdhHBGqRoKw0R8DYlJd8z0fMDgsGo/IpHI5TAAAIfkECQoAAAAsAAAAABAAEAAAAzIIunInK0rnZBTwGPNMgQwmdsNgXGJUlIWEuR5oWUIpz8pAEAMe6TwfwyYsGo/IpFKSAAAh+QQJCgAAACwAAAAAEAAQAAADMwi6IMKQORfjdOe82p4wGccc4CEuQradylesojEMBgsUc2G7sDX3lQGBMLAJibufbSlKAAAh+QQJCgAAACwAAAAAEAAQAAADMgi63P7wCRHZnFVdmgHu2nFwlWCI3WGc3TSWhUFGxTAUkGCbtgENBMJAEJsxgMLWzpEAACH5BAkKAAAALAAAAAAQABAAAAMyCLrc/jDKSatlQtScKdceCAjDII7HcQ4EMTCpyrCuUBjCYRgHVtqlAiB1YhiCnlsRkAAAOwAAAAAAAAAAAA==" />
                                }
                            </div>
                            {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                            }
                        </Form>
                    )}
                />
            </div>)
    }
}

export { RegistrationPage };
