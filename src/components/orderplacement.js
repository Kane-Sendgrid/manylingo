import { API } from './api/apiHelper.js'
import React from 'react';
import ReactDOM from 'react-dom';
import { Sidebar } from './account.js';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import DevTool from 'mobx-react-devtools';
import Dropzone from 'react-dropzone';
import request from 'superagent';
import { router } from '../client.js'
import { LANGUAGES } from '../constants.js'

let uploadedFiles = observable({
    files: [],
});

@observer
class Dropfile extends React.Component {
    @action onDrop(acceptedFiles, rejectedFiles) {
        console.log(acceptedFiles);
        uploadedFiles.files = acceptedFiles;
    }

    render() {
        return (
            <div>
                <Dropzone onDrop={this.onDrop} className="dropzone">
                    <div style={{ padding: "10px" }}>
                        <div>Drop your documents here, or click to choose files.</div>
                        <div>Uploaded files:</div>
                        <ol>
                            {uploadedFiles.files.map((file, n) => (
                                <li key={n}>{file.name}</li>
                            ))
                            }
                        </ol>
                    </div>
                </Dropzone>
            </div>
        );
    }
}

@observer
export default class OrderPlacementForm extends React.Component {
    constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.state = {
            btnLoading: false,
            order: {
                email: "",
                phone: "",
                category: "Text translation",
                comments: "",
            },
        };
    }

    render() {
        const {viewStore} = this.props;
        var btnClass = this.state.btnLoading ? "active" : "";
        return (
            <div>
                <DevTool />
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

                    <div className="row">
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>Translate from:</label>
                                <select name="from_lang" className="form-control" onChange={this.onChange}>
                                    {
                                        LANGUAGES.map((o) => (
                                            <option>{o}</option>
                                        ), this)
                                    }
                                </select>
                            </div>
                        </div>
                        <div className="col-md-6">
                            <div className="form-group">
                                <label>To:</label>
                                <select name="to_lang" className="form-control" onChange={this.onChange}>
                                    {
                                        LANGUAGES.map((o) => (
                                            <option>{o}</option>
                                        ), this)
                                    }
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label>Category:</label>
                        <select name="category" className="form-control" onChange={this.onChange}>
                            <optgroup label="General">
                                <option>General</option>
                                <option>Marketing</option>
                                <option>Website</option>
                            </optgroup>
                            <optgroup label="Specialized">
                                <option>Technical/IT</option>
                                <option>Medical</option>
                                <option>Financial</option>
                                <option>Legal</option>
                                <option>Other specialized</option>
                            </optgroup>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Service Type:</label>
                        <select name="service" className="form-control" onChange={this.onChange}>
                            <option value="Translation">Translation</option>
                            <option value="Localization">Localization</option>
                            <option value="Transcreation">Transcreation</option>
                            <option value="Voiceover">Voiceover</option>
                            <option value="Transcription">Transcription</option>
                            <option value="Proofreading">Proofreading</option>
                            <option value="Subtitling">Subtitling</option>
                            <option value="Visual editing">Visual editing</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <div className="controls">
                            <label><input type="checkbox" className="" name="expedited" value="expedited" /> Expedited</label>
                        </div>
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
                    <button onClick={this.placeOrder} type="button" className={"btn btn-info has-spinner " + btnClass}>
                        <span className="spinner"><i className="fa fa-spinner fa-spin"></i></span>
                        Submit
                </button>
                </form>
            </div>
        );
    }

    onChange(event) {
        let orderValue = this.state.order;
        orderValue[event.target.name] = event.target.value;
        this.setState({ order: orderValue });
    }

    placeOrder() {
        let self = this;
        let r = request.post("/api/orders/place-order?" + API.authQuery());
        for (let name of Object.keys(this.state.order)) {
            if (this.state.order[name].length < 1) {
                bootbox.alert("Please enter " + name);
                return;
            }
            r.field(name, this.state.order[name]);
        }
        uploadedFiles.files.map((file, n) => {
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
        console.log("place order!!!");
    }

    componentDidMount() {
        if (API.isAuthenticated()) {
            ReactDOM.render(<Sidebar />, document.getElementById('manylingo-sidebar'));
        }
    }
}

OrderPlacementForm.propTypes = {
    viewStore: React.PropTypes.object.isRequired,
};

export class OrderPlacementThanks extends React.Component {
    render() {
        return (<div>
            <header className="header">
                <h1>Thank you!</h1>
                <h2>We will get back to you within 24 hours.</h2>
            </header>
            <br /><br />
        </div>);
    }
}
