import React, {Component} from 'react';
import MenuNav from './MenuNav.jsx';
import propTypes from 'prop-types';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';

class Parent extends Component {
    
constructor(props){
        super(props);
        this.state = {username: '', firstname: '', lastname: '', email: '', city: '', state: '', length: '10', number: '20', size: '', show:true, showHome: true, showSettings: true, myRequestsArray: [], myRequestsArray2: [], myBooksArray: [], outstanding: 0, unapproved: 0, approved: 0, approved2: 0, selectedOption1: '', selectedOption2: '', selectedOption3: '', selectedOption4: ''};
        this.getUser = this.getUser.bind(this);
        this.updateUsername = this.updateUsername.bind(this);
        this.onUpdateData = this.onUpdateData.bind(this);
        this.onUpdateTerm2 = this.onUpdateTerm2.bind(this);
        this.onUpdatePres = this.onUpdatePres.bind(this);
        this.hideHelp = this.hideHelp.bind(this);
        this.onShowHelp = this.onShowHelp.bind(this);
        this.hideHome = this.hideHome.bind(this);
        this.onShowHome = this.onShowHome.bind(this);
        this.onUpdateRequests = this.onUpdateRequests.bind(this);
        this.onUpdateApproved = this.onUpdateApproved.bind(this);
        this.getNextOption = this.getNextOption.bind(this);
        this.getNextOption2 = this.getNextOption2.bind(this);
        this.getNextOption3 = this.getNextOption3.bind(this);
        this.getNextOption4 = this.getNextOption4.bind(this);
        this.getOutstanding = this.getOutstanding.bind(this);
        this.getUnapproved = this.getUnapproved.bind(this);
        this.getApproved = this.getApproved.bind(this);
        this.getApproved2 = this.getApproved2.bind(this);
        this.updateProfile = this.updateProfile.bind(this);
    }
    
componentDidMount(){
    if (Auth.isUserAuthenticated())
     {if (this.state.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
       else{    
    this.getOutstanding(); 
    this.getUnapproved();
    this.getApproved();
    this.getApproved2();    
       }
     }
    //if not authenticated:
    // else {this.setState({username: ''}); browserHistory.push('/');};
}   
    
getNextOption(selectedOption1){
    this.setState({ selectedOption1 });
}
    
getNextOption2(selectedOption2){
    this.setState({ selectedOption2 });
}
    
getNextOption3(selectedOption3){
    this.setState({ selectedOption3 });
}
    
getNextOption4(selectedOption4){
    this.setState({ selectedOption4});
}
    
getUnapproved(){
var username = encodeURIComponent(this.state.username);
fetch('/api/v1/requested1?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true)
    {var obj= {};
     var myBooksArray = [];
     myBooksArray.length = 0;
     for (var i= 0; i <responseJson.requested.length; i++)
     {obj = {index: i, id: responseJson.requested[i].id, value: responseJson.requested[i].title, label: responseJson.requested[i].title, receiver: responseJson.requested[i].receiver}
    myBooksArray.push(obj);
     }
    this.setState({myBooksArray: myBooksArray, unapproved: responseJson.requested.length, selectedOption2: ''});
    } 
    else
    {
    this.setState({myBooksArray: [], unapproved: 0, selectedOption2: ''});
    }});}   
    
getApproved(){ 
var username = encodeURIComponent(this.state.username);
fetch('/api/v1/approved1?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true)
    {var obj= {};
     var myBooksArray = [];
     myBooksArray.length = 0;
     for (var i= 0; i <responseJson.approved.length; i++)
     {obj = {index: i, id: responseJson.approved[i].id, value: responseJson.approved[i].title, label: responseJson.approved[i].title, receiver: responseJson.approved[i].receiver}
    myBooksArray.push(obj);
     }
    this.setState({myBooksArray2: myBooksArray, approved: responseJson.approved.length, selectedOption3: ''});
    } 
    else
    {
    this.setState({myBooksArray2: [], approved: 0, selectedOption3: ''});
    }
  
});}   
    
getOutstanding(){
var username = encodeURIComponent(this.state.username);
fetch('/api/v1/requested2?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true)
    {var obj= {};
     var myRequestsArray = [];
     myRequestsArray.length = 0;
     for (var i= 0; i <responseJson.requested.length; i++)
     {obj = {index: i, id: responseJson.requested[i].id, value: responseJson.requested[i].title, label: responseJson.requested[i].title}
    myRequestsArray.push(obj);
     }
    this.setState({myRequestsArray: myRequestsArray, outstanding: responseJson.requested.length, selectedOption1: ''});
    } 
    else
    {
    this.setState({myRequestsArray: [], outstanding: 0, selectedOption1: ''});
    }
  }); 
} 
    
