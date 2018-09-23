const History = require('../models').History;

const generateDate = async function (req, res) {
    let data = req.body;
    let number = data.number;

    let docs = [];

    for (let k = 0; k < number; k++) {
        const entryNumber = getRandomInt(1, 6);
        const exitNumber = getRandomInt(1, 6);

        let names = [];
        let faces = [];

        for (let i = 0; i < entryNumber; i++) {
            names.push('Person');
            faces.push('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');
        }

        let images = [];

        for (let j = 0; j < exitNumber; j++) {
            images.push('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');
        }

        let history = {
            entry: [],
            exit: []
        };

        switch (getRandomInt(1, 3)) {
            case 1:
                for (let i = 0; i < entryNumber; i++) {
                    history.entry.push({
                        names: names,
                        faces: faces,
                        date: Date.now()
                    });
                }
                break;
            case 2:
                for (let i = 0; i < exitNumber; i++) {
                    history.exit.push({
                        images: images,
                        date: Date.now()
                    });
                }
                break;
        }
        docs.push(history);
    }
    [err, result] = await to(History.create(docs));
    
    if (err) return ReE(res, { message: 'An error has occured '});

    else return ReS(res, { message: 'Documents created '});

};
module.exports.generateDate = generateDate;