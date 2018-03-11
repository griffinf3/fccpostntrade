import React from 'react';
import PropTypes from 'prop-types'; // ES6
import { Link, IndexLink } from 'react-router';
import { Card, CardText } from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';

const cardStyle= {
  width: '420px',
  margin: 'auto',
  backgroundColor: 'white',
  height: '550px'
};

const divSty= {
    position: 'relative',
    top: '-20px',
    width: '420px',
    height: '500px'}

const SignUpForm = ({
  onSubmit,
  onChange,
  loc,
  errors,
  user,
}) => (  
  <Card style={cardStyle}>
    <form action="/" onSubmit={onSubmit}>
    <div><nav className="navbar navbar-inverse"><div>
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
    </div>
  </div>
</nav>
      <div className="jumbotron text-center" style={divSty}>
    <h2><span className="fa fa-sign-in"></span> Signup</h2>
     {errors.summary && <p className="error-message">{errors.summary}</p>}
      <div className="field-line">
        <TextField
          floatingLabelText="Username"
          name="username"
          errorText={errors.username}
          onChange={onChange}
          value={user.username}
        />
      </div>
      <div className="field-line">
        <TextField
          floatingLabelText="Password"
          type="password"
          name="password"
          onChange={onChange}
          errorText={errors.password}
          value={user.password}
        />
      </div>
      <div className="button-line">
        <RaisedButton type="submit" label="Create New Account" primary />
      </div>
      <CardText>Already have an account? <Link to={loc}>Log in</Link></CardText>
      </div>   
</div>
    </form>
  </Card>
);

SignUpForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loc: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default SignUpForm;
