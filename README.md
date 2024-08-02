# CollabU

CollabU is a collaborative platform built with React, designed to help students create and manage project groups, share files, and engage in discussions. It also features future plans for teacher monitoring and student insights.

## Features

- **User Authentication**: 
  - Students can sign up with their details (firstname, lastname, email, intake year and month, password).
  - Registered users can log in using their email and password.

- **Group Management**:
  - Users can create or join groups based on their selected intake year and month.
  - Each student can belong to only one group at a time.
  - Group details include project name, description, and member list.

- **Real-time Discussions**:
  - Group members can participate in discussions through a real-time chat interface.
  - The discussion page displays project details and a chat section for communication.
  - A "Jump to" button allows users to quickly scroll to the bottom of the chat.

- **File Sharing**:
  - Users can share files within their groups.
  - The file sharing page allows users to add files by providing a file name and link.
  - Shared files are displayed in a folder icon format, and clicking a folder redirects to the file link in a new tab.

- **Upcoming Features**:
  - **Teacher Section**: A feature for teachers to monitor group progress and student performance.
  - **Insights Section**: A section to track student contributions and engagement in projects.

## Table of Contents

- [Getting Started](#getting-started)
- [Installation](#installation)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Getting Started

To access and use CollabU, follow these steps:

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (Node package manager, comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/excel-asaph/CollabU.git
   cd CollabU
   
2. Install dependencies:

  ```bash
  npm install
  ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Access the application:
   - Open [http://localhost:3000](http://localhost:3000) to view it in your browser
   - You should see the application running

## Usage

1. **Create an account**:
   - Click on the "Sign Up" button.
   - Fill in the required information and submit.

2. **Log in to the application**:
   - Enter your registered email and password.
   - Click on the "Login" button.

3. **Explore the application features**:
   - **Homepage**: 
     - HomeHeader: Displays the current page and a dropdown for navigation.
     - My Group: Shows student's group information or allows creating/joining a group.
     - All Groups: Lists all groups based on the student's intake year and month.

   - **Group Features**:
     - Students can create or join groups based on their selected intake year and month.
     - Each student can belong to only one group at a time.
     - Group details include project name, description, and member list.

   - **Discussions**:
     - Group members can participate in discussions through a real-time chat interface.

   - **File Sharing**:
     - Students can upload and share files in real-time with group members.
       
For more detailed information on each feature, please refer to the [Documentation](link-to-documentation).


## Contributing

This section should outline the guidelines for contributing to the project, including how to report issues, submit feature requests, and submit pull requests.

```markdown
## Contributing

We welcome contributions from the community! If you would like to contribute to this project, please follow these guidelines:

### Reporting Issues

If you encounter any bugs, issues, or have suggestions for improvements, please [create a new issue](link-to-issue-tracker) in our issue tracker. When reporting an issue, provide a clear and concise description of the problem, along with steps to reproduce it.

### Submitting Feature Requests

If you have an idea for a new feature or enhancement, please [submit a feature request](link-to-issue-tracker) in our issue tracker. Describe the feature in detail, including its purpose and expected behavior.
```

### Submitting Pull Requests

1. **Fork the repository**.

2. **Create a new branch for your feature or bug fix**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   
3. Make your changes and commit them:
  ```bash
  git commit -m "Add your commit message"
  ```

4. Push your changes to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

5. Open a new pull request in the main repository

6. Provide a clear description of your changes and the problem they solve

7. Reference any related issues or feature requests

We will review your pull request and provide feedback or merge it if it meets the project's standards and guidelines.

Thank you for your contributions!

## License

This project is licensed under the [MIT License](LICENSE).
