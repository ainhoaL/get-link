import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import { Post } from './Post';

export class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            posts: []
        }
    }

    componentWillReceiveProps(nextProps) {
        if(this.props && nextProps && this.props.token !== nextProps.token) {
            fetchJsonp('https://api.instagram.com/v1/users/self/media/liked?access_token=' + nextProps.token).then((response) => {
                return response.json()
            }).then((json) => {
                if (json.data) {
                    this.setState({ posts: json.data});
                }
            });
        }
    }

    render() {
        let postTiles = this.state.posts.map(post => <Post data={post} key={post.id} token={this.props.token} />);
        return (
            <div className="dashboard">
                {postTiles}
            </div>
        );
    }
}