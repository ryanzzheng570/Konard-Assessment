import React, {Component} from 'react';
import ReactDom from 'react-dom';
import PropTypes from 'prop-types';
import './checkbox.css';
import checkmarkImg from '../../img/checkmark.png';
import checkmarkIndeterminateImg from '../../img/checkmark-indeterminate.png';

class Checkbox extends Component {
    static propTypes = {
        //true - checked
        //false - unchecked
        //undefined - indeterminate
        checked: PropTypes.bool
    };

    componentDidMount() {
        this.updateIndeterminate();
    }

    componentDidUpdate(previousProps) {
        if (previousProps.checked !== this.props.checked) {
            this.updateIndeterminate();
        }
    }

    updateIndeterminate = () => {
        const node = ReactDom.findDOMNode(this);
        node.indeterminate = this.props.checked === undefined;
    };

    render() {
        const { checked, className, ...inputProps } = this.props;
        return (
            <span className="checkbox__container">
                {checked === true && <img className="checkbox__checkmark" src={checkmarkImg} alt=""/>}
                {checked === undefined && <img className="checkbox__checkmark" src={checkmarkIndeterminateImg} alt=""/>}
                <input type="checkbox" checked={checked === true} className={`checkbox__input ${className}`} {...inputProps} />
                <span className="checkbox__box"/>
            </span>
        );
    }
}

export default Checkbox;