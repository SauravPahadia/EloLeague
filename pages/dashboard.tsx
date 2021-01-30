import React, { useEffect, useState } from 'react';
import {GetServerSideProps} from "next";
import {getSession} from "next-auth/client";
import SignInButton from "../components/SignInButton";
import useSWR from "swr";
import Modal from 'react-modal';

const fetcher = (url) => {
    return {
        leagues: [
            { 
                name: "Maple Hall Dorm", 
                code: "ACXDET", 
                numPlayers: 10, 
                lastGamePlayed: new Date(), 
            }, 
            {
                name: "Edyfi", 
                code: "QQEOKD", 
                numPlayers: 14, 
                lastGamePlayed: new Date(), 
            }, 
            {
                name: "Farmington Nationals", 
                code: "LP39AS", 
                numPlayers: 4, 
                lastGamePlayed: new Date(), 
            }
        ]
    }
}

export default function Dashboard() {
    const user = {uid: "asdf"} // replace with session information
    const { data, error} = useSWR(`/api/leagues/${user.uid}`, fetcher);
    const [modalIsOpen,setIsOpen] = useState(false);
    
    const customStyles = {
        content: {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)',
            width                 : '50%'
        }
    }

    return (
        <div  className="flex justify-center content-center">
            <button onClick={() => setIsOpen(true)}>Open Modal</button>
            <Modal
            isOpen={modalIsOpen}
            onRequestClose={() => setIsOpen(false)}
            style={customStyles}
            contentLabel="Example Modal"
            >
            <div className="flex justify-between">
                <h2 className="font-bold">Create New League</h2>
                <button onClick={() => setIsOpen(false)}>close</button>
            </div>
            <form onSubmit={() => {}}>
                <input type="text" placeholder="Enter League Name Here" />
                <br />
                <input type="number" placeholder="Enter Number of Players Here" />
                <br />
                <button>Create New League</button>
            </form>
            </Modal>
            <table> 
                <tr>
                    <th>League Name</th>
                    <th>Code</th>
                    <th>Number of Players</th>
                    <th>Last Game Played</th>
                </tr>
                {data && data.leagues.map(league => {
                    return (
                        <tr>
                            <td>{league.name}</td>
                            <td>{league.code}</td>
                            <td>{league.numPlayers}</td>
                            <td>{league.lastGamePlayed.toDateString()}</td>
                        </tr>
                    );
                })}
            </table>
        </div>
    );
}


