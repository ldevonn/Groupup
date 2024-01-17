import JoinMeetupButton from "../JoinMeetupButton/JoinMeetupButton"
import LandingNavigation from "./LandingNavigation/LandingNavigation"
import './LandingPage.css'

function LandingPage() {
    return (
        <>
        <div>
            <h1>The people platform - Where interests become friendships</h1>
            <p>Whatever your interest, from hiking and reading to networking and skill sharing, there are thousands of people who share it on Meetup. Events are happening every day—sign up to join the fun.</p>
        </div>
        <div>
            <h2 className="how-groupup-works">How Groupup Works</h2>
            <p className="how-groupup-works-content">People use Meetup to meet new people, learn new things, find support, get out of their comfort zones, and pursue their passions, together. Membership is free.</p>
        </div>
        <LandingNavigation/>
        <JoinMeetupButton/>
        </>
    )
}

export default LandingPage