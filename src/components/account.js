import {API} from './api/apiHelper.js'
import React from 'react';
import ReactDOM from 'react-dom';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import request from 'superagent';
import { router } from '../client.js'

export class Sidebar extends React.Component {
    render() {
        return (
            <ul className="nav nav-sidebar">
                <li><a href="#/account" data-target="#">Dashboard</a></li>
                <li><a href="#/profile" data-target="#">Profile</a></li>
                <li><a href="#/place-order" data-target="#">Place Order</a></li>
                <li><a href="#/sign-out">Sign Out</a></li>
            </ul>
        );
    }

    componentDidMount() {
    }
}

@observer
export default class Account extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
            orders: [],
        };
    }

    render() {
        const {viewStore} = this.props;
        var btnClass = this.state.btnLoading ? "active" : "";
        console.log("render");
        return (
            <div>
                <header className="header">
                    <h1>Dashboard</h1>

                    <table className="table table-striped">
                        <caption>Your orders:</caption>
                        <thead>
                            <tr>
                                <th>Order #</th>
                                <th>Description</th>
                                <th>Manager</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>ML-000125</td>
                                <td>Video translation</td>
                                <td>Andy</td>
                                <td>quote pending</td>
                            </tr>
                            {
                                this.state.orders.map((o) => (
                                    <tr>
                                        <td><a href={`#/orders/view/${o.id}`}>{o.id}</a></td>
                                        <td>{o.comments}</td>
                                        <td>Andy</td>
                                        <td>quote pending</td>
                                    </tr>
                                ), this)
                            }
                        </tbody>
                    </table>
                </header>
                <br /><br />
            </div>
        );
    }

    componentDidMount() {
        let self = this;
        ReactDOM.render(<Sidebar />, document.getElementById('manylingo-sidebar'));
        let r = request.get("/api/orders?" + API.authQuery());
        this.setState({ btnLoading: true });
        r.end((err, res) => {
            self.setState({ btnLoading: false });
            if (!err) {
                console.log(res.body)
                this.setState({orders: res.body})
            } else {
                API.removeAuth()
                router.setRoute("/login");
            }
        });

    }

    componentWillUnmount() {
        ReactDOM.unmountComponentAtNode(document.getElementById('manylingo-sidebar'));
    }
}

Account.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
};
