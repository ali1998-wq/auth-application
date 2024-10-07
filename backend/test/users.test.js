const request = require("supertest");
const app = require("../utils/express/index");
const User = require("../models/users");
const Role = require("../models/roles");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { commonResponse } = require("../utils/response/response");
const {
  validateUserFields,
  validateLoginFields,
} = require("../utils/validators/fieldsValidator");
const { generateTokens } = require("../utils/common/generateTokens");

jest.mock("../models/users");
jest.mock("../models/roles");
jest.mock("../utils/response/response");
jest.mock("../utils/validators/fieldsValidator");
jest.mock("../utils/common/generateTokens");
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest
    .fn()
    .mockReturnValue({ role: "admin", id: "6700fa59ae12fbffa8cbdf71" }),
  sign: jest.fn().mockReturnValue("mockAccessToken"),
}));

//user registration test cases
describe("POST /api/register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and user data on successful registration", async () => {
    validateUserFields.mockReturnValue({});

    Role.findOne.mockResolvedValue({ _id: "roleId", name: "user" });

    User.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
      _id: "userId",
      status: "active",
    }));

    generateTokens.mockReturnValue({
      Token: "accessToken",
      RefreshTokens: "refreshToken",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "user",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if validation errors are present", async () => {
    validateUserFields.mockReturnValue({ email: "Invalid email" });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "invalid-email",
      password: "password",
      role: "user",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email");
  });

  it("should return 400 if role is not found", async () => {
    validateUserFields.mockReturnValue({});

    Role.findOne.mockResolvedValue(null);

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "invalid-role",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Role not found");
  });

  it("should return 500 if there is a server error", async () => {
    validateUserFields.mockReturnValue({});

    Role.findOne.mockRejectedValue(new Error("Database error"));

    const res = await request(app).post("/api/register").send({
      firstName: "John",
      lastName: "Doe",
      email: "john.doe@example.com",
      password: "password",
      role: "user",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Database error");
  });
});

//user login test cases
describe("POST /api/login", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and user data on successful login", async () => {
    validateLoginFields.mockReturnValue({});

    User.findOne
      .mockResolvedValue({
        _id: "userId", // Generate a new ObjectId
        email: "arianraja125@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(true), // Mock password comparison
        firstName: "Muhammad",
        lastName: "ALi",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "userId",
          email: "arianraja125@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(true),
          firstName: "Muhammad",
          lastName: "Ali",
          role: { _id: "roleId", name: "admin" },
          status: "unverified",
        }),
      }));

    generateTokens.mockReturnValue({
      Token: "accessToken",
      RefreshTokens: "refreshToken",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));
    const res = await request(app).post("/api/login").send({
      email: "arianraja125@gmail.com",
      password: "Journey!24",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if validation errors are present", async () => {
    validateLoginFields.mockReturnValue({ email: "Invalid email" });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/login").send({
      email: "invalid-email",
      password: "password",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid email");
  });

  it("should return 400 if user is not found", async () => {
    validateLoginFields.mockReturnValue({});

    User.findOne.mockResolvedValue(null).mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/login").send({
      email: "arianraja125@gmail.com",
      password: "Journey!24",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("User not found");
  });

  it("should return 400 if password is incorrect", async () => {
    validateLoginFields.mockReturnValue({});

    User.findOne
      .mockResolvedValue({
        _id: "userId", // Generate a new ObjectId
        email: "arianraja125@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(false), // Mock password comparison
        firstName: "Muhammad",
        lastName: "ALi",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "userId",
          email: "arianraja125@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(false),
          firstName: "Muhammad",
          lastName: "Ali",
          role: { _id: "roleId", name: "admin" },
          status: "unverified",
        }),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/login").send({
      email: "arianraja125@gmail.com",
      password: "Journey!24",
    });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.message).toBe("Invalid password");
  });

  it("should return 500 if there is a server error", async () => {
    validateLoginFields.mockReturnValue({});

    User.findOne
      .mockRejectedValue(new Error("Server error"))
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockRejectedValue(new Error("Server error")),
      }));

    const res = await request(app).post("/api/login").send({
      email: "arianraja125@gmail.com",
      password: "Journey!24",
    });

    expect(res.status).toBe(500);
    expect(res.body.message).toBe("Server error");
  });
});

//author access test cases
describe("PUT /api/author/access", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it("should return 200 and success message on successful role update", async () => {
    User.findOne
      .mockResolvedValue({
        _id: "67010a76674c3514094a6026",
        email: "arianraja126@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        firstName: "arira",
        lastName: "raja",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "67010a76674c3514094a6026",
          email: "arianraja126@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(true),
          firstName: "arira",
          lastName: "raja",
          status: "unverified",
          role: { _id: "roleId", name: "author" },
        }),
      }));

    User.updateOne.mockResolvedValue({
      _id: "67010a76674c3514094a6026",
      email: "arianraja126@gmail.com",
      comparePassword: jest.fn().mockResolvedValue(true),
      firstName: "arira",
      lastName: "raja",
      status: "verified",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .put("/api/author/access")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        id: "67010a76674c3514094a6026",
      });

    expect(res.body.message).toBe("Access granted successfully");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if user is not an author", async () => {
    User.findOne
      .mockResolvedValue({
        _id: "67010a76674c3514094a6026",
        email: "arianraja126@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        firstName: "arira",
        lastName: "raja",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "67010a76674c3514094a6026",
          email: "arianraja126@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(true),
          firstName: "arira",
          lastName: "raja",
          status: "unverified",
          role: { _id: "roleId", name: "admin" },
        }),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .put("/api/author/access")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        id: "67010a76674c3514094a6026",
      });

    expect(res.body.message).toBe("User is not an author");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 400 if user id is invalid", async () => {
    User.findOne
      .mockResolvedValue({
        _id: "67010a76674c3514094a6026",
        email: "arianraja126@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        firstName: "arira",
        lastName: "raja",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "67010a76674c3514094a6026",
          email: "arianraja126@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(true),
          firstName: "arira",
          lastName: "raja",
          status: "unverified",
          role: { _id: "roleId", name: "admin" },
        }),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .put("/api/author/access")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        id: "invalid-id",
      });

    expect(res.body.message).toBe("Invalid user id");
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
  });
});


//single user test cases
describe("GET /api/user/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and user data on successful user fetch", async () => {
    User.findOne
      .mockResolvedValue({
        _id: "67010a76674c3514094a6026",
        email: "arianraja126@gmail.com",
        comparePassword: jest.fn().mockResolvedValue(true),
        firstName: "arira",
        lastName: "raja",
        status: "unverified",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "67010a76674c3514094a6026",
          email: "arianraja126@gmail.com",
          comparePassword: jest.fn().mockResolvedValue(true),
          firstName: "arira",
          lastName: "raja",
          status: "unverified",
          role: { _id: "roleId", name: "admin" },
        }),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .get("/api/user/67010a76674c3514094a6026")
      .set("Authorization",`Bearer mock AccessToken`);
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if user is not found", async () => {
    User.findOne.mockResolvedValue(null);

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .get("/api/user/inValidId")
      .set("Authorization", `Bearer mockAccessToken`);

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

});
