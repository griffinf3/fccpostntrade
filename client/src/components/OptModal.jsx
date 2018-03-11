import React from 'react';
import Modal from 'react-modal';
import TermSelect from './TermSelect.jsx';
 
class OptModal extends React.Component {
    
  constructor(props) {
    super(props);
    this.state = {showModal: this.props.modal, username: this.props.username, length: this.props.length, number: this.props.number};
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.termUpdate = this.termUpdate.bind(this);
  }
    
  termUpdate(data){
      this.props.updateTerm(data); 
  }
  
  handleCloseModal() {
  this.props.onClose();  
  } 
   
  render() {
      
  const omStyle = {
      content:  {backgroundColor: 'papayawhip',
                height: '280px', width: '500px', margin: 'auto', fontStyle: 'normal', fontWeight: 'bold', fontFamily: "Times"}
}
      
    return (
      <div>
        <Modal
       
        ariaHideApp={false}
  isOpen={this.props.modal}
  contentLabel="Modal"
  style={omStyle}>
  <TermSelect onTermUpdate = {this.termUpdate} username={this.props.username}  onClose = {this.handleCloseModal} length={this.state.length} number={this.state.number}/>
</Modal>
      </div>
    )
  }
}

export default OptModal;