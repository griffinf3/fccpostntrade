import React, { Component } from 'react';
import { Link, IndexLink } from 'react-router';
import OptModal from './OptModal.jsx';
import PresModal from './PresModal.jsx';
import Auth from '../modules/Auth';
import settings from './settings.png';

class MenuNav extends Component {
    
constructor(props){
        super(props);
        this.state = {modal1: false, modal2: false, username: this.props.username, length: this.props.length, number: this.props.number, size: this.props.size};
        this.handleShowHelp = this.handleShowHelp.bind(this);
        this.handleShowHome = this.handleShowHome.bind(this);
        this.handleSearchOpt = this.handleSearchOpt.bind(this);
        this.handlePres = this.handlePres.bind(this);
        this.handleonCloseOpt = this.handleonCloseOpt.bind(this);
        this.handleUpdateTerm = this.handleUpdateTerm.bind(this);
        this.handleUpdatePres = this.handleUpdatePres.bind(this);
        this.handleonClosePres = this.handleonClosePres.bind(this);
    }
         
handleSearchOpt(){
    this.setState({modal1:true});
}
    
handlePres(){
    this.setState({modal2:true});
}  
    
handleonCloseOpt(){
     this.setState({modal1:false});
}
       
handleonClosePres(){
     this.setState({modal2:false});
}
         
handleShowHelp(){
    this.props.showHelp();    
}
    
handleShowHome(){
    this.props.showHome();    
}
    
handleUpdateTerm(data){
 //get this data to the parent.
this.props.termUpdate(data); 
}
    
handleUpdatePres(data){
   //get this data to the parent.
    this.props.presUpdate(data);   
}
    
  render() {      
let content1 = Auth.isUserAuthenticated() ?
    (<ul className="nav navbar-nav navbar-right">
     <li className="active"><Link to="/allbooks">All Books</Link></li>
     <li className="active"><Link to="/mybooks">My Books</Link></li>
     <li className="active"><Link to="/settings"><img src={settings} alt='Settings'/></Link></li>
     <li className="active"><Link to="/logout"><span className="glyphicon glyphicon-log-in"></span>&nbsp;Log out</Link></li>
     </ul>
    )
     :
    (<ul className="nav navbar-nav navbar-right">
      <li className="active"><Link to="/signlog"><span className="glyphicon glyphicon-log-in"></span>&nbsp;Log in/Sign Up</Link></li>
     </ul> 
    );
         
    return (
      <div>
       <nav className="navbar navbar-inverse">
         <div className="container-fluid">
        <div className="navbar-header">
              <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>                        
              </button>
          </div> 
        <div className="collapse navbar-collapse" id="myNavbar">
        {!!Auth.isUserAuthenticated()?
                (<ul className="nav navbar-nav">
                <li onClick={this.handleShowHome} className="active"><IndexLink to="/">Home</IndexLink></li>
                <li className="active"><IndexLink to="/search">Search</IndexLink></li>
                <li className="dropbtn"><div className="dropdown"><a>Options</a>
                  <div className="dropdown-content">
                    <a onClick={this.handleSearchOpt}>Search Criteria</a>
                    <a onClick={this.handlePres}>Presentation</a>
                  </div></div>
                 </li>           
                 <li onClick={this.handleShowHelp} className="active"><Link to="/help">Help</Link></li>
               </ul>
    ):
    (<ul className="nav navbar-nav">
                <li onClick={this.handleShowHome} className="active"><IndexLink to="/">Home</IndexLink></li>  
                <li onClick={this.handleShowHelp} className="active"><Link to="/help">Help</Link></li>
               </ul>)
        }    
 {content1}
         </div>
         </div>
        </nav> 
<OptModal modal={this.state.modal1} updateTerm = {this.handleUpdateTerm} onClose={this.handleonCloseOpt} username={this.props.username} length={this.props.length} number={this.props.number}/>
<PresModal modal={this.state.modal2} updatePres = {this.handleUpdatePres} onClose={this.handleonClosePres}  username={this.props.username} size={this.props.size}/>
      </div>
    );
  }
}

export default MenuNav;
