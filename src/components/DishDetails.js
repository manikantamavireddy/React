import React, { Component } from 'react';
import { Card, CardImg,CardText, CardBody, CardTitle, Breadcrumb,BreadcrumbItem, Button, Modal, ModalHeader, ModalBody, Label, Row, Col } from 'reactstrap';
import { Control, LocalForm, Errors } from 'react-redux-form';
import { Link } from 'react-router-dom';
import { Loading } from './Loading';
import { baseUrl } from '../shared/baseUrl';
import { FadeTransform, Fade, Stagger } from 'react-animation-components';
class CommentForm extends Component{
    constructor(props){
        super(props);
        this.state={
            isModalOpen: false
        };
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
    }
    toggleModal() {
        this.setState({
          isModalOpen: !this.state.isModalOpen
        });
    }
    handleSubmit(values) {
        this.toggleModal();
        this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
    }
    render(){
        const required = (val) => val && val.length;
        const maxLength = (len) => (val) => !(val) || (val.length <= len);
        const minLength = (len) => (val) => val && (val.length >= len);
        return(
            <>
                <Button outline onClick={this.toggleModal}><span className="fa fa-pencil fa-lg"></span> Submit Comment</Button>
                <Modal isOpen={this.state.isModalOpen} toggle={this.toggleModal}>
                    <ModalHeader toggle={this.toggleModal}>Comment</ModalHeader>
                    <ModalBody>
                        <LocalForm onSubmit={this.handleSubmit}>
                            <Row className="form-group">
                                <Label htmlFor="rating" md={3}>Rating</Label>
                                <Col md={9}>
                                    <Control.select model=".rating" name="rating"
                                        className="form-control">
                                        <option>1</option>
                                        <option>2</option>
                                        <option>3</option>
                                        <option>4</option>
                                        <option>5</option>
                                    </Control.select>
                                </Col>
                            </Row>  
                            <Row className="form-group">
                                <Label htmlFor="author" md={3}>Your Name</Label>
                                <Col md={9}>
                                    <Control.text model=".author" id="author" name="author" placeholder="Your Name" className="form-control"
                                        validators={{
                                            required, minLength: minLength(3), maxLength: maxLength(15)
                                        }}
                                    />
                                    <Errors
                                        className="text-danger"
                                        model=".author"
                                        show="touched"
                                        messages={{
                                            required: 'Required',
                                            minLength: 'Must be greater than 2 characters',
                                            maxLength: 'Must be 15 characters or less'
                                        }}
                                    />
                                </Col>
                            </Row>
                            <Row className="form-group">
                                <Label htmlFor="comment" md={3}>Your Feedback</Label>
                                <Col md={9}>
                                    <Control.textarea model=".comment" id="comment" name="comment"
                                        rows="6"
                                        className="form-control" />
                                </Col>
                            </Row>          
                            <Row className="form-group">
                                <Col md={{size:9, offset: 3}}>
                                    <Button type="submit" color="primary">
                                    Submit
                                    </Button>
                                </Col>
                            </Row>
                        </LocalForm>
                    </ModalBody>
                </Modal>
            </>
        );
    }
}
class Dishdetail extends Component{
    constructor(props){
        super(props);
        this.renderComments=this.renderComments.bind(this);
    }
    renderComments(comments,postComment,dishId){
        return(
            <>
                <ul className="list-unstyled">
                    <Stagger in>
                        {comments.map((com)=>{
                            return(
                                <Fade in>
                                    <li key={com.id} className="list-unstyled">
                                        <p>{com.comment}</p>
                                        <p>-- {com.author}, {(new Date(com.date)).toDateString()}</p>
                                    </li>
                                </Fade> 
                            );
                        })}
                    </Stagger>
                </ul>
                <CommentForm postComment={postComment} dishId={dishId}/>
            </>
        );
    }
    render(){
        if (this.props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (this.props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{this.props.errMess}</h4>
                    </div>
                </div>
            );
        }
        else if (this.props.dish != null){
            return(
                <div className="container">
                    <div className="row">
                        <Breadcrumb>
                            <BreadcrumbItem ><Link to='/menu'>Menu</Link></BreadcrumbItem>
                            <BreadcrumbItem active>{this.props.dish.name}</BreadcrumbItem>
                        </Breadcrumb>
                        <div className="col-12">
                            <h3>Dish</h3>
                            <hr/>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 col-md-5 m-1">
                            <FadeTransform in transformProps={{ exitTransform: 'scale(0.5) translateY(-50%)' }} >
                                <Card>
                                    <CardImg top src={baseUrl + this.props.dish.image} alt={this.props.dish.name}/>
                                    <CardBody>
                                        <CardTitle>{this.props.dish.name}</CardTitle>
                                        <CardText>{this.props.dish.description}</CardText>
                                    </CardBody>                
                                </Card>
                            </FadeTransform>       
                        </div>
                        <div className="col-12 col-md-5 m-1">
                            <h4>Comments</h4>
                            {this.renderComments(this.props.comments,this.props.postComment,this.props.dish.id)}
                        </div>
                    </div>
                </div>
            );
        }
        else
            return(
                <div></div>
            );
    }
}
export default Dishdetail;