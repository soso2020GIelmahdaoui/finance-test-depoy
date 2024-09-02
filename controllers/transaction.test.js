const Transaction = require('../models/detailsTransaction');
const User = require('../models/user');

const {getCurrentMonthTransactions,addTransaction,updateTransaction,deleteTransaction}=require('./transaction');

const mockReq={
    user:{
        userId:'66b23696e2c03817190c58bd',
    }
}
const mockTransaction={_id:'66b23696e2c03817190c58bd',transaction:"AUU",montant:221};

const response=()=>{
    return {
        status:jest.fn().mockReturnThis(),
        json:jest.fn().mockReturnThis()
    }
}
const mockUser={
_id:"66b23696e2c03817190c58bd",
email:"hamza.hossani.001@gmail.com",
password: "$2a$10$dbeUYPpAO53LL5pCC.wx5eyVBPOax2mivnEngGM9vikhwyL/Vj9ky",
newsletter:false,
detailsTransactionID:[{_id:'66b23696e2c03817190c58bd',transaction:"AUU"}],
save:jest.fn().mockResolvedValueOnce(true)
}

describe("afficher les transactions",()=>{
it('should be get all transactions ',async()=>{
jest.spyOn(Transaction,'find').mockResolvedValueOnce([mockTransaction])
const mockRes=response();
await getCurrentMonthTransactions(mockReq,mockRes);
expect(mockRes.status).toHaveBeenCalledWith(200);
expect(mockRes.json).toHaveBeenCalledWith([mockTransaction]);

})

})

describe("creation transaction",()=>{
    it('should be create  transaction ',async()=>{
        const req={...mockReq,body:{montant:222, categorie:"electrique",transaction:"AUU"}};

    jest.spyOn(Transaction,'create').mockResolvedValueOnce(mockTransaction)
    // jest.spyOn(User,'findById').mockResolvedValueOnce(mockUser)

    jest.spyOn(User,'findById').mockResolvedValueOnce(mockUser).mockImplementationOnce(()=>({
        detailsTransactionID:jest.fn().mockImplementationOnce(()=>({
            push:jest.fn().mockResolvedValueOnce()
        }))
    }))
    const mockRes=response();
    await addTransaction(req,mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(201);
    expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    })
 
    })

    
describe("update transaction",()=>{
    it('should be updated ',async()=>{
        const req={...mockReq,params:{transactionId:'66b23696e2c03817190c58bd'},body:{montant:222, categorie:"electrique",transaction:"AUU"}};

    jest.spyOn(Transaction,'findById').mockResolvedValueOnce(mockTransaction);
    jest.spyOn(Transaction,'findByIdAndUpdate').mockResolvedValueOnce(mockTransaction);
    const mockRes=response();
    await updateTransaction(req,mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(200);
    expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
    })

    })

    describe("delete transaction",()=>{
        it('should not be found',async()=>{
            const req={...mockReq,params:{transactionId:'77b23696e2c03817190c58bd'}};
            jest.spyOn(Transaction,'findByIdAndDelete').mockResolvedValueOnce(false);
            const mockRes=response();
            await deleteTransaction(req,mockRes);
            expect(mockRes.status).toHaveBeenCalledWith(400);
            expect(mockRes.json).toHaveBeenCalledWith({message:"transaction non trouvé"});
        })

        it('should be deleted ',async()=>{
            const req={...mockReq,params:{transactionId:'66b23696e2c03817190c58bd'},body:{montant:222, categorie:"electrique",transaction:"AUU"}};
    
        jest.spyOn(Transaction,'findByIdAndDelete').mockResolvedValueOnce(mockTransaction);
        const mockRes=response();
        await deleteTransaction(req,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith(mockTransaction);
        })
    
        })