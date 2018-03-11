import React from 'react';
import fccLogo from '../img/fcc.jpg';
class Help extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {show: this.props.show};
    this.handleClose = this.handleClose.bind(this);
  }
     
handleClose(){
  this.props.onHide(); 
}
  
  render() {
      
  const divStyle = {
      color: 'black',
      backgroundColor: 'lightgrey',
      margin: '20px',
      padding: '2em',
      border: '1px solid black',
      borderRadius: '5px',
  }  
    return (
      <div>
       { this.props.show ? (<div style={divStyle}>
         <button type="button" className="close" aria-label="Close" onClick={this.handleClose}> <span aria-hidden="true">&times;</span></button>
        <div style={{display:"inline", fontSize: "30px", fontFamily: "Cooper Black"}}>Post-n-Trade</div>
        		<div style={{display: "inline"}}> is a Free Code Camp (FCC) <a href="https://www.freecodecamp.org/griffinf3" target="_blank" rel="noopener noreferrer">
<img alt="FreeCodeCamp profile" src = {fccLogo}
      style = {{ border: 0, width: 30, height: 30 }}/>
</a> book search and trading application developed by Franklin Griffin. This project was written to fulfill part of FCC's requirements for certification in backend website development. In order to search and trade books on this site, users are required to have a password protected account with a unique username. Use the 'Search' option accessed through the main menu to search the <a href="https://developers.google.com/books/" target="_blank" rel="noopener noreferrer">Google Books</a> database. Searches can be made by entering either a book title or ISBN number. Use the Options button in the main menu to specify the length of the ISBN number you will be searching. Try the advanced search link in the Search Page if you get stuck and are unable to locate your book using the simple title/ISBN search method. After locating your book in the database, you will be able to do the following:</div> 
<ol>
<li>Select a book returned in the Search Results and Post the item as available for trade. Select either by using the Previous and Next Button Selectors or by clicking directly on a book's image.</li>
<li>View additional information on any item returned.</li>
</ol>
<p>Books posted for trade can be viewed either as the user's filtered collection of posted books by clicking 'My Books' in the main menu or, alternatively, by clicking 'All Books' for the page which displays the totality of books that all users have posted and that are either available for trade or in the process of being traded, e.g., awaiting owner confirmation.</p>

<h3>Login:</h3>
<p>There are three options for signing in as an authorized user:</p>
<ol>
<li>Sign up and log in solely with a username and password.</li>
<li>Sign up and log in with a Twitter account.</li>
<li>Sign up and log in with a Google account.</li>
</ol>
<p>
A unique username is required of all registered users.  Therefore, all users, regardless of their preference for logging in will first be required to set up a local account with a username and password.  In order to use Google or Twitter as a login method, your Google/Twitter account will be linked to your local account.  After clicking the Twitter/Google login button, the linking takes place after the user inputs the local signin/login information.  On subsequent logins, a user can rapidly login just by clicking the Goggle (or Twitter) login button.</p>
</div>)
        : (<div></div>)
  }
      </div>
    )
  }
}

export default Help;