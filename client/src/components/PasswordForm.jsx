import React from 'react';
import 'whatwg-fetch';
import PropTypes from 'prop-types'; // ES6
import {Link, IndexLink } from 'react-router';
import {Card} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
 
const cardStyle= {
  width: '420px',
  margin: 'auto',
  height: '440px',
  backgroundColor: 'white'
};

const divSty= {
    position: 'relative',
    top: '-20px',
    width: '420px',
    height: '390px'}

const PasswordForm = ({
  onSubmit,
  onChange,
  errors,
  user,
}) => (  
  <Card style={cardStyle}>
    <form action="/" onSubmit={onSubmit}>
    <div><nav className="navbar navbar-inverse">
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
         <li className="active"><Link to="/profile">Update Profile</Link></li>
    </ul>    
    </div>
  </div>
</nav>

      <div className="jumbotron text-center" style={divSty}>
    <h2><span className="fa fa-settings"></span> Change Password</h2>
     {errors.summary && <p className="error-message">{errors.summary}</p>}
    <div className="field-line">
        <TextField
          floatingLabelText="Current Password"
          type="password"
          name="oldpassword"
          errorText={errors.oldpassword}
          onChange={onChange}
          value={user.oldpassword}
        />
      </div>
    <div className="field-line">
        <TextField
          floatingLabelText="New Password"
          type="password"
          name="newpassword"
          errorText={errors.newpassword}
          onChange={onChange}
          value={user.newpassword}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Save Changes" primary />
      </div>
      </div>   
</div>
    </form>
  </Card>
);

PasswordForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired
};

export default PasswordForm;