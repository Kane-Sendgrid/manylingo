import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import request from 'superagent';
import { router } from '../client.js'

@observer
export default class Header extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {viewStore} = this.props;
        let messageClass = "hide";
        let header = "";
        let message = "";
        if (viewStore.header.flash.error != "") {
            header = "Error:";
            messageClass = "bs-callout-danger";
            message = viewStore.header.flash.error;
        }
        if (viewStore.header.flash.success != "") {
            header = "Success:";
            messageClass = "bs-callout-success";
            message = viewStore.header.flash.success;
        }
        return (
            <div>
                <div className={"bs-callout " + messageClass}>
                    <h4>{header}</h4>
                    {message}
                </div>
            </div>
        );
    }

    componentDidMount() {
    }
}

Header.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
};
