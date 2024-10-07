const request = require("supertest");
const app = require("../utils/express/index");
const Role = require("../models/roles");
const { commonResponse } = require("../utils/response/response");

jest.mock("../models/roles");
jest.mock("../utils/response/response");

// Test for POST /api/role/add
describe("POST /api/role/add", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and role data on successful role creation", async () => {
    Role.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
      _id: "roleId",
      name: "admin",
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/add").send({
      name: "admin",
    });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if validation errors are present", async () => {
    Role.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(false),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/add").send({
      name: "",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Role.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Server error")),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/add").send({
      name: "admin",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for GET /api/role/:id
describe("GET /api/role/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and role data on successful role fetch", async () => {
    Role.findOne.mockResolvedValue({
      _id: "roleId",
      name: "admin",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).get("/api/role/roleId");

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if invalid role id is provided", async () => {
    Role.findOne.mockResolvedValue(null);

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).get("/api/role/invalidId");

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Role.findOne.mockRejectedValue(new Error("Server error"));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).get("/api/role/roleId");

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for GET /api/role/all
describe("GET /api/role/all", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and all roles data on successful fetch", async () => {
    Role.find.mockResolvedValue([
      {
        _id: "roleId",
        name: "admin",
      },
    ]);
    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));
    const res = await request(app).get("/api/role/all");
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 if no roles are found", async () => {
    Role.find.mockResolvedValue([]);
    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));
    const res = await request(app).get("/api/role/all");
    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Role.find.mockRejectedValue(new Error("Server error"));
    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));
    const res = await request(app).get("/api/role/all");
    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for PUT /api/role/update
describe("PUT /api/role/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and updated role data on successful role update", async () => {
    Role.findOneAndUpdate.mockResolvedValue({
      _id: "roleId",
      name: "admin",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).put("/api/role/update").send({
      id: "roleId",
      permissions: ["read"],
      name: "admin",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if invalid role id is provided", async () => {
    Role.findOneAndUpdate.mockResolvedValue(null);

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).put("/api/role/update").send({
      id: "invalidId",
      permissions: ["read"],
      name: "admin",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Role.findOneAndUpdate.mockRejectedValue(new Error("Server error"));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).put("/api/role/update").send({
      id: "roleId",
      permissions: ["read"],
      name: "admin",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for POST /api/role/delete
describe("POST /api/role/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and success message on successful role deletion", async () => {
    Role.findOneAndDelete.mockResolvedValue({
      _id: "roleId",
      name: "admin",
    });

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/delete").send({
      id: "roleId",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if invalid role id is provided", async () => {
    Role.findOneAndDelete.mockResolvedValue(null);

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/delete").send({
      id: "invalidId",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Role.findOneAndDelete.mockRejectedValue(new Error("Server error"));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app).post("/api/role/delete").send({
      id: "roleId",
    });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});