import React, { Component } from 'react';
import '../assets/css/Rules.scss';

export default class Rules extends Component {
    render() {
        return (
            <div class="wrapper">
                <h1 id="title">Rules</h1>

                Assery is a team-based assassination game.
                Your team of 3 will target another team, and you will be targeted by an unknown team.
                The goal is to shoot members of the opposing teams with water guns while avoiding getting shot yourself.

                <h2>Game Organization</h2>

                The game proceeds in two phases:

                <h3><em>Phase 1: Qualification</em></h3>

                You know your target, but not who is targeting you. <br></br>
                When you wipe out your target team, you will now target the team they were targeting.<br></br>
                The targets will be shuffled at random intervals. At this point, everyone dead will respawn and have another chance.<br></br>
                Your goal is to maximize your team kills and minimize deaths over the duration of this phase.<br></br>

                There will be three qualification rounds, starting April 25.

                <h3><em>Phase 2: Playoffs</em></h3>

                After the qualification rounds, the top 8 teams will be matched up in a bracket, and will now face off head on. <br></br>
                After 48 hours, the team with more kills will move on while the other is eliminated. <br></br>
                Ties will be broken via a duel at high noon in Avery courtyard. <br></br>
                The finals will be only a duel.

                <h2>Technical Rules</h2>
                <ul>
                    <li>
                        Your goal is to <br>kill as many people</br> as possible while staying alive. You may only <br>kill your targets</br>.
                    </li>
                    <li>
                        When your targets all die, you will get new targets.
                    </li>
                    <li>
                        You die when your assassin shoots you with an Avery Assassins water gun, with water landing <br>somewhere on your body</br>. Clothes count.
                    </li>
                    <li>
                        You may not use clothing or backpacks to defend against water. However, shields are permitted (e.g. cardboard box, umbrella).
                    </li>
                    <li>
                        If you shoot your assassin, they are rooted for 2 minutes; in the meantime, they cannot move. Each player can only be rooted once per day. <br>Both of you have to be in an unsafe zone</br>.
                    </li>
                </ul>

                Modifications to the guns are allowed, as long as the gun stays mostly original.
                This means that all of the parts that come with the gun must be used, but additional parts may be added.
                Specifically, these guns will leak if water is stored in them, so we will provide materials to modify them to be more water tight.

                <h3><em>Safe Zones</em></h3>
                You are not allowed to shoot someone inside a safe zone.
                <ul>
                    <li>
                        All residential rooms are safe zones, as well as lounges to prevent property damage.
                        You can shoot out of a doorway from a room, but you cannot shoot into that doorway.
                    </li>
                    <li>
                        All participants present in class, including PE, are safe.
                    </li>
                    <li>
                        Lecture halls are safe zones for obvious reasons, but the walk to and from class is fair game.
                        You also cannot target someone in a zoom lecture.
                    </li>
                    <li>Bathrooms are safe zones.</li>
                    <li>
                        The second floor gym in Braun, as well as the Braun basketball/racquetball courts, MPR, the Brown basketball gym and small gym, as well as the Barn are safe zones.
                    </li>
                    <li>
                        Indoor eating areas are safe, e.g. Red Door (1st floor only), indoor Browne, indoor Broad.
                    </li>
                    <li>
                        Do not target someone if it would cause property damage, e.g., if their laptop is out or they are working on a set on a piece of paper.
                        Common sense applies!
                    </li>
                    <li>
                        The Avery dining hall and lobby are safe zones. The hallway leading to the dining hall is <br>not safe</br>.
                    </li>
                    <li>
                        You absolutely <br>may not</br> physically restrain or move people.
                    </li>
                </ul>

                <h2>Assery Store (Round 2+ in Qualification)</h2>

                <br>Rank I</br> Store:
                <ul>
                    <li>
                        <br>(2)</br><u>Knowledge</u>: Uncover the nickname of a participant of your choice for the round.
                    </li>
                    <li>
                        <br>(3)</br><u>Pilfer</u>: Steal either the remaining points or power-ups from the next team you kill.
                    </li>
                    <li>
                        <br>(4)</br><u>Knowledge</u> &#123;II&#125;: Uncover the assassins of a random team.
                    </li>
                    <li>
                        <br>(5)</br><u>Immunity</u>: Guaranteed safety from a safe area to another, one-way trip. Time limit is 7 minutes. Must report in advance the starting and ending point.
                    </li>
                    <li>
                        <br>(5)</br><u>Concealment</u>: Hide all information about a kill.
                    </li>
                </ul>

                <br>Rank II</br> Store:
                <ul>
                    <li>
                        <br>(6)</br><u>??????????</u>: ??????????
                    </li>
                    <li>
                        <br>(7)</br><u>??????????</u> &#123;II&#125;: ??????????
                    </li>
                    <li>
                        <br>(8)</br><u>??????????</u> &#123;II&#125;: ??????????
                    </li>
                    <li>
                        <br>(8)</br><u>??????????</u> &#123;III&#125;: ??????????
                    </li>
                </ul>

                <br>Rank III</br> Store:
                <ul>
                    <li>
                        <br>(?)</br><u>??????????</u>: ??????????
                    </li>
                    <li>
                        <br>(?)</br><u>??????????</u> &#123;III&#125;: ??????????
                    </li>
                    <li>
                        <br>(?)</br><u>??????????</u>: ??????????
                    </li>
                </ul>
            </div>
        );
    }
}
