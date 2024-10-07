const request = require("supertest");
const app = require("../utils/express/index");
const Content = require("../models/content");
const { commonResponse } = require("../utils/response/response");
const {
  validateContentFields,
} = require("../utils/validators/fieldsValidator");

jest.mock("../models/content");
jest.mock("../utils/response/response");
jest.mock("../utils/validators/fieldsValidator");
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest
    .fn()
    .mockReturnValue({ role: "author", id: "6700fa59ae12fbffa8cbdf71" }),
  sign: jest.fn().mockReturnValue("mockAccessToken"),
}));

// Test for POST /api/content/add
describe("POST /api/content/add", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and content data on successful content creation", async () => {
    validateContentFields.mockImplementation(() => ({}));
    Content.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(true),
      _id: "contentId",
      title: "title",
      description: "description",
      body: "body",
      amount: 100,
      type: "article",
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .post("/api/content/add")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        title: "title",
        description: "description",
        body: "body",
        amount: 100,
        type: "article",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
  });

  it("should return 400 if validation errors are present", async () => {
    validateContentFields.mockImplementation(() => ({
      title: "Title is required",
    }));
    Content.mockImplementation(() => ({
      save: jest.fn().mockResolvedValue(false),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .post("/api/content/add")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        title: "",
        description: "description",
        body: "body",
        amount: 100,
        type: "article",
      });

    expect(res.statusCode).toBe(400);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    validateContentFields.mockImplementation(() => ({}));
    Content.mockImplementation(() => ({
      save: jest.fn().mockRejectedValue(new Error("Server error")),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .post("/api/content/add")
      .set("Authorization", `Bearer mockAccessToken`)
      .send({
        title: "title",
        description: "description",
        body: "body",
        amount: 100,
        type: "article",
      });

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for GET /api/content/:id
describe("GET /api/content/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and content data on successful fetch", async () => {
    Content.findOne
      .mockResolvedValue({
        _id: "contentId",
        title: "title",
        description: "description",
        body: "body",
        amount: 100,
        type: "article",
      })
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockResolvedValue({
          _id: "contentId",
          title: "title",
          description: "description",
          body: "body",
          amount: 100,
          type: "article",
          permission: {
            _id: "permissionId",
            name: "author",
          },
        }),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .get("/api/content/contentId")
      .set("Authorization", `Bearer mockAccessToken`);

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
  });

  it("should return 404 if content is not found", async () => {
    Content.findOne.mockResolvedValue(null).mockImplementationOnce(() => ({
      populate: jest.fn().mockResolvedValue(null),
    }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .get("/api/content/contentId")
      .set("Authorization", `Bearer mockAccessToken`);

    expect(res.statusCode).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("should return 500 if server error occurs", async () => {
    Content.findOne
      .mockRejectedValue(new Error("Server error"))
      .mockImplementationOnce(() => ({
        populate: jest.fn().mockRejectedValue(new Error("Server error")),
      }));

    commonResponse.mockImplementation((message, success, data) => ({
      message,
      success,
      data,
    }));

    const res = await request(app)
      .get("/api/content/contentId")
      .set("Authorization", `Bearer mockAccessToken`);

    expect(res.statusCode).toBe(500);
    expect(res.body.success).toBe(false);
  });
});

// Test for PUT /api/content/update
describe("PUT /api/content/update", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("should return 200 and updated content data on successful update", async () => {
        Content.findOneAndUpdate.mockResolvedValue({
            _id: "contentId",
            title: "title",
            description: "description",
            body: "body",
            amount: 100,
            type: "article",
        });
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .put("/api/content/update")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "contentId",
                title: "title",
                description: "description",
                body: "body",
                amount: 100,
                type: "article",
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should return 400 if content id is invalid", async () => {
        Content.findOneAndUpdate.mockResolvedValue(null);
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .put("/api/content/update")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "contentId",
                title: "title",
                description: "description",
                body: "body",
                amount: 100,
                type: "article",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 500 if server error occurs", async () => {
        Content.findOneAndUpdate.mockRejectedValue(new Error("Server error"));
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .put("/api/content/update")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "contentId",
                title: "title",
                description: "description",
                body: "body",
                amount: 100,
                type: "article",
            });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

// Test for DELETE /api/content/delete
describe("POST /api/content/delete", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("should return 200 and deleted content data on successful delete", async () => {
        Content.findOneAndDelete.mockResolvedValue({
            _id: "contentId",
            title: "title",
            description: "description",
            body: "body",
            amount: 100,
            type: "article",
        });
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .post("/api/content/delete")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "6701563fcf33acfe4d861d25",
            });
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should return 400 if content id is invalid", async () => {
        Content.findOneAndDelete.mockResolvedValue(null);
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .post("/api/content/delete")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "contentId",
            });
        expect(res.statusCode).toBe(400);
        expect(res.body.success).toBe(false);
    });

    it("should return 500 if server error occurs", async () => {
        Content.findOneAndDelete.mockRejectedValue(new Error("Server error"));
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .post("/api/content/delete")
            .set("Authorization", `Bearer mockAccessToken`)
            .send({
                id: "contentId",
            });
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});

// Test for GET /api/content/author/:author
describe("GET /api/content/author/:author", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    
    it("should return 200 and contents by author", async () => {
        Content.find.mockResolvedValue([
            {
                _id: "contentId",
                title: "title",
                description: "description",
                body: "body",
                amount: 100,
                type: "article",
            },
        ]);
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .get("/api/content/author/6700fa59ae12fbffa8cbdf71")
            .set("Authorization", `Bearer mockAccessToken`);
        expect(res.statusCode).toBe(200);
        expect(res.body.success).toBe(true);
    });

    it("should return 404 if no content is found", async () => {
        Content.find.mockResolvedValue([]);
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .get("/api/content/author/6700fa59ae12fbffa8cbdf71")
            .set("Authorization", `Bearer mockAccessToken`);
        expect(res.statusCode).toBe(404);
        expect(res.body.success).toBe(false);
    });

    it("should return 500 if server error occurs", async () => {
        Content.find.mockRejectedValue(new Error("Server error"));
        commonResponse.mockImplementation((message, success, data) => ({
            message,
            success,
            data,
        }));
        const res = await request(app)
            .get("/api/content/author/6700fa59ae12fbffa8cbdf71")
            .set("Authorization", `Bearer mockAccessToken`);
        expect(res.statusCode).toBe(500);
        expect(res.body.success).toBe(false);
    });
});