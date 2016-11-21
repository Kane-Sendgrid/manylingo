import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import request from 'superagent';
import { router } from '../client.js'

@observer
export default class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleLogin = this.handleLogin.bind(this);
        this.state = {
            btnLoading: false,
            form: {
                email: "",
                password: "",
            },
            formErrors: {
                email: "",
                password: "",
            },
        };
    }

    render() {
        const {viewStore} = this.props;
        var btnClass = this.state.btnLoading ? "active" : "";
        return (
            <div>
                <header className="header">
                    <h1>Log In</h1>
                </header>
                <br /><br />
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address:</label>
                        <input name="email" type="email" className="form-control" placeholder="Email" onChange={this.onChange} />
                        <p className="help-block text-danger">{this.state.formErrors.email}</p>
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <input name="password" type="password" className="form-control" placeholder="Password" onChange={this.onChange} />
                        <p className="help-block text-danger">{this.state.formErrors.password}</p>
                    </div>
                    <button onClick={this.handleLogin} type="button" className={"btn btn-info has-spinner " + btnClass}>
                        <span className="spinner"><i className="fa fa-spinner fa-spin"></i></span>
                        Submit
                </button>
                </form>
            </div>
        );
    }

    onChange(event) {
        let form = this.state.form;
        form[event.target.name] = event.target.value;
    }

    validate() {
        const {form} = this.state;
        let formErrors = {};
        let valid = true;
        for (name of ["email", "password", "confirm_password"]) {
            if (form[name] == "") {
                valid = false;
                formErrors[name] = name + " is required";
            }
        }
        // if(form.password.length < 8) {
        //     formErrors.password = "minimum password length is 8 symbols";
        //     valid = false;
        // }
        this.setState({ formErrors: formErrors });

        return valid;
    }

    handleLogin() {
        const {viewStore} = this.props;
        viewStore.cleanHeader();
        if (!this.validate()) {
            viewStore.setHeaderError("Please fix errors in the form");
            return;
        }

        let self = this;
        let r = request.post("/api/login");
        for (let name of Object.keys(this.state.form)) {
            r.field(name, this.state.form[name]);
        }
        
        this.setState({ btnLoading: true });
        r.end((err, res) => {
            self.setState({ btnLoading: false });
            if (!err) {
                console.log(res.text);
                localStorage.setItem("token", res.text);
                router.setRoute("/account");
            } else {
                console.log(res.text);
                viewStore.setHeaderError(res.text);
            }
        });
    }

    componentDidMount() {
    }
}

LoginForm.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
};
