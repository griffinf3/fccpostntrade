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
  height: '590px'};

const divSty= {
    position: 'relative',
    top: '-20px',
    width: '420px',
    height: '495px'};

const LoginForm = ({
  onSubmit,
  onChange,
  errors,
  successMessage,
  loc,
  user
}) => (
<Card style={cardStyle}>
    <form action="/" onSubmit={onSubmit}>  
    <nav className="navbar navbar-inverse"><div>
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
    <h2><span className="fa fa-sign-in"></span> Login</h2>
     {successMessage && <p className="success-message">{successMessage}</p>}
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
        <RaisedButton type="submit" label="Log in" primary />
      </div>
      <CardText>Don't have an account? <Link to={loc}>Create one</Link>.</CardText>
     </div>
    </form>
  </Card>
);

LoginForm.PropTypes = {
  onSubmit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  successMessage: PropTypes.string.isRequired,
  loc: PropTypes.string.isRequired,
  user: PropTypes.object.isRequired
};

export default LoginForm;
