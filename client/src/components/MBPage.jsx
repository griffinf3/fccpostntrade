import React, { Component } from 'react';
import 'whatwg-fetch';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';
import swal from 'sweetalert';
import noImage from '../img/ina.jpg';
import cross from '../img/cross.png';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

class MBPage extends Component {
    
constructor(props){
        super(props);
this.state = {username: this.props.username, allbooks: [{}], borderColor: 'red', title: '', owner:'', receiver: '', status: '', preBtn: true, nextBtn: false, resultsArrayIndex: 0, linkdisabled: true, myBooks: false, myBooks2: false, myBooksArray: this.props.myBooksArray,  myBooksArray2: this.props.myBooksArray2, selectedOption2: this.props.selectedOption2, selectedOption3: this.props.selectedOption3, bookId: '', message: '', deleteorapprove: true}; 
    this.handlePre = this.handlePre.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleOwner = this.handleOwner.bind(this);
    this.handleReceiver = this.handleReceiver.bind(this);
    this.processData = this.processData.bind(this);
    this.handleChange1 = this.handleChange1.bind(this);
    this.handleChange2 = this.handleChange2.bind(this);
    this.handleUnapproved = this.handleUnapproved.bind(this);
    this.deleteMyBook = this.deleteMyBook.bind(this);
    this.handleApprove = this.handleApprove.bind(this);
    this.handleApproved = this.handleApproved.bind(this);
    this.getUserData = this.getUserData.bind(this);
    this.handleReceiver2 = this.handleReceiver2.bind(this);
    this.handleReceiver3 = this.handleReceiver3.bind(this);
}  
    
componentDidMount(){
     if (Auth.isUserAuthenticated())
     {//should not be authenticated without a password
         //if username is '', then logout.
     if (this.state.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
       else{       
       
    //information required when user comes to this page:
    //the number of books that the logged in user has posted that others have shown an interest in. The
    //status for these will be designated 'requested' until the logged in user clicks to approve the trade, at which
    //time the status will be updated to 'approved. Find by searching all providers with the logged in username 
    //and ones that have the 'requested' status.
    //The following fetch will retrieve only books owned by the logged in user.
var username = encodeURIComponent(this.state.username);           
fetch('/api/v1/allbooks2?username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
    if (responseJson.found === true)
    {this.processData(responseJson.books);}
});
//we are now logged in and will get data for this user.
      this.props.handleUpdate();
      this.props.handleUpdate2();       
       }
     }
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
     //The user logged in is the owner of all books retrieved; check to see if the
     //status of the book is 'approved'.  If so, set the btnImg to null.  Otherwise, set the
     //btnImg to cross.
        for (var i= 0; i < data.length; i++)
        {if (data[i].status === 'approved'){
                    btnImg = null;}
                else {
                    btnImg = cross;}
            if (data[i].tn === undefined)
               {if (i===0){obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: noImage, bc: "green", link: data[i].link, btnImg: btnImg, status: data[i].status};}
                else {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: noImage, bc: "red", link: data[i].link, btnImg: btnImg, status: data[i].status};}}
        else {
            //Convert http to https.
            if (data[i].tn.indexOf("http://") === 0)
{data[i].tn = data[i].tn.replace(/^http:\/\//i, 'https://');} 
            if (i===0) {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: data[i].tn, bc: "green", link: data[i].link, btnImg: btnImg, status: data[i].status};}
                else {obj = {id: data[i].id, username: data[i].username, receiver: data[i].receiver, title: data[i].title, tn: data[i].tn, bc: "red", link: data[i].link, btnImg: btnImg, status: data[i].status};}}
        resultsArray.push(obj);
        }     
var boolVal =  false;
if (data.length <= 1) boolVal = true; else boolVal = false;    
this.setState({allbooks: resultsArray, title: resultsArray[0].title, owner:resultsArray[0].username, receiver: resultsArray[0].receiver, status: resultsArray[0].status, preBtn: true, nextBtn: boolVal, linkdisabled: false, resultsArrayIndex: 0});    
    }
    
handleLink(i){
    var link = this.state.allbooks[i].link;
    if (link !== undefined)
    window.open(link);   
}
   
