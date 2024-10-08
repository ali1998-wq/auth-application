# auth-application

#About APP
This application is a role-based content management system built on the MRN stack (MongoDB, React, Node.js) that facilitates user authentication and content creation for three distinct roles: normal users, admins, and authors. Normal users can register, log in, and browse or purchase content created by verified authors. Authors, once approved by an admin, can create and publish various types of content, such as articles, novels, or digests, and have the ability to grant access to specific content for particular groups of users. Admins oversee the application, managing user roles and ensuring that authors are properly verified before they can publish their work.

The application utilizes MongoDB as its database to handle user management and content storage effectively. User information, including roles and authentication details, is stored in a dedicated users collection, while published content is managed in a separate content collection. The backend, developed with Node.js, exposes RESTful APIs that facilitate interaction between the frontend and the database, ensuring secure CRUD operations. The React-based frontend provides a dynamic user interface, allowing users to engage with the application according to their roles while maintaining a seamless user experience.

#mongoDb Schemas
1) user:  firstName, lastName, email, password, role, status, purchasedContent
2) role: name
3) content: title, description, body, author, amount, type, permission
4) permission: name, content, usersWithAccess, groupsWithAccess
5) purchase: user, content, author, purchase date, status, amount
6) notifications: authorId, contentId, buyerId, message, isRead

#Start application
1) run npm install (forntend + backend)
2) run npm start (bakcend)
3) run npm dev (fronted)
4) .env file is not included

#run-tests
1) npm run test (frontend and backend)


 
