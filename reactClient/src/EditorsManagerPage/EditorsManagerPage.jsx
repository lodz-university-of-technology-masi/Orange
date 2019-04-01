import React from 'react';

import { userService, authenticationService, editorService } from '@/_services';
import { Table, TableRow, TableHead, TableBody, TableCell } from "@material-ui/core";

class EditorsManagerPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            currentUser: authenticationService.currentUserValue,
            userFromApi: null,
            editorsFromApi: null
        };
    }

    componentDidMount() {
        const { currentUser } = this.state;
        userService.getById(currentUser.id).then(userFromApi => this.setState({ userFromApi }));
        editorService.getAll().then( editorsFromApi => this.setState({ editorsFromApi }));
    }

    render() {
        const { editorsFromApi } = this.state;

            if (editorsFromApi !== null) {
                return (
                   <Table>
                       <TableHead>
                           <TableRow>
                               <TableCell>Username</TableCell>
                               <TableCell align="right">First Name</TableCell>
                               <TableCell align="right">Last Name</TableCell>
                           </TableRow>
                       </TableHead>
                       <TableBody>
                           {editorsFromApi.map((row, index) => (
                               <TableRow key={ "editorTableCell" + index }>
                                   <TableCell>{row.username}</TableCell>
                                   <TableCell align="right">{row.firstName}</TableCell>
                                   <TableCell align="right">{row.lastName}</TableCell>
                               </TableRow>
                           ))}
                       </TableBody>
                   </Table>
                )
            } else {
               return null
            }
    }
}

export { EditorsManagerPage };