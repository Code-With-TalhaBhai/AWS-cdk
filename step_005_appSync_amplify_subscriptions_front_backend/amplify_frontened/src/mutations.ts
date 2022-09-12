/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getDemoById = /* GraphQL */ `
  mutation GetDemoById($id: String!) {
    getDemoById(id: $id) {
      id
      version
    }
  }
`;
export const addDemo = /* GraphQL */ `
  mutation AddDemo($DemoInput: DemoInput!) {
    addDemo(DemoInput: $DemoInput) {
      id
      version
    }
  }
`;
export const updateDemo = /* GraphQL */ `
  mutation UpdateDemo($input: DemoUpdate!) {
    updateDemo(input: $input) {
      id
      version
    }
  }
`;
export const deleteDemo = /* GraphQL */ `
  mutation DeleteDemo($id: String!) {
    deleteDemo(id: $id)
  }
`;
