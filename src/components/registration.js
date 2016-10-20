import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import DevTool from 'mobx-react-devtools';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import {router} from '../client.js'

@observer
export default class OrderPlacementForm extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleRegistration = this.handleRegistration.bind(this);
        this.state = {
            btnLoading: false,
            form: {
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
                    <h1>Place Order</h1>
                </header>
                <br /><br />
                <form>
                    <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Email address:</label>
                        <input name="email" type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Phone number:</label>
                        <input name="phone" type="tel" className="form-control" placeholder="Phone" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Category:</label>
                        <select name="category" className="form-control" onChange={this.onChange}>
                            <option>Text translation</option>
                            <option>Video</option>
                            <option>Other</option>
                        </select>
                    </div>
                    <Dropfile />
                    <br />
                    <div className="form-group">
                        <label>Link to documents (optional):</label>
                        <input name="link" type="text" className="form-control" placeholder="Link" onChange={this.onChange} />
                    </div>
                    <div className="form-group">
                        <label>Comments:</label>
                        <textarea name="comments" className="form-control" style={{ height: "100px" }} onChange={this.onChange}></textarea>
                    </div>
                    <button onClick={this.handleRegistration} type="button" className={"btn btn-info has-spinner " + btnClass}>
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
        this.setState({ form: form });
    }

    handleRegistration() {
        self = this;
        let r = request.post("/api/orders/place-order");
        for (let name of Object.keys(this.state.order)) {
            r.field(name, this.state.order[name]);
        }
        uploadedFiles.files.map((file, n) => {
            console.log(file);
            r.attach(file.name, file)
        });


        this.setState({ btnLoading: true });
        r.end((err, res) => {
            console.log(err, res);
            self.setState({ btnLoading: false });
            if (!err) {
                router.setRoute("/place-order-thanks");
            }
        });
    }

    componentDidMount() {
    }
}
