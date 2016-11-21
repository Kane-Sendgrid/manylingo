import {API} from './api/apiHelper.js'
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './account.js';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import request from 'superagent';
import { router } from '../client.js'

@observer
export default class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {
            btnLoading: false,
            form: {
                email: "",
                password: "",
                confirm_password: "",
            },
            formErrors: {
                email: "",
                password: "",
                confirm_password: "",
            },
        };
    }

    render() {
        const {viewStore} = this.props;
        var btnClass = this.state.btnLoading ? "active" : "";
        return (
            <div>
                <header className="header">
                    <h1>Your account</h1>

                    <form>
                        <div className="form-group">
                            <label htmlFor="exampleInputEmail1">Email address:</label>
                            <input name="email" type="email" className="form-control" placeholder="Email" onChange={this.onChange} value={this.state.form.email} />
                            <p className="help-block text-danger">{this.state.formErrors.email}</p>
                        </div>
                        <div className="form-group">
                            <label>Password:</label>
                            <input name="password" type="password" className="form-control" placeholder="Password" onChange={this.onChange} />
                            <p className="help-block text-danger">{this.state.formErrors.password}</p>
                        </div>
                        <div className="form-group">
                            <label>Confirm Password:</label>
                            <input name="confirm_password" type="password" className="form-control" placeholder="Confirm Password" onChange={this.onChange} />
                            <p className="help-block text-danger">{this.state.formErrors.confirm_password}</p>
                        </div>
                        <button type="button" className={"btn btn-info has-spinner " + btnClass}>
                            <span className="spinner"><i className="fa fa-spinner fa-spin"></i></span>
                            Submit
                        </button>
                    </form>

                </header>
                <br /><br />
            </div>
        );
    }

    onChange(event) {
        let form = this.state.form;
        form[event.target.name] = event.target.value;
    }
    
    componentDidMount() {
        const {viewStore} = this.props;
        viewStore.cleanHeader();
        ReactDOM.render(<Sidebar />, document.getElementById('manylingo-sidebar'));
        let self = this;
        let r = request.get("/api/account?" + API.authQuery());
        this.setState({ btnLoading: true });
        r.end((err, res) => {
            self.setState({ btnLoading: false });
            if (!err) {
                self.setState({form: {email: res.body.email}})
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

Profile.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
};
