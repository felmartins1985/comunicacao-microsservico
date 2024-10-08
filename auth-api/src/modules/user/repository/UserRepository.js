import User from "../model/User";

class UserRepository {
  async findById(id) {
    try{
      return await User.findOne({where:{id}});
    } catch (err){
      console.error("Error finding user by id:", err.message);
      return null;
    }
  }
  async findByEmail(email) {
    try{
      return await User.findOne({ where: { email } });
    } catch (err){
      console.error("Error finding user by email:", err.message);
      return null;
    }
  }
}

export default new UserRepository();