const request = require("supertest");
const app = require("../app");

const mongoose = require("mongoose");

const { DB_HOST } = process.env;

describe("Testing signUp controller", () => {
  beforeEach(async () => {
    await mongoose.connect(DB_HOST);
  });
  afterEach(async () => {
    await mongoose.connection.close();
  });

  test("Its should return status 200", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "Stich1@gmail.com",
      password: "1234567",
    });
    console.log(response.body.token);
    expect(response.statusCode).toBe(200);
  });

  test("Shoul be token", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "Stich1@gmail.com",
      password: "1234567",
    });

    expect(response.body.token).toBeDefined();
  });

  test("Shold be `User={ email: String,  subscription: String }`", async () => {
    const response = await request(app).post("/api/users/login").send({
      email: "Stich1@gmail.com",
      password: "1234567",
    });
    expect(response.body.user).toEqual({
      email: expect.any(String),
      subscription: expect.any(String),
    });
  });
});
