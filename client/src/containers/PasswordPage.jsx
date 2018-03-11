import React from 'react';
import PropTypes from 'prop-types'; // ES6
import PasswordForm from '../components/PasswordForm.jsx';

class PasswordPage extends React.Component {

constructor(props, context) {
    super(props, context);
    this.state = {
      errors: {},
      user: {
        username: this.props.username,
        oldpassword: '',
        newpassword: ''
      }};
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }
    
processForm(event) {  
    // prevent default action, in this case, action is the form submission event.
    event.preventDefault();
    const username = encodeURIComponent(this.state.user.username);
    const oldpassword = encodeURIComponent(this.state.user.oldpassword);
    const newpassword = encodeURIComponent(this.state.user.newpassword);
    const formData = `username=${username}&oldpassword=${oldpassword}&newpassword=${newpassword}`; 
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/password');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {}
        });
        // set a message
        localStorage.setItem('successMessage', xhr.response.message);
        // make a redirect
       // this.context.router.replace('http://localhost:4000/login'); 
          this.context.router.replace('/');
      } else {
        // failure
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({errors});
      }
    });
    xhr.send(formData);
  }

  /**
   * Change the user object.
   *
   * @param {object} event - the JavaScript event object
   */
  changeUser(event) {
    const field = event.target.name;
    const user = this.state.user;
    user[field] = event.target.value;

    this.setState({
      user
    });
  }

  render() {
    return (
      <PasswordForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />);}}

PasswordPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default PasswordPage;
