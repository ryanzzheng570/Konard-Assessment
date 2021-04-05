import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './labelDropdown.css';
import setUtil from '../../util/setUtil';
import googleApi from "../../util/googleApi";
import Checkbox from '../checkbox/checkbox';

class LabelDropdown extends Component {
    static propTypes = {
        cancel: PropTypes.func.isRequired,
        submit: PropTypes.func.isRequired,
        labels: PropTypes.array.isRequired,
        messages: PropTypes.array.isRequired
    };

    state = {
        selectedLabelIdSet: undefined
    };

    static getDerivedStateFromProps(nextProps) {
        const allLabelIdsSet = new Set(nextProps.labels.map(l => l.id));

        const labelIdSets = nextProps.messages
            .map(message => new Set(message.labelIds));


        const labelIdsSelectedInAllMessages = labelIdSets
            .reduce((labelsSetAccumulator, labelSet) => {
                return setUtil.intersect(labelsSetAccumulator, labelSet);
            });

        return {
            //Messages can have some labels like "SENT" that do not show up in the list of labels. This will filter them out.
            selectedLabelIdSet: setUtil.intersect(labelIdsSelectedInAllMessages, allLabelIdsSet)
        };
    }

    toggleLabel = (label) => {
        const {selectedLabelIdSet} = this.state;

        this.setState({
            selectedLabelIdSet: setUtil.immutableToggle(selectedLabelIdSet, label.id)
        })
    };

    /**
     * Adds each selected label and removes each unselected label from each message in this.props.messages using the
     * Gmail API. After all messages have been updated this.props.submit is called;
     */
    applyLabels = () => {
        const {labels, submit, messages} = this.props;
        const {selectedLabelIdSet} = this.state;

        //TODO: add/remove labels to/from messages

        submit();
    };

    render() {
        const {cancel, labels} = this.props;
        const {selectedLabelIdSet} = this.state;

        return (
            <div className="label-dropdown">
                <div className="label-dropdown__overlay" onClick={(e) => {
                    e.stopPropagation();
                    cancel();
                }}/>
                <div className="label-dropdown__content">
                    <div className="label-dropdown__title">Labels:</div>
                    <div className="label-dropdown__labels-section">
                        <ul>
                            {labels.map(label => (
                                <li key={label.id}>
                                    <label className="label-dropdown__label-item">
                                        <Checkbox
                                            className="label-dropdown__label-checkbox"
                                            checked={selectedLabelIdSet.has(label.id)}
                                            onChange={() => this.toggleLabel(label)}/>

                                        <span className="label-dropdown__label-text">{label.name}</span>
                                    </label>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div className="label-dropdown__actions-section">
                        <div className="label-dropdown__action-item" onClick={this.applyLabels}>
                            Apply
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LabelDropdown;
