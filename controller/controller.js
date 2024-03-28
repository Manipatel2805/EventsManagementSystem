const { ModelEventsLoad, ModelEventsFind } = require("../model/model")


exports.ControlEventsLoad=async (req, res) => {
    try{
        const data=await ModelEventsLoad(req.body)
        res.status(201).json(data); 
        res.status("successfully entered")
    }catch (err){
        console.error(err);
        res.status(500).json({ error:'Internal Server Error'}); 
    }
};

exports.ControlEventsFind = async (req, res) => {
    try {
        const { latitude, longitude, date} = req.body;
        const page=req.query.page
        console.log(page)
        const end = new Date(date);
        end.setDate(end.getDate()+14);
        const endDate = end.toISOString().substring(0, 10);

        const events = await ModelEventsFind(latitude, longitude, date,endDate,page);
        res.status(200).json(events);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Internal Server Error" });
    }
};