getApproved2(){ 
var username = encodeURIComponent(this.state.username);
fetch('/api/v1/approved2?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => { 
    if (responseJson.found === true)
    {var obj= {};
     var myRequestsArray = [];
     myRequestsArray.length = 0;
     for (var i= 0; i <responseJson.approved.length; i++)
     {obj = {index: i, id: responseJson.approved[i].id, value: responseJson.approved[i].title, label: responseJson.approved[i].title, username: responseJson.approved[i].username}
    myRequestsArray.push(obj);
     }
    this.setState({myRequestsArray2: myRequestsArray, approved2: responseJson.approved.length, selectedOption4: ''});
    } 
    else
    {
    this.setState({myRequestsArray2: [], approved2: 0, selectedOption4: ''});
    }
  
});}   
    
      
updateUsername(un){
    this.setState({username:un});
}
    
onUpdateData(data){
    this.setState({firstname: data.firstname, lastname: data.lastname, email: data.email, city: data.city, state: data.state, number: data.number, length: data.length, size: data.size});
}
    
updateProfile(data){
    this.setState({firstname: data.firstname, lastname: data.lastname, email: data.email, city: data.city, state: data.state});
}
    
onUpdateTerm2(data){
 //this seems to work without having to use a conditional statement similar to the one below for size change.
 this.setState({length: data.length, number: data.number});} 
 
onUpdatePres(data){
if (data === 'small' || data === 'medium' || data === 'large')
   this.setState({size: data});    
}
    
hideHelp(){
    this.setState({show: false});
}
    
hideHome(){
    this.setState({showHome: false});
}
    
onShowHelp(){
    this.setState({show: true});
}
    
onShowHome(){
    this.setState({showHome: true});
}
   
getUser(username){
    if (this.refs.aRef) this.setState({username: username});
}
    
onUpdateRequests(){
    this.getOutstanding();
     this.getApproved2();
}
    
onUpdateApproved(){
    this.getUnapproved()
    this.getApproved();
}
     
render() {
    var that = this;
    var childrenWithProps = React.Children.map(this.props.children, function(child) {
        return React.cloneElement(child, {
            handleNextOption4: that.getNextOption4, 
            handleNextOption3: that.getNextOption3, 
            handleNextOption2: that.getNextOption2, 
            handleNextOption: that.getNextOption, 
            handleUpdate2: that.onUpdateApproved, 
            handleUpdate: that.onUpdateRequests, 
            onDataUpdate: that.onUpdateData, 
            onHide: that.hideHelp, 
            onHideHome: that.hideHome, 
            getCurrentUser: that.getUser, 
            updateUsername: that.updateUsername, 
            onProfileUpdate: that.updateProfile,
            
            username: that.state.username, 
            show: that.state.show, 
            showHome: that.state.showHome, 
            showSettings: that.state.showSettings, 
            firstname: that.state.firstname, 
            lastname: that.state.lastname, 
            email: that.state.email, 
            city: that.state.city, 
            state: that.state.state, 
            length: that.state.length, 
            number: that.state.number, 
            size: that.state.size, 
            myRequestsArray: that.state.myRequestsArray, 
            myRequestsArray2: that.state.myRequestsArray2, 
            outstanding: that.state.outstanding, 
            selectedOption1: that.state.selectedOption1, 
            selectedOption2: that.state.selectedOption2, 
            selectedOption3: that.state.selectedOption3, 
            selectedOption4: that.state.selectedOption4, 
            myBooksArray: that.state.myBooksArray, 
            myBooksArray2: that.state.myBooksArray2,  
            unapproved: that.state.unapproved, 
            approved: that.state.approved, 
            approved2: that.state.approved2});
    });
      
    return (
      <div ref="aRef">
        <MenuNav 
        termUpdate= {this.onUpdateTerm2} 
        presUpdate={this.onUpdatePres}
        username={this.state.username} showHelp = {this.onShowHelp} showHome = {this.onShowHome}/>  
        {childrenWithProps}
      </div>
    );
  }
}

Parent.propTypes = {
  children: propTypes.object.isRequired
};

export default Parent;