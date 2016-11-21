import { observable } from 'mobx';
import { ALL_TODOS } from '../constants';

export default class ViewStore {
	@observable todoBeingEdited = null;
	@observable todoFilter = ALL_TODOS;

	@observable header = {
		flash: {
			error: "",
			success: ""
		},
	};

	setHeaderError(msg) {
		this.header.flash.success = "";
		this.header.flash.error = msg;
	}

	setHeaderSuccess(msg) {
		this.header.flash.success = msg;
		this.header.flash.error = "";
	}

	cleanHeader() {
		this.header.flash.success = "";
		this.header.flash.error = "";
	}

}