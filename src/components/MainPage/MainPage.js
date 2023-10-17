import React, { Component } from 'react';
import './MainPage.scss';
import me from '../../assets/images/meS.svg';
import me1 from '../../assets/images/kareem_op2.jpg';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export default class MainPage extends Component {
    render() {
        return (
            <div id="main" className="main-wrapper">
                <div className="container">
                    <div className="row align-items-center">
                        <div className="col-lg-6 col-md-6 col-sm-12">
                            <div className="banner-content slide-in-blurred-left">
                                <h1>
                                    Hello! <span role="img"></span>
                                </h1>
                                <p>
                                    My name is <b>Kareem El Assad</b> and I am a <b>Software Engineering</b> student based
                                    in Ottawa, Canada. I am a <b>5th year student at Carleton University</b> and I love to break things!
                                </p>
                                <button type="button" className="btn btn-outline-danger theme-color">
                                    Send me a message <i className="fas fa-envelope"></i>
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6 col-sm-6 col-xs-6 slide-in-blurred-bottom ">
                            <img src={me} className="me" alt="loading..." />
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
