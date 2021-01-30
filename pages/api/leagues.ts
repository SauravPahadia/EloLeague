export default function handler(req, res) {
    const uid = req.query.uid
    
    res.status(200).json({
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
    });
}