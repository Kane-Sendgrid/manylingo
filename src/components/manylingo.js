import React from 'react';
import {observer} from 'mobx-react';

import TodoEntry from './todoEntry';
import TodoOverview from './todoOverview';
import TodoFooter from './todoFooter';
import { ALL_TODOS, ACTIVE_TODOS, COMPLETED_TODOS } from '../constants';

import DevTool from 'mobx-react-devtools';

@observer
export default class Manylingo extends React.Component {
	render() {
		const {viewStore} = this.props;
		return (
			<div>
				<DevTool />
				<header className="header">
					<h1>Dashboard</h1>
				</header>
			</div>
		);
	}

	componentDidMount() {
		var viewStore = this.props.viewStore;
	}
}

Manylingo.propTypes = {
	viewStore: React.PropTypes.object.isRequired,
};
