import React, {useEffect, useState} from "react";
import ElButton from "../components/ElButton";
import ElModal from "../components/ElModal";
import ElH2 from "../components/ElH2";
import ElH3 from "../components/ElH3";
import ElInput from "../components/ElInput";
import axios from "axios";
import {useRouter} from "next/router";

export default function Dashboard() {
    const router = useRouter();
    const [newLeagueOpen, setNewLeagueOpen] = useState<boolean>(false);
    const [name, setName] = useState<string>("");
    const [urlName, setUrlName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    const [newLeagueLoading, setNewLeagueLoading] = useState<boolean>(false);
    const [urlNameError, setUrlNameError] = useState<boolean>(false);
    const [urlNameNotUnique, setUrlNameNotUnique] = useState<boolean>(false);

    function onCreateLeague() {
        setNewLeagueLoading(true);

        axios.post("/api/league/new", {
            name: name,
            urlName: urlName,
            description: description || "",
        }).then(res => {
            if (res.data.notUnique) {
                setNewLeagueLoading(false);
                setUrlNameNotUnique(true);
            }
            else router.push(`/${urlName}`);
        }).catch(e => {
           console.log(e);
           setNewLeagueLoading(false);
        });
    }

    function onCancelCreateLeague() {
        setName("");
        setUrlName("");
        setDescription("");
        setNewLeagueOpen(false);
    }

    useEffect(() => {
        if (urlName !== encodeURIComponent(urlName) || urlName.includes("/") || ["dashboard", "signin", "about"].includes(urlName)) {
            setUrlNameError(true);
        } else {
            setUrlNameError(false);
        }
        setUrlNameNotUnique(false);
    }, [urlName]);

    return (
        <div className="max-w-4xl mx-auto px-4">
            <ElButton onClick={() => setNewLeagueOpen(true)}>
                New league
            </ElButton>
            <ElModal isOpen={newLeagueOpen} setIsOpen={setNewLeagueOpen}>
                <ElH2>New league</ElH2>
                <p className="my-2">Leagues left in your free plan: 1/1</p>
                <hr className="my-6"/>
                <ElH3>League name</ElH3>
                <ElInput value={name} setValue={setName} placeholder="Example House Ping Pong League"/>
                <hr className="my-6"/>
                <ElH3>League URL name</ElH3>
                <p className="my-2">Players will be able to view rankings and log games at this link.</p>
                <div className="flex items-center">
                    <p className="text-lg mr-1">eloleague.com/</p>
                    <ElInput value={urlName} setValue={setUrlName} placeholder="example-ping-pong"/>
                </div>
                {urlNameError && (
                    <p className="my-2 text-red-500">Invalid URL name</p>
                )}
                {urlNameNotUnique && (
                    <p className="my-2 text-red-500">URL name already taken</p>
                )}
                <hr className="my-6"/>
                <ElH3>League description (optional)</ElH3>
                <ElInput
                    value={description}
                    setValue={setDescription}
                    placeholder="Informal ping pong rankings for Example House"
                />
                <hr className="my-6"/>
                <ElButton onClick={onCreateLeague} isLoading={newLeagueLoading}>
                    Create
                </ElButton>
                <ElButton text={true} onClick={onCancelCreateLeague}>
                    Cancel
                </ElButton>
            </ElModal>
        </div>
    )
}


