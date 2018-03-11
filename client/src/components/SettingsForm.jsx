import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types'; // ES6
import {Link, IndexLink } from 'react-router';
import {Card} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
 
const cardStyle= {
  width: '400px',
  margin: 'auto',
  height: '750px',
  backgroundColor: 'white'
};

const divSty2= {
    position: 'relative',
    top: '-20px',
    height: '700px',
    width: '400px'}

const SettingsForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (  
  <Card style={cardStyle}>
    <form action="/" onSubmit={onSubmit}>
    <nav className="navbar navbar-inverse">
    <div>
    <div className="navbar-header">
      <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>
        <span className="icon-bar"></span>                        
      </button>
    </div>
    <div className="collapse navbar-collapse" id="myNavbar">
    <ul className="nav navbar-nav">
        <li className="active"><IndexLink to="/">Home</IndexLink></li>
   </ul>
     <ul className="nav navbar-nav navbar-right">
         <li className="active"><Link to="/password">Change Password</Link></li>
    </ul>    
    </div>
  </div>
</nav>
      <div className="jumbotron text-center" style={divSty2}>
    <h2><span className="fa fa-settings"></span> Settings</h2>
     {errors.summary && <p className="error-message">{errors.summary}</p>}
    <div className="field-line">
        <TextField
          floatingLabelText="First Name"
          name="firstname"
          errorText={errors.firstname}
          onChange={onChange}
          value={user.firstname}
        />
      </div>
    <div className="field-line">
        <TextField
          floatingLabelText="Last Name"
          name="lastname"
          errorText={errors.lastname}
          onChange={onChange}
          value={user.lastname}
        />
      </div>
     <div className="field-line">
        <TextField
          floatingLabelText="email address"
          name="email"
          errorText={errors.email}
          onChange={onChange}
          value={user.email}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="City"
          name="city"
          errorText={errors.city}
          onChange={onChange}
          value={user.city}
        />
      </div>
     <div className="field-line">
        <TextField
          floatingLabelText="State"
          name="state"
          errorText={errors.state}
          onChange={onChange}
          value={user.state}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Save Changes" primary />
      </div>
      </div>   
    </form>
  </Card>
);

SettingsForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default SettingsForm;