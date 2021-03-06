'use strict';

const {Component} = require('react');
const {genericName, nullToString, omitNonStandardAttrs} = require('../lib/util');
const {noop} = require('../lib/dash');
const PropTypes = require('prop-types');
const React = require('react');
const cc = require('classnames');

const cssModules = {
  l: require('../style/textarea/textarea-l.css'),
  m: require('../style/textarea/textarea-m.css'),
  s: require('../style/textarea/textarea-s.css'),
};

class Textarea extends Component {
  css = tokenName => genericName(this.props, tokenName)

  focus() {
    if (!this._textarea) return;
    this._textarea.focus();
  }

  select() {
    if (!this._textarea) return;
    this._textarea.select();
  }

  _onChange = e => {
    const {name} = this.props;
    const value = e.target.value;

    this.props.onChange(e, {name, value});
  }

  render() {
    const {
      autoComplete,
      autoFocus,
      className,
      children,
      cols,
      defaultValue,
      disabled,
      id,
      maxLength,
      name,
      placeholder,
      readOnly,
      rows,
      value,
    } = this.props;

    const {css} = this;

    return (
      <textarea
        {...omitNonStandardAttrs(this.props)}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className={cc(css('control'), className)}
        cols={cols}
        defaultValue={nullToString(defaultValue)}
        disabled={disabled}
        id={id}
        maxLength={maxLength}
        name={name}
        onChange={this._onChange}
        placeholder={placeholder}
        readOnly={readOnly}
        rows={rows}
        ref={r => this._textarea = r}
        value={nullToString(value)}>
        {children}
      </textarea>
    );
  }
}

Textarea.defaultProps = {
  onChange: noop,
  size: 'm',
  styles: cssModules,
  rows: '3',
};

Textarea.propTypes = {
  autoComplete: PropTypes.oneOf([
    'off',
    'on',
  ]),
  autoFocus: PropTypes.bool,
  children: PropTypes.string,
  className: PropTypes.string,
  cols: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  defaultValue: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  maxLength: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  readOnly: PropTypes.bool,
  rows: PropTypes.oneOfType([
    PropTypes.number,
    PropTypes.string,
  ]),
  size: PropTypes.oneOf([
    'l',
    'm',
    's',
  ]),
  styles: PropTypes.object,
  value: PropTypes.string,
};

module.exports = Textarea;
