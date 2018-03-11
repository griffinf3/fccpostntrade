import React, { Component } from 'react';
import 'whatwg-fetch';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';
import swal from 'sweetalert';
import noImage from '../img/ina.jpg';
import exchange from '../img/arrows.png';
import cross from '../img/cross.png';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class ABPage extends Component {
    
constructor(props){
        super(props);  
this.state = {username: this.props.username, allbooks: [], borderColor: 'red', new: this.props.new, title: '', owner:'', receiver: '', status: '', preBtn: true, nextBtn: false, resultsArrayIndex: 0, linkdisabled: true, myRequests: false, myRequests2: false, myRequestsArray: this.props.myRequestsArray, myRequestsArray2: this.props.myRequestsArray2, selectedOption1: this.props.selectedOption1, cancelRequest: true, selectedOption4: this.props.selectedOption4, bookId: '', message: ''}; 
    this.handlePre = this.handlePre.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleOwner = this.handleOwner.bind(this);
    this.handleOwner2 = this.handleOwner2.bind(this);
    this.processData = this.processData.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleOutstanding = this.handleOutstanding.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.deleteMyBook = this.deleteMyBook.bind(this);
    this.handleApproved = this.handleApproved.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.handleReceiver = this.handleReceiver.bind(this);
}  
    
componentDidMount(){
     if (Auth.isUserAuthenticated())
     {//should not be authenticated without a password
         //if username is '', then logout.
     if (this.state.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
       else{         
    //information required when user comes to this page.      
    //1) the books the user has shown an interest in acquiring and the number of those
    // that have not yet been approved for trade (outstanding). The status for these will be designated 'requested'.
    //Find these by searching all providers that have the receiver field set to the logged in username and
    //ones that have the 'requested' status.  This variable is updated whenever the user logged in
    //clicks the show interest icon on a book located on the all books page.     
    //2 the number of books that the logged in user has posted that others have shown an interest in. The
    //status for these will also be designated 'requested' until the logged in user clicks to approve the trade, at which
    //time the status will be updated to 'approved.  Find by searching all providers with the logged in username 
    //and ones that have the 'requested' status.               
fetch('/api/v1/allbooks', {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true)
    {this.processData(responseJson.books);}
});
       //we are now logged in and will get data for this user.
      this.props.handleUpdate();
      this.props.handleUpdate2();
       }}
      //if not authenticated:
     else {this.setState({username: ''});
          this.props.updateUsername('');
          browserHistory.push('/');
         };}
        
processData(data)
    { var obj= {};
    var resultsArray = [];
    resultsArray.length = 0;
    var btnImg = null;
     var noNew = 0;
     //If the user logged in is the owner of a book, check to see if the
     //status of the book is 'approved'.  If so, set the btnImg to null.  Otherwise, set the
     //btnImg to cross.
     //If the user logged in is not the owner of the book, check to see if the book status is
     //'new'.  If so, set the btnImg to exchange.  Otherwise, set the btnImg to null.
        for (var i= 0; i < data.length; i++)
        {if (data[i].username.trim() === this.state.username.trim())
            {
                if (data[i].status === 'approved'){
                    btnImg = null;}
                else {
                    btnImg = cross;}
             }
         else
            {
                if (data[i].status === 'new'){
                    noNew ++;
                    btnImg = exchange;}
                else {
                    btnImg = null;}   
            }
            if (data[i].tn === undefined)
               {if (i===0){obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: noImage, bc: "green", link: data[i].link, btnImg: btnImg, status: data[i].status};}
                else {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: noImage, bc: "red", link: data[i].link, btnImg: btnImg, status: data[i].status};}}
        else {//Convert http to https.
            if (data[i].tn.indexOf("http://") === 0)
{data[i].tn = data[i].tn.replace(/^http:\/\//i, 'https://');}
            if (i===0) {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: data[i].tn, bc: "green", link: data[i].link, btnImg: btnImg, status: data[i].status};}
                else {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: data[i].tn, bc: "red", link: data[i].link, btnImg: btnImg, status: data[i].status};}}
        resultsArray.push(obj);
        }
