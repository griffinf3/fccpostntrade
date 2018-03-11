import React from 'react';
import PropTypes from 'prop-types'; // ES6
import SettingsForm from '../components/SettingsForm.jsx';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';

class SettingsPage extends React.Component {

constructor(props, context) {
    super(props, context);
    this.state = {
      errors: {},
      user: {
        username: this.props.username,
        firstname: this.props.firstname,
        lastname: this.props.lastname,
        email: this.props.email,
        city: this.props.city,
        state: this.props.state
      }};
    this.processForm = this.processForm.bind(this);
    this.changeUser = this.changeUser.bind(this);
  }
    
componentDidMount(){
    if (Auth.isUserAuthenticated())
     {//should not be authenticated without a password
         //if username is '', then logout.
     if (this.state.user.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
       else{}}
      //if not authenticated:
     else {this.setState({user: {username: ''}});
          this.props.updateUsername('');
          browserHistory.push('/');
         };} 

processForm(event) {   
    // prevent default action. in this case, action is the form submission event
    event.preventDefault();
    const username = encodeURIComponent(this.state.user.username);
    const firstname = encodeURIComponent(this.state.user.firstname);
    const lastname = encodeURIComponent(this.state.user.lastname);
    const email = encodeURIComponent(this.state.user.email);
    const city = encodeURIComponent(this.state.user.city);
    const state = encodeURIComponent(this.state.user.state);
    const formData = `username=${username}&firstname=${firstname}&lastname=${lastname}&email=${email}&city=${city}&state=${state}`; 
    // create an AJAX request
    const xhr = new XMLHttpRequest();
    xhr.open('post', '/auth/settings');
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
          this.props.onProfileUpdate({firstname: this.state.user.firstname, lastname: this.state.user.lastname, email: this.state.user.email, city: this.state.user.city, state: this.state.user.state}); 
          this.context.router.replace('/');
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
    this.setState({
      user
    });
  }

  render() {
    return (
      <SettingsForm
        onSubmit={this.processForm}
        onChange={this.changeUser}
        errors={this.state.errors}
        user={this.state.user}
      />
    );}}

SettingsPage.contextTypes = {
  router: PropTypes.object.isRequired
};

export default SettingsPage;
