const Permission = require("../models/permissions");
const { commonResponse } = require("../utils/response/response");
const {
  validatePermissionFields,
} = require("../utils/validators/fieldsValidator");
const Content=require("../models/content");
const Roles=require("../models/roles");

jest.mock("../utils/response/response");
jest.mock("../utils/validators/fieldsValidator");
jest.mock("../models/permissions");
jest.mock("../models/content");
jest.mock("../models/roles");
jest.mock("jsonwebtoken", () => ({
  ...jest.requireActual("jsonwebtoken"),
  verify: jest
    .fn()
    .mockReturnValue({ role: "author", id: "6700fa59ae12fbffa8cbdf71" }),
  sign: jest.fn().mockReturnValue("mockAccessToken"),
}));

// Test for addPermission controller
describe("POST /api/permission/add", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if validation errors exist", async () => {
    const req = {
      body: {
        name: "permission1",
        content: "content1",
        usersWithAccess: ["user1"],
        groupsWithAccess: ["group1"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    validatePermissionFields.mockReturnValue({ name: "name is required" });
    await Permission.findOne.mockResolvedValue(null);

    await require("../controllers/permissions").addPermission(req, res);

    expect(validatePermissionFields).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("name is required", false)
    );
  });

  it("should return 400 if permission already exists", async () => {
    const req = {
      body: {
        name: "permission1",
        content: "content1",
        usersWithAccess: ["user1"],
        groupsWithAccess: ["group1"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    validatePermissionFields.mockReturnValue({});
    await Permission.findOne.mockResolvedValue({});

    await require("../controllers/permissions").addPermission(req, res);

    expect(validatePermissionFields).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Permission already exists", false)
    );
  });

  it("should return 500 if error occurs", async () => {
    const req = {
      body: {
        name: "permission1",
        content: "content1",
        usersWithAccess: ["user1"],
        groupsWithAccess: ["group1"],
      },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    validatePermissionFields.mockReturnValue({});
    await Permission.findOne.mockRejectedValue(new Error("mock error"));

    await require("../controllers/permissions").addPermission(req, res);

    expect(validatePermissionFields).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(commonResponse("mock error", false));
  });

    it("should return 201 if permission is created", async () => {
        const req = {
        body: {
            name: "permission1",
            content: "content1",
            usersWithAccess: ["user1"],
            groupsWithAccess: ["group1"],
        },
        };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
        validatePermissionFields.mockReturnValue({});
        await Permission.findOne.mockResolvedValue(null);
        await Permission.mockReturnValue({
            save: jest.fn().mockResolvedValue({ _id: "6701662ecf6145c145208fb2" }),
        });
        await Content.findOneAndUpdate.mockResolvedValue({});
        await Roles.updateMany.mockResolvedValue({});
    
        await require("../controllers/permissions").addPermission(req, res);
    
        expect(validatePermissionFields).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(
        commonResponse("Permission created successfully", true, {
            _id: "6701662ecf6145c145208fb2",
        })
        );
    });
});

// Test for permissionByContent api
describe("GET /api/permission/:content", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if content is not provided", async () => {
    const req = {
      params: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await require("../controllers/permissions").permissionByContent(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Content is required", false)
    );
  });

  it("should return 500 if error occurs", async () => {
    const req = {
      params: { content: "content1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await Permission.findOne.mockRejectedValue(new Error("mock error"));

    await require("../controllers/permissions").permissionByContent(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(commonResponse("mock error", false));
  });

  it("should return 200 if permission is found", async () => {
    const req = {
      params: { content: "content1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await Permission.findOne.mockResolvedValue({});

    await require("../controllers/permissions").permissionByContent(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Permission found", true, {})
    );
  });
});

// Test for updatePermission api
describe("PUT /api/permission/update", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if permission id is not provided", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await require("../controllers/permissions").updatePermission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Permission id is required", false)
    );
  });

  it("should return 500 if error occurs", async () => {
    const req = {
      body: { id: "permission1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await Permission.findOneAndUpdate.mockRejectedValue(new Error("mock error"));

    await require("../controllers/permissions").updatePermission(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(commonResponse("mock error", false));
  });

  it("should return 200 if permission is updated", async () => {
    const req = {
      body: { id: "6701662ecf6145c145208fb2" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await Permission.findOneAndUpdate.mockResolvedValue({});

    await require("../controllers/permissions").updatePermission(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Permission updated successfully", true, {})
    );
  });
});

// Test for deletePermission api
describe("POST /api/permission/delete", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 400 if permission id is not provided", async () => {
    const req = {
      body: {},
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    await require("../controllers/permissions").deletePermission(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith(
      commonResponse("Permission id is required", false)
    );
  });

  it("should return 500 if error occurs", async () => {
    const req = {
      body: { id: "permission1" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    await Permission.findOneAndDelete.mockRejectedValue(new Error("mock error"));

    await require("../controllers/permissions").deletePermission(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(commonResponse("mock error", false));
  });

    it("should return 200 if permission is deleted", async () => {
        const req = {
        body: { id: "6701662ecf6145c145208fb2" },
        };
        const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
        };
        await Permission.findOneAndDelete.mockResolvedValue({});
        await Content.findOneAndUpdate.mockResolvedValue({});
        await Roles.updateMany.mockResolvedValue({});
    
        await require("../controllers/permissions").deletePermission(req, res);
    
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(
        commonResponse("Permission deleted successfully", true)
        );
    });

});
