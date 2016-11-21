import { API } from './api/apiHelper.js'
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './account.js';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import request from 'superagent';
import { router } from '../client.js'

@observer
export default class ViewOrder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            btnLoading: false,
            order: {
                id: "",
            },
        };
    }

    render() {
        const {viewStore} = this.props;
        const order = this.state.order;
        var btnClass = this.state.btnLoading ? "active" : "";
        return (
            <div>
                <header className="header">
                    <div className="pull-right">
                        <a href="#" className="btn btn-success btn-sm"><i className="fa fa-check"></i> Approve</a>
                    </div>
                    <h1>Order #{this.state.order.id}</h1>
                </header>
                <hr />
                <div className="row">
                    <div className="col-md-8">
                        <p className="text-warning">Status: Quote pending</p>
                        <table className="table table-striped">
                            <tbody>
                                <tr>
                                    <td>Email</td>
                                    <td>{this.state.order.email}</td>
                                </tr>
                                <tr>
                                    <td>Phone</td>
                                    <td>{this.state.order.phone}</td>
                                </tr>
                                <tr>
                                    <td>Category</td>
                                    <td>{this.state.order.category}</td>
                                </tr>
                            </tbody>
                        </table>

                        <h4>Project description:</h4>
                        {this.state.order.comments}

                    </div>
                    <div className="col-md-4">
                        <div className="panel panel-default">
                            <div className="panel-heading">Project information:</div>
                            <div className="panel-body">
                                <p className="small">Manager:</p>
                                <h5>Andy</h5>
                                <hr />
                                <p className="small">Contact:</p>
                                <h5><a href="mailto:sales@manylingo.com">sales@manylingo.com</a></h5>

                            </div>
                        </div>
                    </div>
                </div>

                <br /><br />
            </div>
        );
    }

    componentDidMount() {
        const {viewStore, orderID} = this.props;
        viewStore.cleanHeader();
        ReactDOM.render(<Sidebar />, document.getElementById('manylingo-sidebar'));

        let self = this;
        let r = request.get(`/api/orders/${orderID}?` + API.authQuery());
        this.setState({ btnLoading: true });
        r.end((err, res) => {
            self.setState({ btnLoading: false });
            if (!err) {
                self.setState({ order: res.body })
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

ViewOrder.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
    orderID: React.PropTypes.string.isRequired,
};
