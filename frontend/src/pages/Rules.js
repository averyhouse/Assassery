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

                There will be three qualification rounds, starting January 25.

                <h3><em>Phase 2: Playoffs</em></h3>

                After the qualification rounds, the top 8 teams will be matched up in a bracket, and will now face off head on. <br></br>
                After 48 hours, the team with more kills will move on while the other is eliminated. <br></br>
                Ties will be broken via a duel at high noon in Avery courtyard. <br></br>
                The finals will be only a duel.

                <h2>Technical Rules</h2>

                If water touches the target, they are eliminated. The honor code applies here. If you were hit, you should admit it.
                <blockquote>
                    <em>Note:</em> Blocking is allowed, but you can only block with something that is not clothing, a backpack, or something else you would normally have on you.
                    The shield must be carried for the sole purpose of blocking, e.g., carrying an umbrella on a sunny day. Exercise good judgement.
                </blockquote>

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
                        Lecture halls are safe zones for obvious reasons, but the walk to and from class is fair game.
                        You also cannot target someone in a zoom lecture.
                    </li>
                    <li>Bathrooms are safe zones.</li>
                    <li>
                        You are not safe while eating at Hameetman, etc.
                    </li>
                    <li>
                        Do not target someone if it would cause property damage, e.g., if their laptop is out or they are working on a set on a piece of paper.
                        Common sense applies!
                    </li>
                    <li>
                        The Avery dining hall and lobby are safe zones.
                    </li>
                    <li>
                        You absolutely may not physically restrain or move people.
                    </li>
                </ul>
            </div>
        );
    }
}
