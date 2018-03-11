import React from 'react';

class TermSelect extends React.Component {
  constructor(props) {
    super(props);
      this.state = {username: this.props.username, length: '10', number: '20'};
      this.handleISBNLgChange = this.handleISBNLgChange.bind(this);
      this.handleImageNoChange = this.handleImageNoChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
      this.handleClose = this.handleClose.bind(this);
  }
    
componentDidMount(){
    var username= this.state.username;
    if (username !== '')
    {//get search data from database for this user.
    username = encodeURIComponent(username);
    return fetch('/api/v1/data?username='+ username, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response) =>  response.json())
       .then((responseJson) => {
        var ISBNlg;
        var noImage;
        if (responseJson.length == null)
            ISBNlg = 10; else ISBNlg = responseJson.length;
        if (responseJson.number == null)
            noImage = 20; else noImage = responseJson.number; 
        this.props.onTermUpdate({length: ISBNlg, number: noImage});
        this.setState({length: ISBNlg, number: noImage});
})}}
    
handleISBNLgChange(event) {
    this.setState({length: event.target.value});
  }
    
handleImageNoChange(event) {
    this.setState({number: event.target.value});
  }
    
  handleSubmit(event) {
    this.props.onTermUpdate({length: this.state.length, number: this.state.number});
    this.props.onClose();
    event.preventDefault();
    if (this.state.username !== ''){
    var data = {length: this.state.length, number: this.state.number};
    data = encodeURIComponent(JSON.stringify(data));
    var username = encodeURIComponent(this.state.username);
    return fetch('/api/v1/updatedata1?username='+ username + '&data='+ data, {
      method: 'GET',
      //credentials: this.props.credentials,
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(() => {});  
   }
  else {}
  }
    
handleClose(){
  this.props.onClose();
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
        <div style={style1}>Search Criteria</div>
        <button type="button" className="close" aria-label="Close" onClick={this.handleClose}><span aria-hidden="true">&times;</span></button>
        
        <div style={{border: "2px solid black"}}></div>
      <form onSubmit={this.handleSubmit}>   
        <label>Preferred ISBN search length (digits):<br/>
        <input type="radio" value="10"  checked={this.state.length === '10'} onChange={this.handleISBNLgChange} /><span>&nbsp;10</span><br/>
        <input type="radio" value="13" checked={this.state.length === '13'} onChange={this.handleISBNLgChange} /><span>&nbsp;13</span><br/>
        </label>
        <br/>
        <span>Number of books to return when searching:</span><br/>
        <input type="radio" value="5" checked={this.state.number === '5'} onChange={this.handleImageNoChange}/><span>&nbsp;5</span><br/>
        <input type="radio" value="10" checked={this.state.number === '10'} onChange={this.handleImageNoChange}/><span>&nbsp;10</span><br/>
        <input type="radio" value="15" checked={this.state.number === '15'} onChange={this.handleImageNoChange}/><span>&nbsp;15</span><br/>
        <input type="radio" value="20" checked={this.state.number === '20'} onChange={this.handleImageNoChange}/><span>&nbsp;20</span><br/>
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

export default TermSelect;