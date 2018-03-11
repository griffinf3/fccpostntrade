import React, { Component } from 'react';
import PropTypes from 'prop-types';
import 'whatwg-fetch';
import 'url-search-params-polyfill';
import  GoogleIcon from 'react-icons/lib/fa/google';

class GoogleLogin2 extends Component {

  constructor(props) {
    super(props);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  onButtonClick() {
    return this.getRequestToken();}

  getRequestToken() {
    var popup = this.openPopup();
      popup.location = `https://accounts.google.com/o/oauth2/auth?redirect_uri=https://postntrade.herokuapp.com&response_type=code&client_id=223451400963-64p4trmlch68mc5fi1fvrhtl7vgf04rd.apps.googleusercontent.com&scope=https://www.googleapis.com/auth/analytics.readonly+https://www.googleapis.com/auth/userinfo.email&approval_prompt=force&access_type=offline`;
        this.polling(popup);}

  openPopup() {
    const w = this.props.dialogWidth;
    const h = this.props.dialogHeight;
    return window.open('', '', 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width='+w+', height='+h);
  }

  polling(popup) {
    const polling = setInterval(() => {
      if (!popup || popup.closed || popup.closed === undefined) {
        clearInterval(polling);
        this.props.onFailure(new Error('Popup has been closed by user'));
      }

      const closeDialog = () => {
        clearInterval(polling);
        popup.close();
      };

      try {
        if (!popup.location.hostname.includes('accounts.google.com') &&
              !popup.location.hostname == '') {
          if (popup.location.search) {
            const query = new URLSearchParams(popup.location.search);
            const googleCode = query.get('code');
            closeDialog();
              return this.getOauthToken(googleCode);} 
            else {closeDialog();
            return this.props.onFailure(new Error(
              'OAuth redirect has occurred but no query or hash parameters were found. ' +
              'They were either not set during the redirect, or were removed—typically by a ' +
              'routing library—before Google react component could read it.'
            ));
          }
        }
      } catch (error) {
        // Ignore DOMException: Blocked a frame with origin from accessing a cross-origin frame.
        // A hack to get around same-origin security policy errors in IE.
      }
    }, 500);
  }

  getOauthToken(googleCode) {
    return window.fetch(`${this.props.loginUrl}?code=${googleCode}`, {
      method: 'POST',
      credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(response => {
      this.props.onSuccess(response);
    }).catch(error => {
      return this.props.onFailure(error);
    });
  }

  getDefaultButtonContent() {
    const defaultIcon = this.props.showIcon? <GoogleIcon color='#00aced' size={25}/> : null;
    return (
      <span>
        {defaultIcon} {this.props.text}
      </span>
    );
  }

  render() {
    const googleButton = React.createElement(
      this.props.tag, {
        onClick: this.onButtonClick,
        style: this.props.style,
        disabled: this.props.disabled,
        className: this.props.className,
      }, this.props.children ? this.props.children : this.getDefaultButtonContent()
    );
    return googleButton;
  }
}

GoogleLogin2.propTypes = {
  tag: PropTypes.string,
  text: PropTypes.string,
  loginUrl: PropTypes.string.isRequired,
  onFailure: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  dialogWidth: PropTypes.number,
  dialogHeight: PropTypes.number,
  showIcon: PropTypes.bool,
  credentials: PropTypes.oneOf(['omit', 'same-origin', 'include']),
};

GoogleLogin2.defaultProps = {
  tag: 'button',
  text: 'Sign in with Google',
  disabled: false,
  dialogWidth: 600,
  dialogHeight: 400,
  showIcon: true,
  credentials: 'same-origin'
};

export default GoogleLogin2;