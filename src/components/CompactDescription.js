import React, { Component } from 'react';

export const LabelCons = props => {
    const {isShort, value, length, onClick} = props
    return (
        <label 
          onClick={onClick}
          >
            {isShort ? value.substring(0, length) + "..." : value}
        </label>
    ); 
};

export default class CompactDescription extends Component {
    constructor (props) {
        super(props)
        this.state = {
            isShort: true
        };
    }

    getValue = (value, length) => {
        if(this.state) {
            return value.substring(0, length) + "...";
        } else {
            return value;
        }
    }

    handleClick = () => {
        var value = !this.state.isShort;
        this.setState({isShort: value})

        if(this.props.onClick) {
            this.props.onClick();
        }

    }

    render() {
        const {value, length} = this.props

        return (
            <LabelCons
                value={value}
                length={length}
                isShort={this.state.isShort}
                onClick={this.handleClick}
            />
        );
    }
}
