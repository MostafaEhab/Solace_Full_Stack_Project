const UserModel = require("../src/models/user");

const users = [
    new UserModel({
        email: 'user1@test.com',
        // password: "dontpwnme4" after Hash (SHA-256).
        password: '4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b',
        firstName: 'user1',
        lastName: 'test',
        dateOfBirth: new Date(1995, 12, 1),
    }),
    new UserModel({
        email: 'user2@test.com',
        password: '4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b',
        firstName: 'user2',
        lastName: 'test',
        dateOfBirth: new Date(1994, 12, 1),
    }),
    new UserModel({
        email: 'user3@test.com',
        password: '4420d1918bbcf7686defdf9560bb5087d20076de5f77b7cb4c3b40bf46ec428b',
        firstName: 'user3',
        lastName: 'test',
        dateOfBirth: new Date(1996, 12, 1),
    }),
];

const seed = async () => {
    const count  = await UserModel.countDocuments();
    if (count === 0) {
        await UserModel.create(users);
        console.log('Dummy users seeded successfully.');
    }
}

module.exports = {
    seed,
}