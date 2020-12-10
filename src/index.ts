const express = require('express');
const axios = require('axios');

const app = express();
const port = 4000;
const addr = 'http://0.0.0.0:8080'


const getOpeningSlot = async (date, ressourceId)=> {
    let data = undefined
    await axios.get(`${addr}/timetables?date=${date}&resourceId=${resourceId}`)
        .then((response) => {
            data = response.data
        })
        .catch((err) => {
            data = undefined
        })
    return data
}

const getReservationSlots = async (date, resourceId)=> {
    let data= undefined
    await axios.get(`${addr}/reservations?date=${date}&resourceId=${resourceId}`)
        .then((response) => {
            data = response.data
        })
        .catch((err) => {
            data = undefined
        })
    return data
}

app.get('/avaible', async (req, res, next) => {
    let date= req.query.date;
    let resourceId = req.query.resourceId;
    const open = await getOpeningSlot(date, resourceId)
    if (open === undefined)
        return res.status(500).send("ERROR")
    const timetables = open.timetables
    let isOpen = false
    timetables.array.forEach(result => {
        let opening = result.opening.split("/");
        let closing = result.closing.split("/");
        let visit = date.split("/");

        var from = new Date(opening[0], parseInt(opening[1]) - 1, opening[2]);  // -1 because months are from 0 to 11
        var to = new Date(closing[0], parseInt(closing[1]) - 1,closing[2]);
        var check = new Date(visit[0], parseInt(visit[1]) - 1, visit[2]);
        if (from < check && check < to){
            isOpen = true;
        }
    });
    return res.status(200).send(reservation)
})



app.listen(port, () => {
    console.log(`server started at http://localhost:${port}`);
});