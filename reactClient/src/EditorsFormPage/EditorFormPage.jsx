import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import { userService, authenticationService, editorService } from '@/_services';
import * as Yup from "yup";

class EditorFormPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            paramsEditorUsername: props.match.params.username,
            editorFromApi: null
        };
    }

    componentDidMount() {
        const { paramsEditorUsername } = this.state;
        if(paramsEditorUsername) {
            editorService.getByUsername(paramsEditorUsername).then( editorFromApi => this.setState({editorFromApi}))
        }
    }

    render() {
        const { editorFromApi } = this.state;

        return (
            <div>
                <h2>{editorFromApi ? editorFromApi.username : 'Create Editor'}</h2>
                <Formik
                    enableReinitialize={true}
                    initialValues={{
                        username: editorFromApi ? editorFromApi.username : '',
                        password: editorFromApi ? editorFromApi.firstName : '',
                        firstName: editorFromApi ? editorFromApi.firstName : '',
                        lastName: editorFromApi ? editorFromApi.lastName : ''
                    }}
                    validationSchema={Yup.object().shape({
                        username: Yup.string().required('Username is required'),
                        password: Yup.string().required('Password is required'),
                        passwordConfirmation: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
                        firstName: Yup.string().required('First Name is required'),
                        lastName: Yup.string().required('Last Name is required')
                    })}
                    onSubmit={({ username, password, firstName, lastName }, { setStatus, setSubmitting }) => {
                        setStatus();

                        const onSubmit = editorFromApi ? editorService.update(username, firstName, lastName) : editorService.create(username, password, firstName, lastName)

                        onSubmit.then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/editorManager" } };
                                this.props.history.push(from);
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                    }}
                    render={({ errors, status, touched, isSubmitting }) => (
                        <Form>
                            <div className="form-group" hidden={editorFromApi}>
                                <label htmlFor="username">Username</label>
                                <Field name="username" type="text" className={'form-control' + (errors.username && touched.username ? ' is-invalid' : '')} />
                                <ErrorMessage name="username" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group" hidden={editorFromApi}>
                                <label htmlFor="password">Password</label>
                                <Field name="password" type="password" className={'form-control' + (errors.password && touched.password ? ' is-invalid' : '')} />
                                <ErrorMessage name="password" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group" hidden={editorFromApi}>
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
                                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>{editorFromApi ? 'Change' : 'Create'}</button>
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

export { EditorFormPage };