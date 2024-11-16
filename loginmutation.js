const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('./models/user');

const resolvers = {
  Mutation: {
    login: async (_, { username, password }) => {
      const user = await User.findOne({ username });
      if (!user || !user.isValidPassword(password)) {
        throw new Error('Invalid credentials');
      }
      const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
      return { token, role: user.role };
    },
    
    register: async (_, { username, password, role }) => {
        // Check if the username already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
          throw new Error('Username already exists');
        }
  
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
  
        // Create a new user
        const newUser = new User({
          username,
          password: hashedPassword,
          role, // Assign the role provided in the input
        });
  
        // Save the user to the database
        const savedUser = await newUser.save();
  
        // Generate a token
        const token = jwt.sign(
          { id: savedUser._id, role: savedUser.role },
          process.env.JWT_SECRET,
          { expiresIn: '1h' }
        );
  
        return { token, role: savedUser.role };
      }
  }
};
module.exports=resolvers;