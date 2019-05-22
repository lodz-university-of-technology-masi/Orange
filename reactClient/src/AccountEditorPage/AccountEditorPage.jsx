import React from 'react';

import {languageService} from "@/_services/language.service";
import {ErrorMessage, Field, Form, Formik} from "formik";
import * as Yup from "yup";
import {authenticationService, currentUserSubject} from "@/_services";
import {userService} from "@/_services/user.service";

class AccountEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            languages: [],
            selectedLanguage: '',
            user: null,
        };
    };

    componentDidMount() {

        const user = JSON.parse(localStorage.getItem('currentUser'));

        languageService.getAll().then(languages => {
            let selectedLanguage = '';

            if (user) {
                for(let i = 0; i < languages.length; i++) {
                    if (languages[i].name === user.preferredLanguageName && user.preferredLanguageName !== null) {
                        selectedLanguage = user.preferredLanguageName;
                        break;
                    }
                }
            }
            this.setState({languages, user, selectedLanguage })
        });
    }

    onChangeSelectedLanguage = (event) => {
        this.setState({selectedLanguage: event.target.value})
    };

    render() {
        const { languages, user, selectedLanguage } = this.state;

        return (
            <div>
                <h2>{'Edit Account'}</h2>
                { user &&
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        firstName: user.firstName,
                        lastName:  user.lastName,
                    }}
                    validationSchema={Yup.object().shape({
                        firstName: Yup.string().required('First Name is required'),
                        lastName: Yup.string().required('Last Name is required'),
                    })}
                    onSubmit={({ firstName, lastName },
                               { setStatus, setSubmitting }) => {
                        const { selectedLanguage } = this.state;
                        setStatus();
                        userService.updateAccount(user.username, user.permissionName,
                                                    firstName, lastName, selectedLanguage).then(
                            u => {
                                localStorage.setItem('currentUser', JSON.stringify(u));
                                this.setState({user: u})
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        )
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
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
                                <select name="preferredLanguageName" className='form-control'
                                        style={{width: '100%'}} value={selectedLanguage}
                                        onChange={this.onChangeSelectedLanguage}
                                >
                                    <option value="" disabled>
                                        Select Preferred Language
                                    </option>
                                    {languages.map(l =>
                                        <option key={l.name} value={l.name}>{l.name}</option>
                                    )}
                                </select>
                            </div>

                            <div className="form-group">
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{'Submit changes'}</button>
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
                }
            </div>
        );
    }
}

export { AccountEditorPage };
