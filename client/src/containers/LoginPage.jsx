import React from 'react';
import Auth from '../modules/Auth';
import LoginForm from '../components/LoginForm.jsx';
import propTypes from 'prop-types';
import {browserHistory} from 'react-router';

class LoginPage extends React.Component {

constructor(props, context) {
    super(props, context);
    const storedMessage = localStorage.getItem('successMessage');
    let successMessage = '';
    if (storedMessage) {
      successMessage = storedMessage;
      localStorage.removeItem('successMessage');
    }
    // set the initial component state
    this.state = {
      errors: {},
      successMessage,
      user: {
        username: '',
        password: ''
      }
    };
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
    var tmpusrnme = '';
    if (this.props.location.query.tmpusrnme !== undefined) {   
    tmpusrnme = encodeURIComponent(this.props.location.query.tmpusrnme);
    }  
    const username = encodeURIComponent(this.state.user.username);
    const password = encodeURIComponent(this.state.user.password);
    const formData = `username=${username}&password=${password}&tmpusrnme=${tmpusrnme}`;
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/login');
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.responseType = 'json';
    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        // success
        // change the component-container state
        this.setState({
          errors: {}
        });
        // save the token
        Auth.authenticateUser(xhr.response.token);
        return fetch('/api/v1/data?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {                
this.props.onDataUpdate({firstname: responseJson.firstname, lastname: responseJson.lastname, email: responseJson.email, city: responseJson.city, state: responseJson.state, length: responseJson.length, number: responseJson.number, size: responseJson.size});}).then(() => {   
        // change the current URL to /
        // this.context.router.replace('/'); 
        //this may work just at well:
         browserHistory.push('/');
        //
       //no longer in React Router V4});  
      });} else {
        // failure
        // change the component state
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

    this.setState({
      user
    }); 
      if (event.target.name === 'username')
      {this.props.getCurrentUser(event.target.value);}
  }

  render() {
if (this.props.location.query.tmpusrnme !== undefined)
{var loc = "/signup?tmpusrnme=" + this.props.location.query.tmpusrnme;}  
else 
{loc = "/signup";}
    return (
      <LoginForm loc = {loc}
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        successMessage={this.state.successMessage}
        user={this.state.user}
      />
    );}}

LoginPage.contextTypes = {
  router: propTypes.object.isRequired
};

export default LoginPage;
