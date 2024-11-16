
const Employee = require('./models/Employee'); 
const User = require ('./models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    listEmployees: async (_, { filter, sortBy, sortDirection = 'asc', page = 1, limit = 10 }) => {
      const query = filter ? { name: new RegExp(filter, 'i') } : {};
      const employees = await Employee.find(query)
        .sort({ [sortBy]: sortDirection === 'asc' ? 1 : -1 })
        .skip((page - 1) * limit)
        .limit(limit);
      return employees;
    },
    getEmployee: async (_, { id }) => {
      return Employee.findById(id);
    }
  },
  Mutation: {
    addEmployee: async (_,{ name, age, class: className, subjects, attendance },context) => {
        if(context.user)
        {
            if(context.user.role=='admin')
                {
                    const employee = new Employee({ name, age, class: className, subjects, attendance });
                    return employee.save();
                }
        }   
            throw new Error("UnAuthorized");
        
     
    },
    updateEmployee: async (_, { id, name, age, class: className, subjects, attendance }) => {
      return Employee.findByIdAndUpdate(id, { name, age, class: className, subjects, attendance }, { new: true });
    },

    login: async (_, { username, password }) => {
        const user = await User.findOne({ username });
        if (!user || !user.isValidPassword(password)) {
          throw new Error('Invalid credentials');
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: `${process.env.JWT_EXPIRY}` });
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
          
          return await newUser.save();
        }
  }
};

module.exports = resolvers;