var boolVal =  false;
if (data.length <= 1) boolVal = true; else boolVal = false;
this.setState({allbooks: resultsArray, title: resultsArray[0].title, owner:resultsArray[0].username, receiver: resultsArray[0].receiver, status: resultsArray[0].status, preBtn: true, nextBtn: boolVal, linkdisabled: false, resultsArrayIndex: 0, new: noNew});
    }
    
handleLink(i){
    var link = this.state.allbooks[i].link;
    if (link !== undefined)
    window.open(link);   
}
    
getUserData(username){
fetch('/api/v1/data?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true){
        var firstname, lastname, city, state, name, email, eaddress, citystate, swalname;
        firstname = responseJson.firstname.trim();
        lastname = responseJson.lastname.trim();   
        name = (firstname + ' ' + lastname).trim(); 
        if (name.length === 0) name = 'name not available';
        city = responseJson.city.trim();
        state = responseJson.state.trim();     
        if (city.length >0  && state.length > 0)
        citystate = city + ', ' + state;
        else if (city.length >0) citystate = city;
        else if (state.length >0) citystate = state;
        else citystate = 'location not available';
        email = responseJson.email.trim(); 
        if (email.length >0) eaddress = ': ' + email;
        else eaddress = ' unknown.';
        swalname = name + ' of '+ citystate + '. Email address' + eaddress; 
        var message = this.state.message;
  swal(message, swalname);
    }
else
{swal("We're sorry, the user " + username + " could not be found in our database.");}
    });
}
    
handleOwner(){
var i = this.state.resultsArrayIndex;
var username = encodeURIComponent(this.state.allbooks[i].username);
this.setState({message: 'This book is owned by:'});
this.getUserData(username);            
}
    
handleOwner2(){
var owner = this.props.selectedOption4.username;
this.setState({message: 'This book is owned by:'});
this.getUserData(owner);            
}
    
handleReceiver(){
var i = this.state.resultsArrayIndex;
var username = encodeURIComponent(this.state.allbooks[i].receiver);
    
if (this.state.status==='requested')   
this.setState({message: 'User Requesting Trade:'});
else 
if (this.state.status==='approved') 
this.setState({message: 'User with Approved Trade:'});
this.getUserData(username);            
}
     
handlePre(){
var rAindex = this.state.resultsArrayIndex;
if (rAindex > 0) {
    rAindex--;   
    var rA = this.state.allbooks;  
    rA[rAindex+1].bc = 'red';
    rA[rAindex].bc = 'green';
    this.setState({allbooks: rA, resultsArrayIndex: rAindex, preBtn: false, nextBtn: false, title: this.state.allbooks[rAindex].title, owner: this.state.allbooks[rAindex].username, receiver: this.state.allbooks[rAindex].receiver, status: this.state.allbooks[rAindex].status});
    if (rAindex === 0)
    {this.setState({preBtn: true, nextBtn: false});}}
else {this.setState({preBtn: true, nextBtn: false});}}
  
handleNext(){
var rAlg = this.state.allbooks.length; 
var rAindex = this.state.resultsArrayIndex; 
if (rAlg-1 > rAindex){
    rAindex++; 
    var rA = this.state.allbooks;   
    rA[rAindex-1].bc = 'red';
    rA[rAindex].bc = 'green'; 
    this.setState({allbooks: rA, resultsArrayIndex: rAindex, preBtn: false, nextBtn: false, title: this.state.allbooks[rAindex].title, owner: this.state.allbooks[rAindex].username, receiver: this.state.allbooks[rAindex].receiver, status: this.state.allbooks[rAindex].status});
    if (rAlg === rAindex+1)
    {this.setState({preBtn: false, nextBtn: true});}}
else {this.setState({preBtn: false, nextBtn: true});}} 
    
