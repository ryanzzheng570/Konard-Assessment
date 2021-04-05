import React, {Component} from 'react';
import PropTypes from 'prop-types';
import './labelModal.css';
import googleApi from "../../util/googleApi";

class LabelModal extends Component {
    static propTypes = {
        onCancel: PropTypes.func.isRequired,
        onCreate: PropTypes.func.isRequired
    };

    state = {
        labelName: ''
    };

    createLable = () => {
        const {onCreate} = this.props;
        const {labelName} = this.state;

        googleApi.createLabel(labelName).then(onCreate);
    };

    render() {
        const {onCancel} = this.props;
        const {labelName} = this.state;

        return (
            //Overlay is not showing 
            <div className="label-modal">
                <div className="label-modal__overlay">
            {/* pop up shaped */}
                <div className="label-modal__popup">
                    <button onClick={onCancel}>&times;</button>
                    <h2>New Label</h2>
                    <label>
                        <div>
                            Please enter a new label name:
                        </div>
                        <input value={labelName} onChange={e => this.setState({labelName: e.target.value})}/>
                    </label>
                    <div>
                        <button className="button button--default" onClick={this.createLable}>Create</button>
                        <button className="button button--default" onClick={onCancel}>Cancel</button>
                    </div>
                </div>

                </div>
            </div>
        );
    }
}

export default LabelModal;
