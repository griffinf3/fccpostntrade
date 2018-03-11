import React from 'react';
import Modal from 'react-modal';
import PresSelect from './PresSelect.jsx';
 
class PresModal extends React.Component {
   
  constructor(props) {
    super(props);
    this.state = {showModal: this.props.modal, username: this.props.username, size: this.props.size}
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.presUpdate = this.presUpdate.bind(this);
  }
  
  handleCloseModal () {
  this.props.onClose();
  } 
    
 presUpdate(data){
     this.props.updatePres(data); 
  }
   
  render() {   
   const pmStyle = {
      content:  {backgroundColor: 'papayawhip',
                height: '170px', width: '500px', margin: 'auto', fontStyle: 'normal', fontWeight: 'bold', fontFamily: "Times"}
}
      
return (
      <div>
        <Modal
  ariaHideApp={false}
  isOpen={this.props.modal}
  contentLabel="Modal"
  style={pmStyle}>
  <PresSelect onPresUpdate = {this.presUpdate}  username={this.props.username}  onClose = {this.handleCloseModal} size={this.props.size}/>
</Modal>
      </div>
    )
  }
}

export default PresModal;