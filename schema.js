const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Employee {
    id: ID!
    name: String!
    age: Int
    class: String
    subjects: [String]
    attendance: Float
  }
    enum Role {
    admin
    employee
  }
  type User {
  id: ID!
  username: String!
  role: Role!
}
  type AuthResponse {
  token: String!
  role: Role!
}

  type Query {
    listEmployees(filter: String, sortBy: String, sortDirection: String, page: Int, limit: Int): [Employee]
    getEmployee(id: ID!): Employee
  }

  type Mutation {
    addEmployee(name: String!, age: Int!, class: String, subjects: [String], attendance: Float!): Employee
    updateEmployee(id: ID!, name: String, age: Int, class: String, subjects: [String], attendance: Float): Employee
    login(username: String!, password: String!): AuthResponse
    register(username: String!, password: String!, role: Role!): User    
  }
`;

module.exports = typeDefs;
