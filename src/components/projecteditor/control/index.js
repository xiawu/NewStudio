import { connect } from 'react-redux';

import Control from './control';
import { getAppVersion } from '../../../selectors/app';
import { getSelectedProjectId } from '../../../selectors/projects';
import { selectProject, explorerActions } from '../../../actions';
import { closeTransactionsHistoryPanel } from '../../../actions/view';

const mapStateToProps = state => ({
    appVersion: getAppVersion(state),
    selectedProjectId: getSelectedProjectId(state),
});

const mapDispatchToProps = dispatch => {
    return {
        selectProject: (id, name) => {
            dispatch(selectProject(id, name));
        },
        closeTransactionsHistoryPanel: () => {
            dispatch(closeTransactionsHistoryPanel())
        },
        renameFile: (id, name) => {
            dispatch(explorerActions.renameFile(id, name));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Control);
