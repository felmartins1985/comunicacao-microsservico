import userRepository from "../repository/userRepository";
import * as httpStatus from "../../../config/constants/httpStatus"
import UserException from "../exception/UserException";
import bcrypt from "bcrypt";
import jsonwebtoken from "jsonwebtoken";
import * as secrets from "../../../config/constants/secrets";
class UserService{
  async findByEmail(req){
    try{
      const {email} = req.params;
      const {authUser} = req;
      this.validateRequestData(email);
      let user = await userRepository.findByEmail(email);
      this.validateUserNotFound(user);
      this.validateAuthenticatedUser(user, authUser);
      return {
        status: httpStatus.SUCCESS,
        user:{
          id: user.id,
          name: user.name,
          email: user.email,
        }
      }
    } catch (err){
      return {
        status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message
      }
    }
  }
  validateRequestData(email){
    if(!email){
      throw new UserException(httpStatus.BAD_REQUEST,"Email é obrigatório");
    }
  }
  validateUserNotFound(user){
    if(!user){
      throw new UserException(httpStatus.NOT_FOUND,"Usuário não encontrado");
    }
  }
  validateAuthenticatedUser(user, authUser){
    if(!authUser || user.id !== authUser.id){
      throw new UserException(httpStatus.FORBIDDEN,"You cannot see this user data.");
    }
  }
  async getAccessToken (req){
    try{
      const {email, password} = req.body;
      this.validateAccessToken(email, password);
      let user = await userRepository.findByEmail(email);
      this.validateUserNotFound(user);
      this.validatePassword(password, user.password);
      const authUser = {
        id: user.id,
        name: user.name,
        email: user.email
      };
      const accessToken = jsonwebtoken.sign({authUser}, secrets.API_SECRET, { expiresIn: '1d' });
      return {
        status: httpStatus.SUCCESS,
        accessToken: accessToken,
      }
    }catch (err){
      return {
        status: err.status ? err.status : httpStatus.INTERNAL_SERVER_ERROR,
        message: err.message
      }
    }

  };
  validateAccessToken(email, password){
    if(!email ||!password){
      throw new UserException(httpStatus.UNAUTHORIZED,"Email and password must be informed");
    }
  };
  async validatePassword(password, hashPassword){
    if(!(await bcrypt.compare(password, hashPassword))){
      throw new UserException(httpStatus.UNAUTHORIZED,"Password does not match");
    }
  }
}

export default new UserService();