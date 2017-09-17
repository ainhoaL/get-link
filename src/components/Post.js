import React, { Component } from 'react';
import fetchJsonp from 'fetch-jsonp';
import './Post.css';

export class Post extends Component {

    constructor(props) {
        super(props);
        this.state = {
            postLink: null
        }
        
        this.openLink = this.openLink.bind(this);
    }

    componentDidMount() {
        this.getLink();
    }

    getLink() {
        let text = this.props.data.caption.text;
        let indexOfHttp = text.indexOf('http');
        let indexOfWWW = text.indexOf('www');
        let indexOfCom = text.indexOf('.com');
        
        let bidirectionalSearch = (textToSearch, index, forward) => {
            let foundString = '';
            let i = index;
            while (textToSearch[i] !== ' ' && i < textToSearch.length && i >= 0) {
                if (forward) {
                    foundString += textToSearch[i];
                    i++;
                } else {
                    foundString = textToSearch[i] + foundString;;
                    i--;
                }
            }

            return foundString;
        }

        let link;
        if(indexOfHttp !== -1) {
            link = bidirectionalSearch(text, indexOfHttp, true);
        } else if(indexOfWWW !== -1) {
            link = bidirectionalSearch(text, indexOfWWW, true);
        } else if(indexOfCom !== -1) {
            link = bidirectionalSearch(text, indexOfCom, false);
            link += 'com';
        }

        if(link && link.indexOf('http') === -1) {
            link = 'http://' + link;
        }

        this.setState({postLink: link});
        if (!link) {
            this.getUserWebsite().then(userWebsite => {
                this.setState({postLink: userWebsite});
            });
        }
    }

    getUserWebsite() {
        let userId = this.props.data.user.id;

        return fetchJsonp('https://api.instagram.com/v1/users/' + userId + '?access_token=' + this.props.token).then((response) => {
            return response.json()
        }).then((json) => {
            return json.data ? json.data.website : null;
        });
    }

    openLink() {
        window.open(this.state.postLink, '_blank');
    }

    render() {
        if (!this.props.data) {
            return null;
        }
        return (
            <div className="Post">
                <img src={this.props.data.images.low_resolution.url} alt="instagram post" className="Post-image" />
                <div className="actions">
                    <button onClick={this.openLink} disabled={this.state.postLink ? false : true}>Open link</button>
                </div>
                <div>{this.props.data.caption.text}</div>
            </div>
        );
    }
}