const MongoClient = require('mongodb').MongoClient;
const faker = require('faker');
const url = 'mongodb://localhost:27017';
const dbName = 'cinema_db';
const nbFilms = 1000;

MongoClient.connect(url, { useUnifiedTopology: true }, async (err, client) => {
    if (err) throw err;
    const db = client.db(dbName);
    const films = db.collection('films');

    for (let i = 0; i < nbFilms; i++) {
        const acteurs = [];
        for (let j = 0; j < 3; j++) {
            acteurs.push({
                nom: faker.name.findName(),
                role: faker.lorem.word()
            });
        }

        const film = {
            titre: faker.lorem.words(),
            annee: faker.date.past().getFullYear(),
            realisateur: faker.name.findName(),
            acteurs: acteurs
        };

        await films.insertOne(film);

        
        if (i % 1000 === 0) {
            console.log(`Inserted ${i} films`);
        }
    }

    console.log(`Inserted ${nbFilms} films`);
    client.close();
});


