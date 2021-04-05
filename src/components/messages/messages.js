import React, {Component} from 'react';
import PropTypes from 'prop-types';
import googleApi from "../../util/googleApi";
import "./messages.css";
import moment from 'moment';
import labelImg from '../../img/label.png';
import arrowDownImg from '../../img/arrowDown.png';
import LabelDropdown from '../labelDropdown/labelDropdown';
import Checkbox from '../checkbox/checkbox';
import setUtil from '../../util/setUtil';
import messageUtil from '../../util/messageUtil';

class Messages extends Component {
    static propTypes = {
        selectedLabelIdSet: PropTypes.object.isRequired,
        labels: PropTypes.array.isRequired
    };

    state = {
        messages: [],
        selectedMessageIdSet: new Set(),
        showLabelsDropdown: false
    };

    componentDidMount() {
        googleApi.getMessages()
            .then(messages => this.setState({messages}));
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedLabelIdSet !== this.props.selectedLabelIdSet) {
            this.reloadMessages();
        }
    }

    reloadMessages = () => {
        return messageUtil.getMessagesForLabels(Array.from(this.props.selectedLabelIdSet))
            .then(messages => this.setState({messages, selectedMessageIdSet: new Set()}));
    };

    toggleSelectedMessage(message) {
        this.setState({
            selectedMessageIdSet: setUtil.immutableToggle(this.state.selectedMessageIdSet, message.id)
        });
    }

    cancelLabelDropdown = () => {
        this.setState({showLabelsDropdown: false});
    };

    submitLabelDropdown = () => {
        this.setState({showLabelsDropdown: false});
        this.reloadMessages();
    };

    getSelectedMessages = () => {
        const {messages, selectedMessageIdSet} = this.state;

        return messages.filter(m => selectedMessageIdSet.has(m.id));
    };

    getMessageListLabels = (message) => {
        const {labels} = this.props;

        return message.labelIds
            .map(id => labels.find(l => l.id === id))
            .filter(label => label && label.messageListVisibility === 'show');
    };

    //Handler for Select All Check Box
    handleSelectAllCheckBox =(e) => {
        const {value} = e.target;
        const {selectedMessageIdSet} = this.state;

        //When the size is 0 then assign all messages to selected message id set
        if(value === "on" && selectedMessageIdSet.size === 0) {          
            const allMessageIdSet = this.getAllMessagesIdSet();
            this.setState({ selectedMessageIdSet: allMessageIdSet });
        }
        //No message selected upon other two condition (interminate and the checkbox is currently checked)
        else {
            this.setState({ selectedMessageIdSet: new Set() });
        }
    }

    //Turn all message id into a set
    getAllMessagesIdSet() {
        const {messages} = this.state;
        return new Set(messages.map(message => message.id));
    }

    render() {
        const {labels} = this.props;
        const {messages, selectedMessageIdSet, showLabelsDropdown} = this.state;

        return (
            <div className="messages">
                <div className="messages__content">
                    <div className="messages__header">
                        <h2 className="h2">Messages</h2>
                        <div className="messages__label-button-container">
                            {selectedMessageIdSet.size > 0 && (
                                <button
                                    className="button button--default"
                                    onClick={() => this.setState({showLabelsDropdown: true})}
                                >
                                    <img src={labelImg} alt="label"/>
                                    <img className="messages__dropdown-arrow" src={arrowDownImg} alt="dropdown"/>
                                </button>
                            )}
                            {showLabelsDropdown && (
                                <LabelDropdown
                                    cancel={this.cancelLabelDropdown}
                                    submit={this.submitLabelDropdown}
                                    labels={labels}
                                    messages={this.getSelectedMessages()}
                                />
                            )}
                        </div>
                    </div>

                    <table className="messages__table">
                        <thead>
                        <tr className="messages__row">
                            <th className="messages__selected-col">
                                {/* Added Select All Checkbox Functionality*/}
                                <Checkbox 
                                onChange={this.handleSelectAllCheckBox} 
                                checked={selectedMessageIdSet.size === 0 ? false : 
                                    selectedMessageIdSet.size === messages.length ? true : undefined}
                                    />
                            </th>
                            <th className="messages__from-col">From</th>
                            <th>Subject</th>
                            <th className="messages__date-col">Sent</th>
                        </tr>
                        </thead>
                        <tbody>
                        {messages.map(message => (
                            <tr key={message.id} onClick={() => this.toggleSelectedMessage(message)} className={`
                                messages__row
                                ${selectedMessageIdSet.has(message.id) && 'messages__row--selected'}
                            `}>
                                <td className="messages__selected-col">
                                    <Checkbox
                                        checked={selectedMessageIdSet.has(message.id)}
                                        onChange={() => this.toggleSelectedMessage(message)}
                                    />
                                </td>
                                <td className="messages__from-col">
                                    {message.headerMap['From'] && message.headerMap['From'].replace(/<.*?>/, '')}
                                </td>
                                <td>
                                    {this.getMessageListLabels(message).map(label => (
                                        <span key={label.id} className="messages__label">{label.name}</span>
                                    ))}
                                    <span>{message.headerMap['Subject']} </span>
                                    - <span className="messages__snippet"
                                            dangerouslySetInnerHTML={{__html: message.snippet}}/>
                                </td>
                                <td className="messages__date-col">
                                    {moment.utc(Number(message.internalDate)).local().format('MMM D')}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default Messages;
