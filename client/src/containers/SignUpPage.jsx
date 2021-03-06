import React from 'react';
import PropTypes from 'prop-types'; // ES6
import SignUpForm from '../components/SignUpForm.jsx';

class SignUpPage extends React.Component {

constructor(props, context) {
    super(props, context);
    // set the initial component state
    this.state = {
      errors: {},
      user: {
        username: '',
        password: '' }};
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }
  
  /**
   * Process the form.
   *
   * @param {object} event - the JavaScript event object
   */
  processForm(event) {  
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    var tmpusrnme = '';
    if (this.props.location.query.tmpusrnme !== undefined) {   
    tmpusrnme = encodeURIComponent(this.props.location.query.tmpusrnme);
    }   
    const formData = `username=${username}&password=${password}&tmpusrnme=${tmpusrnme}`;
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/signup');
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
        // redirect
        // this.context.router.replace('http://localhost:4000/login');
          this.context.router.replace('/login');
      } else {
        // failure
        const errors = xhr.response.errors ? xhr.response.errors : {};
        errors.summary = xhr.response.message;
        this.setState({
          errors
        });
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
    this.setState({user});}

  render() {
      if (this.props.location.query.tmpusrnme !== undefined)
{var loc = "/login?tmpusrnme=" + this.props.location.query.tmpusrnme;}  
else 
{loc = "/login";}
      
    return (
      <SignUpForm loc = {loc}
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />);}}

SignUpPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SignUpPage;
