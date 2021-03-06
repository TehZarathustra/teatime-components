'use strict';

const {Component} = require('react');
const {isControlled, genericName, nullToString, omitNonStandardAttrsAndHandlers} = require('../lib/util');
const {isUndefined, noop} = require('../lib/dash');
const PropTypes = require('prop-types');
const React = require('react');
const cc = require('classnames');
const warn = require('../lib/warn');

const cssModules = {
  l: require('../style/input/input-l.css'),
  m: require('../style/input/input-m.css'),
  s: require('../style/input/input-s.css'),
};

let didWarnForInputDefaultValue = false;

class Input extends Component {
  constructor(props) {
    super(props);

    this._controlled = isControlled(props);

    if (process.env.NODE_ENV !== 'production')
      if (this._controlled && !isUndefined(props.defaultValue) && !didWarnForInputDefaultValue) {
        didWarnForInputDefaultValue = true;
        warn(true, 'defaultValue', 'Input', props.type);
      }

    const value = this._controlled
      ? props.value
      : props.defaultValue;

    this.state = {
      value: isUndefined(value) ? '' : nullToString(value),
    };
  }

  componentWillReceiveProps(nextProps) {
    this._controlled = isControlled(nextProps);

    this.setState({
      value: this._controlled
        ? nullToString(nextProps.value)
        : this.state.value,
    });
  }

  css = tokenName => genericName(this.props, tokenName)

  focus() {
    if (!this._input) return;
    this._input.focus();
  }

  select() {
    if (!this._input) return;
    this._input.select();
  }

  _onChange = e => {
    const {name} = this.props;
    const value = e.target.value;

    if (!this._controlled) this.setState({value});
    this.props.onChange(e, {name, value});
  }

  _onClear = e => {
    const {name, onChange} = this.props;
    const value = '';
    const onClose = this.props.onClose || (() => {});

    if (!this._controlled) this.setState({value});
    onChange(e, {name, value});
    onClose(e, {name, value});
    this.focus();
  }

  render() {
    const {className} = this.props;
    const {css} = this;

    return (
      <span
        {...omitNonStandardAttrsAndHandlers(this.props)}
        className={cc(css('wrapper'), className)}
        onChange={void 0}>
        {this.renderClear()}
        {this.renderInput()}
      </span>
    );
  }

  renderClear() {
    const {disabled} = this.props;
    const {value} = this.state;

    if (disabled || !value) return null;

    const {css} = this;

    return (
      <span
        className={css('clear')}
        onClick={this._onClear}/>
    );
  }

  renderInput() {
    const {
      autoComplete,
      autoFocus,
      disabled,
      id,
      maxLength,
      name,
      onBlur,
      onFocus,
      placeholder,
      readOnly,
      type,
    } = this.props;

    const {value} = this.state;
    const {css} = this;

    return (
      <input
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={css('control')}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={name}
        onBlur={onBlur}
        onChange={this._onChange}
        onFocus={onFocus}
        placeholder={placeholder}
        readOnly={readOnly}
        ref={r => this._input = r}
        type={type}
        value={value}/>
    );
  }
}

Input.defaultProps = {
  onChange: noop,
  size: 'm',
  styles: cssModules,
  type: 'text',
};

Input.propTypes = {
  autoComplete: PropTypes.oneOf([
    'off',
    'on',
  ]),
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  maxLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onClose: PropTypes.func,
  onFocus: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  size: PropTypes.oneOf([
    'l',
    'm',
    's',
  ]),
  styles: PropTypes.object,
  type: PropTypes.string,
  value: PropTypes.string,
};

module.exports = Input;
