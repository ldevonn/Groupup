import JoinMeetupButton from "../JoinMeetupButton/JoinMeetupButton"
import LandingNavigation from "./LandingNavigation/LandingNavigation"
import './LandingPage.css'
import conferenceImg from '../../images/conference.jpg'

function LandingPage() {
    return (
        <>
        <div id="title-header">
            <div id="title-and-text">
                <h1 id="title">The people platform - Where interests become friendships</h1>
                <p id="title-text">Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
            </div>
            <img id="title-img" src={conferenceImg}></img>
        </div>
        <div>
            <h2 id="sub-title">How Groupup Works</h2>
            <p id="sub-title-text">People use Meetup to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
        </div>
        <LandingNavigation/>
        <JoinMeetupButton/>
        </>
    )
}

export default LandingPage