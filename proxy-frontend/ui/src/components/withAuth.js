import React, { Component } from 'react';
import AuthService from './AuthService';

export default function withAuth(AuthComponent) {
    const Auth = new AuthService();
    return class AuthWrapped extends Component {
        constructor() {
            super();
            this.state = {
                user: null,
                url: null
            }
        }
        componentWillMount() {
            if (!Auth.loggedIn()) {
                this.props.history.replace('/login')
            }
            else {
                try {
                    const profile = Auth.getProfile()
                    const url = Auth.getUrl();
                    this.setState({
                        user: profile,
                        url: url
                    })
                }
                catch(err){
                    Auth.logout(localStorage.getItem("username"))
                    .then((res) => {
                        this.props.history.replace('/login')
                
                      })
                      .catch((err) => {
                        this.props.history.replace('/login')
                      });
                    
                }
            }
        }

        render() {
            if (this.state.user) {
                return (
                    <AuthComponent history={this.props.history} user={this.state.user} url={this.state.url} />
                )
            }
            else {
                return null
            }
        }
    };
}