const Purchases=require('../models/purchases');
const User=require('../models/users');
const {commonResponse}=require('../utils/response/response');
const {validatePaymentFields}=require('../utils/validators/fieldsValidator');

jest.mock('../utils/response/response');
jest.mock('../utils/validators/fieldsValidator');
jest.mock('../models/purchases');
jest.mock('../models/users');
jest.mock("jsonwebtoken", () => ({
    ...jest.requireActual("jsonwebtoken"),
    verify: jest
      .fn()
      .mockReturnValue({ role: "author", id: "6700fa59ae12fbffa8cbdf71" }),
    sign: jest.fn().mockReturnValue("mockAccessToken"),
}));

// Test for makePayment controller
describe('Test for make payment controller',()=>{
    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('should return 400 if validation errors exist',async()=>{
        const req={
            body:{
                content:'content1',
                user:'user1',
                amount:100,
                author:'author1'
            }
        };
        const res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        };
        validatePaymentFields.mockReturnValue({content:'content is required'});
        await Purchases.findOne.mockResolvedValue(null);

        await require('../controllers/purchses').makePayment(req,res);

        expect(validatePaymentFields).toHaveBeenCalledWith(req.body);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith(commonResponse('content is required',false));
    });

    //200 
    it('should return 201 if purchase is created successfully',async()=>{
        const req={
            body:{
                content:'content1',
                user:'6700fa59ae12fbffa8cbdf71',
                amount:100,
                author:'author1'
            }
        };
        const res={
            status:jest.fn().mockReturnThis(),
            json:jest.fn()
        };
        validatePaymentFields.mockReturnValue({});
        await Purchases.findOne.mockResolvedValue(null);
        await User.findOneAndUpdate.mockResolvedValue(null);
    
        await require('../controllers/purchses').makePayment(req,res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(commonResponse('Payment made successfully',true,expect.any(Object)));
    }
    );

});

