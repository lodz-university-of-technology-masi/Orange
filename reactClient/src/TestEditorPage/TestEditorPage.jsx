import React from 'react';

class TestEditorPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            positions: [
                {id:1, name: "Junior React Developer", isActive: true},
                {id:2, name: "Mid React Developer", isActive: false},
                {id:3, name: "Senior React Developer", isActive: false},
                {id:4, name: "Junior Jave Developer", isActive: false},
                {id:5, name: "Mid Java Developer", isActive: true},
                {id:6, name: "Senior Java Developer", isActive: false},
            ]
        };
    }

    componentDidMount() {
        //testService.getAll().then(positions => this.setState({ positions }));
        //positionService.getAll().then(positions => this.setState({ positions }));
    }
    
    render() {
        return (
            <div>
                KOKOKOKOKOKOKOKOKOKOKO
            </div>
        );
    }
}

export { TestEditorPage };