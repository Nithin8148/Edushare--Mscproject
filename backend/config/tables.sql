CREATE TABLE documents (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    filePath VARCHAR(255) NOT NULL,
    resourceType VARCHAR(50),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id) 
);

CREATE TABLE files (
    id INT NOT NULL AUTO_INCREMENT,
    fileName VARCHAR(255),
    filePath VARCHAR(255),
    file VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

CREATE TABLE resources_accessed (
    access_id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    document_id INT,
    accessed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (access_id),
    FOREIGN KEY (user_id) REFERENCES users(id), 
    FOREIGN KEY (document_id) REFERENCES documents(id) 
);

CREATE TABLE savedDocuments (
    id INT NOT NULL AUTO_INCREMENT,
    userId INT,
    documentId INT,
    savedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY userId (userId),
    KEY documentId (documentId)
);

CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    profilePicture VARCHAR(255),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id)
);

<!-- for frontend open index.html on live server and for backend cd backend, npm install, npm start --!>