handleReceiver(){
var receiver = this.props.selectedOption2.receiver;
this.setState({message: 'User Requesting Trade:'});
this.getUserData(receiver);            
}
    
handleReceiver3(){
var receiver = this.props.selectedOption3.receiver;
this.setState({message: 'User Requesting Trade:'});
this.getUserData(receiver);            
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
{swal("We're sorry, the user " + username + " could not be found in our database.");}});}
    
handleOwner(){
var i = this.state.resultsArrayIndex;
var username = encodeURIComponent(this.state.allbooks[i].username);
this.setState({message: 'This book is owned by:'});
this.getUserData(username);}
    
handleReceiver2(){
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
    this.setState({allbooks: rA});}
}
    
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
    this.setState({deleteorapprove: true});
    }});}});}

tradeDelete(i){
//Delete my book.
var bookid = this.state.allbooks[i].id;
this.setState({bookId: bookid});
this.deleteMyBook();}
 
handleChange2 = (selectedOption) => {
if (selectedOption)
{this.setState({bookId: selectedOption.id});
this.props.handleNextOption2(selectedOption);  
  if (selectedOption.index >=0) this.setState({deleteorapprove:false});
     else this.setState({deleteorapprove:true});
  }
 else {
     this.setState({deleteorapprove:true}); this.props.handleNextOption2('');
      }}

handleChange1 = (selectedOption) => {
if (selectedOption)
{this.setState({bookId: selectedOption.id});
this.props.handleNextOption3(selectedOption);  
  }
 else {
     this.props.handleNextOption3('');}}
    
handleUnapproved(){
    this.setState({myBooks2:false});
   if (this.state.myBooks === true) this.setState({myBooks:false}); else this.setState({myBooks:true});}
    
handleApprove(){
var bookid = encodeURIComponent(this.props.selectedOption2.id);
var username = encodeURIComponent(this.state.username);
fetch('/api/v1/approve?bookid='+ bookid +'&username='+ username, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {if (responseJson.found === true)
    {this.processData(responseJson.books);}this.props.handleUpdate2();
this.setState({deleteorapprove: true});});   
}

handleApproved(){
    this.setState({myBooks:false});
     if (this.state.myBooks2 === true) this.setState({myBooks2:false}); else this.setState({myBooks2:true}); 
}
                   
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
        
const selectedOption2 = this.props.selectedOption2;
const value2 = selectedOption2 && selectedOption2.value;
const selectedOption3 = this.props.selectedOption3;
const value3 = selectedOption3 && selectedOption3.value;
    
const style2 = {
width: '170px',
margin: '20px',
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
    <div style={{backgroundColor: "grey"}}>
    
    <div style={{display:'inline', marginLeft:'20px'}}>Requests for My Books:</div>
    <button onClick={this.handleUnapproved} style={style2}><span>{this.props.unapproved}</span>&nbsp;unapproved</button>
    <button onClick={this.handleApproved} style={style2}><span>{this.props.approved}</span>&nbsp;approved</button>
   {(this.state.allbooks[0].id === undefined) ?
    (<div></div>):
    (<div>
    <div style={{margin:'20px'}}></div>
       {!(this.state.myBooks) || (this.props.unapproved === 0) ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div>
    <div><div style = {{marginBottom: '10px', marginLeft: '50px', marginTop: '-20px'}}>Requests Not Yet Approved:</div>
    {!(this.props.selectedOption2) ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div style={{marginLeft: '20px', marginBottom: '10px'}}>
    <div style={{marginRight: '10px', display: 'inline'}}><button onClick={this.deleteMyBook} disabled={this.state.deleteorapprove}>I No Longer Wish to Trade this Item.</button></div>
    <button onClick={this.handleApprove} disabled={this.state.deleteorapprove}>I Approve the Trade Request.
</button>   
    </div>
        )
    }
            </div>
    
    <div style={{width: '300px', display:'inline'}}>
    <div style={{width: '700px', marginLeft: '20px'}}>
    
    <Select 
        name="form-field-name"
        value={value2}
        onChange={this.handleChange2}
        options={this.props.myBooksArray}
      />
     
    <div style={{height: '10px'}}> </div>
         
    {!(this.props.selectedOption2) ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div style={{display:'inline', width: '600px'}}>User Requesting Trade Confirmation of Selection Above: <button onClick={this.handleReceiver}>{this.props.selectedOption2.receiver}</button>
        <div style={{height: '10px'}}></div>
        </div>
        )
     } </div>
 </div></div>
    )}
                       
