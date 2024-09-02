const bcrypt = require('bcryptjs');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const {signin,login}=require('./auth');
const Profile = require('../models/profile');

const mockUser={
    _id:'66b23696e2c03817190c58bd',
    email: 'idder@gmail.ma',
 password: 'fillrouge',
 newsletter:false,
 detailsTransactionID:[]
}

// const mockJwt=jest.fn(()=> 'token');
const mockProfile=
    { nom:'mdidech', prenom:'hamza',userId:'66b23696e2c03817190c58bd' }

const mockRequest=()=>{
    return {
        body:{
            email:'idder@gmail.ma', password:'fillrouge', nom:'mdidech', prenom:'hamza'
        }
    }
}
const response=()=>{
    return {
        status:jest.fn().mockReturnThis(),
        json:jest.fn().mockReturnThis()
    }
}
afterEach(() => {
    jest.restoreAllMocks();
    });

describe('signin user', () => {
    it('should signin users', async () => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('passwordHashed')
        jest.spyOn(User,'create').mockResolvedValueOnce(mockUser);
        jest.spyOn(Profile,'create').mockResolvedValueOnce(mockProfile);
        jest.spyOn(jwt,'sign').mockResolvedValueOnce('token');
        const mockReq=mockRequest();
        const mockRes=response();
        await signin(mockReq,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({email:mockUser.email,token:'token'});

    });
    it('should validation error',async()=>{
        const mockReq=mockRequest().body={body:{
        }}
        const mockRes=response();
        await signin(mockReq,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({message:'Empty email or password'});

    })
    it('existing email',async()=>{
        const mockReq=mockRequest();
        const mockRes=response();
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('passwordHashed')
        jest.spyOn(User,'create').mockRejectedValueOnce(mockUser);
        await signin(mockReq,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({message: 'Erreur lors de la création de compte'});
    })
  });


describe('login user', () => {
    it('should validation error',async()=>{
        const mockReq=mockRequest().body={body:{
        }}
        const mockRes=response();
        await login(mockReq,mockRes);
        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({message:'Empty email or password'});

    })

it('should not found', async ()=>{
    const mockReq=mockRequest().body={body:{email:'hamzahamza@gmail.com',password:'test1234'}};
  jest.spyOn(User,'findOne').mockResolvedValueOnce(null);
  const mockRes=response();
  await login(mockReq,mockRes);
  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({message: 'Utilisateur non trouvé'});});

  it('should be invalid password',async()=>{
    const mockReq=mockRequest().body={body:{email:'user@login.ma',password:'test'}};
    jest.spyOn(User,'findOne').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt,'compare').mockResolvedValueOnce(false);
  const mockRes=response();
  await login(mockReq,mockRes);
  expect(mockRes.status).toHaveBeenCalledWith(400);
  expect(mockRes.json).toHaveBeenCalledWith({message: 'Mot de passe incorrect' });})

it('should be loged',async()=>{
    const mockReq=mockRequest().body={body:{email:'user@login.ma',password:'test'}};
    jest.spyOn(User,'findOne').mockResolvedValueOnce(mockUser);
    jest.spyOn(bcrypt,'compare').mockResolvedValueOnce(true);
    jest.spyOn(jwt,'sign').mockResolvedValueOnce('token');
  const mockRes=response();
  await login(mockReq,mockRes);
     expect(mockRes.status).toHaveBeenCalledWith(200);
     expect(mockRes.json).toHaveBeenCalledWith({email:mockUser.email,token:'token'});
})
it('should be catched',async()=>{
    const mockReq=mockRequest().body={};
    const mockRes=response();
    await login(mockReq,mockRes);
    expect(mockRes.status).toHaveBeenCalledWith(500);
    expect(mockRes.json).toHaveBeenCalledWith({message:'Erreur lors du login'});
})
  });