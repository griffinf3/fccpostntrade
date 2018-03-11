import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import TwitterLogin from 'react-twitter-auth';
import GoogleLogin2 from './GoogleLogin2.jsx';
import ReactConfirmAlert from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css';
import {browserHistory} from 'react-router';
import Auth from '../modules/Auth';

class SignLog extends Component {
    
constructor(props){
        super(props);
        this.state = { isAuthenticated: false, user: {local: {username: ''}}, token: '', showDialog: false, firstname: "", lastname: "", email: "", city: "", state: "", length: "", number: "", size: ""};
    this.onSuccess = this.onSuccess.bind(this);
    this.onFailed = this.onFailed.bind(this);
    this.logout = this.logout.bind(this);
    this.handleCancel =  this.handleCancel.bind(this);
    this.doCancel = this.doCancel.bind(this);
    this.handleNewUser =  this.handleNewUser.bind(this);
    }
    
componentDidMount(){
    //remove user account which has a username but not a password. 
    //This is to remove a temp username which may have been created when a user attempted to
    //login with google or twitter and did not complete the local signup/login.
    this.doCancel();}
    
doCancel(){
    return fetch('/api/v1/delete', {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {this.setState({}); });}  
 
handleCancel(){
 //remove account with temp username.
 this.setState({user:{local: {username:''}}});
 this.doCancel();}

handleNewUser(){
    var username = this.state.user.local.username;
    //encode username.
    username = encodeURIComponent(username);
    browserHistory.push('/signlog?tmpusrnme='+ username); // no longer in React Router V4
}
    
onSuccess(response) {
  const token = response.headers.get('x-auth-token');
  response.json().then((responseJson) => {if (responseJson.newStatus === (true))
  {this.setState({showDialog:true, isAuthenticated: false, user: responseJson.user, token: ''});}
  else {
    // save the token
    if (token) {Auth.authenticateUser(token);
    this.setState({isAuthenticated: true, user: responseJson.user, token: token});
    this.props.getCurrentUser(this.state.user.local.username);
    var username = encodeURIComponent(responseJson.user.local.username);     
    return fetch('/api/v1/data?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => { 
this.props.onDataUpdate({lastname: responseJson.lastname, firstname: responseJson.firstname, city: responseJson.city, state: responseJson.state, email:responseJson.email, length:responseJson.length, number:responseJson.number, size:responseJson.size});}).then(() => {browserHistory.push('/');});
// no longer in React Router V4}); 
      }}});}
onFailed (error) {};
    
logout () {
    this.setState({isAuthenticated: false, token: '', user: null})
  };
    
render() {
    let content1 = !!this.state.isAuthenticated ?
    (
      <div>
      </div>
    ) :
    (
      <TwitterLogin text="Twitter"
                      loginUrl="/api/v1/auth/twitter"
                      onFailure={this.onFailed} onSuccess={this.onSuccess}
                      requestTokenUrl="/api/v1/auth/twitter/reverse"/>
    );
    
    let content2 = !!this.state.isAuthenticated ?
    (
      <div>
      </div>
    ) :
    (
       <GoogleLogin2 loginUrl="/api/v1/auth/google" onFailure={this.onFailed} onSuccess={this.onSuccess}/>      
    );
        
 const divSty= {
  width: '600px',
  margin: 'auto',
  position: 'relative',
  top: '60px'
};
    
const divSty2= {
    position: 'relative',
    top: '-20px' }
   
if (this.props.location.query.tmpusrnme !== undefined)
{
var loc = "/signup?tmpusrnme=" + this.props.location.query.tmpusrnme;
var loc2 = "/login?tmpusrnme=" + this.props.location.query.tmpusrnme;
}  
else 
{loc = "/signup"; 
 loc2 = "/login"; 
}
    
return (
  <div style={divSty}>
  <nav className="navbar navbar-inverse">
  <div className="container-fluid">
  <ul className="nav navbar-nav">
  <li className="active"><IndexLink to="/">Home</IndexLink></li>
  </ul>
  </div>
</nav>      
      <div style={divSty2} className="jumbotron text-center">
        <p>Login or Register with:</p> 
        <div className="btn btn-default"><span className="fa fa-user"></span><Link to={loc2}>&nbsp;Local Login</Link></div><span>&nbsp;</span>
        <div className="btn btn-default"><span className="fa fa-user"></span><Link to={loc}>&nbsp;Local Signup</Link></div>
<span>&nbsp;{content1}&nbsp;</span>
<span>{content2}</span>
{this.state.showDialog &&
          <ReactConfirmAlert
            title=""
            message= 'In order to sign in with your Google or Twitter account, you must first have a local account set up with a username and password. If you already have a local account, please click "continue" and then "login" at this time; otherwise, click "continue" and select "sign up".'
            confirmLabel="Continue"
            cancelLabel="Cancel"
            onConfirm={() => {this.handleNewUser(); this.setState({showDialog: false});}}
            onCancel={() => {this.handleCancel(); this.setState({showDialog: false});}}
          />
  }</div></div>
    );
  }
}

export default SignLog;
