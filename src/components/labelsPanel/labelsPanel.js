import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './labelsPanel.css';
import LabelModal from '../labelModal/labelModal';
import Checkbox from '../checkbox/checkbox';

class LabelsPanel extends Component {
    static propTypes = {
        labels: PropTypes.array.isRequired,
        selectedLabelIdSet: PropTypes.object.isRequired,
        toggleLabel: PropTypes.func.isRequired,
        onLabelChanged: PropTypes.func.isRequired
    };

    state = {
        showLabelModal: false
    };

    onLabelCreated = () => {
        this.setState({showLabelModal: false});
        this.props.onLabelChanged();
    };

    render() {
        const {labels, selectedLabelIdSet, toggleLabel} = this.props;
        const {showLabelModal} = this.state;

        return (
            <div className="labels-panel">
                <h2 className="h2 labels-panel__header">Labels</h2>
                <button className="button button--primary" onClick={() => this.setState({showLabelModal: true})}>
                    New Label
                </button>
                <ul>
                    {labels.map(label => (
                        <li key={label.id}>
                            <label className="labels-panel__label-item">
                                <Checkbox
                                    className="labels-panel__checkbox"
                                    checked={selectedLabelIdSet.has(label.id)}
                                    onChange={() => toggleLabel(label)}/>
                                <span>{label.name}</span>
                            </label>
                        </li>
                    ))}
                </ul>
                {showLabelModal && (
                    <LabelModal onCancel={() => this.setState({showLabelModal: false})}
                                onCreate={this.onLabelCreated}/>
                )}
            </div>
        );
    }
}

export default LabelsPanel;
