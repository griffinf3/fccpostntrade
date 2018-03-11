import React, { Component } from 'react';
import 'whatwg-fetch';
import Auth from '../modules/Auth';
import {browserHistory} from 'react-router';
import swal from 'sweetalert';
import noImage from '../img/ina.jpg';

class SearchPage extends Component {
    
constructor(props){
super(props);
this.state = {borderColor: 'red', resultsArray: [], preBtn: true, nextBtn: true, title: '', resultsArrayIndex: 0, bookName: '', bookISBN: ''}; 
    this.handleSearch = this.handleSearch.bind(this);
    this.handlePre = this.handlePre.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBookNameChange = this.handleBookNameChange.bind(this);
    this.handleBookISBNChange = this.handleBookISBNChange.bind(this);
    this.AdvancedSearch = this.AdvancedSearch.bind(this);
    this.handleTrade = this.handleTrade.bind(this)
}
   
AdvancedSearch()
    {window.open('https://books.google.com/advanced_book_search');}
    
handleLink(i){
    var link = this.state.resultsArray[i].link;
    window.open(link);   
}
 
selectBook(e){
    var rA = this.state.resultsArray;
    var rAindex = this.state.resultsArrayIndex; 
    var rAlg = this.state.resultsArray.length;
    rA[e].bc = 'green';
    rA[rAindex].bc = 'red';
    rA[0].bc = 'red';
    this.setState({resultsArray: rA, resultsArrayIndex: e, title: this.state.resultsArray[e].title, preBtn: false, nextBtn: false});
    if (e === 0)
    {this.setState({preBtn: true});};
    if (rAlg === e+1)
    {this.setState({nextBtn: true});};
    if (rAlg === 1)
    {this.setState({preBtn: true, nextBtn: true});};}
    
enterImage(e){
    var rA = this.state.resultsArray;
    var rAindex = this.state.resultsArrayIndex; 
    if (e !== rAindex)
    {rA[e].bc = 'green';
    rA[rAindex].bc = 'red';
    this.setState({resultsArray: rA});}}
    
leaveImage(e){
    var rA = this.state.resultsArray;
    var rAindex = this.state.resultsArrayIndex; 
    rA[e].bc = 'red';
    rA[rAindex].bc = 'green';
    this.setState({resultsArray: rA});}

handleSearch(event){  
if (Auth.isUserAuthenticated())
     {if (this.props.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }}
      //if not authenticated:
     else {//username = '';
           //OK but not required
          this.props.updateUsername('');
          browserHistory.push('/');
         };
event.preventDefault();
var searchtype, querydata;
var cont = true;
var maxno = this.props.number
if (this.state.bookISBN !== '')    
{if (this.state.bookISBN.length !== this.props.length)
{this.setState({bookISBN:'ISBN input error!'});
cont = false;
} else {querydata = this.state.bookISBN; searchtype = 1;}}
else if (this.state.bookName !== '') 
{querydata = this.state.bookName; searchtype = 2;}  
if (cont === true)   
{
fetch('/api/v1/books?querydata='+ querydata + '&searchtype=' + searchtype + '&number=' + maxno, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {
if (responseJson.results != null){
        var obj= {};
        var resultsArray = [];
        resultsArray.length = 0;
        for (var i= 0; i < responseJson.results.length; i++)
        {if (responseJson.results[i].tn === undefined)
               {if (i===0){obj = {id: responseJson.results[i].id, title: responseJson.results[i].title, tn: noImage, bc: "green", link: responseJson.results[i].link}}
                else {obj = {id: responseJson.results[i].id, title: responseJson.results[i].title, tn: noImage, bc: "red", link: responseJson.results[i].link};}}
        else {if (i===0) {obj = {id: responseJson.results[i].id, title: responseJson.results[i].title, tn: responseJson.results[i].tn, bc: "green", link: responseJson.results[i].link};}
                else {obj = {id: responseJson.results[i].id, title: responseJson.results[i].title, tn: responseJson.results[i].tn, bc: "red", link: responseJson.results[i].link};}}
        resultsArray.push(obj);
        }
var nextBool = false;
if (responseJson.results.length < 2) nextBool = true;
this.setState({resultsArray: resultsArray, title: resultsArray[0].title, preBtn: true, nextBtn: nextBool});}
else {swal('Based on the search criteria submitted, no books were found. If you are unsure about book titles or ISBN numbers, the Advanced Search feature can help in identifying the book you wish to post.')}});}}

handlePre(){
var rAindex = this.state.resultsArrayIndex;
if (rAindex > 0) {
    rAindex--;
    var rA = this.state.resultsArray;
    rA[rAindex+1].bc = 'red';
    rA[rAindex].bc = 'green';
    this.setState({resultsArray: rA, resultsArrayIndex: rAindex, preBtn: false, nextBtn: false, title: this.state.resultsArray[rAindex].title});
    if (rAindex === 0)
    {this.setState({preBtn: true, nextBtn: false});}}
else {this.setState({preBtn: true, nextBtn: false});}}

    
handleNext(){
var rAlg = this.state.resultsArray.length; 
var rAindex = this.state.resultsArrayIndex; 
if (rAlg-1 > rAindex){
    rAindex++;  
    var rA = this.state.resultsArray;
    rA[rAindex-1].bc = 'red';
    rA[rAindex].bc = 'green';  
this.setState({resultsArray: rA, resultsArrayIndex: rAindex, preBtn: false, nextBtn: false, title: this.state.resultsArray[rAindex].title});
    if (rAlg === rAindex+1)
    {this.setState({preBtn: false, nextBtn: true});}}
else {this.setState({preBtn: false, nextBtn: true});}} 
    
handleBookNameChange(event){
    this.setState({bookName: event.target.value, bookISBN: ''});
   }
    
handleBookISBNChange(event){
    this.setState({bookISBN: event.target.value, bookName: ''});
   }
    
handleTrade(){ 
    if (Auth.isUserAuthenticated())
     {if (this.props.username === '') {browserHistory.push('/logout');
                                    // no longer in React Router V4
                                   }
      else {
     var rAindex = this.state.resultsArrayIndex; 
     var bookid = encodeURIComponent(this.state.resultsArray[rAindex].id);
     var username = encodeURIComponent(this.props.username);
     var thumbnail = encodeURIComponent(this.state.resultsArray[rAindex].tn);
     var title = encodeURIComponent(this.state.resultsArray[rAindex].title);
     var link = encodeURIComponent(this.state.resultsArray[rAindex].link);
     fetch('/api/v1/mybook?bookid='+ bookid +'&username='+ username+'&tn='+ thumbnail+'&title='+ title+'&link='+ link, {
method: 'GET',
headers: {'Content-Type': 'application/json'}
}).then((response) =>  response.json()).then((responseJson) => {var message;
         if (responseJson.code === 1)
         {message = "Your book titled " + this.state.resultsArray[rAindex].title + " has already been posted for trade. Note that the option to delete this book is available anytime prior to approval of a trade request.";} else
        if (responseJson.code === 2)
         {message = "There was an error posting your book titled " + this.state.resultsArray[rAindex].title + " to this website's database.";}
        else  
        //if all OK show message that book was saved. 
         {message = "Your book titled " + this.state.resultsArray[rAindex].title + " has been posted for trade. Note that the option to delete this book is available anytime prior to approval of a trade request.";}
        swal(message);  
     });}}
      //if not authenticated:
     else {this.props.updateUsername('');
          browserHistory.push('/');
         };
}
                   
render() { 
var imgWidth, imgHeight;
if (this.props.size === 'small'){
imgWidth = '60px';
imgHeight = '90px';
}
else
if (this.props.size === 'medium'){
imgWidth = '120px';
imgHeight = '180px';
}
else
{
imgWidth = '240px';
imgHeight = '360px';
};

const style2 = {
backgroundColor: 'lightgrey'}

const style3 = {
margin: '20px'  
}

const btn1Style = {
  marginLeft: '20px',
  height: '25px',
  color: 'black'
}

const btn2Style = {
  marginLeft: '5px',
  height: '25px',
  color: 'black'
}

const style5 = {
    color: 'black',
    width: '700px'
}

const style6 = {
  display: 'inline', margin: '2px'}

var style7;
if (this.state.bookISBN[0]==='I')
style7 = {color: 'red', margin: '20px'};
else style7 = {color: 'black', margin: '20px'}

return (
    <div style={style2}> <div style={{display:'inline', marginLeft: '20px'}}>
  Search by Title: </div><input style ={style3} type="text" value={this.state.bookName} onChange={this.handleBookNameChange} /><span>or ISBN ({this.props.length} digit): </span>
                   <input style ={style7} type="text" value={this.state.bookISBN} onChange={this.handleBookISBNChange} /><button onClick={this.handleSearch}>&nbsp;Submit</button>&nbsp;&nbsp;
    <button onClick={this.AdvancedSearch}>Advanced Search</button>
      {!!(this.state.resultsArray.length <1) ?
    (<div style={{display:'inline'}}></div>
    ) :
    (<div style={{marginLeft: '20px'}}>Title:&nbsp;<input type="text" style={style5} value={this.state.title} />  
     <div style={{marginTop: '20px'}}></div> 
     </div>)}
     {!!(this.state.resultsArray.length <=1) ?
    (<div style={{display:'inline'}}></div>
    ) :
    (<div style={{display:'inline'}}>
    <button style={btn1Style} disabled={this.state.preBtn} onClick={this.handlePre}>&laquo; Previous</button> 
<button style={btn2Style} disabled={this.state.nextBtn} onClick={this.handleNext}>Next &raquo;</button>
    </div>)}   
 {!!(this.state.resultsArray.length <1) ?
    (<div style={{display:'inline'}}></div>
    ) :
    (<div style={{display:'inline'}}>
    <button style={{margin: '10px'}} onClick={this.handleLink.bind(this, this.state.resultsArrayIndex)}>View additional details on book selected.</button>
<button disabled={this.state.requestTrade} onClick={this.handleTrade}>Post and Trade Book Selected.</button>
</div>)}
<div style={{marginBottom: "10px"}}></div>
    <div style={{marginLeft:'20px'}}>
    {this.state.resultsArray.map((item,i) => <div onMouseEnter= {this.enterImage.bind(this, i)} onMouseLeave={this.leaveImage.bind(this, i)} onClick={this.selectBook.bind(this, i)} style={style6} key={i}>
         <img style={{display: 'inline', border: "5px solid", borderColor: this.state.resultsArray[i].bc, width: imgWidth, height: imgHeight, marginBottom: '5px'}} src ={this.state.resultsArray[i].tn} alt='book thumbnail' />
        </div>)}  </div> 
</div>
    );   
  }
}

export default SearchPage;
