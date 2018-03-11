import React from 'react';

class PresSelect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {username: this.props.username, size: 'small'};
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }
    
componentDidMount(){
    this.setState({username:this.props.username});
    var username= this.state.username;
    if (username !== '')
    {//get pres data from database for this user.
    username = encodeURIComponent(username);
    return fetch('/api/v1/data?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {  
        var imageSize;
        if (responseJson.size == null)
            imageSize = 'small'; else imageSize = responseJson.size;   
        this.props.onPresUpdate({size:imageSize});
    this.setState({size: imageSize});
});}}
    
handleSizeChange(event) {
    this.setState({size: event.target.value});
  }
       
handleClose(){
  this.props.onClose();
}

handleSubmit(event) {
    this.props.onClose();
    this.props.onPresUpdate(this.state.size);
    event.preventDefault();
    if (this.state.username !== ''){
    var data = this.state.size;
    data = encodeURIComponent(JSON.stringify(data)); 
    var username = encodeURIComponent(this.state.username);
    return fetch('/api/v1/updatedata2?username='+ username + '&data='+ data, {
    method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {});
  }
  else {}
  }

  render() {
      const style1 = {
display: 'inline'
}
const canBtn = {
marginLeft: '50px', 
display: 'inline',
position: 'relative',
left: '30px',
top: '-26px'
}
    return (  
        <div>
        <div style={style1}>Presentation (Image Size)</div>
    
    <button type="button" className="close" aria-label="Close" onClick={this.handleClose}><span aria-hidden="true">&times;</span></button>
        <div style={{border: "2px solid black"}}></div> 
    
    <form onSubmit={this.handleSubmit}>
                    <label>
        <input type="radio" value="small" checked={this.state.size === 'small'} onChange={this.handleSizeChange}/><span>&nbsp;small</span><br/>
        <input type="radio" value="medium" checked={this.state.size === 'medium'} onChange={this.handleSizeChange}/><span>&nbsp;medium</span><br/>
        <input type="radio" value="large" checked={this.state.size === 'large'} onChange={this.handleSizeChange}/><span>&nbsp;large</span><br/>
        </label>
          <div style={{marginTop: '10px'}}>  
        <input type="submit" value="Submit" />
            </div>
             </form> 
                 <div style={canBtn}>
    <button onClick={this.handleClose}>Cancel</button></div>
    </div>
    );
  }
}

export default PresSelect;