{!(this.state.myBooks2) || (this.props.approved === 0) ?
    (<div style={{display: 'inline'}}>
      </div>
    ) :
    (<div>
    <div style = {{marginBottom: '10px', marginLeft: '50px', marginTop: '-20px'}}>Approved: (Please complete the trade by contacting the person requesting your book.)
 </div>
<div style={{width: '300px', display:'inline'}}>
     <div style={{width: '700px', marginLeft: '20px'}}>
    <Select
        name="form-field-name"
        value={value3}
        onChange={this.handleChange1}
        options={this.props.myBooksArray2}
      />
         <div style={{height: '10px'}}> </div>
            {!(this.props.selectedOption3) ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div style={{display:'inline', width: '600px'}}>User Requesting Selection Above: <button onClick={this.handleReceiver3}>{this.props.selectedOption3.receiver}</button>
                <div style={{height: '10px'}}></div>
                </div>)

} 
            </div>
            </div>       
</div>)}       
         {!(this.state.myBooks) && !(this.state.myBooks2) ?
         (
<div style={{display: 'inline'}}>
<div style={{display: 'inline', marginLeft:'20px'}}>
     Title:<div style={{display:'inline', margin:'5px'}}><input  style={{width: '700px'}} type="text" value={this.state.title} /></div> </div>
                <div></div>
<div style={{display: 'inline', margin:'10px'}}> 
     <button style={btn1Style} disabled={this.state.preBtn} onClick={this.handlePre}>&laquo; Previous</button> 
     <button style={btn2Style} disabled={this.state.nextBtn} onClick={this.handleNext}>Next &raquo;</button>
     <button onClick={this.handleLink.bind(this, this.state.resultsArrayIndex)} disabled={this.state.linkdisabled}>View additional details of book selected below.</button>
</div>     
    {!!(this.state.status === 'new') ?
    (
      <div style={{display: 'inline'}}>
      </div>
    ) :
        (
    <div style={{display: 'inline'}}><span>{message2}</span>
     <button onClick={this.handleReceiver2}>{this.state.receiver}</button></div>
        )}   
    <div style={{marginBottom:'20px'}}></div>
    <div style={{marginLeft:'20px'}}> 
     {this.state.allbooks.map((item,i) => 
      <div style={style6} key={i}
		onMouseEnter= {this.enterImage.bind(this, i)} 
		onMouseLeave={this.leaveImage.bind(this, i)} 
		onClick={this.selectBook.bind(this, i)}> 
		{
	  !!(this.state.allbooks[i].btnImg == null) ?
  (<div style={{display: 'inline', width: imgWidth, height: imgHeight, position: 'relative'}}> 
      <img style={{position: 'relative', left: '0', top: '0', border: "5px solid", borderColor: this.state.allbooks[i].bc, width: imgWidth, height: imgHeight, marginBottom: '5px'}} src ={this.state.allbooks[i].tn} alt='book thumbnail' /> </div>)
	   :
       (
	   <div style={{display: 'inline', width: imgWidth, height: imgHeight, position: 'relative'}}>        
      <img style={{position: 'relative', left: '0', top: '0', border: "5px solid", borderColor: this.state.allbooks[i].bc, width: imgWidth, height: imgHeight,  marginBottom: '5px'}} src ={this.state.allbooks[i].tn} alt='book thumbnail' />    
    <img onClick={this.tradeDelete.bind(this, i)} style={style1} src ={this.state.allbooks[i].btnImg} alt="Exchange-or-Delete" /></div>)
	  }  
       </div>)
       }
  </div>
  </div>)
  :
  (<div></div>)
}
</div>) }
</div>
    );    
  }
}

export default MBPage;