selectBook(e){
    var rA = this.state.allbooks;
    var rAindex = this.state.resultsArrayIndex; 
    var rAlg = this.state.allbooks.length;
    rA[e].bc = 'green';
    rA[rAindex].bc = 'red'; 
     
    this.setState({allbooks: rA, resultsArrayIndex: e, title: this.state.allbooks[e].title, owner: this.state.allbooks[e].username, receiver: this.state.allbooks[e].receiver, status: this.state.allbooks[e].status, preBtn: false, nextBtn: false});
    if (e === 0)
    {this.setState({preBtn: true});};
    if (rAlg === e+1)
    {this.setState({nextBtn: true});};
    if (rAlg === 1)
    {this.setState({preBtn: true, nextBtn: true});};    
}

enterImage(e){
    var rA = this.state.allbooks;
    var rAindex = this.state.resultsArrayIndex; 
    if (e !== rAindex)
    {
    rA[e].bc = 'green';
    rA[rAindex].bc = 'red';
    this.setState({allbooks: rA});}}
    
leaveImage(e){
    var rA = this.state.allbooks; 
    var rAindex = this.state.resultsArrayIndex; 
    rA[e].bc = 'red';
    rA[rAindex].bc = 'green';
    this.setState({allbooks: rA});}
    
deleteMyBook(){
swal({title: "Confirm Removal of Selection from your List of Items Available for Trade.", icon: "warning",
  buttons: true,
  dangerMode: true}
).then((willDelete) => {
  if (willDelete) {var bookid = encodeURIComponent(this.state.bookId);
  var username = encodeURIComponent(this.state.username);
  fetch('/api/v1/deletemybook?bookid='+ bookid +'&username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
         if (responseJson.found === true)
    {this.processData(responseJson.books);
    this.props.handleUpdate2();
    } 
}); }});}

tradeOrDelete(i){
    //Delete if my book.
    if (this.state.allbooks[i].username === this.state.username)
    {var bookid = this.state.allbooks[i].id;
     this.setState({bookId: bookid});
     this.deleteMyBook();
     }
 else if (this.state.allbooks[i].btnImg != null)
    //ask owner for trade.
 {var owner = this.state.allbooks[i].username;
  var title = this.state.allbooks[i].title;
  var message = "Please confirm your request for " + title + 
         " owned by " + owner +'.';
    swal({title: "Trade Request", text: message, icon: "info", buttons: true, dangerMode: true}).then((willContinue) => {
  if (willContinue) {var bookid = encodeURIComponent(this.state.allbooks[i].id);
     //the username is the person who wants the book (the receiver).
     //the owner of the book will be alerted.
     var username = encodeURIComponent(this.state.username);   
    fetch('/api/v1/receivebook?bookid='+ bookid +'&username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {if (responseJson.found === true)
    {this.processData(responseJson.books);}this.props.handleUpdate();});}});}
this.setState({cancelRequest: true});}
       
handleChange1 = (selectedOption) => {
if (selectedOption)
{this.props.handleNextOption(selectedOption);  
  if (selectedOption.index >=0) this.setState({cancelRequest:false});
     else this.setState({cancelRequest:true});}
 else {this.setState({cancelRequest:true}); this.props.handleNextOption(''); } 
     }
 
handleChange2 = (selectedOption) => {
if (selectedOption)
{this.setState({bookId: selectedOption.id});
this.props.handleNextOption4(selectedOption);  
  }
 else {this.props.handleNextOption4('');}}
    
handleOutstanding(){
    //buttons enabled, true or false.
    this.setState({myRequests2:false});
    if (this.props.outstanding > 0)
    {if (this.state.myRequests === true) 
    this.setState({myRequests:false}); 
    else this.setState({myRequests:true});
}  else this.setState({myRequests:false});}
    
handleRemove(){
 swal({title: "Confirm Removal of Trade Request?", icon: "warning",
  buttons: true,
  dangerMode: true}
).then((willDelete) => {
  if (willDelete) {
var bookid =  encodeURIComponent(this.props.selectedOption1.id);
var receiver = encodeURIComponent(this.state.username);  
fetch('/api/v1/cancelreceive?bookid='+ bookid +'&receiver='+ receiver, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {if (responseJson.found === true)
    {this.processData(responseJson.books);} 
                                                                
this.setState({myRequestsArray: [], selectedOption1: '', cancelRequest: true});                             this.props.handleUpdate();});}});     
}

handleApproved(){
   this.setState({myRequests:false});
   if (this.props.approved2 > 0)
    { 
      if (this.state.myRequests2 === true) this.setState({myRequests2:false}); else this.setState({myRequests2:true}); 
    } else this.setState({myRequests2:false});}
                   
render() { 
var imgWidth, imgHeight, iconL, iconT, iconW, iconH;
if (this.props.size === 'small'){
imgWidth = '60px';
imgHeight = '90px';
iconL = '45px';
iconT = '-28px';
iconW = '8px';
iconH = '12px';
}
else
if (this.props.size === 'medium'){
imgWidth = '120px';
imgHeight = '180px';
iconL = '100px';
iconT = '-76px';
iconW = '16px';
iconH = '24px';
}
else
{
imgWidth = '240px';
imgHeight = '360px';
iconL = '200px';
iconT = '-160px';
iconW = '32px';
iconH = '48px';
};
    
var message2;
if (this.state.status==='requested') message2 = 'Trade requested by: ';
if (this.state.status==='approved') message2 = 'Trade approved for: ';
if (this.state.status==='new') message2 = '';  
      
const selectedOption1 = this.props.selectedOption1;
const value = selectedOption1 && selectedOption1.value;
  
const selectedOption4 = this.props.selectedOption4;
const value2 = selectedOption4 && selectedOption4.value;
 
var outStandValue;
if (this.props.outstanding >0)
    outStandValue = this.props.outstanding;
    else outStandValue = '0';
    
const style2 = {
width: '170px',
marginTop: '20px',
marginLeft: '20px',
marginRight: '20px',
backgroundColor: 'lightgrey',
display: 'inline'
}

const style1 = {
   position: 'absolute',
   width: iconW,
   height: iconH,
   left: iconL,
   top: iconT,
    zIndex:'0',
   opacity: '0.8'
}
    
const btn1Style = {
  margin: '10px',
  height: '25px',
  color: 'black'
}

const btn2Style = {
  marginRight: '20px',
  height: '25px',
  color: 'black'
}
    
const style6 = {
  display: 'inline', margin: '2px'}
    
return (
    <div style={{backgroundColor: "grey", minHeight: "65px"}}>
      <div style={{display:'inline', marginLeft:'20px'}}>My Trade Requests: </div>
      <button onClick={this.handleOutstanding} style={style2}><span>{outStandValue}</span>&nbsp;outstanding</button>
      <button onClick={this.handleApproved} style={style2}><span>{this.props.approved2}</span>&nbsp;approved</button>
    <div style={{backgroundColor:'white'}}></div>
     
   {(!(this.state.myRequests) || (this.props.outstanding===0)) ?
    (
        <div style={{display: 'inline'}}></div>
    ) :
    (
    <div>
        <div style = {{marginBottom: '10px', marginTop: '20px', marginLeft: '50px'}}>Your Outstanding Requests: </div>
           {!(this.props.selectedOption1.index >=0) ? 
             (
               <div style={{display: 'inline'}}></div>
             ):
             (
               <div style={{display: 'inline', marginLeft: '50px'}}>
        <div style={{marginLeft: '50px', height: '30px', marginTop: '-30px'}}>
                  <button onClick={this.handleRemove} disabled={this.state.cancelRequest}>Cancel Request for Selection Below</button></div>
               </div>
             )
            }
            <div style={{width: '700px', marginLeft: '20px'}}>
              <Select
                name="form-field-name"
                value={value}
                onChange={this.handleChange1}
                options={this.props.myRequestsArray}
               />
               <div style={{height: '20px'}}></div>
            </div>
      </div>
      )
      }    
      {!(this.state.myRequests2) || (this.props.approved2 === 0) ?
    (
      <div style={{display: 'inline'}}></div>
    ) :
    (<div style={{marginLeft: '20px'}}>
     
     <div style={{margin: '20px'}}>Approved: (Please complete the trade by contacting the owner of the book you have requested.)
            </div>    
    <div style={{width: '700px', display:'inline'}}>
    <div style={{width: '700px'}}>
      <Select
        name="form-field-name"
        value={value2}
        onChange={this.handleChange2}
        options={this.props.myRequestsArray2}
      />
      <div style={{height: '20px'}}></div>      
    {!(this.props.selectedOption4) ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div style={{display:'inline', width: '600px'}}>Owner of Selection Above: <button onClick={this.handleOwner2}>{this.props.selectedOption4.username}</button> 
        <div style={{height: '20px'}}></div>
    </div>)
     } 
     </div> 
     </div>           
     </div>)
      } 
       {!(this.state.myRequests) && !(this.state.myRequests2) ?
         (<div style={{display: 'inline', marginLeft:'20px'}}>
          
            { !(this.state.new>0) ? (<div style={{display: 'inline'}}></div>) :(<div>
            <div style={{display: 'inline', marginLeft:'20px'}}>click the&nbsp;</div>
                             <img style={{width: '20px', height: '30px'}} src ={exchange} alt='exchange icon' />
                            <span>&nbsp;icon on the upper right side of a book's image to request a trade!</span></div>)
    }
          <div style={{height:'15px'}}></div>
          
          <div style={{display: 'inline', marginLeft:'20px'}}>Title:</div>
               <div style={{display:'inline', margin:'5px'}}>
                   <input style={{width: '700px'}} type="text" value={this.state.title} />
               </div>
          
          <div style={{display:'inline', margin:'5px'}}>
                   Owner:
               </div>
               <button onClick={this.handleOwner}>{this.state.owner}</button> 
               <div></div>
               <div style={{display: 'inline', margin:'10px'}}>       
                  <button style={btn1Style} disabled={this.state.preBtn} onClick={this.handlePre}>&laquo;Previous
                  </button> 
                  <button style={btn2Style} disabled={this.state.nextBtn} onClick={this.handleNext}>Next &raquo;</button>
                  <button onClick={this.handleLink.bind(this, this.state.resultsArrayIndex)} disabled={this.state.linkdisabled}>View additional details on book selected.</button>
              </div>
        {!!(this.state.status === 'new') ?
      (
        <div style={{display: 'inline'}}>
        </div>
       ) :
       (
        <div style={{display: 'inline'}}><span>{message2}</span>
        <button onClick={this.handleReceiver}>{this.state.receiver}</button>
        </div>
        )
     } 
     <div style={{marginBottom:'20px'}}></div>
    <div style={{marginLeft:'20px'}}> 
        {this.state.allbooks.map((item,i) => 
           <div style={style6} key={i} onMouseEnter= {this.enterImage.bind(this, i)} onMouseLeave={this.leaveImage.bind(this, i)} onClick={this.selectBook.bind(this, i)}>
        {
	  !!(this.state.allbooks[i].btnImg == null) ?
         (<div style={{display: 'inline', width:imgWidth, height: imgHeight, position: 'relative'}}> 
      <img style={{position: 'relative', left: '0', top: '0', zIndex: '0', border: "5px solid", borderColor: this.state.allbooks[i].bc, width: imgWidth, height: imgHeight, marginBottom: '5px'}} src ={this.state.allbooks[i].tn} alt='book thumbnail' />  
          </div>)
	   :
         (<div style={{display: 'inline', width:imgWidth, height: imgHeight, position: 'relative'}}>        
            <img style={{position: 'relative', left: '0', top: '0', zIndex: '0', border: "5px solid", borderColor: this.state.allbooks[i].bc, width: imgWidth, height: imgHeight, marginBottom: '5px'}} src ={this.state.allbooks[i].tn} alt='book thumbnail' />    
           <img onClick={this.tradeOrDelete.bind(this, i)} style={style1} src ={this.state.allbooks[i].btnImg} alt="Exchange-or-Delete" />
             </div>)
	  } 
        </div>)
    }  
        </div>
          </div>
         ):
         (<div></div>)  
        }
    </div>
    );    
  }
}

export default ABPage;
